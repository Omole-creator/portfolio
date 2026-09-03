// Copy and data for the /growth portfolio only. This is a separate page built
// for growth marketing job applications and gigs. It draws on the same real
// work as the main site, but only the projects relevant to growth marketing,
// and never frames Omole as a founder. See CLAUDE.md for the full context.

export const growthSite = {
  name: "Omole Usuangbon",
  role: "Growth Marketer",
  path: "/growth",
  metaDescription:
    "Omole Usuangbon runs growth for startups and businesses: community building, paid acquisition, conversion copywriting, and the marketing systems that keep leads moving.",
  headline: "Growth Marketing That Turns Strangers Into Paying Customers",
  subhead:
    "I get startups and businesses in front of buyers, turn them into paying customers, and build the systems that keep the leads moving until they close.",
  contact: {
    email: "omoleusuangbon@gmail.com",
    calendly: "https://calendly.com/omoleusuangbon/30min",
    linkedin: "https://www.linkedin.com/in/omole",
    whatsapp: "https://wa.me/2348132097317",
  },
};

export const growthNav = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export const growthProof = [
  { value: "16x", label: "return on ad spend" },
  { value: "10,000+", label: "community members grown" },
  { value: "<$0.50", label: "cost per lead" },
  { value: "9x", label: "conversion lift over the control" },
];

export const growthAbout = [
  "I ran growth for JobMingle, an edtech platform that helps career switchers build practical tech skills and find jobs. Over the past few years I have worked across community, content, paid ads, and the marketing systems behind all of it.",
  "Most of the growth I drove did not come from ad spend. It came from building communities, creating content, and finding ways to get people talking and pulling each other in. Ads came in once there was a live cohort to fill, and I kept them tight enough to hit 16x return on ad spend.",
  "I also set up the systems that keep leads from falling through. When leads from Meta and Google ads needed to be captured and followed up fast, I built the CRM that does that automatically. When a free CV review was taking up hours of the team's time every week, I built a tool that runs the same checklist in minutes, turning a manual process into a lead magnet that works on its own.",
  "I am happy to take on growth marketing roles or projects for startups and businesses anywhere in the world, whether that means running paid acquisition, building a community, writing the copy that converts, or fixing the systems leads keep falling through.",
];

export const growthServices = [
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
    body: "I build communities people actually want to be in. One community I grew past 10,000 members across WhatsApp and Telegram became the engine that brought in most of its customers.",
  },
  {
    title: "Systems that catch every lead and follow up before it goes cold",
    body: "When leads come in from Meta or Google ads, they need to be captured, assigned, and followed up immediately, or they go cold. I set up systems that catch every lead the moment it arrives and keep it moving until it closes, won or lost.",
  },
];

export type GrowthProject = {
  slug: string;
  name: string;
  kind: string;
  blurb: string;
  highlights: string[];
  liveUrl: string;
  image: { src: string; alt: string };
};

export const growthWork: GrowthProject[] = [
  {
    slug: "jobmingle",
    name: "JobMingle",
    kind: "Growth for an edtech platform",
    blurb:
      "JobMingle trains and places career switchers in tech. I ran growth: community, content, partnerships, and paid ads once there was something worth spending on.",
    highlights: [
      "Grew a community past 10,000 members across WhatsApp and Telegram that brought in most of its customers",
      "Launched a live cohort at a 16x return on ad spend",
      "Enrolled 22 students into tech training programs, with leads under $0.50 each",
    ],
    liveUrl: "https://jobmingle.co",
    image: {
      src: "/images/jobmingle-hero.webp",
      alt: "JobMingle landing page hero, become the high earner you did not think you could, with the trusted partners strip below",
    },
  },
  {
    slug: "jobmingle-crm",
    name: "JobMingle CRM",
    kind: "Marketing ops for a lead-gen funnel",
    blurb:
      "The system that catches every lead from Meta and Google ad campaigns, assigns it to a sales closer automatically, and tracks it through to an outcome, won or lost.",
    highlights: [
      "Every lead enters the system automatically and is assigned to a closer within moments",
      "Closers get their own dashboard, and their activity and performance stay visible from admin",
      "Sends automated marketing emails to keep leads engaged through the pipeline",
    ],
    liveUrl: "https://jobmingleleads.vercel.app",
    image: {
      src: "/images/leads-overview.webp",
      alt: "JobMingle CRM dashboard with lead totals and pipeline charts, figures redacted",
    },
  },
  {
    slug: "sales-objections-toolkit",
    name: "Sales Objections Toolkit",
    kind: "Conversion copywriting, shipped as a product",
    blurb:
      "Small business owners could get a buyer interested, but the conversation often stalled the moment an objection came up. This gives them a simple framework and ready-to-use scripts for the objections they hear most.",
    highlights: [
      "A three-step method and scripts for five common sales objections",
      "Ready-to-use scripts for WhatsApp, Instagram, and Messenger, plus a seven-day follow-up sequence",
      "Wrote the sales copy and built the checkout flow that sells it end to end",
    ],
    liveUrl: "https://sales-obj.vercel.app",
    image: {
      src: "/images/sales-toolkit.webp",
      alt: "Sales Objections Toolkit landing page hero for Nigerian business owners",
    },
  },
  {
    slug: "cv-reviewer",
    name: "CV Reviewer",
    kind: "A self-serve lead magnet",
    blurb:
      "Free CV reviews were taking up hours of manual work every week for JobMingle's team. This turns the same 15-point checklist into a self-serve tool that scores a CV in minutes, so it works as a lead magnet on its own.",
    highlights: [
      "Reviews CVs against the same 15-point checklist used for paying clients",
      "Gives a score out of 100 with plain-English feedback, no signup required",
      "Frees the team from manually reviewing every CV submitted for a free audit",
    ],
    liveUrl: "https://jobminglecv.vercel.app",
    image: {
      src: "/images/cv-reviewer-hero.webp",
      alt: "CV Reviewer landing page: most CVs get rejected before a human ever reads them",
    },
  },
];

export const growthTracks = [
  {
    title: "For startups, agencies, SaaS, and ecommerce businesses ready to grow",
    body: "I help these businesses get more customers, through community, content, paid acquisition, or the systems that keep the leads moving. If you need someone who can run growth day to day, not just advise on it, that is the role I take on.",
  },
  {
    title: "For teams hiring a growth marketer",
    body: "If you are looking for someone to own paid acquisition, community, or conversion copywriting, full time or on a contract, I am open to that conversation.",
  },
  {
    title: "For everything else, including consulting and short-term projects",
    body: "If what you need does not fit neatly into the above, reach out anyway. I take on consulting work and shorter growth projects too.",
  },
];
