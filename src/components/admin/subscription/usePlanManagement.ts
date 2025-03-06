
import { useState } from 'react';
import { usePlanDialog } from './hooks/usePlanDialog';
import { usePlanFetch } from './hooks/usePlanFetch';
import { usePlanDeletion } from './hooks/usePlanDeletion';
import { usePlanStatusToggle } from './hooks/usePlanStatusToggle';
import { usePlanSave } from './hooks/usePlanSave';

export const usePlanManagement = () => {
  // Get plan data and fetch functionality
  const { plans, isLoading: isLoadingFetch, fetchPlans } = usePlanFetch();
  
  // Get dialog management functionality
  const { 
    isPlanDialogOpen, 
    setIsPlanDialogOpen,
    currentPlan, 
    setCurrentPlan,
    dialogMode,
    formError,
    setFormError,
    addPlan,
    editPlan,
    handlePriceChange
  } = usePlanDialog();
  
  // Get plan deletion functionality
  const {
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    planToDelete,
    deletePlan,
    handleDeleteConfirm,
    isLoadingDelete
  } = usePlanDeletion(fetchPlans);
  
  // Get plan status toggle functionality
  const { togglePlanStatus, isLoadingToggle } = usePlanStatusToggle(fetchPlans);
  
  // Get plan save functionality
  const { handleSavePlan, isLoadingSave } = usePlanSave(
    currentPlan,
    dialogMode,
    fetchPlans,
    setIsPlanDialogOpen,
    setFormError
  );
  
  // Combine loading states
  const isLoading = isLoadingFetch || isLoadingDelete || isLoadingToggle || isLoadingSave;

  return {
    plans,
    isLoading,
    isPlanDialogOpen,
    setIsPlanDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    currentPlan,
    setCurrentPlan,
    planToDelete,
    dialogMode,
    formError,
    addPlan,
    editPlan,
    deletePlan,
    togglePlanStatus,
    handleSavePlan,
    handlePriceChange,
    handleDeleteConfirm
  };
};
