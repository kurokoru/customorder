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
    title: 'Home',
    path: '/home',
    icon: <Home className="h-4 w-4" />,
  },
  {
    title: 'Orders',
    path: '/orders',
    icon: <ShoppingCart className="h-4 w-4" />,
  },  {
    title: 'Custom Orders',
    path: '/orders/custom',
    icon: <ShoppingBasket className="h-4 w-4" />,
  },
  {
    title: 'Order Wizard',
    path: '/orders/custom/wizard',
    icon: <Wand2 className="h-4 w-4" />,
  },
  {
    title: 'Custom Records',
    path: '/custom-orders/records',
    icon: <Archive className="h-4 w-4" />,
  },
  {
    title: 'Product',
    path: '/product',
    icon: <Package className="h-4 w-4" />,
  },
  {
    title: 'Records',
    path: '/records',
    icon: <Archive className="h-4 w-4" />,
  },
  {
    title: 'Settings',
    path: '/settings',
    icon: <Settings className="h-4 w-4" />,
  },
  {
    title: 'Technologies',
    path: '/technologies',
    icon: <Star className="h-4 w-4" />,
  },
];
