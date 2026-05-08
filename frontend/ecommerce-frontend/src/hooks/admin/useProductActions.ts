import { useState } from "react";
import {
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  activateAdminProduct,
  deactivateAdminProduct,
} from "../../api/adminApi";
import type {
  AdminProductDto,
  CreateProductDto,
  UpdateProductDto,
} from "../../types/product";

interface UseProductActionsState {
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
}

export function useProductActions() {
  const [state, setState] = useState<UseProductActionsState>({
    isLoading: false,
    error: null,
    isSuccess: false,
  });

  const resetState = () => {
    setState({ isLoading: false, error: null, isSuccess: false });
  };

  const createProduct = async (data: CreateProductDto): Promise<AdminProductDto | null> => {
    setState({ isLoading: true, error: null, isSuccess: false });
    try {
      const newProduct = await createAdminProduct(data);
      setState({ isLoading: false, error: null, isSuccess: true });
      return newProduct;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao criar produto";
      setState({ isLoading: false, error: errorMessage, isSuccess: false });
      console.error("Erro ao criar produto:", error);
      throw error;
    }
  };

  const updateProduct = async (id: string,data: UpdateProductDto): Promise<AdminProductDto | null> => {
    setState({ isLoading: true, error: null, isSuccess: false });
    try {
      const updatedProduct = await updateAdminProduct(id, data);
      setState({ isLoading: false, error: null, isSuccess: true });
      return updatedProduct;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao atualizar produto";
      setState({ isLoading: false, error: errorMessage, isSuccess: false });
      console.error("Erro ao atualizar produto:", error);
      throw error;
    }
  };

  const deleteProduct = async (id: string): Promise<void> => {
    setState({ isLoading: true, error: null, isSuccess: false });
    try {
      await deleteAdminProduct(id);
      setState({ isLoading: false, error: null, isSuccess: true });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao deletar produto";
      setState({ isLoading: false, error: errorMessage, isSuccess: false });
      console.error("Erro ao deletar produto:", error);
      throw error;
    }
  };

  const activateProduct = async (id: string): Promise<AdminProductDto | null> => {
    setState({ isLoading: true, error: null, isSuccess: false });
    try {
      const activatedProduct = await activateAdminProduct(id);
      setState({ isLoading: false, error: null, isSuccess: true });
      return activatedProduct;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao ativar produto";
      setState({ isLoading: false, error: errorMessage, isSuccess: false });
      console.error("Erro ao ativar produto:", error);
      throw error;
    }
  };

  const deactivateProduct = async (id: string): Promise<void> => {
    setState({ isLoading: true, error: null, isSuccess: false });
    try {
      await deactivateAdminProduct(id);
      setState({ isLoading: false, error: null, isSuccess: true });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao desativar produto";
      setState({ isLoading: false, error: errorMessage, isSuccess: false });
      console.error("Erro ao desativar produto:", error);
      throw error;
    }
  };

  return {
    // Actions
    createProduct,
    updateProduct,
    activateProduct,
    deactivateProduct,
    deleteProduct,
    // State
    isLoading: state.isLoading,
    error: state.error,
    isSuccess: state.isSuccess,
    // Utilities
    resetState,
  };
}