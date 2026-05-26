import React, { useState } from 'react';
import { ProductList } from '@/components/ProductList';
import { ProductAdd } from '@/components/ProductAdd';

const Products: React.FC = () => {
  const [view, setView] = useState<'list' | 'add'>('list');

  return view === 'list' ? (
    <ProductList onAddClick={() => setView('add')} />
  ) : (
    <ProductAdd onBackClick={() => setView('list')} />
  );
};

export default Products;
