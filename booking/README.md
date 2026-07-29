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

UI uses **slugs** (`lake-cabana`).  
Providers resolve to product ids (`248`) via `config/rooms.ts` / env.

## Switch provider

```bash
NEXT_PUBLIC_BOOKING_PROVIDER=custom
NEXT_PUBLIC_BOOKING_EXTERNAL=false
```

No React changes.
