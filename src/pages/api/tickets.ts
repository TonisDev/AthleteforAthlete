import type { APIRoute } from 'astro';

export const prerender = false;

const phoneFallback = '694 377 3009';

function clean(value: FormDataEntryValue | null, max: number) {
  if (typeof value !== 'string') return '';
  return value.replace(/\s+/g, ' ').trim().slice(0, max);
}

function sameSite(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin) {
    const fetchSite = request.headers.get('sec-fetch-site');
    return !fetchSite || fetchSite === 'same-origin' || fetchSite === 'same-site' || fetchSite === 'none';
  }
  try {
    return new URL(origin).host === request.headers.get('host');
  } catch {
    return false;
  }
}

function wantsJson(request: Request) {
  return (request.headers.get('accept') || '').includes('application/json');
}

function answer(request: Request, ok: boolean, message: string, status: number) {
  if (!wantsJson(request)) {
    const path = ok ? '/efcharistoume' : '/den-stalthike';
    return Response.redirect(new URL(path, request.url), 303);
  }
  return new Response(JSON.stringify({ ok, message }), {
    status: ok ? 200 : status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

export const POST: APIRoute = async ({ request, locals }) => {
  if (!sameSite(request)) {
    return answer(request, false, 'Η αποστολή δεν έγινε δεκτή.', 403);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return answer(request, false, 'Η φόρμα δεν διαβάστηκε. Δοκίμασε ξανά.', 400);
  }

  if (clean(form.get('company'), 120)) {
    return answer(request, true, 'Τα λάβαμε. Θα επικοινωνήσουμε μαζί σου για τα εισιτήρια.', 200);
  }

  const name = clean(form.get('name'), 80);
  const phone = clean(form.get('phone'), 30);
  const email = clean(form.get('email'), 120);
  const area = clean(form.get('area'), 80);
  const digits = phone.replace(/\D/g, '');

  if (name.length < 2) return answer(request, false, 'Γράψε το όνομά σου.', 400);
  if (digits.length < 8 || digits.length > 15) {
    return answer(request, false, 'Το τηλέφωνο δεν φαίνεται σωστό.', 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return answer(request, false, 'Το email δεν φαίνεται σωστό.', 400);
  }
  if (area.length < 2) return answer(request, false, 'Γράψε την περιοχή σου.', 400);

  const token = locals.runtime?.env?.TELEGRAM_BOT_TOKEN;
  const chatId = locals.runtime?.env?.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return answer(
      request,
      false,
      `Η αποστολή δεν έχει ρυθμιστεί ακόμα. Πάρε μας στο ${phoneFallback}.`,
      503,
    );
  }

  const text = [
    'Νέο αίτημα εισιτηρίων',
    'Athlete for Athlete',
    '',
    `Όνομα: ${name}`,
    `Τηλέφωνο: ${phone}`,
    `Email: ${email}`,
    `Περιοχή: ${area}`,
  ].join('\n');

  let telegram: Response;
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
    return answer(request, false, `Δεν στάλθηκε. Πάρε μας στο ${phoneFallback}.`, 502);
  }

  if (!telegram.ok) {
    console.error('Telegram rejected the message', telegram.status);
    return answer(request, false, `Δεν στάλθηκε. Πάρε μας στο ${phoneFallback}.`, 502);
  }

  return answer(request, true, 'Τα λάβαμε. Θα επικοινωνήσουμε μαζί σου για τα εισιτήρια.', 200);
};
