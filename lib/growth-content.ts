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
  why: string[];
  approach: string[];
  results: string[];
  insight: string;
  liveUrl: string;
  images: { src: string; alt: string }[];
};

export const growthWork: GrowthProject[] = [
  {
    slug: "jobmingle",
    name: "JobMingle",
    kind: "Growth for an edtech platform",
    why: [
      "JobMingle needed to get in front of career switchers and beginners looking to break into tech, without a large ad budget to spend testing what worked.",
      "Ads alone would have burned through a small budget fast with no proof of what message or audience actually converted. The platform needed people to trust it enough to join a community and a paid cohort, not just click an ad.",
    ],
    approach: [
      "Built the community first, on WhatsApp and Telegram, before there was a product to sell, so there was proof of demand and a warm audience to launch to.",
      "Ran content and partnerships to keep the community growing organically, and only turned on Meta ads once there was a live cohort to fill.",
      "Kept ad targeting and creative tight enough to hit a 16x return, instead of spreading spend across broad, unproven audiences.",
    ],
    results: [
      "Grew a community past 10,000 members across WhatsApp and Telegram that brought in most new customers",
      "Hit a 16x return on ad spend on the first live cohort launch",
      "Enrolled 22 students into tech training programs, with leads under $0.50 each",
    ],
    insight:
      "Ads work best once you already know what story gets someone to say yes. Building the community first gave me that story, and the proof, before a single naira went into paid media.",
    liveUrl: "https://jobmingle.co",
    images: [
      {
        src: "/images/jobmingle-hero.webp",
        alt: "JobMingle landing page hero, become the high earner you did not think you could, with the trusted partners strip below",
      },
      {
        src: "/images/jobmingle-fb-results.webp",
        alt: "Meta Ads Manager showing JobMingle campaign results across four ad sets, with lead counts and cost per lead visible, budget and amount spent redacted",
      },
    ],
  },
  {
    slug: "jobmingle-crm",
    name: "JobMingle CRM",
    kind: "Marketing ops for a lead-gen funnel",
    why: [
      "Every lead from Meta and Google ad campaigns was being tracked and followed up manually, and as the volume grew, leads sat too long before anyone reached out, or slipped through entirely.",
      "Bringing on sales closers would only fix half the problem. Without a system, there was still no way to see who was following up, how fast, or what was happening to each lead.",
    ],
    approach: [
      "Connected the Meta and Google ad lead forms directly into the CRM, so every new lead entered the system automatically.",
      "Built round-robin assignment to distribute leads evenly across closers, with an instant email notification the moment one lands.",
      "Gave each closer their own dashboard, while keeping their activity, performance, and outcomes visible from admin.",
    ],
    results: [
      "Every lead now enters the system and is assigned to a closer within moments, instead of sitting in an inbox",
      "The full pipeline is visible from one place, including closer activity, payments, and outcomes, won or lost",
      "Automated marketing emails keep leads engaged through the pipeline without manual follow-up",
    ],
    insight:
      "A lead that sits for a day is a lead that has probably already found someone else. The system exists to make sure that never happens, so the ad spend that brought the lead in is not wasted after the click.",
    liveUrl: "https://jobmingleleads.vercel.app",
    images: [
      {
        src: "/images/leads-overview.webp",
        alt: "JobMingle CRM dashboard with lead totals and pipeline charts, figures redacted",
      },
    ],
  },
  {
    slug: "sales-objections-toolkit",
    name: "Sales Objections Toolkit",
    kind: "Conversion copywriting, shipped as a product",
    why: [
      "Small business owners could get a buyer interested, but the conversation often stalled the moment an objection came up, and a stalled conversation quietly costs a sale.",
      "Most sellers were never taught what to say back. They were improvising in the exact moment when having the right words mattered most.",
    ],
    approach: [
      "Wrote a simple three-step method and ready-to-use scripts for the five objections sellers hear most often, across WhatsApp, Instagram, and Messenger.",
      "Designed and wrote a one-page sales site around a single offer, with checkout handled through Selar.",
      "Tested the sales copy against a control, and rewrote until it won.",
    ],
    results: [
      "One sales letter beat the control by nine times inside two weeks",
      "Turned an idea into a complete paid product, from the ebook and scripts to the sales site and checkout",
      "Priced to be an easy yes, backed by a 30-day refund guarantee",
    ],
    insight:
      "An objection is a question the buyer needs answered before they will say yes. Give sellers that answer in advance, and hesitation stops being the place a sale goes to die.",
    liveUrl: "https://sales-obj.vercel.app",
    images: [
      {
        src: "/images/sales-toolkit.webp",
        alt: "Sales Objections Toolkit landing page hero for Nigerian business owners",
      },
    ],
  },
  {
    slug: "cv-reviewer",
    name: "CV Reviewer",
    kind: "A self-serve lead magnet",
    why: [
      "JobMingle was manually reviewing CVs for everyone who wanted a free audit, and every review repeated the same 15-point checklist by hand.",
      "That meant free reviews were slow to deliver and capped by however much time the team had that week, even though the checklist itself never changed.",
    ],
    approach: [
      "Turned the same 15-point checklist used for paying clients into a repeatable, automated review process.",
      "Built a simple upload flow that accepts PDF, Word, PNG, and JPG, with no signup required.",
      "Made the tool self-serve and private: no CV is stored, so the audit runs and disappears.",
    ],
    results: [
      "Turned a manual, one-at-a-time review process into a self-serve tool that scores a CV in minutes",
      "Removed the team from the loop entirely for every free audit requested",
      "Runs as a lead magnet on its own, with a clear next step into JobMingle's paid CV service",
    ],
    insight:
      "If the team was going to check the same fifteen things on every CV anyway, that process belonged in software, not in someone's afternoon.",
    liveUrl: "https://jobminglecv.vercel.app",
    images: [
      {
        src: "/images/cv-reviewer-hero.webp",
        alt: "CV Reviewer landing page: most CVs get rejected before a human ever reads them",
      },
      {
        src: "/images/cv-reviewer-results.webp",
        alt: "CV Reviewer scoring Omole's own resume 87 out of 100, Very Strong, with a section-by-section breakdown",
      },
    ],
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
