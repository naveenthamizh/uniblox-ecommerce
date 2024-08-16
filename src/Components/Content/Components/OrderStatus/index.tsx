import { useNavigate } from "react-router-dom";
import styles from "./orderstatus.module.css";

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.successContainer}>
      <div className={styles.successMessage}>
        <h1>Thank You!</h1>
        <p>Your order has been placed successfully.</p>
        <p>
          Order ID: <span className={styles.orderId}>#123456</span>
        </p>
        <p>We appreciate your business and hope you enjoy your purchase!</p>
        <button
          className={styles.backHomeBtn}
          onClick={() => navigate("/products")}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
