import { ORPCError, onError, ValidationError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import * as z from "zod";
import { os_context } from "@/server/orpc";
import { appRouter } from "@/server/routers/app";

const handler = new RPCHandler(appRouter, {
  clientInterceptors: [
    onError((error) => {
      if (
        error instanceof ORPCError &&
        error.code === "BAD_REQUEST" &&
        error.cause instanceof ValidationError
      ) {
        const zodError = new z.ZodError(
          error.cause.issues as z.core.$ZodIssue[],
        );

        throw new ORPCError("INPUT_VALIDATION_FAILED", {
          status: 422,
          message: z.prettifyError(zodError),
          data: z.flattenError(zodError),
          cause: error.cause,
        });
      }

      const err = error as {
        message?: string;
        code?: string;
        status?: number;
      };

      console.error(
        "[ORPC ERROR]",
        JSON.stringify(
          {
            message: err.message,
            code: err.code,
            status: err.status,
          },
          null,
          2,
        ),
      );
    }),
  ],
});

export const maxDuration = 60; // 60 seconds

async function handleRequest(request: Request) {
  const context = await os_context({ headers: request.headers });
  const { response, matched } = await handler.handle(request, {
    prefix: "/api/orpc",
    context,
  });

  if (matched) {
    return response;
  }

  return new Response("Not found", { status: 404 });
}

export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const DELETE = handleRequest;
export const PATCH = handleRequest;
