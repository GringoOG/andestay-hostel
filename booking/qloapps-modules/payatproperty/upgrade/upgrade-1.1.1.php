<?php
/**
 * Upgrade payatproperty to 1.1.1 — sync responsive order_conf + logo-safe mails.
 *
 * @param PayAtProperty $module
 *
 * @return bool
 */
function upgrade_module_1_1_1($module)
{
    if (is_object($module) && method_exists($module, 'installMailTemplates')) {
        $module->installMailTemplates();
    }

    return true;
}
