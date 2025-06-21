'use client';

import { useState, useEffect } from 'react';

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
  deliveryPartner?: string;
}

interface OrderModalProps {
  show: boolean;
  onClose: () => void;
  onSave: (order: Order) => void;
  order?: Order | null;
  deliveryPartners: User[];
}

const OrderModal = ({ show, onClose, onSave, order, deliveryPartners }: OrderModalProps) => {
  const [formData, setFormData] = useState<Order>({
    customerName: '',
    contactNumber: '',
    address: '',
    deliveryTime: '',
    deliveryPartner: '',
  });

  useEffect(() => {
    if (order) {
      setFormData({
        ...order,
        deliveryTime: new Date(order.deliveryTime).toISOString().slice(0, 16),
      });
    } else {
      setFormData({
        customerName: '',
        contactNumber: '',
        address: '',
        deliveryTime: '',
        deliveryPartner: '',
      });
    }
  }, [order]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="p-8 border w-96 shadow-lg rounded-md bg-white">
        <h2 className="text-xl font-semibold mb-4">{order ? 'Edit Order' : 'Create New Order'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input type="text" name="customerName" value={formData.customerName} onChange={handleChange} placeholder="Customer Name" required className="w-full px-3 py-2 border rounded-md" />
            <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleChange} placeholder="Contact Number" required className="w-full px-3 py-2 border rounded-md" />
            <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" required className="w-full px-3 py-2 border rounded-md" />
            <input type="datetime-local" name="deliveryTime" value={formData.deliveryTime} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />
            <select name="deliveryPartner" value={formData.deliveryPartner} onChange={handleChange} className="w-full px-3 py-2 border rounded-md">
              <option value="">Assign Delivery Partner</option>
              {deliveryPartners.map(partner => (
                <option key={partner._id} value={partner._id}>{partner.name}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end mt-6">
            <button type="button" onClick={onClose} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md mr-2 hover:bg-gray-400">Cancel</button>
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderModal; 