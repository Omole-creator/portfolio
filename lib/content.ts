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
  { label: "Services", href: "/services" },
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

export const benefits = [
  "You get growth and the systems behind it, not just one or the other.",
  "Nothing ships in months when it can ship in days.",
  "Every decision comes from numbers, not guesses.",
  "I have been the founder, so I know what actually matters when time and money are tight.",
];

export const contrast = [
  {
    theirs: "Most growth people cannot build the tools they ask for.",
    mine: "I build them myself, with AI, in days.",
  },
  {
    theirs: "Most builders do not understand growth or sales.",
    mine: "I have closed deals, run ads, and grown a community past 9,700 people.",
  },
  {
    theirs: "Most agencies hand you a report.",
    mine: "I hand you the dashboard that makes the report unnecessary.",
  },
  {
    theirs: "Most freelancers disappear after the first win.",
    mine: "I stay close to the numbers and keep adjusting.",
  },
];

export const process = [
  {
    title: "We talk",
    body: "Book a call or send a message. I want to hear where you are and what is actually getting in the way, not just what you think you need built.",
  },
  {
    title: "I find the fastest way in",
    body: "Sometimes that is growth, community and content before ads. Sometimes it is a tool that removes a whole afternoon of manual work. I tell you which, and why.",
  },
  {
    title: "I build or run it, fast",
    body: "Using Claude Code and the same systems I use in my own company, I ship or launch in days, not months, and you see progress the whole way.",
  },
  {
    title: "We keep what works",
    body: "Growth is not a one-time project. I stay close to the numbers and adjust as we go, instead of disappearing after the first win.",
  },
];

export const services = [
  {
    title: "Getting customers to show up without a big ad budget first",
    body: "I bring customers to businesses that need them. Most of the growth I have driven came from community, content, and partnerships, and I turn on Meta, Google, or TikTok ads once there is something worth spending on. What I care about is paying customers, not vanity numbers.",
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
    body: "I build the tools a business needs and automate the parts that waste time. Using Claude Code, plus the skills and MCP servers I connect to it, I ship working software fast, from internal dashboards to a full CRM, without waiting on a dev team to free up.",
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
  approach: string[];
  highlights: string[];
  tags: string[];
  liveUrl?: string;
  images?: { src: string; alt: string }[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "jobmingle",
    name: "JobMingle",
    kind: "The project I started and grew",
    blurb:
      "JobMingle is an edtech platform I started and grew. My engineers built the website at jobmingle.co, while I led the growth, the product direction, and the community, and built the internal tools we run on.",
    why: "The usual way into tech in Nigeria was slow and gatekept, expensive bootcamps, or waiting on the right introduction. I wanted people to have a faster, cheaper way in, and a community that would not let them do it alone.",
    approach: [
      "Started with community first, built the WhatsApp and Telegram groups before there was a product to sell.",
      "Ran ads only once there was a live cohort to fill, and kept them tight enough to hit 16x.",
      "Built Powerhouse and Leads myself, so the business ran on numbers I could see, not guesswork.",
      "My engineers built and maintain jobmingle.co, while I run growth, product direction, and the community.",
    ],
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
      "GluFloat is a web app that helps people living with diabetes figure out what to eat every day without giving up the food they love. It gives personalized recommendations for breakfast, lunch, and dinner, with adjustments for anyone managing another health condition too.",
    why: "People living with diabetes were scared of the food they loved, and it pushed a lot of them into eating the same one meal, day after day. There was no solution for that, so I built one.",
    approach: [
      "Built the recommendation engine first, so it could weigh a food against a diagnosis and any other health condition.",
      "Wrapped it in a checker anyone could use in seconds, for breakfast, lunch, or dinner.",
      "Added the report generator, so a doctor's visit starts with data already in hand.",
      "Built the trial and pricing flow last, priced low enough that cost is never the reason someone does not try it.",
    ],
    highlights: [
      "Personalized meal recommendations for breakfast, lunch, and dinner, adjusted for other health conditions too",
      "Generates a food and glucose report to bring to your next doctor's appointment, for a better consultation",
      "Built the whole product with AI, from the recommendation engine to the trial and pricing flow",
      "Priced for everyday people, with a free trial and no card needed to start",
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
    kind: "The financial command center I built with AI",
    blurb:
      "A financial command center for my company. It brings every revenue line and expense into one place, so I always know exactly where the business stands.",
    why: "I was finding it difficult to track our expenses and revenue, what was bringing in the most money, and what was consuming the most of it, so I built Powerhouse to see all of it clearly, in one place.",
    approach: [
      "Pulled revenue and expenses from all four services into one place, instead of four spreadsheets.",
      "Built views for what is bringing in the most money and what is consuming the most of it, so the answer is a glance, not a calculation.",
      "Added month over month and quarterly views, so trends show up before they become problems.",
      "Locked it behind a password, with offline access and one click backups, since it holds the company's numbers.",
    ],
    highlights: [
      "Tracks revenue across four services, plus expenses, commissions, and profit",
      "Shows what is bringing in the most money, and what is consuming the most of it, at a glance",
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
    name: "JobMingle Pulse",
    kind: "The CRM and operations agent I built with AI",
    blurb:
      "The CRM and operations agent my team runs on every day. It captures every lead straight from the Meta and Google ad forms I run, takes it from first contact to a closed sale, and handles tutor attendance, reports, and certificates on the side.",
    why: "I was bringing in sales closers to handle the leads coming through our ads, so I built Pulse to automate the whole process instead of doing it by hand.",
    approach: [
      "Connected the Meta and Google ad lead forms straight into the system, so every lead lands automatically, nothing typed in by hand.",
      "Built round robin assignment, so every lead reaches a sales closer evenly, with an email notification sent the moment it happens.",
      "Gave each closer a dashboard to log their follow up, with performance tracked and visible from the admin section.",
      "Built a separate attendance dashboard for each tutor, with reports and certificates generated automatically.",
      "Added automatic marketing emails sent out to leads.",
    ],
    highlights: [
      "Captures every lead straight from the Meta and Google ad forms I run, no manual entry",
      "Splits leads evenly across sales closers, with an email notification the moment one lands",
      "Closers follow up on their own dashboard, with performance tracked there too",
      "Everything a closer does is visible and monitored from the admin section",
      "A separate attendance dashboard for each tutor, with reports and certificates generated automatically",
      "Automatic marketing emails sent out to leads",
      "A full pipeline from new lead to won or lost, with payment tracking, plus a one page outcomes report for grant applications",
    ],
    tags: ["Built with Claude Code", "Next.js", "Prisma"],
    liveUrl: "https://jobmingleleads.vercel.app",
    images: [
      {
        src: "/images/leads-overview.webp",
        alt: "JobMingle Pulse CRM dashboard with lead totals and pipeline charts, figures redacted",
      },
      {
        src: "/images/leads-report.webp",
        alt: "JobMingle Pulse training outcomes report page, figures redacted",
      },
    ],
  },
  {
    slug: "waterbrooks-technologies",
    name: "WaterBrooks Technologies",
    kind: "A marketing site I built with AI",
    blurb:
      "WaterBrooks is an agritech company helping African farmers cut post-harvest losses with solar-powered food preservation. I designed and built their marketing site, from the hero that tells the story to the pages that turn visitors into partners.",
    why: "The founder did not have a website that effectively communicated what they did, so I built one that does.",
    approach: [
      "Sat with the founder to get the story straight: solar powered food preservation, for African farms, in plain language.",
      "Designed and built the site around that story, from the hero down to the traction numbers.",
      "Put the traction up front, farmers reached, land secured, the pitch win, the accelerator backing.",
      "Built the whole thing around one Partner With Us button, so the right people know exactly what to do.",
    ],
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
      "A paid product I wrote, designed, and built. The ebook hands small business owners the exact words to turn a hesitant buyer into a sale, and the website sells it end to end.",
    why: "I saw how difficult it was for small business owners to close customers who kept going quiet on them, so I wrote the ebook and built the website to sell it.",
    approach: [
      "Wrote the ebook first: the A.V.Q. method, and scripts for the five most common objections.",
      "Built scripts for WhatsApp, Instagram, and Messenger, plus a seven day follow up sequence.",
      "Built a one page site around a single offer, with checkout through Selar.",
      "Priced it to remove the excuse not to try it, with a refund guarantee behind it.",
    ],
    highlights: [
      "Wrote the ebook myself: a simple three step method for the five most common objections",
      "Scripts for WhatsApp, Instagram, and Messenger, plus a seven day follow up",
      "Built and sold the website end to end, with checkout through Selar",
      "I also build lead magnets like this one, if that is something your business needs",
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
