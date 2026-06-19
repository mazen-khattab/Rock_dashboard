import type { ProductFormData } from "../Types/Product";

const appendFormValue = (data: FormData, key: string, value: string | number | boolean) => {
  data.append(key, String(value));
};

/**
 * Converts a ProductFormData state object into a Multipart FormData object for backend consumption.
 */
export const prepareProductFormData = (formData: ProductFormData | null): FormData => {
  const data = new FormData();

  if (!formData) {
    return data; // Return empty FormData if formData is null
  }

  if (formData.id) {
    appendFormValue(data, "Id", Number(formData.id));
  }

  appendFormValue(data, "NameAr", formData.nameAr);
  appendFormValue(data, "NameEn", formData.nameEn);
  appendFormValue(data, "DescriptionAr", formData.descriptionAr);
  appendFormValue(data, "DescriptionEn", formData.descriptionEn);
  appendFormValue(data, "SlugAr", formData.slugAr);
  appendFormValue(data, "SlugEn", formData.slugEn);
  appendFormValue(data, "MetaTitleAr", formData.metaTitleAr);
  appendFormValue(data, "MetaTitleEn", formData.metaTitleEn);
  appendFormValue(data, "MetaDescriptionAr", formData.metaDescriptionAr);
  appendFormValue(data, "MetaDescriptionEn", formData.metaDescriptionEn);
  appendFormValue(data, "CategoryId", Number(formData.categoryId));
  appendFormValue(data, "Price", Number(formData.price));
  appendFormValue(data, "IsActive", formData.isActive);

  formData.variants.forEach((variant, variantIndex) => {
    appendFormValue(data, `Variants[${variantIndex}].Id`, variant.id);
    appendFormValue(data, `Variants[${variantIndex}].SizeId`, Number(variant.sizeId));
    appendFormValue(data, `Variants[${variantIndex}].ColorId`, Number(variant.colorId));
    appendFormValue(data, `Variants[${variantIndex}].Quantity`, Number(variant.quantity || 0));

    variant.images.forEach((image, imageIndex) => {
      appendFormValue(data, `Variants[${variantIndex}].Images[${imageIndex}].Id`, image.id.toString());
      if (image.file) {
        data.append(`Variants[${variantIndex}].Images[${imageIndex}].File`, image.file);
      }
      else if (image.imageUrl) {
        appendFormValue(data, `Variants[${variantIndex}].Images[${imageIndex}].ImageUrl`, image.imageUrl);
      }
      appendFormValue(data, `Variants[${variantIndex}].Images[${imageIndex}].SortOrder`, Number(image.sortOrder || 0));
    });
  });

  // console.log(Array.from(data.entries()));

  return data;
};