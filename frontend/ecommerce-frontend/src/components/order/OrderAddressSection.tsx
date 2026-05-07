import { ChevronDown, MapPin, Mail, Phone } from "lucide-react";
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
        <div className="animate-in slide-in-from-top-2 fade-in duration-200 border-t border-gray-100 px-6 sm:px-8 py-4 sm:py-5 bg-gray-50 space-y-2 text-sm text-gray-700">
          <p className="font-medium text-gray-900">{order.address?.street}</p>
          <p>{order.address?.city} - {order.address?.state}</p>
          <p className="text-gray-600">CEP: {order.address?.zipCode}</p>
          <p>{order.address?.notes}</p>
        </div>
      )}

      {isExpanded && isDigital && (
        <div className="animate-in slide-in-from-top-2 fade-in duration-200 border-t border-gray-100 px-6 sm:px-8 py-4 sm:py-5 bg-gray-50 space-y-3 text-sm text-gray-700">
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-blue-600 flex-shrink-0" />
            <p className="font-medium text-gray-900">{order.digitalContact?.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 text-blue-600 flex-shrink-0" />
            <p className="font-medium text-gray-900">{order.digitalContact?.phoneNumber}</p>
          </div>
        </div>
      )}
    </Card>
  );
}
