import React from 'react';
import './Skeleton.css';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({
  className,
  width,
  height,
  style,
  ...props
}) => {
  const combinedStyle: React.CSSProperties = {
    width,
    height,
    ...style,
  };

  return (
    <div className={`skeleton ${className || ''}`} style={combinedStyle} {...props} />
  );
};

export default Skeleton;