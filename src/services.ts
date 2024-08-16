import { AxiosRequestConfig, default as Axios } from "axios";
import {
  TNavigationTree,
  TProduct,
  TProductList,
} from "./Components/Content/Components/Products/types";

const appInstance = Axios.create();

const axios = {
  get: <T, V = any>(uri: string, config?: AxiosRequestConfig): Promise<V> => {
    return appInstance
      .get<V>(uri, config)
      .then((result) => result.data)
      .catch((err) => err);
  },
  post: <T, U = unknown, V = any>(
    uri: string,
    data: U,
    config?: AxiosRequestConfig
  ): Promise<V> => {
    return appInstance
      .post<V>(uri, data, config)
      .then((result) => result.data)
      .catch((err) => err);
  },
};

export const getNavigationTree = async (): Promise<TNavigationTree> => {
  return await axios
    .get<Promise<TNavigationTree>>(
      "https://www.meesho.com/api/v1/navigation-tree"
    )
    .then((result) => result);
};

export type TProductsPayload = {
  ad_active: boolean;
  include_catalog: boolean;
};

export type TProductsResponse = {
  productInfoData: {
    message: string;
    data: Object;
  };
  result: {
    catalog: TProductList["catalogs"][0];
    intent_modal_data: Object;
    product: {
      id: number;
      additional_attributes_url: string;
      name: string;
      description: string;
      catalog_id: number;
      pre_booking: boolean;
      weight: number;
      sku: string;
      images: string[];
      valid: boolean;
      share_text: string;
      suppliers: {
        id: number;
        name: string;
        handle: string;
        is_rpc: boolean;
        default_delivery_time: string;
        delivery_time_message: string;
        shipping_time: string;
        delayed_shipping: boolean;
        price: number;
        original_price: number;
        discount: number;
        cod_available: boolean;
        cod_charges: number;
        manufacturer: boolean;
        in_stock: boolean;
        show_expected_delivery_date: boolean;
        promo_offers: Array<{
          type: string;
          name: string;
          discount_text: string;
          amount: number;
          is_applied: boolean;
        }>;
        average_rating: number;
        rating_count: number;
        shipping: {
          charges: number;
          discount: number;
          show_shipping_charges: boolean;
          show_free_delivery: boolean;
        };
        variations: string[];
        assured_details: {
          is_assured: boolean;
          message: string;
        };
        value_props: {
          name: string;
          image: string;
          data: {
            title: string;
            message: string;
          };
          type: number;
        }[];
        inventory: {
          variation: {
            id: number;
            name: string;
            final_price: number;
          };
          in_stock: boolean;
        }[];
        price_type_id: string;
        exchange_only: boolean;

        profile_image: string;
        size_chart: {
          product_dimensions: {
            title: string;
            unit: string;
            size_attributes: string[];
            variations: {
              variation_id: number;
              name: string;
              dimensions: string[];
              in_stock: boolean;
            }[];
          };
          size_guide: {
            title: string;
            description: string;
            image_url: string;
          };
        };
        mall_verified: boolean;
        mall_tags: string[];
        has_same_price_variations: boolean;
        price_details: Record<
          string,
          {
            display_name: string;
            value: number;
          }
        >;
      }[];
      mrp: number;
      in_stock: boolean;
      duplicate_products: [];
      media: {
        url: string;
        type: string;
      }[];

      catalog_product_images: {
        id: number;
        url: string;
      }[];
      catalog_reviews_summary: {
        average_rating: number;
        rating_count: number;
        review_count: number;
      };
    };
  };
};

export const getProducts = async (
  payload: TProductsPayload,
  id: string
): Promise<TProductsResponse> => {
  return await axios
    .post<TProductsResponse>(
      `https://www.meesho.com/api/v1/product/${id}`,
      payload
    )
    .then((response) => response);
};

export const getProductsFromNavbar = async (id: string): Promise<TProduct> => {
  return await axios
    .post<TProduct>("https://www.meesho.com/api/v1/products", {
      page_id: id,
      page: 1,
      offset: 0,
      limit: 20,
      cursor: null,
      isNewPlpFlowEnabled: true,
    })
    .then((response) => response);
};
