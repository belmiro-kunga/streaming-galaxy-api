
import { ReactNode, ElementType } from 'react';
import { UserProfile } from '@/contexts/UserContext';

// Mobile Menu Types
export interface MobileMenuItem {
  icon: ElementType;
  label: string;
  href: string;
}

export interface MobileMenuHeaderProps {
  onClose: () => void;
}

export interface MobileMenuItemsProps {
  menuItems: MobileMenuItem[];
  onClose: () => void;
}

export interface MobileMenuUserSectionProps {
  isAuthenticated: boolean;
  profile: UserProfile | null;
  onLogout: () => Promise<void>;
  onClose: () => void;
}

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

// Navigation Types
export interface NavigationLinksProps {
  items: {
    path: string;
    label: string;
    icon: ReactNode;
  }[];
}

// Profile Dropdown Types
export interface ProfileDropdownProps {
  profile: UserProfile | null;
  onLogout: () => void;
}

// Content Types
export interface GenreFilterProps {
  genres: {
    id: string;
    nome: string;
  }[];
  activeGenres: string[];
  toggleGenre: (genreId: string) => void;
}

export interface ContentRowProps {
  title: string;
  content: any[];
  seeAllLink?: string;
}

// Streaming Service Types
export interface StreamingServiceProps {
  name: string;
  logo: string;
  color: string;
  link: string;
}

// Sidebar Types
export interface CollapsibleSidebarProps {
  className?: string;
}

// Parental Control Types
export interface TimeRestriction {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

export interface TimeRestrictionItemProps {
  dayOfWeekLabel: string;
  startTime: string;
  endTime: string;
  onDelete: () => void;
}

export interface TimeRestrictionsProps {
  timeRestrictions: TimeRestriction[];
  newTimeRestriction: TimeRestriction;
  onTimeRestrictionChange: (field: keyof TimeRestriction, value: string) => void;
  onAddTimeRestriction: () => void;
  onRemoveTimeRestriction: (index: number) => void;
  dayOfWeekOptions: Array<{ value: string; label: string }>;
  getDayOfWeekLabel: (value: string) => string;
}

export interface RatingRestrictionProps {
  maxRating: string;
  onMaxRatingChange: (value: string) => void;
  ratingOptions: Array<{ value: string; label: string }>;
}

export interface ProfileHeaderProps {
  name: string;
  avatar: string;
  enabled: boolean;
  onToggleEnabled: (enabled: boolean) => void;
  profileId: string;
}

// Subscription Types
export interface SubscriptionHeaderProps {}

export interface SubscriptionFooterProps {
  onSubscribe: () => void;
  isLoading: boolean;
  selectedPlan: string | null;
  isLoggedIn: boolean;
}

export interface PlanGridProps {
  plans: any[];
  selectedPlan: string | null;
  onSelectPlan: (planId: string) => void;
  isLoading: boolean;
}
