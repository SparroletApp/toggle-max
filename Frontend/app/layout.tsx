
import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";
import Header from "./header/page";
import CustomCursor from "./component/CustomCursor";

export const metadata: Metadata = {
    title: "Togglemax | UI/UX Design & Software Training",
    description:
        "Learn UI/UX design and software development with industry-focused training at Togglemax.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <CustomCursor />

                <Header />

                <main className="tm-main-content">
                    {children}
                </main>

                {/* <Footer /> */}
            </body>
        </html>
    );
}
