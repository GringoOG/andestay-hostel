# Changelog

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
