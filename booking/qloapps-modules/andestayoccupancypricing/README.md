# AndeStay Occupancy Pricing (`andestayoccupancypricing`)

QloApps 1.7.0.0 module. Applies a **solo overnight price** only when:

- room type has an **active** solo rule, and
- occupancy is unambiguously **1 adult + 0 children** (every occupancy row).

All other cases are a **no-op** → standard QloApps pricing (incl. seasonal/feature pricing).

## AndeStay price intent

| Type | 1 adult | 2 adults | 3 adults |
|------|--------:|---------:|---------:|
| Single | core 55 | — | — |
| Double | **module 55** | core 110 | — |
| Triple | **module 55** | core 160 | core 160 |
| Matrimonial | core 110 | core 110 | — |

## Hook proof (multi-room)

Source: `HotelRoomTypeFeaturePricing::getRoomTypeTotalPrice()` (QloApps 1.7.0.0).

### Parameters passed to `actionRoomTypeTotalPriceModifier`

```php
Hook::exec('actionRoomTypeTotalPriceModifier', array(
    'total_prices' => &$totalPrice,   // BY REFERENCE — module may mutate
    'id_room_type' => $id_product,
    'id_room'      => $id_room,
    'date_from'    => $date_from,
    'date_to'      => $date_to,
    'id_currency'  => $id_currency,
    'quantity'     => $quantity,      // count($occupancy) if array, else scalar
    'id_cart'      => $id_cart,
    'id_guest'     => $id_guest,
    'id_group'     => $id_group,
    'use_reduc'    => $use_reduc,
    'tax_rate'     => $taxRate,
    'occupancy'    => $occupancy,
));
```

`$totalPrice` shape before/after hook:

```php
array(
  'total_price_tax_incl' => float,  // sum for ONE room over the stay (before qty)
  'total_price_tax_excl' => float,
)
```

After the hook, core may add auto room services, then:

```php
Tools::processPriceRounding($totalPrice[...], $quantity);
```

### Cart path (critical for mixed occupancy)

`Cart.php` loops **each physical room** and calls `getRoomTypeTotalPrice` with:

```php
$occupancy = array(array(
  'adults' => $cartRoomInfo['adults'],
  'children' => $cartRoomInfo['children'],
  'child_ages' => json_decode(...),
));
// → quantity = 1
```

Example order (1 night):

| Call | occupancy | qty | module | result |
|------|-----------|-----|--------|--------|
| Double room A | `[[1,0]]` | 1 | sets 55 | 55 |
| Double room B | `[[2,0]]` | 1 | no-op | 110 |
| **Cart total** | | | | **165** |

### Aggregated occupancy (search / product form)

If `$occupancy` has multiple rows:

- all rows solo `1A/0C` → module sets **one-room** solo price; core `quantity` multiplies (2×55=110) ✓
- **mixed** rows (1A + 2A) → **no-op** (never average)

### Missing occupancy

If occupancy is null / scalar / incomplete → **no-op** (never invent S/ 55).

Emails/invoices should use **stored order line prices**; this module does not recalculate historical orders.

## Currency (PEN → FO currency)

- Config / DB `price_te` is stored in the **shop default currency** (AndeStay: **PEN / S/**).
- Core builds `$total_prices` in the **current context currency** (`Product::getPriceStatic` → `Tools::convertPrice` before the night loop).
- Hook runs **after** that conversion. The module converts solo with the same `Tools::convertPrice($priceTe, $id_currency)` used by fixed feature-price impacts — never treats `55` as USD/EUR.
- Offline tests cover PEN identity and a secondary currency rate (illustrative USD 0.27 → 14.85).

## Tax

- Sets both `total_price_tax_excl` and `total_price_tax_incl`.
- Tax 0% → TE = TI.
- Non-zero → TI = TE × (1 + `tax_rate`/100) using the hook’s `tax_rate` (from product TI/TE). Never copies the same 55 into TE and TI when tax > 0.

## Install

1. Upload ZIP so archive root is `andestayoccupancypricing/`.
2. Modules → Install **AndeStay Occupancy Pricing**.
3. Configure:
   - Solo price TE = `55`
   - Enable solo on **Double** and **Triple** only (by `id_product`, not name)
   - Leave Single / Matrimonial disabled
   - Then turn **global enable** ON
4. Clear cache (Advanced Parameters → Performance).
5. Run checklist in README Test section.

Default after install: **global enable OFF** (safe).

## Uninstall

Drops `_DB_PREFIX_andestay_occupancy_rule` and module Configuration keys only. Existing orders untouched.

## Tests

```bash
php tests/OccupancyPriceServiceTest.php
```

## Channel Manager / OTA

Not claimed covered. Connector/ARI may price without guest occupancy. Inventory is never touched by this module.

## Production note

Built against upstream QloApps 1.7.0.0. Before production: diff `HotelRoomTypeFeaturePricing.php` on the VPS and confirm PHP/MariaDB versions.
