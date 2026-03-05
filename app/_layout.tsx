import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";

const queryClient = new QueryClient();

export default function _layout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="exercises"
          options={{
            presentation: "fullScreenModal",
          }}
        />
      </Stack>
    </QueryClientProvider>
  );
}
