import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoTrash } from "react-icons/go";

import { useUsersContext } from "../../../../Context/UserContext";
import { TProductsResponse } from "../../../../services";
import styles from "./checkout.module.css";
import { Button } from "../../../../Common/Button";
import { classNames } from "../../../../Common/utils";

const DISCOUNT_ON_EVERY_NTH_ORDER = 5;

export default function Checkout(): JSX.Element {
  const { userDetails, updateCartItems, updatePurchaseItems } =
    useUsersContext();

  const navigate = useNavigate();

  const [quantity, setQuantity] = useState<number>(1);

  let totalAmount = 0;

  const getCartItems =
    userDetails.cartItems?.[userDetails?.currentLoggedUser || ""];

  const UpdateQuantity = (type: "Inc" | "Dec") => {
    setQuantity(type === "Dec" ? quantity - 1 : quantity + 1);
  };

  const handleDeleteItemFromCart = (product: TProductsResponse) => {
    const getFilteredProducts = userDetails?.cartItems?.[
      userDetails.currentLoggedUser || ""
    ].filter(
      (item) =>
        item.result.product.catalog_id !== product.result.product.catalog_id
    );
    updateCartItems?.({
      updateAll: true,
      allProducts: getFilteredProducts,
      product,
    });
    if (!getFilteredProducts?.length) {
      navigate("/products");
    }
  };

  const isDiscountApplicable =
    userDetails?.totalPurchases[userDetails?.currentLoggedUser || ""] > 0 &&
    (userDetails?.totalPurchases[userDetails?.currentLoggedUser || ""] + 1) %
      DISCOUNT_ON_EVERY_NTH_ORDER ===
      0;

  return (
    <section className={styles.checkoutWrapperContainer}>
      {userDetails?.cartItems?.[userDetails?.currentLoggedUser || ""]
        ?.length ? (
        <>
          <div className={styles.cartItems}>
            {getCartItems?.map((product) => {
              const { name, collage_image, min_product_price } =
                product.result.catalog;

              totalAmount = min_product_price * quantity;

              return (
                <div className={styles.checkoutContainer}>
                  <div className={styles.leftContainer}>
                    <img
                      src={collage_image}
                      alt={name}
                      width="150px"
                      height="100px"
                    />
                    <div className={styles.checkoutInfo}>
                      <div className={styles.title}>{name}</div>
                      <div className={styles.priceInfo}>
                        <div className={styles.price}>
                          <div>price</div>
                          <div>{min_product_price}</div>
                        </div>
                        <div className={styles.price}>
                          <div>Quantity</div>
                          <div className={styles.quantityContainer}>
                            <span
                              className={styles.decrement}
                              onClick={() =>
                                quantity > 0 && UpdateQuantity("Dec")
                              }
                            >
                              -
                            </span>
                            <span>{quantity}</span>
                            <span
                              className={styles.increment}
                              onClick={() =>
                                quantity < 10 && UpdateQuantity("Inc")
                              }
                            >
                              +
                            </span>
                          </div>
                        </div>

                        <div className={styles.divider} />
                        <div className={styles.price}>
                          <div>Total</div>
                          <div>{min_product_price * quantity}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <GoTrash
                    className={styles.icon}
                    onClick={() => handleDeleteItemFromCart(product)}
                  />
                </div>
              );
            })}
          </div>
          <div className={styles.rightContainer}>
            <div className={styles.price}>
              <div>Total Amount</div>
              <div>{totalAmount}</div>
            </div>
            <div className={styles.price}>
              <div>Delivery charges</div>
              <div>40</div>
            </div>
            <div className={styles.divider} />

            <div
              className={classNames({
                [styles.price]: true,
                [styles.discountDisable]: Boolean(!isDiscountApplicable),
              })}
            >
              <div>Discount</div>
              <div>
                10%{" "}
                {!isDiscountApplicable
                  ? "Not Applicable"
                  : `(₹${Math.round(totalAmount * 0.1)})`}
              </div>
            </div>
            <div className={styles.price}>
              <div>Amount to be paid</div>
              <div>
                ₹
                {Math.round(
                  totalAmount +
                    40 -
                    (isDiscountApplicable ? totalAmount * 0.1 + 40 : 0)
                )}
              </div>
            </div>
            <Button
              width="100%"
              onClick={() => {
                updatePurchaseItems?.(
                  userDetails.cartItems?.[
                    userDetails?.currentLoggedUser || ""
                  ] as TProductsResponse[]
                );
                navigate("/orderstatus");
              }}
            >
              Place Order
            </Button>
          </div>
        </>
      ) : (
        <>Cart is Empty</>
      )}
    </section>
  );
}
