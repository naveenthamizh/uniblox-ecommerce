import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Products from "./Components/Products";
import Cart from "./Components/Cart";
import Checkout from "./Components/Checkout";
import OrderSuccessPage from "./Components/OrderStatus";

import { ProductDetails } from "./Components/Products/Components/ProductDetails";
import Login from "../Login";
import { SignUp } from "../Signup";
import { useUsersContext } from "../../Context/UserContext";

import styles from "./content.module.css";

export default function Content(): JSX.Element {
  return (
    <main className={styles.contents}>
      <Routes>
        <Route path="/" element={<AuthProvider />}>
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/products" element={<Products />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orderstatus" element={<OrderSuccessPage />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </main>
  );
}

const AuthProvider = () => {
  const { userDetails } = useUsersContext();

  const isUserLoggedIn = userDetails.currentLoggedUser;
  return <>{isUserLoggedIn ? <Outlet /> : <Navigate to="/login" />}</>;
};
