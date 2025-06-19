import React from "react";
// import PortfolioDisplay from "../dashboard/(routes)/web/page";
// import PortfolioForm from "../dashboard/(routes)/web/form";
import ResumeViewer from "@/components/main/resume/resume-render";

// const page = () => <PortfolioDisplay />;
const page = ({ params: { username } }: { params: { username: string } }) => {
  return <ResumeViewer shortUrl={username} />;
};

export default page;
