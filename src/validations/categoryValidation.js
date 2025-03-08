import joi from "joi";

export const categoryValidation = (payload) => {
  const categoryValidationchema = joi.object({
    kategoryName: joi.string().trim().required(),
  });
  return categoryValidationchema.validate(payload);
};
