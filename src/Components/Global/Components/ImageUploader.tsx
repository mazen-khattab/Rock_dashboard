import { ImagePlus } from "lucide-react";
import type { CreatedVariantImage } from "../../../Types/Product";
import { useEffect, useMemo, useState, type ChangeEvent, type DragEvent } from "react";

type VariantImageUploaderProps = {
    image: CreatedVariantImage;
    imageIndex: number;
    variantId: number;
    imageUrl?: string;
    onFileSelect: (variantId: number, imageId: number, file: File | null) => void;
};

export const VariantImageUploader = ({ image, imageIndex, variantId, imageUrl, onFileSelect }: VariantImageUploaderProps) => {
    const [isDragging, setIsDragging] = useState(false);
    const inputId = `variant-image-${variantId}-${image.id}`;
    const previewUrl = useMemo(() => {
        return image.file ? URL.createObjectURL(image.file) : imageUrl || "";
    }, [image.file, imageUrl]);

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        onFileSelect(variantId, image.id, event.target.files?.[0] ?? null);
    };

    const handleDragOver = (event: DragEvent<HTMLSpanElement>) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (event: DragEvent<HTMLSpanElement>) => {
        event.preventDefault();
        setIsDragging(false);

        const file = Array.from(event.dataTransfer.files).find((droppedFile) => droppedFile.type.startsWith("image/")) ?? null;
        if (file) {
            onFileSelect(variantId, image.id, file);
        }
    };

    return (
        <label className="block space-y-1.5 w-full min-w-0" htmlFor={inputId}>
            <span className="text-xs sm:text-sm font-medium text-zinc-300">Image {imageIndex + 1}</span>
            <input
                id={inputId}
                type="file"
                accept="image/*"
                onChange={handleInputChange}
                className="sr-only"
            />
            <span
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`flex min-h-36 sm:min-h-44 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed text-center transition ${
                    isDragging
                        ? "border-zinc-400 bg-zinc-800/80 ring-2 ring-zinc-600"
                        : "border-zinc-700 bg-zinc-900/60 hover:border-zinc-500 hover:bg-zinc-850/80"
                }`}
            >
                {previewUrl ? (
                    <img
                        src={previewUrl}
                        alt={`Preview for image ${imageIndex + 1}`}
                        className="h-36 sm:h-44 w-full object-cover"
                    />
                ) : (
                    <span className="flex flex-col items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-4 sm:py-6 text-center text-zinc-400">
                        <ImagePlus size={24} className="text-zinc-500 sm:hidden" />
                        <ImagePlus size={28} className="text-zinc-500 hidden sm:block" />
                        <span className="font-medium text-zinc-200 text-xs sm:text-sm">Drop image or click to upload</span>
                        <span className="text-[11px] sm:text-xs text-zinc-500">PNG, JPG, WEBP, or GIF</span>
                    </span>
                )}
            </span>
            {image.file ? (
                <span className="block truncate max-w-full text-[11px] sm:text-xs text-zinc-500">{image.file.name}</span>
            ) : imageUrl ? (
                <span className="block truncate max-w-full text-[11px] sm:text-xs text-zinc-500">{imageUrl.split("/").pop()}</span>
            ) : null}
        </label>
    );
};
