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
  fullName?: string | null;
  phone?: string | null;
  city?: string | null;
  postOffice?: string | null;
  ttn?: string | null;
  deliveryCityRef?: string | null;
  deliveryWarehouseRef?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface NovaPoshtaSettlement {
  ref: string;
  present: string;
  mainDescription: string;
  area: string;
  region?: string;
  deliveryCityRef: string;
}

export interface NovaPoshtaWarehouse {
  ref: string;
  siteKey: string;
  description: string;
  shortAddress: string;
  number: string;
  typeOfWarehouse?: string;
}

export interface NovaPoshtaTrackingStatus {
  number: string;
  status: string;
  statusCode: string;
  statusDescription: string;
  citySender?: string;
  cityRecipient?: string;
  warehouseRecipient?: string;
  recipientFullName?: string;
  actualDeliveryDate?: string;
  documentCost?: string;
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
  ttn?: string;
  deliveryCityRef?: string;
  deliveryWarehouseRef?: string;
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

export interface AnalyticsTimeframePoint {
  date: string;
  label: string;
  revenue: number;
  orders: number;
}

export interface AnalyticsCategoryShare {
  name: string;
  revenue: number;
  percentage: number;
}

export interface AnalyticsTopProduct {
  id: string;
  name: string;
  category: string;
  salesCount: number;
  revenue: number;
}

export interface AnalyticsCityShare {
  city: string;
  ordersCount: number;
  totalAmount: number;
}

export interface AnalyticsData {
  timeframe: string;
  summary: {
    totalRevenue: number;
    totalOrders: number;
    aov: number;
    conversionRate: number;
    revenueGrowth: number;
    ordersGrowth: number;
  };
  revenueTrend: AnalyticsTimeframePoint[];
  categories: AnalyticsCategoryShare[];
  topProducts: AnalyticsTopProduct[];
  cities: AnalyticsCityShare[];
  statusBreakdown: {
    delivered: number;
    shipped: number;
    processing: number;
    paid: number;
    pending: number;
    cancelled: number;
  };
}

export interface StoreNotification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'inventory' | 'system';
  severity: 'info' | 'warning' | 'success';
  read: boolean;
  timestamp: string;
  actionUrl?: string;
  actionLabel?: string;
}

export interface StoreSettings {
  storeName: string;
  supportPhone: string;
  supportEmail: string;
  currency: string;
  timezone: string;
  telegramChannel: string;
  telegramBotTokenSet: boolean;
  autoPublishNewProducts: boolean;
  telegramAdminId: string;
  lowStockThreshold: number;
  soundAlerts: boolean;
  autoArchiveCompleted: boolean;
  language?: 'uk' | 'en';
}

