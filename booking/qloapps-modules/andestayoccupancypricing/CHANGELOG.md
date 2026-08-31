# Changelog

## 1.0.1

- Exact occupancy rules beyond solo: support active **2 adults / 0 children** price (AndeStay Triple → 110).
- BO: separate enable switches for 1-adult and 2-adult rules per room type; dual default price config.
- Compatible upgrade from 1.0.0 (`upgrade-1.0.1.php`); existing solo rules preserved.
- Triple 3 adults, Simple, Matrimonial, children, mixed occupancy remain core no-op.
- Expanded offline unit tests for the AndeStay price matrix.

## 1.0.0

- Initial release.
- Hook: `actionRoomTypeTotalPriceModifier`.
- Solo override (1 adult / 0 children) for selected room types only.
- Solo amount stored in default currency; FO uses `Tools::convertPrice`.
- Tax excl/incl both set from hook `tax_rate`.
- Global enable default OFF; CSRF token check on config save.
- Configuration + `_DB_PREFIX_andestay_occupancy_rule` table.
- EN / ES translations.
- Offline unit tests (eligibility, multi-room, PEN/USD, tax).
- Manual FO checklist (`CHECKLIST.md`) and hook proof (`HOOK-PROOF.md`).
