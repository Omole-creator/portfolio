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
  { value: "10,000+", label: "community members" },
  { value: "4,000+", label: "website users" },
  { value: "7", label: "products shipped with AI" },
  { value: "2", label: "grants won" },
  { value: "2", label: "recognitions" },
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
  "I am Omole, founder of JobMingle. I have spent the last few years building a business from the ground up, from growth and sales to product, community, partnerships, and operations.",
  "Most of our growth did not come from ad budgets. It came from building communities, creating content, partnerships, and finding ways to get people talking and pulling them in on their own. We turned on paid ads mainly when we wanted to fill a live cohort. Organic first, paid when it counts, that is how I think about growth.",
  "The part people do not expect is that I also build. When I was tired of manually tracking leads, I built a CRM. When I needed to see the company's finances clearly, I built a financial dashboard. When I saw a problem worth turning into a product, I built that too.",
  "I use AI tools like Claude Code to turn ideas into working products quickly, without waiting on a development team to free up.",
  "I am happy to work with startups and established businesses anywhere in the world, whether that is a growth role, a product or systems project, consulting, or a conversation about building something together.",
];

export const benefits = [
  "You get growth and the systems behind it, not just one or the other.",
  "Nothing ships in months when it can ship in days.",
  "You always know exactly where things stand, because I show you the numbers, not just a status update.",
  "I have run growth, product, and community myself, so nothing gets lost between people who do not talk to each other.",
  "I tell you when something will not work, before you spend money finding out.",
  "I have run a business myself, not just advised one.",
];

export const contrast = [
  {
    theirs: "Most growth people cannot build the tools they ask for.",
    mine: "I build them myself, with AI, in days.",
  },
  {
    theirs: "Most builders do not understand growth or sales.",
    mine: "I have closed deals, run ads, and grown a community past 10,000 people.",
  },
  {
    theirs: "Most agencies hand you a report.",
    mine: "I hand you the dashboard that makes the report unnecessary.",
  },
  {
    theirs: "Most freelancers disappear after the first win.",
    mine: "I stay close to the numbers and keep adjusting.",
  },
  {
    theirs: "Most people cannot build the automation a business needs to run well.",
    mine: "I build it myself, and wire it into how the business already works.",
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
    body: "I build communities people actually want to be in. The JobMingle community grew past 10,000 members across WhatsApp and Telegram, and it became the engine that brought in most of our customers.",
  },
  {
    title: "Running the whole growth operation, not just one piece of it",
    body: "I lead teams and set up the systems that keep the work moving day to day. I have run a 10-member team and the partnerships that came with it, not just the strategy behind them.",
  },
  {
    title: "Tools, systems, and dashboards built fast, with no engineering team needed",
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
  why: string[];
  approach: string[];
  beforeAfter: { before: string; after: string };
  highlights: string[];
  results: string[];
  insight: string;
  builtWith: string[];
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
    why: [
      "I switched from pharmacy into freelancing full time in 2022, and that experience showed me that it was possible to build a career outside the traditional path. But I also saw how difficult that transition could be for someone starting from scratch.",
      "People looking to switch careers often struggled to figure out what skills to learn, where to start, and how to turn those skills into real opportunities. For beginners trying to get into tech, the path could feel just as confusing, especially when they had little guidance, limited resources, or could not afford expensive training programs.",
      "Having gone through my own career transition, I wanted other people to have access to the same kind of opportunity. I wanted to help beginners learn practical tech skills and give career switchers a clearer path to building careers in the digital economy.",
      "That became the motivation behind JobMingle.",
    ],
    approach: [
      "Started with community first, built the WhatsApp and Telegram groups before there was a product to sell.",
      "Ran ads only once there was a live cohort to fill, and kept them tight enough to hit 16x.",
      "Built the CRM and Powerhouse myself, so the business ran on numbers I could see, not guesswork.",
      "My engineers built and maintain jobmingle.co, while I run growth, product direction, and the community.",
    ],
    beforeAfter: {
      before: "Beginners and career switchers who wanted to get into tech had to navigate a confusing path on their own, figuring out what to learn, where to learn it, how to build practical skills, and where to find opportunities afterwards. Learning, career guidance, and access to opportunities were often spread across different platforms and communities.",
      after: "JobMingle brings those pieces together in one ecosystem. A community of over 10,000 people can learn practical tech skills, get career support, and access job opportunities in one place. What started from my own experience of switching careers has grown into an edtech platform with training programs, a community, career services that have served over 200 clients, and a growth engine that has generated 16x ROAS on a live cohort.",
    },
    highlights: [
      "A community past 10,000 members across WhatsApp and Telegram that brings in most of our customers",
      "Cohort-based tech training programs, with ads run to fill each live cohort",
      "A career services line that helps young people with their CV, LinkedIn profile, and portfolio to land jobs",
      "Partnerships with EvolvateHR to hold JobMingle first career fair in September 2025",
    ],
    results: [
      "Grew a community past 10,000 members that brought in most of our customers",
      "Launched our first live cohort in April 2026 at a 16x return on ad spend",
      "Enrolled 22 students into tech training programs, with leads under $0.50 each",
      "Served over 200 clients through our career services line",
    ],
    insight: "I had made the switch myself. What beginners and career switchers needed was a clearer path, practical skills, and people willing to stick around once things got hard. Community made that journey less lonely, while giving people somewhere to learn, ask questions, and find opportunities together.",
    builtWith: ["Meta Ads", "WhatsApp", "Telegram", "Claude Code"],
    tags: ["Growth", "Marketing", "Operations", "Community", "Partnerships", "Since 2023"],
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
    why: [
      "For over 10 years, I watched my mom live with diabetes. Almost every day, she would call me with the same simple questions: What can I eat? Is this particular food safe for me?",
      "I got tired of not having a simple answer to give her. The problem was not that there was no diabetes nutrition advice. There was plenty of it. The problem was turning that advice into a clear decision about the Nigerian food sitting right in front of her.",
      "Jollof rice, eba, yam, beans, and other everyday foods came with uncertainty. She needed to know what she could eat, how much, what to eat it with, and how often, without having to guess every time she sat down to eat.",
      "I realised this was not just my mom's problem. People living with diabetes needed a simpler way to make everyday food decisions around the meals they actually eat.",
      "So I built GluFloat to answer the question I had heard from my mom for years: What can I eat?",
    ],
    approach: [
      "Built the recommendation engine first, so it could personalize meals around diabetes, other health conditions, and each user's daily calorie target.",
      "Built the TDEE calculator to determine each user's daily calorie needs, then used that target to shape personalized breakfast, lunch, and dinner recommendations.",
      "Added the food and glucose report generator, so users could take their data to their next doctor's appointment and have a more informed conversation.",
      "Built the trial and pricing flow last, keeping the product accessible enough that cost would not become another barrier to getting help.",
    ],
    beforeAfter: {
      before: "People living with diabetes could find general nutrition advice, but turning that advice into a decision about the Nigerian meal in front of them was still difficult. They had to figure out what to eat, how to eat it, and how often, often without guidance that accounted for their individual needs.",
      after: "GluFloat helps people living with diabetes make everyday food decisions without giving up the foods they love. It provides personalized recommendations for breakfast, lunch, and dinner, with adjustments for people managing conditions such as hypertension, high cholesterol, or kidney disease. Users can also generate food and glucose reports to take to their next doctor's appointment, helping enable more informed consultations.",
    },
    highlights: [
      "Personalized breakfast, lunch, and dinner recommendations every day, built around each user's health conditions and daily calorie target",
      "Uses a TDEE-based calorie target to help users manage how much they eat across the day, while still making room for the foods they love",
      "Generates food and glucose reports users can take to their next doctor's appointment, helping enable a better consultation",
      "Built the whole product with AI, from the recommendation engine to the trial and pricing flow",
      "Priced for everyday people, with a free trial and no card needed to start",
    ],
    results: [
      "7-day free trial with no card required, making it easy for people to try GluFloat without an upfront commitment",
      "Three plans, from GluFloat at ₦1,500/month to GluFloat Plus at ₦2,500/month and GluFloat Premium at ₦4,500/month",
      "Personalized daily recommendations across breakfast, lunch, and dinner, built around each user's calorie target and health conditions",
      "A food and glucose report users can take to their next doctor's appointment for a more informed consultation.",
    ],
    insight: "I built GluFloat because I had been hearing the same question for years: What can I eat? My mom did not need another generic list of foods to avoid. She needed an answer she could use every day, with the food she actually eats. I wanted to build that answer for her, and for people facing the same uncertainty.",
    builtWith: ["Claude Code", "Next.js", "AI recommendation engine"],
    tags: ["Health tech", "Built with Claude Code", "MVP", "Next.js"],
    liveUrl: "https://glufloat.vercel.app",
    images: [
      {
        src: "/images/glufloat-hero.webp",
        alt: "GluFloat landing page hero: Defy Diabetes, Enjoy Food Again, with personalized meal recommendations",
      },
      {
        src: "/images/glufloat-today.webp",
        alt: "GluFloat app showing today's recommended breakfast with calories and a note on when to take medication",
      },
    ],
  },
  {
    slug: "jobmingle-powerhouse",
    name: "JobMingle Powerhouse",
    kind: "The financial command center I built with AI",
    blurb:
      "A financial command center for my company. It brings every revenue line and expense into one place, automatically calculates the numbers as I add them, and shows me where the business is making and spending money.",
    why: [
      "I was tired of using Google Docs to manually track JobMingle's revenue and expenses. Every time I added a new figure, I had to do the calculations myself just to understand where the business stood.",
      "I wanted a simple way to see exactly where our money was coming from, which revenue lines were performing, and what was eating into the company's money, without having to dig through documents or calculate totals manually.",
      "The problem was not a lack of financial data. We had the numbers. The problem was turning those numbers into a clear picture of the business without spending unnecessary time putting everything together.",
      "So I built Powerhouse: a financial command center that automatically calculates the numbers as they are added and gives me a clear view of the company's revenue, expenses, and financial position.",
    ],
    approach: [
      "Pulled revenue and expenses from all four services into one place, instead of tracking them across separate documents.",
      "Built views that show what is bringing in the most money and what is consuming the most of it, so the answer is a glance, not a calculation.",
      "Added month-over-month and quarterly views, so I can spot changes and trends without manually comparing figures.",
      "Locked it behind a password, with offline access and one-click backups, since it holds the company's financial numbers.",
    ],
    beforeAfter: {
      before: "Tracking revenue and expenses meant manually updating Google Docs, calculating totals, and piecing different figures together just to understand how the business was performing.",
      after: "There is now one dashboard that automatically calculates the numbers and shows what is making money and what is consuming it, at a glance, with month-over-month and quarterly views built in.",
    },
    highlights: [
      "Tracks revenue across four services, plus expenses, commissions, and profit",
      "Shows what is bringing in the most money and what is consuming the most of it, at a glance",
      "Provides month-over-month and quarterly views for clearer reporting and trend tracking",
      "Automatically calculates totals as new figures are added",
      "Password protection, offline access, and one-click backups",
    ],
    results: [
      "Every revenue and expense line across four services is visible in one dashboard and updated as new figures are added",
      "Month-over-month and quarterly views are built in, rather than calculated manually",
      "Revenue, expenses, commissions, and profit can be understood without digging through separate documents",
      "One-click backups and offline access keep the company's financial data accessible and protected",
    ],
    insight: "I built Powerhouse because I wanted to stop spending time calculating numbers and start spending that time understanding them. Once everything lived in one dashboard, I could see where the money was coming from, where it was going, and make decisions with more confidence.",
    builtWith: ["Claude Code", "Next.js", "Supabase"],
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
    name: "JobMingle CRM",
    kind: "The CRM and operations agent I built with AI",
    blurb:
      "The CRM my team runs on every day. It captures every lead straight from the Meta and Google ad forms I run, automatically assigns them to sales closers, tracks follow-up through to an outcome, won or lost, and handles tutor-recorded attendance, reports, and certificates on the side.",
    why: [
      "I was manually tracking every lead coming from my Meta and Google ad campaigns, following up with people, and trying to keep track of where each conversation stood. I was doing all of it myself, and as the number of leads grew, it became exhausting.",
      "I knew I needed to bring in sales closers, but handing over the leads created a new problem: I needed a way to know who was handling each lead, whether they were following up, how they were performing, and what was happening to every opportunity without having to manage everything myself.",
      "I did not want to replace my own manual tracking with another spreadsheet or depend on constant updates from the team. I needed a system that could capture leads automatically, distribute them to closers, and give me visibility into what was happening.",
      "So I built JobMingle CRM to take the manual work out of lead management and give me a clear view of the entire sales process.",
    ],
    approach: [
      "Connected the Meta and Google ad lead forms directly to the CRM, so every new lead enters the system automatically without manual entry.",
      "Built round-robin assignment to distribute leads evenly across sales closers, with an email notification sent as soon as a lead is assigned.",
      "Gave each closer a dashboard to manage follow-ups, while making their activity and performance visible from the admin section.",
      "Built attendance into the system, allowing tutors to record student attendance and have it reflected directly in the admin dashboard.",
      "Added automated marketing emails to keep leads engaged throughout the sales process.",
    ],
    beforeAfter: {
      before: "I was manually capturing and tracking leads, following up with them myself, and trying to keep track of every conversation alone. As the volume grew, it became exhausting and difficult to know what was happening across the pipeline.",
      after: "Leads now enter the CRM automatically, get distributed to sales closers, and remain visible throughout the pipeline. Closers manage their follow-ups from their own dashboards, while I can monitor their activity, performance, payments, and outcomes from admin.",
    },
    highlights: [
      "Captures every lead directly from the Meta and Google ad forms I run, with no manual entry",
      "Distributes leads evenly across sales closers and sends an email notification when one is assigned",
      "Gives closers their own dashboard to manage follow-ups and track their activity",
      "Makes closer activity and performance visible from the admin section",
      "Lets tutors record student attendance for every class, with attendance reflected directly to admin",
      "Sends automated marketing emails to leads",
      "Tracks the full pipeline from new lead to won or lost, including payment tracking",
      "Generates a one-page outcomes report for grant applications",
    ],
    results: [
      "Every lead now enters the system automatically and is assigned to a sales closer within moments",
      "I no longer have to manually track every lead or personally manage every follow-up",
      "The entire sales pipeline is visible from one place, including closer activity, payments, and outcomes",
      "A one-page outcomes report can be generated for grant applications",
    ],
    insight: "I built the CRM because I was tired of being the system. I wanted to bring in sales closers without losing visibility into what was happening with the leads I had worked so hard to generate. The CRM gave me a way to delegate the work while still seeing what was happening.",
    builtWith: ["Claude Code", "Next.js", "Prisma", "Meta Ads", "Google Ads"],
    tags: ["Built with Claude Code", "Next.js", "Prisma"],
    liveUrl: "https://jobmingleleads.vercel.app",
    images: [
      {
        src: "/images/leads-overview.webp",
        alt: "JobMingle CRM dashboard with lead totals and pipeline charts, figures redacted",
      },
      {
        src: "/images/leads-report.webp",
        alt: "JobMingle CRM training outcomes report page, figures redacted",
      },
    ],
  },
  {
    slug: "waterbrooks-technologies",
    name: "WaterBrooks Technologies",
    kind: "The marketing site I built in 24 hours",
    blurb:
      "WaterBrooks is an agritech company helping African farmers cut post-harvest losses with solar-powered food preservation. Two developers were already paid to build their site and never delivered, so I built it myself in 24 hours, from the hero that tells the story to the pages that turn visitors into partners.",
    why: [
      "WaterBrooks had no website, despite having a story worth putting in front of farmers, funders, and potential partners: solar-powered food preservation designed to help African farmers reduce post-harvest losses.",
      "The founder had already paid two different developers to build the site, but neither project was delivered. Months had passed, and WaterBrooks still had no digital home where people could understand what the company was building or see the traction it had already achieved.",
      "The problem was no longer just building a website. It was getting the company's story and progress in front of the people who needed to see it.",
      "So I stepped in and built the entire marketing site myself in 24 hours.",
    ],
    approach: [
      "Sat with the founder to understand the story and translate the company's work in solar-powered food preservation into clear, simple language.",
      "Designed and built the entire marketing site in 24 hours, from the hero section through to the traction and contact sections.",
      "Put the company's existing traction up front, including farmers reached, land secured, the pitch win, and accelerator backing.",
      "Built the site around a clear Partner With Us call to action, giving potential partners an obvious next step.",
    ],
    beforeAfter: {
      before: "WaterBrooks had no website months after paying two developers to build one. The company had no central place to tell its story, showcase its traction, or give farmers, funders, and potential partners somewhere to learn more.",
      after: "WaterBrooks had a complete marketing site live within 24 hours, clearly explaining what the company does and putting its existing traction in front of the people who needed to see it.",
    },
    highlights: [
      "Designed and built the full marketing site with AI, from the hero through to the traction and contact sections",
      "Makes the story clear: solar-powered food preservation built for African farms",
      "Puts existing traction up front, from farmers reached to land secured and accelerator backing",
      "Uses a clear Partner With Us call to action to guide potential partners toward taking action",
    ],
    results: [
      "Delivered a complete marketing site in 24 hours, after two previous developers failed to deliver",
      "Gave WaterBrooks a digital home that showcases its existing traction, including over 200 farmers reached and 18 land plots secured worth roughly $20,000",
      "Showcases the ₦1.5M Favoured Fund Pitch win and backing from two accelerators, Clean Tech Hub and Shecluded",
    ],
    insight: "The site did not need another promise to build it. It needed someone to take ownership and finish the job. I focused on getting WaterBrooks live quickly, then making sure the site communicated what the company had already achieved clearly and credibly.",
    builtWith: ["Claude Code", "Next.js", "Web design"],
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
      "A paid product I wrote, designed, and built. The ebook gives small business owners practical words and scripts for handling common buyer objections, while the website sells the product end to end.",
    why: [
      "I kept seeing the same problem with small business owners: they could get a potential customer interested, but the conversation often stalled when the buyer raised an objection.",
      "Let me get back to you. I need to think about it. It's too expensive. These moments did not necessarily mean the buyer was no longer interested. Often, the seller simply did not know what to say next.",
      "I realised that many sellers were learning how to market and attract customers without learning what to do when those customers hesitated. They were improvising responses at the exact moment when having the right words mattered most.",
      "So I created the Sales Objections Toolkit: a practical resource that gives sellers a simple framework and ready-to-use scripts for handling the objections they hear most often.",
    ],
    approach: [
      "Wrote the ebook first, including the A.V.Q. method and scripts for five of the most common sales objections.",
      "Created ready-to-use scripts for WhatsApp, Instagram, and Messenger, along with a seven-day follow-up sequence.",
      "Designed and built a one-page sales site around a single offer, with checkout handled through Selar.",
      "Priced the product to make it an easy purchase for small business owners, backed by a 30-day refund guarantee.",
    ],
    beforeAfter: {
      before: "Sellers reached the point where a buyer raised an objection and had to improvise what to say next, often leaving the conversation to go cold.",
      after: "Sellers have a simple framework, ready-to-use objection scripts across WhatsApp, Instagram, and Messenger, and a seven-day follow-up sequence they can use when a buyer hesitates.",
    },
    highlights: [
      "Provides a simple three-step method for handling five common sales objections",
      "Includes ready-to-use scripts for WhatsApp, Instagram, and Messenger",
      "Includes a seven-day follow-up sequence for hesitant buyers",
      "Written, designed, and built by me, including the sales website and checkout flow",
    ],
    results: [
      "Turned an idea into a complete paid digital product, from the ebook and sales copy to the website and checkout experience.",
      "Built a working sales funnel that takes a customer from the landing page through checkout without manual intervention.",
      "Launched the product at ₦5,000, with a 30-day refund guarantee to reduce the risk of trying it.",
    ],
    insight: "A buyer's objection is often a question they need answered before they feel ready to buy. I wanted to give sellers those answers in advance, so they could stop improvising and handle hesitation with confidence.",
    builtWith: ["Claude Code", "Next.js", "Selar", "Copywriting"],
    tags: ["Built with Claude Code", "Copywriting", "Next.js"],
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
    kind: "A free tool I built for JobMingle",
    blurb:
      "A free CV review tool I built for JobMingle. Instead of manually reviewing CVs for people who wanted a free audit, I built a tool that runs our 15-point CV checklist in minutes and gives users an immediate assessment.",
    why: [
      "JobMingle was getting tired of manually reviewing CVs for people who wanted a free CV audit. Every review took time, and the same checks had to be repeated over and over.",
      "We already had a 15-point checklist we used when reviewing and writing CVs for paying clients, but there was no reason that process had to stay manual for every free review.",
      "I wanted people to get useful feedback immediately, without waiting for someone on the team to review their CV.",
      "So I built a self-serve CV reviewer that runs the same checklist in minutes and gives people a clear score and actionable feedback.",
    ],
    approach: [
      "Turned the 15-point CV checklist we already use for paying clients into a repeatable review process.",
      "Built a simple upload experience that accepts PDF, Word, PNG, and JPG files.",
      "Built the review engine to assess the CV against the checklist and return a score with clear explanations in plain English.",
      "Made the experience self-serve, with no signup required and no CV stored, so users can get their audit immediately while keeping their documents private.",
    ],
    beforeAfter: {
      before: "Free CV reviews had to be handled manually, taking time from the team and requiring the same checks to be repeated for each person.",
      after: "Anyone can upload their CV and get an immediate assessment against the same 15-point standard we use for paying clients, without waiting for a manual review.",
    },
    highlights: [
      "Reviews CVs against a 15-point industry-standard checklist",
      "Accepts PDF, Word, PNG, and JPG files",
      "Provides a score from 0 to 100 with clear explanations of what the score means",
      "Shows users where their CV needs improvement in plain English",
      "Requires no signup",
      "Does not save uploaded CVs",
      "Gives users the option to fix their CV themselves or use JobMingle's CV service",
    ],
    results: [
      "Turned a repetitive manual CV review process into a self-serve product that delivers feedback in minutes.",
      "Made the free CV audit available without requiring someone from the JobMingle team to manually review every submission.",
      "Created a privacy-first experience where CVs stay on the user's device and are not saved.",
    ],
    insight: "If we were going to review the same things in every CV anyway, I knew we could turn that process into a tool. The goal was simple: let people get useful feedback in minutes, while freeing the team from doing the same manual review over and over.",
    builtWith: ["Claude Code", "Next.js"],
    tags: ["Built with Claude Code", "Next.js", "JobMingle"],
    liveUrl: "https://jobminglecv.vercel.app",
    images: [
      {
        src: "/images/cv-reviewer-hero.webp",
        alt: "CV Reviewer landing page: most CVs get rejected before a human ever reads them",
      },
      {
        src: "/images/cv-reviewer-score.webp",
        alt: "CV Reviewer audit score card showing a score out of 100",
      },
    ],
  },
  {
    slug: "designs-konstruct",
    name: "Designs & Konstruct",
    kind: "A professional website I built",
    blurb:
      "A professional website I built for Designs & Konstruct to give the company a stronger online presence, make it easier for potential customers to find them on Google, and create a digital foundation they could grow with.",
    why: [
      "Designs & Konstruct was ready to scale, but its online presence was not keeping up with where the business wanted to go.",
      "The company needed more than just somewhere to put its information. It needed a professional website that would make the business look credible to potential customers and give it a stronger presence when people searched for its services on Google.",
      "So I built the website to give Designs & Konstruct a professional home online and a foundation for its next stage of growth.",
    ],
    approach: [
      "Built the website around the services Designs & Konstruct offers, making it clear what the company does from the moment someone lands on the site.",
      "Designed the experience to feel professional and credible, so the website reflects the quality of the business behind it.",
      "Structured the site to give potential customers a clear path from discovering the company to understanding its services and getting in touch.",
      "Built the website with search visibility in mind, giving Designs & Konstruct a stronger foundation for being discovered on Google.",
    ],
    beforeAfter: {
      before: "Designs & Konstruct had limited online presence and no professional website to properly represent the business or support its plans to scale.",
      after: "The company now has a professional website that communicates its services clearly, strengthens its online presence, and gives potential customers a place to discover and engage with the business.",
    },
    highlights: [
      "Presents Designs & Konstruct's services in a professional, easy-to-understand way",
      "Gives potential customers a clear place to learn about the company and its work",
      "Creates a stronger online presence for the business",
      "Provides a foundation for search visibility on Google",
      "Gives the company a professional digital home it can build on as it scales",
    ],
    results: [
      "Gave Designs & Konstruct a professional website to support its next stage of growth",
      "Created a stronger online presence where potential customers can discover and learn about the business",
      "Built a digital foundation designed to support visibility on Google and future growth",
    ],
    insight: "A business that is ready to scale needs its online presence to look and work like the business it is becoming. I built Designs & Konstruct a website that could do that job, while giving the company room to grow.",
    builtWith: ["Claude Code", "Next.js"],
    tags: ["Built with Claude Code", "Next.js", "Web design"],
    liveUrl: "https://designskonstruct.com",
    images: [
      {
        src: "/images/designs-konstruct-hero.webp",
        alt: "Designs & Konstruct landing page hero: glass work built to outlast the building around it",
      },
      {
        src: "/images/designs-konstruct-traction.webp",
        alt: "Designs & Konstruct traction section showing projects completed, success rate, quote response time, and trusted-by clients",
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
    title: "For startups, agencies, SaaS, and ecommerce businesses ready to scale",
    body: "I help these businesses grow, through community, content, paid acquisition, or the systems that keep it all running. For startups specifically, I am also open to advisor and founding-team roles, not just project work.",
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
