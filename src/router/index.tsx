import { Container } from "@/layout";
import * as pages from "@/pages";
import { createBrowserRouter } from "react-router-dom";
import { NetworkUsageProvider } from "@/shared/contexts";

export const router = createBrowserRouter([
    {
        element: <Container />,
        children: [
            {
                path: "/",
                element: (
                    <NetworkUsageProvider>
                        <pages.Dashboard />
                    </NetworkUsageProvider>
                ),
            }
        ],
    },
]);
