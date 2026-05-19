import { Edit2, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

import { Loading } from "../../components/ui/Loading";
import { MyError } from "../../components/ui/MyError";
import { UserCard } from "../../components/account/UserCard";
import { useAccount } from "../../hooks/account/useAccount";

export function Account() {
  const { user, loading, error, reload } = useAccount();

  if (loading) {
    return (
      <Loading 
        message="Carregando seus dados..." 
        minHeight="py-20"
        size="md"
      />
    );
  }

  if (error) {
    return (
      <MyError
        message={error}
        onRetry={reload}
        variant="detailed"
      />
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Visão Geral da Conta</h1>
          <p className="text-sm text-gray-500 mt-1">Gerencie suas informações e preferências.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/account/edit"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          >
            <Edit2 className="w-4 h-4" />
            Editar Perfil
          </Link>
          <button
            onClick={reload}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          >
            <RefreshCw className="w-4 h-4 text-gray-500" />
            Sincronizar
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <div className="w-full max-w-md">
          <UserCard user={user || undefined} />
        </div>
      </div>
    </div>
  );
}
