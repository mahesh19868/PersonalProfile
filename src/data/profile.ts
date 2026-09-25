export const site = {
  name: "Subramaniam Ananthakrishnan",
  shortName: "Subramaniam A.",
  title: "Senior Lead Developer",
  company: "Cimpress India",
  location: "Navi Mumbai, Maharashtra, India",
  email: "mahesh19868@gmail.com",
  phone: "+91 99205 14876",
  linkedIn: "https://www.linkedin.com/in/subramaniam-ananthakrishnan-bb327615",
  yearsExperience: 17,
  summary:
    "Senior Lead Developer with 17 years of experience delivering enterprise software across ecommerce, insurance, and supply chain. Technical leadership, backend and API development, solution design, and production support—with hands-on depth in C#, ASP.NET, SQL Server, Node.js, MongoDB, AWS, and AI-enabled applications using OpenAI and LangChain.",
} as const;

export const skills = [
  "Technical Leadership",
  "Solution Architecture",
  "C# & ASP.NET",
  "Web APIs",
  "Node.js",
  "SQL Server & MongoDB",
  "AWS",
  "OpenAI & LangChain",
  "Ecommerce & Shipping",
  "GST & E-Invoicing",
] as const;

export type CareerRole = {
  company: string;
  role: string;
  period: string;
  duration: string;
  location?: string;
  highlights: string[];
};

export const career: CareerRole[] = [
  {
    company: "VistaPrint India (Cimpress)",
    role: "Senior Lead Developer",
    period: "Jul 2021 — Present",
    duration: "5+ years",
    location: "Mumbai",
    highlights: [
      "Partner with global teams to translate requirements into delivery plans and technical solutions.",
      "Backend services, APIs, reporting, and ecommerce/shipping operations at scale.",
      "VPI Shipping Console for third-party fulfillers—orders, artwork, remittance workflows.",
      "Carrier-as-a-Service integrations: Blue Dart, Delhivery, Shadowfax, Ecom Express, Speed Post.",
      "E-Invoicing & GST: GSTIN validation, IRN and signed QR-code generation.",
    ],
  },
  {
    company: "VistaPrint India",
    role: "Lead Developer",
    period: "Aug 2019 — Jul 2021",
    duration: "2 years",
    location: "Mumbai Metropolitan Region",
    highlights: [
      "Designed and built the VPI Shipping Console (prepaid to COD conversion).",
      "Plant-team enhancements driven by business and stakeholder requirements.",
    ],
  },
  {
    company: "Jardine Lloyd Thompson",
    role: "Senior Software Engineer",
    period: "Dec 2014 — Aug 2019",
    duration: "4 years 9 months",
    location: "Mumbai",
    highlights: [
      "Requirements, database logic, reporting, browser compatibility, L1/L2 production support.",
      "Onsite stakeholder coordination and support for non-Asia product regions.",
    ],
  },
  {
    company: "Jardine Lloyd Thompson",
    role: "Software Engineer",
    period: "May 2013 — Dec 2014",
    duration: "1 year 8 months",
    highlights: [
      "UI design, customized reports, requirement gathering, onsite coordination.",
    ],
  },
  {
    company: "Blue Star Infotech",
    role: "Software Engineer",
    period: "Sep 2009 — May 2013",
    duration: "3 years 9 months",
    highlights: [
      "Supply chain domain modules, SCM coordinator, audits, and mentoring new recruits.",
    ],
  },
  {
    company: "Venus Labs Web Solutions",
    role: "Junior Developer",
    period: "Feb 2009 — Sep 2009",
    duration: "8 months",
    location: "Mumbai",
    highlights: ["PHP & Drupal web applications—development, maintenance, and QA."],
  },
];

export const education = [
  {
    school: "S.I.E.S Graduate School Of Technology",
    degree: "B.E., Computer Engineering",
    period: "2004 — 2008",
  },
  {
    school: "Guru Nanak Khalsa College, Matunga",
    degree: "H.S.C, Science",
    period: "2002 — 2004",
  },
] as const;

export const portfolioLinks = [
  {
    title: "Case Studies",
    description: "Deep dives into shipping, reporting, and integration work—coming soon.",
    href: "#",
    status: "coming-soon" as const,
  },
  {
    title: "Open Source & Samples",
    description: "Curated code samples and experiments—coming soon.",
    href: "#",
    status: "coming-soon" as const,
  },
  {
    title: "Technical Writing",
    description: "Architecture notes and engineering posts—coming soon.",
    href: "#",
    status: "coming-soon" as const,
  },
];

export const navItems = [
  { label: "About", href: "#about" },
  { label: "Journey", href: "#journey" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Contact", href: "#contact" },
] as const;
