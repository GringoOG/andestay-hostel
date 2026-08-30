<?php
/**
 * Offline unit tests for solo occupancy eligibility, stay math, currency, tax.
 * Run: php tests/OccupancyPriceServiceTest.php
 *
 * Does not require a live QloApps DB.
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

/**
 * Mirrors Tools::convertPrice: default-currency amount → target currency via conversion_rate.
 * PEN (id=1) rate 1.0; USD (id=2) example rate 0.27 → 55 PEN = 14.85 USD.
 */
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
                    1 => new Currency(1, 1.0),   // PEN default
                    2 => new Currency(2, 0.27),  // USD secondary (illustrative rate)
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
        const DEFAULT_SOLO_PRICE_TE = 55.0;
    }
}

require_once dirname(__FILE__).'/../classes/AndestayOccupancyPricingRepository.php';
require_once dirname(__FILE__).'/../classes/AndestayOccupancyPriceService.php';

class FakeModule extends AndeStayOccupancyPricing
{
}

class FakeRepo extends AndestayOccupancyPricingRepository
{
    public $rule = array(
        'id_product' => 2,
        'price_te' => 55.0,
        'active' => 1,
        'adults' => 1,
        'children' => 0,
    );

    public function getActiveSoloRule($idProduct)
    {
        if ((int) $idProduct === (int) $this->rule['id_product'] && $this->rule['active']) {
            return $this->rule;
        }

        return false;
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

$module = new FakeModule();
$repo = new FakeRepo();
$service = new TestableService($module, $repo);

Configuration::updateValue('PS_CURRENCY_DEFAULT', 1); // PEN
Configuration::updateValue('ANDESTAY_OCC_ENABLED', 1);
Configuration::updateValue('ANDESTAY_OCC_DEBUG', 0);

// Eligibility
assert_true($service->isEligibleSoloOccupancy(array(array('adults' => 1, 'children' => 0))), 'solo 1 room eligible');
assert_true(
    $service->isEligibleSoloOccupancy(array(
        array('adults' => 1, 'children' => 0),
        array('adults' => 1, 'children' => 0),
    )),
    'two identical solo rooms eligible (qty will multiply later)'
);
assert_true(!$service->isEligibleSoloOccupancy(array(array('adults' => 2, 'children' => 0))), '2 adults not solo');
assert_true(
    !$service->isEligibleSoloOccupancy(array(
        array('adults' => 1, 'children' => 0),
        array('adults' => 2, 'children' => 0),
    )),
    'mixed occupancy NOT eligible — no averaging'
);
assert_true(!$service->isEligibleSoloOccupancy(null), 'null occupancy not eligible');
assert_true(!$service->isEligibleSoloOccupancy(array()), 'empty occupancy not eligible');
assert_true(!$service->isEligibleSoloOccupancy(1), 'scalar occupancy not eligible');

// --- PEN default currency, tax 0% ---
$params = array(
    'total_prices' => array('total_price_tax_excl' => 110.0, 'total_price_tax_incl' => 110.0),
    'id_room_type' => 2,
    'id_room' => 10,
    'date_from' => '2026-08-27',
    'date_to' => '2026-08-28',
    'id_currency' => 1,
    'quantity' => 1,
    'tax_rate' => 0,
    'occupancy' => array(array('adults' => 1, 'children' => 0, 'child_ages' => array())),
);
$service->applySoloOverride($params);
assert_float_eq($params['total_prices']['total_price_tax_excl'], 55.0, 'PEN tax0: TE = 55');
assert_float_eq($params['total_prices']['total_price_tax_incl'], 55.0, 'PEN tax0: TI = 55');

// 3 nights PEN
$params['total_prices'] = array('total_price_tax_excl' => 330.0, 'total_price_tax_incl' => 330.0);
$params['date_to'] = '2026-08-30';
$service->applySoloOverride($params);
assert_float_eq($params['total_prices']['total_price_tax_excl'], 165.0, 'PEN tax0: 3 nights TE = 165');
assert_float_eq($params['total_prices']['total_price_tax_incl'], 165.0, 'PEN tax0: 3 nights TI = 165');

// --- Secondary currency USD: 55 PEN * 0.27 = 14.85 USD (never raw 55 USD) ---
$params = array(
    'total_prices' => array('total_price_tax_excl' => 29.7, 'total_price_tax_incl' => 29.7),
    'id_room_type' => 2,
    'date_from' => '2026-08-27',
    'date_to' => '2026-08-28',
    'id_currency' => 2,
    'quantity' => 1,
    'tax_rate' => 0,
    'occupancy' => array(array('adults' => 1, 'children' => 0)),
);
$service->applySoloOverride($params);
assert_float_eq($params['total_prices']['total_price_tax_excl'], 14.85, 'USD tax0: TE = 55*0.27 = 14.85 (not 55)');
assert_float_eq($params['total_prices']['total_price_tax_incl'], 14.85, 'USD tax0: TI = 14.85');
assert_true(
    abs($params['total_prices']['total_price_tax_excl'] - 55.0) > 1.0,
    'USD must not leave raw 55 in secondary currency'
);

// --- Non-zero tax on PEN: 18% → TE 55, TI 64.9 ---
$params = array(
    'total_prices' => array('total_price_tax_excl' => 110.0, 'total_price_tax_incl' => 129.8),
    'id_room_type' => 2,
    'date_from' => '2026-08-27',
    'date_to' => '2026-08-28',
    'id_currency' => 1,
    'quantity' => 1,
    'tax_rate' => 18.0,
    'occupancy' => array(array('adults' => 1, 'children' => 0)),
);
$service->applySoloOverride($params);
assert_float_eq($params['total_prices']['total_price_tax_excl'], 55.0, 'PEN tax18: TE = 55');
assert_float_eq($params['total_prices']['total_price_tax_incl'], 64.9, 'PEN tax18: TI = 55*1.18 = 64.9');
assert_true(
    abs($params['total_prices']['total_price_tax_excl'] - $params['total_prices']['total_price_tax_incl']) > 0.01,
    'PEN tax18: TE and TI must differ'
);

// --- Non-zero tax on USD ---
$params = array(
    'total_prices' => array('total_price_tax_excl' => 29.7, 'total_price_tax_incl' => 35.046),
    'id_room_type' => 2,
    'date_from' => '2026-08-27',
    'date_to' => '2026-08-28',
    'id_currency' => 2,
    'quantity' => 1,
    'tax_rate' => 18.0,
    'occupancy' => array(array('adults' => 1, 'children' => 0)),
);
$service->applySoloOverride($params);
assert_float_eq($params['total_prices']['total_price_tax_excl'], 14.85, 'USD tax18: TE = 14.85');
assert_float_eq($params['total_prices']['total_price_tax_incl'], 17.523, 'USD tax18: TI = 14.85*1.18');

// 2 adults → no-op (core price kept)
$params = array(
    'total_prices' => array('total_price_tax_excl' => 110.0, 'total_price_tax_incl' => 110.0),
    'id_room_type' => 2,
    'date_from' => '2026-08-27',
    'date_to' => '2026-08-28',
    'id_currency' => 1,
    'quantity' => 1,
    'tax_rate' => 0,
    'occupancy' => array(array('adults' => 2, 'children' => 0)),
);
$service->applySoloOverride($params);
assert_float_eq($params['total_prices']['total_price_tax_excl'], 110.0, 'Double 2 adults keeps core 110');

// Mixed aggregated occupancy → no-op
$params = array(
    'total_prices' => array('total_price_tax_excl' => 220.0, 'total_price_tax_incl' => 220.0),
    'id_room_type' => 2,
    'date_from' => '2026-08-27',
    'date_to' => '2026-08-28',
    'id_currency' => 1,
    'quantity' => 2,
    'tax_rate' => 0,
    'occupancy' => array(
        array('adults' => 1, 'children' => 0),
        array('adults' => 2, 'children' => 0),
    ),
);
$service->applySoloOverride($params);
assert_float_eq($params['total_prices']['total_price_tax_excl'], 220.0, 'mixed occupancy no-op');

// Simulate cart path: two separate calls → 55 + 110 = 165
$total = 0.0;
foreach (
    array(
        array('adults' => 1, 'children' => 0),
        array('adults' => 2, 'children' => 0),
    ) as $row
) {
    $p = array(
        'total_prices' => array('total_price_tax_excl' => 110.0, 'total_price_tax_incl' => 110.0),
        'id_room_type' => 2,
        'date_from' => '2026-08-27',
        'date_to' => '2026-08-28',
        'id_currency' => 1,
        'quantity' => 1,
        'tax_rate' => 0,
        'occupancy' => array($row),
    );
    $service->applySoloOverride($p);
    $total += $p['total_prices']['total_price_tax_excl'];
}
assert_float_eq($total, 165.0, 'cart mixed doubles via per-room calls = 165');

// Module disabled
Configuration::updateValue('ANDESTAY_OCC_ENABLED', 0);
$params = array(
    'total_prices' => array('total_price_tax_excl' => 110.0, 'total_price_tax_incl' => 110.0),
    'id_room_type' => 2,
    'date_from' => '2026-08-27',
    'date_to' => '2026-08-28',
    'id_currency' => 1,
    'quantity' => 1,
    'tax_rate' => 0,
    'occupancy' => array(array('adults' => 1, 'children' => 0)),
);
$service->applySoloOverride($params);
assert_float_eq($params['total_prices']['total_price_tax_excl'], 110.0, 'disabled module no-op');

// Matrimonial product without rule
Configuration::updateValue('ANDESTAY_OCC_ENABLED', 1);
$params['id_room_type'] = 4;
$params['total_prices'] = array('total_price_tax_excl' => 110.0, 'total_price_tax_incl' => 110.0);
$service->applySoloOverride($params);
assert_float_eq($params['total_prices']['total_price_tax_excl'], 110.0, 'Matrimonial without rule keeps 110');

// Two identical solo rooms in one call: set ONE-room price; qty=2 multiplies outside
$params = array(
    'total_prices' => array('total_price_tax_excl' => 220.0, 'total_price_tax_incl' => 220.0),
    'id_room_type' => 2,
    'date_from' => '2026-08-27',
    'date_to' => '2026-08-28',
    'id_currency' => 1,
    'quantity' => 2,
    'tax_rate' => 0,
    'occupancy' => array(
        array('adults' => 1, 'children' => 0),
        array('adults' => 1, 'children' => 0),
    ),
);
$service->applySoloOverride($params);
$oneRoom = $params['total_prices']['total_price_tax_excl'];
$afterQty = $oneRoom * (int) $params['quantity'];
assert_float_eq($oneRoom, 55.0, 'identical dual-solo sets one-room 55');
assert_float_eq($afterQty, 110.0, 'identical dual-solo after qty = 110');

// Tools::convertPrice itself (utility contract)
assert_float_eq(Tools::convertPrice(55.0, 1), 55.0, 'convertPrice PEN identity');
assert_float_eq(Tools::convertPrice(55.0, 2), 14.85, 'convertPrice PEN→USD via rate');

echo "\nAll occupancy pricing unit tests passed.\n";
