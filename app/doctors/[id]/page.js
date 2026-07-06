"use client";

import { useParams, useRouter } from "next/navigation";
import { LuArrowLeft as ArrowLeft } from "react-icons/lu";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import DoctorForm from "@/components/doctors/DoctorForm";
import { useDoctors } from "@/context/DoctorsContext";

export default function EditDoctorPage() {
  const { id } = useParams();
  const router = useRouter();
  const { getDoctor } = useDoctors();
  const doctor = getDoctor(id);

  if (!doctor) {
    return (
      <div className="min-h-screen bg-surface-100">
        <Sidebar />
        <div className="lg:pl-72">
          <Topbar title="Profile not found" actionLabel="Doctor Directory" actionHref="/doctors" />
          <main className="p-8">
            <p className="text-sm text-primary-500">
              We couldn't find that doctor profile. It may have been removed.
            </p>
            <button
              onClick={() => router.push("/doctors")}
              className="mt-3 text-sm font-medium text-primary-600 hover:text-primary-800"
            >
              ← Back to directory
            </button>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-100">
      <Sidebar />

      <div className="lg:pl-72">
        <Topbar
          title={doctor.name}
          subtitle={`${doctor.designation} · ${doctor.department}`}
          actionLabel="Doctor Directory"
          actionHref="/doctors"
        />

        <main className="mx-auto max-w-3xl space-y-6 p-4 lg:p-8">
          <button
            onClick={() => router.push("/doctors")}
            className="flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-800"
          >
            <ArrowLeft size={15} />
            Back to directory
          </button>

          <DoctorForm existingDoctor={doctor} />
        </main>
      </div>
    </div>
  );
}
