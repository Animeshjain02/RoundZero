import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft, Target } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center">
      <Link
        href="/"
        className={buttonVariants({
          variant: "outline",
          className: "absolute top-10 left-10",
        })}
      >
        <ArrowLeft className="size-4" />
        Back to Home
      </Link>
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center gap-2 justify-center font-bold text-xl">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Target className="h-5 w-5" />
          </div>
          <span>RoundZero</span>
        </div>
        {children}

        <div className="text-balance text-center text-xs text-muted-foreground">
          By clicking continue, you agree to our{" "}
          <span className="hover:text-primary hover:underline">
            Terms of Service
          </span>{" "}
          and <span>Privacy Policy</span>
        </div>
      </div>
    </div>
  );
}
