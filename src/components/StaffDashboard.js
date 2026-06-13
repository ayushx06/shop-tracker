import { useState, useEffect } from "react";
import { subscribeProducts, subscribeSales } from "../lib/db";
import { useAuth } from "../lib/AuthContext";
import RecordSaleModal from "./RecordSaleModal";

export default function StaffDashboard() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [showRecord, setShowRecord] = useState(false);
  const [view, setView] = useState("record");

  useEffect(() => {
    const u1 = subscribeProducts(setProducts);
    const u2 = subscribeSales(setSales);
    return () => { u1(); u2(); };
  }, []);

  const mySales = sales.filter(s => s.staffName === user?.name);
  const myTotal = mySales.reduce((s, sale) => s + (sale.amountCollected || 0), 0);

  const formatTs = (ts) => {
    if (!ts) return "";
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-nav">
          <button className={`nav-tab ${view==="record"?"active":""}`} onClick={() => setView("record")}>Record Sale</button>
          <button className={`nav-tab ${view==="my-sales"?"active":""}`} onClick={() => setView("my-sales")}>My Sales</button>
        </div>
        <div className="header-actions">
          <span className="staff-badge">👋 {user?.name}</span>
          <span className="collected-badge">Today: ₹{myTotal.toLocaleString()}</span>
        </div>
      </div>

      {view === "record" && (
        <div className="view-content">
          <div className="staff-product-grid">
            {products.map(p => {
              const collected = p.collectedAmount || 0;
              const remaining = Math.max(0, p.targetRevenue - collected);
              const pct = p.targetRevenue ? Math.min(100, Math.round(collected / p.targetRevenue * 100)) : 0;
              return (
                <div key={p.id} className="staff-product-card">
                  <div className="staff-product-name">{p.name}</div>
                  <div className="staff-product-cat">{p.category}</div>
                  <div className="staff-product-progress">
                    <div className="prog-bar wide"><div className="prog-fill" style={{width:`${pct}%`, background: pct>=100?"#1D9E75":pct>=50?"#BA7517":"#E24B4A"}} /></div>
                    <span className="pct">{pct}%</span>
                  </div>
                  <div className="staff-product-stats">
                    <div><span className="stat-k">Collected</span><span className="stat-v green">₹{collected.toLocaleString()}</span></div>
                    <div><span className="stat-k">Remaining</span><span className={`stat-v ${remaining===0?"green":"orange"}`}>₹{remaining.toLocaleString()}</span></div>
                  </div>
                  <button
                    className="btn-primary full"
                    onClick={() => setShowRecord(p)}
                    disabled={remaining === 0}
                  >
                    {remaining === 0 ? "✓ Target met" : "+ Record sale"}
                  </button>
                </div>
              );
            })}
            {products.length === 0 && <div className="empty-row">No products added by owner yet</div>}
          </div>
        </div>
      )}

      {view === "my-sales" && (
        <div className="view-content">
          <div className="stat-card" style={{marginBottom:"16px"}}>
            <div className="stat-label">Your total collected today</div>
            <div className="stat-value green">₹{myTotal.toLocaleString()}</div>
          </div>
          <div className="table-card">
            <table className="data-table">
              <thead><tr><th>Product</th><th>Amount</th><th>Time</th><th>Note</th></tr></thead>
              <tbody>
                {mySales.map(s => {
                  const prod = products.find(p => p.id === s.productId);
                  return (
                    <tr key={s.id}>
                      <td>{prod?.name || "—"}</td>
                      <td className="green">₹{s.amountCollected?.toLocaleString()}</td>
                      <td>{formatTs(s.createdAt)}</td>
                      <td className="sub">{s.note || "—"}</td>
                    </tr>
                  );
                })}
                {mySales.length === 0 && <tr><td colSpan={4} className="empty-row">No sales by you yet</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showRecord && (
        <RecordSaleModal
          onClose={() => setShowRecord(false)}
          preselectedProduct={showRecord}
        />
      )}
    </div>
  );
}
