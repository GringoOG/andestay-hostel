<?php
/**
 * Upgrade payatproperty to 1.1.4 — small PS_LOGO_MAIL + force logo size on every mail.
 *
 * @param PayAtProperty $module
 *
 * @return bool
 */
function upgrade_module_1_1_4($module)
{
    if (!is_object($module)) {
        return false;
    }

    $module->registerHook('actionEmailAddAfterContent');

    if (method_exists($module, 'installMailLogo')) {
        $module->installMailLogo();
    }
    if (method_exists($module, 'installMailTemplates')) {
        $module->installMailTemplates();
    }

    return true;
}
