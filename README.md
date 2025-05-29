# BlindHook
Web server for blind xss exploitation

# Funcionalidades para o Servidor Blind XSS

## 🧩 Coleta de Dados
- [ ] Captura de `document.cookie`
- [ ] Captura de `window.location.href`
- [ ] Captura de `document.referrer`
- [ ] Captura do `User-Agent`
- [ ] Captura de `localStorage` e `sessionStorage`
- [ ] Coleta do IP da vítima
- [ ] Geolocalização aproximada (via IP)
- [ ] Fingerprinting do navegador (resolução, timezone, idioma)

## 🎯 Rastreamento e Identificação
- [ ] ID único por payload (`?id=abc123`)
- [ ] Identificação do ponto de injeção
- [ ] Tags customizadas para cada payload (ex: "form_contato", "admin_painel")
- [ ] Logs com data e hora da execução

## 🛰️ Comunicação e Notificação
- [ ] Integração com Discord Webhooks
- [ ] Integração com Telegram Bot
- [ ] Envio de email quando houver execução
- [ ] Notificações via WebSocket em tempo real (modo admin)

## 🧪 Payloads e Injeção
- [ ] Geração automática de payloads XSS
- [ ] Obfuscação de payloads (Base64, Unicode, eval)
- [ ] Múltiplos tipos de payload (script externo, evento onerror, iframe)
- [ ] Teste de WAF bypasses

## 🕵️ Modo Stealth (Discrição)
- [ ] Uso de `navigator.sendBeacon()` para coleta silenciosa
- [ ] Zero console logs visíveis
- [ ] Zero alertas ou interações com a vítima
- [ ] Requisições assíncronas sem bloquear a página

## 🛠️ Painel de Controle
- [ ] Dashboard com lista de execuções recentes
- [ ] Filtro por ID, IP, data ou tag
- [ ] Visualização dos dados brutos coletados
- [ ] Exportação dos dados (.json, .csv)
- [ ] Proteção com login e senha

## 🔐 Segurança
- [ ] Autenticação básica no painel admin
- [ ] Rate limiting em endpoints de coleta
- [ ] Validação de origem/IP das vítimas (opcional)
- [ ] Logs de acesso ao painel

## 📊 Visualizações
- [ ] Gráficos de execuções por país
- [ ] Gráficos por navegador ou SO
- [ ] Mapa com pins (usando Leaflet.js ou Google Maps)
- [ ] Linha do tempo de execuções

## 🧰 Extras Técnicos
- [ ] API REST para integração com outras ferramentas
- [ ] CLI para geração de payloads
- [ ] Auto-clean de execuções antigas
- [ ] Sistema de plugins (para futuras expansões)

