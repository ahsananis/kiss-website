<?php

$config = [];

if (getenv('CONTACT_TO_EMAIL')) {
    $config['toEmail'] = getenv('CONTACT_TO_EMAIL');
}

$request = Craft::$app->request;

if (
    !$request->getIsConsoleRequest() &&
    ($toEmail = $request->getValidatedBodyParam('toEmail')) !== null
) {
    $config['toEmail'] = $toEmail;
}

if (
    !$request->getIsConsoleRequest() &&
    ($successFlashMessage = $request->getValidatedBodyParam('notice')) !== null
) {
    $config['successFlashMessage'] = $successFlashMessage;
}

return $config;
