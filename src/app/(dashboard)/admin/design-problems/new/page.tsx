"use client";

import { useState, useCallback, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Loader2,
  Plus,
  Sparkles,
  Save,
  Trash2,
  Zap,
  RefreshCw,
  CheckCircle2,
  Server,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { orpcClient } from "@/lib/orpc-client";
import {
  systemDesignProblemSchema,
  type GeneratedSystemDesignProblem,
} from "@/lib/validations/practice";

const TOPIC_CHIPS = [
  { label: "Twitter", description: "Social timeline & feeds" },
  { label: "URL Shortener", description: "High read/write throughput" },
  { label: "Netflix", description: "Video streaming CDN" },
  { label: "WhatsApp", description: "Real-time messaging" },
  { label: "Uber", description: "Geo-spatial routing" },
  { label: "Google Drive", description: "Blob storage & sync" },
];

const COMPLEXITY_LEVELS = [
  {
    value: "EASY",
    label: "Easy",
    color: "bg-emerald-500",
    text: "text-emerald-500",
  },
  {
    value: "MEDIUM",
    label: "Medium",
    color: "bg-amber-500",
    text: "text-amber-500",
  },
  { value: "HARD", label: "Hard", color: "bg-red-500", text: "text-red-500" },
] as const;

const generationSchema = z.object({
  topic: z.string().min(3, "At least 3 characters").max(100),
});

export default function NewDesignProblemPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isSaving, setIsSaving] = useState(false);
  const [generated, setGenerated] =
    useState<GeneratedSystemDesignProblem | null>(null);

  const genForm = useForm<z.infer<typeof generationSchema>>({
    resolver: zodResolver(generationSchema),
    defaultValues: { topic: "" },
  });

  const saveForm = useForm<z.infer<typeof systemDesignProblemSchema>>({
    resolver: zodResolver(systemDesignProblemSchema),
    defaultValues: {
      title: "",
      description: "",
      functionalReqs: [],
      nonFunctionalReqs: [],
      complexity: "MEDIUM",
    },
  });

  const funcReqs = saveForm.watch("functionalReqs") ?? [];
  const nonFuncReqs = saveForm.watch("nonFunctionalReqs") ?? [];
  const complexity = saveForm.watch("complexity");

  const onGenerate = useCallback(
    genForm.handleSubmit((values) => {
      startTransition(async () => {
        try {
          const result = await orpcClient.practice.generateProblem({
            topic: values.topic,
          });
          setGenerated(result);
          saveForm.reset(result);
          toast.success("Problem generated successfully.");
        } catch {
          toast.error("Generation failed. Please try again.");
        }
      });
    }),
    [genForm, saveForm],
  );

  const onSave = useCallback(
    saveForm.handleSubmit(async (values) => {
      setIsSaving(true);
      try {
        await orpcClient.practice.createProblem(values);
        toast.success("Saved to problem library.");
        router.push("/dashboard/practice/design");
      } catch {
        toast.error("Failed to save.");
      } finally {
        setIsSaving(false);
      }
    }),
    [saveForm, router],
  );

  const reset = useCallback(() => {
    setGenerated(null);
    genForm.reset();
    saveForm.reset();
  }, [genForm, saveForm]);

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* ── Header ── */}
      {generated && (
        <div className="flex items-center justify-between border-b pb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Review & Save Problem
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Customize the generated requirements before saving to your
              library.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={reset}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Start Over
            </Button>
            <Button onClick={onSave} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save to Library
            </Button>
          </div>
        </div>
      )}

      {/* ── STEP 1: Topic form ── */}
      {!generated ? (
        <div className="flex min-h-[60vh] flex-col items-center justify-center">
          <div className="w-full max-w-2xl space-y-10">
            <div className="text-center space-y-3">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-6">
                <Server className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-3xl font-semibold tracking-tight">
                Generate a System Design Problem
              </h1>
              <p className="text-muted-foreground text-lg">
                Enter a system architecture you want to practice, and AI will
                build a complete mock interview spec.
              </p>
            </div>

            <Form {...genForm}>
              <form onSubmit={onGenerate} className="space-y-8">
                <FormField
                  control={genForm.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative flex items-center shadow-sm rounded-xl overflow-hidden border bg-background focus-within:ring-1 focus-within:ring-ring focus-within:border-ring transition-all">
                          <Input
                            placeholder="e.g., Design a scalable URL shortener like Bit.ly"
                            className="border-0 h-14 px-4 text-base focus-visible:ring-0 shadow-none"
                            {...field}
                          />
                          <Button
                            type="submit"
                            disabled={isPending}
                            className="mr-2 h-10 px-6 font-medium"
                          >
                            {isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <Sparkles className="mr-2 h-4 w-4" />
                                Generate
                              </>
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-center" />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
                    <Zap className="h-4 w-4" />
                    <span>Popular architectures</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {TOPIC_CHIPS.map((chip) => (
                      <button
                        key={chip.label}
                        type="button"
                        onClick={() =>
                          genForm.setValue("topic", `Design ${chip.label}`)
                        }
                        className="group flex flex-col items-start p-4 rounded-xl border bg-card hover:border-primary/50 transition-colors text-left shadow-sm hover:shadow-md"
                      >
                        <span className="font-medium text-sm group-hover:text-primary transition-colors mb-1">
                          {chip.label}
                        </span>
                        <span className="text-xs text-muted-foreground line-clamp-1">
                          {chip.description}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </div>
      ) : (
        /* ── STEP 2: Editor ── */
        <Form {...saveForm}>
          <form
            onSubmit={onSave}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-2 space-y-8">
              {/* Problem Details */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium tracking-tight border-b pb-2">
                  Core Information
                </h3>
                <FormField
                  control={saveForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Problem Title</FormLabel>
                      <FormControl>
                        <Input {...field} className="h-10 text-base" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={saveForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Context & Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={5} className="resize-none" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Requirements */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium tracking-tight border-b pb-2">
                  Requirements & Constraints
                </h3>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Functional */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <FormLabel className="mb-0">
                        Functional Requirements
                      </FormLabel>
                      <Badge variant="secondary" className="font-mono">
                        {funcReqs.length}
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      {funcReqs.map((item, i) => (
                        <div
                          key={i}
                          className="group relative flex items-center"
                        >
                          <Input
                            value={item}
                            onChange={(e) => {
                              const arr = [...funcReqs];
                              arr[i] = e.target.value;
                              saveForm.setValue("functionalReqs", arr);
                            }}
                            className="pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 h-7 w-7 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() =>
                              saveForm.setValue(
                                "functionalReqs",
                                funcReqs.filter((_, idx) => idx !== i),
                              )
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full border-dashed"
                      onClick={() =>
                        saveForm.setValue("functionalReqs", [...funcReqs, ""])
                      }
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add Requirement
                    </Button>
                  </div>

                  {/* Non-Functional */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <FormLabel className="mb-0">
                        Non-Functional Constraints
                      </FormLabel>
                      <Badge variant="secondary" className="font-mono">
                        {nonFuncReqs.length}
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      {nonFuncReqs.map((item, i) => (
                        <div
                          key={i}
                          className="group relative flex items-center"
                        >
                          <Input
                            value={item}
                            onChange={(e) => {
                              const arr = [...nonFuncReqs];
                              arr[i] = e.target.value;
                              saveForm.setValue("nonFunctionalReqs", arr);
                            }}
                            className="pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 h-7 w-7 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() =>
                              saveForm.setValue(
                                "nonFunctionalReqs",
                                nonFuncReqs.filter((_, idx) => idx !== i),
                              )
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full border-dashed"
                      onClick={() =>
                        saveForm.setValue("nonFunctionalReqs", [
                          ...nonFuncReqs,
                          "",
                        ])
                      }
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add Constraint
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right sidebar ── */}
            <div className="space-y-6">
              <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-6 sticky top-6">
                <div>
                  <h3 className="font-medium mb-4 text-sm">
                    Target Difficulty
                  </h3>
                  <div className="space-y-2">
                    {COMPLEXITY_LEVELS.map((level) => (
                      <button
                        key={level.value}
                        type="button"
                        onClick={() =>
                          saveForm.setValue("complexity", level.value)
                        }
                        className={`w-full flex items-center px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                          complexity === level.value
                            ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                            : "bg-transparent text-muted-foreground hover:bg-muted/50"
                        }`}
                      >
                        <span
                          className={`h-2.5 w-2.5 rounded-full mr-3 ${level.color} ${complexity !== level.value && "opacity-50"}`}
                        />
                        <span
                          className={
                            complexity === level.value ? "text-foreground" : ""
                          }
                        >
                          {level.label}
                        </span>
                        {complexity === level.value && (
                          <CheckCircle2 className="h-4 w-4 ml-auto text-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Total Requirements
                    </span>
                    <span className="font-medium">
                      {funcReqs.filter(Boolean).length +
                        nonFuncReqs.filter(Boolean).length}
                    </span>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isSaving}>
                  {isSaving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Save to Library
                </Button>
              </div>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
