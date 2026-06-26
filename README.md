# KindKitchen — Frontend (Expo / React Native)

Mobile + web client for KindKitchen, a food-donation platform connecting
**Restaurants**, **NGOs**, **Donors**, and **Delivery Agents**.

## Stack
- Expo (~52) + React Native 0.76
- React Navigation (native stack)
- TypeScript

## Quick start
```bash
npm install --legacy-peer-deps
npm run web        # opens the app in the browser (easiest for testing)
# or:  npm start   # then scan the QR with Expo Go on a phone
```

> Make sure the **backend** is running first (see KindKitchen-Backend, default `http://localhost:8000`).

## Configuring the backend URL
All API calls use a single constant in [`src/screens/config.ts`](src/screens/config.ts):
```ts
export const API_BASE_URL = 'http://localhost:8000';
```
- **Browser (web):** keep `localhost`.
- **Android emulator:** use `http://10.0.2.2:8000`.
- **Physical phone:** use your computer's LAN IP, e.g. `http://192.168.1.5:8000`.

## Roles & main screens
- **Login / SignUp** → role select → role-specific signup (address auto-filled via geolocation).
- **Restaurant:** dashboard, post food, view orders.
- **NGO:** browse food, place orders (wallet/UPI), wallet & donations.
- **Donor:** browse NGOs, donate (payment gateway).
- **Delivery Agent:** see pending pickups, claim orders.
