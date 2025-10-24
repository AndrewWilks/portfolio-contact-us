import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ children, className = "", ...rest }: CardProps) {
  return (
    <div
      className={`p-3 rounded shadow-sm border-(--border) bg-(--card) ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

export default Card;
