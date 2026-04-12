interface ProductImageProps {
  readonly src: string;
  readonly alt: string;
}

export function ProductImage({ src, alt }: Readonly<ProductImageProps>) {
  return (
    <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
      />
    </div>
  );
}