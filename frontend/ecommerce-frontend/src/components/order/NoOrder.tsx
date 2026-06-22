import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/Button";



export function NoOrder() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
        <div className="mx-auto max-w-md text-center">
          <ShoppingBag className="mx-auto mb-4 h-24 w-24 text-gray-300" />
          <h1 className="mb-2 text-2xl font-bold">Nenhum pedido encontrado</h1>
          <p className="mb-6 text-gray-600">
            Você ainda não realizou nenhum pedido
          </p>
          <Link to="/">
            <Button size="lg">Começar a comprar</Button>
          </Link>
        </div>
    </div>
    );
}