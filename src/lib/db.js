import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  onSnapshot,
  increment,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

// ─── PRODUCTS ────────────────────────────────────────────────────────────────

export const addProduct = async (productData) => {
  const ref = await addDoc(collection(db, "products"), {
    ...productData,
    remainingStock: productData.totalQuantity, // units or box quantity
    collectedAmount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
};

export const subscribeProducts = (callback) => {
  const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    const products = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(products);
  });
};

export const updateProduct = async (productId, data) => {
  await updateDoc(doc(db, "products", productId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const deleteProduct = async (productId) => {
  await deleteDoc(doc(db, "products", productId));
};

// ─── SALES ────────────────────────────────────────────────────────────────────

export const recordSale = async ({ productId, amountCollected, staffName, note }) => {
  // 1. Log sale transaction
  await addDoc(collection(db, "sales"), {
    productId,
    amountCollected: Number(amountCollected),
    staffName: staffName || "Unknown",
    note: note || "",
    createdAt: serverTimestamp(),
  });

  // 2. Update product: add to collectedAmount, deduct from remainingStock
  await updateDoc(doc(db, "products", productId), {
    collectedAmount: increment(Number(amountCollected)),
    updatedAt: serverTimestamp(),
  });
};

export const subscribeSales = (callback) => {
  const q = query(collection(db, "sales"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    const sales = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(sales);
  });
};

export const subscribeSalesByProduct = (productId, callback) => {
  const q = query(
    collection(db, "sales"),
    where("productId", "==", productId),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snap) => {
    const sales = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(sales);
  });
};

// ─── PURCHASES (owner buying stock) ─────────────────────────────────────────

export const addPurchase = async (purchaseData) => {
  await addDoc(collection(db, "purchases"), {
    ...purchaseData,
    createdAt: serverTimestamp(),
  });
};

export const subscribePurchases = (callback) => {
  const q = query(collection(db, "purchases"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    const purchases = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(purchases);
  });
};
