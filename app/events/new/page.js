import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import EventForm from "@/components/events/EventForm";

export const dynamic = "force-dynamic";

export default function NewEventPage() {
  return (
    <div className="min-h-screen bg-transparent">
      <Sidebar />

      <div className="lg:pl-72">
        <Topbar
          title="New Event Form"
          subtitle="Hall booking request — routed to HOD, HOI and Manager for approval."
          actionLabel="Tracking"
          actionHref="/events"
        />

        <main className="mx-auto max-w-3xl space-y-6 p-4 lg:p-8">
          <EventForm />
        </main>
      </div>
    </div>
  );
}
