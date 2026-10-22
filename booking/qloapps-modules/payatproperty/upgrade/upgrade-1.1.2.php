<?php
/**
 * Upgrade payatproperty to 1.1.2 — stacked booking detail mail partials.
 *
 * @param PayAtProperty $module
 *
 * @return bool
 */
function upgrade_module_1_1_2($module)
{
    if (is_object($module) && method_exists($module, 'installMailTemplates')) {
        $module->installMailTemplates();
    }

    return true;
}
