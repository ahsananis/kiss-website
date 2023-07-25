<?php
namespace modules;

use Craft;
use craft\contactform\Mailer;
use craft\contactform\events\SendEvent;
use craft\contactform\models\Submission;
use craft\elements\Entry;
use craft\events\ElementEvent;
use craft\helpers\ElementHelper;
use craft\services\Elements;
use yii\base\Event;

use aelvan\mailchimpsubscribe\MailchimpSubscribe;

use enupal\stripe\Stripe;
use enupal\stripe\services\Orders;
use enupal\stripe\events\OrderCompleteEvent;

class KiSSModule extends \yii\base\Module
{
    public function init()
    {
        // Set a @modules alias pointed to the modules/ directory
        Craft::setAlias('@modules', __DIR__);

        // Set the controllerNamespace based on whether this is a console or web request
        if (Craft::$app->getRequest()->getIsConsoleRequest()) {
            $this->controllerNamespace = 'modules\\console\\controllers';
        } else {
            $this->controllerNamespace = 'modules\\controllers';
        }

        parent::init();

        $this->syncProductsWithPaymentForms();

        $this->populateGiftAidFieldForDonations();

        $request = Craft::$app->request;

        // If this isn't a form for the Form Module
        if (
            !$request->getIsConsoleRequest() &&
            $request->getBodyParam('formId') === null
        ) {
            $this->validateFromName();
            $this->validateMessage();
            $this->joinMailingListFromContactForm();
        }
    }

    private function syncProductsWithPaymentForms()
    {
        $config = Craft::$app->config->general->products;

        Event::on(
            Elements::class,
            Elements::EVENT_AFTER_SAVE_ELEMENT,
            function (ElementEvent $event) use ($config) {
                if ($event->element instanceof Entry) {  
                    $entry = $event->element;

                    if (ElementHelper::isDraftOrRevision($entry) || $entry->sectionId != $config['sectionId']) {
                        return;
                    }

                    $handle = $config['paymentFormHandlePrefix'] . $entry->id;

                    $paymentForm = Stripe::$app->paymentForms->getPaymentFormBySku($handle);

                    if (is_null($paymentForm)) {
                        $paymentForm = Stripe::$app->paymentForms->createNewPaymentForm();

                        $fields['handle'] = $handle;
                        $fields['enableShippingAddress'] = 1;
                        $fields['enableBillingAddress'] = 1;
                        $fields['verifyZip'] = 1;
                        $fields['returnUrl'] = '/shop/checkout/confirmation?number={number}';
                        $fields['buttonClass'] = 'btn btn-yellow';
                        $fields['logoImage'] = ['220'];
                    }

                    $fields['companyName'] = Craft::$app->getSites()->getCurrentSite()->name;
                    $fields['name'] = $entry->title;
                    $fields['amount'] = Stripe::$app->paymentForms->getAmountAsFloat($entry->price);

                    $paymentForm->setAttributes($fields, false);

                    if (!Stripe::$app->paymentForms->savePaymentForm($paymentForm)) {
                        Craft::$app->getSession()->setError(Stripe::t('Couldn’t save payment form.'));
                    }
                }
            }
        );

        Event::on(
            Elements::class,
            Elements::EVENT_AFTER_DELETE_ELEMENT,
            function (ElementEvent $event) use ($config) {
                if ($event->element instanceof Entry) {  
                    $entry = $event->element;

                    if ($entry->sectionId != $config['sectionId']) {
                        return;
                    }

                    $handle = $config['paymentFormHandlePrefix'] . $entry->id;

                    $paymentForm = Stripe::$app->paymentForms->getPaymentFormBySku($handle);

                    if ($paymentForm) {
                        Stripe::$app->paymentForms->deletePaymentForm($paymentForm);
                    }
                }
            }
        );
    }

    private function populateGiftAidFieldForDonations()
    {
        Event::on(Orders::class, Orders::EVENT_AFTER_ORDER_COMPLETE, function(OrderCompleteEvent $e) {
            $order = $e->order;
            $paymentForm = $order->getPaymentForm();

            $variants = json_decode($order->variants, true);

            if (!in_array($paymentForm->handle, Craft::$app->config->general->donationFormHandles)) {
                return;
            }

            $isEligibleForGiftAid = ($order->isSubscription === true && !array_key_exists('sourceType', $variants)) || $variants['sourceType'] === 'personal';
            $hasGiftAid = array_key_exists('giftAid', $variants) && is_array($variants['giftAid']) && in_array('true', $variants['giftAid']);

            if (!$isEligibleForGiftAid || ($isEligibleForGiftAid && !$hasGiftAid)) {
                $variants['giftAid'] = ['false'];

                $order->variants = json_encode($variants);

                Stripe::$app->orders->saveOrder($order, false);
            }
         });
    }

    private function validateFromName()
    {
        Event::on(Submission::class, Submission::EVENT_AFTER_VALIDATE, function(Event $e) {
            /** @var Submission $submission */
            $submission = $e->sender;
            
            // Make sure that `fromName` was filled in
            if (empty($submission->fromName)) {
                // Add the error
                // (This will be accessible via `message.getErrors('fromName')` in the template.)
                $submission->addError('fromName', 'Your Name cannot be blank.');
            }
        });
    }

    private function validateMessage()
    {
        Event::on(Submission::class, Submission::EVENT_AFTER_VALIDATE, function(Event $e) {
            /** @var Submission $submission */
            $submission = $e->sender;
            
            // Make sure that `message[body]` was filled in
            if (empty($submission->message['body'])) {
                // Add the error
                // (This will be accessible via `message.getErrors('message.body')` in the template.)
                $submission->addError('message.body', 'Your Message cannot be blank.');
            }
        });
    }

    private function joinMailingListFromContactForm()
    {
        Event::on(Submission::class, Submission::EVENT_AFTER_VALIDATE, function(Event $e) {
            /** @var Submission $submission */
            $submission = $e->sender;

            if (isset($submission->message['subscribe']) && ($submission->message['subscribe'] == 1 || $submission->message['subscribe'] == 'true')) {
                // Make sure that `message[relationship]` was filled in
                if (empty($submission->message['relationship'])) {
                    // Add the error
                    // (This will be accessible via `message.getErrors('message.relationship')` in the template.)
                    $submission->addError('message.relationship', 'How do you know KiSS? cannot be blank.');
                }
            }
        });

        Event::on(Mailer::class, Mailer::EVENT_AFTER_SEND, function(SendEvent $e) {
            /** @var Submission $submission */
            $submission = $e->submission;

            // Check if the user is subscribing to the mailing list
            if (isset($submission->message['subscribe']) && ($submission->message['subscribe'] == 1 || $submission->message['subscribe'] == 'true')) {
                $email = $submission->fromEmail;
                $formListId = '';
                $emailType = 'html';
                $vars = ['RELATIONSHIP' => $submission->message['relationship']];
                $relationship = $submission->message['relationship'];

                MailchimpSubscribe::$plugin->mailchimpSubscribe->subscribe($email, $formListId, $emailType, $vars);
            }
        });
    }
}
