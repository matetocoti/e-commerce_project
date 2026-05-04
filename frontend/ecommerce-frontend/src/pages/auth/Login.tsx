import { Link } from "react-router-dom";
import { LogIn, Mail } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { PasswordField } from "../../components/auth/PasswordField";
import { useLoginForm } from "../../hooks/auth/useLoginForm";

export function Login() {
  const { loading, error, loginInput, password, setLoginInput, setPassword, onSubmit } =
    useLoginForm();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600">
            <LogIn className="h-8 w-8 text-white" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900">
            Bem-vindo de volta
          </h1>

          <p className="mt-2 text-gray-600">
            Entre na sua conta para continuar
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">
                Email ou nome de usuário
              </p>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                <Input
                  value={loginInput}
                  onChange={(e) => setLoginInput(e.target.value)}
                  placeholder="Digite seu email ou usuário"
                  className="pl-10 sm:pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700">Senha</p>

                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Esqueceu a senha?
                </Link>
              </div>

              <PasswordField
                label=""
                value={password}
                onChange={setPassword}
                placeholder="Digite sua senha"
                required
              />
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <div className="my-6 text-center text-sm text-gray-500">ou</div>

          <div className="text-center">
            <p className="text-gray-600">
              Não tem uma conta?{" "}
              <Link
                to="/register"
                className="font-medium text-blue-600 hover:text-blue-700"
              >
                Criar conta
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">
            ← Voltar para a loja
          </Link>
        </div>
      </div>
    </div>
  );
}