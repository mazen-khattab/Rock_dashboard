import { z } from "zod";

export const productFormDataSchema = z.object({
    categoryId: z.number().min(1, "Please select a category for the product."),

    descriptionEn: z.string().trim().min(1, "Please enter description in English."),
    descriptionAr: z.string().trim().min(1, "Please enter description in Arabic."),

    variants: z.array(
        z.object({
            sizeId: z.number().min(1, "Please select size for all variants."),
            colorId: z.number().min(1, "Please select color for all variants."),
            quantity: z.number().min(1, "Please enter quantity greater than 0 for all variants."),
            images: z.array(
                z.object({
                    sortOrder: z.number().min(0, "Sort order must be 0 or greater.")
                })
            )
        })
    ).min(1, "Please add at least one variant."),

    slugEn: z.string().trim().min(1, "Please enter slug in English."),
    slugAr: z.string().trim().min(1, "Please enter slug in Arabic."),

    metaTitleEn: z.string().trim().min(1, "Please enter meta title in English."),
    metaTitleAr: z.string().trim().min(1, "Please enter meta title in Arabic."),

    metaDescriptionEn: z.string().trim().min(1, "Please enter meta description in English."),
    metaDescriptionAr: z.string().trim().min(1, "Please enter meta description in Arabic.")
});