# Athlete for Athlete

Μονοσέλιδη σελίδα για τη βραδιά. Όλο το περιεχόμενο και η όψη αλλάζουν από το `src/data/site.json`.

## Τι επεξεργάζεσαι

Ένα αρχείο: `src/data/site.json`. Τα ίδια ονόματα πεδίων χρησιμοποιούνται και στη σελίδα.

Πάνω πάνω: `title`, `description`, `city`, `date`, `time`, `venue`, `address`, `mapUrl`, `ticketPrice`, `ticketGoal`, `ticketsSold`, `ticketsUpdatedAt`.

Η ημερομηνία και η ώρα είναι τοπική ώρα Θεσσαλονίκης, χωριστά: `"date": "2026-11-01"` και `"time": "20:00"`. Ο στόχος `0` κρύβει τη μπάρα και δείχνει παύλα.

`hero` — οι δύο γραμμές του τίτλου, το `bridge`, το `lede`, το κείμενο του κουμπιού `cta`.

`nav` — τα κουμπιά πάνω δεξιά. Κάθε ένα έχει `id` και `label`. Το `id` πρέπει να είναι το ίδιο με το `id` του block που δείχνει.

`blocks` — κάθε ενότητα έχει τα ίδια πεδία: `id`, `kicker`, `title`, `text`, `empty`. Άδειο πεδίο δεν τυπώνεται. Το `empty` φαίνεται όταν η λίστα από κάτω δεν έχει ονόματα.

`organizers`, `clubs` — λίστες με `{ "name": "..." }`.

`athletes` — λίστες με το ίδιο `name`, συν `discipline`, `achievements`, `image`:

```json
{
  "name": "Όνομα",
  "discipline": "Στίβος",
  "achievements": ["Διάκριση"],
  "image": "/athletes/photo.jpg"
}
```

Η φωτογραφία μπαίνει στο `public/athletes/`. Άδειο `image` δείχνει τα αρχικά.

`clubs` — ένα όνομα ανά σύλλογο που στηρίζεται:

```json
{ "name": "Όνομα συλλόγου" }
```

`sponsors` — η λίστα φαίνεται πάνω στην ενότητα Χορηγοί, πριν από το «Θες να γίνεις χορηγός;». Μικρότερο `rank` σημαίνει πιο ψηλά. Το `size` είναι `large`, `medium` ή `small`. Το λογότυπο μπαίνει στο `public/sponsors/` και γράφεις το path στο `logo`.

```json
{
  "name": "Όνομα",
  "offer": "Τι προσφέρει",
  "url": "https://example.gr",
  "logo": "/sponsors/logo.svg",
  "rank": 1,
  "size": "large"
}
```

`salePoints` — `name`, `area`, `address`, `hours`, `mapUrl`.

`contact` — `phone`, `phoneDisplay`, `email`. Άδειο `phone` ή email σε `example.com` φαίνεται ως παράδειγμα, χωρίς σύνδεσμο. Μόλις μπει κανονικό νούμερο (τουλάχιστον 10 ψηφία) και κανονικό email, γίνονται σύνδεσμοι.

`look.sections` — φόντο κάθε ενότητας: `hero`, `athletes`, `clubs`, `transparency`, `tickets`, `sponsors`, `contact`. Κάθε μία έχει `color`, `tone` (`dark` ή `light`), και προαιρετική εικόνα με `image`, `position`, `size`, `opacity`. Η εικόνα μπαίνει στο `public/photos/`. Το `countdownWash` είναι το ανοιχτό χρώμα πίσω από τους αριθμούς της αντίστροφης μέτρησης.

`look` — χρώματα και φόντο:

- `backgroundColor`, `ink`, `paper`, `lane`, `button` σε μορφή `#100e0c`
- `backgroundImage`: path όπως `"/photos/fondo.jpg"` ή άδειο
- `backgroundPosition`: π.χ. `"center center"` ή `"center 20%"`
- `backgroundSize`: `"cover"` ή `"contain"`
- `backgroundRepeat`: `"no-repeat"`
- `backgroundOpacity`: αριθμός από `0` έως `1`

Η εικόνα φόντου μπαίνει στο `public/photos/`.

`countdown`, `stats`, `labels`, `form`, `notices` — οι μικρές λέξεις της σελίδας, με τα ονόματα που φαίνονται στο αρχείο.

## Τοπικά

```sh
npm install
npm run dev
```

Η σελίδα ανοίγει στο `http://localhost:4321/AthleteforAthlete/`.

## Πού ζει τι

Η σελίδα δημοσιεύεται στο GitHub Pages, στο branch `gh-pages`: `https://tonisdev.github.io/AthleteforAthlete/`.

Μετά από αλλαγή:

```sh
npm run build
npm run publish:pages
```

Ο worker `athlete-for-athlete` δέχεται μόνο τη φόρμα και στέλνει στο Telegram. Τα secrets `TELEGRAM_BOT_TOKEN` και `TELEGRAM_CHAT_ID` μένουν εκεί. Βάση δεν υπάρχει.

Η μία φορά που ανεβαίνει ο worker, από αυτόν τον φάκελο και με Node 22:

```sh
nvm use 22
npx wrangler login
npm run deploy:worker
```

Μετά, αλλαγές στο `site.json` δημοσιεύονται με `npm run build` και `npm run publish:pages`. Δεν ξαναχρειάζεται Wrangler.
