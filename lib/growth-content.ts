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
  { value: "<$1", label: "cost per lead" },
  { value: "462", label: "leads from a single Meta Ads campaign" },
];

export const growthAbout = [
  "I ran growth for JobMingle, an edtech platform that helps career switchers build practical tech skills and find jobs. Over the past few years I have worked across community, content, paid ads, and the marketing systems behind all of it.",
  "Community and paid ads are two separate channels I run side by side, not one feeding the other. Every cohort gets promoted directly to the community, and I run Meta ad campaigns in parallel to bring in fresh leads for that same cohort, with targeting and creative tight enough to turn a single campaign into 462 leads and a 16x return on ad spend.",
  "I also set up the systems that keep leads from falling through. When leads from Meta and Google ads needed to be captured and followed up fast, I wrote a Google Apps Script that pulls each one into the CRM automatically. When a free CV review was taking up hours of the team's time every week, I built a tool that runs the same checklist in minutes, turning a manual process into a lead magnet that works on its own.",
  "I am happy to take on growth marketing roles or projects for startups and businesses anywhere in the world, whether that means running paid acquisition, building a community, writing the copy that converts, or fixing the systems leads keep falling through.",
];

export const growthServices = [
  {
    title: "Getting customers to show up without a big ad budget first",
    body: "I bring customers to businesses that need them. Most of the growth I have driven came from community, content, and partnerships, and I turn on Meta, Google, or TikTok ads once there is something worth spending on. What I care about is paying customers, not vanity numbers.",
  },
  {
    title: "Words that turn a hesitant buyer into a paying one",
    body: "I write the words that sell, from ads and sales pages to emails and blog posts. That copywriting helped enroll students into JobMingle's first cohort at a 16x return on ad spend.",
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
  liveUrl?: string;
  linkLabel?: string;
  images: { src: string; alt: string }[];
};

export const growthWork: GrowthProject[] = [
  {
    slug: "jobmingle",
    name: "JobMingle",
    kind: "Growth for an edtech platform",
    why: [
      "JobMingle needed to turn career switchers and beginners into paying students, and that meant running two separate channels well: a community that already trusted the brand, and paid ads that could reach people the community never would.",
      "Treating ads as an afterthought, or expecting the community to carry a launch on its own, both leave leads on the table. Every cohort needed its own community push and its own ad campaign, running side by side, not one standing in for the other.",
    ],
    approach: [
      "Grew a community on WhatsApp and Telegram as its own channel, and used it to promote every new cohort directly to people who already knew the brand.",
      "Ran Meta ad campaigns as a separate channel, in parallel, to bring in fresh leads for that same cohort from people the community never reaches.",
      "Kept targeting and creative tight enough to turn a single campaign into 462 leads and a 16x return on ad spend.",
    ],
    results: [
      "Generated 462 leads at under $1 each from a single Meta Ads campaign",
      "Hit a 16x return on ad spend on the first live cohort launch",
      "Grew a community past 10,000 members across WhatsApp and Telegram that brought in most new customers",
    ],
    insight:
      "Community and paid ads are not the same lever, so I do not treat them like one. Each cohort gets promoted straight to the community, and a separate ad campaign runs alongside it to reach the people the community cannot, both aimed at filling the same seats.",
    liveUrl: "https://jobmingle.co",
    images: [
      {
        src: "/images/jobmingle-hero.webp",
        alt: "JobMingle landing page hero, become the high earner you did not think you could, with the trusted partners strip below",
      },
      {
        src: "/images/jobmingle-fb-results.webp",
        alt: "Meta Ads Manager showing JobMingle campaign results across four ad sets, including results, cost per result, budget, amount spent, and impressions",
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
      "Wrote a Google Apps Script that watches the inbox for the notification email every new Meta or Google ad lead triggers, and enters that lead into the CRM automatically.",
      "Built round-robin assignment to distribute leads evenly across closers, with an instant email notification the moment one lands.",
      "Gave each closer their own dashboard, while keeping their activity, performance, and outcomes visible from admin.",
    ],
    results: [
      "Every lead is pulled into the CRM and assigned to a closer within moments of the ad platform's notification email, instead of waiting for someone to enter it by hand",
      "The full pipeline is visible from one place, including closer activity, payments, and outcomes, won or lost",
      "Automated marketing emails keep leads engaged through the pipeline without manual follow-up",
    ],
    insight:
      "A lead that sits for a day is a lead that has probably already found someone else. The system exists to make sure that never happens, so the ad spend that brought the lead in is not wasted after the click.",
    liveUrl: "https://jobmingleleads.vercel.app",
    images: [
      {
        src: "/images/jobmingle-crm-overview.webp",
        alt: "JobMingle CRM overview dashboard showing total leads, pipeline status, close rate, and commission for a live cohort",
      },
      {
        src: "/images/jobmingle-crm-pipeline.webp",
        alt: "JobMingle CRM charts showing leads by source and pipeline by stage for a live cohort",
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
      "Wrote a simple three-step method and ready-to-use scripts for the five objections sellers hear most often, across WhatsApp, Instagram, and Messenger, plus a seven-day follow-up sequence.",
      "Designed and wrote a one-page sales site around a single offer, with checkout handled through Selar.",
      "Priced it to be an easy yes and backed it with a 30-day refund guarantee, so trying it carried almost no risk.",
    ],
    results: [
      "Turned an idea into a complete paid product: the ebook and scripts, the sales site, and the checkout, all live and working end to end",
      "Built a working sales funnel that takes a customer from the landing page through checkout with no manual step in between",
      "Gives sellers a three-step method and scripts for the five objections they hear most, ready to use the same day",
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
  {
    slug: "belly-fat-product",
    name: "Belly Fat Product",
    kind: "Performance marketing for a self-funded D2C health product",
    why: [
      "Belly fat is one of the most searched, most anxious health problems people try to solve, which also makes it one of the most crowded and skeptical markets to sell into on Meta. Generic claims get scrolled past, and buyers have already seen enough bad ads to distrust anything vague.",
      "I ran this campaign self-funded, on my own ₦10,000 daily ad budget, over nine months. That meant every naira had to earn its way back through an ad and a sales page I wrote myself, with no employer or client absorbing the loss if the offer did not convert.",
    ],
    approach: [
      "Wrote every ad, offer, and sales page myself, drawing on a clinical pharmacy background to turn the product's health claims into copy that read as credible rather than hype.",
      "Ran continuous creative testing and audience targeting on a fixed daily budget, cutting underperforming ads fast since there was no room to waste spend.",
      "Managed pay-on-delivery order operations end to end, from the ad click through to a confirmed order, including verifying each customer's delivery location before dispatch.",
    ],
    results: [
      "Generated 194 orders over nine months on a ₦10,000 daily ad budget",
      "Ran the full funnel solo: creative, targeting, copy, and pay-on-delivery order operations",
      "Verified delivery details for every order before dispatch, protecting margin on a self-funded budget",
    ],
    insight:
      "When it is your own budget on the line, every ad either earns its spend back or it gets cut, there is no campaign report to soften that. Nine months of that discipline is what 194 orders on ₦10,000 a day actually proves.",
    images: [
      {
        src: "/images/belly-fat-orders.webp",
        alt: "Gmail inbox showing order-confirmation emails for the belly fat product, each customer asked to confirm their delivery location",
      },
      {
        src: "/images/belly-fat-orders-2.webp",
        alt: "More order-confirmation emails for the belly fat product, further down the inbox",
      },
    ],
  },
  {
    slug: "rectixam",
    name: "Rectixam",
    kind: "Conversion copywriting for a herbal ulcer supplement",
    why: [
      "Rectixam Herbal Company was already running Meta ads for its ulcer supplement, but the sales copy behind them was not converting. The owner was paying for clicks that landed on a page that could not close the sale, which meant the ad spend itself was the thing losing money, not the traffic.",
      "He needed a new sales letter that could beat what he already had running, not just a rewrite, but copy proven to outperform the control he was already paying to send traffic to.",
    ],
    approach: [
      "Rewrote the sales letter from the offer up, testing the new version directly against the one already live rather than replacing it on faith.",
      "Designed new Facebook ad creatives to run alongside the new copy, aimed at the same audience the old creatives were losing.",
      "Wrote a second sales letter for the same product from a different angle, to see whether a fresh angle could pull even harder than the version already winning.",
    ],
    results: [
      "New sales copy outperformed the existing control by 9x within two weeks",
      "New ad creatives lifted ad clicks by 25%",
      "Delivered two high-converting sales letters for the same product, each built around a different angle",
    ],
    insight:
      "A control tells you what already works, so beating one is not about writing good copy in a vacuum, it is proving your version pulls harder than what is already live. That is what actually convinced the owner to stop paying for the version that could not close.",
    liveUrl:
      "https://docs.google.com/document/d/16de8bw3SQ9L0CgvZ3_0PVAPjJgAb7rs5/edit?usp=drive_link",
    linkLabel: "Visit the copy",
    images: [],
  },
];

export const growthDifference = [
  {
    theirs: "Most growth marketers hand the tech off to someone else.",
    mine: "I build the lead-capture systems myself, so nothing falls through after the ad spend.",
  },
  {
    theirs: "Most people can run ads or write copy, rarely both.",
    mine: "I write the copy and run the ads that copy sits behind.",
  },
  {
    theirs: "Most agencies report the numbers after the campaign ends.",
    mine: "I build the dashboard that shows the numbers while the campaign is still running.",
  },
  {
    theirs: "Most growth marketers stop at the click.",
    mine: "I follow the lead all the way to a closed sale or a lost one, and fix what is in between.",
  },
];

export const growthProcess = [
  {
    title: "We talk numbers first",
    body: "Book a call or send a message. I want to know your current cost per lead, your funnel, and what is actually not working, not just what you think you need.",
  },
  {
    title: "I find where the growth actually is",
    body: "Sometimes that is a community and content before ads. Sometimes it is tightening a Meta campaign that is already running. I tell you which, and why, before we spend a naira.",
  },
  {
    title: "I run it, and show you the numbers as they move",
    body: "I own the campaigns, the copy, and the systems that catch the leads, and you see the cost per lead and the pipeline the whole way, not just a report at the end.",
  },
  {
    title: "We keep what works and cut what does not",
    body: "Growth is not a one-time launch. I stay close to the numbers and adjust the targeting, the creative, or the offer as we go.",
  },
];

export const growthTechnicalSkills = [
  "Paid Social Advertising (Meta Ads Manager, TikTok, Google Ads)",
  "Lead Generation & Funnel Optimization",
  "Conversion Copywriting",
  "Email Marketing (Kit)",
  "Community Growth & Engagement",
  "Google Analytics 4",
  "AI-Assisted Marketing Ops (Claude Code)",
  "Project Management (ClickUp, Asana, Slack)",
];

export const growthSoftSkills = [
  "Team Leadership",
  "Cross-Functional Collaboration",
  "Persuasive Communication",
  "Resourcefulness Under Budget Constraints",
  "Adaptability Across Roles",
];

export const growthCertifications = [
  { name: "The Essentials of Growth Marketing", issuer: "Udemy", year: "2026" },
  { name: "Marketing Tools: Growth Marketing", issuer: "LinkedIn Learning", year: "2026" },
  { name: "Growth Marketing Foundations", issuer: "LinkedIn Learning", year: "2026" },
  { name: "Digital Marketing Foundations", issuer: "LinkedIn Learning", year: "2026" },
];

export const growthResume = {
  eyebrow: "Resume",
  title: "Download my CV",
  buttonLabel: "Download CV",
  href: "/omole-usuangbon-growth-marketing-cv.pdf",
};

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
