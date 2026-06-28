import React from 'react';
import {
  Briefcase,
  TrendingUp,
  Award,
  ShoppingBag,
  Coins,
  Utensils,
  Car,
  ShoppingCart,
  Tv,
  Receipt,
  HeartPulse,
  GraduationCap,
  HelpCircle,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Calendar,
  Filter,
  Plus,
  Trash2,
  Download,
  Upload,
  FileText,
  Settings,
  X,
  ChevronLeft,
  ChevronRight,
  Search,
  RefreshCw,
  Edit3,
  PieChart,
  BarChart3,
  Info,
  TrendingDown,
  PiggyBank
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Briefcase,
  TrendingUp,
  Award,
  ShoppingBag,
  Coins,
  Utensils,
  Car,
  ShoppingCart,
  Tv,
  Receipt,
  HeartPulse,
  GraduationCap,
  HelpCircle,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Calendar,
  Filter,
  Plus,
  Trash2,
  Download,
  Upload,
  FileText,
  Settings,
  X,
  ChevronLeft,
  ChevronRight,
  Search,
  RefreshCw,
  Edit3,
  PieChart,
  BarChart3,
  Info,
  TrendingDown,
  PiggyBank
};

interface CategoryIconProps {
  name: string;
  className?: string;
  fallback?: React.ComponentType<{ className?: string }>;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  name,
  className = 'w-5 h-5',
  fallback = HelpCircle
}) => {
  const IconComponent = iconMap[name] || fallback;
  return <IconComponent className={className} />;
};

export default CategoryIcon;
