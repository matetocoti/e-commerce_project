import { UserCircle, Mail, Phone, Calendar, Clock, ShieldCheck } from "lucide-react";
import { type UserDto } from "../../types/user";
import { formatDate } from "../../utils/date/formatDate";

interface UserCardProps {
  user?: UserDto;
}

export function UserCard({ user }: Readonly<UserCardProps>) {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden w-full relative">
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-90"></div>
      <div className="absolute top-0 left-0 right-0 h-32 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>

      <div className="relative pt-12 pb-6 px-6 sm:px-10">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-28 h-28 bg-white rounded-full p-2 shadow-md">
              <div className="w-full h-full bg-blue-50 rounded-full flex items-center justify-center border border-blue-100">
                <UserCircle className="w-16 h-16 text-blue-500" strokeWidth={1.5} />
              </div>
            </div>
            {user?.role === 0 && (
              <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-sm">
                <div className="bg-indigo-500 rounded-full p-1.5 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-white" />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            {user?.username || "Carregando..."}
          </h2>
          <p className="text-sm font-medium text-blue-600 mt-1">
            {user?.role === 0 ? "Administrador" : "Cliente"}
          </p>
        </div>
        <div className="space-y-5">
          <div className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-blue-50/50 transition-colors border border-gray-100">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm mr-4 border border-gray-200 text-gray-500">
              <Mail className="w-5 h-5" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Endereço de Email</p>
              <p className="text-sm font-medium text-gray-900 truncate">{user?.email || "—"}</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-blue-50/50 transition-colors border border-gray-100">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm mr-4 border border-gray-200 text-gray-500">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Celular</p>
              <p className="text-sm font-medium text-gray-900">{user?.phoneNumber || "Não informado"}</p>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Membro desde</p>
              <p className="text-xs font-medium text-gray-700 mt-0.5">
                {user?.createdAt ? formatDate(user.createdAt) : "—"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Última ativ.</p>
              <p className="text-xs font-medium text-gray-700 mt-0.5">
                {user?.updatedAt ? formatDate(user.updatedAt) : "—"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
