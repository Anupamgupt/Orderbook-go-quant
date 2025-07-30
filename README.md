## Real-Time Orderbook Viewer with Order Simulation

# Next.js + shadcn/ui App
This project is a modern, responsive, and extendable trading order book UI built with:
- Next.js (App Router)
- shadcn/ui
- Tailwind CSS
- Recharts for depth chart visualization
- WebSocket APIs (Bybit, OKX, Deribit)

## Getting Started
Install dependencies:
npm install
# or
yarn install
Run the development server:
npm run dev
# or
yarn dev
Open http://localhost:3000 in your browser to see the result.


## Features
- Venue selector: OKX, Bybit, Deribit
- Symbol input (e.g., BTC-USDT)
- Live order book with 15-level depth
- Recharts depth chart (bids/asks)
- Simulated order placement (market/limit)
- Metrics: fill %, slippage, market impact, time to fill
- Responsive UI with dark mode toggle

## Styling and UI
This project uses:
- shadcn/ui (Headless UI + Tailwind + Radix)
- Tailwind CSS utility-first design
- Fully responsive layout
- Accessible and keyboard-friendly


## Folder Structure
/app
 /components - Reusable UI (DepthChart, OrderTable, etc.)
 /hooks - useBybitOrderBook,
  /lib - WebSocket utilities
 /styles - Global styles (if needed)


## Order Book Simulation

- Visual indicator of order in orderbook
- Order placement logic updates live
- Fill percentage, estimated slippage & market impact
- Adjustable delay timing for simulation (immediate, 5s, 10s, 30s)


## Example Component
// DepthChart.tsx
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
export const DepthChart = ({ bids, asks }) => (
 <ResponsiveContainer width="100%" height={300}>
 <AreaChart data={bids}>
 <Area type="monotone" dataKey="size" stroke="#0f0" fill="#0f08" />
 </AreaChart>
 </ResponsiveContainer>
);


## Learn More
- Next.js Documentation: https://nextjs.org/docs
- shadcn/ui Docs: https://ui.shadcn.com/docs
- Recharts: https://recharts.org/en-US/


## Deployment
Deploy your app instantly on Vercel:
vercel