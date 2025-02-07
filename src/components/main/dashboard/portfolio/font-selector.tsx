import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const fontOptions = [
  "Arial",
  "Helvetica",
  "Times New Roman",
  "Courier",
  "Verdana",
  "Georgia",
  "Palatino",
  "Garamond",
  "Bookman",
  "Comic Sans MS",
  "Trebuchet MS",
  "Arial Black",
  "Impact",
];

export function FontSelector({ font, onChange }) {
  return (
    <Select value={font} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a font" />
      </SelectTrigger>
      <SelectContent>
        {fontOptions.map((fontOption) => (
          <SelectItem key={fontOption} value={fontOption}>
            {fontOption}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
