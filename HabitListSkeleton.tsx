import React from 'react';
import Skeleton from '../ui/Skeleton/Skeleton';

const HabitItemSkeleton = () => (
  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', padding: '8px', backgroundColor: '#fff', borderRadius: '8px' }}>
    <Skeleton width={24} height={24} style={{ marginRight: '12px', borderRadius: '4px' }} />
    <Skeleton width="80%" height={20} />
  </div>
);

const HabitListSkeleton = ({ count = 4 }: { count?: number }) => {
  return (
    <div>
      <Skeleton width="40%" height={32} style={{ marginBottom: '24px' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {Array.from({ length: count }).map((_, index) => (
          <HabitItemSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};

export default HabitListSkeleton;