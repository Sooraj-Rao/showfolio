"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  // Personal Info
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  location: z
    .string()
    .min(2, { message: "Location must be at least 2 characters." }),
  availableForHire: z.boolean(),
  about: z
    .string()
    .min(10, { message: "About must be at least 10 characters." }),

  // Social Links
  linkedin: z.string().url({ message: "Please enter a valid URL." }),
  github: z.string().url({ message: "Please enter a valid URL." }),
  twitter: z.string().url({ message: "Please enter a valid URL." }),

  // Technologies
  technologies: z
    .string()
    .min(2, { message: "Please enter at least one technology." }),

  // Education
  education: z.array(
    z.object({
      school: z.string().min(2, { message: "School name is required" }),
      degree: z.string().min(2, { message: "Degree is required" }),
      location: z.string(),
      startYear: z.string(),
      endYear: z.string(),
    })
  ),

  // Work Experience
  experience: z.array(
    z.object({
      company: z.string().min(2, { message: "Company name is required" }),
      position: z.string().min(2, { message: "Position is required" }),
      location: z.string(),
      startDate: z.string(),
      endDate: z.string(),
      description: z.string(),
    })
  ),

  // Projects
  projects: z.array(
    z.object({
      title: z.string().min(2, { message: "Project title is required" }),
      description: z
        .string()
        .min(10, { message: "Project description is required" }),
      technologies: z.string(),
      githubUrl: z.string().url({ message: "Please enter a valid GitHub URL" }),
      liveUrl: z
        .string()
        .url({ message: "Please enter a valid live demo URL" }),
      image: z.string(),
    })
  ),

  // Blog Posts
  blogPosts: z.array(
    z.object({
      title: z.string().min(2, { message: "Blog post title is required" }),
      content: z.string().min(10, { message: "Blog post content is required" }),
      publishDate: z.string(),
      tags: z.string(),
    })
  ),
});

export default function PortfolioForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "Tushit Garg",
      title: "Full Stack Developer",
      email: "tushitgarg123@gmail.com",
      location: "Vancouver, Canada",
      availableForHire: true,
      about:
        "Fun-Fact:- I built this platform (devp). I'm a 17-year-old full-stack developer with a deep passion for building and experimenting with innovative projects...",
      linkedin: "https://linkedin.com/in/tushitgarg",
      github: "https://github.com/tushitgarg",
      twitter: "https://twitter.com/tushitgarg",
      technologies:
        "NextJS, React, Node.js, Express, TypeScript, Angular, HTML/CSS, SQL, Postgres, MongoDB, Vercel",
      education: [
        {
          school: "BCIT",
          degree: "Computer Systems Technology CST",
          location: "Downtown",
          startYear: "2025",
          endYear: "2027",
        },
      ],
      experience: [],
      projects: [
        {
          title: "Sushinime",
          description:
            "A working Complete anime watching website inspired by Netflix!",
          technologies: "NextJS, ReactJS, Typescript, Consumet, Redis",
          githubUrl: "https://github.com/example/sushinime",
          liveUrl: "https://sushinime.example.com",
          image: "",
        },
      ],
      blogPosts: [
        {
          title: "From Concepts to Code: My Journey as a Full-Stack Developer",
          content:
            "At 17, I've found myself immersed in a world of creativity...",
          publishDate: "2024-09-21",
          tags: "Introduction",
        },
      ],
    },
  });

  const { fields: educationFields, append: appendEducation } = useFieldArray({
    control: form.control,
    name: "education",
  });

  const { fields: experienceFields, append: appendExperience } = useFieldArray({
    control: form.control,
    name: "experience",
  });

  const { fields: projectFields, append: appendProject } = useFieldArray({
    control: form.control,
    name: "projects",
  });

  const { fields: blogFields, append: appendBlog } = useFieldArray({
    control: form.control,
    name: "blogPosts",
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Edit Portfolio Details</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="blog">Blog</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-6">
              <Card>
                <CardContent className="pt-6 space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Professional Title</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="availableForHire"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Available for hire
                          </FormLabel>
                          <FormDescription>
                            Let others know that you're open to work
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="about"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>About</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Write about yourself"
                            className="min-h-[200px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="technologies"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Technologies</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Comma-separated list of technologies"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter technologies separated by commas (e.g., NextJS,
                          React, Node.js)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="education" className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  {educationFields.map((field, index) => (
                    <div key={field.id} className="space-y-6 mb-6">
                      <FormField
                        control={form.control}
                        name={`education.${index}.school`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>School</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`education.${index}.startYear`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Start Year</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`education.${index}.endYear`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>End Year</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      appendEducation({
                        school: "",
                        degree: "",
                        location: "",
                        startYear: "",
                        endYear: "",
                      })
                    }
                  >
                    Add Education
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="experience" className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  {experienceFields.map((field, index) => (
                    <div key={field.id} className="space-y-6 mb-6">
                      <FormField
                        control={form.control}
                        name={`experience.${index}.company`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`experience.${index}.position`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Position</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`experience.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      appendExperience({
                        company: "",
                        position: "",
                        location: "",
                        startDate: "",
                        endDate: "",
                        description: "",
                      })
                    }
                  >
                    Add Experience
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects" className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  {projectFields.map((field, index) => (
                    <div key={field.id} className="space-y-6 mb-6">
                      <FormField
                        control={form.control}
                        name={`projects.${index}.title`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Project Title</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`projects.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`projects.${index}.githubUrl`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>GitHub URL</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`projects.${index}.liveUrl`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>GitHub URL</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      appendProject({
                        title: "",
                        description: "",
                        technologies: "",
                        githubUrl: "",
                        liveUrl: "",
                        image: "",
                      })
                    }
                  >
                    Add Project
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="blog" className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  {blogFields.map((field, index) => (
                    <div key={field.id} className="space-y-6 mb-6">
                      <FormField
                        control={form.control}
                        name={`blogPosts.${index}.title`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Blog Post Title</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`blogPosts.${index}.content`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Content</FormLabel>
                            <FormControl>
                              <Textarea {...field} className="min-h-[300px]" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`blogPosts.${index}.publishDate`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Publish Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`blogPosts.${index}.tags`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tags</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Comma-separated tags"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      appendBlog({
                        title: "",
                        content: "",
                        publishDate: "",
                        tags: "",
                      })
                    }
                  >
                    Add Blog Post
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Button type="submit" className="w-full">
            Save All Changes
          </Button>
        </form>
      </Form>
    </div>
  );
}
