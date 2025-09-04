import { useReducer, useState } from "react";
import { usePrevious } from "./hooks/usePrevious";
import { useOptimistic } from "./hooks/useOptimistic";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import productsData from "./data/products.json"; // ✅ dummy produk lokal
import "./App.css";

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD":
      const existing = state.find((item) => item.id === action.payload.id);
      if (existing) {
        return state.map((item) =>
          item.id === action.payload.id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }
      return [...state, { ...action.payload, qty: 1 }];
    case "CLEAR":
      return [];
    default:
      return state;
  }
}

export default function App() {
  const [cart, dispatch] = useReducer(cartReducer, []);
  const [lastTransaction, setLastTransaction] = useState(null);
  const prevTransaction = usePrevious(lastTransaction);
  const [optimisticCart, runOptimistic] = useOptimistic(cart);
  const [showPopup, setShowPopup] = useState(false);

  // ✅ State kategori & pencarian
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");

  const handleAdd = (product) => {
    runOptimistic(
      [...cart, { ...product, qty: 1 }],
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            dispatch({ type: "ADD", payload: product });
            resolve(cart);
          }, 300);
        }),
      () => optimisticCart
    );
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setLastTransaction(cart);
    dispatch({ type: "CLEAR" });
    setShowPopup(true);
  };

  // ✅ Filter produk by kategori + search
  const filteredProducts = productsData.filter((p) => {
    const matchCategory =
      selectedCategory === "all" || p.category === selectedCategory;
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="app">
      {/* ✅ Navbar */}
      <nav className="navbar">
        <h2>🛒 FR-Store</h2>
        <div className="nav-actions">
          <input
            type="text"
            placeholder="Cari produk..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">Semua Kategori</option>
            <option value="fashion">Fashion</option>
            <option value="electronics">Elektronik</option>
            <option value="school">Sekolah</option>
            <option value="sport">Olahraga</option>
            <option value="home">Peralatan Rumah</option>
          </select>
        </div>
      </nav>

      {/* Layout utama */}
      <div className="layout">
        <div>
          <ProductList products={filteredProducts} addToCart={handleAdd} />
        </div>
        <div>
          <Cart cartItems={cart} />
          <button className="checkout" onClick={handleCheckout}>
            Checkout
          </button>
          <p>
            <strong>Transaksi terakhir:</strong>{" "}
            {lastTransaction ? `${lastTransaction.length} item` : "-"}
          </p>
          <p>
            <strong>Transaksi sebelumnya:</strong>{" "}
            {prevTransaction ? `${prevTransaction.length} item` : "-"}
          </p>
        </div>
      </div>

      {/* ✅ Popup Checkout */}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>✅ Checkout Berhasil!</h2>
            <p>Terima kasih sudah berbelanja 🙌</p>
            <button onClick={() => setShowPopup(false)}>Tutup</button>
          </div>
        </div>
      )}
    </div>
  );
}
