import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BsFillStarFill } from "react-icons/bs";

import Popover from "../../../../Common/Components/Popover";
import { classNames } from "../../../../Common/utils";
import { PRODUCT_MOCKS } from "../../../../Mocks/Products";

import {
  PopOver,
  TCategories,
  TNavigationTree,
  TProduct,
  TProductDetail,
  TProductsKey,
} from "./types";

import { getNavigationTree, getProductsFromNavbar } from "../../../../services";

import styles from "./products.module.css";

export default function Products(): JSX.Element {
  const [categories, setCategories] = useState<TNavigationTree | undefined>();

  const [products, setProducts] = useState<TProduct>(PRODUCT_MOCKS["3tc"]);

  // get navigation links
  useEffect(() => {
    getNavigationTree().then(setCategories);
  }, []);

  const getProductDetails = useCallback((productId: string) => {
    getProductsFromNavbar(productId).then(setProducts);
  }, []);

  return (
    <section className={styles.productsCategoryContainer}>
      <div className={styles.categoriesSection}>
        {categories?.payload?.level_1?.map((lists, index) => (
          <Categories
            key={lists.id}
            list={lists}
            index={index}
            getProducts={getProductDetails}
          />
        ))}
      </div>
      <div className={styles.productsSection}>
        {products?.catalogs?.map((product) => (
          <ProductsCard product={product} />
        ))}
      </div>
    </section>
  );
}

const Categories = (props: TCategories): JSX.Element => {
  const { list, index, getProducts } = props;
  return (
    <Popover
      key={list.id}
      content={
        <PopOverListRenderer level_2={list.level_2} getProducts={getProducts} />
      }
      trigger="hover"
      placement={"bottom"}
      width={index === 0 ? 500 : undefined}
    >
      <div> {list.title} </div>
    </Popover>
  );
};

const PopOverListRenderer = (props: PopOver): JSX.Element => {
  return (
    <div className={styles.availableCategories}>
      {props.level_2?.map((availableCategories) => (
        <div
          key={availableCategories.id}
          className={styles.categoriesAndSubCategories}
        >
          <div className={styles.categoryTitle}>
            {availableCategories.title}
          </div>
          <div className={styles.subCategoryList}>
            {availableCategories.level_3?.map((categoriesSubList) => (
              <div
                className={styles.subCategoryTitle}
                onClick={(event) => {
                  event.stopPropagation();
                  props?.getProducts(
                    availableCategories.level_3?.[0]?.page?.page_id || ""
                  );
                }}
              >
                {categoriesSubList.title}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const ProductsCard = (props: TProductDetail): JSX.Element => {
  const { product } = props;

  const navigate = useNavigate();

  const { catalog_reviews_summary, supplier_reviews_summary } = product;

  const getProductId = product.consumer_share_text;

  // get product link
  const link = getProductId.match(/https?:\/\/\S+/g)?.[0];

  // get productId from link
  const productCode = link?.split?.("/p/")?.[1]?.split?.("?")?.[0];

  const productRating =
    catalog_reviews_summary?.average_rating ??
    supplier_reviews_summary?.average_rating;

  return (
    <div
      className={styles.cardContainer}
      onClick={() => navigate(`/products/${productCode}`)}
    >
      <img
        className={styles.productImage}
        src={product.product_images[0].url}
        alt={product.name}
      />
      <div className={styles.cardContentContainer}>
        <div className={styles.itemName}>{product?.name}</div>
        <div className={styles.itemPrice}>
          <h5>
            ₹{product?.min_product_price}
            {!product?.original_price ? (
              <span className={styles.onwards}>onwards</span>
            ) : (
              ""
            )}
          </h5>
          {product?.original_price && (
            <p className={styles.originalPrice}>₹{product?.original_price}</p>
          )}
        </div>
        <div className={styles.deliveryContainer}>
          {product?.markers[0].text}
        </div>
        {productRating ? (
          <div className={styles.ratingReview}>
            <div
              className={classNames({
                [styles.starRating]: true,
                [styles.ratingColor_2]: Boolean(
                  productRating && productRating >= 2.5 && productRating <= 3.5
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
              {catalog_reviews_summary?.rating_count ??
                supplier_reviews_summary?.rating_count}
              &nbsp;Reviews
            </div>
          </div>
        ) : (
          <span className={styles.ratingReview}>
            No Rating / Review available
          </span>
        )}
      </div>
    </div>
  );
};
