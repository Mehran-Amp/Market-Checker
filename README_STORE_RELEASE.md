# 🚀 راهنمای جامع انتشار Market Checker در Google Play و Apple App Store

این پروژه نسخه کامل و ۱۰۰٪ نیتیو پیاده‌سازی شده با **Flutter** برای انتشار روی استورهای رسمی است.

---

## 📂 ساختار فایل‌های پروژه Flutter

تمامی سورس‌کدهای Flutter در پوشه `/flutter_app` قرار دارند:
```
flutter_app/
├── lib/
│   ├── main.dart                      # نقطه ورود و راه‌اندازی سرویس‌های نیتیو
│   ├── models/                        # مدل‌های داده هشدارهای درصدی، قیمت و لاگ‌ها
│   ├── services/
│   │   ├── alert_engine.dart          # موتور محاسباتی هشدارهای بیت‌کوین چکر
│   │   ├── exchange_manager.dart      # اتصال وب‌سوکت صرافی‌های جهانی
│   │   ├── audio_alert_service.dart   # آلارم‌های صوتی و گوینده TTS فارسی
│   │   ├── foreground_service.dart    # سرویس تیکر دائمی استاتوس‌بار اندروید
│   │   ├── multi_market_service.dart  # طلا، نفت، فارکس، شاخص‌ها و اوراق قرضه
│   │   └── storage_service.dart       # پایگاه‌داده آفلاین و ذخیره تنظیمات
│   └── screens/                       # صفحات کاربری، دیده‌بان، مودال‌ها و تنظیمات
├── android/                           # پیکربندی دسترسی‌های نیتیو و Foreground اندروید
├── ios/                               # کانفیگ Background Modes و Permissions برای App Store
└── pubspec.yaml                       # پکیج‌ها و وابستگی‌های رسمی
```

---

## 🤖 ۱. مراحل انتشار در Google Play Console (فایل `.aab`)

۱. **ساخت اکانت توسعه‌دهنده گوگل پلی:**
   * ورود به [Google Play Console](https://play.google.com/console)
   * پرداخت هزینه ثبت‌نام (۲۵ دلار یک‌بار برای همیشه) به نام خودتان.

۲. **تولید خروجی Android App Bundle:**
   * اجرای دستور زیر در ترمینال:
   ```bash
   cd flutter_app
   flutter pub get
   flutter build appbundle --release
   ```
   * فایل خروجی در مسیر زیر ساخته می‌شود:
     `flutter_app/build/app/outputs/bundle/release/app-release.aab`

۳. **آپلود در کنسول گوگل پلی:**
   * ساخت اپ جدید در پنل Google Play
   * رفتن به بخش **Production > Create new release**
   * آپلود مستقیم فایل `app-release.aab`
   * پر کردن فرم اطلاعات اپ، اسکرین‌شات‌ها و بیانیه‌ی حریم خصوصی (Privacy Policy) و زدن دکمه Submit for Review.

---

## 🍏 ۲. مراحل انتشار در Apple App Store (فایل `.ipa`)

۱. **اکانت Apple Developer Program:**
   * ورود به [Apple Developer](https://developer.apple.com/)
   * عضویت سالانه (۹۹ دلار) با Apple ID شخصی شما.

۲. **بیلد ابری خودکار یا مک شخصی:**
   * اگر سیستم Mac در دسترس ندارید، از پایپ‌لاین **GitHub Actions** که در مسیر `.github/workflows/build_and_release.yml` قرار داده شده یا سرویس **Codemagic** استفاده کنید.
   * با هر بار Push کردن پروژه روی گیت‌هاب، فرآیند بیلد به‌صورت خودکار در سرورهای ابری مکینتاش اجرا شده و خروجی را برای دانلود ارائه می‌دهد.

۳. **آپلود در App Store Connect:**
   * ساخت شناسه `App ID` در Developer Portal
   * ایجاد رکورد اپ در [App Store Connect](https://appstoreconnect.apple.com/)
   * ارسال بیلد از طریق **Transporter** یا GitHub Actions
   * تکمیل توضیحات، دسته‌بندی Finance/Utilities و ارسال برای بازبینی اپل.

---

## 🔄 ۳. همگام‌سازی با گیت‌هاب شخصی

برای انتقال کامل تمام این فایل‌ها به گیت‌هاب خودتان:
```bash
git init
git add .
git commit -m "feat: complete native flutter market checker with google play & app store pipeline"
git remote add origin https://github.com/<YOUR_USERNAME>/market-checker.git
git push -u origin main
```
با ارسال کد به گیت‌هاب، ورک‌فلوهای CI/CD بلافاصله خروجی‌های نهایی را برای شما می‌سازند.
