// ⚡ Flash Wizard — v2: استقرار روی دامنه‌ی سفارشی + خاموشی workers.dev
const API = '/api';
const PANEL_RELEASE = '/release';

const state = { token: '', accountId: '', email: '', subdomain: '', zoneId: '', zoneName: '' };

const $ = (id) => document.getElementById(id);
const show = (id) => $(id).classList.remove('hidden');

function msg(id, text, ok) {
    const el = $(id);
    el.textContent = text || '';
    el.className = 'msg' + (ok ? ' ok' : text ? ' err' : '');
}

function log(text) {
    const line = document.createElement('div');
    line.textContent = text;
    $('log').appendChild(line);
    $('log').scrollTop = $('log').scrollHeight;
}

async function cf(path, options = {}) {
    let res;
    try {
        res = await fetch(API + path, {
            ...options,
            headers: {
                Authorization: `Bearer ${state.token}`,
                ...(options.body && typeof options.body === 'string'
                    ? { 'Content-Type': 'application/json' } : {}),
            },
        });
    } catch {
        throw new Error('ارتباط با ویزارد برقرار نشد — اتصالت رو چک کن');
    }
    const data = await res.json().catch(() => ({}));
    if (!data.success) {
        throw new Error(data?.errors?.[0]?.message || `HTTP ${res.status}`);
    }
    return data.result;
}

// ---------- تولیدکننده‌ها ----------
const genUUID = () => crypto.randomUUID();
const genPass = () => btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(9))));
const genPath = () => [...crypto.getRandomValues(new Uint8Array(6))]
    .map(b => b.toString(16).padStart(2, '0')).join('');

// ---------- گام ۱: توکن ----------
 $('btn-verify').addEventListener('click', async () => {
    const token = $('token').value.trim();
    if (!token) return msg('msg-1', 'توکن رو وارد کن');

    state.token = token;
    $('btn-verify').disabled = true;
    msg('msg-1', 'در حال بررسی توکن…');

    try {
        const r = await cf('/user/tokens/verify');
        msg('msg-1', `✓ توکن معتبر و فعال (${r.status})`, true);
        loadAccounts();
    } catch (e) {
        const bad = /auth/i.test(e.message) || /10000|9106/.test(e.message);
        msg('msg-1', bad
            ? '✗ توکن نامعتبره — از صفحه API Tokens توکن جدید بساز (قالب Edit Cloudflare Workers)'
            : '✗ ' + e.message);
        $('btn-verify').disabled = false;
    }
});

// ---------- گام ۲: اکانت + دامنه‌ها ----------
async function loadAccounts() {
    show('step-2');
    $('accounts').textContent = 'در حال دریافت اکانت‌ها…';
    try {
        const accounts = await cf('/accounts');
        if (!accounts.length) throw new Error('اکانتی پیدا نشد');

        state.accountId = accounts[0].id;
        if (accounts.length === 1) {
            $('accounts').innerHTML = `اکانت شناسایی شد: <b>${accounts[0].name}</b> ✓`;
        } else {
            $('accounts').innerHTML = '<select id="acc-sel">' +
                accounts.map(a => `<option value="${a.id}">${a.name}</option>`).join('') +
                '</select>';
            $('acc-sel').addEventListener('change', e => state.accountId = e.target.value);
        }

        // دامنه‌های اکانت — استقرار امن روی دامنه‌ی خود کاربر
        const zones = await cf('/zones?per_page=50');
        const sel = $('zone-select');
        if (!zones.length) {
            sel.style.display = 'none';
            $('zone-hint').innerHTML = '⚠️ هیچ دامنه‌ای توی این اکانت نیست.<br>' +
                'اول دامنه‌ت رو از <a href="https://dash.cloudflare.com" target="_blank" rel="noopener">داشبورد Cloudflare</a> اضافه کن ' +
                '(Add a domain — nameserver ها باید به Cloudflare اشاره کنن و وضعیتش Active بشه)، ' +
                'بعد برگرد و این صفحه رو رفرش کن.';
        } else {
            sel.style.display = '';
            sel.innerHTML = zones.map(z => `<option value="${z.id}">${z.name}</option>`).join('');
            state.zoneId = zones[0].id;
            state.zoneName = zones[0].name;
            sel.onchange = () => {
                state.zoneId = sel.value;
                state.zoneName = sel.selectedOptions[0].textContent;
            };
        }

        const m = (accounts[0].name || '').match(/[\w.+-]+@[\w.-]+/);
        if (m && !$('email').value) $('email').value = m[0];
    } catch (e) {
        msg('msg-2', '✗ ' + e.message);
    }
}

 $('btn-account').addEventListener('click', () => {
    const email = $('email').value.trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return msg('msg-2', 'یک ایمیل معتبر وارد کن');
    state.email = email;
    msg('msg-2', '');
    show('step-3');
});

// ---------- گام ۳: تنظیمات + نصب ----------
document.querySelectorAll('.regen').forEach(btn => {
    btn.addEventListener('click', () => {
        const t = btn.dataset.target;
        $(t).value = t === 'uuid' ? genUUID() : t === 'trpass' ? genPass() : genPath();
    });
});

 $('uuid').value = genUUID();
 $('trpass').value = genPass();
 $('secpath').value = genPath();

 $('btn-deploy').addEventListener('click', async () => {
    const name = $('wname').value.trim();
    if (!/^[a-z0-9][a-z0-9-]{0,38}$/.test(name))
        return msg('msg-3', 'نام worker فقط حروف کوچک انگلیسی، عدد و خط تیره');

    if (!state.zoneId)
        return msg('msg-3', 'اول دامنه‌ت رو به اکانت Cloudflare اضافه کن و صفحه رو رفرش کن');

    const prefix = ($('host-prefix').value.trim() || 'panel').toLowerCase();
    if (!/^[a-z0-9]([a-z0-9-]{0,30})$/.test(prefix))
        return msg('msg-3', 'پیشوند زیردامنه فقط حروف کوچک، عدد و خط تیره');

    const hostname = `${prefix}.${state.zoneName}`;

    const settings = {
        accID: state.accountId,
        accEmail: state.email,
        apiToken: state.token,
        vlUUID: $('uuid').value,
        trPass: $('trpass').value,
        securePath: $('secpath').value,
        proxyIpMode: 'proxyip',
        proxyIPs: [],
        prefixes: [],
        mainDomain: '', // نام داخلی برای self-update — پر می‌شه در گام ۳
        fallback: 'www.speedtest.net',
        dohUrl: ''
    };

    $('btn-deploy').disabled = true;
    msg('msg-3', '');
    show('step-4');
    $('log').innerHTML = '';

    try {
        log('[1/8] Checking existing workers…');
        const scripts = await cf(`/accounts/${state.accountId}/workers/scripts`);
        const conflict = scripts.some(s => s.id === name);
        if (conflict && !confirm(
            '⚠️ Worker «' + name + '» از قبل وجود داره!\n\n' +
            'ادامه باعث بازنویسی (overwrite) کاملش می‌شه.\n\nادامه می‌دی؟'
        )) {
            throw new Error('لغو شد — یه اسم دیگه انتخاب کن');
        }
        log(conflict ? '      exists — user confirmed overwrite' : '      name is free');

        log('[2/8] Creating KV namespace…');
        const kv = await cf(`/accounts/${state.accountId}/storage/kv/namespaces`, {
            method: 'POST',
            body: JSON.stringify({ title: 'flash-panel-kv' })
        });
        log(`      done — ${kv.id}`);

        log('[3/8] Getting account subdomain…');
        const sub = await cf(`/accounts/${state.accountId}/workers/subdomain`);
        state.subdomain = sub.subdomain;
        settings.mainDomain = `${name}.${state.subdomain}.workers.dev`;
        log(`      internal name: ${settings.mainDomain}`);

        log('[4/8] Downloading Flash Panel (latest release)…');
        const src = await fetch(PANEL_RELEASE);
        if (!src.ok) throw new Error('دانلود سورس ناموفق — دوباره تلاش کن');
        const workerJs = await src.text();
        log(`      ${Math.round(workerJs.length / 1024)} KB`);

        log('[5/8] Building final script…');
        const script =
            `Object.assign(globalThis, ${JSON.stringify({ EMBEDED_SETTINGS: settings })});\n` +
            workerJs;

        log('[6/8] Uploading worker…');
        const metadata = {
            main_module: 'worker.js',
            compatibility_date: '2025-06-01',
            compatibility_flags: ['nodejs_compat'],
            bindings: [{ type: 'kv_namespace', name: 'kv', namespace_id: kv.id }]
        };
        const form = new FormData();
        form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
        form.append('worker.js', new Blob([script], { type: 'application/javascript+module' }), 'worker.js');
        await cf(`/accounts/${state.accountId}/workers/scripts/${name}`, { method: 'PUT', body: form });
        log('      deployed');

        log('[7/8] Attaching your domain…');
        await cf(`/accounts/${state.accountId}/workers/domains`, {
            method: 'PUT',
            body: JSON.stringify({ hostname, service: name })
        });
        log(`      ${hostname} ✓`);

        log('[8/8] Disabling workers.dev route…');
        const disableForm = new FormData();
        disableForm.append('settings', new Blob([JSON.stringify({ workers_dev: false })], { type: 'application/json' }));
        await cf(`/accounts/${state.accountId}/workers/scripts/${name}/settings`, {
            method: 'PATCH',
            body: disableForm
        });
        log('      ✓ — panel is ONLY on your domain');

        const url = `https://${hostname}/${settings.securePath}/panel`;
        $('panel-url').href = url;
        $('panel-url').textContent = url;
        show('result');
        log('done — enjoy!');
    } catch (e) {
        log('error: ' + e.message);
        msg('msg-3', '✗ ' + e.message);
    }
    $('btn-deploy').disabled = false;
});

 $('btn-copy').addEventListener('click', async () => {
    await navigator.clipboard.writeText($('panel-url').href);
    $('btn-copy').textContent = '✓ کپی شد';
});
