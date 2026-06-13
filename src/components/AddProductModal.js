import { useState } from "react";
import { addProduct } from "../lib/db";

export default function AddProductModal({ onClose }) {
  const [form, setForm] = useState({
    name: "",
    category: "",
    costPrice: "",
    targetRevenue: "",
    unit: "box",
    totalQuantity: 1,
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.costPrice || !form.targetRevenue) {
      setError("Fill in product name, cost price, and target revenue.");
      return;
    }
    setLoading(true);
    try {
      await addProduct({
        name: form.name.trim(),
        category: form.category.trim() || "General",
        costPrice: Number(form.costPrice),
        targetRevenue: Number(form.targetRevenue),
        unit: form.unit,
        totalQuantity: Number(form.totalQuantity) || 1,
        notes: form.notes.trim(),
      });
      onClose();
    } catch (err) {
      setError("Failed to save. Check Firestore connection.");
    }
    setLoading(false);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>➕ Add New Product / Stock</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="field">
              <label>Product Name *</label>
              <input
                type="text"
                placeholder="e.g. Dairy Milk Chocolate"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label>Category</label>
              <input
                type="text"
                placeholder="e.g. Chocolates, Biscuits..."
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
              />
            </div>
            <div className="field">
              <label>Cost Price (₹) — what you paid *</label>
              <input
                type="number"
                placeholder="e.g. 650"
                value={form.costPrice}
                onChange={(e) => set("costPrice", e.target.value)}
                min="0"
                required
              />
            </div>
            <div className="field">
              <label>Target Revenue (₹) — total expected from sales *</label>
              <input
                type="number"
                placeholder="e.g. 750"
                value={form.targetRevenue}
                onChange={(e) => set("targetRevenue", e.target.value)}
                min="0"
                required
              />
            </div>
            <div className="field">
              <label>Unit Type</label>
              <select value={form.unit} onChange={(e) => set("unit", e.target.value)}>
                <option value="box">Box (sold loose)</option>
                <option value="kg">Kg</option>
                <option value="litre">Litre</option>
                <option value="piece">Piece</option>
                <option value="packet">Packet</option>
              </select>
            </div>
            <div className="field">
              <label>Quantity Purchased</label>
              <input
                type="number"
                placeholder="1"
                value={form.totalQuantity}
                onChange={(e) => set("totalQuantity", e.target.value)}
                min="1"
              />
            </div>
            <div className="field full">
              <label>Notes (optional)</label>
              <input
                type="text"
                placeholder="Any notes about this stock..."
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
              />
            </div>
          </div>

          <div className="profit-preview">
            <span>Expected Profit:</span>
            <strong className={
              form.targetRevenue && form.costPrice
                ? Number(form.targetRevenue) - Number(form.costPrice) >= 0
                  ? "profit-pos" : "profit-neg"
                : ""
            }>
              {form.targetRevenue && form.costPrice
                ? `₹${(Number(form.targetRevenue) - Number(form.costPrice)).toLocaleString()}`
                : "—"}
            </strong>
          </div>

          {error && <div className="error-msg">⚠ {error}</div>}

          <div className="modal-actions">
            <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Saving..." : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
