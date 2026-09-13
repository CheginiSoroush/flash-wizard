<div dir="rtl" align="center">

# 🪄 فلش ویزارد

**نصب فلش پنل روی اکانت Cloudflare در ۶۰ ثانیه — بدون خط فرمان**

[🇬🇧 English](README.md)

![Workers](https://img.shields.io/badge/Platform-Cloudflare%20Workers-F38020?style=flat-square&logo=cloudflare)
![License](https://img.shields.io/badge/License-GPL--3.0-blue?style=flat-square)

</div>

<div dir="rtl">

---

فلش ویزارد ابزار نصب [فلش پنل](https://github.com/CheginiSoroush/flash-panel) است. همه کارها — ساخت KV، آپلود Worker، اتصال دامنه — فقط با یک توکن API انجام می‌شود.

## 🔒 مدل امنیتی

```
مرورگر شما ← فلش ویزارد ← API کلادفلر
    ↓            ↓              ↓
  توکن      (در مرورگر      (پنل شما
 ورودی      شما می‌ماند)    نصب می‌شود)
```

**توکن شما هرگز از مرورگر خارج نمی‌شود.** هیچ سروری اطلاعات شما را ذخیره نمی‌کند.

## 🚀 شروع سریع

1. [فلش ویزارد](https://flash-wizard.imsoroush.workers.dev/) را باز کنید
2. توکن API بسازید ([اینجا](https://dash.cloudflare.com/profile/api-tokens) — قالب **Edit Cloudflare Workers**)
3. دامنه خود را انتخاب کنید
4. **«نصب کن»** 🚀

> ⚠️ **پیش‌نیاز:** دامنه‌ای که به اکانت Cloudflare اضافه شده باشد. دامنه شخصی اکانت شما را از گزارش‌های خودکار روی `*.workers.dev` محافظت می‌کند.

## ✨ ویژگی‌ها

| | |
|---|---|
| 🪄 **نصب ۶۰ ثانیه** | توکن → دامنه → تمام |
| 🔒 **توکن لو نمی‌رود** | هیچ داده‌ای ذخیره نمی‌شود |
| 🌐 **فقط دامنه شخصی** | بدون workers.dev |
| ⚠️ **محافظت از overwrite** | قبل از بازنویسی هشدار می‌دهد |
| 🇮🇷 **رابط فارسی RTL** | طراحی‌شده برای کاربران فارسی‌زبان |
| 🔐 **امنیت پیش‌فرض** | مسیر workers.dev خودکار خاموش می‌شود |

## 🛠️ برای توسعه‌دهندگان

```bash
git clone https://github.com/CheginiSoroush/flash-wizard.git
cd flash-wizard
npm install
npx wrangler deploy
```

## 📖 اعتبار

| | |
|---|---|
| **پنل** | [فلش پنل](https://github.com/CheginiSoroush/flash-panel) |
| **پروژه اصلی** | [BPB-Worker-Panel](https://github.com/bia-pain-bache/BPB-Worker-Panel) |
| **لایسنس** | GPL-3.0 |

</div>
