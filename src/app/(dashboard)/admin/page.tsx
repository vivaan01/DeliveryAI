'use client';

import React, { useState, useEffect } from 'react';
import OrderList from '@/components/OrderList';
import OrderModal from '@/components/OrderModal';
import api from '@/lib/api';

interface User {
  _id: string;
  name: string;
}

interface Order {
  _id?: string;
  customerName: string;
  contactNumber: string;
  address: string;
  deliveryTime: string;
  status?: string;
  deliveryPartner?: string;
}

const AdminDashboardPage = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [deliveryPartners, setDeliveryPartners] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingOrder, setEditingOrder] = useState<Order | null>(null);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [ordersRes, partnersRes] = await Promise.all([
                api.get('/orders'),
                api.get('/auth/delivery-partners')
            ]);
            setOrders(ordersRes.data);
            setDeliveryPartners(partnersRes.data);
        } catch (err: any) {
            setError(err.response?.data?.msg || 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleCreate = () => {
        setEditingOrder(null);
        setShowModal(true);
    };

    const handleEdit = (order: Order) => {
        setEditingOrder(order);
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setEditingOrder(null);
    };

    const handleSave = async (orderData: Order) => {
        try {
            if (editingOrder) {
                // Update existing order
                await api.put(`/orders/${editingOrder._id}`, orderData);
            } else {
                // Create new order
                await api.post('/orders', orderData);
            }
            fetchDashboardData(); // Refresh data
            handleClose();
        } catch (err: any) {
            setError(err.response?.data?.msg || 'Failed to save order');
        }
    };
    
    const handleDelete = async (orderId: string) => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            try {
                await api.delete(`/orders/${orderId}`);
                fetchDashboardData(); // Refresh data
            } catch (err: any) {
                setError(err.response?.data?.msg || 'Failed to delete order');
            }
        }
    };

    const handleDispatch = async (orderId: string) => {
        try {
            await api.post(`/orders/${orderId}/dispatch`);
            fetchDashboardData(); // Refresh data
        } catch (err: any) {
            setError(err.response?.data?.msg || 'Failed to dispatch order');
        }
    };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button onClick={handleCreate} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
            Create New Order
        </button>
      </div>
      {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{error}</p>}
      {loading ? (
        <p>Loading dashboard...</p>
      ) : (
        <OrderList 
            orders={orders}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onDispatch={handleDispatch}
        />
      )}
      <OrderModal 
        show={showModal}
        onClose={handleClose}
        onSave={handleSave}
        order={editingOrder}
        deliveryPartners={deliveryPartners}
      />
    </div>
  );
};

export default AdminDashboardPage; 