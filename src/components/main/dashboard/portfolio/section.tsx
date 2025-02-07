import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageSlider } from "./img-slider";

export function PortfolioSection({ section, onUpdate }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const renderSectionContent = () => {
    switch (section.type) {
      case "profile":
        return (
          <div className="space-y-2">
            <Input
              placeholder="Name"
              value={section.content.name}
              onChange={(e) =>
                onUpdate({ ...section.content, name: e.target.value })
              }
            />
            <Input
              placeholder="Title"
              value={section.content.title}
              onChange={(e) =>
                onUpdate({ ...section.content, title: e.target.value })
              }
            />
            <Input
              placeholder="Avatar URL"
              value={section.content.avatar}
              onChange={(e) =>
                onUpdate({ ...section.content, avatar: e.target.value })
              }
            />
            <img
              src={section.content.avatar}
              alt="Avatar"
              className="w-20 h-20 rounded-full"
            />
          </div>
        );
      case "about":
        return (
          <Textarea
            placeholder="About me"
            value={section.content.text}
            onChange={(e) => onUpdate({ text: e.target.value })}
            rows={5}
          />
        );
      case "contact":
        return (
          <div className="space-y-2">
            <Input
              placeholder="Email"
              value={section.content.email}
              onChange={(e) =>
                onUpdate({ ...section.content, email: e.target.value })
              }
            />
            <Input
              placeholder="Phone"
              value={section.content.phone}
              onChange={(e) =>
                onUpdate({ ...section.content, phone: e.target.value })
              }
            />
            <Input
              placeholder="Location"
              value={section.content.location}
              onChange={(e) =>
                onUpdate({ ...section.content, location: e.target.value })
              }
            />
            <div>
              <h4 className="font-bold mb-2">Social Media</h4>
              {section.content.social.map((item, index) => (
                <div key={index} className="flex space-x-2 mb-2">
                  <Input
                    placeholder="Platform"
                    value={item.platform}
                    onChange={(e) => {
                      const newSocial = [...section.content.social];
                      newSocial[index] = { ...item, platform: e.target.value };
                      onUpdate({ ...section.content, social: newSocial });
                    }}
                  />
                  <Input
                    placeholder="URL"
                    value={item.url}
                    onChange={(e) => {
                      const newSocial = [...section.content.social];
                      newSocial[index] = { ...item, url: e.target.value };
                      onUpdate({ ...section.content, social: newSocial });
                    }}
                  />
                </div>
              ))}
              <Button
                onClick={() =>
                  onUpdate({
                    ...section.content,
                    social: [
                      ...section.content.social,
                      { platform: "", url: "" },
                    ],
                  })
                }
              >
                Add Social Media
              </Button>
            </div>
          </div>
        );
      case "experience":
      case "education":
        return (
          <div className="space-y-4">
            {section.content.items.map((item, index) => (
              <Card key={index}>
                <CardContent className="space-y-2">
                  <Input
                    placeholder={
                      section.type === "experience" ? "Company" : "Institution"
                    }
                    value={item.company || item.institution}
                    onChange={(e) => {
                      const newItems = [...section.content.items];
                      newItems[index] = {
                        ...item,
                        [section.type === "experience"
                          ? "company"
                          : "institution"]: e.target.value,
                      };
                      onUpdate({ items: newItems });
                    }}
                  />
                  <Input
                    placeholder={
                      section.type === "experience" ? "Position" : "Degree"
                    }
                    value={item.position || item.degree}
                    onChange={(e) => {
                      const newItems = [...section.content.items];
                      newItems[index] = {
                        ...item,
                        [section.type === "experience" ? "position" : "degree"]:
                          e.target.value,
                      };
                      onUpdate({ items: newItems });
                    }}
                  />
                  <Input
                    placeholder="Duration"
                    value={item.duration}
                    onChange={(e) => {
                      const newItems = [...section.content.items];
                      newItems[index] = { ...item, duration: e.target.value };
                      onUpdate({ items: newItems });
                    }}
                  />
                  <Textarea
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => {
                      const newItems = [...section.content.items];
                      newItems[index] = {
                        ...item,
                        description: e.target.value,
                      };
                      onUpdate({ items: newItems });
                    }}
                  />
                </CardContent>
              </Card>
            ))}
            <Button
              onClick={() =>
                onUpdate({
                  items: [
                    ...section.content.items,
                    {
                      company: "",
                      position: "",
                      duration: "",
                      description: "",
                    },
                  ],
                })
              }
            >
              Add {section.type === "experience" ? "Experience" : "Education"}
            </Button>
          </div>
        );
      case "projects":
        return (
          <div className="space-y-4">
            {section.content.items.map((item, index) => (
              <Card key={index}>
                <CardContent className="space-y-2">
                  <Input
                    placeholder="Project Title"
                    value={item.title}
                    onChange={(e) => {
                      const newItems = [...section.content.items];
                      newItems[index] = { ...item, title: e.target.value };
                      onUpdate({ items: newItems });
                    }}
                  />
                  <Textarea
                    placeholder="Project Description"
                    value={item.description}
                    onChange={(e) => {
                      const newItems = [...section.content.items];
                      newItems[index] = {
                        ...item,
                        description: e.target.value,
                      };
                      onUpdate({ items: newItems });
                    }}
                  />
                  <ImageSlider
                    images={item.images}
                    onImagesChange={(newImages) => {
                      const newItems = [...section.content.items];
                      newItems[index] = { ...item, images: newImages };
                      onUpdate({ items: newItems });
                    }}
                  />
                </CardContent>
              </Card>
            ))}
            <Button
              onClick={() =>
                onUpdate({
                  items: [
                    ...section.content.items,
                    { title: "", description: "", images: [] },
                  ],
                })
              }
            >
              Add Project
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <CardHeader>
        <CardTitle>
          {section.type.charAt(0).toUpperCase() + section.type.slice(1)}
        </CardTitle>
      </CardHeader>
      <CardContent>{renderSectionContent()}</CardContent>
    </Card>
  );
}
