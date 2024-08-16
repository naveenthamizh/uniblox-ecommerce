import produce, { enableMapSet } from "immer";
import React, { ReactNode, useState } from "react";
import { TProductsResponse } from "../services";

enableMapSet();

type TUsersDetails = {
  currentLoggedUser?: string;

  auth: {
    [k: string]: {
      username: string;
      password: string;
      isLoggedIn: boolean;
    };
  };
  cartItems?: {
    [k: string]: TProductsResponse[];
  };

  purchasedItems: {
    [k: string]: { items?: TProductsResponse[] };
  };
  savedItems?: {
    [k: string]: string[];
  };
  totalPurchases: {
    [k: string]: number;
  };
};

const MOCK_UserDetails: TUsersDetails = {
  auth: {
    "naveen@gmail.com": {
      username: "naveen@gmail.com",
      password: "password",
      isLoggedIn: false,
    },
  },
  currentLoggedUser: undefined,
  purchasedItems: {
    "naveen@gmail.com": {
      items: [],
    },
  },
  cartItems: {
    "naveen@gmail.com": [],
  },
  totalPurchases: {
    "naveen@gmail.com": 0,
  },
};

interface UserDetailsProps {
  children: ReactNode;
}

type UpdateCart = {
  updateAll?: boolean;
  allProducts?: TProductsResponse[];
  product: TProductsResponse;
};

interface TUserContext {
  userDetails: TUsersDetails;
  updateAuthDetails?: (payload: { username: string; password: string }) => void;
  updateCartItems?: (updates: UpdateCart) => void;
  updatePurchaseItems?: (products: TProductsResponse[]) => void;
  updateSavedItems?: (id: string) => void;
  currentLoggedUser?: (name: string | undefined) => void;
}

const UserDetailsContext = React.createContext<TUserContext>({
  userDetails: MOCK_UserDetails,
});

export function UserDetailsProvider({
  children,
}: UserDetailsProps): JSX.Element {
  const [userDetails, setUserDetails] =
    useState<TUsersDetails>(MOCK_UserDetails);

  const getLoggedInName = userDetails.currentLoggedUser;

  const updateAuthDetails = (payload: {
    username: string;
    password: string;
  }) => {
    setUserDetails(
      produce(userDetails, (draft) => {
        draft.auth[payload.username] = { ...payload, isLoggedIn: false };
      })
    );
  };

  const currentLoggedUser = (name: string | undefined) => {
    setUserDetails(
      produce(userDetails, (draft) => {
        if (name) {
          draft.currentLoggedUser = name;
          draft.cartItems = {
            [name]: [],
          };
          draft.purchasedItems = {
            [name]: {
              items: [],
            },
          };
        } else {
          draft.currentLoggedUser = undefined;
        }
      })
    );
  };

  const updateCartItems = (updates: UpdateCart) => {
    setUserDetails(
      produce(userDetails, (draft) => {
        if (getLoggedInName) {
          if (updates?.updateAll && draft.cartItems && updates.allProducts) {
            draft.cartItems[getLoggedInName] = [];
            draft.cartItems[getLoggedInName] = updates.allProducts;
          } else {
            draft.cartItems?.[getLoggedInName]?.push?.(updates.product);
          }
        }
      })
    );
  };

  const updatePurchaseItems = (product: TProductsResponse[]) => {
    setUserDetails(
      produce(userDetails, (draft) => {
        if (getLoggedInName) {
          draft.purchasedItems?.[getLoggedInName].items?.push(...product);
          draft.totalPurchases[getLoggedInName] =
            (draft.totalPurchases[getLoggedInName] ?? 0) + 1;
          if (draft.cartItems && draft?.cartItems?.[getLoggedInName]) {
            draft.cartItems[getLoggedInName] = [];
          }
        }
      })
    );
  };

  const updateSavedItems = (id: string) => {
    setUserDetails(
      produce(userDetails, (draft) => {
        if (getLoggedInName) {
          draft.savedItems?.[getLoggedInName]?.push(id);
        }
      })
    );
  };

  return (
    <UserDetailsContext.Provider
      value={{
        userDetails,
        updateCartItems,
        updatePurchaseItems,
        updateSavedItems,
        updateAuthDetails,
        currentLoggedUser,
      }}
    >
      {children}
    </UserDetailsContext.Provider>
  );
}

export const useUsersContext = (): TUserContext => {
  return React.useContext(UserDetailsContext);
};
