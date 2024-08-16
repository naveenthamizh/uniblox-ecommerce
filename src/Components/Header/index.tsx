import { HiOutlineShoppingCart } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { Button } from "../../Common/Button";
import { useUsersContext } from "../../Context/UserContext";
import styles from "./header.module.css";

export default function Header(): JSX.Element {
  const navigate = useNavigate();
  const { userDetails, currentLoggedUser } = useUsersContext();

  const cartItems =
    userDetails?.cartItems?.[userDetails?.currentLoggedUser || ""];
  return (
    <header className={styles.header}>
      <div className={styles.title} onClick={() => navigate("/products")}>
        Uniblox Store
      </div>
      <div className={styles.navList}>
        {userDetails.currentLoggedUser && (
          <>
            <div className={styles.cartContainer}>
              <HiOutlineShoppingCart
                size="24"
                onClick={() => navigate("/checkout")}
              />
              {cartItems?.length ? (
                <div className={styles.badge}>{cartItems?.length}</div>
              ) : (
                ""
              )}
            </div>
            <Button
              onClick={() => {
                currentLoggedUser?.(undefined);
              }}
            >
              Logout
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
