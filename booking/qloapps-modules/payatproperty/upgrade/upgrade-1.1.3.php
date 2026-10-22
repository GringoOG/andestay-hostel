<?php
/**
 * Upgrade payatproperty to 1.1.3 — force-sync stacked mail templates + smaller logo.
 *
 * @param PayAtProperty $module
 *
 * @return bool
 */
function upgrade_module_1_1_3($module)
{
    return $module->installMailTemplates();
}
