<?php
/**
 * Upgrade to 1.0.1 — add 2-adult default price config.
 * Existing 1.0.0 solo rules and table schema are preserved.
 *
 * @param AndeStayOccupancyPricing $module
 *
 * @return bool
 */
function upgrade_module_1_0_1($module)
{
    if (!Configuration::hasKey(AndeStayOccupancyPricing::CONFIG_DEFAULT_DUAL_PRICE)) {
        Configuration::updateValue(
            AndeStayOccupancyPricing::CONFIG_DEFAULT_DUAL_PRICE,
            AndeStayOccupancyPricing::DEFAULT_DUAL_PRICE_TE
        );
    }

    // Ensure hook remains registered after upgrade/reupload.
    if (!$module->isRegisteredInHook('actionRoomTypeTotalPriceModifier')) {
        $module->registerHook('actionRoomTypeTotalPriceModifier');
    }

    return true;
}
