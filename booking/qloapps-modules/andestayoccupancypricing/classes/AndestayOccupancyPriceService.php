<?php
/**
 * Applies solo (1 adult / 0 children) overnight price via actionRoomTypeTotalPriceModifier.
 *
 * Safety rules (multi-room):
 * - Cart/order paths call getRoomTypeTotalPrice once per physical room with
 *   occupancy = [ [adults, children, child_ages] ] → quantity = 1.
 * - Search/product paths may pass N occupancy rows; quantity = count(occupancy).
 *   Solo override is applied only when EVERY row is exactly 1 adult / 0 children.
 *   Mixed occupancy in one call → no-op (leave core price).
 * - Missing / unusable occupancy → no-op (never invent 55).
 */

if (!defined('_PS_VERSION_')) {
    exit;
}

class AndestayOccupancyPriceService
{
    /** @var AndeStayOccupancyPricing */
    protected $module;

    /** @var AndestayOccupancyPricingRepository */
    protected $repository;

    public function __construct(AndeStayOccupancyPricing $module)
    {
        $this->module = $module;
        $this->repository = new AndestayOccupancyPricingRepository();
    }

    /**
     * @param array $params Hook params from actionRoomTypeTotalPriceModifier
     */
    public function applySoloOverride(array &$params)
    {
        if (!(int) Configuration::get(AndeStayOccupancyPricing::CONFIG_ENABLED)) {
            return;
        }

        if (!isset($params['total_prices']) || !is_array($params['total_prices'])) {
            return;
        }

        $idProduct = isset($params['id_room_type']) ? (int) $params['id_room_type'] : 0;
        if ($idProduct <= 0) {
            return;
        }

        $rule = $this->repository->getActiveSoloRule($idProduct);
        if (!$rule) {
            $this->log('skip_no_active_rule', array('id_product' => $idProduct));

            return;
        }

        $occupancy = isset($params['occupancy']) ? $params['occupancy'] : null;
        if (!$this->isEligibleSoloOccupancy($occupancy)) {
            $this->log('skip_occupancy_not_solo', array(
                'id_product' => $idProduct,
                'occupancy_type' => gettype($occupancy),
                'occupancy_count' => is_array($occupancy) ? count($occupancy) : null,
            ));

            return;
        }

        $dateFrom = isset($params['date_from']) ? $params['date_from'] : null;
        $dateTo = isset($params['date_to']) ? $params['date_to'] : null;
        if (!$dateFrom || !$dateTo) {
            return;
        }

        $nights = (int) HotelHelper::getNumberOfDays($dateFrom, $dateTo);
        if ($nights < 1) {
            $nights = 1;
        }

        // price_te is stored in the shop DEFAULT currency (AndeStay: PEN).
        // getRoomTypeTotalPrice builds $total_prices in the CURRENT context currency
        // (Product::getPriceStatic already ran Tools::convertPrice). Hook therefore
        // runs AFTER currency conversion of core prices — we must convert solo too.
        $priceTePerNightDefault = (float) $rule['price_te'];
        if ($priceTePerNightDefault < 0) {
            $this->log('skip_invalid_price', array('id_product' => $idProduct));

            return;
        }

        $idCurrency = isset($params['id_currency'])
            ? (int) $params['id_currency']
            : (int) Configuration::get('PS_CURRENCY_DEFAULT');

        // Same utility as feature-price fixed impacts in HotelRoomTypeFeaturePricing.
        $priceTePerNight = Tools::convertPrice($priceTePerNightDefault, $idCurrency);
        $taxRate = isset($params['tax_rate']) ? (float) $params['tax_rate'] : 0.0;
        // tax_rate on the hook is derived from productPriceTI/TE (already in context currency).
        $priceTiPerNight = $priceTePerNight * (1 + ($taxRate / 100));

        // ONE room over the stay. Core may still × $quantity after the hook.
        $params['total_prices']['total_price_tax_excl'] = $priceTePerNight * $nights;
        $params['total_prices']['total_price_tax_incl'] = $priceTiPerNight * $nights;

        $this->log('applied_solo', array(
            'id_product' => $idProduct,
            'nights' => $nights,
            'price_te_night_default_currency' => $priceTePerNightDefault,
            'id_currency' => $idCurrency,
            'price_te_night_context' => $priceTePerNight,
            'tax_rate' => $taxRate,
            'price_te_stay_one_room' => $params['total_prices']['total_price_tax_excl'],
            'price_ti_stay_one_room' => $params['total_prices']['total_price_tax_incl'],
            'quantity_param' => isset($params['quantity']) ? $params['quantity'] : null,
            'id_room' => isset($params['id_room']) ? (int) $params['id_room'] : 0,
        ));
    }

    /**
     * Solo eligible when occupancy unambiguously means every priced unit is 1A/0C.
     *
     * @param mixed $occupancy
     *
     * @return bool
     */
    public function isEligibleSoloOccupancy($occupancy)
    {
        if (!is_array($occupancy) || !count($occupancy)) {
            return false;
        }

        foreach ($occupancy as $row) {
            if (!is_array($row)) {
                return false;
            }
            if (!isset($row['adults']) || !isset($row['children'])) {
                return false;
            }
            if ((int) $row['adults'] !== 1 || (int) $row['children'] !== 0) {
                return false;
            }
        }

        return true;
    }

    /**
     * @param string $event
     * @param array $context
     */
    protected function log($event, array $context = array())
    {
        if (!(int) Configuration::get(AndeStayOccupancyPricing::CONFIG_DEBUG)) {
            return;
        }
        if (!class_exists('PrestaShopLogger')) {
            return;
        }

        PrestaShopLogger::addLog(
            'andestayoccupancypricing:'.$event.' '.json_encode($context),
            1,
            null,
            'AndeStayOccupancyPricing',
            null,
            true
        );
    }
}
