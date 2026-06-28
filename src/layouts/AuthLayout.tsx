import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout: React.FC = () => {
  return (
    <div className="auth-grid-bg min-h-screen flex items-center justify-center p-md sm:p-lg text-on-background antialiased">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
