import { RouterProvider } from "react-router-dom"; // Ensure correct import
import { Provider } from "react-redux";
import store from "./Redux/store.ts";
import { ThemeProvider } from "./components/theme-provider.tsx";
import { router } from "./routes.tsx";
import { Toaster } from "sonner";

const App = () => {
    return (
        <Provider store={store}>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <Toaster position="top-center" />
                <RouterProvider router={router} />
            </ThemeProvider>
        </Provider>
    );
};

export default App;
