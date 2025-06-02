import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type TooltipWrapperProps = {
  title: string;
  position?: "top" | "bottom" | "left" | "right";
  children: React.ReactNode;
};

const TooltipWrapper: React.FC<TooltipWrapperProps> = ({
  title,
  position = "top",
  children,
}) => {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={position}>
          <p className="text-sm">{title}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TooltipWrapper;
