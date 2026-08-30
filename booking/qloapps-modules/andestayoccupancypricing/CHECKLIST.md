# Manual / integration checklist (live QloApps)

Run on a staging QloApps (or local clone) after installing the module with
**global enable OFF**, configuring Double+Triple solo = 55 PEN, then enabling.

Default currency must be **PEN**. If a secondary currency (USD/EUR) is enabled,
repeat the solo Double case in that currency and confirm the displayed amount is
`Tools::convertPrice(55, currentCurrency)` — never a raw `55` in USD/EUR.

## Search — 1 adult

| Room type   | Expected (PEN, tax as shop) |
|-------------|----------------------------:|
| Single      |                        55 |
| Double      |                        55 |
| Triple      |                        55 |
| Matrimonial |                       110 |

## Search — 2 adults

| Room type   | Expected |
|-------------|---------:|
| Double      |      110 |
| Triple      |      160 |
| Matrimonial |      110 |

## Search — 3 adults

| Room type | Expected |
|-----------|---------:|
| Triple    |      160 |

## Same price on every surface

For each scenario above (at least Double solo + Double 2A + Matrimonial 1A):

- [ ] Search results
- [ ] Cabin / room type detail
- [ ] After occupancy selection (incl. AJAX refresh)
- [ ] Cart
- [ ] Checkout
- [ ] Order confirmation page
- [ ] Stored order (BO → Orders)
- [ ] Customer email
- [ ] Hotelier / admin email (payatproperty notification if used)
- [ ] Payment at property return / confirmation copy
- [ ] Back Office order line totals

## Multi-cabin / occupancy change

- [ ] Two Double, each 1 adult → **110** / night
- [ ] Double 1A + Double 2A → **165** / night
- [ ] Change Double 1A → 2A recalculates **55 → 110**
- [ ] Repeated AJAX occupancy refresh does **not** double-apply
- [ ] Full page reload keeps the correct price
- [ ] Remove cabin + re-add keeps correct price
- [ ] Aggregated mixed occupancy path (if reachable) leaves core / no averaged solo

## Fail-safe

- [ ] Installed, `Enable occupancy solo pricing = No` → all core prices
- [ ] Module disabled in Modules list → all core prices
- [ ] Room type without active solo rule → core
- [ ] Missing / invalid occupancy → core (never invent 55)
- [ ] Single always untouched
- [ ] Matrimonial always untouched (rule off)
- [ ] Historical orders placed before enable are **not** retro-recalculated
- [ ] Emails / invoices show **stored** order amounts

## Currency / tax spot checks

- [ ] PEN, tax 0%: Double solo TE=TI=55
- [ ] If shop tax > 0%: TE=55 (default currency), TI = TE × (1+rate/100) (or shop display mode)
- [ ] Secondary currency: Double solo ≠ 55 in that currency; matches conversion of 55 PEN

## Rollback (staging)

1. Modules → disable **AndeStay Occupancy Pricing**, or set global enable OFF.
2. Clear cache.
3. Re-check Double 1 adult = core (110 if base is 110).
4. Optional uninstall (drops `_DB_PREFIX_andestay_occupancy_rule` + module Configuration only).
