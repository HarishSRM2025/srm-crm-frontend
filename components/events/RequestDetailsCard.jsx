"use client";

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
          Applicant &amp; Institution
        </p>
        <div className="mt-1">
          <Row label="Institution (applicant)" value={form.event_applicant_institution} />
          <Row label="Applicant name" value={form.event_applicant_name} />
          <Row label="Department" value={form.event_department} />
          <Row label="Designation" value={form.event_designation} />
          <Row label="Organizer name" value={form.event_organizer_name} />
          <Row label="Organizer phone" value={form.event_organizer_phone} />
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary-400">
          Meeting / seminar / function
        </p>
        <div className="mt-1">
          <Row label="Purpose" value={form.event_purpose} />
          <Row label="Event details" value={form.event_details} />
          <Row label="Date" value={form.event_date} />
          <Row label="Start time" value={form.event_start_time} />
          <Row label="End time" value={form.event_end_time} />
          <Row label="Expected participants" value={form.event_participant_count} />
          <Row label="VIP / guest" value={form.event_guest_name} />
          <Row label="Presiding officers" value={form.event_presiding_officers} />
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary-400">Requirements</p>
        <div className="mt-1">
          <Row label="Mike sets" value={form.event_micset ? "Required" : "Not required"} />
          <Row label="White board" value={form.event_white_board ? "Required" : "Not required"} />
        </div>
      </div>
    </section>
  );
}
