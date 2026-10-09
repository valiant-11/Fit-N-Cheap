# Fit N Cheap 🚴‍♂️⚡

> Free, private, no-backend, no-LLM road bike fit calculator & on-device posture analyzer for cyclists.

**Fit N Cheap** empowers everyday road cyclists to dial in their riding position at home without paying $300+ at a bike shop. It combines classic biomechanical formulas (LeMond, Hamley, KOPS), a step-by-step illustrated measurement wizard, on-device MediaPipe computer vision posture detection, a road bike frame geometry matcher, and a side-by-side fit profile comparison tool.

---

## 🌟 Key Features

- **100% In-Browser & Private**: Zero servers, zero backend databases, zero external LLMs, zero telemetry. All data is saved locally on your device in `localStorage`.
- **Offline-First PWA**: Installable as a Progressive Web App (PWA) on iOS Safari and Android Chrome with an offline service worker.
- **On-Device AI Pose Tracking**: Local WebAssembly-based MediaPipe PoseLandmarker (`/models/pose_landmarker.task` bundled in `/public`). Photos and video frames are analyzed entirely in memory and never leave your phone or laptop.
- **Interactive Landmark Canvas**: Move and fine-tune detected joint landmarks (shoulder, elbow, wrist, hip, knee, ankle, pedal spindle) with real-time dynamic angle recalculation and rule-based fit advice.
- **Classic Biomechanical Fit Engine**:
  - **Saddle Height**: LeMond method (`inseam × 0.883`), Hamley method (`inseam × 1.09 - crank`), and weighted consensus baseline.
  - **Saddle Setback**: KOPS (Knee Over Pedal Spindle) baseline with center-of-gravity advice.
  - **Frame Geometry**: Seat tube center-to-top (`inseam × 0.655`), target reach and stack ranges.
  - **Cockpit Drop**: Saddle-to-handlebar drop based on hamstring flexibility and riding style.
  - **Handlebar Width**: Matched directly to shoulder acromion width (38cm, 40cm, 42cm, 44cm).
  - **Crank Arm Length**: Tailored to inseam to eliminate hip pinch at top-dead-center (165mm, 170mm, 172.5mm, 175mm).
- **Road Frame Matcher**: Compare your target reach and stack against a database of road frames. Categorizes fits as `Optimal`, `Close (Cockpit Tuning)`, `Too Big`, or `Too Small` with stem length, headset spacer, and seatpost setback recommendations.
- **CSV Import / Export**: Import your own bike geometry spreadsheets or export your custom frame database.
- **Side-by-Side Saved Fits Comparison**: Compare multiple bikes or setups side-by-side with automatic delta calculations ($\Delta$ mm/cm) and visual color tags.
- **Bilingual Support**: Instant toggle between English (`EN`) and Filipino / Tagalog (`FIL`).
- **Metric & Imperial**: Instant toggle between `cm` and `in` everywhere.
- **Print & PDF Export**: Clean print styling for paper worksheets or PDF saving.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 + TypeScript |
| **Bundler & Tooling** | Vite 8 + ESNext |
| **Styling** | Tailwind CSS v3 with Dark Mode (`class` strategy) |
| **Computer Vision** | Google MediaPipe `@mediapipe/tasks-vision` (WebAssembly & offline `.task` model) |
| **Testing** | Vitest + Testing Library (`@testing-library/react`) |
| **Icons** | Lucide React |
| **Data Storage** | Browser `localStorage` (100% offline, zero cloud) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or newer)
- npm or pnpm

### 1. Installation
```bash
git clone https://github.com/your-username/Fit-N-Cheap.git
cd Fit-N-Cheap
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Run Automated Tests
```bash
npm run test
```
Executes all 40+ unit and integration test suites via Vitest.

### 4. Build Production Bundle
```bash
npm run build
```
Generates optimized static assets in `/dist`.

---

## 🌐 Static Deployment Guide

Because Fit N Cheap requires zero backend and zero environment keys, it can be deployed to any static host in seconds:

### Deploying to Cloudflare Pages
1. Connect your Git repository in the Cloudflare Pages dashboard.
2. Configure build settings:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
3. Click **Deploy**.

### Deploying to Vercel
1. Import the Git repository in Vercel.
2. Framework is automatically detected as `Vite`.
3. Build command: `npm run build`
4. Output directory: `dist`
5. Click **Deploy**.

### Deploying to GitHub Pages
1. In `vite.config.ts`, if deploying to a subpath repository (e.g. `https://username.github.io/Fit-N-Cheap/`), set `base: '/Fit-N-Cheap/'`.
2. Run `npm run build`.
3. Push the contents of `dist/` to your `gh-pages` branch or configure GitHub Actions.

---

## 📐 Biomechanical Formulas & How to Tune Them

All calculation parameters, coefficients, lookup tables, and joint angle thresholds are centralized in a single file:
👉 **[`src/lib/fit/constants.ts`](file:///d:/Files/Fit-N-Cheap/src/lib/fit/constants.ts)**

Bike fitters and advanced riders can customize any formula to reflect alternative fitting methodologies:

### 1. Saddle Height
- **LeMond Method**:
  $$\text{Saddle Height (BB to Top of Saddle)} = \text{Inseam} \times 0.883$$
  *Reference: Greg LeMond & Cyrille Guimard (1986). Standard road reference for riders with standard pedal cleat stack.*
  *Parameter*: `FIT_CONSTANTS.LEMOND_COEFFICIENT = 0.883`

- **Hamley & Thomas Method**:
  $$\text{Saddle Height (Pedal Spindle to Top of Saddle)} = \text{Inseam} \times 1.09$$
  $$\text{Saddle Height (BB to Saddle)} = (\text{Inseam} \times 1.09) - \frac{\text{Crank Length (mm)}}{10}$$
  *Reference: Hamley & Thomas (1967). Accounted for pedal spindle distance directly.*
  *Parameter*: `FIT_CONSTANTS.HAMLEY_COEFFICIENT = 1.09`

- **Recommended Baseline**:
  Averaged starting point combining both methods:
  $$\text{Saddle Height}_{\text{Avg}} = \frac{\text{LeMond} + \text{Hamley}}{2}$$

### 2. Saddle Fore / Aft (KOPS Setback)
- **Guideline**: Knee Over Pedal Spindle (KOPS) with the crank horizontal at 3 o'clock.
- **Estimated Setback behind Bottom Bracket Center**:
  $$\text{Setback (mm)} = \text{Inseam (cm)} \times 0.07 \times 10$$
  *Parameter*: `FIT_CONSTANTS.KOPS_SETBACK_FACTOR = 0.07`

### 3. Traditional Seat Tube Length (Center-to-Top)
- **Traditional Road Frame Size**:
  $$\text{Seat Tube C-T (cm)} = \text{Inseam} \times 0.655$$
  *Parameter*: `FIT_CONSTANTS.SEAT_TUBE_FACTOR = 0.655`

### 4. Target Reach & Stack
- **Target Reach (mm)**: Derived from torso length and arm length with riding style modifiers:
  - Endurance: $-15\text{ mm}$ reach
  - Balanced: standard baseline
  - Race: $+15\text{ mm}$ reach
- **Target Stack (mm)**: Derived from inseam and torso with flexibility modifiers:
  - Limited (Stiff): $+25\text{ mm}$ stack (higher bars)
  - Average: standard baseline
  - Supple (High): $-20\text{ mm}$ stack (lower bars)

### 5. Saddle-to-Handlebar Drop Matrix
Mapped in `FIT_CONSTANTS.DROP_RANGES_MM` according to flexibility and riding intention:

| Flexibility | Endurance Drop | Balanced Drop | Race Drop |
|---|---|---|---|
| **Low (Stiff)** | 10 – 30 mm | 20 – 40 mm | 30 – 50 mm |
| **Medium (Avg)** | 30 – 50 mm | 45 – 75 mm | 60 – 90 mm |
| **High (Supple)** | 50 – 70 mm | 70 – 100 mm | 85 – 125 mm |

### 6. Crank Arm Length Lookup Table
Configured in `FIT_CONSTANTS.CRANK_LENGTH_LOOKUP` to match rider femur length and prevent hip impingement:
- $\text{Inseam} < 74\text{ cm} \rightarrow 165\text{ mm}$
- $74\text{ cm} \le \text{Inseam} < 81\text{ cm} \rightarrow 170\text{ mm}$
- $81\text{ cm} \le \text{Inseam} < 87\text{ cm} \rightarrow 172.5\text{ mm}$
- $\text{Inseam} \ge 87\text{ cm} \rightarrow 175\text{ mm}$

### 7. Handlebar Width
Matched directly to bony shoulder width (acromion to acromion):
- $\le 39\text{ cm} \rightarrow 38\text{ cm}$ hoods
- $39.1 – 41.5\text{ cm} \rightarrow 40\text{ cm}$ hoods
- $41.6 – 43.5\text{ cm} \rightarrow 42\text{ cm}$ hoods
- $> 43.5\text{ cm} \rightarrow 44\text{ cm}$ hoods

### 8. Target Joint Angles for Dynamic Posture
Configured in `FIT_CONSTANTS.TARGET_ANGLES`:
- **Knee Angle at 6 o'clock**: $140^\circ – 150^\circ$ interior angle (Holmes method). $<140^\circ$ causes anterior knee strain; $>150^\circ$ causes hamstring tension and pelvic rocking.
- **Torso Angle vs Ground**:
  - Endurance: $45^\circ – 52^\circ$
  - Balanced: $40^\circ – 46^\circ$
  - Race: $30^\circ – 38^\circ$
- **Elbow Flexion**: $150^\circ – 165^\circ$ ($15^\circ – 30^\circ$ bend to absorb road buzz).
- **Shoulder Angle**: $80^\circ – 95^\circ$ to balance weight without over-reaching.

---

## 🔒 Privacy & Offline Verification

1. **Zero External Calls**: Open browser DevTools Network tab. Upon loading the app, zero network requests are made to any analytics, cloud services, or backend APIs.
2. **Bundled MediaPipe Models**: The Vision WebAssembly files (`public/wasm/`) and the PoseLandmarker model (`public/models/pose_landmarker.task`, ~5.78 MB) are served entirely from your origin and precached by `public/sw.js`.
3. **No LLM Dependency**: All fit calculations and posture recommendations are computed using deterministic mathematical algorithms and biomechanical rule tables.

---

## ⚠️ Biomechanical Disclaimer

Fit N Cheap is an educational and recreational estimation tool. It is not medical or physical therapy advice. If you experience persistent numbness, sharp joint pain, or back spasms, consult a certified professional bike fitter (IBFI) or a licensed sports physiotherapist.
