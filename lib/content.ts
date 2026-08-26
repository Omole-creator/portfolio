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
      "Getting into tech in Nigeria was never just difficult, it was a gate that stayed closed for anyone without the right connections or the money for a twelve week bootcamp most people could not afford. Talented, hungry people applied for roles they were capable of doing and heard nothing back, over and over, until they stopped trying.",
      "The people losing out were not short on ability. They were short on access, and on anyone willing to stand behind them long enough to get through the hard part. Every year that gap stayed open, more people gave up on tech altogether, not because they could not do the work, but because nobody gave them a real shot at it.",
      "I had lived close enough to that frustration to know it was solvable. It needed a cheaper way in, and a community that would not let anyone quit alone, so I built JobMingle to be exactly that.",
    ],
    approach: [
      "Started with community first, built the WhatsApp and Telegram groups before there was a product to sell.",
      "Ran ads only once there was a live cohort to fill, and kept them tight enough to hit 16x.",
      "Built the CRM and Powerhouse myself, so the business ran on numbers I could see, not guesswork.",
      "My engineers built and maintain jobmingle.co, while I run growth, product direction, and the community.",
    ],
    beforeAfter: {
      before: "Getting into tech meant knowing the right person, saving up for a bootcamp most people could not afford, or applying into a silence that could go on for months. There was no single place to learn, get feedback, and actually be seen by someone hiring.",
      after: "A community past 9,700 people learning and getting placed together, with training, an ads engine that hits 16x on a live cohort, and a career services line that has now served over 200 clients, all running under one roof instead of scattered across a dozen disconnected efforts.",
    },
    highlights: [
      "A community past 9,700 members across WhatsApp and Telegram that brings in most of our customers",
      "Cohort-based tech training programs, with ads run to fill each live cohort",
      "A career services line that takes people from training to actually getting hired",
      "Partnerships with EvolvateHR, Ternkonnect, Your Study Path, and Cudose",
    ],
    results: [
      "Grew a community past 9,700 members that brought in most of our customers",
      "Launched our first live cohort in April 2026 at a 16x return on ad spend",
      "Enrolled 22 students into tech training programs, with leads under $0.50 each",
      "Served over 200 clients through our career services line",
    ],
    insight: "The real gap was never talent. It was access, and a support system that did not disappear the moment things got hard. Community closed that gap faster and cheaper than any ad campaign could.",
    builtWith: ["Meta Ads", "WhatsApp", "Telegram", "Claude Code"],
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
    why: [
      "A diabetes diagnosis rewrites more than a chart, it rewrites what a person is allowed to enjoy. Jollof rice turns into a threat. Eba turns into a gamble. Food that used to mean family and celebration suddenly comes loaded with fear, and the advice most people get is a vague warning to watch what they eat, with no real answer for the plate in front of them.",
      "Left without guidance, plenty of people did the only safe thing they could think of: they picked one meal and ate it every single day, for years, just to avoid the anxiety of guessing wrong. That is not a diet, that is a life shrunk down to avoid a mistake nobody had explained how to prevent.",
      "Nothing built for Nigerian food gave a straight answer, so I built GluFloat to be the answer nobody else had bothered to give.",
    ],
    approach: [
      "Built the recommendation engine first, so it could weigh a food against a diagnosis and any other health condition.",
      "Wrapped it in a checker anyone could use in seconds, for breakfast, lunch, or dinner.",
      "Added the report generator, so a doctor's visit starts with data already in hand.",
      "Built the trial and pricing flow last, priced low enough that cost is never the reason someone does not try it.",
    ],
    beforeAfter: {
      before: "Guessing whether jollof, eba, or whatever was on the stove that night was safe, or giving up entirely and eating the same one dish every day out of fear, with no doctor's appointment lined up to check any of it.",
      after: "A personalized answer for breakfast, lunch, and dinner, adjusted for any other health condition in the mix, plus a food and glucose report ready to bring to the next doctor's appointment instead of a shrug and a guess.",
    },
    highlights: [
      "Personalized meal recommendations for breakfast, lunch, and dinner, adjusted for other health conditions too",
      "Generates a food and glucose report to bring to your next doctor's appointment, for a better consultation",
      "Built the whole product with AI, from the recommendation engine to the trial and pricing flow",
      "Priced for everyday people, with a free trial and no card needed to start",
    ],
    results: [
      "7-day free trial, no card required, so cost is never the reason someone does not try it",
      "₦1,500 a month after the trial, priced below a single clinic visit",
      "Personalized recommendations across breakfast, lunch, and dinner, plus a doctor-ready report",
    ],
    insight: "Telling someone to eat healthy is not guidance, it is a shrug. The only thing that actually helps is a direct answer for the exact meal in front of them, which is why GluFloat starts from the food, not a generic diet plan.",
    builtWith: ["Claude Code", "Next.js", "AI recommendation engine"],
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
    why: [
      "There is a specific kind of dread that comes from opening five spreadsheets to answer one question: are we actually making money this month? Revenue lived in one tab, expenses in another, and a commission figure was usually buried in a WhatsApp message from three weeks ago.",
      "By the time all of it was pieced together, the number was already out of date, and a decision that needed to happen that day got delayed instead. I was running a company on guesswork dressed up as bookkeeping, trusting a total I could not fully explain if someone asked me to.",
      "I got tired of not trusting my own numbers, so I built Powerhouse to give me an answer I could actually stand behind.",
    ],
    approach: [
      "Pulled revenue and expenses from all four services into one place, instead of four spreadsheets.",
      "Built views for what is bringing in the most money and what is consuming the most of it, so the answer is a glance, not a calculation.",
      "Added month over month and quarterly views, so trends show up before they become problems.",
      "Locked it behind a password, with offline access and one click backups, since it holds the company's numbers.",
    ],
    beforeAfter: {
      before: "Answering 'are we making money' meant opening several spreadsheets, cross-checking a commission figure against a chat message, and still not being fully sure the total was current by the time anyone acted on it.",
      after: "One dashboard that shows what is making money and what is draining it, at a glance, with month over month and quarterly views built in, offline access, and one click backups since it holds the company's own numbers.",
    },
    highlights: [
      "Tracks revenue across four services, plus expenses, commissions, and profit",
      "Shows what is bringing in the most money, and what is consuming the most of it, at a glance",
      "Month over month and quarterly growth views for clean reporting",
      "Password protection, offline access, and one click backups",
    ],
    results: [
      "Every revenue and expense line across 4 services visible in one dashboard, updated live",
      "Month over month and quarterly views built in, not stitched together by hand",
      "One click backups and offline access, since it holds the company's numbers",
    ],
    insight: "A business does not need more spreadsheets, it needs one place that never lies. Once I stopped trusting memory and manual entry, decisions got faster and a lot less stressful.",
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
      "The CRM my team runs on every day. It captures every lead straight from the Meta and Google ad forms I run, moves it through follow up to an outcome, won or lost, and handles tutor-recorded attendance, reports, and certificates on the side.",
    why: [
      "Bringing in sales closers to handle the leads pouring in from our ad campaigns should have solved the problem. For a while it did, until the cracks started showing. Leads sat untouched for hours because nobody was sure whose turn it was to follow up.",
      "Two closers would message the same person on the same day, or worse, a lead would go completely untouched and nobody would notice until it was too cold to save. I had no way to see who was actually working a lead, who was falling behind, or where a sale was quietly slipping away.",
      "Hiring more people was never going to fix a handoff that was broken by design, so I built the CRM to own that handoff completely.",
    ],
    approach: [
      "Connected the Meta and Google ad lead forms straight into the system, so every lead lands automatically, nothing typed in by hand.",
      "Built round robin assignment, so every lead reaches a sales closer evenly, with an email notification sent the moment it happens.",
      "Gave each closer a dashboard to log their follow up, with performance tracked and visible from the admin section.",
      "Built attendance into the system, so tutors record which students show up to class, and it reflects straight to admin.",
      "Added automatic marketing emails sent out to leads.",
    ],
    beforeAfter: {
      before: "Leads sitting untouched for hours, sometimes getting messaged by two closers on the same day, sometimes not getting messaged at all, with no way for anyone to see where a lead had gone quiet or who had dropped the ball.",
      after: "Every lead assigned evenly and instantly the moment it lands, followed up on a dashboard with performance tracked, tutor-recorded attendance reflected straight to admin, and every step of the pipeline visible from the top, all the way to an outcome, won or lost.",
    },
    highlights: [
      "Captures every lead straight from the Meta and Google ad forms I run, no manual entry",
      "Splits leads evenly across sales closers, with an email notification the moment one lands",
      "Closers follow up on their own dashboard, with performance tracked there too",
      "Everything a closer does is visible and monitored from the admin section",
      "Tutors record student attendance for every class, and it reflects straight to admin",
      "Automatic marketing emails sent out to leads",
      "A full pipeline from new lead through to an outcome, won or lost, with payment tracking, plus a one page outcomes report for grant applications",
    ],
    results: [
      "Every lead assigned within moments of arriving, evenly, with zero manual entry",
      "A full pipeline tracked from new lead to outcome, with payment tracking built in",
      "A one page outcomes report used for grant applications",
    ],
    insight: "A CRM is not really about storing contacts, it is about making sure a handoff never silently fails. Once every step was visible from admin, leads stopped disappearing.",
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
    kind: "A marketing site I built with AI",
    blurb:
      "WaterBrooks is an agritech company helping African farmers cut post-harvest losses with solar-powered food preservation. I designed and built their marketing site, from the hero that tells the story to the pages that turn visitors into partners.",
    why: [
      "WaterBrooks was solving a problem worth taking seriously: solar powered cold storage that could cut the losses smallholder farmers face after harvest, sometimes losing most of what they grew before it ever reached a buyer. You would never have known any of that from their old website.",
      "A farmer or a funder landing on the site had no clear idea what the company did, what it had already proven, or why any of it mattered. A mission that serious was getting buried under a homepage that said almost nothing, and every visitor who left confused was a partnership that never got the chance to start.",
      "A story that important deserved better than a confusing homepage, so I sat with the founder, got the story straight, and built a site that finally said it plainly.",
    ],
    approach: [
      "Sat with the founder to get the story straight: solar powered food preservation, for African farms, in plain language.",
      "Designed and built the site around that story, from the hero down to the traction numbers.",
      "Put the traction up front, farmers reached, land secured, the pitch win, the accelerator backing.",
      "Built the whole thing around one Partner With Us button, so the right people know exactly what to do.",
    ],
    beforeAfter: {
      before: "A homepage that never explained what WaterBrooks actually did, so a farmer or a funder had to guess at the mission and usually left before finding out, taking a potential partnership with them.",
      after: "A clear story from the hero down: solar powered food preservation for African farms, with the traction up front, over 200 farmers reached, 18 land plots secured, a pitch win, and accelerator backing, all leading to one obvious Partner With Us button.",
    },
    highlights: [
      "Designed and built the full marketing site with AI, from the hero down to the traction and contact sections",
      "Made the story land: solar-powered food preservation built for African farms",
      "Put their traction up front, from farmers reached to land secured and accelerator backing",
      "Built around a clear Partner With Us call to action so the right people get in touch",
    ],
    results: [
      "Over 200 farmers reached",
      "18 land plots secured, worth roughly $20,000",
      "Winner of the ₦1.5M Favoured Fund Pitch",
      "Backed by 2 accelerators: Clean Tech Hub and Shecluded",
    ],
    insight: "Impact does not sell itself if nobody can understand it in five seconds. Clarity mattered more here than clever design.",
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
      "A paid product I wrote, designed, and built. The ebook hands small business owners the exact words to turn a hesitant buyer into a sale, and the website sells it end to end.",
    why: [
      "The same scene kept playing out for small business owners across Nigeria. A seller does everything right, gets a serious buyer interested, and then hears the four words that kill more sales than any competitor ever could: let me get back to you.",
      "The buyer disappears. The seller assumes the deal is dead and moves on, when in reality the sale was often one honest reply away from closing. Multiply that across every hesitant buyer a business talks to in a month, and it adds up to revenue quietly walking out the door, again and again, with nobody teaching sellers what to actually say to stop it.",
      "Most sellers had never been taught the words that work in that exact moment, so I wrote them down and built a way to put them in their hands.",
    ],
    approach: [
      "Wrote the ebook first: the A.V.Q. method, and scripts for the five most common objections.",
      "Built scripts for WhatsApp, Instagram, and Messenger, plus a seven day follow up sequence.",
      "Built a one page site around a single offer, with checkout through Selar.",
      "Priced it to remove the excuse not to try it, with a refund guarantee behind it.",
    ],
    beforeAfter: {
      before: "A hesitant buyer goes quiet, the seller has no script for that exact moment, and a sale that was one honest reply away from closing just dies, with the seller never quite sure what they could have said differently.",
      after: "A simple three step method, ready to use scripts for WhatsApp, Instagram, and Messenger, and a seven day follow up sequence that turns that same silence into a sale instead of a lost deal.",
    },
    highlights: [
      "Wrote the ebook myself: a simple three step method for the five most common objections",
      "Scripts for WhatsApp, Instagram, and Messenger, plus a seven day follow up",
      "Built and sold the website end to end, with checkout through Selar",
      "I also build lead magnets like this one, if that is something your business needs",
    ],
    results: [
      "One sales letter using this method beat the control by 9x in two weeks",
      "Launch priced at ₦5,000, down from a ₦27,000 full value",
      "Backed by a 30-day refund guarantee",
    ],
    insight: "Objections are not rejections, they are usually just unanswered questions. The moment sellers had the right words ready, hesitation stopped being the end of the conversation.",
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
