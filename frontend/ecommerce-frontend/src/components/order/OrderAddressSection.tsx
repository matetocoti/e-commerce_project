import { ChevronDown, MapPin, Mail, Phone, MapPinned } from "lucide-react";
import type { OrderDto } from "../../types/order";
import { Card } from "../ui/Card";

interface OrderAddressSectionProps {
  readonly order: OrderDto;
  readonly isExpanded: boolean;
  readonly onToggle: (expanded: boolean) => void;
  readonly isPhysical: boolean;
  readonly isDigital: boolean;
}

export function OrderAddressSection({
  order,
  isExpanded,
  onToggle,
  isPhysical,
  isDigital,
}: OrderAddressSectionProps) {
  return (
    <Card className="p-0 border-0 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <button
        onClick={() => onToggle(!isExpanded)}
        className="w-full px-6 sm:px-8 py-5 sm:py-6 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors focus:outline-none"
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <div
            className={`h-8 w-8 sm:h-10 sm:w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
              isPhysical ? "bg-green-50" : "bg-blue-50"
            }`}
          >
            {isPhysical ? (
              <MapPin className="h-5 w-5 text-green-600" />
            ) : (
              <Mail className="h-5 w-5 text-blue-600" />
            )}
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            {isPhysical ? "Endereço de entrega" : "Dados de contato"}
          </h2>
        </div>
        <ChevronDown
          className={`h-5 w-5 text-gray-400 transition-transform duration-300 flex-shrink-0 ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {isExpanded && isPhysical && (
        <div className="animate-in slide-in-from-top-2 fade-in duration-200 border-t border-gray-100 px-5 sm:px-8 py-5 sm:py-6 bg-gradient-to-br from-green-50/50 to-emerald-50/30">
          <div className="bg-white rounded-xl border border-green-100/80 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] overflow-hidden transition-all hover:shadow-md">
            <div className="p-4 sm:p-5 flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <MapPinned className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-green-600 tracking-wider mb-1">LOCAL DE ENTREGA</p>
                <p className="font-medium text-gray-900 text-sm sm:text-base leading-snug mb-1.5 break-words">
                  {order.address?.street}
                </p>
                <div className="flex flex-wrap items-center text-sm text-gray-600 gap-x-2 gap-y-1">
                  <span>{order.address?.city} - {order.address?.state}</span>
                  <span className="hidden sm:inline text-gray-300">•</span>
                  <span className="font-mono bg-gray-50 px-1.5 py-0.5 rounded-md text-xs border border-gray-100">
                    {order.address?.zipCode}
                  </span>
                </div>
              </div>
            </div>

            {order.address?.notes && (
              <div className="px-5 py-3 bg-amber-50/50 border-t border-amber-100/50">
                <p className="text-xs font-semibold text-amber-600 tracking-wider mb-1">OBSERVAÇÕES</p>
                <p className="text-sm text-amber-900/80 leading-relaxed">
                  {order.address.notes}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {isExpanded && isDigital && (
        <div className="animate-in slide-in-from-top-2 fade-in duration-200 border-t border-gray-100 px-5 sm:px-8 py-5 sm:py-6 bg-gradient-to-br from-blue-50/50 to-sky-50/30">
          <div className="bg-white rounded-xl border border-blue-100/80 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] divide-y divide-blue-50 transition-all hover:shadow-md">
            <div className="p-4 sm:p-5 flex items-center gap-3.5">
              <div className="h-9 w-9 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                <Mail className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-blue-600 tracking-wider mb-0.5">E-MAIL</p>
                <p className="font-medium text-gray-900 text-sm truncate">{order.digitalContact?.email}</p>
              </div>
            </div>
            <div className="p-4 sm:p-5 flex items-center gap-3.5">
              <div className="h-9 w-9 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                <Phone className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-blue-600 tracking-wider mb-0.5">TELEFONE</p>
                <p className="font-medium text-gray-900 text-sm">{order.digitalContact?.phoneNumber}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
