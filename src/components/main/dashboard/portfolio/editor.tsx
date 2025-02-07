import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ElementEditor({ element, onUpdate, data }) {
  const renderEditor = () => {
    switch (element.type) {
      case "header":
      case "subheader":
        return (
          <Input
            value={element.content || ""}
            onChange={(e) => onUpdate(e.target.value)}
            placeholder={
              element.type === "header" ? data.profile.name : data.profile.title
            }
          />
        );
      case "paragraph":
        return (
          <Textarea
            value={element.content || ""}
            onChange={(e) => onUpdate(e.target.value)}
            placeholder={data.about}
            rows={5}
          />
        );
      case "image":
        return (
          <Input
            value={element.content || ""}
            onChange={(e) => onUpdate(e.target.value)}
            placeholder="Image URL"
          />
        );
      case "list":
        return (
          <Textarea
            value={element.content ? element.content.join("\n") : ""}
            onChange={(e) => onUpdate(e.target.value.split("\n"))}
            placeholder={data.skills.join("\n")}
            rows={5}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Edit {element.type}</h3>
      {renderEditor()}
    </div>
  );
}
