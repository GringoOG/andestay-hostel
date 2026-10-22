# QloApps mail layout fixes (AndeStay) — v1.1.4

## Problem (seen in production)
Order confirmation email showed:
1. **Huge logo** — shop logo is **1254×1254 px**; stock templates use `<img src="{shop_logo}">` with **no width**, so Gmail shows natural size
2. **Overlapping room headers** from the default 9-column booking table

## Fix (payatproperty **1.1.4**)
- Installs a dedicated **100×100** email logo as `PS_LOGO_MAIL` (`img/andestay-mail-logo.png`) — site header logo stays unchanged
- Hook `actionEmailAddAfterContent` forces `width="100"` on every outgoing mail (even if stock templates remain on disk)
- Booking details = stacked cards; templates sync into `/mails/` **and** theme `mails/`

## Deploy

1. Upload `booking/qloapps-modules/payatproperty.zip` (module **1.1.4**)
2. QloApps BO → Modules → **Pay at property** → **Upgrade** (must show 1.1.4)
3. Configure → **Save**
4. Advanced Parameters → Performance → **Clear cache**
5. Place a **new** test booking — old emails stay broken

## Manual BO fallback (no module upgrade)
Preferences → Themes → upload a small **Email logo** (≈100×100 px). That alone shrinks the logo in all mails.
