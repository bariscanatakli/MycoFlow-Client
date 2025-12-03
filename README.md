# MycoFlow Landing Page

<div align="center">

![MycoFlow](https://img.shields.io/badge/MycoFlow-Bio--inspired%20QoS-4C956C?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Three.js](https://img.shields.io/badge/Three.js-3D-black?style=for-the-badge&logo=three.js)

[![GitHub stars](https://img.shields.io/github/stars/bariscanatakli/MycoFlow?style=social)](https://github.com/bariscanatakli/MycoFlow)
[![GitHub forks](https://img.shields.io/github/forks/bariscanatakli/MycoFlow?style=social)](https://github.com/bariscanatakli/MycoFlow/fork)

**Bio-ilhamlı QoS sistemini anlatan interaktif tanıtım sitesi.**

[Demo](http://localhost:3000) · [GitHub](https://github.com/bariscanatakli/MycoFlow) · [AGENTS.md](./AGENTS.md)

</div>

---

## 🚀 Hızlı Başlangıç

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Testleri çalıştır
npm run test
```

Tarayıcıda [http://localhost:3000](http://localhost:3000) adresini aç.

> **Not:** Node.js 20.9.0 veya üzeri gereklidir.

## 🛠️ Teknolojiler

| Teknoloji | Versiyon | Açıklama |
|-----------|----------|----------|
| **Next.js** | 16.0.5 | React framework (App Router) |
| **React** | 19.2.0 | UI library |
| **Tailwind CSS** | v4 | Utility-first CSS (`@theme inline`) |
| **Three.js** | @react-three/fiber 9.x | 3D görselleştirme |
| **TypeScript** | 5.x | Type safety |

## 📁 Proje Yapısı

```
MycoFlow-Client/
├── app/                          # Next.js 16 App Router
│   ├── layout.tsx                # Root layout + Geist fonts
│   ├── page.tsx                  # Ana sayfa (tüm section'lar)
│   └── globals.css               # @import "tailwindcss" + @theme inline
│
├── components/                   # React bileşenleri
│   ├── Hero.tsx                  # Hero section (typewriter, parallax, 3D scene)
│   ├── Navbar.tsx                # Navigasyon + ThemeToggle + GitHub Star
│   ├── Footer.tsx                # Footer
│   ├── MetricsPanel.tsx          # Mock metrik gösterimi
│   ├── ScrollProgress.tsx        # Scroll progress indicator
│   ├── ThemeToggle.tsx           # 🆕 Dark/Light/System tema toggle
│   ├── GitHubStats.tsx           # 🆕 GitHub API entegrasyonu
│   ├── CodeBlock.tsx             # 🆕 Syntax highlighted kod blokları
│   │
│   ├── sections/                 # Sayfa bölümleri
│   │   ├── ProblemSection.tsx    # Problem tanımı
│   │   ├── SolutionSection.tsx   # Çözüm açıklaması
│   │   ├── HowItWorksSection.tsx # Nasıl çalışır (AdaptiveNetwork ile)
│   │   ├── FeaturesSection.tsx   # Özellikler (staggered reveal)
│   │   ├── ComparisonSection.tsx # Before/After karşılaştırma
│   │   ├── InstallationSection.tsx # 🆕 Quick Start / Kurulum
│   │   ├── DemoSection.tsx       # Interaktif demo
│   │   ├── FAQSection.tsx        # SSS
│   │   └── CTASection.tsx        # Call-to-action
│   │
│   └── three/                    # Three.js 3D bileşenleri
│       ├── index.tsx             # NetworkVisualization export
│       ├── SceneCanvas.tsx       # Canvas wrapper + lighting
│       ├── NetworkGraph.tsx      # Ağ topolojisi (router + cihazlar)
│       ├── ParticleFlow.tsx      # Veri paketi akışı
│       ├── AdaptiveNetwork.tsx   # Interaktif adaptif ağ demo
│       └── networkPositions.ts   # Ortak pozisyon hesaplama
│
├── lib/                          # Yardımcı modüller
│   ├── content/                  # İçerik ve mock veri
│   │   ├── schema.ts             # TypeScript tipleri
│   │   ├── mockData.ts           # Statik içerik + mock telemetri
│   │   ├── Provider.tsx          # SceneStateProvider context
│   │   └── index.ts              # Public exports
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── useScrollReveal.ts    # Scroll animasyon hooks
│   │   └── index.ts              # Hook exports
│   │
│   └── assets/                   # Asset yönetimi
│       ├── manifest.ts           # Asset listesi
│       └── index.tsx             # useAssetLoader hook
│
├── __tests__/                    # Test dosyaları
├── public/                       # Statik dosyalar
├── postcss.config.mjs            # Tailwind v4 PostCSS
├── jest.config.mjs               # Jest yapılandırması
└── AGENTS.md                     # Ajan görev dokümantasyonu
```

## 🎨 Görsel Özellikler

### Hero Section
- **Typewriter Effect**: Subtitle yazı animasyonu
- **Parallax**: Mouse hareketine duyarlı arka plan
- **3D Network Visualization**: Gerçek zamanlı ağ görselleştirmesi
- **Animated Counters**: Metrik sayaçları

### 3D Network Visualization
Görselleştirme bileşenleri `components/three/` altında:

| Bileşen | Açıklama |
|---------|----------|
| **NetworkGraph** | Router ve cihazları gösterir |
| **ParticleFlow** | Cihazlar arası veri paketleri |
| **AdaptiveNetwork** | İnteraktif stress/adapt döngüsü |
| **networkPositions** | Ortak pozisyon hesaplama modülü |

**Cihaz Tipleri:**
- 🌐 **Router**: Mavi kutu, 3 anten, merkez
- 🎮 **Gaming PC**: Kırmızı kutu, realtime tier
- 📹 **Video Call**: Turuncu küre, interactive tier
- 💾 **Downloads**: Yeşil silindir, streaming tier
- 📱 **IoT**: Mor küre, bulk tier

**Tier Hızları (QoS):**
```
Realtime:    ████████████████ 1.5x (en hızlı)
Interactive: ████████████     1.2x
Streaming:   ████████         0.8x
Bulk:        █████            0.5x (en yavaş)
```

### Comparison Section
- **Before/After Toggle**: 3 saniyelik otomatik geçiş
- **Animated Bars**: Scroll'da tetiklenen metrik çubukları
- **Stat Cards**: Animasyonlu yüzde sayaçları

## 🎨 Tailwind v4 Tema

```css
@import "tailwindcss";

@theme inline {
  --color-primary: #3b82f6;
  --color-accent: #8b5cf6;
  --color-success: #22c55e;
}
```

### Renk Paleti

| Renk | Hex | Kullanım |
|------|-----|----------|
| Primary | `#3b82f6` | Router, butonlar |
| Realtime | `#ef4444` | Gaming, uyarılar |
| Interactive | `#f59e0b` | Video call |
| Streaming | `#22c55e` | Downloads |
| Bulk | `#8b5cf6` | IoT, accent |

## 📝 Scripts

| Komut | Açıklama |
|-------|----------|
| `npm run dev` | Geliştirme sunucusu (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Production sunucusu |
| `npm run lint` | ESLint kontrolü |
| `npm run test` | Jest testleri |
| `npm run test:watch` | Jest watch mode |

## ⚠️ Önemli Notlar

- **Statik Site**: Gerçek router/WebSocket bağlantısı yok
- **Mock Veriler**: Tüm metrikler simüle edilmiştir
- **Client Components**: Three.js → `'use client'` gerektirir
- **Shared Positions**: `networkPositions.ts` konumları senkronize eder

## 🧪 Test Durumu

| Kategori | Durum | Açıklama |
|----------|-------|----------|
| Mock Data | ✅ 12 test | Varyans ve clamp fonksiyonları |
| Hero | ✅ | Render ve içerik testi |
| MetricsPanel | ✅ | Mock metrik gösterimi |
| E2E | ⏳ | Planlanıyor |

## 🚧 Sprint Durumu

### ✅ Sprint 1 - Tamamlandı
| Görev | Bileşen | Durum |
|-------|---------|-------|
| Kurulum Bölümü | `InstallationSection.tsx` | ✅ |
| Kod Blokları | `CodeBlock.tsx` | ✅ |
| GitHub Entegrasyonu | `GitHubStats.tsx` | ✅ |
| Tema Toggle | `ThemeToggle.tsx` | ✅ |

### ⏳ Sprint 2 - Sırada
| Görev | Açıklama |
|-------|----------|
| Testimonials | Kullanıcı yorumları section |
| Code Examples | İleri syntax highlighting |

### 📅 Sprint 3 - Planlandı
| Görev | Açıklama |
|-------|----------|
| Community | Topluluk linkleri |
| A11y | Erişilebilirlik geçişi |

## 🔄 Bileşen Veri Akışı

```
SceneStateProvider (Context)
        │
        ├── Hero.tsx
        │     └── NetworkVisualization
        │           ├── NetworkGraph ──┐
        │           └── ParticleFlow ──┴── networkPositions.ts
        │
        ├── DemoSection.tsx
        │     └── AdaptiveNetwork (interaktif)
        │
        └── HowItWorksSection.tsx
              └── AdaptiveNetwork (explainer)
```

## 📚 Referanslar

- [AGENTS.md](./AGENTS.md) - Detaylı ajan görev tanımları
- [Next.js Docs](https://nextjs.org/docs)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
