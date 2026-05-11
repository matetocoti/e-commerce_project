import { useState } from "react";
import { Link } from "react-router-dom";
import { UserPlus, Mail, User, CheckCircle } from "lucide-react";

import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { PasswordField } from "../../components/auth/PasswordField";
import { useRegisterForm } from "../../hooks/auth/useRegisterForm";

export function Register() {
  const {
    loading,
    error,
    username,
    email,
    password,
    confirmPassword,
    passwordsMatch,
    passwordStrength,
    setUsername,
    setEmail,
    setPassword,
    setConfirmPassword,
    onSubmit,
  } = useRegisterForm();

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 shadow-lg shadow-blue-700/20">
            <UserPlus className="h-8 w-8 text-white" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900">Criar conta</h1>
          <p className="mt-2 text-gray-600">Comece sua jornada conosco</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl">
          <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">
                Nome de usuário
              </p>

              <div className="relative">
                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                <Input
                  type="text"
                  placeholder="Escolha um nome de usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 sm:pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Email</p>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 sm:pl-10"
                  required
                />
              </div>
            </div>

            <PasswordField
              label="Senha"
              value={password}
              onChange={setPassword}
              placeholder="Crie uma senha forte"
              required
              showPassword={showPassword}
              onToggleVisibility={() => setShowPassword((prev) => !prev)}
              hint={
                password.length > 0 && (
                  <div className="space-y-1">
                    <div className="flex gap-1">
                      {[1, 2, 3].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            level <= passwordStrength.strength
                              ? passwordStrength.color
                              : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>

                    {passwordStrength.label && (
                      <p className="text-xs text-gray-600">
                        Força da senha: {passwordStrength.label}
                      </p>
                    )}
                  </div>
                )
              }
            />

            <PasswordField
              label="Confirmar senha"
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="Digite a senha novamente"
              required
              showPassword={showPassword}
              onToggleVisibility={() => setShowPassword((prev) => !prev)}
              hint={
                passwordsMatch ? (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    As senhas coincidem
                  </div>
                ) : undefined
              }
            />

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              {loading ? "Criando conta..." : "Criar conta"}
            </Button>

            <p className="text-center text-xs text-gray-500">
              Ao criar uma conta, você concorda com nossos{" "}
              <Link to="/terms" className="text-blue-600 hover:text-blue-700">
                Termos de Serviço
              </Link>{" "}
              e{" "}
              <Link to="/privacy" className="text-blue-600 hover:text-blue-700">
                Política de Privacidade
              </Link>
            </p>
          </form>

          <div className="my-6 text-center text-sm text-gray-500">ou</div>

          <div className="text-center">
            <p className="text-gray-600">
              Já tem uma conta?{" "}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-700"
              >
                Fazer login
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