'use client';

import React from 'react';
import DeliveryOrderList from '@/components/DeliveryOrderList';

const DeliveryDashboardPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Assigned Deliveries</h1>
      <DeliveryOrderList />
    </div>
  );
};

export default DeliveryDashboardPage; 