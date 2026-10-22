# AndeStay — checklist spuštění webu + rezervací

**Aktuální web (zatím):** https://andestay-hostel.vercel.app  
**Hosting:** Vercel  
**Booking (plán):** QloApps  
**CMS (volitelně):** Sanity

Tento dokument má dvě části:
1. **Pro tebe (Mircek)** — co řídíš ty
2. **Pro klienta** — španělský návod krok za krokem (můžeš poslat e-mailem / WhatsAppem)

---

# ČÁST A — Checklist pro tebe (CZ)

## A1. Doména (až klient koupí)

- [ ] Klient pošle: název domény + kdo spravuje DNS (nebo přístup)
- [ ] Vercel → Project `andestay-hostel` → **Settings → Domains** → Add
- [ ] Klientovi pošleš přesné DNS záznamy z Vercelu (viz část B3)
- [ ] Po propagaci DNS: zelená doména ve Vercelu + HTTPS OK
- [ ] Redirect: `www` → apex (nebo naopak) — jedna kanonická adresa
- [ ] Rychlý test: home, `/accommodation`, `/transport`, `/contact`, Book CTA

## A2. Web / obsah

- [ ] Finální texty a ceny schválené klientem
- [ ] Telefony, e-mail, WhatsApp, mapa, sociální sítě sedí
- [ ] Sanity Studio: Room / Homepage / SiteSettings / Media (pokud přepínáš na Sanity)
- [ ] Vercel env (až bude content ostrý):
  - `NEXT_PUBLIC_CONTENT_PROVIDER=sanity`
  - `NEXT_PUBLIC_SANITY_PROJECT_ID=nnfu4wmn`
  - `NEXT_PUBLIC_SANITY_DATASET=production`
- [ ] Redeploy po změně env
- [ ] Test mobil ES + EN (alespoň)

## A3. Rezervace (QloApps)

Bez hotového QloApps nechej Book → WhatsApp / soft disabled.

- [ ] QloApps běží na URL (např. `https://book.andestayhostel.com`)
- [ ] 4 produkty = simple / double / triple / matrimonial
- [ ] Získáš skutečné `id_product` (ne placeholdery 1–4)
- [ ] Vercel env:
  - `NEXT_PUBLIC_BOOKING_ENABLED=true`
  - `NEXT_PUBLIC_BOOKING_PROVIDER=qloapps`
  - `NEXT_PUBLIC_BOOKING_EXTERNAL=true`
  - `NEXT_PUBLIC_BOOKING_BASE_URL=https://…`
  - `NEXT_PUBLIC_BOOKING_ROOM_SIMPLE_PRODUCT_ID=…`
  - `NEXT_PUBLIC_BOOKING_ROOM_DOUBLE_PRODUCT_ID=…`
  - `NEXT_PUBLIC_BOOKING_ROOM_TRIPLE_PRODUCT_ID=…`
  - `NEXT_PUBLIC_BOOKING_ROOM_MATRIMONIAL_PRODUCT_ID=…`
- [ ] Test: Book z karty pokoje otevře správný produkt + quantity
- [ ] Test: dostupnost, storno text, e-mail potvrzení (i test platba)
- [ ] Fallback: WhatsApp číslo vždy funguje

## A4. Soft launch

- [ ] Klient projde web 15 minut na mobilu
- [ ] Opravíš kritické bugy
- [ ] Doména + booking live
- [ ] Teprve pak reklama / Booking.com odkazy na vlastní web

## Pořadí (doporučené)

1. Web na Vercelu (hotovo)  
2. Doména (klient koupí → ty napojíš)  
3. QloApps + platby (nejdéle)  
4. Env booking na Vercelu + test  
5. Sanity ostrý content  
6. Soft launch  

---

# ČÁST B — Para el cliente (ES)

Copia desde aquí y envíalo al cliente.

---

## Qué vamos a lanzar

1. **Sitio web** AndeStay Hostel (ya está en Vercel)  
2. **Dominio propio** (ejemplo: `andestayhostel.com`) — tú lo compras  
3. **Sistema de reservas** (QloApps) — para que los huéspedes reserven y paguen online  

Mientras no haya dominio, el sitio puede verse aquí:  
https://andestay-hostel.vercel.app

---

## Lista rápida — lo que necesito de ti

| # | Tarea | ¿Quién? |
|---|--------|---------|
| 1 | Decidir y comprar el dominio | Tú |
| 2 | Enviarme acceso DNS o configurar DNS con mi guía | Tú (+ yo) |
| 3 | Confirmar textos, precios, fotos, WhatsApp, email | Tú |
| 4 | Decidir hosting de reservas (QloApps) y datos del negocio | Tú |
| 5 | Cuenta de pagos (si quieres cobro online) | Tú |
| 6 | Conectar dominio + reservas al sitio | Yo |
| 7 | Probar todo antes del anuncio público | Tú + yo |

---

## Paso 1 — Comprar el dominio (tú)

### 1.1 Elegir el nombre

Ejemplos buenos:
- `andestayhostel.com`
- `andestay.com` (si está libre)
- Evita nombres muy largos o difíciles de escribir

### 1.2 Dónde comprarlo (elige uno)

Cualquiera de estos está bien:
- [Cloudflare Registrar](https://www.cloudflare.com/products/registrar/) (recomendado, simple)
- [Namecheap](https://www.namecheap.com/)
- [Google Domains / Squarespace Domains](https://domains.google/)
- Un registrador en Perú que uses normalmente

### 1.3 Qué hacer al comprar

1. Crea una cuenta en el registrador  
2. Busca el dominio y cómpralo (1 año mínimo)  
3. Activa **renovación automática** (para no perder el dominio)  
4. Guarda el usuario y la contraseña en un lugar seguro  
5. **No configures aún** páginas “en construcción” del registrador — el sitio lo tendremos en Vercel  

### 1.4 Qué enviarme después de comprar

Mándame por WhatsApp o email:

1. El dominio exacto (ej. `andestayhostel.com`)  
2. Dónde lo compraste (Cloudflare / Namecheap / otro)  
3. Una de estas dos opciones:

**Opción A (más fácil para ti):**  
“Te doy acceso al DNS” (me agregas como usuario o me pasas login temporal).

**Opción B:**  
“Yo pongo los DNS” — yo te mando 2–3 líneas exactas para copiar (Paso 2).

---

## Paso 2 — Conectar el dominio al sitio (tú + yo)

El sitio vive en **Vercel**. Hay que apuntar el dominio hacia Vercel.

### Si eliges Opción B (tú configuras DNS)

Yo te enviaré algo parecido a esto (los valores exactos salen de Vercel):

**Para el dominio principal (sin www):**
- Tipo: `A`  
- Nombre / Host: `@`  
- Valor: `76.76.21.21`  
  *(o el valor que Vercel muestre en ese momento)*

**Para www:**
- Tipo: `CNAME`  
- Nombre / Host: `www`  
- Valor: `cname.vercel-dns.com`  
  *(o el valor que Vercel muestre)*

### Cómo se hace (Namecheap — ejemplo)

1. Entra a Namecheap → **Domain List** → tu dominio → **Manage**  
2. Pestaña **Advanced DNS**  
3. Borra registros viejos de tipo A/CNAME que apunten a otra web (si existen)  
4. **Add New Record** con lo que yo te mande  
5. Guarda  
6. Espera 15 minutos a 48 horas (normalmente menos de 2 horas)  
7. Avísame: “DNS listo”  

### Cómo se hace (Cloudflare — ejemplo)

1. Entra a Cloudflare → selecciona el dominio  
2. Menú **DNS** → **Records**  
3. Añade los registros A / CNAME que yo te envíe  
4. Proxy (nubecita): sigue mi instrucción (a veces debe estar en DNS only / gris)  
5. Avísame cuando esté guardado  

### Qué hago yo después

- Añado el dominio en Vercel  
- Activo HTTPS (candado)  
- Configuro redirección `www` ↔ dominio principal  
- Te aviso cuando https://tudominio.com ya abre AndeStay  

---

## Paso 3 — Confirmar datos del negocio (tú)

Por favor confirma o corrige:

### Contacto
- [ ] Teléfonos (WhatsApp principal incluido)  
- [ ] Email de reservas  
- [ ] Dirección exacta / cómo llegar  
- [ ] Instagram / TikTok / Facebook (si aplica)  

### Habitaciones y precios (PEN / noche)
- [ ] Simple  
- [ ] Double  
- [ ] Triple  
- [ ] Matrimonial  
- [ ] ¿Desayuno y cena incluidos? (sí/no)  

### Transporte (si aplica)
- [ ] Precios colectivo / privado OK  

### Fotos
- [ ] Fotos finales aprobadas (o “usamos las actuales”)  

Mándame todo en un solo mensaje si puedes.

---

## Paso 4 — Sistema de reservas QloApps (tú + yo)

El sitio web **no cobra solo**. Necesita un motor de reservas (QloApps).

### 4.1 Decisiones que necesito de ti

Responde estas preguntas:

1. **¿Quieres reservas online con pago?**  
   - A) Solo consulta de fechas + pago al llegar / transferencia  
   - B) Pago online (tarjeta)  

2. **¿Quién administra las reservas día a día?**  
   Nombre + WhatsApp + email  

3. **Políticas**
   - Check-in desde: ____  
   - Check-out hasta: ____  
   - Cancelación gratuita hasta: ____ días antes  
   - Noches mínimas: ____  

4. **Datos fiscales** (para facturas / pagos)  
   - Nombre comercial  
   - RUC / documento  
   - Dirección fiscal  

### 4.2 Pagos online (solo si elegiste B)

Tú (o tu contador) debe:
1. Abrir cuenta en la pasarela que usemos (ej. Stripe / Culqi / otra disponible en Perú — lo definimos juntos)  
2. Completar verificación KYC (documentos de la empresa / persona)  
3. Pasarme las **claves de prueba** primero, luego las de producción  
4. Nunca publicar las claves secretas en WhatsApp público — mejor por canal privado  

### 4.3 Qué hago yo con QloApps

1. Instalar / conectar QloApps  
2. Crear los 4 tipos de cabaña  
3. Cargar precios y inventario  
4. Conectar el botón **Book** del sitio al sistema real  
5. Hacer una reserva de prueba contigo  

### 4.4 Mientras QloApps no esté listo

El sitio puede seguir online.  
Los huéspedes reservan por **WhatsApp** (ya está en el sitio).  
Eso es normal al inicio.

---

## Paso 5 — Prueba final antes de anunciar (tú)

En el móvil, revisa:

- [ ] Abre el dominio (o el link Vercel)  
- [ ] Cambia idioma (ES / EN)  
- [ ] Mira habitaciones y precios  
- [ ] Prueba WhatsApp  
- [ ] Prueba el mapa / contacto  
- [ ] Prueba **Book** (cuando exista QloApps)  
- [ ] Dime qué está mal en una lista corta  

Cuando digas “OK para publicar”, empezamos a mandar tráfico / ads.

---

## Resumen en una frase

> **Tú compras el dominio y confirmas datos del negocio + pagos. Yo conecto el dominio, el sitio y el sistema de reservas, y te dejo todo listo para huéspedes.**

---

## Contacto técnico

Cuando termines un paso, escríbeme:

1. “Dominio comprado: ……”  
2. “DNS listo”  
3. “Datos de habitaciones/precios confirmados”  
4. “Quiero pagos online: sí/no”  

Con eso puedo avanzar sin bloqueos.

---

# Notas internas (Mircek)

- Doména na Vercelu: Settings → Domains; DNS hodnoty vždy zkopíruj z UI (mění se).  
- Booking env šablona: `.env.example`.  
- QloApps product IDs musí sedět 1:1 se slugy webu.  
- Sanity project: `nnfu4wmn` / `production`.  
- Dokud není Qlo, Book klidně nech s WhatsApp fallback / disabled.  
- Tento soubor můžeš poslat klientovi (část B) nebo exportovat do PDF/Docs.
