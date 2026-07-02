// All site copy and data live here so wording and links are easy to change.

export const site = {
  name: "Omole Usuangbon",
  role: "Founder & Growth Operator",
  url: "https://omole-usuangbon.vercel.app",
  metaDescription:
    "Omole Usuangbon is a founder and growth marketer who takes products from zero to paying customers, and builds the tools that run the business. Open to startup roles and co-founder conversations.",
  tagline:
    "I turn attention into customers, and build the tools that keep the business running.",
  heroPitch:
    "For four years I have helped products find their first paying customers through paid ads, sharp copy, and communities that stick. The part people do not expect is that I also build the software behind the growth. Founder of JobMingle, and the person who ends up owning the funnel from the first click to the closed sale.",
  openLine:
    "Based in Lagos, open to working with startups anywhere.",
  contact: {
    email: "omoleusuangbon@gmail.com",
    calendly: "https://calendly.com/omoleusuangbon/30min",
    linkedin: "https://www.linkedin.com/in/omole",
    whatsapp: "https://wa.me/2348132097317",
  },
};

export const nav = [
  { label: "About", href: "#about" },
  { label: "What I do", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Recognition", href: "#recognition" },
];

export const proof = [
  { value: "462", label: "leads from one campaign" },
  { value: "16x", label: "return on ad spend" },
  { value: "₦4.8m", label: "in sales booked" },
  { value: "9,700+", label: "community members" },
  { value: "3", label: "grants and awards" },
];

export const about = [
  "I am Omole, a growth marketer and the founder of JobMingle. For the last four years most of my work has come back to one question, how do you put a product in front of the right people and turn their attention into revenue. I have answered it with paid ads, with copy that sells, and with communities that people actually want to stay in.",
  "The part people do not expect is that I also build. When my sales team needed a CRM, I built one. When I needed to see the company finances clearly, I built that too. I use AI tools like Claude Code to ship real, working products, so I can act on an idea without waiting on anyone.",
  "I am based in Lagos and happy to work with startups anywhere, whether that is a growth role, a project, or a conversation about building something together.",
];

export const services = [
  {
    title: "Growth and paid acquisition",
    body: "I run Meta ads from end to end, the creative, the targeting, the budget, and the daily optimisation. I care about one number above the rest, customers you can actually afford to get.",
  },
  {
    title: "Copywriting and content",
    body: "I write ads, sales pages, and emails that move people to act. One sales letter I wrote beat the version before it by nine times in two weeks.",
  },
  {
    title: "Community building",
    body: "I grow communities that people want to belong to. The JobMingle community passed 9,700 members, and engagement went up by 200 percent while it grew.",
  },
  {
    title: "Operations and leadership",
    body: "I lead teams, set up the systems, and keep the day to day moving. I have run a ten person team and the partnerships that came with it.",
  },
  {
    title: "AI products and automation",
    body: "I build the tools my business needs and automate the parts that waste time, using Claude Code and modern web stacks to ship quickly.",
  },
];

export type CaseStudy = {
  name: string;
  kind: string;
  blurb: string;
  why?: string;
  highlights: string[];
  tags: string[];
  liveUrl?: string;
  images?: { src: string; alt: string }[];
  featured?: boolean;
};

export const caseStudies: CaseStudy[] = [
  {
    name: "JobMingle",
    kind: "The company I founded",
    featured: true,
    blurb:
      "JobMingle is the edtech company I started and grew from nothing. I built the customer acquisition engine, the community, and most of the software that runs behind it.",
    highlights: [
      "462 leads from a single Meta ads campaign, at under fifty cents each",
      "18 students enrolled between ₦270k and ₦470k, a 16x return on ad spend",
      "A community of more than 9,700 members across WhatsApp and Telegram",
      "Career services that have served over 200 paying clients",
      "Partnerships with EvolvateHR, Ternkonnect, and Your Study Path",
    ],
    tags: ["Founder", "Growth", "Community", "Since 2023"],
  },
  {
    name: "JobMingle Powerhouse",
    kind: "A product I built",
    blurb:
      "A financial command center for my company. It brings every revenue line and expense into one place, so I always know exactly where the business stands.",
    why: "I was tired of stitching the numbers together in spreadsheets, so I built a dashboard that does it live.",
    highlights: [
      "Tracks revenue across four services, plus expenses, commissions, and profit",
      "Month over month and quarterly growth views for clean reporting",
      "Password protection, offline access, and one click backups",
    ],
    tags: ["Next.js", "TypeScript", "Supabase", "Tailwind"],
    liveUrl: "https://jobmingle-powerhouse.vercel.app",
    images: [
      {
        src: "/images/powerhouse.webp",
        alt: "JobMingle Powerhouse dashboard showing revenue and expense breakdowns, with figures redacted",
      },
    ],
  },
  {
    name: "JobMingle Leads",
    kind: "A product I built",
    blurb:
      "The CRM my sales team uses every day. It takes in course inquiries, shares them out to reps on its own, and tracks each one all the way to a closed sale.",
    why: "Leads were slipping through the cracks, so I built a system that assigns and follows up on every single one.",
    highlights: [
      "Automatic round robin assignment to sales reps",
      "A full pipeline from new lead to won or lost, with payment tracking",
      "A live dashboard, plus a one page outcomes report for grant applications",
    ],
    tags: ["Next.js", "Prisma", "Neon Postgres", "NextAuth", "Recharts"],
    liveUrl: "https://jobmingleleads.vercel.app",
    images: [
      {
        src: "/images/leads-overview.webp",
        alt: "JobMingle Leads CRM dashboard with lead totals and pipeline charts, figures redacted",
      },
      {
        src: "/images/leads-report.webp",
        alt: "JobMingle Leads training outcomes report page, figures redacted",
      },
    ],
  },
  {
    name: "Sales Objections Toolkit",
    kind: "A product I shipped",
    blurb:
      "A paid product I wrote, designed, and built. It hands Nigerian business owners the exact words to turn a hesitant buyer into a sale.",
    why: "I kept watching sellers lose deals to a quiet 'let me get back to you', so I packaged the replies that win those buyers back.",
    highlights: [
      "A simple three step method for the five most common objections",
      "Scripts for WhatsApp, Instagram, and Messenger, plus a seven day follow up",
      "Written, designed, and sold from end to end, with checkout through Selar",
    ],
    tags: ["Next.js", "TypeScript", "Tailwind", "Copywriting"],
    liveUrl: "https://sales-obj.vercel.app",
    images: [
      {
        src: "/images/sales-toolkit.webp",
        alt: "Sales Objections Toolkit landing page hero for Nigerian business owners",
      },
    ],
  },
];

export const recognition = [
  {
    title: "Tony Elumelu Foundation Grant",
    detail: "$5,000 in non dilutive funding for JobMingle",
  },
  {
    title: "TransactPay Thrive Grant",
    detail: "Selected for funding and support",
  },
  {
    title: "African Impact Challenge",
    detail: "Selected entrepreneur",
  },
  {
    title: "100 African Entrepreneurs to Watch",
    detail: "Named by Today Africa",
  },
];

export const workTracks = [
  {
    title: "For startups hiring",
    body: "If you need someone to own growth and build alongside the team, I am open to full time and fractional roles. I move fast, and I care about revenue over vanity metrics.",
  },
  {
    title: "For founders looking for a co-founder",
    body: "If you are building something and want a partner who can bring in customers and ship product, let us talk. I have done the zero to one journey once, and I am ready to do it again.",
  },
];
