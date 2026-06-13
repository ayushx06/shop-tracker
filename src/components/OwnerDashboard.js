import { useState, useEffect } from "react";
import { subscribeProducts, subscribeSales, deleteProduct } from "../lib/db";
import AddProductModal from "./AddProductModal";
import RecordSaleModal from "./RecordSaleModal";

export default function OwnerDashboard() {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [view, setView] = useState("dashboard");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showRecordSale, setShowRecordSale] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productSearch, setProductSearch] = useState("");

  useEffect(() => {
    const u1 = subscribeProducts(setProducts);
    const u2 = subscribeSales(setSales);
    return () => { u1(); u2(); };
  }, []);

  const totalInvested = products.reduce((s, p) => s + (p.costPrice || 0), 0);
  const totalTarget = products.reduce((s, p) => s + (p.targetRevenue || 0), 0);
  const totalCollected = products.reduce((s, p) => s + (p.collectedAmount || 0), 0);
  const totalProfit = totalTarget - totalInvested;
  const stillToCollect = totalTarget - totalCollected;
  const normalizedProductSearch = productSearch.trim().toLowerCase();
  const filteredProducts = products.filter((product) =>
    [product.name, product.category].some((value) =>
      String(value || "").toLowerCase().includes(normalizedProductSearch)
    )
  );

  const formatTs = (ts) => {
    if (!ts) return "";
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-nav">
          {[["dashboard","Dashboard"],["products","Products"],["sales","Sales Log"]].map(([key,label]) => (
            <button key={key} className={`nav-tab ${view===key?"active":""}`} onClick={() => setView(key)}>{label}</button>
          ))}
        </div>
        <div className="header-actions">
          <button className="btn-ghost" onClick={() => setShowRecordSale(true)}>+ Record Sale</button>
          <button className="btn-primary" onClick={() => setShowAddProduct(true)}>+ Add Product</button>
        </div>
      </div>

      {view === "dashboard" && (
        <div className="view-content">
          <div className="stats-row">
            <div className="stat-card"><div className="stat-label">Total Invested</div><div className="stat-value blue">₹{totalInvested.toLocaleString()}</div></div>
            <div className="stat-card"><div className="stat-label">Target Revenue</div><div className="stat-value">₹{totalTarget.toLocaleString()}</div></div>
            <div className="stat-card"><div className="stat-label">Collected So Far</div><div className="stat-value green">₹{totalCollected.toLocaleString()}</div></div>
            <div className="stat-card"><div className="stat-label">Expected Profit</div><div className={`stat-value ${totalProfit>=0?"green":"red"}`}>₹{totalProfit.toLocaleString()}</div></div>
            <div className="stat-card"><div className="stat-label">Still to Collect</div><div className="stat-value red">₹{Math.max(0,stillToCollect).toLocaleString()}</div></div>
          </div>

          <div className="table-card">
            <h2 className="table-title">Products overview</h2>
            <table className="data-table">
              <thead><tr><th>Product</th><th>Cost</th><th>Target</th><th>Collected</th><th>Remaining</th><th>Progress</th></tr></thead>
              <tbody>
                {products.map(p => {
                  const collected = p.collectedAmount || 0;
                  const pct = p.targetRevenue ? Math.min(100, Math.round(collected / p.targetRevenue * 100)) : 0;
                  const remaining = Math.max(0, p.targetRevenue - collected);
                  return (
                    <tr key={p.id}>
                      <td><strong>{p.name}</strong><br /><span className="sub">{p.category}</span></td>
                      <td>₹{(p.costPrice||0).toLocaleString()}</td>
                      <td>₹{(p.targetRevenue||0).toLocaleString()}</td>
                      <td className="green">₹{collected.toLocaleString()}</td>
                      <td className={remaining===0?"green":"red"}>₹{remaining.toLocaleString()}</td>
                      <td>
                        <div className="prog-bar"><div className="prog-fill" style={{width:`${pct}%`, background: pct>=100?"#1D9E75":pct>=50?"#BA7517":"#E24B4A"}} /></div>
                        <span className="pct">{pct}%</span>
                      </td>
                    </tr>
                  );
                })}
                {products.length === 0 && <tr><td colSpan={6} className="empty-row">No products yet — click "Add Product" to start</td></tr>}
              </tbody>
            </table>
          </div>

          <div className="table-card">
            <h2 className="table-title">Recent sales</h2>
            {sales.slice(0, 10).map(s => {
              const prod = products.find(p => p.id === s.productId);
              return (
                <div key={s.id} className="sale-row">
                  <div>
                    <div className="sale-product">{prod?.name || "Unknown product"}</div>
                    <div className="sale-meta">By {s.staffName} · {formatTs(s.createdAt)}{s.note ? ` · "${s.note}"` : ""}</div>
                  </div>
                  <span className="amount-badge">+₹{s.amountCollected?.toLocaleString()}</span>
                </div>
              );
            })}
            {sales.length === 0 && <div className="empty-row">No sales recorded yet</div>}
          </div>
        </div>
      )}

      {view === "products" && (
        <div className="view-content">
          <div className="table-card">
            <div className="product-search">
              <input
                type="search"
                value={productSearch}
                onChange={(event) => setProductSearch(event.target.value)}
                placeholder="Search products by name or category"
                aria-label="Search products by name or category"
              />
            </div>
            <table className="data-table">
              <thead><tr><th>Product</th><th>Category</th><th>Cost (₹)</th><th>Target (₹)</th><th>Collected (₹)</th><th>Profit (₹)</th><th>Actions</th></tr></thead>
              <tbody>
                {filteredProducts.map(p => (
                  <tr key={p.id}>
                    <td><strong>{p.name}</strong></td>
                    <td>{p.category}</td>
                    <td>{(p.costPrice||0).toLocaleString()}</td>
                    <td>{(p.targetRevenue||0).toLocaleString()}</td>
                    <td className="green">{(p.collectedAmount||0).toLocaleString()}</td>
                    <td className="green">+{((p.targetRevenue||0)-(p.costPrice||0)).toLocaleString()}</td>
                    <td>
                      <button className="btn-small" onClick={() => { setSelectedProduct(p); setShowRecordSale(true); }}>+ Sale</button>
                      <button className="btn-small danger" onClick={() => { if(window.confirm("Delete "+p.name+"?")) deleteProduct(p.id); }}>Del</button>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && <tr><td colSpan={7} className="empty-row">No products yet</td></tr>}
                {products.length > 0 && filteredProducts.length === 0 && <tr><td colSpan={7} className="empty-row">No products found</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {view === "sales" && (
        <div className="view-content">
          <div className="table-card">
            <table className="data-table">
              <thead><tr><th>Product</th><th>Amount</th><th>Staff</th><th>Time</th><th>Note</th></tr></thead>
              <tbody>
                {sales.map(s => {
                  const prod = products.find(p => p.id === s.productId);
                  return (
                    <tr key={s.id}>
                      <td><strong>{prod?.name || "—"}</strong></td>
                      <td className="green">₹{s.amountCollected?.toLocaleString()}</td>
                      <td>{s.staffName}</td>
                      <td>{formatTs(s.createdAt)}</td>
                      <td className="sub">{s.note || "—"}</td>
                    </tr>
                  );
                })}
                {sales.length === 0 && <tr><td colSpan={5} className="empty-row">No sales yet</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showAddProduct && <AddProductModal onClose={() => setShowAddProduct(false)} />}
      {showRecordSale && <RecordSaleModal onClose={() => { setShowRecordSale(false); setSelectedProduct(null); }} preselectedProduct={selectedProduct} />}
    </div>
  );
}
