import React from "react";
import { HiOutlineShoppingCart } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";

import styles from "./header.module.css";
import { Button } from "../../Common/Button";
import { useUsersContext } from "../../Context/UserContext";

export default function Header(): JSX.Element {
  const navigate = useNavigate();
  const { userDetails, currentLoggedUser } = useUsersContext();
  return (
    <header className={styles.header}>
      <div className="" onClick={() => navigate("/products")}>
        Uniblox Store
      </div>
      <div className={styles.navList}>
        {userDetails.currentLoggedUser && (
          <>
            <HiOutlineShoppingCart
              size="24"
              onClick={() => navigate("/checkout")}
            />
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
