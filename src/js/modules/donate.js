import jQuery from 'jquery/dist/jquery.slim'
window.jQuery = jQuery

require('../../../vendor/enupal/stripe/src/resources/stripe/src/js/enupal-stripe-elements.js')

export default class Donate {
  constructor() {
    this.init()
  }

  init() {
    var $presetAmounts = $('[data-kiss-amount="preset"]'),
        $customAmount = $('[data-kiss-amount="custom"]');

    var $sourceTypes = $('div.sourceType input[type="radio"]'),
        $giftAidOptIn = $('[data-gift-aid="opt-in"]'),
        giftAidMultiplyer = $giftAidOptIn.data('gift-aid-multiplyer'),
        currencySymbol = $giftAidOptIn.data('currency-symbol');

    var $giftAidDonation = $('[data-gift-aid="donation"]'),
        $giftAidTransform = $('[data-gift-aid="transform"]');

    function financial(x) {
        return Number.parseFloat(x).toFixed(2);
    }

    function updatePresets(amount) {
        var $radio = $presetAmounts.filter('[value="' + amount + '"]');

        $presetAmounts.prop('checked', false);

        if ($radio.length == 1) {
            $radio.prop('checked', true);
        }

        updateGiftAid(amount);
    }

    function updateCustomAmount(amount) {
        $('[data-kiss-amount="custom"]').val(amount);
        updateGiftAid(amount);
    }

    function updateGiftAid(amount) {
        $giftAidDonation.text(currencySymbol + amount.replace(/\.00$/,''));
        $giftAidTransform.text(currencySymbol + financial(amount * giftAidMultiplyer).replace(/\.00$/, ''));
    }

    $presetAmounts.change(function() {
        var amount = $(this).val();
        updateCustomAmount(amount);
    });

    $customAmount.keyup(function() {
        var amount = $(this).val();
        updatePresets(financial(amount));
    });

    $customAmount.focusout(function() {
        var $input = $(this),
            amount = financial($input.val());
        
        $input.val(amount);
        updatePresets(amount);
    });

    $sourceTypes.change(function() {
        var source = $sourceTypes.filter(':checked').val();
        
        if (source == 'personal') {
            $giftAidOptIn.removeClass('hidden');
        } else {
            $giftAidOptIn.addClass('hidden');
        }
    });

    /* Overrides your stripe elements styles */
    var enupalStyleOverrides = {
        base: {
            color: '#222',
            lineHeight: null,
            fontFamily: 'system-ui, BlinkMacSystemFont, -apple-system, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': {
                color: '#aab7c4'
            }
        },
        invalid: {
            color: '#e3342f',
            iconColor: '#e3342f'
        }
    };
  }
}
