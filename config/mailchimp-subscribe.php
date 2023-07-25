<?php

return [
    'apiKey' => env('MAILCHIMP_API_KEY'),
    'audienceId' => env('MAILCHIMP_AUDIENCE_ID'),
    'doubleOptIn' => env('MAILCHIMP_DOUBLE_OPT_IN', true),
];
