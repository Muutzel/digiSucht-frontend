# Local Development Setup

Diese Datei beschreibt welche Änderungen nötig sind um das Projekt lokal zu starten,
und welche davon **nicht** ins Repo gehören (nur für lokale Entwicklung gedacht sind).

---

## Voraussetzungen

- Node.js >= 18.16.1 (getestet mit v22.11.0)
- npm
- Windows: PowerShell

---

## Schritt 1: `.env` Datei anlegen

Kopiere `.env.sample` nach `.env` und setze folgende Werte:

```env
PORT=9000
REACT_APP_API_URL=app-staging.suchtberatung.digital
REACT_APP_DISABLE_2FA_DUTY=1
EXTENSION_DIR=./src/extensions/
CSRF_WHITELIST_HEADER_FOR_LOCAL_DEVELOPMENT=X-WHITELIST-HEADER
STORAGE_PATH=./.storage
REACT_APP_DISABLE_ERROR_BOUNDARY=1

# Weblate LEER lassen, sonst Proxy-Fehler beim Start:
LOCALIZATION_WEBLATE_HOST=
```

`.env` ist in `.gitignore` — nie committen.

---

## Schritt 2: Dependencies installieren

```powershell
npm install --ignore-scripts
```

`--ignore-scripts` überspringt den husky postinstall Hook (der ohne git-Setup fehlschlägt).

---

## Schritt 3: HOST-Variable setzen

Der Webpack Dev Server bindet sonst an `0.0.0.0` was auf Windows nicht erreichbar ist:

```powershell
$env:HOST="localhost"
```

Diese Variable muss in **jeder neuen PowerShell-Session** gesetzt werden, bevor `npm run dev` läuft.

---

## Schritt 4: App starten

```powershell
npm run dev
```

App läuft auf **http://localhost:9000**

---

## Fixes die permanent ins Repo gehören

Diese Änderungen beheben echte Bugs und müssen im Repo bleiben (auch für CI/Docker):

### 1. `config/webpack.config.js` — Windows-Pfade in SCSS
In der `additionalData`-Funktion des sass-loaders müssen Windows-Backslashes in Forward-Slashes umgewandelt werden, sonst schlägt der SCSS-Import auf Windows fehl:

```js
additionalData: (content) => {
    let newContent = `@import "${path.resolve(
        paths.appSrc,
        'resources/styles/settings.scss'
    ).replace(/\\/g, '/')}"; `;
    const settingsPathExtensions = path.resolve(
        paths.appExtensions,
        'resources/styles/settings.scss'
    );
    if (fs.existsSync(settingsPathExtensions)) {
        newContent += `@import "${settingsPathExtensions.replace(/\\/g, '/')}"; `;
    }
    return `${newContent} ${content}`;
},
```

### 2. `src/resources/styles/settings.scss` — fehlende Variable
`$grid-base-half` fehlte in der Variable-Liste. Ergänzt nach `$grid-base`:

```scss
$grid-base: 8px;
$grid-base-half: $grid-base * 0.5;  // <-- neu
$grid-base-two: $grid-base * 2;
```

### 3. `src/extensions/components/registration/RegistrationLoadingOverlay/index.tsx` — Apostroph in String
`'Gleich geht's weiter…'` bricht den String wegen des Apostrophs in `geht's`.
Fix: Doppelte Anführungszeichen für diese Strings:

```tsx
"Gleich geht's weiter…",
```

### 4. `src/components/messageSubmitInterface/messageSubmitInterfaceComponent.tsx:1022`
`toggleAbsentMessage(e)` wurde mit einem Argument aufgerufen, die Funktion erwartet 0.
Fix: Argument entfernen:

```tsx
toggleAbsentMessage();
```

### 5. `src/extensions/components/registration/UsernameFormField/index.tsx`
`RegistrationUsername` erwartet `onEmailChange` und `onEmailValidityChange`, die fehlten.
Fix: No-op-Handler ergänzt:

```tsx
onEmailChange={() => null}
onEmailValidityChange={() => null}
```

### 6. `proxy/routes/weblate.js` — Windows-Pfade in Routen
`path.join()` gibt auf Windows Backslashes zurück, die als Express-Route ungültig sind.
Fix in Zeile ~204:

```js
].map(({ path: route, ...routeConfig }) =>
    route
        ? { ...routeConfig, path: (weblatePath + route).replace(/\\/g, '/') }
        : routeConfig
);
```

---

## Fixes NUR für lokale Entwicklung (nicht für Staging/Production)

Diese Änderungen sind nur lokal nötig und sollten **nicht** in den CI/Docker-Build einfließen
oder müssen vor dem Merge rückgängig gemacht / bereinigt werden:

### 1. `scripts/start.js` — WDS API-Fix + ECONNRESET-Handler

**Problem 1:** webpack-dev-server v4 hat kein `startCallback()` mehr, nur noch `start()` (async).
Das Original-Script nutzt `startCallback()` → Server startet lautlos nie.

```js
// ALT (funktioniert nicht mit WDS v4):
devServer.startCallback(() => { ... });

// NEU:
devServer.start().then(() => { ... });
```

**Problem 2:** ECONNRESET-Fehler vom HMR-WebSocket crashen den Dev-Server wenn der Browser
nach einem Login-Redirect die Verbindung trennt.

```js
process.on('uncaughtException', (err) => {
    if (err.code === 'ECONNRESET') {
        console.warn('[dev] ECONNRESET (client disconnected, ignoring)');
        return;
    }
    throw err;
});
```

### 2. `proxy/routes/backend.js` — Backend-Proxy für lokale Entwicklung (neue Datei)

Im Webpack Dev Server gibt es keinen automatischen Proxy zum Staging-Backend.
Diese Datei leitet alle API-Requests an `REACT_APP_API_URL` weiter:

```js
// proxy/routes/backend.js
const { createProxyMiddleware } = require('http-proxy-middleware');
const apiUrl = process.env.REACT_APP_API_URL;

module.exports = () => {
    if (!apiUrl) return [];
    const target = apiUrl.startsWith('http') ? apiUrl : `https://${apiUrl}`;
    return [{
        name: 'backend-proxy',
        middleware: createProxyMiddleware({
            target,
            changeOrigin: true,
            secure: false,
            xfwd: true,
            on: {
                error: (err, req, res) => {
                    console.error('[backend-proxy] error:', err.message);
                    if (res && !res.headersSent) {
                        res.writeHead(502, { 'Content-Type': 'text/plain' });
                        res.end('Proxy error: ' + err.message);
                    }
                }
            }
        })
    }];
};
```

### 3. `proxy/routes/index.js` — backend.js einbinden

```js
const backendProxy = require('./backend');
// ...
module.exports = (storagePath) =>
    [...settingsProxy(), ...weblateProxy(storagePath), ...backendProxy()]
```

---

## Docker Image bauen (für Staging/Production)

Vor `docker build` muss der Production Build existieren:

```powershell
npm run build
docker build -t digisucht-frontend:local .
```

Der `build/`-Ordner wird vom Dockerfile in das Image kopiert.
Die Umgebungsvariablen (vor allem `REACT_APP_API_URL`) müssen beim
`docker run` bzw. im Kubernetes-Deployment als Env-Variablen gesetzt werden.

---

## Bekannte Warnungen (können ignoriert werden)

- `Browserslist: caniuse-lite is outdated` — kosmetisch, kein Einfluss auf den Build
- `babel-preset-react-app` / `@babel/plugin-proposal-private-property-in-object` — CRA-Bug, funktioniert trotzdem
- Source-Map-Warnungen von `intro.js` und `fastestsmallesttextencoderdecoder` — fehlende `.map`-Dateien in node_modules, unkritisch
- ESLint: `react-hooks/exhaustive-deps` in `AuthenticatedApp.tsx` — pre-existing, unkritisch
