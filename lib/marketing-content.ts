// Copy and data for the /marketing portfolio only. This is a separate page,
// duplicated from /growth, built for creative marketing manager applications
// and gigs (AI-first video, social content, landing pages, storytelling).
// It draws on the same real work as the rest of the site, recast around the
// creative side of that work rather than the growth-ops side, and never
// frames Omole as a founder. See CLAUDE.md for the full context.

export const marketingSite = {
  name: "Omole Usuangbon",
  role: "Creative Marketing Manager",
  path: "/marketing",
  metaDescription:
    "Omole Usuangbon builds creative marketing campaigns end to end: ad creative, video produced with AI-first tools, sales copy, landing pages, and the content that turns one story into many assets.",
  headline: "Creative Campaigns Built AI-First, From Idea To Launch",
  subhead:
    "I write the copy, design the creative, and produce the video with AI-first tools, HeyGen, ElevenLabs, and Claude Code, so a campaign goes from idea to live without waiting on a production crew.",
  contact: {
    email: "omoleusuangbon@gmail.com",
    calendly: "https://calendly.com/omoleusuangbon/30min",
    linkedin: "https://www.linkedin.com/in/omole",
    whatsapp: "https://wa.me/2348132097317",
  },
};

export const marketingNav = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export const marketingProof = [
  { value: "16x", label: "return on ad spend from creative that converts" },
  { value: "9,000+", label: "organic social following built" },
  { value: "10", label: "videos repurposed into content every month" },
  { value: "50%", label: "follower growth driven for a client" },
];

export const marketingAbout = [
  "I own creative campaigns end to end, from the first line of ad copy to the community and email list that keep customers coming back. At JobMingle, I coordinated with an external creative agency on influencer and UGC ad content across Meta and TikTok for a cohort launch, which pulled in 462 leads at under a dollar each and an 18x jump in paying customers.",
  "I build with AI-first tools because they let a one-person creative team move at the speed a launch actually needs. I use Claude Code to build and improve landing pages, ElevenLabs and HeyGen to write, direct, and produce video and voiceover without a camera crew, and Canva, CapCut, and Picsart to get the creative out the door, and I pick up whatever new AI tool gets the job done faster.",
  "Words are where I started, and they still carry the work. I wrote sales copy that beat an existing control by 9x within two weeks for a herbal supplement brand, and I repurposed 10 videos a month into SEO blog content for a real estate client, turning one recording into several marketing assets instead of one.",
  "I am open to creative marketing manager roles, full time or on a contract, remote and global, or shorter creative projects, whether that means owning a campaign end to end or stepping in on the piece of it that is stuck.",
];

export const marketingServices = [
  {
    title: "Reels, shorts, and social video produced AI-first",
    body: "I write, direct, and produce short-form video with HeyGen and ElevenLabs, no camera crew or production budget required, then cut and caption it in CapCut and Picsart for whichever platform it's going on.",
  },
  {
    title: "Social graphics, campaigns, and landing pages that match",
    body: "I design the ad creative and social graphics behind a campaign in Canva, and build or improve the landing page it sends people to with Claude Code and WordPress, so the whole funnel looks and reads like one thing.",
  },
  {
    title: "One story, turned into every asset it can be",
    body: "I repurposed 10 videos a month into SEO-optimized blog posts for a client, and I write sales copy the same way, pulling ads, emails, and social posts out of the same core story instead of starting from zero each time.",
  },
  {
    title: "Community, email, and event promotion that keeps people around",
    body: "I grew an email list to 3,910 subscribers, built a 9,000+ combined social following through consistent organic posting, and drove event promotion by email for JobMingle's first career fair partnership with EvolvateHR.",
  },
];

export type MarketingMediaItem =
  | { type: "image"; src: string; alt: string }
  | { type: "video"; src: string; poster?: string; alt: string }
  | { type: "link"; href: string; label: string; alt: string; icon: "play" | "instagram" };

export type MarketingMediaGroup = {
  label: string;
  items: MarketingMediaItem[];
};

export type MarketingProject = {
  slug: string;
  name: string;
  kind: string;
  why: string[];
  approach: string[];
  results: string[];
  insight: string;
  liveUrl?: string;
  linkLabel?: string;
  media: MarketingMediaItem[];
  extraMedia?: MarketingMediaGroup[];
};

export const marketingWork: MarketingProject[] = [
  {
    slug: "jobmingle",
    name: "JobMingle",
    kind: "Creative campaigns for an edtech platform",
    why: [
      "JobMingle needed creative that could turn career switchers and beginners into paying students, which meant coordinating an external creative agency on influencer and UGC ad content, not just writing a caption and hoping it worked.",
      "The creative had to carry two channels at once: a community that already trusted the brand, and paid ads reaching people who had never heard of it, and both needed their own content, not a shared, watered-down version of each.",
    ],
    approach: [
      "Coordinated with an external creative agency on influencer and UGC ad content across Meta and TikTok, built specifically for a cohort launch.",
      "Wrote the conversion copy for the ads, sales pages, and offers that ran behind that creative.",
      "Grew the email list and social following that made every future launch cheaper to promote, and secured a partnership with EvolvateHR for JobMingle's first career fair, promoted by email to the subscriber list.",
    ],
    results: [
      "Generated 462 leads at under $1 each from a single cohort launch campaign",
      "Turned 18 of those leads into paying customers worth over ₦4.8m in sales, an 18x jump on the leads themselves and a 16x return on ad spend",
      "Grew a combined social following past 9,000 and an email list to 3,910 subscribers through consistent organic posting",
    ],
    insight:
      "Creative that converts is not one asset, it's an agency's UGC content, a copywriter's offer, and a following built long before the campaign launches, all pointed at the same cohort at the same time.",
    liveUrl: "https://jobmingle.co",
    media: [
      {
        type: "image",
        src: "/images/jobmingle-instagram-followers.webp",
        alt: "JobMingle's Instagram profile showing 6,877 followers built through consistent organic posting",
      },
      {
        type: "image",
        src: "/images/jobmingle-linkedin-page.webp",
        alt: "JobMingle's LinkedIn company page, part of the 9,000+ combined social following built across platforms",
      },
    ],
  },
  {
    slug: "ai-content-projects",
    name: "Self-Initiated AI Content",
    kind: "AI-produced video, carousels, and social design",
    why: [
      "I had ebooks to promote and no production budget for a camera crew, actors, or a design team, and social content still needed to go out on a regular schedule either way.",
      "Rather than let the lack of a budget stop the content, I treated it as a reason to build an AI-first production process I could reuse on every future launch.",
    ],
    approach: [
      "Produced a video with HeyGen's AI avatar to promote one self-published ebook.",
      "Combined ElevenLabs AI voiceovers with stock footage for two more short-form videos, promoting the other.",
      "Designed Instagram carousels and social graphics with AI tools and Canva, testing different visual and messaging angles.",
    ],
    results: [
      "Three finished promotional videos, produced solo end to end with an AI-first workflow (HeyGen, ElevenLabs)",
      "Multiple Instagram carousels and social designs shipped without a design team or a production budget",
      "An AI-first video and design process I now reuse across other campaigns instead of building one from scratch each time",
    ],
    insight:
      "A camera crew and a design team are not what make content look finished, the process is. Once that process runs on HeyGen, ElevenLabs, and Canva, the budget stops being the reason a video doesn't get made.",
    media: [],
    extraMedia: [
      {
        label: "Video production",
        items: [
          {
            type: "video",
            src: "/videos/ebook-promo-1.mp4",
            poster: "/images/ebook-promo-1-poster.webp",
            alt: "Short-form promotional video for a self-published ebook, built with ElevenLabs voiceover and stock footage",
          },
          {
            type: "video",
            src: "/videos/ebook-promo-2.mp4",
            poster: "/images/ebook-promo-2-poster.webp",
            alt: "Second short-form promotional video for a self-published ebook, built with ElevenLabs voiceover and stock footage",
          },
          {
            type: "link",
            href: "https://app.heygen.com/videos/vid-o-d-avatar-2cf79400f34941c085a4946dbd5653a0",
            label: "Watch on HeyGen",
            alt: "AI avatar video produced with HeyGen to promote a self-published ebook",
            icon: "play",
          },
        ],
      },
      {
        label: "Design and carousels",
        items: [
          {
            type: "link",
            href: "https://www.instagram.com/p/DZ975fNDH4V/?img_index=2&igsi=Y3FwcWowYXd4dHBz",
            label: "AI-generated Instagram carousel",
            alt: "Instagram carousel designed with an AI tool",
            icon: "instagram",
          },
          {
            type: "link",
            href: "https://www.instagram.com/p/DZHox_FjGQY/?img_index=2&igsi=MWhzNnpzZXBzZXcxMA==",
            label: "AI-generated Instagram carousel",
            alt: "Second Instagram carousel designed with an AI tool",
            icon: "instagram",
          },
          {
            type: "link",
            href: "https://www.instagram.com/p/DYhD-oUsIed/?igsi=cmJlYWx4emozdmx2",
            label: "Canva design",
            alt: "Social design built in Canva",
            icon: "instagram",
          },
          {
            type: "link",
            href: "https://www.instagram.com/p/DPiqeEsDPiV/?igsi=YWcyNHdiNnk3aDFt",
            label: "Canva design",
            alt: "Second social design built in Canva",
            icon: "instagram",
          },
        ],
      },
    ],
  },
  {
    slug: "rectixam",
    name: "Rectixam",
    kind: "Sales copy and ad creative for a herbal ulcer supplement",
    why: [
      "Rectixam Herbal Company was already running Meta ads for its ulcer supplement, but the sales copy and creative behind them was not converting. The owner was paying for clicks that landed on a page that could not close the sale, which meant the ad spend itself was losing money, not the traffic.",
      "He needed sales copy and ad creative that could beat what he already had running, not just a rewrite, but a version proven to outperform the control he was already paying to send traffic to.",
    ],
    approach: [
      "Rewrote the sales letter from the offer up, testing the new version directly against the one already live rather than replacing it on faith.",
      "Designed new Facebook ad creatives to run alongside the new copy, aimed at the same audience the old creatives were losing.",
      "Wrote a second sales letter for the same product from a different angle, to see whether a fresh angle could pull even harder than the version already winning.",
    ],
    results: [
      "New sales copy outperformed the existing control by 9x within two weeks",
      "New ad creatives lifted ad clicks by 25%",
      "Delivered two high-converting sales letters and ad creative sets for the same product, each built around a different angle",
    ],
    insight:
      "Ad creative and sales copy either beat what's already live or they don't earn their place. That is what actually convinced the owner to stop paying for the version that could not close.",
    liveUrl:
      "https://docs.google.com/document/d/16de8bw3SQ9L0CgvZ3_0PVAPjJgAb7rs5/edit?usp=drive_link",
    linkLabel: "Visit the copy",
    media: [],
  },
  {
    slug: "belly-fat-product",
    name: "Belly Fat Product",
    kind: "Ad creative and sales pages for a self-funded D2C health product",
    why: [
      "Belly fat is one of the most searched, most anxious health problems people try to solve, which also makes it one of the most crowded and skeptical markets to sell creative into on Meta. Generic ad angles get scrolled past, and buyers have already seen enough bad ads to distrust anything vague.",
      "I ran this campaign self-funded, on my own ₦10,000 daily ad budget, over nine months. That meant every ad and every sales page I wrote had to earn its way back, with no employer or client absorbing the loss if the creative did not convert.",
    ],
    approach: [
      "Wrote and directed every ad, offer, and sales page myself, drawing on a clinical pharmacy background to turn the product's health claims into creative that read as credible rather than hype.",
      "Ran continuous creative testing across ad angles and formats on a fixed daily budget, cutting underperforming creative fast since there was no room to waste spend.",
      "Managed pay-on-delivery order operations end to end, from the ad click through to a confirmed order, including verifying each customer's delivery location before dispatch.",
    ],
    results: [
      "Generated 194 orders over nine months on a ₦10,000 daily ad budget",
      "Ran the full creative funnel solo: ad angles, sales pages, offers, and pay-on-delivery order operations",
      "Verified delivery details for every order before dispatch, protecting margin on a self-funded budget",
    ],
    insight:
      "When it's your own budget on the line, every piece of creative either earns its spend back or it gets cut. Nine months of that discipline is what 194 orders on ₦10,000 a day actually proves.",
    media: [
      {
        type: "image",
        src: "/images/belly-fat-orders.webp",
        alt: "Gmail inbox showing order-confirmation emails for the belly fat product, each customer asked to confirm their delivery location",
      },
      {
        type: "image",
        src: "/images/belly-fat-orders-2.webp",
        alt: "More order-confirmation emails for the belly fat product, further down the inbox",
      },
    ],
  },
  {
    slug: "content-repurposing",
    name: "Content Repurposing for a Real Estate Client",
    kind: "Video-to-blog content repurposing, remote for a US client",
    why: [
      "A real estate client was producing video content on a steady schedule, but almost none of it was doing double duty. Once a video was posted, it never turned into anything that could rank on Google or build a following anywhere else.",
      "A separate affiliate client had content going out too, but none of it had ever cracked page one of Google for the keywords that actually mattered.",
    ],
    approach: [
      "Repurposed 10 videos every month into SEO-optimized blog content, turning one recording into a searchable article rather than a piece of content that disappeared after it aired.",
      "Wrote weekly webinar promotion emails and brand-awareness social content on a fixed schedule to keep the audience growing between videos.",
      "Wrote and optimized content for a separate affiliate client aimed at four target keywords the client had never ranked for.",
    ],
    results: [
      "Turned 10 monthly videos into SEO blog content every month, on an ongoing basis",
      "Grew a client's following by 50% through consistent webinar and social content",
      "Ranked an affiliate client first on Google for four target keywords within two months",
    ],
    insight:
      "A video that only exists once is a video that stopped working the day it was posted. Repurposing is what makes one recording keep earning attention months later, in a format Google can actually rank.",
    media: [],
  },
];

export const marketingDifference = [
  {
    theirs: "Most creative marketers hand video production off to an agency.",
    mine: "I write, direct, and produce it myself with AI tools like HeyGen and ElevenLabs.",
  },
  {
    theirs: "Most people can write copy or design the creative, rarely both.",
    mine: "I write the sales copy and design the ad creative it runs inside.",
  },
  {
    theirs: "Most agencies need a new shoot for every new asset.",
    mine: "I repurpose one video into blog posts, social content, and ads.",
  },
  {
    theirs: "Most creative work stops at the click.",
    mine: "I follow it through the funnel, the email list, and the community that keeps customers around.",
  },
];

export const marketingProcess = [
  {
    title: "We talk about the campaign first",
    body: "Book a call or send a message. I want to see the current creative, the offer, and the funnel it sits in, not just a brief.",
  },
  {
    title: "I find what the creative is missing",
    body: "Sometimes it's the copy, sometimes it's the video, sometimes it's the landing page it all lands on. I tell you which, and why.",
  },
  {
    title: "I write it, design it, and produce it",
    body: "I own the ad creative, sales pages, video, and copy end to end with AI-first tools, and show you what's live as it ships.",
  },
  {
    title: "We test and keep what converts",
    body: "I run creative testing across angles and formats, and cut what isn't pulling its weight instead of leaving it running out of habit.",
  },
];

export const marketingTechnicalSkills = [
  "Creative Campaign Development",
  "AI-Assisted Creative Workflows (Claude Code, ElevenLabs, HeyGen)",
  "Design and Video Editing (Canva, CapCut, Picsart)",
  "Content Repurposing (video to blog and multi-asset)",
  "Landing Page Development (Claude Code, WordPress)",
  "Conversion Copywriting and Storytelling",
  "Creative Agency Coordination (UGC and Influencer)",
  "Paid Social Advertising (Meta, TikTok, Google Ads)",
  "Email Marketing",
  "Community and Event Promotion",
  "Google Analytics 4",
  "Project Management (ClickUp, Asana, Slack)",
];

export const marketingSoftSkills = [
  "Team Leadership",
  "Cross-Functional Collaboration",
  "Persuasive Communication",
  "Resourcefulness Under Budget Constraints",
  "Adaptability Across Roles",
];

export const marketingCertifications = [
  { name: "The Essentials of Growth Marketing", issuer: "Udemy", year: "2026" },
  { name: "Marketing Tools: Growth Marketing", issuer: "LinkedIn Learning", year: "2026" },
  { name: "Growth Marketing Foundations", issuer: "LinkedIn Learning", year: "2026" },
  { name: "Digital Marketing Foundations", issuer: "LinkedIn Learning", year: "2026" },
];

export const marketingResume = {
  eyebrow: "Resume",
  title: "Download my CV",
  buttonLabel: "Download CV",
  href: "/omole-usuangbon-creative-marketing-cv.pdf",
};

export const marketingTracks = [
  {
    title: "For startups and brands that need creative campaigns end to end",
    body: "I help these businesses turn an idea into finished creative, video, social content, ad creative, sales copy, and the landing page it all lands on, built AI-first so it ships fast.",
  },
  {
    title: "For teams hiring a creative marketing manager",
    body: "If you're looking for someone to own video, social content, and creative campaigns, full time or on a contract, remote and global, I'm open to that conversation.",
  },
  {
    title: "For everything else, including consulting and short-term creative projects",
    body: "If what you need doesn't fit neatly into the above, reach out anyway. I take on consulting work and shorter creative projects too.",
  },
];
