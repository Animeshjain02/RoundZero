"use client";

import { Building2, FileText } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface StepCompanyContextProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
}

export function StepCompanyContext({ form }: StepCompanyContextProps) {
  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
            <Building2 className="h-4 w-4 text-rose-500" />
          </div>
          <div>
            <CardTitle className="text-lg">Company & Job Description</CardTitle>
            <CardDescription>
              Paste the job description for a highly tailored interview
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Google, Stripe, Vercel"
                  className="h-11"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The AI interviewer will role-play as an interviewer from this
                company
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="jobDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Job Description
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Paste the full job description here...&#10;&#10;Example:&#10;We are looking for a Senior Software Engineer to join our Platform team. You will be responsible for..."
                  className="min-h-[200px] max-h-[400px] overflow-y-auto resize-y"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Questions will be tailored to match the specific requirements
                and qualifications listed
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
