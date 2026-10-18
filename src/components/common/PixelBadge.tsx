import React from 'react';

interface PixelBadgeProps {
  variant?: 'default' | 'gold' | 'cyan' | 'copper' | 'success';
  children: React.ReactNode;
  className?: string;
}

export const PixelBadge: React.FC<PixelBadgeProps> = ({
  variant = 'default',
  children,
  className = '',
}) => {
  const variantClass = variant !== 'default' ? `pixel-badge--${variant}` : '';
  return (
    <span className={`pixel-badge ${variantClass} ${className}`.trim()}>
      {children}
    </span>
  );
};
