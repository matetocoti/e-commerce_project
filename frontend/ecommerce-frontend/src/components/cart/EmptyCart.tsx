import { Card } from "../../components/ui/Card";
import { PackageOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";


export function EmptyCart() {
    const navigate = useNavigate();
    return (
        <Card className="flex flex-col items-center justify-center overflow-hidden border-dashed py-16 text-center shadow-none bg-gray-50/50">
          <div className="mb-4 rounded-full bg-blue-50 p-4 text-blue-600">
            <PackageOpen className="h-10 w-10" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Seu carrinho está vazio</h2>
          <p className="mt-2 max-w-md text-gray-500">
            Parece que você ainda não adicionou nenhum produto. Navegue pela nossa loja e encontre o que precisa.
          </p>
          <button 
            onClick={() => navigate('/')} 
            className="mt-6 rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white transition-colors hover:bg-blue-700"
          >
            Continuar Comprando
          </button>
        </Card>
    );
}