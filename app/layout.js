import "./globals.css";
import { EventsProvider } from "@/context/EventsContext";
import { DoctorsProvider } from "@/context/DoctorsContext";

export const metadata = {
  title: "SRM Medical College · Admin Portal",
  description: "Medical college administration and doctor profile management",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans text-primary-950 antialiased bg-white">
        <DoctorsProvider>
          <EventsProvider>{children}</EventsProvider>
        </DoctorsProvider>
      </body>
    </html>
  );
}
