"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  ArrowLeft,
  Code2,
  FileText,
  Loader2,
  PenTool,
  PlusIcon,
  Sparkles,
  UploadCloud,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ResumeUploader } from "@/components/file-uploader/Uploader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { orpcClient } from "@/lib/orpc-client";
import {
  type CreateInterviewSchemaType,
  createInterviewSchema,
} from "@/lib/zodSchemas/createInterview";

export default function CreateInterviewPage() {
  const [isPending, startTransition] = useTransition();
  const [resumeKey, setResumeKey] = useState<string | null>(null);
  const [resumeFilename, setResumeFilename] = useState<string | null>(null);

  const router = useRouter();

  // 1. Setup Form
  const form = useForm({
    resolver: zodResolver(createInterviewSchema),
    defaultValues: {
      jobTitle: "",
      resumeText: "",
      includeDSA: false,
      type: "TECHNICAL",
      experienceLevel: "mid",
      techStack: "",
    },
  });

  // 2. Mutations
  const { mutate: createInterview } = useMutation({
    mutationFn: async (
      values: CreateInterviewSchemaType & {
        resumeKey?: string;
        resumeFilename?: string;
      },
    ) => {
      return await orpcClient.interview.create(values);
    },
    onSuccess: (data: { interviewId: string }) => {
      toast.success("Interview created successfully");
      form.reset();
      router.push(`/dashboard/interview/${data.interviewId}`);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const { mutate: parseResume, isPending: isParsing } = useMutation({
    mutationFn: async (values: {
      resume: { filename: string; key: string };
    }) => {
      return await orpcClient.interview.parseResume(values);
    },
    onSuccess: (data: { text: string }) => {
      form.setValue("resumeText", data.text);
      toast.success("Resume parsed: Context added to AI");
    },
    onError: (error: Error) => {
      toast.error("Failed to parse resume: " + error.message);
      setResumeKey(null);
      setResumeFilename(null);
    },
  });

  function onSubmit(values: CreateInterviewSchemaType) {
    startTransition(async () => {
      createInterview({
        ...values,
        resumeKey: resumeKey || undefined,
        resumeFilename: resumeFilename || undefined,
      });
    });
  }

  const onResumeUpload = (key: string, file: File) => {
    setResumeKey(key);
    setResumeFilename(file.name);
    parseResume({ resume: { filename: file.name, key: key } });
  };

  const onResumeRemove = (key: string) => {
    setResumeKey(null);
    setResumeFilename(null);
    form.setValue("resumeText", "");
    toast.info("Resume removed");
  };

  const resumeText = form.watch("resumeText");
  const watchType = form.watch("type");

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            Create New Session <Sparkles className="size-5 text-primary" />
          </h1>
          <p className="text-muted-foreground">
            Configure the AI persona and difficulty settings.
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Role Configuration</CardTitle>
                <CardDescription>
                  Tell the AI who you want to be interviewed as.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                {/* Job Title */}
                <FormField
                  control={form.control}
                  name="jobTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Role</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Senior Frontend Engineer"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Tech Stack */}
                <div className="space-y-2">
                  <FormLabel>Tech Stack / Focus Area</FormLabel>
                  <Input
                    placeholder="e.g. React, Next.js, Node.js, AWS"
                    onChange={(e) => form.setValue("techStack", e.target.value)}
                  />
                </div>

                {/* Experience Level */}
                <div className="space-y-2">
                  <FormLabel>Years of Experience</FormLabel>
                  <Select
                    defaultValue="mid"
                    onValueChange={(val) =>
                      form.setValue("experienceLevel", val as any)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="junior">Junior (0-2 Years)</SelectItem>
                      <SelectItem value="mid">Mid-Level (2-5 Years)</SelectItem>
                      <SelectItem value="senior">Senior (5+ Years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Context & Resume</CardTitle>
                <CardDescription>
                  Upload your resume to let the AI ask about your past projects.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="resumeText"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="space-y-4">
                          <ResumeUploader
                            onUploadComplete={onResumeUpload}
                            onRemove={onResumeRemove}
                          />

                          {isParsing && (
                            <div className="flex items-center gap-2 text-primary animate-pulse">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <p className="text-sm font-medium">
                                Parsing resume content...
                              </p>
                            </div>
                          )}

                          {field.value && !isParsing && (
                            <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                              <div className="p-2 bg-green-500/20 rounded-full">
                                <FileText className="h-4 w-4 text-green-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-green-700">
                                  Resume Parsed Successfully
                                </p>
                                <p className="text-xs text-green-600/80">
                                  The AI has read your resume and is ready.
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Interview Mode</CardTitle>
                <CardDescription>
                  Choose the type of interview you want to practice.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid grid-cols-1 md:grid-cols-3 gap-4"
                        >
                          <FormItem>
                            <FormControl>
                              <RadioGroupItem
                                value="TECHNICAL"
                                className="peer sr-only"
                              />
                            </FormControl>
                            <FormLabel className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-6 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all h-full">
                              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
                                <Code2 className="size-6 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div className="text-center space-y-1">
                                <span className="font-semibold text-lg">
                                  Technical
                                </span>
                                <p className="text-xs text-muted-foreground">
                                  DSA & Coding Challenges
                                </p>
                              </div>
                            </FormLabel>
                          </FormItem>

                          <FormItem>
                            <FormControl>
                              <RadioGroupItem
                                value="SYSTEM_DESIGN"
                                className="peer sr-only"
                              />
                            </FormControl>
                            <FormLabel className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-6 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all h-full">
                              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-4">
                                <PenTool className="size-6 text-purple-600 dark:text-purple-400" />
                              </div>
                              <div className="text-center space-y-1">
                                <span className="font-semibold text-lg">
                                  System Design
                                </span>
                                <p className="text-xs text-muted-foreground">
                                  Architecture & Diagramming
                                </p>
                              </div>
                            </FormLabel>
                          </FormItem>

                          <FormItem>
                            <FormControl>
                              <RadioGroupItem
                                value="BEHAVIORAL"
                                className="peer sr-only"
                              />
                            </FormControl>
                            <FormLabel className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-6 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all h-full">
                              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full mb-4">
                                <Users className="size-6 text-orange-600 dark:text-orange-400" />
                              </div>
                              <div className="text-center space-y-1">
                                <span className="font-semibold text-lg">
                                  Behavioral
                                </span>
                                <p className="text-xs text-muted-foreground">
                                  Soft Skills & Leadership
                                </p>
                              </div>
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {watchType === "TECHNICAL" && (
                  <div className="mt-6 pt-6 border-t animate-in fade-in slide-in-from-top-2">
                    <FormField
                      control={form.control}
                      name="includeDSA"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm bg-muted/20">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Algorithmic Challenges
                            </FormLabel>
                            <FormDescription>
                              Include specific DSA (Data Structures &
                              Algorithms) problems?
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="size-5"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="lg"
                className="w-full sm:w-auto"
                disabled={isPending || isParsing}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Session...
                  </>
                ) : (
                  <>
                    Start Interview <Sparkles className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
