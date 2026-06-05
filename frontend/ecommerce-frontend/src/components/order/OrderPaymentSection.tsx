import { ChevronDown, CreditCard, Clock, Check, AlertCircle, XCircle } from "lucide-react";
import type { OrderDto } from "../../types/order";
import { Card } from "../ui/Card";
import { formatPrice } from "../../utils/currency/formatPrice";
import { formatDateTime } from "../../utils/date/formatDate";
import { PaymentStatus } from "../../types/payment";

interface OrderPaymentSectionProps {
  readonly order: OrderDto;
  readonly isExpanded: boolean;
  readonly onToggle: (expanded: boolean) => void;
}

const PAYMENT_METHOD_LABELS = {
  1: "PIX",
  2: "Lightning Network",
} as const;

const PAYMENT_STATUS_LABELS = {
  [PaymentStatus.PENDING]: "Pendente",
  [PaymentStatus.CONFIRMED]: "Confirmado",
  [PaymentStatus.FAILED]: "Falhou",
  [PaymentStatus.EXPIRED]: "Expirado",
} as const;

const PAYMENT_STATUS_COLORS = {
  [PaymentStatus.PENDING]: {
    badge: "bg-amber-100 text-amber-700",
    bg: "bg-amber-50 hover:bg-amber-100",
    text: "text-amber-600",
    icon: Clock,
  },
  [PaymentStatus.CONFIRMED]: {
    badge: "bg-emerald-100 text-emerald-700",
    bg: "hover:bg-gray-50",
    text: "text-gray-500",
    icon: Check,
  },
  [PaymentStatus.FAILED]: {
    badge: "bg-red-100 text-red-700",
    bg: "bg-red-50 hover:bg-red-100",
    text: "text-red-600",
    icon: XCircle,
  },
  [PaymentStatus.EXPIRED]: {
    badge: "bg-orange-100 text-orange-700",
    bg: "bg-orange-50 hover:bg-orange-100",
    text: "text-orange-600",
    icon: AlertCircle,
  },
} as const;

export function OrderPaymentSection({ order, isExpanded, onToggle,}: OrderPaymentSectionProps) {
  const payments = order.payments ?? [];
  const hasPayments = payments.length > 0;

  if (!hasPayments) {
    return null;
  }

  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const confirmedPayments = payments.filter(p => p.status === PaymentStatus.CONFIRMED);
  const pendingPayments = payments.filter(p => p.status === PaymentStatus.PENDING);
  const failedPayments = payments.filter(p => p.status === PaymentStatus.FAILED);
  const expiredPayments = payments.filter(p => p.status === PaymentStatus.EXPIRED);
  const hasConfirmedPayments = confirmedPayments.length > 0;
  const hasPendingPayments = pendingPayments.length > 0;
  const hasFailedOrExpired = failedPayments.length > 0 || expiredPayments.length > 0;

  const iconBgColor = () => {
    if (hasPendingPayments) {
      return "bg-amber-50";
    } else if (hasFailedOrExpired) {
      return "bg-red-50";
    } else {
      return "bg-emerald-50";
    }
  };
  const iconColor = () => {
    if (hasPendingPayments) {
      return "text-amber-600";
    } else if (hasFailedOrExpired) {
      return "text-red-600";
    } else {
      return "text-emerald-600";
    }
  };
  const statusMsg = (option: PaymentStatus ,paidAt?: string | null) => {
    switch (option) {
      case PaymentStatus.PENDING:
        return "Aguardando pagamento";
      case PaymentStatus.CONFIRMED:
        return `Pago em ${formatDateTime(paidAt ?? "")}`;
      case PaymentStatus.FAILED:
        return "Pagamento falhou.";
      case PaymentStatus.EXPIRED:
        return "Pagamento expirou.";
      default:
        return "Status desconhecido";
    }
  };

  return (
    <Card className="p-0 border-0 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <button
        onClick={() => onToggle(!isExpanded)}
        className="w-full px-6 sm:px-8 py-5 sm:py-6 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors focus:outline-none"
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <div className={`h-8 w-8 sm:h-10 sm:w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBgColor()}`}>
            <CreditCard className={`h-5 w-5 ${iconColor()}`} />
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
            {hasFailedOrExpired && !hasPendingPayments && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                <AlertCircle className="h-3.5 w-3.5" />
                <span className="text-xs font-semibold">{failedPayments.length + expiredPayments.length} </span>
              </div>
            )}
          </div>
        </div>
        {(() => {
          const chevronRotate = isExpanded ? "rotate-180" : "";
          return (
            <ChevronDown
              className={`h-5 w-5 text-gray-400 transition-transform duration-300 flex-shrink-0 ${chevronRotate}`}
            />
          );
        })()}
      </button>

      {isExpanded && (
        <div className="animate-in slide-in-from-top-2 fade-in duration-200 divide-y divide-gray-100 border-t border-gray-100">
          {payments.map((payment) => {
            const colors = PAYMENT_STATUS_COLORS[payment.status] ?? PAYMENT_STATUS_COLORS[PaymentStatus.PENDING];
            const StatusIcon = colors.icon;
            const statusMessage = statusMsg(payment.status, payment.paidAt);
            const shouldAnimatePulse = payment.status === PaymentStatus.PENDING ? "animate-pulse" : "";
            
            return (
              <div
                key={payment.id}
                className={`px-6 sm:px-8 py-4 sm:py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors ${colors.bg}`}
              >
                <div className="flex-1 min-w-0 w-full sm:w-auto">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                      {PAYMENT_METHOD_LABELS[payment.method] ?? "Desconhecido"}
                    </h3>
                    <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full ${colors.badge} ${shouldAnimatePulse}`}>
                      <StatusIcon className="h-3.5 w-3.5" />
                      <span className="text-xs font-semibold">{PAYMENT_STATUS_LABELS[payment.status]}</span>
                    </div>
                  </div>
                  <p className={`text-sm ${colors.text}`}>
                    {statusMessage}
                  </p>
                </div>
                {(() => {
                  const amountColor = payment.status === PaymentStatus.CONFIRMED ? "text-emerald-600" : "text-amber-600";
                  return (
                    <p className={`font-bold text-sm sm:text-base whitespace-nowrap flex-shrink-0 ${amountColor}`}>
                      +{formatPrice(payment.amount)}
                    </p>
                  );
                })()}
              </div>
            );
          })}
          {(() => {
            const footerBgClass = hasConfirmedPayments
              ? "bg-gradient-to-r from-emerald-50 to-emerald-100/50 border-emerald-200"
              : "bg-gradient-to-r from-amber-50 to-amber-100/50 border-amber-200";
            const labelColor = hasConfirmedPayments ? "text-emerald-600" : "text-amber-600";
            const labelText = hasConfirmedPayments ? "TOTAL CONFIRMADO" : "TOTAL PENDENTE";
            const totalColor = hasConfirmedPayments ? "text-emerald-600" : "text-amber-600";
            
            return (
              <div className={`px-6 sm:px-8 py-5 sm:py-6 flex items-center justify-between border-t-2 ${footerBgClass}`}>
                <div>
                  <p className={`text-xs sm:text-sm font-semibold mb-1 ${labelColor}`}>
                    {labelText}
                  </p>
                  <p className="font-bold text-gray-900 text-sm sm:text-base">
                    Total pago
                  </p>
                </div>
                <p className={`font-bold text-lg sm:text-xl ${totalColor}`}>
                  {formatPrice(totalPaid)}
                </p>
              </div>
            );
          })()}
        </div>
      )}
    </Card>
  );
}
