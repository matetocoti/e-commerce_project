interface ProductImageProps {
  readonly src: string;
  readonly alt: string;
  readonly className?: string;
}

export function ProductImage({ src, alt, className = '' }: Readonly<ProductImageProps>) {
  return (
    <div className={`relative flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-gray-100 ${className}`}>
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-contain object-center"
        loading="lazy"
      />
    </div>
  );
}