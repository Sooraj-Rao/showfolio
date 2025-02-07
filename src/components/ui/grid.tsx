import React from "react";

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={`grid ${className}`} {...props} />;
  }
);

Grid.displayName = "Grid";
