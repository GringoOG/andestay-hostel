# Booking architecture

```
UI → BookingService → Factory → Provider
                              ├── QloApps
                              ├── Custom
                              ├── Cloudbeds
                              └── Sirvoy
```

## Layout (copy-paste ready)

```
src/lib/booking/
  booking.service.ts
  index.ts
  config/          # env + room slug → external id map
  types/
  errors/          # BookingError
  analytics/       # trackBookingClick (+ sinks)
  logger/          # BookingLogger
  hooks/           # useBooking, useBookingCapabilities
  factory/         # BookingProviderFactory
  providers/       # interchangeable adapters
  utils/
```

## Room mapping

UI uses **slugs** (`double-room`, `matrimonial-room`, `triple-room`, `simple-room`).  
Providers resolve to product ids via `config/rooms.ts` / env.

Inventory: **4** doble · **3** matrimonial · **1** triple · **1** simple.

Optional quantity is passed as `?quantity=N` when booking more than one unit of the same type.

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
