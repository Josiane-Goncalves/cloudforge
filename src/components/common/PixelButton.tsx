import React from 'react';

interface PixelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gold' | 'runic' | 'ghost' | 'active' | 'default';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
}

export const PixelButton: React.FC<PixelButtonProps> = ({
  variant = 'default',
  size = 'md',
  type = 'button',
  children,
  className = '',
  ...props
}) => {
  const variantClass = variant !== 'default' ? `pixel-btn--${variant}` : '';
  const sizeClass = size === 'sm' ? 'pixel-btn--sm' : '';

  return (
    <button
      type={type}
      className={`pixel-btn ${variantClass} ${sizeClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
};
