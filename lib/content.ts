// All site copy and data live here so wording and links are easy to change.

export const site = {
  name: "Omole Usuangbon",
  role: "Founder & Growth Operator",
  url: "https://omoleportfolio.vercel.app",
  metaDescription:
    "Omole Usuangbon brings growth and systems into businesses using AI. He wins customers for startups and established businesses, and builds the tools that keep the whole thing running.",
  headline: "Growth and Systems, Built Into Your Business Using AI",
  subhead:
    "I get startups and businesses in front of buyers, turn them into paying customers, and build the systems that keep the sales coming.",
  contact: {
    email: "omoleusuangbon@gmail.com",
    calendly: "https://calendly.com/omoleusuangbon/30min",
    linkedin: "https://www.linkedin.com/in/omole",
    whatsapp: "https://wa.me/2348132097317",
  },
};

export const nav = [
  { label: "Work", href: "/work" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

// The blog index carries no headline or intro on purpose. The posts speak for
// themselves. `srTitle` is never shown: it exists so the page still has one h1
// for screen readers and search engines.
export const blogPage = {
  srTitle: "Blog",
  emptyState: "Nothing here yet.",
  metaDescription: `Writing by ${site.name}.`,
};

export const proof = [
  { value: "16x", label: "return on ad spend" },
  { value: "9,700+", label: "community members" },
  { value: "4,000+", label: "website users" },
  { value: "4", label: "products shipped with AI" },
  { value: "2", label: "grants won" },
];

export const tools = [
  { name: "Meta Ads", logo: "/images/tools/meta.png" },
  { name: "Claude Code", logo: "/images/tools/claude.png" },
  { name: "Google Analytics", logo: "/images/tools/google-analytics.png" },
  { name: "Kit", logo: "/images/tools/kit.png" },
  { name: "Resend", logo: "/images/tools/resend.png" },
  { name: "ClickUp", logo: "/images/tools/clickup.png" },
  { name: "Asana", logo: "/images/tools/asana.png" },
  { name: "Slack", logo: "/images/tools/slack.png" },
  { name: "Canva", logo: "/images/tools/canva.png" },
];

export const about = [
  "I am Omole, founder of JobMingle. Most of our growth did not come from ad budgets. It came from building communities and using growth hacks that got people talking and pulled them in on their own. We turned on paid ads mainly when we wanted to fill a live cohort. Organic first, paid when it counts, that is how I think about growth.",
  "The part people do not expect is that I also build. When my sales team needed a CRM, I built one. When I needed to see the company finances clearly, I built that too. I use AI tools like Claude Code to ship working products, so I can act on an idea without waiting on anyone.",
  "I am happy to work with startups and established businesses anywhere in the world, whether that is a growth role, a project, or a conversation about building something together.",
];

export const services = [
  {
    title: "Getting customers to show up without a big ad budget first",
    body: "I bring customers to businesses that need them. Most of the growth I have driven came from community, content, and partnerships, and I turn on paid ads once they have something worth spending on. What I care about is paying customers, not vanity numbers.",
  },
  {
    title: "Words that turn a hesitant buyer into a paying one",
    body: "I write the words that sell, from ads and sales pages to emails and blog posts. One sales letter I wrote beat the control by nine times in two weeks.",
  },
  {
    title: "A community that sells for you before you ask it to",
    body: "I build communities people actually want to be in. The JobMingle community grew past 9,700 members across WhatsApp and Telegram, and it became the engine that brought in most of our customers.",
  },
  {
    title: "Running the whole growth operation, not just one piece of it",
    body: "I lead teams and set up the systems that keep the work moving day to day. I have run a 10-member team and the partnerships that came with it, not just the strategy behind them.",
  },
  {
    title: "Tools and dashboards built fast, with no engineering team needed",
    body: "I build the tools a business needs and automate the parts that waste time. Using Claude Code, I ship working software fast, from internal dashboards to a full CRM, without waiting on a dev team to free up.",
  },
];

export const servicesCta = {
  text: "Most people do one of these well. I do both, the growth and the systems behind it.",
  linkText: "See how that works",
  href: "/work",
};

export type CaseStudy = {
  slug: string;
  name: string;
  kind: string;
  blurb: string;
  why: string;
  highlights: string[];
  tags: string[];
  liveUrl?: string;
  images?: { src: string; alt: string }[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "jobmingle",
    name: "JobMingle",
    kind: "The company I founded",
    blurb:
      "JobMingle is the edtech company I started and grew. My engineers built the website at jobmingle.co, while I led the growth, the product direction, and the community, and built the internal tools we run on.",
    why: "The usual way into tech in Nigeria was slow and gatekept, expensive bootcamps, or waiting on the right introduction. I wanted people to have a faster, cheaper way in, and a community that would not let them do it alone.",
    highlights: [
      "Grew a community past 9,700 members that brought in most of our customers",
      "Launched our first live cohort in April 2026 at a 16x return on ad spend",
      "Enrolled 22 students into tech training programs, with leads under $0.50 each",
      "Served over 200 clients through our career services line",
      "Partnered with EvolvateHR, Ternkonnect, Your Study Path, and Cudose",
    ],
    tags: ["Founder", "Growth", "Marketing", "Community", "Partnerships", "Since 2023"],
    liveUrl: "https://jobmingle.co",
    images: [
      {
        src: "/images/jobmingle-hero.webp",
        alt: "JobMingle landing page hero, become the high earner you did not think you could, with the trusted partners strip below",
      },
    ],
  },
  {
    slug: "glufloat",
    name: "GluFloat",
    kind: "The startup I'm building now",
    blurb:
      "GluFloat is a health startup I am building for Nigerians living with diabetes. You type in any Nigerian food, like jollof rice or eba, and in seconds it tells you whether it is safe for your blood sugar and the simple way to make it better.",
    why: "My people love their food, and a diabetes diagnosis should not turn every meal into a guessing game. I wanted to give them a way to eat what they love without the fear.",
    highlights: [
      "Check any Nigerian food before you cook or buy it, with a clear answer in seconds",
      "Built the whole product with AI, from the food checker to the trial and pricing flow",
      "Priced for everyday people, with a free trial and no card needed to start",
      "Currently at MVP stage and getting ready to launch",
    ],
    tags: ["Founder", "Health tech", "Built with Claude Code", "MVP", "Next.js"],
    liveUrl: "https://glufloat.vercel.app",
    images: [
      {
        src: "/images/glufloat-check.webp",
        alt: "GluFloat landing page: check any Nigerian food to see if it is right for your diabetes before you eat it",
      },
      {
        src: "/images/glufloat-joy.webp",
        alt: "GluFloat section showing a woman happy in her kitchen, with the message that you can eat what you love without fear",
      },
    ],
  },
  {
    slug: "jobmingle-powerhouse",
    name: "JobMingle Powerhouse",
    kind: "A product I built with AI",
    blurb:
      "A financial command center for my company. It brings every revenue line and expense into one place, so I always know exactly where the business stands.",
    why: "I was tired of stitching the numbers together in spreadsheets, so I built a dashboard that does it live.",
    highlights: [
      "Tracks revenue across four services, plus expenses, commissions, and profit",
      "Month over month and quarterly growth views for clean reporting",
      "Password protection, offline access, and one click backups",
    ],
    tags: ["Built with Claude Code", "Next.js", "Supabase"],
    liveUrl: "https://jobmingle-powerhouse.vercel.app",
    images: [
      {
        src: "/images/powerhouse.webp",
        alt: "JobMingle Powerhouse dashboard showing revenue and expense breakdowns, with figures redacted",
      },
    ],
  },
  {
    slug: "jobmingle-leads",
    name: "JobMingle Leads",
    kind: "A product I built with AI",
    blurb:
      "The CRM my sales team uses every day. It takes in course inquiries, shares them out to reps on its own, and tracks each one all the way to a closed sale.",
    why: "Leads were slipping through the cracks, so I built a system that assigns and follows up on every single one.",
    highlights: [
      "Automatic round robin assignment to sales reps",
      "A full pipeline from new lead to won or lost, with payment tracking",
      "A live dashboard, plus a one page outcomes report for grant applications",
    ],
    tags: ["Built with Claude Code", "Next.js", "Prisma"],
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
    slug: "waterbrooks-technologies",
    name: "WaterBrooks Technologies",
    kind: "A marketing site I built with AI",
    blurb:
      "WaterBrooks is an agritech company helping African farmers cut post-harvest losses with solar-powered food preservation. I designed and built their marketing site, from the hero that tells the story to the pages that turn visitors into partners.",
    why: "A serious mission deserves a site that feels just as serious, so I gave WaterBrooks a home that makes farmers and partners want to reach out.",
    highlights: [
      "Designed and built the full marketing site with AI, from the hero down to the traction and contact sections",
      "Made the story land: solar-powered food preservation built for African farms",
      "Put their real traction up front, from farmers reached to land secured and accelerator backing",
      "Built around a clear Partner With Us call to action so the right people get in touch",
    ],
    tags: ["Built with Claude Code", "Web design", "Agritech", "Next.js"],
    liveUrl: "https://waterbrookstechnologies.vercel.app",
    images: [
      {
        src: "/images/waterbrooks-hero.webp",
        alt: "WaterBrooks Technologies landing page: revolutionizing food preservation with solar-powered innovation for African farms",
      },
      {
        src: "/images/waterbrooks-traction.webp",
        alt: "WaterBrooks Technologies traction section showing farmers impacted, land secured, a pitch win, and accelerator backing",
      },
    ],
  },
  {
    slug: "sales-objections-toolkit",
    name: "Sales Objections Toolkit",
    kind: "A product I shipped with AI",
    blurb:
      "A paid product I wrote, designed, and built. It hands Nigerian business owners the exact words to turn a hesitant buyer into a sale.",
    why: "I kept watching sellers lose deals to a quiet 'let me get back to you', so I packaged the replies that win those buyers back.",
    highlights: [
      "A simple three step method for the five most common objections",
      "Scripts for WhatsApp, Instagram, and Messenger, plus a seven day follow up",
      "Written, designed, and sold from end to end, with checkout through Selar",
    ],
    tags: ["Built with Claude Code", "Copywriting", "Next.js"],
    liveUrl: "https://sales-obj.vercel.app",
    images: [
      {
        src: "/images/sales-toolkit.webp",
        alt: "Sales Objections Toolkit landing page hero for Nigerian business owners",
      },
    ],
  },
];

export type Recognition = {
  title: string;
  detail: string;
  logo: string;
  kind: "Grant" | "Recognition";
};

export const recognition: Recognition[] = [
  {
    title: "Tony Elumelu Foundation",
    detail: "$5,000 grant for JobMingle",
    logo: "/images/logos/tef.png",
    kind: "Grant",
  },
  {
    title: "TransactPay Thrive",
    detail: "About $700 in grant funding",
    logo: "/images/logos/transactpay.png",
    kind: "Grant",
  },
  {
    title: "Today Africa",
    detail: "100 African Entrepreneurs to Watch",
    logo: "/images/logos/today-africa.png",
    kind: "Recognition",
  },
  {
    title: "African Impact Challenge",
    detail: "Selected entrepreneur",
    logo: "/images/logos/african-impact.png",
    kind: "Recognition",
  },
];

export const faq = [
  {
    q: "What kind of businesses do you work with?",
    a: "Startups and established businesses that are ready to grow and can move quickly. If you are building something serious and you want customers, we will get along well.",
  },
  {
    q: "Do you take on roles, or only projects?",
    a: "Both. I take on roles where I can own growth, and I take on projects with a clear goal. Tell me what you need and we will find the right shape for it.",
  },
  {
    q: "Do you only run paid ads?",
    a: "No. Most of the growth I have driven started organic, through community and content. Paid ads come in to push the big moments. I use whatever brings you paying customers.",
  },
  {
    q: "You build software, but you are not an engineer?",
    a: "That is right. I direct AI tools like Claude Code to build and ship the products, and I have working ones to show for it. You get the output of an engineer without me pretending to be one.",
  },
  {
    q: "Where are you based, and does it matter?",
    a: "I work with startups and businesses anywhere in the world. Wherever you are, I am closer than you think, and I am used to working across time zones.",
  },
  {
    q: "How do we start?",
    a: "Book a quick call or send me an email. We will talk about where you are, what you need, and whether I am the right fit.",
  },
];

export const workTracks = [
  {
    title: "For startups, SaaS, and ecommerce businesses ready to scale",
    body: "I help startups, SaaS, and ecommerce businesses grow, through community, content, paid acquisition, or the systems that keep it all running. This is where most of my work happens.",
  },
  {
    title: "For organizations that want access to trained tech talent",
    body: "Through JobMingle we train and place young tech talent, with a community of thousands behind it. If you hire early career talent, run a training program, or want to reach that audience, there is a partnership worth having here.",
  },
  {
    title: "For everything else, including consulting and speaking",
    body: "If what you need does not fit neatly into the above, reach out anyway. I take on consulting work, and I am open to speaking engagements too.",
  },
];
