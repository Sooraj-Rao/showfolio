import React from "react";
import styled from "styled-components";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const TemplateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const TemplateThumbnail = styled.div`
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;

  &:hover {
    border-color: #007bff;
  }
`;

export default function TemplateSelector({
  templates,
  selectedTemplate,
  onSelectTemplate,
}) {
  return (
    <TemplateGrid>
      {templates.map((template) => (
        <TemplateThumbnail
          key={template.id}
          onClick={() => onSelectTemplate(template)}
        >
          <Image
            src={template.thumbnail}
            alt={template.name}
            className="w-full h-32 object-cover mb-2"
          />
          <Button
            variant={
              selectedTemplate.id === template.id ? "default" : "outline"
            }
          >
            {template.name}
          </Button>
        </TemplateThumbnail>
      ))}
    </TemplateGrid>
  );
}
