export default function ProductList({ products, addToCart }) {
  return (
    <div className="product-list">
      {products.map((p) => (
        <div key={p.id} className="card">
          <img src={p.image} alt={p.title} />
          <h3>{p.title.length > 40 ? p.title.slice(0, 40) + "..." : p.title}</h3>
          <strong>Rp {p.price.toLocaleString()}</strong>
          <button onClick={() => addToCart(p)}>+ Keranjang</button>
        </div>
      ))}
    </div>
  );
}
