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

export interface RevenueBarData {
  day: string;
  value: number;
  formattedValue: string;
  isHighlight?: boolean;
}

export interface LatestOrderItem {
  id: string;
  orderNumber: string;
  customerName: string;
  totalAmount: string;
  paymentStatus: 'Paid' | 'Pending' | 'Failed';
  fulfillmentStatus: 'Processing' | 'Shipped' | 'Unfulfilled' | 'Delivered';
}

export interface DashboardFullData {
  stats: DashboardOverviewData;
  revenueChart: {
    peakInfo: string;
    bars: RevenueBarData[];
  };
  latestOrders: LatestOrderItem[];
}

export interface AdminOrderItemDetail {
  id: string;
  variantId: string;
  productName: string;
  sku: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  totalAmount: number;
  customerName: string;
  phone?: string;
  city?: string;
  postOffice?: string;
  telegramId?: string;
  items: AdminOrderItemDetail[];
  itemsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrdersListResponse {
  orders: AdminOrder[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
  statusCounts: {
    all: number;
    active: number;
    archive: number;
    pending: number;
    processing: number;
    paid: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
  totalRevenue: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
}

