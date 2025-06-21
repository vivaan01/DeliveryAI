'use client';

import React from 'react';

interface Order {
  _id: string;
  customerName: string;
  contactNumber: string;
  address: string;
  deliveryTime: string;
  status: string;
  deliveryPartner?: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

interface OrderListProps {
  orders: Order[];
  onEdit: (order: Order) => void;
  onDelete: (orderId: string) => void;
  onDispatch: (orderId: string) => void;
}

const OrderList = ({ orders, onEdit, onDelete, onDispatch }: OrderListProps) => {
  if (orders.length === 0) {
    return <p>No orders found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="py-2 px-4 text-left">Order ID</th>
            <th className="py-2 px-4 text-left">Customer</th>
            <th className="py-2 px-4 text-left">Contact</th>
            <th className="py-2 px-4 text-left">Address</th>
            <th className="py-2 px-4 text-left">Delivery Time</th>
            <th className="py-2 px-4 text-left">Status</th>
            <th className="py-2 px-4 text-left">Partner</th>
            <th className="py-2 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {orders.map((order) => (
            <tr key={order._id} className="border-b">
              <td className="py-2 px-4">{order._id.slice(-6)}</td>
              <td className="py-2 px-4">{order.customerName}</td>
              <td className="py-2 px-4">{order.contactNumber}</td>
              <td className="py-2 px-4">{order.address}</td>
              <td className="py-2 px-4">{new Date(order.deliveryTime).toLocaleString()}</td>
              <td className="py-2 px-4">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  order.status === 'completed' ? 'bg-green-100 text-green-800' :
                  order.status === 'out for delivery' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {order.status}
                </span>
              </td>
              <td className="py-2 px-4">{order.deliveryPartner?.name || 'N/A'}</td>
              <td className="py-2 px-4">
                <button onClick={() => onEdit(order)} className="text-indigo-600 hover:text-indigo-900 font-medium">Edit</button>
                <button onClick={() => onDelete(order._id)} className="text-red-600 hover:text-red-900 font-medium ml-4">Delete</button>
                {order.status !== 'out for delivery' && order.status !== 'completed' && order.status !== 'cancelled' && (
                    <button onClick={() => onDispatch(order._id)} className="text-blue-600 hover:text-blue-900 font-medium ml-4">Dispatch</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderList; 