# Athlete for Athlete

Μονοσέλιδη σελίδα για τη βραδιά. Το περιεχόμενο αλλάζει από τα αρχεία στο `src/data`. Κάθε αλλαγή ανεβαίνει με push και η σελίδα ξαναχτίζεται.

## Τι επεξεργάζεσαι

`src/data/event.json` — ημερομηνία, ώρα, χώρος, διεύθυνση, σύνδεσμος χάρτη, τιμή, εισιτήρια που έχουν πουληθεί, στόχος, ημερομηνία ενημέρωσης του μετρητή.

Η ημερομηνία και η ώρα είναι τοπική ώρα Θεσσαλονίκης, χωριστά: `"date": "2026-11-01"` και `"time": "20:00"`. Ο στόχος `0` κρύβει τη μπάρα και δείχνει παύλα. Μόλις κλειδώσει ο αριθμός, βάλε τον στόχο και τα πουλημένα εισιτήρια.

`src/data/athletes.json` — όνομα, αγώνισμα, διακρίσεις, φωτογραφία. Η φωτογραφία μπαίνει στο `public/athletes/` και στο αρχείο γράφεις το path, για παράδειγμα `"/athletes/iordanis.jpg"`. Άδειο `image` δείχνει τα αρχικά.

`src/data/sponsors.json` — άδεια λίστα μέχρι να υπάρξει χορηγός. Παράδειγμα εγγραφής:

```json
{
  "name": "Όνομα επιχείρησης",
  "offer": "Αθλητικός εξοπλισμός",
  "url": "https://example.gr",
  "logo": "/sponsors/logo.svg"
}
```

Το λογότυπο μπαίνει στο `public/sponsors/`.

`src/data/salePoints.json` — σημεία παραλαβής. Παράδειγμα:

```json
{
  "name": "Όνομα σημείου",
  "area": "Καλαμαριά",
  "address": "Οδός 1",
  "hours": "17:00–21:00",
  "mapUrl": ""
}
```

## Τοπικά

```sh
npm install
npm run dev
```

Η σελίδα ανοίγει στο `http://localhost:4321`. Χρειάζεται Node 20 ή νεότερο.

Σε αυτό το μηχάνημα η φόρμα δεν στέλνει στο Telegram από το τοπικό server. Το μήνυμα φεύγει αφού η σελίδα ανέβει στο Cloudflare και μπουν τα secrets. Μέχρι τότε η φόρμα απαντά ότι η αποστολή δεν έχει ρυθμιστεί ακόμα, και δείχνει το τηλέφωνο.

## Cloudflare

Η σελίδα ανεβαίνει στο Cloudflare Pages. Το API της φόρμας ταξιδεύει μαζί της, στο `dist/_worker.js`. Δεν φτιάχνεις δεύτερο Worker και δεν χρειάζεται βάση. Το Telegram το καλεί η διαδρομή `/api/tickets`.

1. Στο Cloudflare: **Workers & Pages → Create → Pages → Connect to Git**.
2. Διάλεξε το repository `TonisDev/AthleteforAthlete`.
3. Production branch: `main`.
4. Framework preset: Astro.
5. Build command: `npm run build`
6. Build output directory: `dist`
7. Environment variable `NODE_VERSION` = `22`, αν στο build ζητήσει νεότερο Node.
8. Μετά το πρώτο deploy: **Settings → Variables and Secrets**. Πρόσθεσε, και για Production, τα `TELEGRAM_BOT_TOKEN` και `TELEGRAM_CHAT_ID` ως encrypted. Το chat id ομάδας είναι αρνητικός αριθμός· βάλε και το μείον.
9. Κάνε **Retry deployment** ώστε το function να δει τα secrets, και δοκίμασε τη φόρμα.

Το token δεν μπαίνει σε αρχείο του repo.
