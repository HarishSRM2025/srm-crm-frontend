import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import CalendarView from "@/components/events/CalendarView";

export const dynamic = "force-dynamic";

export default function EventsCalendarPage() {
  return (
    <div className="min-h-screen bg-surface-100">
      <Sidebar />

      <div className="lg:pl-72">
        <Topbar
          title="Event form tracking"
          subtitle="Hall booking requests and their approval status."
          actionLabel="New event form"
          actionHref="/events/new"
        />

        <main className="space-y-6 p-4 lg:p-8">
          <div className="flex border-b border-primary-100 pb-px gap-6">
            <Link
              href="/events"
              className="border-b-2 border-transparent pb-3 text-sm font-medium text-primary-500 hover:text-primary-800 transition-colors"
            >
              List view
            </Link>
            <Link
              href="/events/calendar"
              className="border-b-2 border-primary-600 pb-3 text-sm font-semibold text-primary-900"
            >
              Calendar view
            </Link>
          </div>

          <CalendarView />
        </main>
      </div>
    </div>
  );
}
