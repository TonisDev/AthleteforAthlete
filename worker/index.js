const site = 'https://tonisdev.github.io/AthleteforAthlete';
const allowedOrigins = new Set([
  'https://tonisdev.github.io',
  'http://localhost:4321',
  'http://127.0.0.1:4321',
]);

function clean(value, max) {
  if (typeof value !== 'string') return '';
  return value.replace(/\s+/g, ' ').trim().slice(0, max);
}

function cleanBlock(value, max) {
  if (typeof value !== 'string') return '';
  return value.replace(/\r\n/g, '\n').trim().slice(0, max);
}

function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function contactError(phone, email, digits) {
  if (phone && (digits.length < 8 || digits.length > 15)) return 'Το τηλέφωνο δεν φαίνεται σωστό.';
  if (email && !validEmail(email)) return 'Το email δεν φαίνεται σωστό.';
  if (!phone && !email) return 'Άφησε τηλέφωνο ή email, για να επικοινωνήσουμε μαζί σου.';
  return '';
}

function allowedOrigin(request) {
  const origin = request.headers.get('origin');
  if (!origin) return 'https://tonisdev.github.io';
  return allowedOrigins.has(origin) ? origin : '';
}

function corsHeaders(origin) {
  return {
    'access-control-allow-origin': origin,
    'access-control-allow-methods': 'POST, OPTIONS',
    'access-control-allow-headers': 'content-type, accept',
    vary: 'Origin',
  };
}

function wantsJson(request) {
  return (request.headers.get('accept') || '').includes('application/json');
}

function answer(request, origin, ok, message, status) {
  if (!wantsJson(request)) {
    const path = ok ? '/efcharistoume/' : '/den-stalthike/';
    return Response.redirect(`${site}${path}`, 303);
  }
  return new Response(JSON.stringify({ ok, message }), {
    status: ok ? 200 : status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      ...corsHeaders(origin),
    },
  });
}

async function submit(request, env) {
  const origin = allowedOrigin(request);
  if (!origin) {
    return new Response(JSON.stringify({ ok: false, message: 'Η αποστολή δεν έγινε δεκτή.' }), {
      status: 403,
      headers: { 'content-type': 'application/json; charset=utf-8' },
    });
  }

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }

  let form;
  try {
    form = await request.formData();
  } catch {
    return answer(request, origin, false, 'Η φόρμα δεν διαβάστηκε. Δοκίμασε ξανά.', 400);
  }

  if (clean(form.get('company'), 120)) {
    return answer(request, origin, true, 'Τα λάβαμε. Θα επικοινωνήσουμε μαζί σου.', 200);
  }

  const intent = clean(form.get('intent'), 20);
  const name = clean(form.get('name'), 80);
  const phone = clean(form.get('phone'), 30);
  const email = clean(form.get('email'), 120);
  const digits = phone.replace(/\D/g, '');

  if (name.length < 2) return answer(request, origin, false, 'Συμπλήρωσε το όνομά σου.', 400);
  const missingContact = contactError(phone, email, digits);
  if (missingContact) return answer(request, origin, false, missingContact, 400);

  let text;
  if (intent === 'message') {
    const message = cleanBlock(form.get('message'), 1000);
    if (message.length < 2) return answer(request, origin, false, 'Γράψε το μήνυμά σου.', 400);
    text = [
      'Νέο μήνυμα',
      'Athlete for Athlete',
      '',
      `Όνομα: ${name}`,
      `Τηλέφωνο: ${phone || '—'}`,
      `Email: ${email || '—'}`,
      '',
      message,
    ].join('\n');
  } else {
    const area = clean(form.get('area'), 80);
    const count = Number(clean(form.get('count'), 4));
    if (area.length < 2) return answer(request, origin, false, 'Συμπλήρωσε την περιοχή σου.', 400);
    if (!Number.isInteger(count) || count < 1 || count > 20) {
      return answer(request, origin, false, 'Ο αριθμός εισιτηρίων δεν φαίνεται σωστός.', 400);
    }
    text = [
      'Νέο αίτημα εισιτηρίων',
      'Athlete for Athlete',
      '',
      `Όνομα: ${name}`,
      `Τηλέφωνο: ${phone || '—'}`,
      `Email: ${email || '—'}`,
      `Περιοχή: ${area}`,
      `Εισιτήρια: ${count}`,
    ].join('\n');
  }

  const token = env.TELEGRAM_BOT_TOKEN;
  const chatId = env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return answer(
      request,
      origin,
      false,
      'Η αποστολή δεν έχει ρυθμιστεί ακόμα.',
      503,
    );
  }

  let telegram;
  try {
    telegram = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        disable_web_page_preview: true,
      }),
    });
  } catch (error) {
    console.error('Telegram request failed', error instanceof Error ? error.message : 'unknown');
    return answer(request, origin, false, 'Δεν στάλθηκε. Δοκίμασε ξανά.', 502);
  }

  if (!telegram.ok) {
    console.error('Telegram rejected the message', telegram.status);
    return answer(request, origin, false, 'Δεν στάλθηκε. Δοκίμασε ξανά.', 502);
  }

  const thanks = intent === 'message'
    ? 'Το μήνυμα έφτασε. Θα επικοινωνήσουμε μαζί σου.'
    : 'Τα λάβαμε. Θα επικοινωνήσουμε μαζί σου.';
  return answer(request, origin, true, thanks, 200);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === 'GET' && (url.pathname === '/' || url.pathname === '')) {
      return Response.redirect(`${site}/`, 302);
    }
    if (url.pathname === '/api/tickets' && (request.method === 'POST' || request.method === 'OPTIONS')) {
      return submit(request, env);
    }
    return new Response('Not found', { status: 404 });
  },
};
