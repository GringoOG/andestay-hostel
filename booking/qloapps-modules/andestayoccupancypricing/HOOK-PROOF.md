# Hook proof — `actionRoomTypeTotalPriceModifier`

Evidence from official QloApps **v1.7.0.0** sources under `/tmp/qloapps-audit/QloApps`.
Production VPS files are **not** verified by this document.

## Hook exists (single definition)

File: `modules/hotelreservationsystem/classes/HotelRoomTypeFeaturePricing.php`

```php
Hook::exec('actionRoomTypeTotalPriceModifier',
    array(
        'total_prices' => &$totalPrice,  // REFERENCE
        'id_room_type' => $id_product,
        'id_room' => $id_room,
        'date_from' => $date_from,
        'date_to' => $date_to,
        'id_currency' => $id_currency,
        'quantity' => $quantity,         // count($occupancy) if array, else scalar
        'id_cart' => $id_cart,
        'id_guest' => $id_guest,
        'id_group' => $id_group,
        'use_reduc' => $use_reduc,
        'tax_rate' => $taxRate,
        'occupancy' => $occupancy
    )
);
```

`rg actionRoomTypeTotalPriceModifier` → **one call site only** (inside `getRoomTypeTotalPrice`).

## Quantity derivation

```php
if (is_array($occupancy) && count($occupancy)) {
    $quantity = count($occupancy);
} else {
    $quantity = $occupancy;
}
// ...
if (!$quantity) {
    $quantity = 1;
}
$totalPrice[...] = Tools::processPriceRounding($totalPrice[...], $quantity);
```

`$total_prices` is the sum for **one room** over the stay (before × `$quantity`).

## Immediately after the hook

1. Optional auto room services added into `$totalPrice`.
2. Then `processPriceRounding(..., $quantity)`.

Solo override therefore replaces the **room-night total** after seasonal/feature accumulation and before qty rounding. That is intentional: solo S/ 55 is fixed (no seasonal on that override). Other occupancies never enter the override → keep full core flow including seasonal.

## Cart / multi-room (mixed occupancy same type)

`classes/Cart.php` (~734–755 and ~1865–1884): loops **each physical cart room** and builds:

```php
$occupancy = array(array(
    'adults' => $cartRoomInfo['adults'],
    'children' => $cartRoomInfo['children'],
    'child_ages' => json_decode($cartRoomInfo['child_ages']),
));
// → quantity = 1 per call
```

| Cart room | occupancy param | qty | module | line |
|-----------|-----------------|-----|--------|------|
| Double #1 | `[[1,0]]` | 1 | set 55 | 55 |
| Double #2 | `[[2,0]]` | 1 | no-op | 110 |
| **Sum** | | | | **165** |

No averaging. No double multiplication on the cart path.

## Aggregated occupancy (search / product form)

`ProductController::assignBookingFormVars` / `displayAjaxRefreshBookingForm` pass the full occupancy array into `getRoomTypeTotalPrice`.

| Call occupancy | qty | module behaviour |
|----------------|-----|------------------|
| `[[1,0]]` | 1 | set one-room 55 |
| `[[1,0],[1,0]]` | 2 | set one-room 55 → core ×2 = 110 |
| `[[1,0],[2,0]]` | 2 | **no-op** (refuse mixed) |
| `null` / scalar qty | — | **no-op** |

## AJAX occupancy change

`ProductController::displayAjaxRefreshBookingForm` → `assignBookingFormVars` → `getRoomTypeTotalPrice` → hook fires again with the new occupancy. Override is absolute assignment (not additive) → repeated AJAX cannot stack 55 twice.

## Coverage honesty (call sites of `getRoomTypeTotalPrice`)

Hook runs whenever `getRoomTypeTotalPrice` runs. Occupancy quality varies:

| Path | Occupancy typically | Solo override |
|------|---------------------|---------------|
| Cart totals | per-room array ✓ | yes when solo |
| Product FO + AJAX refresh | array or qty scalar | yes when array solo |
| PaymentModule / order create | varies by call | only if occupancy passed |
| Hotel ARI webservice | often **scalar room count** | no-op → core |
| Some BO / helper calls | often **null** | no-op → core |

**Not claimed covered without further tests:** Channel Manager / ARI guest-level solo rates, historical email recalculation (use stored order prices).

## Currency timing

1. `Product::getPriceStatic` loads base product price and converts with `Tools::convertPrice` into **context currency**.
2. Night loop accumulates `$totalPrice` in that currency (incl. seasonal/feature impacts; fixed impacts also use `Tools::convertPrice`).
3. Hook receives `$total_prices` **already in context currency** plus `id_currency`.
4. Module stores solo as default-currency TE (PEN), converts with `Tools::convertPrice($soloTe, $id_currency)`, writes TE/TI for one room × nights.
5. After hook: optional auto services, then `processPriceRounding(..., $quantity)`.

So the hook runs **after** core currency conversion of product prices; the override must convert the configured PEN amount the same way.

## Verdict

Hook is suitable for this narrowed scope **because** the dangerous mixed cart case is already split into per-room calls with `quantity = 1`. Module safety rule: never average; mixed aggregated occupancy → no-op.
