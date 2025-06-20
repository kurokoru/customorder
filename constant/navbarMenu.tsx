import {
  Home,
  Package,
  ShoppingCart,
  Archive,
  Settings,
  Star,
  ShoppingBasket,
  Wand2,
} from 'lucide-react';
import { NavItem } from '@/types/Navbar';

export const NAVBAR_ITEMS: NavItem[] = [
  {
    title: 'Order Wizard',
    path: '/orders/custom/wizard',
    icon: <Wand2 className="h-4 w-4" />,
  },
  {
    title: 'Records',
    path: '/custom-orders/records',
    icon: <Archive className="h-4 w-4" />,
  }
];
