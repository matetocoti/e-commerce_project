import { ChevronDown, CreditCard, Clock, Check } from "lucide-react";
import type { OrderDto } from "../../types/order";
import { Card } from "../ui/Card";
import { formatPrice } from "../../utils/currency/formatPrice";
import { formatDateTime } from "../../utils/date/formatDate";

interface OrderPaymentSectionProps {
  readonly order: OrderDto;
  readonly isExpanded: boolean;
  readonly onToggle: (expanded: boolean) => void;
}

const PAYMENT_METHOD_LABELS = {
  1: "PIX",
  2: "Lightning Network",
} as const;

export function OrderPaymentSection({ order, isExpanded, onToggle,}: OrderPaymentSectionProps) {
  const payments = order.payments ?? [];
  const hasPayments = payments.length > 0;

  if (!hasPayments) {
    return null;
  }

  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const confirmedPayments = payments.filter(p => !!p.paidAt);
  const pendingPayments = payments.filter(p => !p.paidAt);
  const hasConfirmedPayments = confirmedPayments.length > 0;
  const hasPendingPayments = pendingPayments.length > 0;

  return (
    <Card className="p-0 border-0 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <button
        onClick={() => onToggle(!isExpanded)}
        className="w-full px-6 sm:px-8 py-5 sm:py-6 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors focus:outline-none"
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <div className={`h-8 w-8 sm:h-10 sm:w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
            hasPendingPayments ? "bg-amber-50" : "bg-emerald-50"
          }`}>
            <CreditCard className={`h-5 w-5 ${
              hasPendingPayments ? "text-amber-600" : "text-emerald-600"
            }`} />
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              Pagamentos ({payments.length})
            </h2>
            {hasPendingPayments && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 animate-pulse">
                <Clock className="h-3.5 w-3.5" />
                <span className="text-xs font-semibold">{pendingPayments.length} Pendente{pendingPayments.length > 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        </div>
        <ChevronDown
          className={`h-5 w-5 text-gray-400 transition-transform duration-300 flex-shrink-0 ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {isExpanded && (
        <div className="animate-in slide-in-from-top-2 fade-in duration-200 divide-y divide-gray-100 border-t border-gray-100">
          {payments.map((payment) => {
            const isConfirmed = !!payment.paidAt;
            
            return (
              <div
                key={payment.id}
                className={`px-6 sm:px-8 py-4 sm:py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors ${
                  isConfirmed ? "hover:bg-gray-50" : "bg-amber-50 hover:bg-amber-100"
                }`}
              >
                <div className="flex-1 min-w-0 w-full sm:w-auto">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                      {PAYMENT_METHOD_LABELS[payment.method] ?? "Desconhecido"}
                    </h3>
                    {isConfirmed ? (
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">
                        <Check className="h-3.5 w-3.5" />
                        <span className="text-xs font-semibold">Confirmado</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-200 text-amber-800 animate-pulse">
                        <Clock className="h-3.5 w-3.5" />
                        <span className="text-xs font-semibold">Pendente</span>
                      </div>
                    )}
                  </div>
                  <p className={`text-sm ${isConfirmed ? "text-gray-500" : "text-amber-600 font-medium"}`}>
                    {isConfirmed 
                      ? formatDateTime(payment.paidAt!) 
                      : "Aguardando confirmação do pagamento..."}
                  </p>
                </div>
                <p className={`font-bold text-sm sm:text-base whitespace-nowrap flex-shrink-0 ${
                  isConfirmed ? "text-emerald-600" : "text-amber-600"
                }`}>
                  +{formatPrice(payment.amount)}
                </p>
              </div>
            );
          })}
          <div className={`px-6 sm:px-8 py-5 sm:py-6 flex items-center justify-between border-t-2 ${
            hasConfirmedPayments
              ? "bg-gradient-to-r from-emerald-50 to-emerald-100/50 border-emerald-200"
              : "bg-gradient-to-r from-amber-50 to-amber-100/50 border-amber-200"
          }`}>
            <div>
              <p className={`text-xs sm:text-sm font-semibold mb-1 ${
                hasConfirmedPayments ? "text-emerald-600" : "text-amber-600"
              }`}>
                {hasConfirmedPayments ? "TOTAL CONFIRMADO" : "TOTAL PENDENTE"}
              </p>
              <p className="font-bold text-gray-900 text-sm sm:text-base">
                Total pago
              </p>
            </div>
            <p className={`font-bold text-lg sm:text-xl ${
              hasConfirmedPayments ? "text-emerald-600" : "text-amber-600"
            }`}>
              {formatPrice(totalPaid)}
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}
