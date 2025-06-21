'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface Order {
  _id: string;
  customerName: string;
  address: string;
  deliveryTime: string;
  status: string;
}

const DeliveryOrderList = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    try {
        setLoading(true);
        const { data } = await api.get('/orders');
        setOrders(data);
    } catch (err: any) {
        setError(err.response?.data?.msg || 'Failed to fetch orders');
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, status: string) => {
    try {
        await api.put(`/orders/${orderId}`, { status });
        fetchOrders(); // Refresh list
    } catch (err: any) {
        alert('Failed to update status');
    }
  };

  if (loading) return <p>Loading your orders...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (orders.length === 0) return <p>You have no orders assigned.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="py-2 px-4 text-left">Customer</th>
            <th className="py-2 px-4 text-left">Address</th>
            <th className="py-2 px-4 text-left">Delivery Time</th>
            <th className="py-2 px-4 text-left">Status</th>
            <th className="py-2 px-4 text-left">Action</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {orders.map((order) => (
            <tr key={order._id} className="border-b">
              <td className="py-2 px-4">{order.customerName}</td>
              <td className="py-2 px-4">{order.address}</td>
              <td className="py-2 px-4">{new Date(order.deliveryTime).toLocaleString()}</td>
              <td className="py-2 px-4">{order.status}</td>
              <td className="py-2 px-4">
                {order.status === 'out for delivery' && (
                  <button onClick={() => handleStatusChange(order._id, 'completed')} className="bg-green-500 text-white px-3 py-1 rounded-md text-sm">
                    Mark as Completed
                  </button>
                )}
                 {order.status === 'completed' && (
                  <span className="text-green-600 font-semibold">Delivered</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DeliveryOrderList; 