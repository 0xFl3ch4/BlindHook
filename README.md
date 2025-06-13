# BlindHook

BlindHook is a web-based XSS payload management and tracking tool. It allows penetration testers and security researchers to capture and analyze data from successful reflected or stored XSS injections on target browsers.

## 📌 Features

- 📊 **Dashboard Panel** to view incoming XSS payload requests
- 🍪 Collects `document.cookie`, User-Agent, IP address, target URL, and timestamp
- 📸 Captures and stores screenshots (if available)
- 💣 Built-in payload generator
- 🧭 Tabbed navigation: Dashboard, Payloads, Notifications (coming soon), and About
- 🎨 Black and yellow themed UI built with Tailwind CSS
- 🧩 Modular EJS views with reusable navbar

## ⚙️ Tech Stack

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [EJS](https://ejs.co/)
- [Tailwind CSS](https://tailwindcss.com/) 
- [SQLite3](https://www.sqlite.org/)

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/BlindHook.git
cd BlindHook
```
### 2. Install Dependencies
```npm install```

### 3. Start the Server
```node server.js```
