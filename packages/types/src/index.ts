export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  CUSTOMER = 'CUSTOMER',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export interface UserProfile {
  id: string;
  email?: string | null;
  name: string;
  role: UserRole;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface ProductVariant {
  id: string;
  size: string;
  color: string;
  price: number;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  variants: ProductVariant[];
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  totalAmount: number;
}

export interface DashboardStatMetric {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  timeframe: string;
}

export interface DashboardOverviewData {
  todaySales: DashboardStatMetric;
  revenue30d: DashboardStatMetric;
  orders: DashboardStatMetric;
  newCustomers: DashboardStatMetric;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
}
