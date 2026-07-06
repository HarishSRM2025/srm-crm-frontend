"use client";

import { createContext, useContext, useMemo, useState } from "react";

const DoctorsContext = createContext(null);

const DEPARTMENTS = [
  "Cardiology",
  "Biochemistry",
  "Pediatrics",
  "Anatomy",
  "Pharmacology",
  "Orthopedics",
  "General Medicine",
  "Dermatology",
  "Ophthalmology",
  "ENT",
];

const STATUSES = {
  PUBLISHED: "published",
  DRAFT: "draft",
  REVIEW: "review",
};

let idCounter = 1010;

function seedDoctors() {
  return [
    {
      id: "DOC-1001",
      name: "Dr. Kavitha Rajan",
      department: "Biochemistry",
      designation: "Associate Professor",
      qualifications: "MBBS, MD (Biochemistry)",
      registrationNo: "TN-MED-44821",
      yearsOfExperience: 12,
      bio: "Specializes in clinical enzymology and metabolic disorders. Has published over 18 research papers in national and international journals.",
      opdTimings: "Mon, Wed, Fri — 9:00 AM to 12:00 PM",
      phone: "98765 43210",
      email: "kavitha.rajan@srm.edu",
      publications: [
        "Serum Enzyme Patterns in Diabetic Nephropathy, IJCB 2024",
        "Role of Antioxidants in Hepatic Fibrosis, JAPI 2023",
        "Biomarkers of Oxidative Stress in CKD, BMC Biochem 2022",
      ],
      status: STATUSES.PUBLISHED,
    },
    {
      id: "DOC-1002",
      name: "Dr. Suresh Venkataraman",
      department: "Cardiology",
      designation: "Professor & HOD",
      qualifications: "MBBS, MD (Medicine), DM (Cardiology)",
      registrationNo: "TN-MED-31205",
      yearsOfExperience: 22,
      bio: "Pioneer in interventional cardiology at SRM Medical College. Performed over 3,000 angioplasties. Board member of the Indian Heart Association.",
      opdTimings: "Tue, Thu — 10:00 AM to 1:00 PM",
      phone: "98765 12345",
      email: "suresh.v@srm.edu",
      publications: [
        "Outcomes of Primary PCI in STEMI Patients, IHJ 2024",
        "AI-Assisted ECG Interpretation: A Validation Study, JACC 2023",
      ],
      status: STATUSES.PUBLISHED,
    },
    {
      id: "DOC-1003",
      name: "Dr. Priya Venkatesh",
      department: "Anatomy",
      designation: "Assistant Professor",
      qualifications: "MBBS, MS (Anatomy)",
      registrationNo: "TN-MED-56732",
      yearsOfExperience: 6,
      bio: "Passionate educator focusing on cadaveric dissection techniques and 3D anatomy modeling for undergraduate medical students.",
      opdTimings: "N/A — Academic faculty",
      phone: "87654 32109",
      email: "priya.venkatesh@srm.edu",
      publications: [
        "3D Printing in Anatomical Education: A Comparative Study, JASE 2024",
      ],
      status: STATUSES.DRAFT,
    },
    {
      id: "DOC-1004",
      name: "Dr. Rajesh Kumar",
      department: "Orthopedics",
      designation: "Professor",
      qualifications: "MBBS, MS (Ortho), FRCS",
      registrationNo: "TN-MED-22891",
      yearsOfExperience: 19,
      bio: "Expert in joint replacement surgery and sports medicine. Consultant surgeon for multiple national athletic teams.",
      opdTimings: "Mon to Fri — 2:00 PM to 5:00 PM",
      phone: "76543 21098",
      email: "rajesh.k@srm.edu",
      publications: [
        "Minimally Invasive TKR: 5-Year Follow Up, IJO 2024",
        "Platelet-Rich Plasma in ACL Injuries, KSSTA 2023",
        "Robotic-Assisted Hip Replacement Outcomes, JBJS 2022",
        "Cartilage Regeneration using Stem Cells, Nat Med 2021",
      ],
      status: STATUSES.PUBLISHED,
    },
    {
      id: "DOC-1005",
      name: "Dr. Meenakshi Sundaram",
      department: "Pediatrics",
      designation: "Associate Professor",
      qualifications: "MBBS, MD (Pediatrics), Fellowship in Neonatology",
      registrationNo: "TN-MED-39054",
      yearsOfExperience: 14,
      bio: "Neonatology specialist managing the NICU at SRM Medical College Hospital. Special interest in developmental pediatrics and vaccine research.",
      opdTimings: "Mon, Wed, Fri — 3:00 PM to 6:00 PM",
      phone: "65432 10987",
      email: "meenakshi.s@srm.edu",
      publications: [
        "Neonatal Sepsis Markers: A Prospective Study, IJP 2024",
        "Impact of Kangaroo Care on Preterm Outcomes, Pediatrics 2023",
      ],
      status: STATUSES.PUBLISHED,
    },
    {
      id: "DOC-1006",
      name: "Dr. Anand Mohan",
      department: "Pharmacology",
      designation: "Professor & HOD",
      qualifications: "MBBS, MD (Pharmacology), PhD",
      registrationNo: "TN-MED-18903",
      yearsOfExperience: 25,
      bio: "Leading researcher in rational therapeutics and clinical pharmacology. Member of multiple drug advisory committees.",
      opdTimings: "N/A — Academic faculty",
      phone: "54321 09876",
      email: "anand.mohan@srm.edu",
      publications: [
        "Pharmacovigilance in Rural India, BJP 2024",
        "Antibiotic Stewardship Programs: Impact Analysis, JAC 2023",
        "Drug Interactions in Polypharmacy, Eur J Clin Pharm 2022",
      ],
      status: STATUSES.REVIEW,
    },
    {
      id: "DOC-1007",
      name: "Dr. Lakshmi Narayan",
      department: "Dermatology",
      designation: "Assistant Professor",
      qualifications: "MBBS, MD (Dermatology)",
      registrationNo: "TN-MED-61209",
      yearsOfExperience: 5,
      bio: "Clinical dermatologist specializing in autoimmune skin conditions and cosmetic dermatology. Active in tele-dermatology outreach programs.",
      opdTimings: "Tue, Thu, Sat — 9:00 AM to 12:00 PM",
      phone: "43210 98765",
      email: "lakshmi.n@srm.edu",
      publications: [],
      status: STATUSES.DRAFT,
    },
    {
      id: "DOC-1008",
      name: "Dr. Balaji Krishnamurthy",
      department: "General Medicine",
      designation: "Senior Professor",
      qualifications: "MBBS, MD (Medicine), FICP",
      registrationNo: "TN-MED-11045",
      yearsOfExperience: 28,
      bio: "Senior physician with expertise in critical care and infectious diseases. Led the COVID-19 task force at SRM Medical College.",
      opdTimings: "Mon to Sat — 8:00 AM to 11:00 AM",
      phone: "32109 87654",
      email: "balaji.k@srm.edu",
      publications: [
        "Post-COVID Syndrome: A Longitudinal Study, Lancet ID 2024",
        "Dengue Management Guidelines: A Review, JAPI 2023",
        "ICU Outcomes in Septic Shock, CCM 2022",
        "Antimicrobial Resistance Trends in South India, IJMM 2021",
        "Tropical Infections in Urban Settings, TMI 2020",
      ],
      status: STATUSES.PUBLISHED,
    },
  ];
}

function blankDoctor() {
  return {
    name: "",
    department: "",
    designation: "",
    qualifications: "",
    registrationNo: "",
    yearsOfExperience: "",
    bio: "",
    opdTimings: "",
    phone: "",
    email: "",
    publications: [],
    status: STATUSES.DRAFT,
  };
}

export function DoctorsProvider({ children }) {
  const [doctors, setDoctors] = useState(seedDoctors);

  const addDoctor = (form) => {
    const id = `DOC-${idCounter++}`;
    const newDoc = { id, ...form };
    setDoctors((prev) => [newDoc, ...prev]);
    return id;
  };

  const updateDoctor = (id, updates) => {
    setDoctors((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updates } : d))
    );
  };

  const deleteDoctor = (id) => {
    setDoctors((prev) => prev.filter((d) => d.id !== id));
  };

  const getDoctor = (id) => doctors.find((d) => d.id === id);

  const value = useMemo(
    () => ({ doctors, addDoctor, updateDoctor, deleteDoctor, getDoctor, DEPARTMENTS, STATUSES, blankDoctor }),
    [doctors]
  );

  return <DoctorsContext.Provider value={value}>{children}</DoctorsContext.Provider>;
}

export function useDoctors() {
  const ctx = useContext(DoctorsContext);
  if (!ctx) throw new Error("useDoctors must be used within DoctorsProvider");
  return ctx;
}

export { DEPARTMENTS, STATUSES };
