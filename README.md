<div align="center">

# 🪄 Flash Wizard

**Deploy Flash Panel on your Cloudflare account in 60 seconds — no CLI needed.**

[🇮🇷 فارسی](README_fa.md)

![Workers](https://img.shields.io/badge/Platform-Cloudflare%20Workers-F38020?style=flat-square&logo=cloudflare)
![License](https://img.shields.io/badge/License-GPL--3.0-blue?style=flat-square)

</div>

---

Flash Wizard is a browser-based deployment tool for [Flash Panel](https://github.com/CheginiSoroush/flash-panel). It handles everything — KV creation, worker upload, custom domain attachment — with just an API token.

## ✨ How It Works

```
Browser → Flash Wizard → Cloudflare API
   ↓         ↓              ↓
 Token   (stays in      (your panel
 input   your browser)   gets deployed)
```

**Security model:** Your API token never leaves your browser. All requests go directly from your browser to Cloudflare's API. No server stores your credentials.

## 🚀 Quick Start

1. Open **[Flash Wizard](https://flash-wizard.imsoroush.workers.dev/)**
2. Create an API token ([here](https://dash.cloudflare.com/profile/api-tokens) — template: **Edit Cloudflare Workers**)
3. Select your domain
4. Click **Install** 🚀

> ⚠️ **Prerequisites:** A domain added to your Cloudflare account. Custom domains protect your account from automated abuse reports on `*.workers.dev`.

## ✨ Features

| | |
|---|---|
| 🪄 **60-second deploy** | Token → Domain → Done |
| 🔒 **Token stays local** | Zero data collection |
| 🌐 **Custom domain only** | No workers.dev exposure |
| ⚠️ **Overwrite protection** | Warns before replacing existing workers |
| 🇮🇷 **Persian RTL interface** | Built for Persian users |
| 🔐 **Secure by default** | workers.dev route auto-disabled |

## 🛠️ For Developers

```bash
git clone https://github.com/CheginiSoroush/flash-wizard.git
cd flash-wizard
npm install
npx wrangler deploy
```

## 📖 Credits

- **Panel:** [Flash Panel](https://github.com/CheginiSoroush/flash-panel)
- **Original project:** [BPB-Worker-Panel](https://github.com/bia-pain-bache/BPB-Worker-Panel)
- **License:** GPL-3.0
