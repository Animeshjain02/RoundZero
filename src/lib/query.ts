import type { QueryKey } from "@tanstack/react-query";
import { QueryCache, QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
        staleTime: 1000 * 60 * 5, // 5 minutes
      },
    },
    queryCache: new QueryCache({
      onError: (error) => {
        toast.error(`Error: ${error.message}`);
      },
    }),
  });

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
  if (typeof window === "undefined") {
    return createQueryClient();
  }
  if (!browserQueryClient) browserQueryClient = createQueryClient();
  return browserQueryClient;
}

export const queryClient = getQueryClient();

interface OptimisticUpdateOptions<T> {
  queryKey: QueryKey;
  filterFn: (data: T) => boolean;
  updateFn: (data: T[]) => T[];
  client: QueryClient;
}

export function createOptimisticUpdate<T>({
  queryKey,
  filterFn,
  updateFn,
  client,
}: OptimisticUpdateOptions<T>) {
  return {
    onMutate: async () => {
      await client.cancelQueries({ queryKey });
      const previousData = client.getQueriesData<T>({ queryKey });
      for (const [key, data] of previousData) {
        if (!data) {
          continue;
        }
        const filtered = (Array.isArray(data) ? data : [data]).filter(filterFn);
        const updated = updateFn(filtered as T[]);
        client.setQueryData(key, updated);
      }
      return { previousData };
    },

    onError: (
      _err: unknown,
      _variables: unknown,
      context?: { previousData: [QueryKey, T | undefined][] },
    ) => {
      if (!context?.previousData) {
        return;
      }
      for (const [key, data] of context.previousData) {
        client.setQueryData(key, data);
      }
    },
  };
}
