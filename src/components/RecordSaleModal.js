import { useState, useEffect } from "react";
import { subscribeProducts, recordSale } from "../lib/db";
import { useAuth } from "../lib/AuthContext";

export default function RecordSaleModal({ onClose, preselectedProduct }) {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(preselectedProduct?.id || "");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const unsub = subscribeProducts(setProducts);
    return unsub;
  }, []);

  const selectedProduct = products.find((p) => p.id === selectedProductId);
  const remaining = selectedProduct
    ? selectedProduct.targetRevenue - (selectedProduct.collectedAmount || 0)
    : null;

  const quickAmounts = [10, 20, 50, 100, 200, 500];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProductId) { setError("Select a product"); return; }
    if (!amount || Number(amount) <= 0) { setError("Enter a valid amount"); return; }
    if (remaining !== null && Number(amount) > remaining + 1) {
      setError(`Amount exceeds remaining target (₹${remaining}). Are you sure?`);
    }
    setLoading(true);
    try {
      await recordSale({
        productId: selectedProductId,
        amountCollected: Number(amount),
        staffName: user?.name || "Staff",
        note,
      });
      setSuccess(true);
      setTimeout(() => {
        setAmount("");
        setNote("");
        setSuccess(false);
        setError("");
      }, 1500);
    } catch (err) {
      setError("Failed to record. Check connection.");
    }
    setLoading(false);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>💰 Record Sale</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {success && (
          <div className="success-banner">✅ Sale recorded!</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Product *</label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              required
            >
              <option value="">— Select product —</option>
              {products.map((p) => {
                const rem = p.targetRevenue - (p.collectedAmount || 0);
                return (
                  <option key={p.id} value={p.id}>
                    {p.name} (₹{rem > 0 ? rem : 0} remaining)
                  </option>
                );
              })}
            </select>
          </div>

          {selectedProduct && (
            <div className="product-snapshot">
              <div className="snapshot-row">
                <span>Cost Price</span>
                <strong>₹{selectedProduct.costPrice?.toLocaleString()}</strong>
              </div>
              <div className="snapshot-row">
                <span>Target Revenue</span>
                <strong>₹{selectedProduct.targetRevenue?.toLocaleString()}</strong>
              </div>
              <div className="snapshot-row">
                <span>Collected So Far</span>
                <strong className="profit-pos">₹{(selectedProduct.collectedAmount || 0).toLocaleString()}</strong>
              </div>
              <div className="snapshot-row">
                <span>Still to Collect</span>
                <strong className={remaining > 0 ? "" : "profit-pos"}>
                  ₹{Math.max(0, remaining).toLocaleString()}
                  {remaining <= 0 ? " ✅ Target met!" : ""}
                </strong>
              </div>
            </div>
          )}

          <div className="field">
            <label>Amount Collected (₹) *</label>
            <input
              type="number"
              placeholder="e.g. 50"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              required
            />
            <div className="quick-amounts">
              {quickAmounts.map((q) => (
                <button
                  key={q}
                  type="button"
                  className="quick-btn"
                  onClick={() => setAmount(q)}
                >
                  ₹{q}
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <label>Note (optional)</label>
            <input
              type="text"
              placeholder="e.g. sold 2 pieces to customer"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          {error && <div className="error-msg">⚠ {error}</div>}

          <div className="modal-actions">
            <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Recording..." : "Record Sale ₹" + (amount || "0")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
