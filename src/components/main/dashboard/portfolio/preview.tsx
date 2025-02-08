import Image from "next/image";
import React from "react";
import styled from "styled-components";

const PreviewContainer = styled.div`
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  padding: 2rem;
  min-height: 800px;
`;

const Element = styled.div`
  margin-bottom: 1rem;
`;

export default function PortfolioPreview({ template, page, data }) {
  const renderElement = (element) => {
    switch (element.type) {
      case "header":
        return <h1 className="text-4xl font-bold">{data.profile.name}</h1>;
      case "subheader":
        return <h2 className="text-2xl">{data.profile.title}</h2>;
      case "paragraph":
        return <p>{element.content || data.about}</p>;
      case "image":
        return (
          <Image
            src={element.content || data.profile.avatar}
            alt="Portfolio"
            className="w-full h-64 object-cover"
          />
        );
      case "list":
        return (
          <ul className="list-disc list-inside">
            {(element.content || data.skills).map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        );
      default:
        return null;
    }
  };

  return (
    <PreviewContainer style={template.style}>
      {page.elements.map((element) => (
        <Element key={element.id}>{renderElement(element)}</Element>
      ))}
    </PreviewContainer>
  );
}
