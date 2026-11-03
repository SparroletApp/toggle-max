"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function ProtectedRoute({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();

    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const token = sessionStorage.getItem("access_token");
        if (pathname === "/") {
            if (token) {
                router.replace("/admin/dashboard");
                return;
            }

            setAuthorized(true);
            return;
        }

        // All other routes require authentication
        if (!token) {
            router.replace("/");
            return;
        }

        setAuthorized(true);

    }, [pathname, router]);

    if (!authorized) {
        return null;
    }

    return <>{children}</>;
}