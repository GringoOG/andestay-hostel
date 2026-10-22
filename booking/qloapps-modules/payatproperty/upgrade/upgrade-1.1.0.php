<?php
/**
 * Upgrade payatproperty to 1.1.0 — add booking notification email config.
 *
 * @param Module $module
 *
 * @return bool
 */
function upgrade_module_1_1_0($module)
{
    unset($module);

    if (Configuration::get('PAYATPROPERTY_NOTIFICATION_EMAIL') === false
        || Configuration::get('PAYATPROPERTY_NOTIFICATION_EMAIL') === null
    ) {
        Configuration::updateValue(
            'PAYATPROPERTY_NOTIFICATION_EMAIL',
            'andestayhostel@gmail.com'
        );
    }

    return true;
}
