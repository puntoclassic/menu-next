"use server";

import {
  CartItem,
  CartState,
  TipologiaConsegna,
} from "@/src/types/globalTypes";
import { cookies } from "next/headers";

const emptyCart: CartState = {
  indirizzo: "",
  items: {},
  note: "",
  orario: "",
  tipologia_consegna: TipologiaConsegna.ASPORTO,
  total: 0,
};

export const addToCart = async (item: CartItem) => {
  const cart = await getCart();

  cart.items[item.id] = {
    item: item,
    quantity: 1,
  };

  storeCart(cart);
};

export const removeFromCart = async (item: CartItem) => {
  const cart = await getCart();

  delete cart.items[item.id];

  storeCart(cart);
};

export const increaseQty = async (item: CartItem) => {
  const cart = await getCart();

  cart.items[item.id].quantity += 1;

  storeCart(cart);
};

export const decreaseQty = async (item: CartItem) => {
  const cart = await getCart();

  if (cart.items[item.id].quantity > 1) {
    cart.items[item.id].quantity -= 1;
  } else {
    //altrimenti elimina il prodotto
    delete cart.items[item.id];
  }

  storeCart(cart);
};

export const updateCartTipologiaConsegna = async (item: TipologiaConsegna) => {
  const cart = await getCart();

  cart.tipologia_consegna = item;

  storeCart(cart);
};

export const updateCartInformazioniConsegna = async (
  item: { indirizzo: string; orario: string },
) => {
  const cart = await getCart();

  cart.indirizzo = item.indirizzo;
  cart.orario = item.orario;

  storeCart(emptyCart);
};

export const updateCartNote = async (note: string) => {
  const cart = await getCart();

  cart.note = note;

  storeCart(emptyCart);
};

export const resetCart = async () => {
  storeCart(emptyCart);
};

export async function getCart(): Promise<CartState> {
  const cookiesList = cookies();

  if (cookiesList.get("cart")) {
    let buff = Buffer.from(cookiesList.get("cart")!.value, "base64");
    let string_decoded = buff.toString("utf-8");
    return JSON.parse(string_decoded);
  } else {
    return emptyCart;
  }
}

export async function storeCart(cart: CartState) {
  const cookiesList = cookies();

  if (cart) {
    //Update the total
    cart.total = 0;
    Object.values(cart.items).forEach((row: any) => {
      cart.total += row.item.price! *
        row.quantity;
    });

    let buff = Buffer.from(JSON.stringify(cart), "utf8");
    cookiesList.set("cart", buff.toString("base64"));
  }
}