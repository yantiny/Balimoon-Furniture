# Modern Craft - Custom Made-to-Request Furniture Website

A modern, premium, minimalist, and responsive custom furniture web application built with **Next.js**, **TypeScript**, **Tailwind CSS**, and **React Three Fiber (Three.js)**. 

All furniture items are custom crafted to order. Customers can define millimeter-exact dimensions (Length, Width, Height) in interactive 3D, calculate live price estimates, and submit requests directly to **n8n Webhooks** which store orders in **Google Sheets**.

---

## 🌟 Key Features

1. **Made-To-Order Concept**: No pre-manufactured mass inventory. Furniture is customized by customer dimension specifications.
2. **Real-Time Parametric 3D Customizer**: Built with React Three Fiber. Scales length, width, and height dynamically while preserving timber joinery and structural integrity.
3. **Instant Price Estimation Engine**: Formula-driven pricing adjusting base cost by volume ratio and timber material choice.
4. **n8n Webhook & Google Sheets Architecture**: Zero traditional database required. Completely orchestrated via n8n Webhook workflows into Google Sheets.
5. **Real-Time Order Tracking**: 7-stage interactive timeline tracking from submission to final delivery.
6. **Natural Wood Finishing**: Fixed eco-friendly standard natural wood finish preserving authentic timber textures.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, React 18
- **Styling**: Tailwind CSS (Warm neutral palette: cream, beige, charcoal, natural wood brown)
- **3D Graphics**: Three.js, React Three Fiber (`@react-three/fiber`), `@react-three/drei`
- **Icons & Animations**: Lucide React, Framer Motion
- **Automation Backend**: n8n Webhook & Google Sheets API

---

## 🚀 Getting Started

### 1. Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory:

```env
# n8n Webhook Integration (Optional: Leave empty for automatic local storage fallback)
NEXT_PUBLIC_N8N_CREATE_ORDER_WEBHOOK=https://your-n8n-instance.com/webhook/create-order
NEXT_PUBLIC_N8N_TRACK_ORDER_WEBHOOK=https://your-n8n-instance.com/webhook/track-order
```

*Note: If environment variables are empty, the application automatically enters **Local Fallback Mode**, generating `CF-YYYYMMDD-XXX` Order IDs in browser local storage for seamless testing.*

---

## 📊 Google Sheets Data Schema

Orders sent via n8n are recorded into a Google Sheet with the following column headers:

| Column Header | Description | Example |
| :--- | :--- | :--- |
| **Order ID** | Unique generated ID | `CF-20260903-001` |
| **Date** | Submission date | `3 September 2026` |
| **Customer Name** | Full name | `Jane Doe` |
| **WhatsApp** | Contact number | `08123456789` |
| **Email** | Email address | `jane@example.com` |
| **Address** | Delivery address | `Jl. Sudirman No. 12, Jakarta` |
| **Product ID** | Static product identifier | `custom-table-01` |
| **Product Name** | Display name | `Custom Wooden Table` |
| **Length** | Length in cm | `150` |
| **Width** | Width in cm | `70` |
| **Height** | Height in cm | `75` |
| **Material** | Chosen timber type | `Solid Teak Wood` |
| **Finishing** | Fixed finishing | `Natural Wood Finish` |
| **Additional Request** | Custom instructions | `Chamfered soft edges` |
| **Reference Image URL** | Optional design reference | `https://...` |
| **Estimated Price** | Computed price (IDR) | `3100000` |
| **Final Price** | Owner verified price | `3100000` |
| **Status** | Current state | `SUBMITTED` |
| **Order Date** | Date submitted | `2026-09-03` |
| **Design Date** | CAD approval date | `2026-09-04` |
| **Material Date** | Timber prep date | `2026-09-05` |
| **Production Date** | Woodworking date | `2026-09-07` |
| **QC Date** | Quality inspection | `2026-09-15` |
| **Shipping Date** | Dispatch date | `2026-09-18` |
| **Completed Date** | Delivery completion | `2026-09-20` |

---

## 🔄 n8n Integration Workflows

### Workflow 1 - Create Order
```
[Website HTTP POST Webhook]
  ↓
[n8n Webhook Node]
  ↓
[Data Validation Node (Check dimensions & required fields)]
  ↓
[Price & Order ID Generator (CF-YYYYMMDD-001)]
  ↓
[Google Sheets Node: Append Row]
  ↓
[Notification Node (Optional Telegram/Email alert to owner)]
  ↓
[Webhook Response (Return JSON payload to website)]
```

### Workflow 2 - Track Order
```
[Website HTTP POST Webhook]
  ↓
[n8n Webhook Node (Receives Order ID)]
  ↓
[Google Sheets Node: Lookup Row by Order ID]
  ↓
[Format Status & Timeline Response]
  ↓
[Respond to Website]
```

### Order Status Milestones
1. `SUBMITTED`
2. `DESIGN_CONFIRMATION`
3. `MATERIAL_PREPARATION`
4. `PRODUCTION`
5. `QUALITY_CHECK`
6. `READY_TO_SHIP`
7. `COMPLETED`

---

## 📁 File Structure

```
d:/TA YANTO/
├── src/
│   ├── app/
│   │   ├── page.tsx               # Home Page (Hero, 3D Canvas, How It Works, Features)
│   │   ├── furniture/
│   │   │   ├── page.tsx           # Catalog Page
│   │   │   └── [id]/page.tsx      # Product Detail Page
│   │   ├── customize/
│   │   │   └── [id]/page.tsx      # 3D Customizer Page (Split view)
│   │   ├── order-success/
│   │   │   └── page.tsx           # Order Success Page
│   │   ├── track/
│   │   │   └── page.tsx           # Track Order Page
│   │   ├── globals.css            # Global Tailwind CSS styles
│   │   └── layout.tsx             # Root layout with Navbar & Footer
│   ├── components/
│   │   ├── 3d/
│   │   │   ├── ParametricFurniture.tsx  # 3D procedural meshes & dimension badges
│   │   │   └── FurnitureCanvas.tsx      # R3F Canvas & OrbitControls wrapper
│   │   ├── layout/
│   │   │   ├── Navbar.tsx         # Navigation header & drawer
│   │   │   └── Footer.tsx         # Footer & tech details
│   │   └── ui/
│   │       ├── ProductCard.tsx          # Catalog product card
│   │       ├── PriceEstimateWidget.tsx  # Pricing breakdown widget
│   │       └── OrderTimeline.tsx        # 7-stage order progress timeline
│   ├── data/
│   │   └── products.ts            # Static product configuration dataset
│   ├── services/
│   │   └── n8nService.ts          # Webhook API & local fallback service
│   ├── types/
│   │   └── furniture.ts           # TypeScript interfaces & types
│   └── utils/
│       └── pricing.ts             # Dynamic pricing calculation engine
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```
