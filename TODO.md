Servidor XSS:
    Map
    Ver reports individualmente, quando clicados em cima
        ipv4
        ipv6
        user agent
        Cookie
        screenshot
        resulution of screen
        Local Storage and Session Storage content.
        Referer header.
        Non-HTTPOnly Cookies.
    DashBoard
        Search bar
        Dashboard refresh itself
    Notifications
        Email
        Discord
        Slack
        Telegram
        Ensure notifications are as close to real-time as possible.
    Documentação no git
        installar npm
        clonar repositorio
        installar modulos npm
        rodar servidor
        meter publico


Site vulneravel:
    Fazer mitigação de vulnerabilidade no site vulneravel
    Copia de site explorado vida real
    Quando acabar tudo, ir ao site https://xss.report/contact para ver o que poderia meter adicional
    Documentação no git(como utilizar o servidor(clone,ligar(php -S)))
    Meter Repositório Publico

Depois de mínimo feito:
    Payload tab
        Diferent WAF evasion paylods
        link shortner
    DashBoard
        Sort Colums
    Authentication
        Users
        Roles
        Possibility off Two-Factor Authentication (2FA) for accessing the server UI.
    Outer HTML para mapear site 
    Automatizar exploits
        file uploads
    Docker





## II. Advanced Data Exfiltration (Focus on Standout Features)
*Many advanced techniques require robust PoCs. Further research and testing will be critical here.*
- [ ] **Enhanced DOM Snapshots:**
    - [ ] Investigate libraries like `simpleneeraj/capture-dom` to serialize DOM with computed styles, potentially to SVG or a replayable format (beyond just a flat image).
    - [ ] *Further Research: Robustly capture and reconstruct the full live DOM state including all CSS rules.*
- [ ] **Detailed Browser Fingerprinting:**
    - [ ] Integrate a library like FingerprintJS (open-source version) or ThumbmarkJS.
    - [ ] Capture detailed attributes (canvas, fonts, WebGL, audio profiles, screen details, timezone, language, etc.).
    - [ ] *Further Research: Obtain a definitive list of data points collected by the chosen open-source fingerprinting library and ensure robust collection.*
- [ ] **Browser Extension Information (Opportunistic):**
    - [ ] Implement probing for `web_accessible_resources` of common/interesting extensions.
    - [ ] *Further Research: Develop safe and reliable PoCs for detecting specific extensions. Note: Interacting with or exfiltrating data *from* extensions requires targeting vulnerable extensions and is highly complex and ethically sensitive.*
- [ ] **Service Worker Exploitation for Persistence & Exfiltration:**
    - [ ] Develop payloads capable of registering a malicious Service Worker.
    - [ ] Implement Service Worker logic to:
        - [ ] Intercept future fetch requests for data exfiltration.
        - [ ] Utilize Background Sync for covert exfiltration.
        - [ ] Achieve persistence of the XSS.
    - [ ] *Further Research: Find/develop reliable PoCs for XSS-initiated Service Worker registration and data exfiltration strategies, addressing scope limitations and SW lifecycle.*
- [ ] **HTML Smuggling for Data Exfiltration:**
    - [ ] Craft payloads that package exfiltrated data into a Blob client-side.
    - [ ] Implement logic to send the Blob's *content* via XHR/fetch to your server (avoiding forced downloads).
- [ ] **Alternative OOB Channels (Requires significant research/testing):**
    - [ ] **DNS Exfiltration:**
        - [ ] Develop client-side JavaScript to encode data into subdomains and trigger DNS lookups (e.g., via image sources, script sources, or fetch to a controlled subdomain).
        - [ ] *Further Research: Find/create robust JS snippets for DNS exfil, handling chunking and encoding.*
    - [ ] **WebRTC Data Channels:**
        - [ ] Explore using WebRTC data channels for covert OOB communication.
        - [ ] *Further Research: Tackle the signaling server requirement – can it be simplified or proxied for XSS payloads? Look for PoCs.*