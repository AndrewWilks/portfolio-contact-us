import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ToastManagerProvider from "@ui/ToastManager.tsx";
import ConfirmDialogProvider from "@ui/ConfirmDialog.tsx";
import "./index.css";

// App providers
import ThemeProvider from "@contexts/ThemeProvider.tsx";

// Import the generated route tree
import { routeTree } from "./routeTree.gen.ts";

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const queryClient = new QueryClient();

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <ToastManagerProvider>
            <ConfirmDialogProvider>
              <RouterProvider router={router} />
            </ConfirmDialogProvider>
          </ToastManagerProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </StrictMode>
  );
}
