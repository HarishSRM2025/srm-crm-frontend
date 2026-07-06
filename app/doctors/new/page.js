import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import DoctorForm from "@/components/doctors/DoctorForm";

export const dynamic = "force-dynamic";

export default function NewDoctorPage() {
  return (
    <div className="min-h-screen bg-surface-100">
      <Sidebar />

      <div className="lg:pl-72">
        <Topbar
          title="New Doctor Profile"
          subtitle="Create a new faculty profile for the college directory."
          actionLabel="Doctor Directory"
          actionHref="/doctors"
        />

        <main className="mx-auto max-w-3xl space-y-6 p-4 lg:p-8">
          <DoctorForm />
        </main>
      </div>
    </div>
  );
}
