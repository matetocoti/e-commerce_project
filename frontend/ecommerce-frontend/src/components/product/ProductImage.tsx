import { PlaceHolderImg } from "../ui/PlaceHolderImg";

interface ProductImageProps {
  readonly src: string | null;
  readonly alt: string;
  readonly className?: string;
}

export function ProductImage({ src, alt, className = '' }: Readonly<ProductImageProps>) {
  return (
    <div className={`relative flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100 ${className}`}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-contain object-center p-6"
          loading="lazy"
        />
      ) : (
        <PlaceHolderImg className="w-full h-full" />
      )}
    </div>
  );
}