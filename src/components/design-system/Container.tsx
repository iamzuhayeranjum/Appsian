import React from 'react';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
