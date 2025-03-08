import joi, { date } from "joi";

export const orderReturnValidation = (payload) => {
  const orderReturnSchema = joi.object({
    date: joi.date().required(),
    note: joi.string().trim().required(),
    userId: joi.number().required(),
    orderId: joi.number().required(),
    detail: joi.array().required(),
  });
  return orderReturnSchema.validate(payload);
};
