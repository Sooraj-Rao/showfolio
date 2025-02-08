// "use client";

// import React, { useState, useRef, useEffect } from "react";
// import { Responsive, WidthProvider } from "react-grid-layout";
// import "react-grid-layout/css/styles.css";
// import "react-resizable/css/styles.css";
// import {
//   ContextMenu,
//   ContextMenuContent,
//   ContextMenuItem,
//   ContextMenuTrigger,
// } from "@/components/ui/context-menu";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Slider } from "@/components/ui/slider";

// const ResponsiveGridLayout = WidthProvider(Responsive);

// // EditableText Component
// const EditableText: React.FC<{
//   value: string;
//   onChange: (value: string) => void;
//   className?: string;
// }> = ({ value, onChange, className }) => {
//   const [isEditing, setIsEditing] = useState(false);
//   const editRef = useRef<HTMLSpanElement>(null);

//   useEffect(() => {
//     if (isEditing && editRef.current) {
//       editRef.current.focus();
//       const range = document.createRange();
//       range.selectNodeContents(editRef.current);
//       const selection = window.getSelection();
//       selection?.removeAllRanges();
//       selection?.addRange(range);
//     }
//   }, [isEditing]);

//   const handleBlur = () => {
//     setIsEditing(false);
//     if (editRef.current) {
//       onChange(editRef.current.innerText);
//     }
//   };

//   return (
//     <span
//       ref={editRef}
//       className={`${className} ${
//         isEditing ? "border-b-2 border-blue-500" : ""
//       }`}
//       onClick={() => setIsEditing(true)}
//       onBlur={handleBlur}
//       contentEditable={isEditing}
//       suppressContentEditableWarning={true}
//     >
//       {value}
//     </span>
//   );
// };

// // DraggableElement Component
// interface DraggableElementProps {
//   children: React.ReactNode;
//   onPositionChange: (x: number, y: number) => void;
// }

// const DraggableElement: React.FC<DraggableElementProps> = ({
//   children,
//   onPositionChange,
// }) => {
//   const [isDragging, setIsDragging] = useState(false);
//   const [position, setPosition] = useState({ x: 0, y: 0 });
//   const ref = useRef<HTMLDivElement>(null);

//   const onMouseDown = (e: React.MouseEvent) => {
//     if (e.target === ref.current) {
//       setIsDragging(true);
//     }
//   };

//   const onMouseMove = (e: React.MouseEvent) => {
//     if (isDragging) {
//       const newX = position.x + e.movementX;
//       const newY = position.y + e.movementY;
//       setPosition({ x: newX, y: newY });
//       onPositionChange(newX, newY);
//     }
//   };

//   const onMouseUp = () => {
//     setIsDragging(false);
//   };

//   return (
//     <div
//       ref={ref}
//       style={{
//         position: "absolute",
//         left: `${position.x}px`,
//         top: `${position.y}px`,
//         cursor: isDragging ? "grabbing" : "grab",
//       }}
//       onMouseDown={onMouseDown}
//       onMouseMove={onMouseMove}
//       onMouseUp={onMouseUp}
//     >
//       {children}
//     </div>
//   );
// };

// // StyleContextMenu Component
// const StyleContextMenu: React.FC<{
//   children: React.ReactNode;
//   onStyleChange: (styles: any) => void;
// }> = ({ children, onStyleChange }) => {
//   return (
//     <ContextMenu>
//       <ContextMenuTrigger>{children}</ContextMenuTrigger>
//       <ContextMenuContent>
//         <ContextMenuItem>
//           <Label>Background Color</Label>
//           <Select
//             onValueChange={(value) => onStyleChange({ backgroundColor: value })}
//           >
//             <SelectTrigger>
//               <SelectValue placeholder="Select color" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="bg-white">White</SelectItem>
//               <SelectItem value="bg-gray-100">Light Gray</SelectItem>
//               <SelectItem value="bg-blue-100">Light Blue</SelectItem>
//               <SelectItem value="bg-green-100">Light Green</SelectItem>
//             </SelectContent>
//           </Select>
//         </ContextMenuItem>
//         <ContextMenuItem>
//           <Label>Text Color</Label>
//           <Select onValueChange={(value) => onStyleChange({ color: value })}>
//             <SelectTrigger>
//               <SelectValue placeholder="Select color" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="text-black">Black</SelectItem>
//               <SelectItem value="text-gray-800">Dark Gray</SelectItem>
//               <SelectItem value="text-blue-800">Blue</SelectItem>
//               <SelectItem value="text-green-800">Green</SelectItem>
//             </SelectContent>
//           </Select>
//         </ContextMenuItem>
//         <ContextMenuItem>
//           <Label>Font Size</Label>
//           <Slider
//             min={12}
//             max={24}
//             step={1}
//             onValueChange={(value) =>
//               onStyleChange({ fontSize: `${value[0]}px` })
//             }
//           />
//         </ContextMenuItem>
//       </ContextMenuContent>
//     </ContextMenu>
//   );
// };

// // Navbar Component
// const Navbar: React.FC<{
//   onStyleChange: (style: string, value: string) => void;
// }> = ({ onStyleChange }) => {
//   return (
//     <nav className="bg-white shadow-md p-4">
//       <div className="flex justify-between items-center">
//         <div>
//           <Select onValueChange={(value) => onStyleChange("fontSize", value)}>
//             <SelectTrigger className="w-[180px]">
//               <SelectValue placeholder="Font Size" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="text-sm">Small</SelectItem>
//               <SelectItem value="text-base">Medium</SelectItem>
//               <SelectItem value="text-lg">Large</SelectItem>
//             </SelectContent>
//           </Select>
//           <Select onValueChange={(value) => onStyleChange("fontColor", value)}>
//             <SelectTrigger className="w-[180px] ml-2">
//               <SelectValue placeholder="Font Color" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="text-gray-800">Dark Gray</SelectItem>
//               <SelectItem value="text-blue-800">Blue</SelectItem>
//               <SelectItem value="text-green-800">Green</SelectItem>
//             </SelectContent>
//           </Select>
//           <Select
//             onValueChange={(value) => onStyleChange("backgroundColor", value)}
//           >
//             <SelectTrigger className="w-[180px] ml-2">
//               <SelectValue placeholder="Background Color" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="bg-gray-100">Light Gray</SelectItem>
//               <SelectItem value="bg-blue-100">Light Blue</SelectItem>
//               <SelectItem value="bg-green-100">Light Green</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//       </div>
//     </nav>
//   );
// };

// // ProfileSection Component
// const ProfileSection: React.FC<{
//   profile: any;
//   onDataChange: (newData: any) => void;
//   globalStyles: any;
//   onStyleChange: (styles: any) => void;
// }> = ({ profile, onDataChange, globalStyles, onStyleChange }) => {
//   const handleChange = (field: string, value: string) => {
//     onDataChange({ ...profile, [field]: value });
//   };

//   const handlePositionChange = (field: string, x: number, y: number) => {
//     console.log(`${field} moved to (${x}, ${y})`);
//   };

//   return (
//     <StyleContextMenu onStyleChange={onStyleChange}>
//       <div className="p-6 relative" style={{ height: "200px" }}>
//         <div className="drag-handle cursor-move font-bold text-xl mb-4 text-gray-700">
//           Profile
//         </div>
//         <div className="flex items-center">
//           <DraggableElement
//             onPositionChange={(x, y) => handlePositionChange("avatar", x, y)}
//           >
//             <img
//               src={profile.avatar}
//               alt={profile.name}
//               className="rounded-full w-24 h-24 object-cover border-4 border-blue-500"
//             />
//           </DraggableElement>
//           <div className="ml-6">
//             <DraggableElement
//               onPositionChange={(x, y) => handlePositionChange("name", x, y)}
//             >
//               <EditableText
//                 value={profile.name}
//                 onChange={(value) => handleChange("name", value)}
//                 className={`text-2xl font-semibold mb-2 ${globalStyles.fontSize} ${globalStyles.fontColor}`}
//               />
//             </DraggableElement>
//             <DraggableElement
//               onPositionChange={(x, y) => handlePositionChange("title", x, y)}
//             >
//               <EditableText
//                 value={profile.title}
//                 onChange={(value) => handleChange("title", value)}
//                 className={`text-lg ${globalStyles.fontSize} ${globalStyles.fontColor}`}
//               />
//             </DraggableElement>
//           </div>
//         </div>
//       </div>
//     </StyleContextMenu>
//   );
// };

// // AboutSection Component
// const AboutSection: React.FC<{
//   about: string;
//   onDataChange: (newData: string) => void;
//   globalStyles: any;
//   onStyleChange: (styles: any) => void;
// }> = ({ about, onDataChange, globalStyles, onStyleChange }) => {
//   const handlePositionChange = (x: number, y: number) => {
//     console.log(`About section moved to (${x}, ${y})`);
//   };

//   return (
//     <StyleContextMenu onStyleChange={onStyleChange}>
//       <div className="p-6 relative" style={{ height: "200px" }}>
//         <div className="drag-handle cursor-move font-bold text-xl mb-4 text-gray-700">
//           About
//         </div>
//         <DraggableElement onPositionChange={handlePositionChange}>
//           <EditableText
//             value={about}
//             onChange={onDataChange}
//             className={`text-gray-600 leading-relaxed ${globalStyles.fontSize} ${globalStyles.fontColor}`}
//           />
//         </DraggableElement>
//       </div>
//     </StyleContextMenu>
//   );
// };

// // ExperienceSection Component
// const ExperienceSection: React.FC<{
//   experience: any[];
//   onDataChange: (newData: any[]) => void;
//   globalStyles: any;
//   onStyleChange: (styles: any) => void;
// }> = ({ experience, onDataChange, globalStyles, onStyleChange }) => {
//   const handleExperienceChange = (
//     index: number,
//     field: string,
//     value: string
//   ) => {
//     const updatedExperience = [...experience];
//     updatedExperience[index] = { ...updatedExperience[index], [field]: value };
//     onDataChange(updatedExperience);
//   };

//   const handlePositionChange = (index: number, x: number, y: number) => {
//     console.log(`Experience ${index} moved to (${x}, ${y})`);
//   };

//   return (
//     <StyleContextMenu onStyleChange={onStyleChange}>
//       <div className="p-6 relative" style={{ height: "200px" }}>
//         <div className="drag-handle cursor-move font-bold text-xl mb-4 text-gray-700">
//           Experience
//         </div>
//         {experience.map((exp, index) => (
//           <DraggableElement
//             key={index}
//             onPositionChange={(x, y) => handlePositionChange(index, x, y)}
//           >
//             <div className="mb-4 last:mb-0">
//               <EditableText
//                 value={exp.position}
//                 onChange={(value) =>
//                   handleExperienceChange(index, "position", value)
//                 }
//                 className={`font-semibold text-lg ${globalStyles.fontSize} ${globalStyles.fontColor}`}
//               />
//               <EditableText
//                 value={exp.company}
//                 onChange={(value) =>
//                   handleExperienceChange(index, "company", value)
//                 }
//                 className={`text-blue-600 ${globalStyles.fontSize}`}
//               />
//               <EditableText
//                 value={exp.duration}
//                 onChange={(value) =>
//                   handleExperienceChange(index, "duration", value)
//                 }
//                 className={`text-sm text-gray-600 ${globalStyles.fontSize}`}
//               />
//               <EditableText
//                 value={exp.description}
//                 onChange={(value) =>
//                   handleExperienceChange(index, "description", value)
//                 }
//                 className={`mt-2 text-gray-700 ${globalStyles.fontSize}`}
//               />
//             </div>
//           </DraggableElement>
//         ))}
//       </div>
//     </StyleContextMenu>
//   );
// };

// // ProjectsSection Component
// const ProjectsSection: React.FC<{
//   projects: any[];
//   onDataChange: (newData: any[]) => void;
//   globalStyles: any;
//   onStyleChange: (styles: any) => void;
// }> = ({ projects, onDataChange, globalStyles, onStyleChange }) => {
//   const handleProjectChange = (index: number, field: string, value: string) => {
//     const updatedProjects = [...projects];
//     updatedProjects[index] = { ...updatedProjects[index], [field]: value };
//     onDataChange(updatedProjects);
//   };

//   const handlePositionChange = (index: number, x: number, y: number) => {
//     console.log(`Project ${index} moved to (${x}, ${y})`);
//   };

//   return (
//     <StyleContextMenu onStyleChange={onStyleChange}>
//       <div className="p-6 relative" style={{ height: "200px" }}>
//         <div className="drag-handle cursor-move font-bold text-xl mb-4 text-gray-700">
//           Projects
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {projects.map((project, index) => (
//             <DraggableElement
//               key={index}
//               onPositionChange={(x, y) => handlePositionChange(index, x, y)}
//             >
//               <div className="bg-gray-50 rounded-lg p-4">
//                 <EditableText
//                   value={project.title}
//                   onChange={(value) =>
//                     handleProjectChange(index, "title", value)
//                   }
//                   className={`font-semibold text-lg mb-2 ${globalStyles.fontSize} ${globalStyles.fontColor}`}
//                 />
//                 <EditableText
//                   value={project.description}
//                   onChange={(value) =>
//                     handleProjectChange(index, "description", value)
//                   }
//                   className={`text-gray-600 mb-2 ${globalStyles.fontSize}`}
//                 />
//                 <img
//                   src={project.image}
//                   alt={project.title}
//                   className="rounded-lg w-full h-48 object-cover"
//                 />
//               </div>
//             </DraggableElement>
//           ))}
//         </div>
//       </div>
//     </StyleContextMenu>
//   );
// };

// // EducationSection Component
// const EducationSection: React.FC<{
//   education: any[];
//   onDataChange: (newData: any[]) => void;
//   globalStyles: any;
//   onStyleChange: (styles: any) => void;
// }> = ({ education, onDataChange, globalStyles, onStyleChange }) => {
//   const handleEducationChange = (
//     index: number,
//     field: string,
//     value: string
//   ) => {
//     const updatedEducation = [...education];
//     updatedEducation[index] = { ...updatedEducation[index], [field]: value };
//     onDataChange(updatedEducation);
//   };

//   const handlePositionChange = (index: number, x: number, y: number) => {
//     console.log(`Education ${index} moved to (${x}, ${y})`);
//   };

//   return (
//     <StyleContextMenu onStyleChange={onStyleChange}>
//       <div className="p-6 relative" style={{ height: "200px" }}>
//         <div className="drag-handle cursor-move font-bold text-xl mb-4 text-gray-700">
//           Education
//         </div>
//         {education.map((edu, index) => (
//           <DraggableElement
//             key={index}
//             onPositionChange={(x, y) => handlePositionChange(index, x, y)}
//           >
//             <div className="mb-4 last:mb-0">
//               <EditableText
//                 value={edu.degree}
//                 onChange={(value) =>
//                   handleEducationChange(index, "degree", value)
//                 }
//                 className={`font-semibold text-lg ${globalStyles.fontSize} ${globalStyles.fontColor}`}
//               />
//               <EditableText
//                 value={edu.institution}
//                 onChange={(value) =>
//                   handleEducationChange(index, "institution", value)
//                 }
//                 className={`text-blue-600 ${globalStyles.fontSize}`}
//               />
//               <EditableText
//                 value={edu.duration}
//                 onChange={(value) =>
//                   handleEducationChange(index, "duration", value)
//                 }
//                 className={`text-sm text-gray-600 ${globalStyles.fontSize}`}
//               />
//               <EditableText
//                 value={edu.description}
//                 onChange={(value) =>
//                   handleEducationChange(index, "description", value)
//                 }
//                 className={`mt-2 text-gray-700 ${globalStyles.fontSize}`}
//               />
//             </div>
//           </DraggableElement>
//         ))}
//       </div>
//     </StyleContextMenu>
//   );
// };

// // SkillsSection Component
// const SkillsSection: React.FC<{
//   skills: string[];
//   onDataChange: (newData: string[]) => void;
//   globalStyles: any;
//   onStyleChange: (styles: any) => void;
// }> = ({ skills, onDataChange, globalStyles, onStyleChange }) => {
//   const handleSkillChange = (index: number, value: string) => {
//     const updatedSkills = [...skills];
//     updatedSkills[index] = value;
//     onDataChange(updatedSkills);
//   };

//   const handlePositionChange = (index: number, x: number, y: number) => {
//     console.log(`Skill ${index} moved to (${x}, ${y})`);
//   };

//   return (
//     <StyleContextMenu onStyleChange={onStyleChange}>
//       <div className="p-6 relative" style={{ height: "200px" }}>
//         <div className="drag-handle cursor-move font-bold text-xl mb-4 text-gray-700">
//           Skills
//         </div>
//         <div className="flex flex-wrap gap-2">
//           {skills.map((skill, index) => (
//             <DraggableElement
//               key={index}
//               onPositionChange={(x, y) => handlePositionChange(index, x, y)}
//             >
//               <EditableText
//                 value={skill}
//                 onChange={(value) => handleSkillChange(index, value)}
//                 className={`bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm ${globalStyles.fontSize}`}
//               />
//             </DraggableElement>
//           ))}
//         </div>
//       </div>
//     </StyleContextMenu>
//   );
// };

// // ContactSection Component
// const ContactSection: React.FC<{
//   contact: any;
//   onDataChange: (newData: any) => void;
//   globalStyles: any;
//   onStyleChange: (styles: any) => void;
// }> = ({ contact, onDataChange, globalStyles, onStyleChange }) => {
//   const handleContactChange = (field: string, value: string) => {
//     onDataChange({ ...contact, [field]: value });
//   };

//   const handleSocialChange = (index: number, field: string, value: string) => {
//     const updatedSocial = [...contact.social];
//     updatedSocial[index] = { ...updatedSocial[index], [field]: value };
//     onDataChange({ ...contact, social: updatedSocial });
//   };

//   const handlePositionChange = (field: string, x: number, y: number) => {
//     console.log(`${field} moved to (${x}, ${y})`);
//   };

//   return (
//     <StyleContextMenu onStyleChange={onStyleChange}>
//       <div className="p-6 relative" style={{ height: "200px" }}>
//         <div className="drag-handle cursor-move font-bold text-xl mb-4 text-gray-700">
//           Contact
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <DraggableElement
//               onPositionChange={(x, y) => handlePositionChange("email", x, y)}
//             >
//               <p className={`text-gray-600 ${globalStyles.fontSize}`}>
//                 <span className="font-semibold">Email:</span>{" "}
//                 <EditableText
//                   value={contact.email}
//                   onChange={(value) => handleContactChange("email", value)}
//                   className={globalStyles.fontSize}
//                 />
//               </p>
//             </DraggableElement>
//             <DraggableElement
//               onPositionChange={(x, y) => handlePositionChange("phone", x, y)}
//             >
//               <p className={`text-gray-600 ${globalStyles.fontSize}`}>
//                 <span className="font-semibold">Phone:</span>{" "}
//                 <EditableText
//                   value={contact.phone}
//                   onChange={(value) => handleContactChange("phone", value)}
//                   className={globalStyles.fontSize}
//                 />
//               </p>
//             </DraggableElement>
//             <DraggableElement
//               onPositionChange={(x, y) =>
//                 handlePositionChange("location", x, y)
//               }
//             >
//               <p className={`text-gray-600 ${globalStyles.fontSize}`}>
//                 <span className="font-semibold">Location:</span>{" "}
//                 <EditableText
//                   value={contact.location}
//                   onChange={(value) => handleContactChange("location", value)}
//                   className={globalStyles.fontSize}
//                 />
//               </p>
//             </DraggableElement>
//           </div>
//           <div>
//             <p className={`font-semibold mb-2 ${globalStyles.fontSize}`}>
//               Social Media:
//             </p>
//             <div className="flex flex-wrap gap-2">
//               {contact.social.map((social, index) => (
//                 <DraggableElement
//                   key={index}
//                   onPositionChange={(x, y) =>
//                     handlePositionChange(`social-${index}`, x, y)
//                   }
//                 >
//                   <div className="flex items-center">
//                     <EditableText
//                       value={social.platform}
//                       onChange={(value) =>
//                         handleSocialChange(index, "platform", value)
//                       }
//                       className={`bg-gray-200 text-gray-800 px-3 py-1 rounded-l-full text-sm ${globalStyles.fontSize}`}
//                     />
//                     <EditableText
//                       value={social.url}
//                       onChange={(value) =>
//                         handleSocialChange(index, "url", value)
//                       }
//                       className={`bg-gray-300 text-gray-800 px-3 py-1 rounded-r-full text-sm ${globalStyles.fontSize}`}
//                     />
//                   </div>
//                 </DraggableElement>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </StyleContextMenu>
//   );
// };

// // Main PortfolioPage Component
// const PortfolioPage: React.FC = () => {
//   const [layouts, setLayouts] = useState(null);
//   const [portfolioData, setPortfolioData] = useState({
//     profile: {
//       name: "John Doe",
//       title: "Software Developer",
//       avatar: "",
//     },
//     about:
//       "I am a passionate software developer with experience in web technologies.",
//     experience: [
//       {
//         position: "Senior Developer",
//         company: "Tech Co",
//         duration: "2020 - Present",
//         description: "Leading development of web applications.",
//       },
//     ],
//     projects: [
//       {
//         title: "Project A",
//         description: "A web application for task management.",
//         image: "",
//       },
//     ],
//     education: [
//       {
//         degree: "Bachelor of Science in Computer Science",
//         institution: "University of Technology",
//         duration: "2016 - 2020",
//         description: "Focused on software engineering and web technologies.",
//       },
//     ],
//     skills: ["JavaScript", "React", "Node.js", "Python"],
//     contact: {
//       email: "john.doe@example.com",
//       phone: "+1 234 567 8900",
//       location: "New York, NY",
//       social: [
//         { platform: "LinkedIn", url: "https://linkedin.com/in/johndoe" },
//         { platform: "GitHub", url: "https://github.com/johndoe" },
//       ],
//     },
//   });
//   const [globalStyles, setGlobalStyles] = useState({
//     fontSize: "text-base",
//     fontColor: "text-gray-800",
//     backgroundColor: "bg-gray-100",
//   });

//   useEffect(() => {
//     const savedLayouts = localStorage.getItem("portfolioLayouts");
//     if (savedLayouts) {
//       setLayouts(JSON.parse(savedLayouts));
//     }
//     const savedData = localStorage.getItem("portfolioData");
//     if (savedData) {
//       setPortfolioData(JSON.parse(savedData));
//     }
//   }, []);

//   const onLayoutChange = (layout, layouts) => {
//     localStorage.setItem("portfolioLayouts", JSON.stringify(layouts));
//     setLayouts(layouts);
//   };

//   const handleDataChange = (section, newData) => {
//     const updatedData = { ...portfolioData, [section]: newData };
//     setPortfolioData(updatedData);
//     localStorage.setItem("portfolioData", JSON.stringify(updatedData));
//   };

//   const handleGlobalStyleChange = (style, value) => {
//     setGlobalStyles((prev) => ({ ...prev, [style]: value }));
//   };

//   const handleSectionStyleChange = (section, styles) => {
//     const updatedData = { ...portfolioData };
//     updatedData[section].styles = { ...updatedData[section].styles, ...styles };
//     setPortfolioData(updatedData);
//     localStorage.setItem("portfolioData", JSON.stringify(updatedData));
//   };

//   const generateLayout = () => {
//     return {
//       lg: [
//         { i: "profile", x: 0, y: 0, w: 12, h: 4, minH: 4, maxH: 6 },
//         { i: "about", x: 0, y: 4, w: 6, h: 4, minH: 3, maxH: 8 },
//         { i: "experience", x: 6, y: 4, w: 6, h: 6, minH: 4 },
//         { i: "projects", x: 0, y: 10, w: 12, h: 8, minH: 6 },
//         { i: "education", x: 0, y: 18, w: 6, h: 5, minH: 3 },
//         { i: "skills", x: 6, y: 18, w: 6, h: 5, minH: 3 },
//         { i: "contact", x: 0, y: 23, w: 12, h: 4, minH: 3, maxH: 6 },
//       ],
//       md: [
//         { i: "profile", x: 0, y: 0, w: 10, h: 4, minH: 4, maxH: 6 },
//         { i: "about", x: 0, y: 4, w: 5, h: 4, minH: 3, maxH: 8 },
//         { i: "experience", x: 5, y: 4, w: 5, h: 6, minH: 4 },
//         { i: "projects", x: 0, y: 10, w: 10, h: 8, minH: 6 },
//         { i: "education", x: 0, y: 18, w: 5, h: 5, minH: 3 },
//         { i: "skills", x: 5, y: 18, w: 5, h: 5, minH: 3 },
//         { i: "contact", x: 0, y: 23, w: 10, h: 4, minH: 3, maxH: 6 },
//       ],
//       sm: [
//         { i: "profile", x: 0, y: 0, w: 6, h: 4, minH: 4, maxH: 6 },
//         { i: "about", x: 0, y: 4, w: 6, h: 4, minH: 3, maxH: 8 },
//         { i: "experience", x: 0, y: 8, w: 6, h: 6, minH: 4 },
//         { i: "projects", x: 0, y: 14, w: 6, h: 8, minH: 6 },
//         { i: "education", x: 0, y: 22, w: 6, h: 5, minH: 3 },
//         { i: "skills", x: 0, y: 27, w: 6, h: 5, minH: 3 },
//         { i: "contact", x: 0, y: 32, w: 6, h: 4, minH: 3, maxH: 6 },
//       ],
//     };
//   };

//   return (
//     <div className={`min-h-screen p-4 ${globalStyles.backgroundColor}`}>
//       <Navbar onStyleChange={handleGlobalStyleChange} />
//       <h1
//         className={`text-center text-4xl font-bold my-8 ${globalStyles.fontColor}`}
//       >
//         My Portfolio
//       </h1>
//       <ResponsiveGridLayout
//         className="layout"
//         layouts={layouts || generateLayout()}
//         breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
//         cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
//         rowHeight={30}
//         onLayoutChange={onLayoutChange}
//         draggableHandle=".drag-handle"
//       >
//         <div
//           key="profile"
//           className="bg-white rounded-lg shadow-lg overflow-hidden"
//         >
//           <ProfileSection
//             profile={portfolioData.profile}
//             onDataChange={(newData) => handleDataChange("profile", newData)}
//             globalStyles={globalStyles}
//             onStyleChange={(styles) =>
//               handleSectionStyleChange("profile", styles)
//             }
//           />
//         </div>
//         <div
//           key="about"
//           className="bg-white rounded-lg shadow-lg overflow-hidden"
//         >
//           <AboutSection
//             about={portfolioData.about}
//             onDataChange={(newData) => handleDataChange("about", newData)}
//             globalStyles={globalStyles}
//             onStyleChange={(styles) =>
//               handleSectionStyleChange("about", styles)
//             }
//           />
//         </div>
//         <div
//           key="experience"
//           className="bg-white rounded-lg shadow-lg overflow-hidden"
//         >
//           <ExperienceSection
//             experience={portfolioData.experience}
//             onDataChange={(newData) => handleDataChange("experience", newData)}
//             globalStyles={globalStyles}
//             onStyleChange={(styles) =>
//               handleSectionStyleChange("experience", styles)
//             }
//           />
//         </div>
//         <div
//           key="projects"
//           className="bg-white rounded-lg shadow-lg overflow-hidden"
//         >
//           <ProjectsSection
//             projects={portfolioData.projects}
//             onDataChange={(newData) => handleDataChange("projects", newData)}
//             globalStyles={globalStyles}
//             onStyleChange={(styles) =>
//               handleSectionStyleChange("projects", styles)
//             }
//           />
//         </div>
//         <div
//           key="education"
//           className="bg-white rounded-lg shadow-lg overflow-hidden"
//         >
//           <EducationSection
//             education={portfolioData.education}
//             onDataChange={(newData) => handleDataChange("education", newData)}
//             globalStyles={globalStyles}
//             onStyleChange={(styles) =>
//               handleSectionStyleChange("education", styles)
//             }
//           />
//         </div>
//         <div
//           key="skills"
//           className="bg-white rounded-lg shadow-lg overflow-hidden"
//         >
//           <SkillsSection
//             skills={portfolioData.skills}
//             onDataChange={(newData) => handleDataChange("skills", newData)}
//             globalStyles={globalStyles}
//             onStyleChange={(styles) =>
//               handleSectionStyleChange("skills", styles)
//             }
//           />
//         </div>
//         <div
//           key="contact"
//           className="bg-white rounded-lg shadow-lg overflow-hidden"
//         >
//           <ContactSection
//             contact={portfolioData.contact}
//             onDataChange={(newData) => handleDataChange("contact", newData)}
//             globalStyles={globalStyles}
//             onStyleChange={(styles) =>
//               handleSectionStyleChange("contact", styles)
//             }
//           />
//         </div>
//       </ResponsiveGridLayout>
//     </div>
//   );
// };

// export default PortfolioPage;
