import { contract } from "./example.contract";

// http://localhost:3000/api/orpc/example/testEndpoint
export const exampleRouter = {
  testEndpoint: contract.getExample.handler(async ({ input }) => {
    return {
      received: input.message,
      timestamp: new Date().toISOString(),
    };
  }),

  hello: contract.hello.handler(async () => {
    return {
      message: "Hello This is Aashish",
    };
  }),
};
