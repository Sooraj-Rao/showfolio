import React from "react";

import ResumeViewer from "@/components/main/resume/resume-render";

const page = ({ params: { username } }: { params: { username: string } }) => {
  return <ResumeViewer shortUrl={username} />;
};

export default page;
