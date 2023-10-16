import * as yup from 'yup';

export const productIdValidationSchema = yup.object({
  productId: yup.string().required().uuid(),
});

export const createProductValidationSchema = yup.object({
  title: yup.string().required(),
  description: yup.string().required(),
  price: yup.number().required(),
  count: yup.number().required(),
});
