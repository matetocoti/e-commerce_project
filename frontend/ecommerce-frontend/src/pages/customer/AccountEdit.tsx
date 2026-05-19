import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { UserEditForm } from "../../components/account/UserEditForm";
import { Loading } from "../../components/ui/Loading";
import { useAccount } from "../../hooks/account/useAccount";
import { useAccountActions } from "../../hooks/account/useAccountActions";
import type { UserDto } from "../../types/user";

export function AccountEdit() {
  const { user, loading } = useAccount();
  const { updateUsername, updatePhoneNumber, goBack } = useAccountActions();

  if (loading) {
    return (
      <Loading 
        message="Carregando seus dados..." 
        minHeight="py-20"
        size="md"
      />
    );
  }

  if (!user) {
    return null;
  }

  return <AccountEditContent user={user} updateUsername={updateUsername} updatePhoneNumber={updatePhoneNumber} goBack={goBack} />;
}

interface AccountEditContentProps {
  readonly user: UserDto;
  readonly updateUsername: (username: string) => Promise<boolean>;
  readonly updatePhoneNumber: (phoneNumber: string) => Promise<boolean>;
  readonly goBack: () => void;
}

function AccountEditContent({ user, updateUsername, updatePhoneNumber, goBack }: Readonly<AccountEditContentProps>) {
  const [username, setUsername] = useState(user.username || "");
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || "");

  const handleSubmit = async () => {
    let success = true;

    if (username !== user.username) {
      const result = await updateUsername(username);
      if (!result) success = false;
    }

    if (phoneNumber !== user.phoneNumber) {
      const result = await updatePhoneNumber(phoneNumber);
      if (!result) success = false;
    }

    if (success) {
      goBack();
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={goBack}
          className="mb-8 inline-flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Editar Perfil</h1>
          <p className="text-gray-600 text-lg">Atualize suas informações pessoais</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <UserEditForm
            username={username}
            phoneNumber={phoneNumber}
            onUsernameChange={setUsername}
            onPhoneChange={setPhoneNumber}
            onSubmit={handleSubmit}
            onCancel={goBack}
          />
        </div>
      </div>
    </div>
  );
}