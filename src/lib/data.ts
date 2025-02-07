export const dummyData = {
  profile: {
    name: "John Doe",
    title: "Full Stack Developer",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  about: "I'm a passionate full stack developer with 5 years of experience in creating web applications. I love turning complex problems into simple, beautiful, and intuitive designs. When I'm not coding, you can find me exploring new technologies or contributing to open-source projects.",
  contact: {
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    social: [
      { platform: "LinkedIn", url: "https://linkedin.com/in/johndoe" },
      { platform: "GitHub", url: "https://github.com/johndoe" },
      { platform: "Twitter", url: "https://twitter.com/johndoe" },
    ],
  },
  experience: [
    {
      position: "Senior Full Stack Developer",
      company: "Tech Innovators Inc.",
      duration: "2019 - Present",
      description: "Lead development of scalable web applications using React, Node.js, and AWS. Mentor junior developers and implement best practices for code quality and performance.",
    },
    {
      position: "Full Stack Developer",
      company: "WebSolutions LLC",
      duration: "2016 - 2019",
      description: "Developed and maintained various client websites and web applications. Collaborated with design team to implement responsive and accessible user interfaces.",
    },
  ],
  education: [
    {
      degree: "Master of Science in Computer Science",
      institution: "Stanford University",
      duration: "2014 - 2016",
      description: "Specialized in Artificial Intelligence and Machine Learning. Completed thesis on 'Deep Learning Approaches for Natural Language Processing'.",
    },
    {
      degree: "Bachelor of Science in Computer Engineering",
      institution: "MIT",
      duration: "2010 - 2014",
      description: "Graduated with honors. Participated in various hackathons and coding competitions.",
    },
  ],
  skills: [
    "JavaScript", "React", "Node.js", "Python", "Django", "AWS", "Docker", "GraphQL",
    "MongoDB", "PostgreSQL", "Machine Learning", "CI/CD", "Agile Methodologies"
  ],
  projects: [
    {
      title: "AI-Powered Task Manager",
      description: "Developed a task management application that uses machine learning to prioritize and categorize tasks automatically.",
      image: "https://picsum.photos/id/3/600/400",
    },
    {
      title: "E-commerce Platform",
      description: "Built a scalable e-commerce platform with real-time inventory management and personalized product recommendations.",
      image: "https://picsum.photos/id/20/600/400",
    },
    {
      title: "Blockchain Voting System",
      description: "Created a secure and transparent voting system using blockchain technology for small to medium-sized organizations.",
      image: "https://picsum.photos/id/60/600/400",
    },
  ],
};



export const templates = [
  {
    id: "modern",
    name: "Modern",
    thumbnail: "https://placekitten.com/300/200",
    style: {
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#ffffff",
      color: "#333333",
    },
    pages: [
      {
        name: "Home",
        elements: [
          { id: "header1", type: "header", content: "" },
          { id: "subheader1", type: "subheader", content: "" },
          { id: "image1", type: "image", content: "" },
          { id: "paragraph1", type: "paragraph", content: "" },
        ],
      },
      {
        name: "About",
        elements: [
          { id: "header2", type: "header", content: "About Me" },
          { id: "paragraph2", type: "paragraph", content: "" },
          { id: "list1", type: "list", content: [] },
        ],
      },
      {
        name: "Experience",
        elements: [
          { id: "header3", type: "header", content: "Experience" },
          { id: "paragraph3", type: "paragraph", content: "" },
        ],
      },
      {
        name: "Projects",
        elements: [
          { id: "header4", type: "header", content: "Projects" },
          { id: "image2", type: "image", content: "" },
          { id: "paragraph4", type: "paragraph", content: "" },
        ],
      },
      {
        name: "Contact",
        elements: [
          { id: "header5", type: "header", content: "Contact" },
          { id: "paragraph5", type: "paragraph", content: "" },
        ],
      },
    ],
  },
  {
    id: "minimal",
    name: "Minimal",
    thumbnail: "https://placekitten.com/301/200",
    style: {
      fontFamily: "Helvetica, sans-serif",
      backgroundColor: "#f0f0f0",
      color: "#000000",
    },
    pages: [
      {
        name: "Home",
        elements: [
          { id: "header1", type: "header", content: "" },
          { id: "paragraph1", type: "paragraph", content: "" },
        ],
      },
      {
        name: "Work",
        elements: [
          { id: "header2", type: "header", content: "My Work" },
          { id: "paragraph2", type: "paragraph", content: "" },
          { id: "image1", type: "image", content: "" },
        ],
      },
      {
        name: "Skills",
        elements: [
          { id: "header3", type: "header", content: "Skills" },
          { id: "list1", type: "list", content: [] },
        ],
      },
      {
        name: "Contact",
        elements: [
          { id: "header4", type: "header", content: "Contact" },
          { id: "paragraph3", type: "paragraph", content: "" },
        ],
      },
    ],
  },
];
