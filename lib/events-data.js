// Status constants used across approval workflow
export const STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
};

// Ordered list of approval stages – each request flows through these sequentially
export const APPROVAL_STAGES = ["hod", "hoi", "manager"];

// Returns a blank event-form object for the "New event form" page
export function blankForm() {
  return {
    college: "",
    institution: "",
    applicantName: "",
    department: "",
    designation: "",
    organizerName: "",
    purpose: "",
    dates: "",
    session: "",
    expectedParticipants: "",
    vipGuest: "",
    presidingOfficers: "",
    mikeSets: "not-required",
    whiteBoard: "not-required",
    organizerSignatureDate: "",
  };
}

// Generates a handful of seed requests so the tracking table is not empty on first load
export function seedRequests() {
  return [
    {
      id: "EVT-1040",
      submittedOn: "2026-06-28",
      form: {
        college: "SRM Medical College",
        institution: "Dept. of Biochemistry",
        applicantName: "Dr. Kavitha Rajan",
        department: "Biochemistry",
        designation: "Associate Professor",
        organizerName: "Dr. Kavitha Rajan / 98765 43210",
        purpose: "National Workshop on Clinical Enzymology",
        dates: "10 Jul 2026",
        session: "full-day",
        expectedParticipants: "120",
        vipGuest: "Dr. S. Ramesh, AIIMS Delhi",
        presidingOfficers: "2",
        mikeSets: "required",
        whiteBoard: "required",
        organizerSignatureDate: "2026-06-28",
      },
      approvals: {
        hod: { status: STATUS.APPROVED, by: "Dr. M. Anand", date: "2026-06-29", note: "Approved – aligns with department goals." },
        hoi: { status: STATUS.APPROVED, by: "Dr. R. Suresh", date: "2026-06-30", note: "" },
        manager: { status: STATUS.PENDING, by: "", date: "", note: "" },
      },
      officeUse: {
        availability: "Available",
        allotment: "Main Auditorium",
        allotmentItems: ["Projector", "PA System", "Stage"],
        alternateDate: "",
      },
    },
    {
      id: "EVT-1041",
      submittedOn: "2026-06-30",
      form: {
        college: "SRM Medical College",
        institution: "Dept. of Anatomy",
        applicantName: "Dr. Priya Venkatesh",
        department: "Anatomy",
        designation: "Assistant Professor",
        organizerName: "Dr. Priya Venkatesh / 87654 32109",
        purpose: "Inter-departmental Quiz Competition",
        dates: "15 Jul 2026",
        session: "forenoon",
        expectedParticipants: "80",
        vipGuest: "",
        presidingOfficers: "1",
        mikeSets: "required",
        whiteBoard: "not-required",
        organizerSignatureDate: "2026-06-30",
      },
      approvals: {
        hod: { status: STATUS.APPROVED, by: "Dr. L. Sharma", date: "2026-07-01", note: "" },
        hoi: { status: STATUS.PENDING, by: "", date: "", note: "" },
        manager: { status: STATUS.PENDING, by: "", date: "", note: "" },
      },
      officeUse: {
        availability: "",
        allotment: "",
        allotmentItems: [],
        alternateDate: "",
      },
    },
    {
      id: "EVT-1042",
      submittedOn: "2026-07-01",
      form: {
        college: "SRM Medical College",
        institution: "Dept. of Pharmacology",
        applicantName: "Dr. Arun Krishnan",
        department: "Pharmacology",
        designation: "Professor & HOD",
        organizerName: "Dr. Arun Krishnan / 76543 21098",
        purpose: "CME on Rational Therapeutics",
        dates: "20 Jul 2026",
        session: "afternoon",
        expectedParticipants: "200",
        vipGuest: "Dr. N. Lakshmi, Drug Controller General",
        presidingOfficers: "3",
        mikeSets: "required",
        whiteBoard: "required",
        organizerSignatureDate: "2026-07-01",
      },
      approvals: {
        hod: { status: STATUS.REJECTED, by: "Dr. P. Mohan", date: "2026-07-01", note: "Budget not sanctioned yet. Please resubmit after HOD finance review." },
        hoi: { status: STATUS.PENDING, by: "", date: "", note: "" },
        manager: { status: STATUS.PENDING, by: "", date: "", note: "" },
      },
      officeUse: {
        availability: "",
        allotment: "",
        allotmentItems: [],
        alternateDate: "",
      },
    },
    {
      id: "EVT-1039",
      submittedOn: "2026-06-25",
      form: {
        college: "SRM Medical College",
        institution: "Student Affairs",
        applicantName: "Mr. Deepak Ravi",
        department: "Student Affairs",
        designation: "Coordinator",
        organizerName: "Mr. Deepak Ravi / 65432 10987",
        purpose: "Annual Cultural Fest – Opening Ceremony",
        dates: "5 Jul 2026 – 6 Jul 2026",
        session: "full-day",
        expectedParticipants: "500",
        vipGuest: "Chief Guest TBD",
        presidingOfficers: "4",
        mikeSets: "required",
        whiteBoard: "not-required",
        organizerSignatureDate: "2026-06-25",
      },
      approvals: {
        hod: { status: STATUS.APPROVED, by: "Dr. S. Gopal", date: "2026-06-26", note: "" },
        hoi: { status: STATUS.APPROVED, by: "Dr. R. Suresh", date: "2026-06-27", note: "Ensure security coordination." },
        manager: { status: STATUS.APPROVED, by: "Mr. K. Bala", date: "2026-06-28", note: "" },
      },
      officeUse: {
        availability: "Available",
        allotment: "Open Air Theatre + Seminar Hall A",
        allotmentItems: ["Stage", "PA System", "Projector", "Chairs – 500"],
        alternateDate: "",
      },
    },
  ];
}
