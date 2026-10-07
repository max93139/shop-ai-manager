'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  OrdersHeader,
  OrdersStats,
  OrdersFilters,
  OrdersTable,
  OrderDetailsModal,
} from './mainComponents/orders';
import type { AdminOrder, OrderStatus, OrdersListResponse } from '@shop-ai/types';

export default function Orders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [selectedStatus, setSelectedStatus] = useState<string>('ACTIVE');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [statusCounts, setStatusCounts] = useState({
    all: 0,
    active: 0,
    archive: 0,
    pending: 0,
    processing: 0,
    paid: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  });

  // Modal State
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

      const params = new URLSearchParams();
      if (selectedStatus && selectedStatus !== 'ALL') params.append('status', selectedStatus);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      params.append('page', page.toString());
      params.append('limit', '15');

      const res = await fetch(`${apiUrl}/orders?${params.toString()}`, {
        method: 'GET',
        headers,
        credentials: 'include',
      });

      if (res.ok) {
        const data: OrdersListResponse = await res.json();
        setOrders(data.orders || []);
        setTotalCount(data.totalCount || 0);
        setTotalPages(data.totalPages || 1);
        setStatusCounts(data.statusCounts || {
          all: 0,
          active: 0,
          archive: 0,
          pending: 0,
          processing: 0,
          paid: 0,
          shipped: 0,
          delivered: 0,
          cancelled: 0,
        });
        setTotalRevenue(data.totalRevenue || 0);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedStatus, searchQuery, page]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusTabChange = (statusKey: string) => {
    setSelectedStatus(statusKey);
    setPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleViewOrder = (order: AdminOrder) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const res = await fetch(`${apiUrl}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers,
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        // Update local state instantly
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
        );
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
        await fetchOrders();
      } else {
        alert('Failed to update order status');
      }
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Network error updating status');
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await fetch(`${apiUrl}/orders/${orderId}`, {
        method: 'DELETE',
        headers,
        credentials: 'include',
      });

      if (res.ok) {
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
        await fetchOrders();
      } else {
        alert('Failed to delete order');
      }
    } catch (err) {
      console.error('Error deleting order:', err);
      alert('Network error deleting order');
    }
  };

  const handleExportCSV = () => {
    if (orders.length === 0) {
      alert('No orders available to export.');
      return;
    }

    const headers = ['Order Number', 'Date', 'Customer Name', 'Phone', 'City', 'Post Office', 'Items Count', 'Total ($)', 'Status'];
    const rows = orders.map((o) => [
      o.orderNumber,
      new Date(o.createdAt).toISOString(),
      `"${o.customerName}"`,
      o.phone || '',
      `"${o.city || ''}"`,
      `"${o.postOffice || ''}"`,
      o.itemsCount,
      o.totalAmount.toFixed(2),
      o.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `orders_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-6 p-5 sm:p-7 lg:p-8">
      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onUpdateStatus={handleUpdateStatus}
        onDeleteOrder={handleDeleteOrder}
      />

      {/* Header */}
      <OrdersHeader
        totalOrders={statusCounts.all}
        loading={loading}
        onRefresh={fetchOrders}
        onExport={handleExportCSV}
      />

      {/* Stats Cards */}
      <OrdersStats
        totalRevenue={totalRevenue}
        statusCounts={statusCounts}
        loading={loading}
      />

      {/* Filters & Search */}
      <OrdersFilters
        selectedStatus={selectedStatus}
        onSelectStatus={handleStatusTabChange}
        statusCounts={statusCounts}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />

      {/* Orders Table & Mobile Cards */}
      <OrdersTable
        orders={orders}
        loading={loading}
        page={page}
        totalPages={totalPages}
        totalCount={totalCount}
        onPageChange={(newPage) => setPage(newPage)}
        onViewOrder={handleViewOrder}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}
