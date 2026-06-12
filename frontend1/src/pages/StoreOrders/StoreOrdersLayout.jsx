import React from 'react';
import { Outlet } from 'react-router-dom';

const StoreOrdersLayout = () => {
  return (
    <div className="w-full max-w-[1400px] mx-auto pb-24 font-sans text-zinc-900 animate-in fade-in duration-500">
      <Outlet />
    </div>
  );
};

export default StoreOrdersLayout;
