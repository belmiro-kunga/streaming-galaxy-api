
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import PlanCard from './subscription/PlanCard';
import PlanDialog from './subscription/PlanDialog';
import DeleteConfirmationDialog from './subscription/DeleteConfirmationDialog';
import EmptyPlansState from './subscription/EmptyPlansState';
import LoadingSpinner from './subscription/LoadingSpinner';
import { usePlanManagement } from './subscription/usePlanManagement';

const SubscriptionPlansManager: React.FC = () => {
  const {
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
    addPlan,
    editPlan,
    deletePlan,
    togglePlanStatus,
    handleSavePlan,
    handlePriceChange,
    handleDeleteConfirm
  } = usePlanManagement();
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Planos de Assinatura</h2>
        <Button 
          onClick={addPlan} 
          className="flex items-center gap-2 bg-primary hover:bg-primary/90"
          disabled={isLoading}
        >
          <Plus size={16} />
          <span>Adicionar Plano</span>
        </Button>
      </div>
      
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onEdit={editPlan}
              onDelete={deletePlan}
              onToggleStatus={togglePlanStatus}
            />
          ))}
        </div>
      )}
      
      {plans.length === 0 && !isLoading && (
        <EmptyPlansState onAddPlan={addPlan} />
      )}
      
      <PlanDialog
        isOpen={isPlanDialogOpen}
        onOpenChange={setIsPlanDialogOpen}
        currentPlan={currentPlan}
        setCurrentPlan={setCurrentPlan}
        dialogMode={dialogMode}
        onSave={handleSavePlan}
        handlePriceChange={handlePriceChange}
        isLoading={isLoading}
      />
      
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        planToDelete={planToDelete}
        onConfirm={handleDeleteConfirm}
        isLoading={isLoading}
      />
    </div>
  );
};

export default SubscriptionPlansManager;
