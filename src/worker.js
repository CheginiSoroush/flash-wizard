// ⚡ Flash Wizard Worker — استاتیک از assets + پروکسی API کلادفلر
// (api.cloudflare.com به مرورگرهای cross-origin CORS نمی‌ده — برای همین
//  ویزارد یه Worker ئه و API از داخل شبکه کلادفلر صدا زده می‌شه)
const CF_API = 'https://api.cloudflare.com/client/v4';
const PANEL_RELEASE = 'https://github.com/CheginiSoroush/flash-panel/releases/latest/download/worker.js';

export default {
    async fetch(request) {
        const url = new URL(request.url);

        // ---- پروکسی Cloudflare API ----
        // /api/user/tokens/verify → https://api.cloudflare.com/client/v4/user/tokens/verify
        if (url.pathname.startsWith('/api/')) {
            const target = CF_API + url.pathname.slice(4) + url.search;

            const headers = new Headers();
            for (const name of ['authorization', 'content-type']) {
                const value = request.headers.get(name);
                if (value) headers.set(name, value);
            }

            const init = { method: request.method, headers };
            if (request.method !== 'GET' && request.method !== 'HEAD') {
                // JSON و FormData رو شفاف پاس می‌ده (Content-Type و boundary حفظ می‌شه)
                init.body = await request.arrayBuffer();
            }

            try {
                const res = await fetch(target, init);
                return new Response(res.body, {
                    status: res.status,
                    headers: { 'Content-Type': 'application/json' }
                });
            } catch {
                return Response.json(
                    { success: false, errors: [{ message: 'wizard could not reach Cloudflare API' }] },
                    { status: 502 }
                );
            }
        }

        // ---- دانلود سورس پنل (release) — از شبکه کلادفلر ----
        if (url.pathname === '/release') {
            try {
                const res = await fetch(PANEL_RELEASE, { redirect: 'follow' });
                return new Response(res.body, {
                    status: res.status,
                    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
                });
            } catch {
                return new Response('release fetch failed', { status: 502 });
            }
        }

        return new Response('Not Found', { status: 404 });
    }
};
