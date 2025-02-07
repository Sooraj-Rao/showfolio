import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dynamic from "next/dynamic";

const DynamicChart = dynamic(
  () => import("@/app/(routes)/dashboard/widgets/charts"),
  { ssr: false }
);

const data = [
  { name: "Jan", views: 4000, downloads: 2400 },
  { name: "Feb", views: 3000, downloads: 1398 },
  { name: "Mar", views: 2000, downloads: 9800 },
  { name: "Apr", views: 2780, downloads: 3908 },
  { name: "May", views: 1890, downloads: 4800 },
  { name: "Jun", views: 2390, downloads: 3800 },
];

export default function Analytics() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Analytics</h1>
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="resumes">Resumes</TabsTrigger>
          <TabsTrigger value="sharing">Sharing</TabsTrigger>
          <TabsTrigger value="geography">Geography</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Views
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24,567</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Downloads
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3,891</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Avg. Time on Page
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2m 34s</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Conversion Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3.2%</div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Views vs Downloads</CardTitle>
            </CardHeader>
            <CardContent>
              <DynamicChart data={data} />
            </CardContent>
          </Card>
        </TabsContent>
        {/* Add content for other tabs */}
      </Tabs>
    </div>
  );
}
