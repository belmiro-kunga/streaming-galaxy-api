
import { User } from '../types';

export interface UserDialogState {
  isUserDialogOpen: boolean;
  dialogMode: "add" | "edit";
  currentUser: User | null;
}

export interface UserDeleteState {
  isDeleteDialogOpen: boolean;
  userToDelete: User | null;
}

export interface UserSubscriptionState {
  isSubscriptionDialogOpen: boolean;
  selectedSubscription: string;
}
