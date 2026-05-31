import { ChevronDown, MapPin, Mail } from "lucide-react";
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
        <div className="animate-in slide-in-from-top-2 fade-in duration-200 border-t border-gray-100 px-5 sm:px-8 py-4 sm:py-5 bg-gray-50/40">
          <div className="bg-white rounded-lg border border-gray-200/50 shadow-sm">
            <div className="p-4 sm:p-5">
              <p className="text-xs font-semibold text-gray-500 mb-2">ENDEREÇO</p>
              <p className="font-medium text-gray-900 text-sm leading-tight mb-1.5 break-words">
                {order.address?.street}
              </p>
              <div className="flex flex-wrap items-center text-xs text-gray-600 gap-1.5">
                <span>{order.address?.city}</span>
                <span className="text-gray-300">•</span>
                <span>{order.address?.state}</span>
                <span className="text-gray-300">•</span>
                <span className="font-mono text-gray-600">{order.address?.zipCode}</span>
              </div>
            </div>

            {order.address?.notes && (
              <div className="px-4 sm:px-5 py-3 bg-gray-50 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-600 mb-1">Observações</p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {order.address.notes}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {isExpanded && isDigital && (
        <div className="animate-in slide-in-from-top-2 fade-in duration-200 border-t border-gray-100 px-5 sm:px-8 py-4 sm:py-5 bg-gray-50/40">
          <div className="bg-white rounded-lg border border-gray-200/50 shadow-sm divide-y divide-gray-100">
            <div className="p-4 sm:p-5">
              <p className="text-xs font-semibold text-gray-500 mb-1.5">EMAIL</p>
              <p className="font-medium text-gray-900 text-sm truncate">{order.digitalContact?.email}</p>
            </div>
            <div className="p-4 sm:p-5">
              <p className="text-xs font-semibold text-gray-500 mb-1.5">TELEFONE</p>
              <p className="font-medium text-gray-900 text-sm">{order.digitalContact?.phoneNumber}</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
