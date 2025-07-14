import ResumeViewer from "@/components/main/resume/resume-render";

type Params = Promise<{ username: string }>;

export default async function Page({ params }: { params: Params }) {
  const { username } = await params;
  return <ResumeViewer shortUrl={username} />;
}
