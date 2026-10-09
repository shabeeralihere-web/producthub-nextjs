import * as yup from "yup";

const productFields = {
  name: yup
    .string()
    .trim()
    .required("Product name is required")
    .min(3, "Product name must be at least 3 characters"),

  price: yup
    .number()
    .typeError("Price must be a number")
    .required("Price is required")
    .positive("Price must be greater than 0"),

  category: yup
    .string()
    .oneOf(
      [
        "Electronics",
        "Mobiles",
        "Computers",
        "Audio",
        "Accessories",
      ],
      "Please select a valid category"
    )
    .required("Category is required"),
};

export const productSchema = yup.object({
  ...productFields,

  image: yup
    .mixed()
    .test(
      "fileRequired",
      "Product image is required",
      (value) => Boolean(value?.[0])
    ),
});

export const editProductSchema = yup.object({
  ...productFields,

  image: yup
    .mixed()
    .nullable(),
});