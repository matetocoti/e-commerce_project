interface ProductPriceProps {
  readonly price: number;
}

export function ProductPrice({ price }: Readonly<ProductPriceProps>) {
  const formattedPrice = price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <p className="text-4xl font-bold text-blue-600">{formattedPrice}</p>
  );
}