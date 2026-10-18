import React from 'react';

interface PixelCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'gold' | 'runic';
  children: React.ReactNode;
  className?: string;
}

export const PixelCard: React.FC<PixelCardProps> = ({
  variant = 'default',
  children,
  className = '',
  ...props
}) => {
  const variantClass = variant !== 'default' ? `pixel-card--${variant}` : '';
  return (
    <div className={`pixel-card ${variantClass} ${className}`.trim()} {...props}>
      {children}
    </div>
  );
};
