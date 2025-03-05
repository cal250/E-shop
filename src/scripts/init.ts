import { ProductAttributeService } from "../services/productAttribute.service";

const productAttributeService = new ProductAttributeService();

export async function initializeSizeProductAttributes() {
  const sizes = ["extra-small", "small", "medium", "large", "extra-large"];
  try {
    await productAttributeService.bulkCreate(
      sizes.map((size) => ({ type: "size", value: size }))
    );
  } catch (error) {
    console.log(error);
    throw new Error("failed to initialize size product attributes");
  }
}

export default async function init(): Promise<void | Error> {
  try {
    await initializeSizeProductAttributes();
  } catch (error) {
    return new Error(error as string);
  }
}
