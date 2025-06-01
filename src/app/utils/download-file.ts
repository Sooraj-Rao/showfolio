export const DownloadResume = (fileUrl: string, filename = "resume.pdf") => {
  const link = document.createElement("a");
  link.href = fileUrl;
  link.target = "_blank";
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
