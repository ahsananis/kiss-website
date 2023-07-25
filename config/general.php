<?php
/**
 * General Configuration
 *
 * All of your system's general configuration settings go in here. You can see a
 * list of the available settings in vendor/craftcms/cms/src/config/GeneralConfig.php.
 *
 * @see \craft\config\GeneralConfig
 */

return [
    // Global settings
    '*' => [
        // Default Week Start Day (0 = Sunday, 1 = Monday...)
        'defaultWeekStartDay' => 1,

        // Whether generated URLs should omit "index.php"
        'omitScriptNameInUrls' => true,

        // Control Panel trigger word
        'cpTrigger' => 'cms-admin',

        // The secure key Craft will use for hashing and encrypting data
        'securityKey' => getenv('SECURITY_KEY'),

        // Whether to save the project config out to config/project.yaml
        // (see https://docs.craftcms.com/v3/project-config.html)
        'useProjectConfigFile' => false,

        'pageTrigger' => '?page',

        'screens' => [
            'sm' => '(min-width: 576px)',
            'md' => '(min-width: 768px)',
            'lg' => '(min-width: 992px)',
            'xl' => '(min-width: 1200px)',
        ],

        'donationTemplates' => [
            ['type' => 'monthly', 'values' => [5, 10, 30]],
            ['type' => 'single', 'values' => [15, 50, 100]],
        ],

        'sponsorAChildTemplate' => [6, 10, 15],
        
        'sponsorTheCommunityTemplate' => [6, 10, 15],

        'plyrAspectRatios' => [
            'ratio21by9' => '21:9',
            'ratio16by9' => '16:9',
            'ratio4by3' => '4:3',
        ],

        'googleAnalyticsTrackingId' => getenv('GOOGLE_ANALYTICS_TRACKING_ID'),

        'picPullerUserId' => 190,

        'giftAidMultiplyer' => 1.25,

        'donationFormHandles' => ['monthlyDonation', 'oneTimeDonation', 'sponsorAChild'],

        'products' => [
            'sectionId' => 10,
            'paymentFormHandlePrefix' => 'product',
        ],
    ],

    // Dev environment settings
    'dev' => [
        // Dev Mode (see https://craftcms.com/guides/what-dev-mode-does)
        'devMode' => true,
    ],

    // Staging environment settings
    'staging' => [
        // Prevent administrative changes from being made on staging
        'allowAdminChanges' => false,
    ],

    // Production environment settings
    'production' => [
        // Prevent administrative changes from being made on production
        'allowAdminChanges' => false,
    ],
];
