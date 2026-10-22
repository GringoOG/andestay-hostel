# Postup integrace rezervačního systému

Dokumentace pro napojení AndeStay (Next.js) na QloApps.
Web už má booking vrstvu připravenou — zbývá rozběhnout QloApps a vyplnit ENV.

---

## Krok 0 – Infrastruktura (před serverem)

Ještě před vytvořením VPS připrav finální adresu bookingu. Pak instaluješ QloApps rovnou na ostré URL a nemusíš později měnit konfiguraci ani ENV.

### Doména
- Subdoména: `book.andestayhostel.com`

### DNS
- Typ: **A**
- Host / name: `book`
- Value: IPv4 adresa VPS (doplníš po vytvoření serveru v kroku 1)
- TTL: default / 300

> Dokud nemáš IP, můžeš A záznam vytvořit až hned po kroku 1. Ideálně ale doménu a plán DNS řeš jako první.

### SSL
- Let’s Encrypt (Certbot) na serveru — po tom, co DNS už ukazuje na IP

### SMTP (e-maily)
- Schránka typu `reservations@andestayhostel.com` (nebo `booking@…`)
- SMTP údaje si připrav pro QloApps (potvrzení rezervací)

**Výsledek Kroku 0:** víš, že booking poběží na `https://book.andestayhostel.com` (= budoucí `BOOKING_URL`).

---

## Krok 1 – Připrav hosting pro QloApps

**Cíl:** mít server, na kterém poběží rezervační systém.

### Co musí hosting splňovat
- Ubuntu 24.04 LTS (nebo 22.04)
- veřejnou IPv4 adresu
- minimálně:
  - 2 vCPU
  - 2 GB RAM
  - 20–40 GB SSD
- možnost připojit se přes SSH

Pro jeden hostel je to naprosto dostačující.

### Doporučené varianty

#### Varianta A – Hetzner VPS ⭐ (doporučeno)
**Výhody:**
- velmi levný
- spolehlivý
- jednoduchý
- vhodný pro produkci

Po vytvoření serveru dostaneš například:
- IP: `168.119.xxx.xxx`
- OS: Ubuntu 24.04
- root password / SSH klíč

To je vše, co budeš potřebovat.

#### Varianta B – Oracle Cloud Free
**Výhody:**
- zdarma

**Nevýhody:**
- složitější registrace
- někdy není volná kapacita
- horší pro první instalaci

Na první projekt raději zvol Hetzner.

### Po vytvoření serveru
Měl bys mít:
- veřejnou IP
- root heslo nebo SSH klíč
- možnost se přihlásit

Například:

```bash
ssh root@168.xxx.xxx.xxx
```

1. Doplň DNS A záznam `book` → tato IP (Krok 0)
2. Počkej na propagaci DNS (minuty až hodiny)

Pokud se přihlásíš do terminálu, **krok 1 je hotový**.

---

## Krok 2 – Instalace QloApps

**Cíl:** rozběhnout rezervační systém.

### Nejprve připrav server
Na server nainstaluješ:
- PHP
- MariaDB
- Apache nebo Nginx
- Composer (pokud bude potřeba)
- SSL certifikát (Let’s Encrypt na `book.andestayhostel.com`)

To je běžné webové prostředí.

### Stažení QloApps
1. Stáhni poslední stabilní verzi
2. Rozbal ji do webového adresáře, například:

```text
/var/www/qloapps
```

### Vytvoř databázi
Například:
- Database: `qloapps`
- uživatel: `qloapps_user`
- heslo: `********`

Tyto údaje si ulož.

### Spusť instalátor
Otevři v prohlížeči:

```text
https://book.andestayhostel.com
```

(nebo dočasně `http://TVOJE_IP`, dokud DNS/SSL neběží)

Vyplníš:
- název hotelu
- email
- heslo
- databázi

Po dokončení se přihlásíš do administrace.

### Výsledek
Měl by fungovat například:

```text
https://book.andestayhostel.com
```

Tomu budeme říkat **`BOOKING_URL`**.

---

## Krok 3 – Nastavení hotelu

Teď ještě není možné smysluplně rezervovat — musíš nastavit hotel.

### Obecné údaje
| Položka | Hodnota |
|---------|---------|
| Hotel | AndeStay Hostel |
| Měna | PEN |
| Jazyk | Spanish, English |
| Časová zóna | America/Lima |
| Check-in | 14:00 |
| Check-out | 10:00 |
| Storno | Free cancellation up to 7 days |

---

## Krok 4 – Vytvoření pokojů

Přidej čtyři **Room Types**.

### Simple
| | |
|--|--|
| Price | 80 PEN |
| Kapacita | 1 osoba |
| Počet pokojů | 1 |

### Double
| | |
|--|--|
| Price | 120 PEN |
| Kapacita | 2 osoby |
| Inventář | 4 pokoje |

### Triple
| | |
|--|--|
| Price | 180 PEN |
| Kapacita | 3 osoby |
| Inventář | 1 pokoj |

### Matrimonial
| | |
|--|--|
| Price | 120 PEN |
| Kapacita | 2 osoby |
| Inventář | 3 pokoje |

### U každého pokoje přidej
- fotografie
- popis
- Wi-Fi
- snídani
- večeři zdarma
- vlastní koupelnu (pokud je)
- další vybavení

Čím lepší budou informace, tím méně dotazů od hostů.

---

## Krok 5 – Platební metoda

Pro první spuštění **neřeš Stripe**.

Stačí:
- **Pay at property**, nebo
- **Cash**

Rezervace bude fungovat. Online platby přidáš později.

---

## Krok 6 – Zjištění Product ID

To je jediná věc, kterou web potřebuje k mapování pokojů.

1. Otevři například pokoj **Double**
2. Veřejný odkaz může vypadat například:

```text
https://book.andestayhostel.com/index.php?id_product=13
```

3. Zapiš si:

| Pokoj | id_product |
|-------|------------|
| Simple | … |
| Double | 13 (příklad) |
| Triple | … |
| Matrimonial | … |

Stejně udělej Simple, Triple, Matrimonial.

---

## Krok 7 – Vyplnění ENV ve Vercelu

Otevři:

```text
Vercel → Project → Settings → Environment Variables
```

(Environment: **Production**)

Vlož všechny hodnoty. Příklad:

```bash
NEXT_PUBLIC_BOOKING_ENABLED=true
NEXT_PUBLIC_BOOKING_PROVIDER=qloapps
NEXT_PUBLIC_BOOKING_EXTERNAL=true
NEXT_PUBLIC_BOOKING_OPEN_IN_NEW_TAB=true
NEXT_PUBLIC_BOOKING_BASE_URL=https://book.andestayhostel.com
NEXT_PUBLIC_BOOKING_DEFAULT_PATH=/

NEXT_PUBLIC_BOOKING_ROOM_SIMPLE_PRODUCT_ID=12
NEXT_PUBLIC_BOOKING_ROOM_DOUBLE_PRODUCT_ID=13
NEXT_PUBLIC_BOOKING_ROOM_TRIPLE_PRODUCT_ID=14
NEXT_PUBLIC_BOOKING_ROOM_MATRIMONIAL_PRODUCT_ID=15
```

Čísla nahraď skutečnými ID z Kroku 6. Ulož.

---

## Krok 8 – Redeploy

Po změně ENV nestačí jen uložit — musíš znovu nasadit aplikaci.

Ve Vercelu:

```text
Deployments → Redeploy
```

(nebo `vercel --prod` lokálně)

---

## Krok 9 – Test

1. Otevři https://andestay-hostel.vercel.app/accommodation  
2. Vyzkoušej všechny čtyři pokoje  
3. Po kliknutí na **Book** se musí otevřít správný pokoj v QloApps  
4. Vyplň testovací rezervaci  

**Očekávaný výsledek:**
- potvrzovací e-mail (pokud je SMTP nastavené)
- rezervace se objeví v administraci QloApps

---

## Rychlý checklist

- [ ] Krok 0: doména `book.` + plán DNS / SMTP  
- [ ] Krok 1: VPS + SSH + DNS A záznam  
- [ ] Krok 2: QloApps + SSL → `BOOKING_URL`  
- [ ] Krok 3: hotel (PEN, Lima, check-in/out, storno)  
- [ ] Krok 4: 4 room types + inventář + ceny  
- [ ] Krok 5: Pay at property  
- [ ] Krok 6: 4× `id_product`  
- [ ] Krok 7: Vercel ENV  
- [ ] Krok 8: Redeploy  
- [ ] Krok 9: test všech 4 Book tlačítek  

---

## Související v repu

- Architektura webu: `booking/README.md`
- Mapování pokojů: `src/lib/booking/config/rooms.ts`
- Hotel data (inventář / ceny): `src/lib/hotel/`
- Příklad ENV: `.env.example`
