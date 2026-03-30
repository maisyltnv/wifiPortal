# WiFi Captive Portal (Next.js)

Production-oriented guest WiFi captive portal UI migrated from a classic ASP.NET Razor flow. Visitors see a short sponsored screen, register, your backend stores their details, then the browser posts Aruba authentication to release internet access.

## Install

```bash
npm install
```

## Run the development server

```bash
npm run dev
```

Open [http://localhost:3000/wifi](http://localhost:3000/wifi) (the root URL redirects to `/wifi`).

## Configure environment variables

Copy the example file and adjust values for your deployment:

```bash
copy .env.local.example .env.local
```

On macOS/Linux:

```bash
cp .env.local.example .env.local
```

| Variable | Purpose |
| -------- | ------- |
| `NEXT_PUBLIC_ARUBA_ACTION` | Full URL for the hidden form `action` (Aruba `swarm.cgi`). Must be public so the browser can POST there. |
| `ARUBA_USER` | Guest username sent as the hidden field `user`. Read on the **server** and passed into the client bundle via props (same practical exposure as any value used in the submitted form). |
| `ARUBA_PASSWORD` | Guest password for hidden field `password`. |
| `WIFI_SAVE_ENDPOINT` | Your internal `SaveAndConnect` URL; used **only** by the Next.js API route from the server. |

Restart `npm run dev` after changing `.env.local`.

## Example captive portal URL

When the access point or controller redirects the client to your portal, it typically appends query parameters:

```text
/wifi?mac=xx:xx:xx:xx&ip=10.150.1.25&apname=AP01&url=http://62.171.159.75/
```

Expected parameters:

- `mac` — client MAC
- `ip` — client IP
- `apname` — access point name
- `url` — post-auth redirect target (mapped to the Aruba hidden field `url`)

If any are missing, the page still works but shows a **warning** explaining which keys are absent; registration can proceed, but Aruba or your network may reject incomplete data.

## Login flow

1. **Splash** — Sponsored promotion card on a dark background with a **10-second** circular countdown badge. The user can tap **Skip Now** to continue immediately.
2. **Registration** — Collects full name (required), phone (required), and optional destination/address.
3. **Save** — The browser sends JSON to `POST /api/wifi-login`. The API route converts the payload to `application/x-www-form-urlencoded` and forwards it to `WIFI_SAVE_ENDPOINT` (for example `http://10.150.1.47/Wifi/SaveAndConnect`) with fields: `mac`, `ip`, `apname`, `name`, `phone`, `address`.
4. **Aruba** — On a successful save response, the app programmatically submits a **hidden HTML form** (`POST`) to Aruba with `cmd=authenticate`, the captive parameters, credentials from env, and `url` for redirect after success.
5. **Redirect** — Aruba completes authentication and sends the user according to the submitted `url` field.

## CORS and why the Next.js API route exists

Browsers enforce the **Same-Origin Policy** for JavaScript-initiated requests. Your guest portal may be hosted on a public hostname (or HTTPS), while the registration endpoint is often a **private IP** (for example `10.150.1.47`) that does not send CORS headers allowing browser `fetch` from your site.

Calling `SaveAndConnect` from **server-side** Next.js code avoids that browser restriction: the request is made from the Node runtime to your internal network, not from the user’s browser. Only your JSON call to `/api/wifi-login` hits the same origin as the portal page.

## Hidden Aruba form submission

The portal renders a normal HTML `<form method="POST" action="...">` with hidden inputs. It is not styled and is not meant for users to see. After a successful save:

1. React holds a `ref` to that form.
2. Code calls `formRef.current.submit()` — a **native** form submit (not `fetch`).
3. The browser navigates to Aruba and includes the POST body, matching the behavior of legacy server-rendered captive pages.

This full-page POST is important because Aruba (and many controllers) expect a traditional form post from the client context, not an XHR.

## Production build

```bash
npm run build
npm start
```

Ensure the host running Node can reach `WIFI_SAVE_ENDPOINT` and that firewall rules permit that traffic.

## Project layout

- `app/wifi/page.tsx` — Reads query params and env, renders the client portal shell.
- `app/api/wifi-login/route.ts` — Proxies registration to your backend.
- `components/wifi/` — Splash, login, and orchestration.
- `lib/utils.ts` — Tailwind class helper and query param parsing.
