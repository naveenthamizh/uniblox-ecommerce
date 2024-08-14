import { Routes, Route } from "react-router-dom";
import Products from "./Components/Products";
import Cart from "./Components/Cart";
import Checkout from "./Components/Checkout";
import OrderStatus from "./Components/OrderStatus";

export default function Content(): JSX.Element {
  return (
    <Routes>
      <Route path="/products" element={<Products />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/order" element={<OrderStatus />} />
    </Routes>
  );
}
