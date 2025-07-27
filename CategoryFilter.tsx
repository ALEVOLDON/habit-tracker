import React from 'react';
import { Category } from '../../services/api';
import Skeleton from '../ui/Skeleton/Skeleton';

interface CategoryFilterProps {
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  categories: Category[] | null;
  isLoading: boolean;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ selectedCategory, onSelectCategory, categories, isLoading }) => {

  if (isLoading) {
    return (
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        <Skeleton width={80} height={32} style={{ borderRadius: '16px' }} />
        <Skeleton width={100} height={32} style={{ borderRadius: '16px' }} />
        <Skeleton width={90} height={32} style={{ borderRadius: '16px' }} />
      </div>
    );
  }

  const buttonStyle = (isActive: boolean) => ({
    padding: '6px 12px',
    cursor: 'pointer',
    border: '1px solid #d1d5db',
    borderRadius: '16px',
    backgroundColor: isActive ? '#3b82f6' : '#fff',
    color: isActive ? '#fff' : '#374151',
    transition: 'background-color 0.2s, color 0.2s',
  });

  return (
    <div style={{ marginBottom: '24px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <button onClick={() => onSelectCategory(null)} style={buttonStyle(selectedCategory === null)}>
        Все
      </button>
      {categories?.map((cat) => (
        <button key={cat._id} onClick={() => onSelectCategory(cat._id)} style={buttonStyle(selectedCategory === cat._id)}>
          {cat.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;