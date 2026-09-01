<?php
/**
 * Offline unit tests for occupancy pricing (1.0.1 matrix).
 * Run: php tests/OccupancyPriceServiceTest.php
 */

define('_PS_VERSION_', '1.7.0.0');

if (!class_exists('Configuration')) {
    class Configuration
    {
        public static $data = array();

        public static function get($key)
        {
            return isset(self::$data[$key]) ? self::$data[$key] : false;
        }

        public static function updateValue($key, $value)
        {
            self::$data[$key] = $value;

            return true;
        }
    }
}

if (!class_exists('Currency')) {
    class Currency
    {
        public $id;
        public $conversion_rate;

        public function __construct($id, $rate)
        {
            $this->id = (int) $id;
            $this->conversion_rate = (float) $rate;
        }

        public static function getCurrencyInstance($id)
        {
            static $map = null;
            if ($map === null) {
                $map = array(
                    1 => new Currency(1, 1.0),
                    2 => new Currency(2, 0.27),
                );
            }

            return isset($map[(int) $id]) ? $map[(int) $id] : $map[1];
        }
    }
}

if (!class_exists('Context')) {
    class Context
    {
        public $currency;

        public static function getContext()
        {
            static $ctx = null;
            if ($ctx === null) {
                $ctx = new Context();
                $ctx->currency = Currency::getCurrencyInstance(1);
            }

            return $ctx;
        }
    }
}

if (!class_exists('Tools')) {
    class Tools
    {
        public static function convertPrice($price, $currency = null, $to_currency = true, $context = null)
        {
            $defaultCurrency = (int) Configuration::get('PS_CURRENCY_DEFAULT');
            if ($currency === null) {
                $currency = Context::getContext()->currency;
            } elseif (is_numeric($currency)) {
                $currency = Currency::getCurrencyInstance((int) $currency);
            }

            $cId = is_array($currency) ? (int) $currency['id_currency'] : (int) $currency->id;
            $cRate = is_array($currency) ? (float) $currency['conversion_rate'] : (float) $currency->conversion_rate;

            if ($cId != $defaultCurrency) {
                if ($to_currency) {
                    $price *= $cRate;
                } else {
                    $price /= $cRate;
                }
            }

            return $price;
        }
    }
}

if (!class_exists('HotelHelper')) {
    class HotelHelper
    {
        public static function getNumberOfDays($from, $to)
        {
            $a = strtotime(date('Y-m-d', strtotime($from)));
            $b = strtotime(date('Y-m-d', strtotime($to)));

            return max(1, (int) (($b - $a) / 86400));
        }
    }
}

if (!class_exists('Module')) {
    class Module
    {
        public $active = true;
        public $name = 'andestayoccupancypricing';

        public function l($s)
        {
            return $s;
        }
    }
}

if (!class_exists('AndeStayOccupancyPricing')) {
    class AndeStayOccupancyPricing extends Module
    {
        const CONFIG_ENABLED = 'ANDESTAY_OCC_ENABLED';
        const CONFIG_DEBUG = 'ANDESTAY_OCC_DEBUG';
        const CONFIG_DEFAULT_SOLO_PRICE = 'ANDESTAY_OCC_SOLO_PRICE_TE';
        const CONFIG_DEFAULT_DUAL_PRICE = 'ANDESTAY_OCC_DUAL_PRICE_TE';
        const DEFAULT_SOLO_PRICE_TE = 55.0;
        const DEFAULT_DUAL_PRICE_TE = 110.0;
    }
}

require_once dirname(__FILE__).'/../classes/AndestayOccupancyPricingRepository.php';
require_once dirname(__FILE__).'/../classes/AndestayOccupancyPriceService.php';

class FakeModule extends AndeStayOccupancyPricing
{
}

/**
 * In-memory rules for AndeStay matrix:
 * Double(2): 1A→55
 * Triple(3): 1A→55, 2A→110
 * Simple(1) / Matrimonial(4): no rules
 */
class FakeRepo extends AndestayOccupancyPricingRepository
{
    public $rules = array(
        '2:1:0' => array('id_product' => 2, 'adults' => 1, 'children' => 0, 'price_te' => 55.0, 'active' => 1),
        '3:1:0' => array('id_product' => 3, 'adults' => 1, 'children' => 0, 'price_te' => 55.0, 'active' => 1),
        '3:2:0' => array('id_product' => 3, 'adults' => 2, 'children' => 0, 'price_te' => 110.0, 'active' => 1),
    );

    public function getActiveRule($idProduct, $adults, $children)
    {
        $key = (int) $idProduct.':'.(int) $adults.':'.(int) $children;
        if (isset($this->rules[$key]) && !empty($this->rules[$key]['active'])) {
            return $this->rules[$key];
        }

        return false;
    }

    public function getActiveSoloRule($idProduct)
    {
        return $this->getActiveRule($idProduct, 1, 0);
    }
}

class TestableService extends AndestayOccupancyPriceService
{
    public function __construct($module, $repo)
    {
        $this->module = $module;
        $this->repository = $repo;
    }
}

function assert_true($cond, $msg)
{
    if (!$cond) {
        fwrite(STDERR, "FAIL: $msg\n");
        exit(1);
    }
    echo "OK: $msg\n";
}

function assert_float_eq($actual, $expected, $msg, $eps = 0.0001)
{
    assert_true(abs((float) $actual - (float) $expected) < $eps, $msg.' (got '.$actual.', expected '.$expected.')');
}

function baseParams($idProduct, $adults, $coreTe, $coreTi = null)
{
    if ($coreTi === null) {
        $coreTi = $coreTe;
    }

    return array(
        'total_prices' => array(
            'total_price_tax_excl' => (float) $coreTe,
            'total_price_tax_incl' => (float) $coreTi,
        ),
        'id_room_type' => (int) $idProduct,
        'id_room' => 10,
        'date_from' => '2026-08-27',
        'date_to' => '2026-08-28',
        'id_currency' => 1,
        'quantity' => 1,
        'tax_rate' => 0,
        'occupancy' => array(array('adults' => (int) $adults, 'children' => 0, 'child_ages' => array())),
    );
}

$module = new FakeModule();
$repo = new FakeRepo();
$service = new TestableService($module, $repo);

Configuration::updateValue('PS_CURRENCY_DEFAULT', 1);
Configuration::updateValue('ANDESTAY_OCC_ENABLED', 1);
Configuration::updateValue('ANDESTAY_OCC_DEBUG', 0);

// Uniform occupancy helpers
assert_true($service->isEligibleSoloOccupancy(array(array('adults' => 1, 'children' => 0))), 'solo 1 room eligible');
assert_true(
    $service->resolveUniformOccupancy(array(array('adults' => 2, 'children' => 0))) !== false,
    'uniform 2 adults resolves'
);
assert_true(
    $service->resolveUniformOccupancy(array(
        array('adults' => 1, 'children' => 0),
        array('adults' => 2, 'children' => 0),
    )) === false,
    'mixed occupancy NOT uniform'
);
assert_true($service->resolveUniformOccupancy(null) === false, 'null occupancy not uniform');
assert_true($service->resolveUniformOccupancy(array()) === false, 'empty occupancy not uniform');
assert_true($service->resolveUniformOccupancy(1) === false, 'scalar occupancy not uniform');
assert_true(
    $service->resolveUniformOccupancy(array(array('adults' => 1, 'children' => 1))) !== false,
    '1A+1C is uniform but has no rule → later no-op'
);

// --- Required matrix ---
$p = baseParams(3, 1, 160);
$service->applyOccupancyOverride($p);
assert_float_eq($p['total_prices']['total_price_tax_excl'], 55.0, 'Triple 1A = 55');

$p = baseParams(3, 2, 160);
$service->applyOccupancyOverride($p);
assert_float_eq($p['total_prices']['total_price_tax_excl'], 110.0, 'Triple 2A = 110');

$p = baseParams(3, 3, 160);
$service->applyOccupancyOverride($p);
assert_float_eq($p['total_prices']['total_price_tax_excl'], 160.0, 'Triple 3A = 160 core');

$p = baseParams(2, 1, 110);
$service->applyOccupancyOverride($p);
assert_float_eq($p['total_prices']['total_price_tax_excl'], 55.0, 'Double 1A = 55');

$p = baseParams(2, 2, 110);
$service->applyOccupancyOverride($p);
assert_float_eq($p['total_prices']['total_price_tax_excl'], 110.0, 'Double 2A = 110 core');

$p = baseParams(4, 1, 110);
$service->applyOccupancyOverride($p);
assert_float_eq($p['total_prices']['total_price_tax_excl'], 110.0, 'Matrimonial 1A = 110 core');

$p = baseParams(4, 2, 110);
$service->applyOccupancyOverride($p);
assert_float_eq($p['total_prices']['total_price_tax_excl'], 110.0, 'Matrimonial 2A = 110 core');

$p = baseParams(1, 1, 55);
$service->applyOccupancyOverride($p);
assert_float_eq($p['total_prices']['total_price_tax_excl'], 55.0, 'Simple 1A untouched core 55');

// Triple 2A + Simple 1A (separate cart calls) = 110 + 55 = 165
$total = 0.0;
$p = baseParams(3, 2, 160);
$service->applyOccupancyOverride($p);
$total += $p['total_prices']['total_price_tax_excl'];
$p = baseParams(1, 1, 55);
$service->applyOccupancyOverride($p);
$total += $p['total_prices']['total_price_tax_excl'];
assert_float_eq($total, 165.0, 'Triple 2A + Simple 1A = 165');

// Double 1A + Double 2A = 55 + 110 = 165
$total = 0.0;
foreach (array(array(1, 110), array(2, 110)) as $pair) {
    $p = baseParams(2, $pair[0], $pair[1]);
    $service->applyOccupancyOverride($p);
    $total += $p['total_prices']['total_price_tax_excl'];
}
assert_float_eq($total, 165.0, 'Double 1A + Double 2A = 165');

// Children → no-op (no rule)
$p = baseParams(3, 1, 160);
$p['occupancy'] = array(array('adults' => 1, 'children' => 1));
$service->applyOccupancyOverride($p);
assert_float_eq($p['total_prices']['total_price_tax_excl'], 160.0, 'Triple 1A+1C no-op core');

// Mixed aggregate → no-op
$p = baseParams(2, 1, 220);
$p['quantity'] = 2;
$p['occupancy'] = array(
    array('adults' => 1, 'children' => 0),
    array('adults' => 2, 'children' => 0),
);
$service->applyOccupancyOverride($p);
assert_float_eq($p['total_prices']['total_price_tax_excl'], 220.0, 'mixed occupancy no-op');

// Identical dual 2A rows → set one-room 110; qty×2 outside
$p = baseParams(3, 2, 320);
$p['quantity'] = 2;
$p['occupancy'] = array(
    array('adults' => 2, 'children' => 0),
    array('adults' => 2, 'children' => 0),
);
$service->applyOccupancyOverride($p);
assert_float_eq($p['total_prices']['total_price_tax_excl'], 110.0, 'identical Triple 2A sets one-room 110');
assert_float_eq($p['total_prices']['total_price_tax_excl'] * 2, 220.0, 'identical Triple 2A after qty = 220');

// Currency / tax still work for 2A rule
$p = baseParams(3, 2, 43.2);
$p['id_currency'] = 2;
$service->applyOccupancyOverride($p);
assert_float_eq($p['total_prices']['total_price_tax_excl'], 29.7, 'USD Triple 2A TE = 110*0.27');

$p = baseParams(3, 2, 160, 188.8);
$p['tax_rate'] = 18.0;
$service->applyOccupancyOverride($p);
assert_float_eq($p['total_prices']['total_price_tax_excl'], 110.0, 'PEN tax18 Triple 2A TE');
assert_float_eq($p['total_prices']['total_price_tax_incl'], 129.8, 'PEN tax18 Triple 2A TI');

// Disabled module
Configuration::updateValue('ANDESTAY_OCC_ENABLED', 0);
$p = baseParams(3, 1, 160);
$service->applyOccupancyOverride($p);
assert_float_eq($p['total_prices']['total_price_tax_excl'], 160.0, 'disabled module no-op');

Configuration::updateValue('ANDESTAY_OCC_ENABLED', 1);

// Missing occupancy
$p = baseParams(3, 1, 160);
$p['occupancy'] = null;
$service->applyOccupancyOverride($p);
assert_float_eq($p['total_prices']['total_price_tax_excl'], 160.0, 'missing occupancy no-op');

// BC alias
$p = baseParams(2, 1, 110);
$service->applySoloOverride($p);
assert_float_eq($p['total_prices']['total_price_tax_excl'], 55.0, 'applySoloOverride BC alias');

echo "\nAll occupancy pricing unit tests passed.\n";
