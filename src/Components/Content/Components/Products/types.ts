import { PRODUCT_MOCKS } from "../../../../Mocks/Products";

export type TNavigationTree = {
  navUrls: { url: string; title: string }[];
  payload: Record<string, TLevelOne[]>;
};

export type TProductsKey = keyof typeof PRODUCT_MOCKS;

export type TProduct = (typeof PRODUCT_MOCKS)[TProductsKey];

export type TProductList = (typeof PRODUCT_MOCKS)[TProductsKey];

export type TCategories = {
  list: TLevelOne;
  index: number;
  getProducts: (payload: string) => void;
};

export type TLevelOne = {
  id: string;
  title: string;
  category_icon: string;
  level_2: TLevelTwo[];
};

export type TLevelTwo = {
  id: string;
  title: string;
  level_3: TLevelThree[];
};

export type TLevelThree = {
  id: string;
  title: string;
  category_icon: string;
  page: {
    page_id: string;
    slug: string;
    ss_id: string[];
    type: string;
  };
};

export type TProductDetail = {
  product: TProductList["catalogs"][0];
};

export type PopOver = {
  level_2: TLevelTwo[];
  getProducts: (payload: string) => void;
};

export type TIndividualProductDetails = {
  id: string;
};
