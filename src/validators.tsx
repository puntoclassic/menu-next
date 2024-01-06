import axiosIstance from "@/src/lib/axiosIstance";

import * as yup from "yup";

export const createCategoryValidator = yup.object({
  name: yup.string().required("Il campo nome è obbligatorio"),
  image: yup.string().nullable(),
  imageFile: yup.mixed().nullable().test(
    "fileSize",
    "File troppo grande (max 1 mega)",
    (value: any) => {
      if (value == undefined || value.length === 0) {
        return true;
      }
      return value.length && value[0].size <= 1000 * 1000;
    },
  )
    .test(
      "fileFormat",
      "Formato non accettato",
      (value: any) => {
        if (value == undefined || value.length === 0) {
          return true;
        }
        return value[0] &&
          ["image/jpg", "image/jpeg", "image/png"].includes(
            value[0].type,
          );
      },
    ),
}).required();

export const updateCategoryValidator = yup.object({
  id: yup.number().required(),
  name: yup.string().required("Il campo nome è obbligatorio"),
  image: yup.string().nullable(),
  imageFile: yup.mixed().test(
    "fileSize",
    "File troppo grande (max 1 mega)",
    (value: any) => {
      if (value == null || value.length === 0) {
        return true;
      }
      return value.length && value[0].size <= 1000 * 1000;
    },
  )
    .test(
      "fileFormat",
      "Formato non accettato",
      (value: any) => {
        if (value == null || value.length === 0) {
          return true;
        }
        return value[0] &&
          ["image/jpg", "image/jpeg", "image/png"].includes(
            value[0].type,
          );
      },
    ).nullable(),
}).required();

export const changePasswordValidator = yup.object({

  current_password: yup.string().required("La password attuale è obbligatoria"),
  password: yup.string().matches(
    RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"),
    "La password deve essere lunga almeno 8 caratteri e contenere: 1 numero, 1 carattere speciale e una lettera maiuscola",
  ).required("Il campo password è obbligatorio"),
  password_confirmation: yup.string().required(
    "Il campo conferma password è obbligatorio",
  ).oneOf([yup.ref("password")], "Le due password devono corrispondere"),
}).required();

export const createFoodValidator = yup.object({
  name: yup.string().required("Il campo nome è obbligatorio"),
  price: yup.number().typeError("Inserisci un numero valido").required(
    "Il campo prezzo è obbligatorio",
  ).min(
    0.01,
    "Il prezzo deve essere maggiore di 0",
  ),
  ingredients: yup.string().nullable(),
  category_id: yup.number().required("La categoria è obbligatoria"),
}).required();

export const updateFoodValidator = yup.object({
  id: yup.number().required(),
  name: yup.string().required("Il campo nome è obbligatorio"),
  price: yup.number().typeError("Inserisci un numero valido").required(
    "Il campo prezzo è obbligatorio",
  ).min(
    0.01,
    "Il prezzo deve essere maggiore di 0",
  ),
  ingredients: yup.string().nullable(),
  category_id: yup.number().required("La categoria è obbligatoria"),
}).required();

export const deliveryTypeValidator = yup.object({
  delivery_address: yup.string().required("L'indirizzo è obbligatorio"),
  delivery_time: yup.string().required("L'orario è obbligatorio"),
}).required();


export const loginValidator = yup.object({
  email: yup.string().email("Inserisci un indirizzo email valido").required(
    "Questo campo è obbligatorio",
  ),
  password: yup.string().required("Il campo password è obbligatorio"),
  backUrl: yup.string().nullable()
}).required();

export const personalInfoValidator = yup.object({
  firstname: yup.string().required("Il campo nome è obbligatorio"),
  lastname: yup.string().required("Il campo cognome è obbligatorio"),
}).required();

export const resetPasswordTokenValidator = yup.object({
  token: yup.string().required(
    "Questo campo è obbligatorio",
  ),
  password: yup.string().matches(
    RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"),
    "La password deve essere lunga almeno 8 caratteri e contenere: 1 numero, 1 carattere speciale e una lettera maiuscola",
  ).required("Il campo password è obbligatorio"),
  confirmPassword: yup.string().required(
    "Il campo conferma password è obbligatorio",
  ).oneOf([yup.ref("password")], "Le due password devono corrispondere"),
}).required();

export const resetPasswordValidator = yup.object({
  email: yup.string().email("Inserisci un indirizzo email valido").required(
    "Questo campo è obbligatorio",
  ),
}).required();

export const settingValidator = yup.object({
  siteTitle: yup.string().required("Il campo nome del sito è obbligatorio"),
  siteSubtitle: yup.string().nullable(),
  orderCreatedStateId: yup.string().required("Seleziona uno stato valido"),
  orderPaidStateId: yup.string().required("Seleziona uno stato valido"),
  orderDeletedStateId: yup.string().required("Seleziona uno stato valido"),

});

const verifyEmail = async (value: string, values: yup.TestContext<any>) => {
  if (value.length > 0) {

    var response = await axiosIstance.get("/api/account/verifyEmailBusy", {
      params: {
        email: value
      }
    });

    const { result } = response.data;

    if (result == true) {
      values.createError({ path: "email" });
    }

    return !result;
  } else {
    return false;
  }
};

export const signinValidator = yup.object({
  firstname: yup.string().required("Il campo nome è obbligatorio"),
  lastname: yup.string().required("Il campo cognome è obbligatorio"),
  email: yup.string().email("Inserisci un indirizzo email valido").required(
    "Questo campo è obbligatorio",
  ).test("is-busy", "Email in uso", async function (value, values) {
    const responseTest = await verifyEmail(value!, values);
    return responseTest as boolean;
  }),
  password: yup.string().matches(
    RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"),
    "La password deve essere lunga almeno 8 caratteri e contenere: 1 numero, 1 carattere speciale e una lettera maiuscola",
  ).required("Il campo password è obbligatorio"),
  passwordConfirmation: yup.string().required(
    "Il campo conferma password è obbligatorio",
  ).oneOf([yup.ref("password")], "Le due password devono corrispondere"),
}).required();



export const verifyAccountValidator = yup.object({
  email: yup.string().email("Inserisci un indirizzo email valido").required(
    "Questo campo è obbligatorio",
  ),
}).required();

export const createOrderStateValidator = yup.object({
  name: yup.string().required("Il campo nome è obbligatorio"),
  css_badge_class: yup.string().required("Seleziona un elemento dalla lista"),
}).required();

export const updateOrderStateValidator = yup.object({
  id: yup.number().required(),
  name: yup.string().required("Il campo nome è obbligatorio"),
  css_badge_class: yup.string().required("Seleziona un elemento dalla lista"),
}).required();

export const updateOrderStatusValidator = yup.object({
  order_state: yup.string().required(),
}).required();


export const updateOrderDetailsAddItemValidator = yup.object({
  id: yup.string().required(),
}).required();
