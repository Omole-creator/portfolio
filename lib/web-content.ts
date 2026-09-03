// Copy and data for the /web portfolio only. This is a separate page built to
// sell web design and development to US business owners whose website looks
// outdated or does not exist yet. It draws on the same real work as the main
// site, but only the projects that are actual websites or web apps, and it
// never frames Omole as a founder. See CLAUDE.md for the full context.

export const webSite = {
  name: "Omole Usuangbon",
  role: "Web Designer & Developer",
  path: "/web",
  metaDescription:
    "Omole Usuangbon designs and builds professional websites for small businesses, fast, including a full site built in 24 hours and a modern web app from design to launch.",
  headline: "A Website That Turns Visitors Into Customers",
  subhead:
    "An outdated website makes people leave before they trust you enough to buy. I build ones that keep them, and turn them into customers.",
  contact: {
    email: "omoleusuangbon@gmail.com",
    calendly: "https://calendly.com/omoleusuangbon/30min",
    linkedin: "https://www.linkedin.com/in/omole",
    whatsapp: "https://wa.me/2348132097317",
  },
};

export const webNav = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export const webProof = [
  { value: "24 hrs", label: "from a blank page to a live, professional site" },
  { value: "5", label: "websites and web apps designed and built end to end" },
  { value: "9x", label: "conversion lift from a launch I wrote the copy for" },
];

export const webAbout = [
  "I design and build websites for small businesses, using modern tools and AI to move fast without cutting corners on quality.",
  "Most web designers can make a page look nice. I come from growth and sales, so I build sites that are built to turn a visitor into a customer, not just look good sitting there.",
  "One business had already paid two different developers to build their site, and neither one delivered. I built the whole thing myself in 24 hours, from the story on the homepage to the page that turns visitors into partners.",
  "If your website still looks like it was built years ago, or you have never had one at all, I can have something professional and fast live in days, not months.",
];

export const webServices = [
  {
    title: "A website that stops losing you customers",
    body: "A slow, outdated, or confusing website costs you customers before they ever call. I build sites that load fast, look credible, and make it obvious what you do and how to reach you.",
  },
  {
    title: "Built in days, not months",
    body: "One business had already paid two developers who never delivered. I built their entire site in 24 hours. Most projects go live in days, not the months a typical agency takes.",
  },
  {
    title: "Words that make people want to buy, not just look",
    body: "A pretty page that says nothing does not sell. I write the copy myself, from the headline to the call to action, so the site does the work of turning a visitor into a customer.",
  },
  {
    title: "A foundation people can actually find on Google",
    body: "A website only helps if people can find it. I build with search visibility in mind from the start, so the site is not just online, it is findable.",
  },
];

export type WebProject = {
  slug: string;
  name: string;
  kind: string;
  blurb: string;
  highlights: string[];
  liveUrl: string;
  image?: { src: string; alt: string };
};

export const webWork: WebProject[] = [
  {
    slug: "waterbrooks",
    name: "WaterBrooks Technologies",
    kind: "A full site, built in 24 hours",
    blurb:
      "WaterBrooks had no website, even after paying two different developers who never delivered. I built the entire site myself in a day, from the story on the homepage to the traction that gets partners to take them seriously.",
    highlights: [
      "Delivered a complete site in 24 hours, after two previous developers failed to deliver",
      "Put existing traction front and center: 200+ farmers reached, 18 land plots secured, and accelerator backing",
      "Built around a clear call to action that turns visitors into potential partners",
    ],
    liveUrl: "https://waterbrookstechnologies.vercel.app",
    image: {
      src: "/images/waterbrooks-hero.webp",
      alt: "WaterBrooks Technologies landing page: revolutionizing food preservation with solar-powered innovation for African farms",
    },
  },
  {
    slug: "designs-konstruct",
    name: "Designs & Konstruct",
    kind: "A professional site for a business ready to scale",
    blurb:
      "Designs & Konstruct needed more than somewhere to put its information. It needed a site credible enough to match where the business was headed, and built to be found on Google.",
    highlights: [
      "Makes clear what the business does from the moment someone lands on the site",
      "Gives potential customers a clear path from landing to getting in touch",
      "Built with search visibility in mind from the start",
    ],
    liveUrl: "https://designskonstruct.com",
  },
  {
    slug: "sales-objections-toolkit",
    name: "Sales Objections Toolkit",
    kind: "A sales site and product, designed and built end to end",
    blurb:
      "Small business owners could get a buyer interested, but the conversation often stalled the moment an objection came up. I wrote the ebook, designed the site, and built the checkout that sells it, and one sales letter for it beat the control by nine times in two weeks.",
    highlights: [
      "One-page sales site built around a single offer, with checkout handled through Selar",
      "Copy and design built to move a hesitant buyer to a decision, not just look good",
      "Backed by a 30-day refund guarantee to make the purchase an easy yes",
    ],
    liveUrl: "https://sales-obj.vercel.app",
    image: {
      src: "/images/sales-toolkit.webp",
      alt: "Sales Objections Toolkit landing page hero for Nigerian business owners",
    },
  },
  {
    slug: "glufloat",
    name: "GluFloat",
    kind: "A modern web app, from design to build",
    blurb:
      "GluFloat helps people living with diabetes decide what to eat every day. I designed and built the entire product myself, from the landing page and pricing to the personalized recommendations inside the app.",
    highlights: [
      "A clean, modern interface for daily meal recommendations and a food and glucose report",
      "A full pricing and trial flow, from landing page to signup, with no card required to start",
      "Built entirely with AI tools, from the recommendation engine to the design",
    ],
    liveUrl: "https://glufloat.vercel.app",
    image: {
      src: "/images/glufloat-hero.webp",
      alt: "GluFloat landing page hero: Defy Diabetes, Enjoy Food Again, with personalized meal recommendations",
    },
  },
  {
    slug: "cv-reviewer",
    name: "CV Reviewer",
    kind: "A tool, not just a page",
    blurb:
      "A free CV review used to take up hours of manual work every week. I built a self-serve tool that runs the same 15-point checklist and gives an instant score, so it works as a site that actually does something, not just describes a service.",
    highlights: [
      "Reviews CVs against a 15-point checklist and returns a score out of 100 in minutes",
      "Accepts PDF, Word, PNG, and JPG files, with no signup required",
      "Shows the kind of build that goes beyond a template: a working tool people can use",
    ],
    liveUrl: "https://jobminglecv.vercel.app",
    image: {
      src: "/images/cv-reviewer-hero.webp",
      alt: "CV Reviewer landing page: most CVs get rejected before a human ever reads them",
    },
  },
];

export const webProcess = [
  {
    title: "We talk about what's wrong with your site",
    body: "Book a call or send me your website. I will tell you honestly what is costing you customers and what fixing it actually looks like.",
  },
  {
    title: "I design and build it, fast",
    body: "Using the same process that got WaterBrooks live in 24 hours, I design and build your site in days, not months, and you see progress the whole way.",
  },
  {
    title: "You get a site that works, and keeps working",
    body: "You get something built to load fast, work on phones, and turn visitors into customers, not just something that looks nice sitting there.",
  },
];

export const webTracks = [
  {
    title: "For business owners whose website looks stuck in the past",
    body: "If your site was built years ago, does not work well on phones, or just does not look like the business you have become, I can rebuild it fast.",
  },
  {
    title: "For businesses that have never had a proper website",
    body: "If you are running on a Facebook page or nothing at all, I can get you a proper site live in days, not months.",
  },
  {
    title: "For anything else, including a site that needs more than a redesign",
    body: "If what you need is a tool, a funnel, or something a template cannot do, reach out anyway. I take on projects outside a typical website too.",
  },
];
