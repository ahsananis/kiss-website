<?php
namespace modules;

use Craft;
use craft\contactform\models\Submission;
use yii\base\Event;

class FormModule extends \yii\base\Module
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

        $this->setup();
    }

    private function setup()
    {
        Event::on(Submission::class, Submission::EVENT_AFTER_VALIDATE, function(Event $e) {
            $request = Craft::$app->request;

            if (
                !$request->getIsConsoleRequest() &&
                ($formId = $request->getValidatedBodyParam('formId')) !== null
            ) {
                $form = $this->getForm($formId);

                if (!$form) {
                    return;
                }

                /** @var Submission $submission */
                $submission = $e->sender;

                $requiredFields = $this->getRequiredFields($form);

                foreach ($requiredFields as $requiredField) {
                    if (empty($submission->message[$requiredField])) {
                        $submission->addError("message.{$requiredField}", "{$requiredField} cannot be blank.");
                    }
                }

                $submission->subject = "New form submission for: {$form->title}";
            }
        });
    }

    private function getForm($id)
    {
        return Craft::$app->entries->getEntryById($id);
    }

    private function getRequiredFields($formEntry)
    {
        $formFields = $formEntry->fieldBlocks->all();

        $requiredFields = [];
        foreach ($formFields as $formField) {
            if (isset($formField->required) && $formField->required == true) {
                $requiredFields[] = $formField->label;
            }
        }

        return $requiredFields;
    }
}
