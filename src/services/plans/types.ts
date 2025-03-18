
import { SubscriptionPlan, ApiResponse } from '@/types/api';

// Type for PlanDialog component props
export interface PlanDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentPlan: Partial<SubscriptionPlan> | null;
  setCurrentPlan: React.Dispatch<React.SetStateAction<Partial<SubscriptionPlan> | null>>;
  dialogMode: "add" | "edit";
  onSave: () => void;
  handlePriceChange: (value: string) => void;
  isLoading?: boolean;
  formError?: string | null;
}

// Type for subscriber callback functions
export type SubscriberCallback = () => void;

// Export event system types
export interface PlanEventSystem {
  subscribe: (callback: SubscriberCallback) => () => void;
  notify: () => void;
}
