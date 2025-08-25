'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Layout from '@/components/Layout/Layout';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

// Conditional Layout Component to exclude Layout from admin routes
const ConditionalLayout: React.FC<ConditionalLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  
  // Don't apply the main Layout to admin routes
  if (pathname.startsWith('/admin')) {
    return <>{children}</>;
  }
  
  return <Layout>{children}</Layout>;
};

export default ConditionalLayout;