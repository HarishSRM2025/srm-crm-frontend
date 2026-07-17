import "./globals.css";

import { AuthProvider } from "@/context/AuthContext";
import { DoctorsProvider } from "@/context/DoctorsContext";
import { EventsProvider } from "@/context/EventsContext";
import { TemplatesProvider } from "@/context/TemplatesContext";
import { UsersProvider } from "@/context/UsersContext";

export const metadata = {
  title: "SRM CRM",
  description: "Medical college admin dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <DoctorsProvider>
            <EventsProvider>
              <TemplatesProvider>
                <UsersProvider>{children}</UsersProvider>
              </TemplatesProvider>
            </EventsProvider>
          </DoctorsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}