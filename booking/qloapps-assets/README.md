# QloApps homepage hero images (fix)

## Problem
`/img/hotel_header_image_pc.jpg` on production was actually an **iPhone HEIC** file
renamed to `.jpg` (5712×4284, ~5.3 MB). Many browsers (Chrome, Android, WhatsApp
in-app) cannot use HEIC as CSS `background-image` → gray hero. Safari/iOS often
still shows it → “sometimes works, sometimes not / different when opening a shared link”.

Mobile file was a real JPEG but also huge (~3.7 MB).

## Fixed files (upload these)
- `hotel_header_image_pc.jpg` — real JPEG, max edge 1920
- `hotel_header_image_mobile.jpg` — real JPEG, max edge 1400

## Deploy in QloApps BO
HRS → General Settings → General Settings → Website Configuration
→ upload Header / homepage background (PC + Mobile)
or replace via FTP/SFTP:
`/img/hotel_header_image_pc.jpg`
`/img/hotel_header_image_mobile.jpg`
Then clear QloApps cache + hard refresh.
