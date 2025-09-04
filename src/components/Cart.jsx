import { useMemo } from "react";

export default function Cart({ cartItems }) {
  const total = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.price * item.qty, 0),
    [cartItems]
  );

  return (
    <div className="cart">
      <h2>Cart</h2>
      {cartItems.length === 0 && <p>Keranjang kosong</p>}
      <ul>
        {cartItems.map((item) => (
          <li key={item.id}>
            {item.title} x {item.qty} — Rp {item.price * item.qty}
          </li>
        ))}
      </ul>
      <h3>Total: Rp {total.toFixed(2)}</h3>
    </div>
  );
}
