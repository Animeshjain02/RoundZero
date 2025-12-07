import { RPCHandler } from "@orpc/server/fetch";
import { os_context } from "@/server/orpc";
import { appRouter } from "@/server/routers/app";

const handler = new RPCHandler(appRouter);

async function handleRequest(request: Request) {
  const context = await os_context();
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
