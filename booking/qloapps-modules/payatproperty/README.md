# Pay at Property (`payatproperty`) — QloApps 1.7.0.0

Offline payment module for AndeStay / QloApps. Guests complete a booking without online payment and pay cash at the property.

## Install (Admin)

1. Zip the folder so the archive root is `payatproperty/` (not nested twice).
2. QloApps Admin → **Modules and Services** → **Add a new module** → upload `payatproperty.zip`
3. Find **Pay at property** → **Install** / **Upgrade** → **Enable** (need **1.1.4+** for email logo fix)
4. **Configure** → set **Booking notification email** (default `andestayhostel@gmail.com`) → **Save**
5. **Payments** → ensure the module is enabled for your currencies (PEN) and customer groups
6. Disable competing methods if you only want cash-at-property for now

## Email logo (v1.1.4)

Shop logo on the server is ~1254×1254 px. Stock mail HTML has no `width`, so Gmail shows it huge.

On Upgrade/Save the module:
- copies `mails/andestay-mail-logo.png` (100×100) to `img/` and sets `PS_LOGO_MAIL`
- registers `actionEmailAddAfterContent` to force 100px on `{shop_logo}` in every outgoing HTML mail
- re-syncs stacked `order_conf` / booking partials into `/mails/` and theme mails

## Booking notification (v1.1.0)

After a successful Pay at Property order, the module:

1. Sends the guest confirmation (`pay_at_property`)
2. Sends an internal property notification (`new_booking_admin`) to `PAYATPROPERTY_NOTIFICATION_EMAIL`

If the notification email field is empty, only the guest mail is sent.  
Admin notification failures never cancel the booking.

## Test

1. Add a room to cart → checkout → select **Pay at property**
2. Confirm → one order created, status **Awaiting payment at property**
3. Guest receives confirmation mail
4. Property receives **New booking – AndeStay Hostel** (or CS/ES subject) with stay details
5. Confirmation page shows amount to pay on arrival
6. Refresh confirmation page → no second admin email
7. Clear notification email in config → new booking → guest mail only
8. Admin → Orders: booking visible, unpaid
9. Reception marks **Payment accepted** after cash is received

## Translations

- Front strings: `translations/en.php`, `cs.php`, `es.php`
- Or Admin → Localization → Translations → Modules
- Order state names are set at install (EN/CS/ES)
- Guest mail: `mails/{en,cs,es}/pay_at_property.html` (+ `.txt`)
- Admin mail: `mails/{en,cs,es}/new_booking_admin.html` (+ `.txt`)

## Uninstall

Removes module hooks and configuration keys:

- `PAYATPROPERTY_OS_AWAITING`
- `PAYATPROPERTY_NOTIFICATION_EMAIL`

The custom OrderState is kept so historical orders stay readable.
