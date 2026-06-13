# 🛒 Shop Tracker

Track what you buy, what staff sells, and your profit — all in one place.

---

## How it works

| Role | What they can do |
|------|-----------------|
| **Owner** | Add products with cost price + target revenue. See all sales, total profit, per-product progress. |
| **Staff** | Select a product, enter how much they collected (₹50, ₹100, etc.). Cannot see cost prices or profit. |

---

## Setup: Step by Step

### Step 1 — Create a Firebase project

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Add project"** → name it (e.g. `my-shop-tracker`) → Continue
3. Disable Google Analytics if you don't need it → **Create project**

### Step 2 — Enable Firestore

1. In Firebase Console, go to **Build → Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (you'll secure it later)
4. Pick a region close to you (e.g. `asia-south1` for India) → Enable

### Step 3 — Get your Firebase config

1. Go to **Project Settings** (gear icon) → **Your apps** → click **"</> Web"**
2. Register app with a name → Copy the `firebaseConfig` object shown

### Step 4 — Push this code to GitHub

1. Create a new repo on [github.com](https://github.com) (e.g. `shop-tracker`)
2. In your terminal:
```bash
cd grocery-tracker
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/YOUR_USERNAME/shop-tracker.git
git push -u origin main
```

### Step 5 — Deploy on Vercel

1. Go to [https://vercel.com](https://vercel.com) → Sign in with GitHub
2. Click **"Add New Project"** → Import your `shop-tracker` repo
3. Under **"Environment Variables"**, add all variables from `.env.example`:

| Key | Value |
|-----|-------|
| `REACT_APP_FIREBASE_API_KEY` | from Firebase config |
| `REACT_APP_FIREBASE_AUTH_DOMAIN` | from Firebase config |
| `REACT_APP_FIREBASE_PROJECT_ID` | from Firebase config |
| `REACT_APP_FIREBASE_STORAGE_BUCKET` | from Firebase config |
| `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` | from Firebase config |
| `REACT_APP_FIREBASE_APP_ID` | from Firebase config |
| `REACT_APP_OWNER_PIN` | your secret owner PIN (e.g. `9876`) |
| `REACT_APP_STAFF_PIN` | staff PIN (e.g. `1111`) |

4. Click **Deploy** → wait 2-3 minutes → your site is live!

### Step 6 — Apply Firestore security rules

1. In Firebase Console → **Firestore → Rules**
2. Replace the content with what's in `firestore.rules`
3. Click **Publish**

---

## How to use it

### As the owner:
1. Open your Vercel URL → enter your **Owner PIN**
2. Click **"+ Add Product"** → enter product name, cost price, target revenue
   - Example: Dairy Milk Box → Cost: ₹650, Target: ₹750
3. Watch the dashboard update as staff record sales

### As staff:
1. Open the same URL → enter your **name** + the **Staff PIN**
2. Select which product you sold something from
3. Enter or tap the quick-amount button (₹50, ₹100, etc.)
4. Click **Record Sale** — done!

---

## File structure

```
src/
  lib/
    firebase.js      # Firebase connection
    db.js            # All Firestore read/write functions
    AuthContext.js   # PIN-based login system
  components/
    LoginPage.js     # PIN entry screen
    OwnerDashboard.js  # Owner view (dashboard, products, sales log)
    StaffDashboard.js  # Staff view (record sales, my sales)
    AddProductModal.js # Add new product form
    RecordSaleModal.js # Record a sale form
  App.js             # Root component
  App.css            # All styles
```

---

## Questions?

- **Staff recorded a wrong amount?** Currently there's no undo — you'd need to go into Firestore console and delete/edit that sale record manually.
- **Want to add more staff?** They all share the same Staff PIN — just tell each person to enter their own name at login.
- **Products going bad?** You'll see which products have very low collection % — those need attention.
# shop-tracker
