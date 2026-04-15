import {
  CheckCircle,
  Clock,
  XCircle,
  type LucideIcon,
} from "lucide-react";

interface OrderStatusInfo {
  label: string;
  icon: LucideIcon;
  className: string;
}

export function getOrderStatusInfo(status: string): OrderStatusInfo {
  switch (status) {
    case "Pending":
      return {
        label: "Pendente",
        icon: Clock,
        className: "bg-yellow-100 text-yellow-800",
      };

    case "AwaitingPayment":
      return {
        label: "Aguardando pagamento",
        icon: Clock,
        className: "bg-blue-100 text-blue-800",
      };

    case "Paid":
      return {
        label: "Pago",
        icon: CheckCircle,
        className: "bg-green-100 text-green-800",
      };

    case "Cancelled":
      return {
        label: "Cancelado",
        icon: XCircle,
        className: "bg-red-100 text-red-800",
      };

    case "Expired":
      return {
        label: "Expirado",
        icon: XCircle,
        className: "bg-gray-100 text-gray-800",
      };

    default:
      return {
        label: status,
        icon: Clock,
        className: "bg-gray-100 text-gray-800",
      };
  }
}