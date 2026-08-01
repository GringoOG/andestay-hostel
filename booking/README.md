# Booking architecture

```
UI (React)
   │
   ▼
BookingService          ← sole public API for UI
   │
   ▼
BookingEngine           ← business rules (promos, min nights, fees…)
   │
   ▼
BookingProviderFactory
   │
   ├── QloApps          ← I/O adapter only
   ├── Custom
   ├── Cloudbeds
   └── Sirvoy
```

Hotel operational data lives in `src/lib/hotel/` (rooms, rates, policies, settings).  
Marketing copy / photos stay in `src/lib/content.ts`.

API contract types (no runtime yet): `src/lib/booking/api/types.ts`.

## Layout

```
src/lib/booking/
  booking.service.ts
  engine/          # BookingEngine
  api/             # request/response TypeScript contracts
  config/          # env + room slug → external id map
  types/
  errors/
  analytics/
  logger/
  hooks/
  factory/
  providers/       # interchangeable adapters (no business rules)
  utils/

src/lib/hotel/
  rooms.ts
  rates.ts
  policies.ts
  settings.ts

src/lib/payments/       # placeholder
src/lib/notifications/  # placeholder
src/lib/customers/      # placeholder
```

## Room mapping

UI uses **slugs** (`simple-room`, `double-room`, `triple-room`, `matrimonial-room`).  
Providers resolve to product ids via `config/rooms.ts` / env.

Inventory & base prices: `@/lib/hotel` (not marketing content).

Optional quantity is passed as `?quantity=N` when booking more than one unit.

```bash
NEXT_PUBLIC_BOOKING_ROOM_DOUBLE_PRODUCT_ID=1
NEXT_PUBLIC_BOOKING_ROOM_MATRIMONIAL_PRODUCT_ID=2
NEXT_PUBLIC_BOOKING_ROOM_TRIPLE_PRODUCT_ID=3
NEXT_PUBLIC_BOOKING_ROOM_SIMPLE_PRODUCT_ID=4
```

## Switch provider

```bash
NEXT_PUBLIC_BOOKING_PROVIDER=custom
NEXT_PUBLIC_BOOKING_EXTERNAL=false
```

No React changes.

## Capabilities

Booleans remain for compatibility. Prefer modes for new logic:

- `paymentMode`: `none` | `offline` | `deposit` | `online`
- `availabilityMode`: `none` | `cached` | `live`
