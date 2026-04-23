import {
  CheckCircle,
  Clock,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { OrderStatus } from "../../types/order";

interface OrderStatusInfo {
  label: string;
  icon: LucideIcon;
  className: string;
}

export function getOrderStatusInfo(status: OrderStatus): OrderStatusInfo {
  switch (status) {
    case OrderStatus.Pending:
      return {
        label: "Pendente",
        icon: Clock,
        className: "bg-yellow-100 text-yellow-800",
      };

    case OrderStatus.AwaitingPayment:
      return {
        label: "Aguardando pagamento",
        icon: Clock,
        className: "bg-blue-100 text-blue-800",
      };

    case OrderStatus.Paid:
      return {
        label: "Pago",
        icon: CheckCircle,
        className: "bg-green-100 text-green-800",
      };

    case OrderStatus.Cancelled:
      return {
        label: "Cancelado",
        icon: XCircle,
        className: "bg-red-100 text-red-800",
      };

    case OrderStatus.Expired:
      return {
        label: "Expirado",
        icon: XCircle,
        className: "bg-gray-100 text-gray-800",
      };

    default:
      return {
        label: "Desconhecido",
        icon: Clock,
        className: "bg-gray-100 text-gray-800",
      };
  }
}