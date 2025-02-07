import { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export function ColorPicker({ color, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-[220px] justify-start text-left font-normal"
          style={{ backgroundColor: color }}
        >
          <div
            className="w-4 h-4 rounded-full mr-2 border border-gray-200"
            style={{ backgroundColor: color }}
          />
          <span>{color}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-0">
        <input
          type="color"
          value={color}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(false);
          }}
          className="w-full h-[180px] cursor-pointer"
        />
      </PopoverContent>
    </Popover>
  );
}
