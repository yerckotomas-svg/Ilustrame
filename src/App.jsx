import { useState, useEffect } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

// ── Datos iniciales ──────────────────────────────────────────────────────────
const INIT_CLIENTES = [
  { id: 1, nombre: "María González", telefono: "+56 9 1234 5678", email: "maria@gmail.com" },
  { id: 2, nombre: "Carlos Pérez", telefono: "+56 9 8765 4321", email: "carlos@gmail.com" },
  { id: 3, nombre: "Valentina Soto", telefono: "+56 9 5555 1234", email: "vale@gmail.com" },
];
const INIT_STOCK = [
  { id: 1, producto: "Polera Básica Blanca", categoria: "Poleras", cantidad: 45, costo: 3200, alerta: 10 },
  { id: 2, producto: "Polera Básica Negra", categoria: "Poleras", cantidad: 8, costo: 3200, alerta: 10 },
  { id: 3, producto: "Taza Cerámica 11oz", categoria: "Tazas", cantidad: 30, costo: 1800, alerta: 5 },
  { id: 4, producto: "Botella Térmica 500ml", categoria: "Botellas", cantidad: 3, costo: 6500, alerta: 5 },
  { id: 5, producto: "Rollo DTF 30cm", categoria: "Insumos", cantidad: 12, costo: 12000, alerta: 3 },
];
const INIT_VENTAS = [
  { id: 1, cliente: "María González", detalle: "Polera personalizada x3", monto: 22500, fecha: "2026-03-10", metodo: "Transferencia" },
  { id: 2, cliente: "Carlos Pérez", detalle: "Taza x2", monto: 9800, fecha: "2026-03-18", metodo: "Efectivo" },
  { id: 3, cliente: "Valentina Soto", detalle: "Botella térmica x1 + Polera x2", monto: 28000, fecha: "2026-03-25", metodo: "Transferencia" },
  { id: 4, cliente: "María González", detalle: "Polera x5", monto: 37500, fecha: "2026-04-01", metodo: "Transferencia" },
];
const INIT_PEDIDOS = [
  { id: 1, cliente: "María González", detalle: "Polera personalizada x3", total: 22500, estado: "Entregado", fecha: "2026-03-28", notas: "" },
  { id: 2, cliente: "Carlos Pérez", detalle: "Taza x2 + Botella x1", total: 17500, estado: "En proceso", fecha: "2026-04-01", notas: "Diseño: logo empresa azul" },
  { id: 3, cliente: "Valentina Soto", detalle: "Polera oversize x4", total: 32000, estado: "Pendiente", fecha: "2026-04-02", notas: "" },
];
const INIT_GASTOS = [
  { id: 1, descripcion: "Tinta DTF", categoria: "Insumos", monto: 18500, fecha: "2026-03-05" },
  { id: 2, descripcion: "Rollo transfer 60cm", categoria: "Insumos", monto: 24000, fecha: "2026-03-12" },
  { id: 3, descripcion: "Publicidad Instagram", categoria: "Marketing", monto: 15000, fecha: "2026-03-20" },
  { id: 4, descripcion: "Envío Starken", categoria: "Despacho", monto: 4500, fecha: "2026-04-01" },
];
const INIT_COTIZACIONES = [
  { id: 1, cliente: "Laura Muñoz", detalle: "Polera con logo empresa x10", total: 75000, estado: "Enviada", fecha: "2026-03-30" },
  { id: 2, cliente: "Empresa XYZ", detalle: "Kit corporativo x20 (polera + taza)", total: 180000, estado: "Borrador", fecha: "2026-04-01" },
];

const ESTADOS_PEDIDO = ["Pendiente", "En proceso", "Listo para entrega", "Entregado", "Cancelado"];
const ESTADOS_COT = ["Borrador", "Enviada", "Aceptada", "Rechazada"];
const CATEGORIAS = ["Poleras", "Tazas", "Botellas", "Gorros", "Insumos", "Otros"];
const CAT_GASTO = ["Insumos", "Marketing", "Despacho", "Arriendo", "Servicios", "Otros"];
const METODOS = ["Transferencia", "Efectivo", "Débito", "Crédito", "MercadoPago"];

const formatCLP = (n) => `$${Number(n || 0).toLocaleString("es-CL")}`;
const today = () => new Date().toISOString().split("T")[0];

// ── Estilos ──────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #0d0d0f;
  --surface: #18181c;
  --surface2: #222228;
  --border: #2e2e38;
  --accent: #ff5c3a;
  --accent2: #ffb547;
  --accent3: #3affd1;
  --text: #f0efe8;
  --muted: #787882;
  --green: #3affd1;
  --red: #ff5c3a;
  --yellow: #ffb547;
  --blue: #5c9eff;
  --font: 'Outfit', sans-serif;
  --mono: 'JetBrains Mono', monospace;
  --r: 14px;
  --r-sm: 8px;
  --nav-h: 72px;
}

html, body { background: var(--bg); color: var(--text); font-family: var(--font); min-height: 100dvh; }

.app { display: flex; flex-direction: column; min-height: 100dvh; max-width: 480px; margin: 0 auto; position: relative; }

/* ── Header ── */
.top-bar {
  position: sticky; top: 0; z-index: 50;
  background: linear-gradient(180deg, var(--bg) 80%, transparent);
  padding: 20px 20px 10px;
  display: flex; justify-content: space-between; align-items: center;
}
.logo { font-size: 1.25rem; font-weight: 900; letter-spacing: -0.5px; }
.logo span { color: var(--accent); }
.header-date { font-size: 0.72rem; color: var(--muted); font-family: var(--mono); }

/* ── Content ── */
.content { flex: 1; padding: 8px 20px; padding-bottom: calc(var(--nav-h) + 16px); overflow-y: auto; }

/* ── Bottom Nav ── */
.bottom-nav {
  position: fixed; bottom: 0; left: 50%; transform: translateX(-50%);
  width: 100%; max-width: 480px;
  height: var(--nav-h);
  background: rgba(24,24,28,0.95);
  backdrop-filter: blur(20px);
  border-top: 1px solid var(--border);
  display: flex; align-items: center; justify-content: space-around;
  padding: 0 8px 8px;
  z-index: 100;
}
.nav-btn {
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  padding: 8px 6px; border-radius: 12px; border: none; background: none;
  cursor: pointer; color: var(--muted); transition: all 0.18s; flex: 1;
  font-family: var(--font);
}
.nav-btn.active { color: var(--accent); }
.nav-btn.active .nav-icon-wrap { background: rgba(255,92,58,0.15); }
.nav-icon-wrap { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; transition: all 0.18s; }
.nav-label { font-size: 0.62rem; font-weight: 600; letter-spacing: 0.3px; }

/* ── Page header ── */
.page-head { margin-bottom: 20px; }
.page-title { font-size: 1.6rem; font-weight: 800; letter-spacing: -0.5px; }
.page-sub { color: var(--muted); font-size: 0.82rem; margin-top: 3px; }

/* ── Summary chips ── */
.chips { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
.chip {
  background: var(--surface); border: 1px solid var(--border); border-radius: var(--r);
  padding: 16px; position: relative; overflow: hidden;
}
.chip::before { content: ''; position: absolute; top: 0; left: 0; width: 3px; height: 100%; background: var(--chip-color, var(--accent)); border-radius: var(--r) 0 0 var(--r); }
.chip-label { font-size: 0.7rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 6px; }
.chip-value { font-family: var(--mono); font-size: 1.3rem; font-weight: 600; color: var(--text); }
.chip-value.sm { font-size: 1rem; }
.chip-sub { font-size: 0.7rem; color: var(--muted); margin-top: 3px; }

/* ── Card ── */
.card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r); overflow: hidden; margin-bottom: 14px; }
.card-head { padding: 14px 16px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
.card-title { font-size: 0.85rem; font-weight: 700; }
.card-body { padding: 0; }

/* ── List items ── */
.list-item {
  padding: 14px 16px; border-bottom: 1px solid var(--border); display: flex;
  align-items: flex-start; gap: 12px; transition: background 0.12s;
}
.list-item:last-child { border-bottom: none; }
.list-item:active { background: var(--surface2); }
.li-icon { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0; }
.li-body { flex: 1; min-width: 0; }
.li-title { font-size: 0.88rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.li-sub { font-size: 0.75rem; color: var(--muted); margin-top: 2px; }
.li-right { text-align: right; flex-shrink: 0; }
.li-amount { font-family: var(--mono); font-size: 0.88rem; font-weight: 600; }
.li-amount.green { color: var(--green); }
.li-amount.red { color: var(--red); }
.li-date { font-size: 0.7rem; color: var(--muted); margin-top: 2px; }

/* ── Badge ── */
.badge { display: inline-block; padding: 3px 9px; border-radius: 20px; font-size: 0.68rem; font-weight: 700; letter-spacing: 0.3px; }
.badge-green { background: rgba(58,255,209,0.12); color: var(--green); }
.badge-yellow { background: rgba(255,181,71,0.15); color: var(--yellow); }
.badge-red { background: rgba(255,92,58,0.12); color: var(--red); }
.badge-blue { background: rgba(92,158,255,0.12); color: var(--blue); }
.badge-gray { background: rgba(120,120,130,0.15); color: var(--muted); }

/* ── Buttons ── */
.btn { padding: 10px 18px; border-radius: var(--r-sm); font-size: 0.85rem; font-weight: 700; cursor: pointer; border: none; transition: all 0.15s; font-family: var(--font); letter-spacing: 0.2px; }
.btn-accent { background: var(--accent); color: #fff; }
.btn-accent:active { background: #e04a2a; transform: scale(0.98); }
.btn-ghost { background: var(--surface2); color: var(--text); border: 1px solid var(--border); }
.btn-ghost:active { background: var(--border); }
.btn-sm { padding: 6px 12px; font-size: 0.75rem; }
.btn-block { width: 100%; text-align: center; }
.fab {
  position: fixed; bottom: calc(var(--nav-h) + 14px); right: 20px;
  width: 52px; height: 52px; border-radius: 16px; background: var(--accent);
  display: flex; align-items: center; justify-content: center; font-size: 1.4rem;
  cursor: pointer; box-shadow: 0 4px 20px rgba(255,92,58,0.4); border: none;
  color: #fff; z-index: 90; transition: transform 0.15s;
}
.fab:active { transform: scale(0.93); }

/* ── Search ── */
.search-wrap { margin-bottom: 14px; position: relative; }
.search-input {
  width: 100%; padding: 11px 14px 11px 38px; background: var(--surface);
  border: 1.5px solid var(--border); border-radius: var(--r-sm); color: var(--text);
  font-family: var(--font); font-size: 0.88rem; outline: none;
}
.search-input:focus { border-color: var(--accent); }
.search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--muted); font-size: 0.9rem; pointer-events: none; }
.search-input::placeholder { color: var(--muted); }

/* ── Modal / Drawer ── */
.overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 200; display: flex; align-items: flex-end; }
.drawer {
  background: var(--surface); border-radius: 20px 20px 0 0; width: 100%;
  max-height: 92dvh; overflow-y: auto; padding: 20px 20px 36px;
  animation: slideUp 0.25s ease;
}
@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
.drawer-handle { width: 40px; height: 4px; background: var(--border); border-radius: 2px; margin: 0 auto 20px; }
.drawer-title { font-size: 1.15rem; font-weight: 800; margin-bottom: 18px; }

/* ── Form ── */
.form-group { margin-bottom: 14px; }
.form-label { display: block; font-size: 0.72rem; font-weight: 700; color: var(--muted); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
.form-input, .form-select, .form-textarea {
  width: 100%; padding: 11px 13px; background: var(--bg); border: 1.5px solid var(--border);
  border-radius: var(--r-sm); color: var(--text); font-family: var(--font); font-size: 0.9rem;
  outline: none; transition: border 0.15s;
}
.form-input:focus, .form-select:focus, .form-textarea:focus { border-color: var(--accent); }
.form-select option { background: var(--surface); }
.form-textarea { resize: vertical; min-height: 70px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.drawer-actions { display: flex; gap: 10px; margin-top: 20px; }
.drawer-actions .btn { flex: 1; }

/* ── Estado selector inline ── */
.estado-select {
  background: transparent; border: none; color: inherit; font-family: var(--font);
  font-size: 0.68rem; font-weight: 700; cursor: pointer; padding: 0;
}

/* ── Alert ── */
.alert { display: flex; gap: 10px; align-items: flex-start; padding: 12px 14px; border-radius: var(--r-sm); margin-bottom: 12px; font-size: 0.82rem; }
.alert-warn { background: rgba(255,181,71,0.1); border: 1px solid rgba(255,181,71,0.2); color: var(--yellow); }
.alert-info { background: rgba(92,158,255,0.1); border: 1px solid rgba(92,158,255,0.2); color: var(--blue); }

/* ── Empty ── */
.empty { text-align: center; padding: 40px 20px; color: var(--muted); }
.empty-icon { font-size: 2.5rem; margin-bottom: 10px; }
.empty-text { font-size: 0.85rem; }

/* ── Stat row ── */
.stat-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid var(--border); }
.stat-row:last-child { border-bottom: none; }
.stat-key { font-size: 0.82rem; color: var(--muted); }
.stat-val { font-family: var(--mono); font-size: 0.88rem; font-weight: 600; }

/* ── Stock qty controls ── */
.qty-ctrl { display: flex; align-items: center; gap: 8px; }
.qty-btn { width: 28px; height: 28px; border-radius: 6px; background: var(--surface2); border: 1px solid var(--border); color: var(--text); font-size: 1rem; display: flex; align-items: center; justify-content: center; cursor: pointer; }
.qty-val { font-family: var(--mono); font-size: 0.88rem; min-width: 28px; text-align: center; }

/* ── Chart wrapper ── */
.chart-wrap { padding: 14px 8px 4px; }
`;

// ── helpers ──────────────────────────────────────────────────────────────────
function badgeEstado(e) {
  const m = { "Entregado":"badge-green","Aceptada":"badge-green","En proceso":"badge-yellow","Enviada":"badge-blue","Borrador":"badge-gray","Pendiente":"badge-gray","Listo para entrega":"badge-blue","Cancelado":"badge-red","Rechazada":"badge-red" };
  return <span className={`badge ${m[e]||"badge-gray"}`}>{e}</span>;
}
function liIcon(bg, emoji) { return <div className="li-icon" style={{ background: bg }}>{emoji}</div>; }

// ══════════════════════════════════════════════════════════════════════════════
// DASHBOARD
// ══════════════════════════════════════════════════════════════════════════════
function Dashboard({ ventas, pedidos, stock, gastos, clientes, cotizaciones }) {
  const totalVentas = ventas.reduce((s, v) => s + v.monto, 0);
  const totalGastos = gastos.reduce((s, g) => s + g.monto, 0);
  const utilidad = totalVentas - totalGastos;
  const pedidosActivos = pedidos.filter(p => !["Entregado","Cancelado"].includes(p.estado)).length;
  const stockBajo = stock.filter(s => s.cantidad <= s.alerta);
  const recientes = [...pedidos].sort((a,b)=>b.fecha.localeCompare(a.fecha)).slice(0,3);

  return (
    <div>
      <div className="page-head">
        <div className="page-title">Resumen 👋</div>
        <div className="page-sub">Así va tu negocio hoy</div>
      </div>

      <div className="chips">
        <div className="chip" style={{"--chip-color":"var(--green)"}}>
          <div className="chip-label">Ventas totales</div>
          <div className="chip-value sm">{formatCLP(totalVentas)}</div>
        </div>
        <div className="chip" style={{"--chip-color":"var(--accent)"}}>
          <div className="chip-label">Gastos</div>
          <div className="chip-value sm">{formatCLP(totalGastos)}</div>
        </div>
        <div className="chip" style={{"--chip-color": utilidad >= 0 ? "var(--green)" : "var(--red)"}}>
          <div className="chip-label">Utilidad neta</div>
          <div className="chip-value sm" style={{color: utilidad>=0?"var(--green)":"var(--red)"}}>{formatCLP(utilidad)}</div>
        </div>
        <div className="chip" style={{"--chip-color":"var(--yellow)"}}>
          <div className="chip-label">Pedidos activos</div>
          <div className="chip-value">{pedidosActivos}</div>
        </div>
      </div>

      {stockBajo.length > 0 && (
        <div className="alert alert-warn">
          <span>⚠️</span>
          <span><strong>{stockBajo.length} producto{stockBajo.length>1?"s":""} con stock bajo:</strong> {stockBajo.map(s=>s.producto).join(", ")}</span>
        </div>
      )}

      <div className="card">
        <div className="card-head"><div className="card-title">Últimos pedidos</div></div>
        {recientes.length === 0
          ? <div className="empty"><div className="empty-text">Sin pedidos aún</div></div>
          : recientes.map(p => (
            <div className="list-item" key={p.id}>
              {liIcon("rgba(255,181,71,0.12)","📋")}
              <div className="li-body">
                <div className="li-title">{p.cliente}</div>
                <div className="li-sub">{p.detalle}</div>
              </div>
              <div className="li-right">
                {badgeEstado(p.estado)}
                <div className="li-date">{p.fecha}</div>
              </div>
            </div>
          ))
        }
      </div>

      <div className="card">
        <div className="card-head"><div className="card-title">Info rápida</div></div>
        <div style={{padding:"4px 16px 12px"}}>
          <div className="stat-row"><span className="stat-key">Clientes registrados</span><span className="stat-val">{clientes.length}</span></div>
          <div className="stat-row"><span className="stat-key">Cotizaciones enviadas</span><span className="stat-val">{cotizaciones.filter(c=>c.estado==="Enviada").length}</span></div>
          <div className="stat-row"><span className="stat-key">Productos en stock</span><span className="stat-val">{stock.reduce((s,p)=>s+p.cantidad,0)} uds.</span></div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// VENTAS
// ══════════════════════════════════════════════════════════════════════════════
const FORM_VENTA_EMPTY = { cliente:"", clienteLibre:"", usarNombreLibre:false, detalle:"", monto:"", fecha:today(), metodo:"Transferencia", items:[] };
// items = [{ stockId, nombre, cantidad, precioUnit }]

function Ventas({ ventas, setVentas, clientes, stock, setStock }) {
  const [drawer, setDrawer] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(FORM_VENTA_EMPTY);
  // producto en curso para agregar
  const [prodSel, setProdSel] = useState(""); // id del stock o "__libre"
  const [prodLibre, setProdLibre] = useState("");
  const [prodCant, setProdCant] = useState(1);
  const [prodPrecio, setProdPrecio] = useState("");

  const filtered = ventas.filter(v => v.cliente.toLowerCase().includes(search.toLowerCase()) || v.detalle.toLowerCase().includes(search.toLowerCase()));
  const total = filtered.reduce((s,v)=>s+v.monto,0);

  const openNew = () => { setEditItem(null); setForm(FORM_VENTA_EMPTY); resetProd(); setDrawer(true); };
  const openEdit = (v) => { setEditItem(v); setForm({ ...v, clienteLibre:"", usarNombreLibre:false, items: v.items||[] }); resetProd(); setDrawer(true); };
  const resetProd = () => { setProdSel(""); setProdLibre(""); setProdCant(1); setProdPrecio(""); };

  // Cuando selecciona un producto del stock, autocompleta precio
  const onSelectProd = (val) => {
    setProdSel(val);
    if (val && val !== "__libre") {
      const s = stock.find(s => s.id === Number(val));
      if (s) setProdPrecio(s.costo || "");
    } else {
      setProdPrecio("");
    }
  };

  const agregarItem = () => {
    const nombre = prodSel === "__libre" ? prodLibre : (stock.find(s=>s.id===Number(prodSel))?.producto || "");
    if (!nombre || !prodCant || prodCant < 1) return;
    const newItem = {
      stockId: prodSel === "__libre" ? null : Number(prodSel),
      nombre,
      cantidad: Number(prodCant),
      precioUnit: Number(prodPrecio) || 0,
    };
    const nuevosItems = [...form.items, newItem];
    const nuevoTotal = nuevosItems.reduce((s,i)=>s+(i.precioUnit*i.cantidad),0);
    const nuevoDetalle = nuevosItems.map(i=>`${i.nombre} x${i.cantidad}`).join(" + ");
    setForm(f => ({ ...f, items: nuevosItems, monto: nuevoTotal || f.monto, detalle: nuevoDetalle }));
    resetProd();
  };

  const quitarItem = (idx) => {
    const nuevosItems = form.items.filter((_,i)=>i!==idx);
    const nuevoTotal = nuevosItems.reduce((s,i)=>s+(i.precioUnit*i.cantidad),0);
    const nuevoDetalle = nuevosItems.map(i=>`${i.nombre} x${i.cantidad}`).join(" + ");
    setForm(f => ({ ...f, items: nuevosItems, monto: nuevoTotal || f.monto, detalle: nuevoDetalle }));
  };

  const guardar = () => {
    const nombreFinal = form.usarNombreLibre ? form.clienteLibre : form.cliente;
    if (!nombreFinal || !form.monto) return;
    const item = { ...form, cliente: nombreFinal, monto: Number(form.monto) };
    delete item.clienteLibre; delete item.usarNombreLibre;
    if (editItem) {
      setVentas(ventas.map(v => v.id===editItem.id ? {...item, id:editItem.id} : v));
    } else {
      // Descontar del stock solo al crear (no al editar)
      form.items.forEach(it => {
        if (it.stockId) {
          setStock(prev => prev.map(s => s.id===it.stockId ? {...s, cantidad: Math.max(0, s.cantidad - it.cantidad)} : s));
        }
      });
      setVentas([{ ...item, id:Date.now() }, ...ventas]);
    }
    setDrawer(false);
  };

  const eliminar = (id) => { if(confirm("¿Eliminar esta venta?")) setVentas(ventas.filter(v=>v.id!==id)); };

  const prodSeleccionado = prodSel && prodSel !== "__libre" ? stock.find(s=>s.id===Number(prodSel)) : null;

  return (
    <div>
      <div className="page-head">
        <div className="page-title">Ventas 💸</div>
        <div className="page-sub">Ingresos cobrados</div>
      </div>

      <div className="chips" style={{gridTemplateColumns:"1fr 1fr 1fr"}}>
        <div className="chip" style={{"--chip-color":"var(--green)"}}>
          <div className="chip-label">Total</div>
          <div className="chip-value sm">{formatCLP(total)}</div>
        </div>
        <div className="chip" style={{"--chip-color":"var(--blue)"}}>
          <div className="chip-label">Ventas</div>
          <div className="chip-value">{filtered.length}</div>
        </div>
        <div className="chip" style={{"--chip-color":"var(--yellow)"}}>
          <div className="chip-label">Prom.</div>
          <div className="chip-value sm">{filtered.length ? formatCLP(Math.round(total/filtered.length)) : "$0"}</div>
        </div>
      </div>

      <div className="search-wrap">
        <span className="search-icon">🔍</span>
        <input className="search-input" placeholder="Buscar venta..." value={search} onChange={e=>setSearch(e.target.value)} />
      </div>

      {/* Agrupado por mes */}
      {(() => {
        if (filtered.length === 0) return (
          <div className="card"><div className="empty"><div className="empty-icon">💰</div><div className="empty-text">Sin ventas registradas</div></div></div>
        );
        // Agrupar por año-mes
        const grupos = {};
        [...filtered].sort((a,b)=>b.fecha.localeCompare(a.fecha)).forEach(v => {
          const [y,m] = v.fecha.split("-");
          const key = `${y}-${m}`;
          if (!grupos[key]) grupos[key] = [];
          grupos[key].push(v);
        });
        const mesesNombre = ["","Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
        return Object.entries(grupos).map(([key, items]) => {
          const [y, m] = key.split("-");
          const totalMes = items.reduce((s,v)=>s+v.monto,0);
          return (
            <div key={key} style={{marginBottom:14}}>
              {/* Cabecera del mes */}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8,padding:"0 2px"}}>
                <span style={{fontSize:"0.78rem",fontWeight:700,color:"var(--muted)",textTransform:"uppercase",letterSpacing:"0.8px"}}>
                  {mesesNombre[Number(m)]} {y}
                </span>
                <span style={{fontFamily:"var(--mono)",fontSize:"0.82rem",fontWeight:700,color:"var(--green)"}}>{formatCLP(totalMes)}</span>
              </div>
              <div className="card">
                {items.map(v=>(
                  <div className="list-item" key={v.id}>
                    {liIcon("rgba(58,255,209,0.10)","💰")}
                    <div className="li-body">
                      <div className="li-title">{v.cliente}</div>
                      <div className="li-sub">{v.detalle} · {v.metodo}</div>
                    </div>
                    <div className="li-right">
                      <div className="li-amount green">{formatCLP(v.monto)}</div>
                      <div className="li-date">{v.fecha}</div>
                      <div style={{display:"flex",gap:4,marginTop:4,justifyContent:"flex-end"}}>
                        <button className="btn btn-sm btn-ghost" style={{padding:"3px 8px",fontSize:"0.7rem"}} onClick={()=>openEdit(v)}>✏️</button>
                        <button className="btn btn-sm" style={{background:"rgba(255,92,58,0.1)",color:"var(--red)",border:"none",cursor:"pointer",borderRadius:6,padding:"3px 8px",fontSize:"0.7rem"}} onClick={()=>eliminar(v.id)}>✕</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        });
      })()}

      <button className="fab" onClick={openNew}>＋</button>

      {drawer && (
        <div className="overlay" onClick={e=>e.target===e.currentTarget&&setDrawer(false)}>
          <div className="drawer">
            <div className="drawer-handle"/>
            <div className="drawer-title">{editItem ? "Editar venta" : "Nueva venta"}</div>

            {/* Cliente */}
            <div className="form-group">
              <label className="form-label">Cliente</label>
              {!form.usarNombreLibre ? (
                <select className="form-select" value={form.cliente} onChange={e=>{
                  if(e.target.value==="__libre") setForm({...form,usarNombreLibre:true,cliente:""});
                  else setForm({...form,cliente:e.target.value});
                }}>
                  <option value="">Seleccionar...</option>
                  {clientes.map(c=><option key={c.id} value={c.nombre}>{c.nombre}</option>)}
                  <option value="__libre">✏️ Escribir nombre...</option>
                </select>
              ) : (
                <div style={{display:"flex",gap:8}}>
                  <input className="form-input" placeholder="Nombre del cliente" value={form.clienteLibre} onChange={e=>setForm({...form,clienteLibre:e.target.value})} autoFocus />
                  <button className="btn btn-ghost btn-sm" onClick={()=>setForm({...form,usarNombreLibre:false,clienteLibre:""})}>↩</button>
                </div>
              )}
            </div>

            {/* Agregar productos desde stock */}
            <div className="form-group">
              <label className="form-label">Agregar productos</label>
              <select className="form-select" value={prodSel} onChange={e=>onSelectProd(e.target.value)} style={{marginBottom:8}}>
                <option value="">Seleccionar producto del stock...</option>
                {stock.map(s=><option key={s.id} value={s.id}>{s.producto} — stock: {s.cantidad}</option>)}
                <option value="__libre">✏️ Escribir producto manualmente...</option>
              </select>
              {prodSel==="__libre" && (
                <input className="form-input" placeholder="Nombre del producto" value={prodLibre} onChange={e=>setProdLibre(e.target.value)} style={{marginBottom:8}} />
              )}
              {prodSel && (
                <>
                  {prodSeleccionado && prodSeleccionado.cantidad === 0 && (
                    <div style={{color:"var(--red)",fontSize:"0.75rem",marginBottom:6}}>⚠️ Este producto no tiene stock disponible</div>
                  )}
                  <div className="form-row" style={{marginBottom:8}}>
                    <div className="form-group" style={{marginBottom:0}}>
                      <label className="form-label">Cantidad</label>
                      <input className="form-input" type="number" min="1" max={prodSeleccionado?.cantidad || 9999} placeholder="1" value={prodCant} onChange={e=>setProdCant(e.target.value)} />
                    </div>
                    <div className="form-group" style={{marginBottom:0}}>
                      <label className="form-label">Precio unit. ($)</label>
                      <input className="form-input" type="number" placeholder="0" value={prodPrecio} onChange={e=>setProdPrecio(e.target.value)} />
                    </div>
                  </div>
                  <button className="btn btn-ghost btn-sm" style={{width:"100%",marginBottom:4}} onClick={agregarItem}>＋ Agregar al detalle</button>
                </>
              )}
            </div>

            {/* Items agregados */}
            {form.items.length > 0 && (
              <div style={{background:"var(--bg)",borderRadius:8,padding:"8px 12px",marginBottom:14}}>
                <div style={{fontSize:"0.72rem",color:"var(--muted)",marginBottom:6,textTransform:"uppercase",letterSpacing:"0.5px"}}>Productos en esta venta</div>
                {form.items.map((it,idx)=>(
                  <div key={idx} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0",borderBottom:"1px solid var(--border)"}}>
                    <span style={{fontSize:"0.82rem"}}>{it.nombre} x{it.cantidad}</span>
                    <div style={{display:"flex",gap:8,alignItems:"center"}}>
                      <span style={{fontSize:"0.82rem",color:"var(--green)",fontFamily:"var(--mono)"}}>{formatCLP(it.precioUnit*it.cantidad)}</span>
                      <button onClick={()=>quitarItem(idx)} style={{background:"none",border:"none",color:"var(--red)",cursor:"pointer",fontSize:"0.9rem"}}>✕</button>
                    </div>
                  </div>
                ))}
                <div style={{display:"flex",justifyContent:"space-between",paddingTop:6,fontSize:"0.85rem",fontWeight:700}}>
                  <span>Total automático</span>
                  <span style={{color:"var(--green)",fontFamily:"var(--mono)"}}>{formatCLP(form.items.reduce((s,i)=>s+(i.precioUnit*i.cantidad),0))}</span>
                </div>
              </div>
            )}

            {/* Detalle manual / resumen */}
            <div className="form-group">
              <label className="form-label">Detalle / descripción</label>
              <input className="form-input" placeholder="Se llena automático o escribe a mano" value={form.detalle} onChange={e=>setForm({...form,detalle:e.target.value})} />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Monto total ($)</label>
                <input className="form-input" type="number" placeholder="0" value={form.monto} onChange={e=>setForm({...form,monto:e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Método pago</label>
                <select className="form-select" value={form.metodo} onChange={e=>setForm({...form,metodo:e.target.value})}>
                  {METODOS.map(m=><option key={m}>{m}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Fecha</label>
              <input className="form-input" type="date" value={form.fecha} onChange={e=>setForm({...form,fecha:e.target.value})} />
            </div>
            <div className="drawer-actions">
              <button className="btn btn-ghost" onClick={()=>setDrawer(false)}>Cancelar</button>
              <button className="btn btn-accent" onClick={guardar}>{editItem ? "Guardar cambios" : "Guardar venta"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PEDIDOS
// ══════════════════════════════════════════════════════════════════════════════
function Pedidos({ pedidos, setPedidos, clientes, setVentas }) {
  const [drawer, setDrawer] = useState(false);
  const [search, setSearch] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [form, setForm] = useState({ cliente:"", clienteLibre:"", usarNombreLibre:false, detalle:"", total:"", estado:"Pendiente", fecha:today(), notas:"" });
  const [pagoModal, setPagoModal] = useState(null); // pedido pendiente de confirmar pago
  const [pagoFecha, setPagoFecha] = useState(today());
  const [pagoMetodo, setPagoMetodo] = useState("Transferencia");

  const todos = ["Todos", ...ESTADOS_PEDIDO];
  let filtered = pedidos.filter(p =>
    (filtroEstado==="Todos" || p.estado===filtroEstado) &&
    (p.cliente.toLowerCase().includes(search.toLowerCase()) || p.detalle.toLowerCase().includes(search.toLowerCase()))
  );

  const guardar = () => {
    const nombreFinal = form.usarNombreLibre ? form.clienteLibre : form.cliente;
    if (!nombreFinal || !form.detalle) return;
    const item = { ...form, cliente: nombreFinal, total:Number(form.total) };
    delete item.clienteLibre; delete item.usarNombreLibre;
    setPedidos([{ ...item, id:Date.now() }, ...pedidos]);
    setForm({ cliente:"", clienteLibre:"", usarNombreLibre:false, detalle:"", total:"", estado:"Pendiente", fecha:today(), notas:"" });
    setDrawer(false);
  };
  const cambiarEstado = (id, estado) => setPedidos(pedidos.map(p=>p.id===id?{...p,estado}:p));
  const eliminar = (id) => setPedidos(pedidos.filter(p=>p.id!==id));

  const abrirPago = (p) => {
    if (p.pagado) return;
    setPagoFecha(today());
    setPagoMetodo("Transferencia");
    setPagoModal(p);
  };

  const confirmarPago = () => {
    if (!pagoModal) return;
    setVentas(prev => [{
      id: Date.now(),
      cliente: pagoModal.cliente,
      detalle: pagoModal.detalle,
      monto: pagoModal.total,
      fecha: pagoFecha,
      metodo: pagoMetodo,
      items: [],
    }, ...prev]);
    setPedidos(prev => prev.map(x => x.id===pagoModal.id ? {...x, pagado:true, estado:"Entregado"} : x));
    setPagoModal(null);
  };

  const stateColor = { "Pendiente":"var(--muted)","En proceso":"var(--yellow)","Listo para entrega":"var(--blue)","Entregado":"var(--green)","Cancelado":"var(--red)" };

  return (
    <div>
      <div className="page-head">
        <div className="page-title">Pedidos 📋</div>
        <div className="page-sub">Seguimiento de órdenes</div>
      </div>

      <div className="search-wrap">
        <span className="search-icon">🔍</span>
        <input className="search-input" placeholder="Buscar pedido..." value={search} onChange={e=>setSearch(e.target.value)} />
      </div>

      <div style={{display:"flex",gap:8,marginBottom:14,overflowX:"auto",paddingBottom:4}}>
        {todos.map(e=>(
          <button key={e} className={`btn btn-sm ${filtroEstado===e?"btn-accent":"btn-ghost"}`}
            style={{whiteSpace:"nowrap",flexShrink:0}} onClick={()=>setFiltroEstado(e)}>{e}</button>
        ))}
      </div>

      <div className="card">
        {filtered.length===0
          ? <div className="empty"><div className="empty-icon">📋</div><div className="empty-text">Sin pedidos</div></div>
          : filtered.map(p=>(
            <div className="list-item" key={p.id}>
              <div className="li-icon" style={{background:"rgba(255,181,71,0.1)",border:`2px solid ${stateColor[p.estado]||"var(--border)"}`,borderRadius:10}}>📦</div>
              <div className="li-body">
                <div className="li-title">{p.cliente}</div>
                <div className="li-sub">{p.detalle}</div>
                {p.notas && <div className="li-sub" style={{color:"var(--muted)",fontStyle:"italic",marginTop:2}}>"{p.notas}"</div>}
                <div style={{marginTop:6,display:"flex",gap:6,alignItems:"center"}}>
                  <select className="estado-select" style={{color:stateColor[p.estado]||"var(--muted)"}}
                    value={p.estado} onChange={e=>cambiarEstado(p.id,e.target.value)}>
                    {ESTADOS_PEDIDO.map(e=><option key={e}>{e}</option>)}
                  </select>
                </div>
              </div>
              <div className="li-right">
                <div className="li-amount">{formatCLP(p.total)}</div>
                <div className="li-date">{p.fecha}</div>
                <div style={{display:"flex",gap:4,marginTop:4,flexDirection:"column",alignItems:"flex-end"}}>
                  {!p.pagado
                    ? <button
                        className="btn btn-sm"
                        style={{background:"rgba(58,255,209,0.12)",color:"var(--green)",border:"1px solid rgba(58,255,209,0.25)",cursor:"pointer",borderRadius:6,padding:"4px 10px",fontSize:"0.72rem",fontWeight:700}}
                        onClick={()=>abrirPago(p)}>
                        💰 Pagado
                      </button>
                    : <span className="badge badge-green">✓ Pagado</span>
                  }
                  <button className="btn btn-sm" style={{background:"rgba(255,92,58,0.1)",color:"var(--red)",border:"none",cursor:"pointer",borderRadius:6,padding:"3px 8px",fontSize:"0.7rem"}} onClick={()=>eliminar(p.id)}>✕</button>
                </div>
              </div>
            </div>
          ))
        }
      </div>

      <button className="fab" onClick={()=>setDrawer(true)}>＋</button>

      {/* Modal confirmar pago */}
      {pagoModal && (
        <div className="overlay" onClick={e=>e.target===e.currentTarget&&setPagoModal(null)}>
          <div className="drawer">
            <div className="drawer-handle"/>
            <div className="drawer-title">Confirmar pago 💰</div>
            <div style={{background:"var(--bg)",borderRadius:8,padding:"10px 14px",marginBottom:16,fontSize:"0.85rem"}}>
              <div style={{fontWeight:700,marginBottom:4}}>{pagoModal.cliente}</div>
              <div style={{color:"var(--muted)",marginBottom:4}}>{pagoModal.detalle}</div>
              <div style={{fontFamily:"var(--mono)",color:"var(--green)",fontWeight:700}}>{formatCLP(pagoModal.total)}</div>
            </div>
            <div className="form-group">
              <label className="form-label">Fecha de pago</label>
              <input className="form-input" type="date" value={pagoFecha} onChange={e=>setPagoFecha(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Método de pago</label>
              <select className="form-select" value={pagoMetodo} onChange={e=>setPagoMetodo(e.target.value)}>
                {METODOS.map(m=><option key={m}>{m}</option>)}
              </select>
            </div>
            <div className="drawer-actions">
              <button className="btn btn-ghost" onClick={()=>setPagoModal(null)}>Cancelar</button>
              <button className="btn btn-accent" onClick={confirmarPago}>Registrar pago</button>
            </div>
          </div>
        </div>
      )}

      {drawer && (
        <div className="overlay" onClick={e=>e.target===e.currentTarget&&setDrawer(false)}>
          <div className="drawer">
            <div className="drawer-handle"/>
            <div className="drawer-title">Nuevo pedido</div>
            <div className="form-group">
              <label className="form-label">Cliente</label>
              {!form.usarNombreLibre ? (
                <select className="form-select" value={form.cliente} onChange={e=>{
                  if(e.target.value==="__libre") setForm({...form,usarNombreLibre:true,cliente:""});
                  else setForm({...form,cliente:e.target.value});
                }}>
                  <option value="">Seleccionar...</option>
                  {clientes.map(c=><option key={c.id} value={c.nombre}>{c.nombre}</option>)}
                  <option value="__libre">✏️ Escribir nombre...</option>
                </select>
              ) : (
                <div style={{display:"flex",gap:8}}>
                  <input className="form-input" placeholder="Nombre del cliente" value={form.clienteLibre} onChange={e=>setForm({...form,clienteLibre:e.target.value})} autoFocus />
                  <button className="btn btn-ghost btn-sm" onClick={()=>setForm({...form,usarNombreLibre:false,clienteLibre:""})}>↩</button>
                </div>
              )}
            </div>
            <div className="form-group">
              <label className="form-label">Detalle del pedido</label>
              <input className="form-input" placeholder="Ej: Polera oversize x4" value={form.detalle} onChange={e=>setForm({...form,detalle:e.target.value})} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Total ($)</label>
                <input className="form-input" type="number" placeholder="0" value={form.total} onChange={e=>setForm({...form,total:e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Fecha</label>
                <input className="form-input" type="date" value={form.fecha} onChange={e=>setForm({...form,fecha:e.target.value})} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Estado inicial</label>
              <select className="form-select" value={form.estado} onChange={e=>setForm({...form,estado:e.target.value})}>
                {ESTADOS_PEDIDO.map(e=><option key={e}>{e}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Notas / diseño</label>
              <textarea className="form-textarea" placeholder="Ej: Logo en pecho izquierdo, color azul navy" value={form.notas} onChange={e=>setForm({...form,notas:e.target.value})} />
            </div>
            <div className="drawer-actions">
              <button className="btn btn-ghost" onClick={()=>setDrawer(false)}>Cancelar</button>
              <button className="btn btn-accent" onClick={guardar}>Crear pedido</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// STOCK
// ══════════════════════════════════════════════════════════════════════════════
function Stock({ stock, setStock }) {
  const [drawer, setDrawer] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ producto:"", categoria:"Poleras", cantidad:"", costo:"", alerta:5 });

  const filtered = stock.filter(s => s.producto.toLowerCase().includes(search.toLowerCase()) || s.categoria.toLowerCase().includes(search.toLowerCase()));

  const openNew = () => { setEditItem(null); setForm({ producto:"", categoria:"Poleras", cantidad:"", costo:"", alerta:5 }); setDrawer(true); };
  const openEdit = (item) => { setEditItem(item); setForm({...item}); setDrawer(true); };
  const guardar = () => {
    if (!form.producto||form.cantidad==="") return;
    const item = {...form, cantidad:Number(form.cantidad), costo:Number(form.costo), alerta:Number(form.alerta)};
    if (editItem) setStock(stock.map(s=>s.id===editItem.id?{...item,id:editItem.id}:s));
    else setStock([...stock, {...item,id:Date.now()}]);
    setDrawer(false);
  };
  const ajustar = (id, d) => setStock(stock.map(s=>s.id===id?{...s,cantidad:Math.max(0,s.cantidad+d)}:s));
  const eliminar = (id) => setStock(stock.filter(s=>s.id!==id));

  return (
    <div>
      <div className="page-head">
        <div className="page-title">Stock 📦</div>
        <div className="page-sub">Control de inventario</div>
      </div>

      <div className="chips" style={{gridTemplateColumns:"1fr 1fr 1fr"}}>
        <div className="chip" style={{"--chip-color":"var(--blue)"}}>
          <div className="chip-label">Productos</div>
          <div className="chip-value">{stock.length}</div>
        </div>
        <div className="chip" style={{"--chip-color":"var(--green)"}}>
          <div className="chip-label">Unidades</div>
          <div className="chip-value">{stock.reduce((s,p)=>s+p.cantidad,0)}</div>
        </div>
        <div className="chip" style={{"--chip-color":"var(--red)"}}>
          <div className="chip-label">Stock bajo</div>
          <div className="chip-value" style={{color:stock.filter(s=>s.cantidad<=s.alerta).length>0?"var(--red)":"var(--green)"}}>
            {stock.filter(s=>s.cantidad<=s.alerta).length}
          </div>
        </div>
      </div>

      <div className="search-wrap">
        <span className="search-icon">🔍</span>
        <input className="search-input" placeholder="Buscar producto..." value={search} onChange={e=>setSearch(e.target.value)} />
      </div>

      <div className="card">
        {filtered.length===0
          ? <div className="empty"><div className="empty-icon">📦</div><div className="empty-text">Sin productos</div></div>
          : filtered.map(s=>(
            <div className="list-item" key={s.id} style={s.cantidad<=s.alerta?{background:"rgba(255,92,58,0.04)"}:{}}>
              <div className="li-icon" style={{background:s.cantidad<=s.alerta?"rgba(255,92,58,0.12)":"rgba(58,255,209,0.08)"}}>
                {s.categoria==="Poleras"?"👕":s.categoria==="Tazas"?"☕":s.categoria==="Botellas"?"🍶":s.categoria==="Insumos"?"🖨️":"📦"}
              </div>
              <div className="li-body">
                <div className="li-title">{s.producto}</div>
                <div className="li-sub">{s.categoria} · costo {formatCLP(s.costo)}</div>
                {s.cantidad<=s.alerta && <span className="badge badge-red" style={{marginTop:4,display:"inline-block"}}>⚠️ Stock bajo</span>}
              </div>
              <div className="li-right" style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6}}>
                <div className="qty-ctrl">
                  <button className="qty-btn" onClick={()=>ajustar(s.id,-1)}>−</button>
                  <span className="qty-val">{s.cantidad}</span>
                  <button className="qty-btn" onClick={()=>ajustar(s.id,1)}>+</button>
                </div>
                <div style={{display:"flex",gap:5}}>
                  <button className="btn btn-sm btn-ghost" onClick={()=>openEdit(s)}>✏️</button>
                  <button className="btn btn-sm" style={{background:"rgba(255,92,58,0.1)",color:"var(--red)",border:"none",cursor:"pointer",borderRadius:6,padding:"5px 10px",fontSize:"0.72rem"}} onClick={()=>eliminar(s.id)}>✕</button>
                </div>
              </div>
            </div>
          ))
        }
      </div>

      <button className="fab" onClick={openNew}>＋</button>

      {drawer && (
        <div className="overlay" onClick={e=>e.target===e.currentTarget&&setDrawer(false)}>
          <div className="drawer">
            <div className="drawer-handle"/>
            <div className="drawer-title">{editItem?"Editar producto":"Nuevo producto"}</div>
            <div className="form-group">
              <label className="form-label">Nombre del producto</label>
              <input className="form-input" placeholder="Ej: Polera Básica Blanca" value={form.producto} onChange={e=>setForm({...form,producto:e.target.value})} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Categoría</label>
                <select className="form-select" value={form.categoria} onChange={e=>setForm({...form,categoria:e.target.value})}>
                  {CATEGORIAS.map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Cantidad</label>
                <input className="form-input" type="number" placeholder="0" value={form.cantidad} onChange={e=>setForm({...form,cantidad:e.target.value})} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Costo unit. ($)</label>
                <input className="form-input" type="number" placeholder="0" value={form.costo} onChange={e=>setForm({...form,costo:e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Alerta mínimo</label>
                <input className="form-input" type="number" placeholder="5" value={form.alerta} onChange={e=>setForm({...form,alerta:e.target.value})} />
              </div>
            </div>
            <div className="drawer-actions">
              <button className="btn btn-ghost" onClick={()=>setDrawer(false)}>Cancelar</button>
              <button className="btn btn-accent" onClick={guardar}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// CLIENTES
// ══════════════════════════════════════════════════════════════════════════════
function Clientes({ clientes, setClientes, ventas, pedidos }) {
  const [drawer, setDrawer] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ nombre:"", telefono:"", email:"" });

  const filtered = clientes.filter(c =>
    c.nombre.toLowerCase().includes(search.toLowerCase()) ||
    c.telefono.includes(search) || c.email.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => { setEditItem(null); setForm({ nombre:"", telefono:"", email:"" }); setDrawer(true); };
  const openEdit = (c) => { setEditItem(c); setForm({ nombre:c.nombre, telefono:c.telefono, email:c.email }); setDrawer(true); };

  const guardar = () => {
    if (!form.nombre) return;
    if (editItem) setClientes(clientes.map(c => c.id===editItem.id ? {...c, ...form} : c));
    else setClientes([...clientes, {...form, id:Date.now()}]);
    setDrawer(false);
  };
  const eliminar = (id) => { if(confirm("¿Eliminar este cliente?")) setClientes(clientes.filter(c=>c.id!==id)); };

  const getClienteStats = (nombre) => ({
    pedidos: pedidos.filter(p=>p.cliente===nombre).length,
    ventas: ventas.filter(v=>v.cliente===nombre).reduce((s,v)=>s+v.monto,0),
  });

  return (
    <div>
      <div className="page-head">
        <div className="page-title">Clientes 👥</div>
        <div className="page-sub">{clientes.length} clientes registrados</div>
      </div>

      <div className="search-wrap">
        <span className="search-icon">🔍</span>
        <input className="search-input" placeholder="Buscar cliente..." value={search} onChange={e=>setSearch(e.target.value)} />
      </div>

      <div className="card">
        {filtered.length===0
          ? <div className="empty"><div className="empty-icon">👥</div><div className="empty-text">Sin clientes</div></div>
          : filtered.map(c => {
            const stats = getClienteStats(c.nombre);
            return (
              <div className="list-item" key={c.id}>
                <div className="li-icon" style={{background:"rgba(92,158,255,0.1)",fontSize:"1.2rem"}}>
                  {c.nombre.charAt(0).toUpperCase()}
                </div>
                <div className="li-body">
                  <div className="li-title">{c.nombre}</div>
                  <div className="li-sub">{c.telefono}</div>
                  <div className="li-sub">{c.email}</div>
                </div>
                <div className="li-right">
                  <span className="badge badge-blue">{stats.pedidos} ped.</span>
                  <div className="li-date" style={{color:"var(--green)",marginTop:4}}>{formatCLP(stats.ventas)}</div>
                  <div style={{display:"flex",gap:4,marginTop:6,justifyContent:"flex-end"}}>
                    <button className="btn btn-sm btn-ghost" style={{padding:"3px 8px",fontSize:"0.7rem"}} onClick={()=>openEdit(c)}>✏️</button>
                    <button className="btn btn-sm" style={{background:"rgba(255,92,58,0.1)",color:"var(--red)",border:"none",cursor:"pointer",borderRadius:6,padding:"3px 8px",fontSize:"0.7rem"}} onClick={()=>eliminar(c.id)}>✕</button>
                  </div>
                </div>
              </div>
            );
          })
        }
      </div>

      <button className="fab" onClick={openNew}>＋</button>

      {drawer && (
        <div className="overlay" onClick={e=>e.target===e.currentTarget&&setDrawer(false)}>
          <div className="drawer">
            <div className="drawer-handle"/>
            <div className="drawer-title">{editItem ? "Editar cliente" : "Nuevo cliente"}</div>
            <div className="form-group">
              <label className="form-label">Nombre completo</label>
              <input className="form-input" placeholder="Nombre del cliente" value={form.nombre} onChange={e=>setForm({...form,nombre:e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Teléfono</label>
              <input className="form-input" placeholder="+56 9 XXXX XXXX" value={form.telefono} onChange={e=>setForm({...form,telefono:e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" placeholder="email@ejemplo.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
            </div>
            <div className="drawer-actions">
              <button className="btn btn-ghost" onClick={()=>setDrawer(false)}>Cancelar</button>
              <button className="btn btn-accent" onClick={guardar}>{editItem ? "Guardar cambios" : "Guardar cliente"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// GASTOS
// ══════════════════════════════════════════════════════════════════════════════
function Gastos({ gastos, setGastos }) {
  const [drawer, setDrawer] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ descripcion:"", categoria:"Insumos", monto:"", fecha:today() });

  const total = gastos.reduce((s,g)=>s+g.monto,0);
  const porCat = CAT_GASTO.map(c=>({cat:c, total:gastos.filter(g=>g.categoria===c).reduce((s,g)=>s+g.monto,0)})).filter(x=>x.total>0);

  const openNew = () => { setEditItem(null); setForm({ descripcion:"", categoria:"Insumos", monto:"", fecha:today() }); setDrawer(true); };
  const openEdit = (g) => { setEditItem(g); setForm({...g}); setDrawer(true); };

  const guardar = () => {
    if (!form.descripcion||!form.monto) return;
    const item = { ...form, monto:Number(form.monto) };
    if (editItem) setGastos(gastos.map(g => g.id===editItem.id ? {...item, id:editItem.id} : g));
    else setGastos([{ ...item, id:Date.now() }, ...gastos]);
    setDrawer(false);
  };
  const eliminar = (id) => { if(confirm("¿Eliminar este gasto?")) setGastos(gastos.filter(g=>g.id!==id)); };

  const COLORS = ["#ff5c3a","#ffb547","#3affd1","#5c9eff","#a855f7","#f97316"];

  return (
    <div>
      <div className="page-head">
        <div className="page-title">Gastos 🧾</div>
        <div className="page-sub">Egresos y costos</div>
      </div>

      <div className="chips">
        <div className="chip" style={{"--chip-color":"var(--red)"}}>
          <div className="chip-label">Total gastos</div>
          <div className="chip-value sm">{formatCLP(total)}</div>
        </div>
        <div className="chip" style={{"--chip-color":"var(--yellow)"}}>
          <div className="chip-label">Registros</div>
          <div className="chip-value">{gastos.length}</div>
        </div>
      </div>

      {porCat.length > 0 && (
        <div className="card" style={{marginBottom:14}}>
          <div className="card-head"><div className="card-title">Por categoría</div></div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={porCat} dataKey="total" nameKey="cat" cx="50%" cy="50%" outerRadius={70} label={({cat})=>cat}>
                  {porCat.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
                </Pie>
                <Tooltip formatter={(v)=>formatCLP(v)} contentStyle={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:8,color:"var(--text)",fontSize:"0.8rem"}}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="card">
        {gastos.length===0
          ? <div className="empty"><div className="empty-icon">🧾</div><div className="empty-text">Sin gastos registrados</div></div>
          : [...gastos].sort((a,b)=>b.fecha.localeCompare(a.fecha)).map(g=>(
            <div className="list-item" key={g.id}>
              {liIcon("rgba(255,92,58,0.10)","🧾")}
              <div className="li-body">
                <div className="li-title">{g.descripcion}</div>
                <div className="li-sub">{g.categoria}</div>
              </div>
              <div className="li-right">
                <div className="li-amount red">-{formatCLP(g.monto)}</div>
                <div className="li-date">{g.fecha}</div>
                <div style={{display:"flex",gap:4,marginTop:4,justifyContent:"flex-end"}}>
                  <button className="btn btn-sm btn-ghost" style={{padding:"3px 8px",fontSize:"0.7rem"}} onClick={()=>openEdit(g)}>✏️</button>
                  <button className="btn btn-sm" style={{background:"rgba(255,92,58,0.1)",color:"var(--red)",border:"none",cursor:"pointer",borderRadius:6,padding:"3px 8px",fontSize:"0.7rem"}} onClick={()=>eliminar(g.id)}>✕</button>
                </div>
              </div>
            </div>
          ))
        }
      </div>

      <button className="fab" onClick={openNew}>＋</button>

      {drawer && (
        <div className="overlay" onClick={e=>e.target===e.currentTarget&&setDrawer(false)}>
          <div className="drawer">
            <div className="drawer-handle"/>
            <div className="drawer-title">{editItem ? "Editar gasto" : "Nuevo gasto"}</div>
            <div className="form-group">
              <label className="form-label">Descripción</label>
              <input className="form-input" placeholder="Ej: Tinta DTF 1L" value={form.descripcion} onChange={e=>setForm({...form,descripcion:e.target.value})} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Categoría</label>
                <select className="form-select" value={form.categoria} onChange={e=>setForm({...form,categoria:e.target.value})}>
                  {CAT_GASTO.map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Monto ($)</label>
                <input className="form-input" type="number" placeholder="0" value={form.monto} onChange={e=>setForm({...form,monto:e.target.value})} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Fecha</label>
              <input className="form-input" type="date" value={form.fecha} onChange={e=>setForm({...form,fecha:e.target.value})} />
            </div>
            <div className="drawer-actions">
              <button className="btn btn-ghost" onClick={()=>setDrawer(false)}>Cancelar</button>
              <button className="btn btn-accent" onClick={guardar}>{editItem ? "Guardar cambios" : "Guardar gasto"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// COTIZACIONES
// ══════════════════════════════════════════════════════════════════════════════
function Cotizaciones({ cotizaciones, setCotizaciones, clientes }) {
  const [drawer, setDrawer] = useState(false);
  const [form, setForm] = useState({ cliente:"", detalle:"", total:"", estado:"Borrador", fecha:today() });

  const guardar = () => {
    if (!form.cliente||!form.detalle) return;
    setCotizaciones([{ ...form, id:Date.now(), total:Number(form.total) }, ...cotizaciones]);
    setForm({ cliente:"", detalle:"", total:"", estado:"Borrador", fecha:today() });
    setDrawer(false);
  };
  const cambiarEstado = (id, estado) => setCotizaciones(cotizaciones.map(c=>c.id===id?{...c,estado}:c));
  const eliminar = (id) => setCotizaciones(cotizaciones.filter(c=>c.id!==id));

  return (
    <div>
      <div className="page-head">
        <div className="page-title">Cotizaciones 📄</div>
        <div className="page-sub">Presupuestos enviados</div>
      </div>

      <div className="chips" style={{gridTemplateColumns:"repeat(3,1fr)"}}>
        {[["Enviadas","Enviada","badge-blue"],["Aceptadas","Aceptada","badge-green"],["Rechazadas","Rechazada","badge-red"]].map(([l,e,b])=>(
          <div className="chip" key={l} style={{"--chip-color":e==="Enviada"?"var(--blue)":e==="Aceptada"?"var(--green)":"var(--red)"}}>
            <div className="chip-label">{l}</div>
            <div className="chip-value">{cotizaciones.filter(c=>c.estado===e).length}</div>
          </div>
        ))}
      </div>

      <div className="card">
        {cotizaciones.length===0
          ? <div className="empty"><div className="empty-icon">📄</div><div className="empty-text">Sin cotizaciones</div></div>
          : cotizaciones.map(c=>(
            <div className="list-item" key={c.id}>
              {liIcon("rgba(92,158,255,0.10)","📄")}
              <div className="li-body">
                <div className="li-title">{c.cliente}</div>
                <div className="li-sub">{c.detalle}</div>
                <div style={{marginTop:6}}>
                  <select className="estado-select" style={{color:"var(--muted)"}}
                    value={c.estado} onChange={e=>cambiarEstado(c.id,e.target.value)}>
                    {ESTADOS_COT.map(e=><option key={e}>{e}</option>)}
                  </select>
                </div>
              </div>
              <div className="li-right">
                <div className="li-amount">{formatCLP(c.total)}</div>
                <div className="li-date">{c.fecha}</div>
                <button className="btn btn-sm" style={{marginTop:4,background:"rgba(255,92,58,0.1)",color:"var(--red)",border:"none",cursor:"pointer",borderRadius:6,padding:"3px 8px",fontSize:"0.7rem"}} onClick={()=>eliminar(c.id)}>✕</button>
              </div>
            </div>
          ))
        }
      </div>

      <button className="fab" onClick={()=>setDrawer(true)}>＋</button>

      {drawer && (
        <div className="overlay" onClick={e=>e.target===e.currentTarget&&setDrawer(false)}>
          <div className="drawer">
            <div className="drawer-handle"/>
            <div className="drawer-title">Nueva cotización</div>
            <div className="form-group">
              <label className="form-label">Cliente</label>
              <select className="form-select" value={form.cliente} onChange={e=>setForm({...form,cliente:e.target.value})}>
                <option value="">Seleccionar...</option>
                {clientes.map(c=><option key={c.id}>{c.nombre}</option>)}
                <option value="Nuevo cliente">Nuevo cliente</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Detalle</label>
              <textarea className="form-textarea" placeholder="Describe los productos y cantidades" value={form.detalle} onChange={e=>setForm({...form,detalle:e.target.value})} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Total ($)</label>
                <input className="form-input" type="number" placeholder="0" value={form.total} onChange={e=>setForm({...form,total:e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Fecha</label>
                <input className="form-input" type="date" value={form.fecha} onChange={e=>setForm({...form,fecha:e.target.value})} />
              </div>
            </div>
            <div className="drawer-actions">
              <button className="btn btn-ghost" onClick={()=>setDrawer(false)}>Cancelar</button>
              <button className="btn btn-accent" onClick={guardar}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ESTADÍSTICAS
// ══════════════════════════════════════════════════════════════════════════════
function Estadisticas({ ventas, gastos, pedidos }) {
  const totalVentas = ventas.reduce((s,v)=>s+v.monto,0);
  const totalGastos = gastos.reduce((s,g)=>s+g.monto,0);
  const utilidad = totalVentas - totalGastos;
  const margen = totalVentas > 0 ? Math.round((utilidad/totalVentas)*100) : 0;

  const meses = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  const ventasPorMes = meses.map((m,i)=>{
    const num = String(i+1).padStart(2,"0");
    return {
      mes: m,
      ventas: ventas.filter(v=>v.fecha.includes(`-${num}-`)).reduce((s,v)=>s+v.monto,0),
      gastos: gastos.filter(g=>g.fecha.includes(`-${num}-`)).reduce((s,g)=>s+g.monto,0),
    };
  }).filter(x=>x.ventas>0||x.gastos>0);

  const metodos = METODOS.map(m=>({ name:m, value:ventas.filter(v=>v.metodo===m).reduce((s,v)=>s+v.monto,0) })).filter(x=>x.value>0);
  const COLORS = ["#ff5c3a","#ffb547","#3affd1","#5c9eff","#a855f7"];
  const estadosPedidos = ESTADOS_PEDIDO.map(e=>({ name:e, value:pedidos.filter(p=>p.estado===e).length })).filter(x=>x.value>0);

  return (
    <div>
      <div className="page-head">
        <div className="page-title">Estadísticas 📊</div>
        <div className="page-sub">Análisis de tu negocio</div>
      </div>

      {/* Resumen en lista vertical para evitar overflow */}
      <div className="card" style={{marginBottom:14}}>
        <div className="card-head"><div className="card-title">Resumen financiero</div></div>
        <div style={{padding:"4px 16px 12px"}}>
          {[
            {label:"Ventas totales", val:formatCLP(totalVentas), color:"var(--green)"},
            {label:"Gastos totales", val:formatCLP(totalGastos), color:"var(--red)"},
            {label:"Utilidad neta", val:formatCLP(utilidad), color:utilidad>=0?"var(--green)":"var(--red)"},
            {label:"Margen", val:`${margen}%`, color:margen>=0?"var(--green)":"var(--red)"},
            {label:"Nº de ventas", val:ventas.length, color:"var(--text)"},
          ].map(r=>(
            <div className="stat-row" key={r.label}>
              <span className="stat-key">{r.label}</span>
              <span className="stat-val" style={{color:r.color}}>{r.val}</span>
            </div>
          ))}
        </div>
      </div>

      {ventasPorMes.length > 0 && (
        <div className="card" style={{marginBottom:14}}>
          <div className="card-head"><div className="card-title">Ventas vs Gastos por mes</div></div>
          {/* Scroll horizontal para el gráfico de barras */}
          <div style={{overflowX:"auto",paddingBottom:4}}>
            <div style={{minWidth: Math.max(300, ventasPorMes.length * 60)}}>
              <BarChart width={Math.max(340, ventasPorMes.length*60)} height={180} data={ventasPorMes} margin={{top:8,right:12,left:0,bottom:4}}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="mes" tick={{fill:"var(--muted)",fontSize:11}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:"var(--muted)",fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`$${(v/1000).toFixed(0)}k`} width={38}/>
                <Tooltip formatter={(v)=>formatCLP(v)} contentStyle={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:8,color:"var(--text)",fontSize:"0.8rem"}}/>
                <Bar dataKey="ventas" fill="var(--green)" radius={[4,4,0,0]} name="Ventas"/>
                <Bar dataKey="gastos" fill="var(--red)" radius={[4,4,0,0]} name="Gastos"/>
              </BarChart>
            </div>
          </div>
          <div style={{display:"flex",gap:16,padding:"6px 16px 12px",fontSize:"0.75rem"}}>
            <span style={{display:"flex",alignItems:"center",gap:5}}><span style={{width:10,height:10,borderRadius:2,background:"var(--green)",display:"inline-block"}}/>Ventas</span>
            <span style={{display:"flex",alignItems:"center",gap:5}}><span style={{width:10,height:10,borderRadius:2,background:"var(--red)",display:"inline-block"}}/>Gastos</span>
          </div>
        </div>
      )}

      {metodos.length > 0 && (
        <div className="card" style={{marginBottom:14}}>
          <div className="card-head"><div className="card-title">Métodos de pago</div></div>
          <div style={{padding:"4px 16px 12px"}}>
            {metodos.map((m,i)=>(
              <div className="stat-row" key={m.name}>
                <span style={{display:"flex",alignItems:"center",gap:8,fontSize:"0.82rem"}}>
                  <span style={{width:10,height:10,borderRadius:"50%",background:COLORS[i%COLORS.length],display:"inline-block",flexShrink:0}}/>
                  {m.name}
                </span>
                <span className="stat-val" style={{color:COLORS[i%COLORS.length]}}>{formatCLP(m.value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {estadosPedidos.length > 0 && (
        <div className="card" style={{marginBottom:14}}>
          <div className="card-head"><div className="card-title">Estado de pedidos</div></div>
          <div style={{padding:"4px 16px 12px"}}>
            {estadosPedidos.map(e=>(
              <div className="stat-row" key={e.name}>
                <span className="stat-key">{e.name}</span>
                <span className="stat-val">{e.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// APP PRINCIPAL
// ══════════════════════════════════════════════════════════════════════════════
const NAV_ITEMS = [
  { id:"dashboard", label:"Inicio", icon:"⚡" },
  { id:"ventas",    label:"Ventas", icon:"💸" },
  { id:"pedidos",   label:"Pedidos", icon:"📋" },
  { id:"stock",     label:"Stock", icon:"📦" },
  { id:"clientes",  label:"Clientes", icon:"👥" },
  { id:"gastos",    label:"Gastos", icon:"🧾" },
  { id:"cotizaciones", label:"Cotiz.", icon:"📄" },
  { id:"estadisticas", label:"Stats", icon:"📊" },
];

const FECHA_HOY = new Date().toLocaleDateString("es-CL", { weekday:"short", day:"numeric", month:"short" });

function useLocalState(key, init) {
  const [val, setVal] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : init;
    } catch { return init; }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
  }, [key, val]);
  return [val, setVal];
}

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [ventas, setVentas] = useLocalState("ilust_ventas", INIT_VENTAS);
  const [pedidos, setPedidos] = useLocalState("ilust_pedidos", INIT_PEDIDOS);
  const [stock, setStock] = useLocalState("ilust_stock", INIT_STOCK);
  const [clientes, setClientes] = useLocalState("ilust_clientes", INIT_CLIENTES);
  const [gastos, setGastos] = useLocalState("ilust_gastos", INIT_GASTOS);
  const [cotizaciones, setCotizaciones] = useLocalState("ilust_cotizaciones", INIT_COTIZACIONES);

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        <div className="top-bar">
          <div className="logo">ilustra<span>me</span></div>
          <div className="header-date">{FECHA_HOY}</div>
        </div>

        <div className="content">
          {tab==="dashboard"    && <Dashboard ventas={ventas} pedidos={pedidos} stock={stock} gastos={gastos} clientes={clientes} cotizaciones={cotizaciones}/>}
          {tab==="ventas"       && <Ventas ventas={ventas} setVentas={setVentas} clientes={clientes} stock={stock} setStock={setStock}/>}
          {tab==="pedidos"      && <Pedidos pedidos={pedidos} setPedidos={setPedidos} clientes={clientes} setVentas={setVentas}/>}
          {tab==="stock"        && <Stock stock={stock} setStock={setStock}/>}
          {tab==="clientes"     && <Clientes clientes={clientes} setClientes={setClientes} ventas={ventas} pedidos={pedidos}/>}
          {tab==="gastos"       && <Gastos gastos={gastos} setGastos={setGastos}/>}
          {tab==="cotizaciones" && <Cotizaciones cotizaciones={cotizaciones} setCotizaciones={setCotizaciones} clientes={clientes}/>}
          {tab==="estadisticas" && <Estadisticas ventas={ventas} gastos={gastos} pedidos={pedidos}/>}
        </div>

        <nav className="bottom-nav">
          {NAV_ITEMS.map(n=>(
            <button key={n.id} className={`nav-btn ${tab===n.id?"active":""}`} onClick={()=>setTab(n.id)}>
              <div className="nav-icon-wrap">{n.icon}</div>
              <span className="nav-label">{n.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}
