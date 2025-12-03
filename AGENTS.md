# MycoFlow Landing (Next.js) – AGENTS.md

> **Son Güncelleme:** 30 Kasım 2025

Bu doküman, MycoFlow tanıtım sitesini Next.js (React) ile geliştirirken görevleri ajana/bileşene göre ayırmak için hazırlanmıştır. Site statiktir; gerçek router/telemetri/WebSocket kullanılmaz. Demo, **mock veriler** ve **Three.js** ile görsel anlatı sunar.

---

## 📊 Proje Durum Özeti

| Kategori | Durum | Detay |
|----------|-------|-------|
| **Build** | ✅ Çalışıyor | Next.js 16.0.5 + Turbopack |
| **Testler** | ✅ 23/23 Geçti | Jest + RTL |
| **3D Görselleştirme** | ✅ Tamamlandı | Three.js + R3F |
| **Dark Mode** | ✅ Tamamlandı | Sistem/Manual toggle |
| **GitHub Entegrasyonu** | ✅ Tamamlandı | Stars, Contributors |
| **Kurulum Bölümü** | ✅ Tamamlandı | Platform tabs + CodeBlock |
| **Dinamik Trafik** | ✅ Tamamlandı | Bandwidth görselleştirme |
| **Hydration Hataları** | ✅ Düzeltildi | useSyncExternalStore |
| **Deployment** | ⏳ Bekliyor | Vercel bağlantısı yapılmadı |

---

## Proje Özeti

- **Amaç:** MycoFlow QoS fikrini etkileyici bir landing page ile anlatmak (mock metrikler + 3D görselleştirme).
- **Stack:** Next.js 16 (App Router), React 19, Three.js, **Tailwind CSS v4** (`@theme inline`), Vercel.
- **Veri:** Statik içerik + mock telemetri (interval ile güncellenir). Gerçek zamanlı bağlantı yok.
- **Dağıtım:** Vercel preview + production; CI/CD GitHub Actions (varsayılan). Statik export opsiyonel, ancak Three.js + mock interval kullanımı nedeniyle Vercel dinamik barındırma önerilir.

## HCI İlkeleri (sayfaya yedirilecek)

- **İlk bakışta anlaşılır bilgi mimarisi:** Hero → Problem → Bio-ilhamlı çözüm → Reflexive döngü → Persona/use-case → Metrikler → Demo CTA.
- **Tutarlı etkileşimler:** CTA'lar ve linkler aynı davranış ve görsel dile sahip; focus/hover durumları belirgin.
- **Geri bildirim:** Yükleme ilerlemesi (AssetLoader), mock metrik güncellemeleri, hover/tıklama ile görsel yanıt.
- **Görsel hiyerarşi:** Başlıklar ve metrikler için net tipografi ölçekleri, sınırlı vurgu renkleri.
- **Erişilebilirlik:** Kontrast, klavye gezinme, aria-label, motion-reduce desteği.
- **Bilişsel yük azaltma:** Kısa metinler, madde işaretleri, tek CTA önceliği (primary/secondary ayrımı).

## Dizın/Çalışma Prensipleri (Öneri)

- `app/` içinde sayfa bileşenleri; 3D sahne kullanan bileşenler **client** olmalı (`"use client"`).
- `components/`: UI parçaları, sahne kapsayıcıları (`SceneCanvas`, `MetricsPanel`).
- `lib/content/`: Mock veri, metrik varyans fonksiyonları, içerik şeması.
- `app/globals.css`: `@import "tailwindcss"` + `@theme inline` ile CSS değişkenleri.
- `postcss.config.mjs`: Tailwind v4 PostCSS eklentisi.
- `public/`: `models/`, `textures/`, görseller.

---

## ReflexCycleAgent (Three.js)

**Rol:** 3D sahne kurulumu, render döngüsü, görsel efektler, mock metriklerin sahnede/overlay'de gösterimi.

**Araçlar:** Three.js (`WebGLRenderer`, `Scene`, `PerspectiveCamera`, ışıklar), `requestAnimationFrame/setAnimationLoop`, `OrbitControls`, (opsiyonel) GSAP/Tween.js, Performance API.

**Sorumluluklar**
- Canvas içinde renderer/kamera/ışık kurulumu; responsive resize.
- Per-frame güncelleme: ağ topolojisi animasyonu, parçacık akışları, QoS tin renkleri.
- Etkileşim: OrbitControls; raycasting ile hover/tıklama.
- ContentAgent mock verilerini materyal/overlay olarak yansıtma.
- Kaynak temizliği: geometriler/materyaller/renderer dispose (unmount).

**İş Akışı**
1) `SceneCanvas` (client) içinde `useRef` canvas + `useEffect` setup.  
2) Renderer/kamera/ışık/mesh ekle, AssetLoaderAgent modelini sahneye al.  
3) `setAnimationLoop` ile render döngüsü; per-frame update fonksiyonu.  
4) Window resize ile kamera aspect/renderer size güncelle.  
5) Unmount'ta dispose ve event temizliği.

**TODO**
- [x] Canvas + renderer + kamera + ışık kurulumu (client bileşen) → `components/three/SceneCanvas.tsx`
- [x] OrbitControls + raycasting etkileşimleri → `SceneCanvas` entegrasyonu
- [x] Ağ/topoloji görselleştirmesi (misel esintili) → `components/three/NetworkGraph.tsx`
- [x] Paket akışı (parçacık/instanced mesh) → `components/three/ParticleFlow.tsx`
- [x] Ortak pozisyon modülü → `components/three/networkPositions.ts` (NetworkGraph + ParticleFlow senkronizasyonu)
- [x] QoS tin renk/overlay mantığı → `useSceneState` hook entegrasyonu
- [x] Mock metrik overlay (ContentAgent'ten) → `DemoSection` health indicator
- [ ] FPS/performans takibi ve detay ölçekleme (mobil)
- [ ] Temizlik: dispose + setAnimationLoop stop

---

## ContentAgent (içerik + mock state)

**Rol:** Statik içerik, mock metrik üretimi, scroll/section state, animasyon tetikleyicileri.

**Araçlar:** React state/Context, `useEffect` (mock tick), `IntersectionObserver` (görünürlük), (opsiyonel) Framer Motion/GSAP.

**Sorumluluklar**
- İçerik şeması: hero, problem, bio-ilhamlı yaklaşım, reflexive döngü, persona/use-case, metrikler (latency/jitter/fairness), teknik özet, CTA, FAQ.
- Mock telemetri üretimi (`setInterval` ile küçük varyans).
- Section/scroll state; aktif section'ı DesignAgent'a ilet.
- ReflexCycleAgent overlay'lerine mock değer sağlama (prop/context).
- CTA/form state (örn. "Demoyu Başlat").

**İş Akışı**
1) İçerik ve mock veri şemasını `lib/content` altında tanımla (mycelium_report özetine bağlı kal).  
2) `ContentProvider` (client) ile mock tick ve section state yönet.  
3) `IntersectionObserver` ile görünür section'ları takip et; animasyon tetikle.  
4) ReflexCycleAgent'a gerekli mock metrikleri prop/context ile geçir.  
5) CTA aksiyonlarını (scroll, modal) yönet.

**TODO**
- [x] İçerik şeması + mock veri seti (hero/problem/bio-reflexive/persona/metrikler/FAQ) → `lib/content/schema.ts`
- [x] Mock tick fonksiyonları (varyans, clamp) → `lib/content/mockData.ts`
- [x] Context/provider + custom hook (örn. `useMockMetrics`) → `lib/content/Provider.tsx`
- [x] Scroll/section takibi (IntersectionObserver, throttling) → `useSectionVisibility`, `useIntersectionObserver`
- [x] CTA ve demo state akışı → `demoMode` state
- [x] ReflexCycleAgent köprüsü (overlay/metrik paylaşımı) → `useSceneState` hook
- [x] Dokümantasyon (mock stratejisi, interval aralığı) → README.md

---

## AssetLoaderAgent (model/texture)

**Rol:** 3D modeller ve tekstürlerin yüklenmesi, ilerleme bildirimi, hata yönetimi.

**Araçlar:** Three.js `GLTFLoader`, `TextureLoader`, `DRACOLoader`, `LoadingManager`; Next `public/` assetleri.

**Sorumluluklar**
- Yüklenecek varlık envanteri (ad, tip, yol, öncelik).
- LoadingManager ile progress → ContentAgent'a bildirim.
- GLTF/texture yükleme; ReflexCycleAgent'a sahneye eklemesi için teslim.
- Hata/ retry/ fallback; dispose ile bellek temizliği.

**İş Akışı**
1) `assetsToLoad` listesini tanımla (kritik vs. lazy).  
2) `LoadingManager` kur, `onProgress` → ContentAgent progress UI.  
3) GLTF/Texture loader'ları yapılandır; `public/models|textures`.  
4) Hata durumunda retry/fallback; başarıda sahneye ekleme callback'i.  
5) Kullanılmayan varlıkları dispose et.

**TODO**
- [x] Envanter listesi + öncelik → `lib/assets/manifest.ts`
- [x] Loader/manager kurulumu → `lib/assets/index.tsx` (useAssetLoader hook)
- [x] Progress UI entegrasyonu (ContentAgent) → `LoadingProgress` component
- [ ] GLTF + texture yükleme örnekleri
- [x] Hata/ retry/ fallback stratejisi → `AssetError` component
- [ ] Lazy-load kritik olmayan varlıklar
- [ ] Dispose/temizlik ve sürümleme notu

---

## DeploymentAgent (build & Vercel)

**Rol:** Build, preview, production dağıtımı; CI/CD ve env kontrolü.

**Araçlar:** `next build`, Vercel (CLI/GitHub), GitHub Actions, (opsiyonel) Slack bildirimleri.

**Sorumluluklar**
- Preview deploy (PR) ve production deploy (main).
- Env değişkenleri (gerekirse) eşleştirme; static site olduğundan minimal.
- Build/test adımları; rollback ve eski preview temizliği.

**İş Akışı**
1) PR açılınca Vercel preview.  
2) Lokal doğrulama: `npm ci`, `npm run lint`, `npm run test`, `npm run build`.  
3) Merge → production deploy.  
4) Preview cleanup ve health-check bildirimi.

**TODO**
- [ ] Vercel proje bağlama + domain
- [ ] GitHub Actions: lint/test/build
- [ ] Preview doğrulama; kapalı PR'ları temizle
- [ ] Health-check adımı (başlık/200)
- [ ] Rollback planı
- [ ] Deploy notları/versiyon takibi
- [ ] Bildirim entegrasyonu (opsiyonel)
- [ ] (Opsiyonel) `next export` değerlendirmesi: SSR/route ihtiyaçları yoksa export; aksi halde Vercel dinamik barındırma (varsayılan)

---

## TestAgent (kalite)

**Rol:** UI, akış ve performans testleri; statik/mocks odaklı.

**Araçlar:** Jest + React Testing Library (`next/jest`), Playwright/Cypress (E2E), Lighthouse CI, ESLint/Prettier.

**Sorumluluklar**
- Birim/komponent testleri: hero, feature list, mock metrik paneli.
- E2E: hero CTA, scroll, sahne container'ın render olması.
- Performans: Lighthouse (LCP/TBT/CLS) statik sayfa hedefleri.
- Erişilebilirlik: jest-axe/Playwright a11y kontrolleri.

**İş Akışı**
1) `next/jest` ile jest config; RTL setup.  
2) Komponent testleri (mock data snapshot değil, rol/metin tabanlı).  
3) Playwright/Cypress ile kritik akış E2E.  
4) Lighthouse CI threshold'ları; CI'ya ekle.  
5) Hata durumunda screenshot/trace kaydı.

**TODO**
- [x] Jest + RTL kurulum (`next/jest`) → `jest.config.mjs`, `jest.setup.ts`
- [x] İlk komponent testleri (hero/metrics) → `__tests__/components/Hero.test.tsx`, `MetricsPanel.test.tsx`
- [x] Mock veri testleri (varyans clamp) → `__tests__/lib/mockData.test.ts` (12 test)
- [x] Test içerikleri güncellendi (TR → EN) → 23/23 test geçiyor ✅
- [ ] E2E altyapısı + kritik akış testleri
- [ ] Lighthouse CI entegrasyonu
- [ ] CI pipeline'da lint/test/e2e/lighthouse
- [ ] A11Y kontrolleri (jest-axe veya Playwright)
- [ ] Performans hedefleri: LCP ≤ 2.5s (desktop), CLS ≤ 0.1, TBT ≤ 200ms (mock/SSR)

---

## DesignAgent (UI/UX)

**Rol:** Görsel dil, layout, responsive davranış ve erişilebilirlik.

**Araçlar:** JSX, **Tailwind CSS v4** (`@theme inline`), `globals.css`, CSS variables, `next/font`.

**Sorumluluklar**
- Tailwind v4 tema: `@theme inline` ile `--color-*`, `--font-*` değişkenleri.
- Layout: hero + 3D alan, problem/bio-reflexive hikaye, reflexive loop/diyagram, persona/use-case, metrikler (önce/sonra), CTA, FAQ.
- Responsive: Tailwind breakpoints (`sm:`, `md:`, `lg:`, `xl:`), mobile-first.
- Etkileşim durumları: `hover:`, `focus:`, `active:` utility'leri; kontrast ve ARIA etiketleri.

**İş Akışı**
1) `app/globals.css`'te `@import "tailwindcss"` + `@theme inline` ile tema.  
2) `:root`'ta CSS değişkenleri, `@theme`'de Tailwind'e bağlama.  
3) Component'lerde Tailwind utility class'ları kullan.  
4) Responsive: `md:`, `lg:` prefix'leri ile grid/flex ayarları.  
5) A11Y: `focus:ring`, `focus:outline`, `sr-only` class'ları.

**TODO**
- [x] `globals.css` `@theme inline` ile MycoFlow renk paleti
- [x] Hero + sahne container: `flex`, `grid`, responsive class'lar
- [x] CTA, badge, card, metrics chip: Tailwind utility stilleri
- [x] Responsive: `sm:`, `md:`, `lg:`, `xl:` breakpoint'ler
- [x] Animasyon: Tailwind `animate-*` + custom keyframes → glow-pulse, shimmer, scale-in
- [ ] A11Y: `focus:ring-2`, `sr-only`, kontrast
- [ ] Tasarım rehberi dokümantasyonu

---

## DocAgent (dokümantasyon)

**Rol:** README/AGENTS ve teknik notların güncel tutulması.

**Araçlar:** Markdown, Mermaid/ASCII diyagram, JSDoc, Markdown linter.

**Sorumluluklar**
- README: proje özeti, `npm run dev|build|lint|test`, env notu, Vercel bağlantısı.
- AGENTS: bu dosya; ajan görevleri ve TODO'lar.
- Teknik notlar: Three.js cleanup checklist, mock veri stratejisi, test/deploy akışları.
- Versiyonlama: değişiklikleri CHANGELOG veya commit mesajıyla kaydetmek.

**TODO**
- [x] README güncelle: Next.js komutları, mock veri vurgusu, WebSocket yok → Kapsamlı README yazıldı
- [x] AGENTS senkronizasyonu (ajan görevleri değişirse) → TODO'lar güncellendi
- [x] Diyagram: ContentAgent → ReflexCycleAgent veri akışı, AssetLoader entegrasyonu → README'de ASCII diyagram
- [x] Sprint 1 bileşenleri dokümantasyonu → README güncellendi (ThemeToggle, GitHubStats, CodeBlock, InstallationSection)
- [x] GitHub repo entegrasyonu → `bariscanatakli/MycoFlow` badge'leri eklendi
- [ ] Three.js kaynak temizliği ve performans ipuçları
- [ ] Test/deploy workflow kısa rehberleri
- [ ] Markdown linter/spell-check

---

---

## 🆕 Açık Kaynak Proje Özellikleri (Yeni Sprint)

Bu bölüm, MycoFlow'u profesyonel bir açık kaynak proje landing page'i haline getirmek için gerekli görevleri içerir.

### InstallationAgent (Kurulum Bölümü) 🔴 ÖNCELİK: YÜKSEK ✅ TAMAMLANDI

**Rol:** Quick Start / Installation section oluşturma

**Çıktı:** `components/sections/InstallationSection.tsx`

**TODO**
- [x] Terminal kod bloğu bileşeni (syntax highlight + copy button) → `components/CodeBlock.tsx`
- [x] Platform seçici tabs (OpenWrt / LEDE / pfSense / OPNsense / Docker)
- [x] Kurulum adımları (numbered steps)
- [x] One-liner install komutu
- [x] Requirements listesi (Node.js, firmware version vb.)

---

### GitHubIntegrationAgent (GitHub Entegrasyonu) 🔴 ÖNCELİK: YÜKSEK ✅ TAMAMLANDI

**Rol:** GitHub API entegrasyonu ve sosyal kanıt göstergeleri

**Çıktı:** `components/GitHubStats.tsx`, `components/ContributorAvatars.tsx`

**TODO**
- [x] GitHub stars/forks badge (shields.io veya API) → `GitHubBadges` component
- [x] "Star on GitHub" belirgin CTA butonu (Hero veya Navbar) → `GitHubStarButton` component, Navbar'a entegre
- [x] Contributors avatar grid (GitHub API) → `ContributorAvatars` component
- [ ] Latest release bilgisi ve changelog link
- [ ] Repository card preview

---

### ThemeAgent (Dark Mode) 🟡 ÖNCELİK: ORTA ✅ TAMAMLANDI

**Rol:** Tema değiştirme (light/dark) sistemi

**Çıktı:** `components/ThemeToggle.tsx`, `lib/hooks/useTheme.ts`

**TODO**
- [x] Dark/Light mode toggle butonu (Navbar'da) → `ThemeToggle` component
- [x] Sistem tercihine göre otomatik tema (`prefers-color-scheme`)
- [x] LocalStorage ile tercih kaydetme
- [x] CSS variables güncelleme (`:root` vs `.dark`)
- [ ] Three.js sahne renk adaptasyonu

---

### CodeExampleAgent (Kod Örnekleri) 🟡 ÖNCELİK: ORTA (Kısmen Tamamlandı)

**Rol:** Syntax highlighted kod örnekleri ve config gösterimi

**Çıktı:** `components/CodeBlock.tsx`, `components/sections/CodeExamplesSection.tsx`

**TODO**
- [x] Simple regex syntax highlighting (bash/json/yaml) → `CodeBlock.tsx`
- [x] Copy to clipboard butonu → `CodeBlock.tsx`
- [ ] Prism.js veya Shiki entegrasyonu (gelişmiş syntax highlight)
- [ ] Before/After kod karşılaştırması
- [x] Config dosyası örneği (`mycoflow.conf`) → InstallationSection içinde
- [ ] API kullanım örneği
- [x] Tab sistemi (farklı dil/platform örnekleri) → InstallationSection platform tabs

---

### TestimonialsAgent (Kullanıcı Yorumları) 🟡 ÖNCELİK: ORTA

**Rol:** Social proof ve kullanıcı testimonials

**Çıktı:** `components/sections/TestimonialsSection.tsx`

**TODO**
- [ ] Testimonial card bileşeni (avatar, isim, rol, yorum)
- [ ] Carousel/slider (otomatik geçiş)
- [ ] "Used by" logo grid (placeholder logolar)
- [ ] Case study link kartları
- [ ] Community stats (users, deployments, countries)

---

### CommunityAgent (Topluluk) 🟢 ÖNCELİK: DÜŞÜK

**Rol:** Topluluk bağlantıları ve iletişim

**Çıktı:** `components/sections/CommunitySection.tsx`

**TODO**
- [ ] Discord/Slack katılım butonu
- [ ] GitHub Discussions linki
- [ ] Contributing guide link
- [ ] Newsletter email subscription formu
- [ ] Social media linkleri

---

### A11yAgent (Erişilebilirlik) 🟢 ÖNCELİK: DÜŞÜK

**Rol:** Erişilebilirlik iyileştirmeleri

**TODO**
- [ ] Tüm interaktif elementlerde `focus:ring-2 focus:ring-primary`
- [ ] `aria-label` eksikliklerini tamamla
- [ ] Skip to content link
- [ ] Reduced motion desteği (`@media (prefers-reduced-motion)`)
- [ ] Renk kontrastı kontrolü (WCAG AA)
- [ ] Keyboard navigation testi

---

## Sprint Planı

### Sprint 1 (Öncelikli) ✅ TAMAMLANDI
1. **InstallationAgent** → `InstallationSection.tsx` + `CodeBlock.tsx` ✅
2. **GitHubIntegrationAgent** → `GitHubStats.tsx` + Navbar entegrasyonu ✅
3. **ThemeAgent** → `ThemeToggle.tsx` ✅

### Sprint 2 (İkincil)
4. **CodeExampleAgent** → `CodeExamplesSection.tsx`
5. **TestimonialsAgent** → `TestimonialsSection.tsx`

### Sprint 3 (Tamamlayıcı)
6. **CommunityAgent** → `CommunitySection.tsx`
7. **A11yAgent** → Tüm bileşenlerde erişilebilirlik geçişi

---

## Notlar

- Bu site **statik tanıtım** içindir; gerçek router entegrasyonu veya WebSocket yoktur.  
- Demo metrikleri mock'tur; ContentAgent interval ile günceller.  
- 3D sahne client component olarak çalışır; server component'lere Three.js koyma.  
- Performans için mobil cihazlarda detay ölçekleme ve dispose kritik.
- Çoklu ajan koordinasyonu için her ajanın çıktısını dosya/artefakt olarak belirle (ör. ContentAgent: `lib/content/schema.ts`; AssetLoaderAgent: `public/assets.manifest.json`; ReflexCycleAgent: `components/SceneCanvas.tsx`), görev otomasyonunda bu dosyaları güncelleyen komutlar/PR'lar kullanılabilir.

## Referanslar

[^1]: [AGENTS.md](https://agents.md/)  
[^2]: [The Animation Loop | Discover three.js](https://discoverthreejs.com/book/first-steps/animation-loop/)  
[^3]: [SEO: Introducing Lighthouse | Next.js](https://nextjs.org/learn/seo/lighthouse)  
[^4]: [Vercel Next.js Docs](https://vercel.com/docs/frameworks/nextjs)  
[^5]: [Playwright](https://playwright.dev/)
