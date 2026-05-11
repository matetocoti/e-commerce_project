import { useState, useCallback } from "react";

interface UseConfirmOptions {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "info" | "warning" | "danger" | "success";
  confirmButtonVariant?: "default" | "destructive" | "outline" | "ghost";
}

export function useConfirm() {
  const [state, setState] = useState<{
    isOpen: boolean;
    title: string;
    description?: string;
    confirmText: string;
    cancelText: string;
    variant: "info" | "warning" | "danger" | "success";
    confirmButtonVariant?: "default" | "destructive" | "outline" | "ghost";
    isLoading: boolean;
    onConfirm?: () => void | Promise<void>;
    onCancel?: () => void;
  }>({
    isOpen: false,
    title: "",
    confirmText: "Confirmar",
    cancelText: "Cancelar",
    variant: "info",
    isLoading: false,
  });

  const open = useCallback(
    (options: UseConfirmOptions & {
      onConfirm: () => void | Promise<void>;
      onCancel?: () => void;
    }) => {
      setState((prev) => ({
        ...prev,
        isOpen: true,
        title: options.title,
        description: options.description,
        confirmText: options.confirmText || "Confirmar",
        cancelText: options.cancelText || "Cancelar",
        variant: options.variant || "info",
        confirmButtonVariant: options.confirmButtonVariant,
        onConfirm: options.onConfirm,
        onCancel: options.onCancel || (() => setState(prev => ({ ...prev, isOpen: false }))),
      }));
    },
    []
  );

  const close = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isOpen: false,
    }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState((prev) => ({
      ...prev,
      isLoading: loading,
    }));
  }, []);

  return {
    isOpen: state.isOpen,
    title: state.title,
    description: state.description,
    confirmText: state.confirmText,
    cancelText: state.cancelText,
    variant: state.variant,
    confirmButtonVariant: state.confirmButtonVariant,
    isLoading: state.isLoading,
    onConfirm: state.onConfirm || (() => {}),
    onCancel: state.onCancel || close,
    open,
    close,
    setLoading,
  };
}
