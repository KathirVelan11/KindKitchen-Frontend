# KindKitchen — Frontend (Expo / React Native)

KindKitchen is a food-donation platform that connects **Restaurants**, **NGOs**,
**Donors**, and **Delivery Agents** so surplus food and donations reach people in need.

This repo is the mobile + web client (Expo / React Native + TypeScript).
The API lives in **KindKitchen-Backend**.

---

## How to run & see the app

### 1. Start the backend first
See the `KindKitchen-Backend` README. In short:
```bash
docker run -d --name kk-postgres -e POSTGRES_PASSWORD=12122005 \
  -e POSTGRES_USER=postgres -e POSTGRES_DB=kathir -p 5432:5432 postgres:16
pip install -r requirements.txt
cd "Fastapi backend" && cp .env.example .env
uvicorn main:app --port 8000
```
Backend is now at http://localhost:8000 (docs at /docs).

### 2. Run the app
```bash
npm install --legacy-peer-deps
npm run web        # easiest — opens in your browser at http://localhost:8081
# or: npm start    # then scan the QR code with the Expo Go app on your phone
```

### 3. Point the app at your backend
All API calls read one constant — [`src/screens/config.ts`](src/screens/config.ts):
```ts
export const API_BASE_URL = 'http://localhost:8000';
```
- **Browser (web):** keep `localhost`.
- **Android emulator:** `http://10.0.2.2:8000`.
- **Real phone (Expo Go):** your PC's LAN IP, e.g. `http://192.168.1.5:8000`.

---

## What the app does (functionality)

**Accounts & auth**
- Email/password **sign up** and **login** (JWT). After signing up you pick a role.
- Role-based routing sends each user to the right home screen.

**Restaurant**
- Dashboard, **post surplus food** (name, qty, price, veg/non-veg, expiry, photo).
- View incoming **orders** for the restaurant.

**NGO**
- Browse available food and **place orders** (pay from wallet / UPI).
- **Wallet** page: live balance + list of donations received.
- Wallet is auto-created on registration and credited when donors give.

**Donor**
- Browse NGOs and **donate** with a real payment flow:
  pick NGO → enter amount → choose method → pay → success (NGO wallet credited).
- Payments go through the backend **Razorpay** gateway, which runs in **mock mode**
  out of the box (no keys / no real charge) and upgrades to live by adding keys.

**Delivery Agent**
- See **pending pickups** (restaurant → NGO addresses) and **claim** an order.

---

## Project structure
```
src/screens/
  config.ts            # single source of the backend URL
  AuthContext.tsx      # logged-in user context
  auth.js              # in-memory token / userId / role
  Navigation.tsx       # all routes
  LoginScreen.tsx, *Signup*.tsx, *dash*.tsx, NgoHomePage.tsx,
  Donate_screen.tsx, Selectpayment.tsx, WalletPage.tsx, ...
```

## Tech
Expo ~52 · React Native 0.76 · React Navigation (native stack) · TypeScript
