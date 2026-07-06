import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import TrackingSummary from "@/components/events/TrackingSummary";
import RequestsTable from "@/components/events/RequestsTable";

export const dynamic = "force-dynamic";

export default function EventsTrackingPage() {
  return (
    <div className="min-h-screen bg-transparent">
      <Sidebar />

      <div className="lg:pl-72">
        <Topbar
          title="Event Form Tracking"
          subtitle="Hall booking requests and their approval status."
          actionLabel="New event form"
          actionHref="/events/new"
        />

        <main className="space-y-6 p-4 lg:p-8">
          <div className="flex border-b border-slate-200 pb-px gap-6">
            <Link
              href="/events"
              className="border-b-2 border-slate-800 pb-3 text-xs font-bold text-slate-800"
            >
              List view
            </Link>
            <Link
              href="/events/calendar"
              className="border-b-2 border-transparent pb-3 text-xs font-bold text-slate-400 hover:text-slate-700 transition-colors"
            >
              Calendar view
            </Link>
          </div>

          <TrackingSummary />
          <RequestsTable />
        </main>
      </div>
    </div>
  );
}
