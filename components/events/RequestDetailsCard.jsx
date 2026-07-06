"use client";

const sessionLabels = {
  forenoon: "Forenoon (8:00 – 12:00 noon)",
  afternoon: "Afternoon (1:00 – 4:00 PM)",
  "full-day": "Full day",
};

const reqLabels = {
  required: "Required",
  "not-required": "Not required",
};

function Row({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-primary-50 py-2.5 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-xs font-medium text-primary-500">{label}</span>
      <span className="text-sm font-medium text-primary-900">{value || "—"}</span>
    </div>
  );
}

export default function RequestDetailsCard({ request }) {
  const { form } = request;

  return (
    <section
      aria-label="Submitted form details"
      className="rounded-xl border border-primary-100 bg-white p-5"
    >
      <h2 className="text-sm font-semibold text-primary-950">Submitted details</h2>

      <div className="mt-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary-400">
          College &amp; applicant
        </p>
        <div className="mt-1">
          <Row label="College" value={form.college} />
          <Row label="Institution (applicant)" value={form.institution} />
          <Row label="Applicant name" value={form.applicantName} />
          <Row label="Department" value={form.department} />
          <Row label="Designation" value={form.designation} />
          <Row label="Organizer / mobile" value={form.organizerName} />
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary-400">
          Meeting / seminar / function
        </p>
        <div className="mt-1">
          <Row label="Purpose" value={form.purpose} />
          <Row label="Date(s)" value={form.dates} />
          <Row label="Session" value={sessionLabels[form.session]} />
          <Row label="Expected participants" value={form.expectedParticipants} />
          <Row label="VIP / guest" value={form.vipGuest} />
          <Row label="Presiding officers" value={form.presidingOfficers} />
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary-400">Requirements</p>
        <div className="mt-1">
          <Row label="Mike sets" value={reqLabels[form.mikeSets]} />
          <Row label="White board" value={reqLabels[form.whiteBoard]} />
          <Row label="Organizer sign-off date" value={form.organizerSignatureDate} />
        </div>
      </div>
    </section>
  );
}
