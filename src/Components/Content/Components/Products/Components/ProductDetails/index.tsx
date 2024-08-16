import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoCartOutline } from "react-icons/io5";
import { BsFillStarFill } from "react-icons/bs";
import { MdOutlineDoubleArrow } from "react-icons/md";

import {
  Button,
  BUTTON_SIZES,
  BUTTON_VARIANTS,
} from "../../../../../../Common/Button";
import { classNames } from "../../../../../../Common/utils";
import { useUsersContext } from "../../../../../../Context/UserContext";

import { getProducts, TProductsResponse } from "../../../../../../services";

import styles from "./productdetails.module.css";

export const ProductDetails = (): JSX.Element => {
  const { id } = useParams();

  const navigate = useNavigate();

  const { userDetails, updateCartItems } = useUsersContext();

  const [productDetails, setProductDetails] = useState<
    TProductsResponse | undefined
  >(undefined);

  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    productDetails?.result?.product?.images[0]
  );

  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    undefined
  );

  const productRating =
    productDetails?.result?.product.catalog_reviews_summary?.average_rating;

  // Fetch selected product details
  useEffect(() => {
    if (id)
      getProducts({ ad_active: true, include_catalog: true }, id).then(
        (response) => {
          setProductDetails(response);
          setSelectedImage(response?.result?.product?.images[0]);
        }
      );
    return () => {
      setProductDetails(undefined);
      setSelectedImage(undefined);
    };
  }, [id]);

  // Check product is already available in the cart
  const isAlreadyAvailableInCart = userDetails?.cartItems?.[
    userDetails.currentLoggedUser || ""
  ]?.some(
    (items) =>
      items?.result?.product?.catalog_id ===
      productDetails?.result?.product?.catalog_id
  );

  // Remove item from cart
  const handleDeleteItemFromCart = () => {
    const getFilteredProducts = userDetails?.cartItems?.[
      userDetails.currentLoggedUser || ""
    ].filter(
      (item) =>
        item.result.product.catalog_id !==
        productDetails?.result.product.catalog_id
    );
    updateCartItems?.({
      updateAll: true,
      allProducts: getFilteredProducts,
      product: productDetails as TProductsResponse,
    });
  };

  return (
    <section className={styles.productContainer}>
      {productDetails ? (
        <div className={styles.productWrapper}>
          <div className={styles.productImage}>
            <div className={styles.thumbnailImage}>
              {productDetails?.result?.product?.images?.map((items) => (
                <div
                  className={classNames({
                    [styles.thumbnailImageContainer]: true,
                    [styles.selectedOption]: selectedImage === items,
                  })}
                  onClick={() => setSelectedImage(items)}
                >
                  <img className={styles.image} alt={items} src={items} />
                </div>
              ))}
            </div>
            <div className={styles.selectedImageContainer}>
              <div className={styles.selectedImage}>
                <img
                  className={styles.image}
                  src={selectedImage}
                  alt={selectedImage}
                />
              </div>
              <div className={styles.btnContainer}>
                <Button
                  size={BUTTON_SIZES.LARGE}
                  variant={BUTTON_VARIANTS.SECONDARY}
                  leftIcon={<IoCartOutline color="var(--primary-base)" />}
                  onClick={() => {
                    if (productDetails) {
                      if (!isAlreadyAvailableInCart) {
                        updateCartItems?.({ product: productDetails });
                      } else {
                        handleDeleteItemFromCart();
                      }
                    }
                  }}
                >
                  {isAlreadyAvailableInCart
                    ? "Remove from cart"
                    : "Add to cart"}
                </Button>
                <Button
                  size={BUTTON_SIZES.LARGE}
                  variant={BUTTON_VARIANTS.SOLID}
                  leftIcon={<MdOutlineDoubleArrow color="var(--white)" />}
                  onClick={() => {
                    if (productDetails) {
                      if (!isAlreadyAvailableInCart) {
                        updateCartItems?.({ product: productDetails });
                      }
                      navigate("/checkout");
                    }
                  }}
                  disabled={!selectedSize}
                >
                  Buy now
                </Button>
              </div>
            </div>
          </div>
          <div className={styles.productInformation}>
            <div className={styles.productNameInfo}>
              <div className={styles.itemName}>
                {productDetails?.result?.catalog?.name}
              </div>
              <div className={styles.itemPrice}>
                <h5>
                  ₹{productDetails?.result?.catalog?.min_product_price}
                  {!productDetails?.result?.catalog?.original_price ? (
                    <span className={styles.onwards}>onwards</span>
                  ) : (
                    ""
                  )}
                </h5>
                {productDetails?.result?.catalog?.original_price && (
                  <p className={styles.originalPrice}>
                    ₹{productDetails?.result?.catalog?.original_price}
                  </p>
                )}
              </div>
              <div className={styles.deliveryContainer}>
                {productDetails?.result?.product?.suppliers?.[0]?.shipping
                  ?.show_free_delivery
                  ? "Free delivery"
                  : "Delivery ₹" +
                    productDetails?.result?.product?.suppliers?.[0]?.shipping
                      ?.charges}
              </div>
              {productRating ? (
                <div className={styles.ratingReview}>
                  <div
                    className={classNames({
                      [styles.starRating]: true,
                      [styles.ratingColor_2]: Boolean(
                        productRating &&
                          productRating >= 2.5 &&
                          productRating <= 3.5
                      ),
                      [styles.ratingColor_3]: Boolean(
                        productRating && productRating < 2.5
                      ),
                      [styles.ratingColor_1]: Boolean(
                        productRating && productRating >= 3.5
                      ),
                    })}
                  >
                    <span>{productRating}</span>
                    <BsFillStarFill size="15" />
                  </div>
                  <div>
                    {
                      productDetails?.result?.product.catalog_reviews_summary
                        .review_count
                    }
                    &nbsp;Reviews &ensp;
                    {
                      productDetails?.result?.product.catalog_reviews_summary
                        .rating_count
                    }
                    &nbsp;Ratings
                  </div>
                </div>
              ) : (
                <span className={styles.ratingReview}>
                  No Rating / Review available
                </span>
              )}
            </div>
            <div className={styles.productNameInfo}>
              <div className={styles.title}>
                Select Size
                {!selectedSize && (
                  <>
                    &nbsp;-&nbsp;
                    <span className={styles.errored}>Select product size</span>
                  </>
                )}
              </div>
              <div className={styles.sizeContainer}>
                {productDetails?.result?.product?.suppliers?.[0]?.variations?.map(
                  (items) => (
                    <div
                      onClick={() => setSelectedSize(items)}
                      className={classNames({
                        [styles.productSize]: true,
                        [styles.selectedOption]: selectedSize === items,
                      })}
                    >
                      {items}
                    </div>
                  )
                )}
              </div>
            </div>
            <div className={styles.productNameInfo}>
              <div className={styles.title}>Product Details</div>
              <div className={styles.detailsContainer}>
                {productDetails?.result?.product?.description
                  ?.split("\n")
                  ?.map((text) => (
                    <div>{text}</div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.loader}>Fetching Product details...</div>
      )}
    </section>
  );
};
