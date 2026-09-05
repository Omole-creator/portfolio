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
    "Omole Usuangbon builds creative marketing campaigns with AI-first tools: ad creative, video, sales copy, and the landing pages they run on.",
  headline: "I Turn Strangers Into Paying Customers",
  subhead:
    "I write the copy, design the creative, and produce the video myself, using AI-first tools like Claude Code, ElevenLabs, and HeyGen, so a campaign moves from idea to launch without waiting on a bigger team.",
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
  { value: "3,910", label: "email subscribers grown through website sign-ups" },
];

export const marketingAbout = [
  "I run creative campaigns from the first line of ad copy to the community and email list that keep customers coming back. At JobMingle, I coordinated with an external creative agency on influencer and UGC ad content for a cohort launch. It pulled in 462 leads at under a dollar each, and 18 of those leads turned into paying customers worth over ₦4.8m in sales, a 16x return on the ad spend.",
  "I build with AI-first tools because a launch doesn't wait for anyone. Claude Code builds and updates the landing pages. ElevenLabs and HeyGen produce the video and voiceover. Canva and CapCut handle the graphics and the edit. If a new tool does the job faster, I pick it up and use that instead.",
  "Words are where I started, and they still carry the work. I wrote sales copy that beat an existing control by 9x within two weeks for a herbal supplement brand. I also repurposed 10 videos a month into SEO blog content for a real estate client, so one recording did the work of several assets instead of just the one.",
  "I'm open to creative marketing manager roles, full time or on contract, remote and global, or shorter projects, whether that means running a whole campaign myself or jumping in on the one piece that's stuck.",
];

export const marketingServices = [
  {
    title: "Reels, shorts, and social video produced AI-first",
    body: "I write and produce short-form video and voiceover with HeyGen and ElevenLabs. Footage I shoot myself or source separately gets cut and captioned in CapCut for wherever it's going.",
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
      "JobMingle needed creative that could turn career switchers and beginners into paying students. That meant coordinating an outside creative agency on influencer and UGC ad content, on top of the ads, sales pages, and offers I was already writing.",
      "The creative had to work on two channels at once: a community that already trusted the brand, and paid ads reaching people who had never heard of it. Each one needed its own content, not a shared version stretched to cover both.",
    ],
    approach: [
      "Coordinated with an external creative agency on influencer and UGC ad content across Meta and TikTok, built for a cohort launch.",
      "Designed the Instagram carousels and social graphics that ran on the account, and wrote the conversion copy for the ads, sales pages, and offers behind all of it.",
      "Grew the email list and social following that made every future launch cheaper to promote, and secured a partnership with EvolvateHR for JobMingle's first career fair, promoted by email to the subscriber list.",
    ],
    results: [
      "Generated 462 leads at under $1 each from a single cohort launch campaign",
      "Turned 18 of those leads into paying customers worth over ₦4.8m in sales, a 16x return on ad spend",
      "Grew a combined social following past 9,000 and an email list to 3,910 subscribers through consistent organic posting",
    ],
    insight:
      "None of this worked alone. The agency's content, the carousels, the copy, and the following built before launch all had to land on the same cohort at the same time.",
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
    extraMedia: [
      {
        label: "Carousels and social content",
        items: [
          {
            type: "link",
            href: "https://www.instagram.com/p/DZ975fNDH4V/?img_index=2&igsi=Y3FwcWowYXd4dHBz",
            label: "AI-generated Instagram carousel",
            alt: "Instagram carousel designed for JobMingle with an AI tool",
            icon: "instagram",
          },
          {
            type: "link",
            href: "https://www.instagram.com/p/DZHox_FjGQY/?img_index=2&igsi=MWhzNnpzZXBzZXcxMA==",
            label: "AI-generated Instagram carousel",
            alt: "Second Instagram carousel designed for JobMingle with an AI tool",
            icon: "instagram",
          },
          {
            type: "link",
            href: "https://www.instagram.com/p/DYhD-oUsIed/?igsi=cmJlYWx4emozdmx2",
            label: "Canva design",
            alt: "Social design built in Canva for JobMingle",
            icon: "instagram",
          },
          {
            type: "link",
            href: "https://www.instagram.com/p/DPiqeEsDPiV/?igsi=YWcyNHdiNnk3aDFt",
            label: "Canva design",
            alt: "Second social design built in Canva for JobMingle",
            icon: "instagram",
          },
        ],
      },
    ],
  },
  {
    slug: "personal-ebook-promotions",
    name: "Personal eBook Promotions",
    kind: "Promotional videos for two self-published ebooks, made solo with AI tools",
    why: [
      "This was a small side project, not an ongoing content push and not tied to any social media page. I had two self-published ebooks to promote, and wanted to see how far AI video tools could carry that on their own.",
      "Neither ebook had the budget for a video team, so the only way to get a finished promotional video was to build one myself.",
    ],
    approach: [
      "Used HeyGen to produce a finished avatar video for one ebook. It came out ready to use as is, with nothing left to edit.",
      "For the other ebook, wrote the script, recorded the voiceover in ElevenLabs, and cut it over stock video and photos in CapCut to build two short promotional videos.",
    ],
    results: [
      "Three finished promotional videos, produced solo from script to final cut",
      "Built with AI tools alone (HeyGen, ElevenLabs, CapCut), with no outside help hired to write, voice, or edit any of it",
    ],
    insight:
      "Two ebooks and a small budget didn't need a bigger team behind them. HeyGen and ElevenLabs covered what that would have cost.",
    media: [],
    extraMedia: [
      {
        label: "Video production",
        items: [
          {
            type: "video",
            src: "/videos/ebook-promo-1.mp4",
            poster: "/images/ebook-promo-1-poster.webp",
            alt: "Short-form promotional video for a self-published ebook, built with ElevenLabs voiceover over stock video and photos",
          },
          {
            type: "video",
            src: "/videos/ebook-promo-2.mp4",
            poster: "/images/ebook-promo-2-poster.webp",
            alt: "Second short-form promotional video for a self-published ebook, built with ElevenLabs voiceover over stock video and photos",
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
    ],
  },
  {
    slug: "rectixam",
    name: "Rectixam",
    kind: "Sales copy and ad creative for a herbal ulcer supplement",
    why: [
      "Rectixam Herbal Company was already running Meta ads for its ulcer supplement, but the sales copy and creative behind them were not converting. The owner was paying for clicks that landed on a page that could not close the sale.",
      "He needed something proven to beat the version already running, not another guess at a rewrite.",
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
      "Ad creative and sales copy either beat what's already running, or they don't get to run. That's what convinced the owner to retire the version that couldn't close.",
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
      "Belly fat is one of the most searched health problems out there, which also makes it one of the most crowded and skeptical markets to advertise into on Meta. Generic ad angles get scrolled straight past, and buyers have already seen enough bad ads to distrust anything vague.",
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
      "A real estate client was producing videos on a steady schedule, but almost none of it did anything once it was posted. It never turned into a blog post, and it never showed up again anywhere Google could rank it.",
      "A separate affiliate client had a different problem. Searches for the client's own name were turning up negative reviews from competitors ahead of anything positive, which is a bad first impression for anyone looking them up.",
    ],
    approach: [
      "Repurposed 10 videos a month into SEO-optimized blog posts, so each recording kept working long after it aired instead of disappearing.",
      "Wrote weekly webinar promotion emails and brand-awareness social content on a fixed schedule to keep the audience growing between videos.",
      "Wrote and optimized new content for the affiliate client targeting their own name as the keywords, aimed at outranking the competitors' negative reviews sitting above it.",
    ],
    results: [
      "Turned 10 monthly videos into SEO blog content every month, on an ongoing basis",
      "Grew the real estate client's following through consistent webinar and social content",
      "Ranked the affiliate client first on Google for four name-based keywords within two months, pushing the competitors' negative reviews further down the page",
    ],
    insight:
      "A video that runs once and disappears only works once. Turning it into a blog post is what lets it keep showing up in search months later. Outranking the competitors' negative reviews worked the same way: more good content beat them down the page instead of trying to get them taken down.",
    liveUrl: "https://drive.google.com/drive/folders/1KA8b6Ml80ZL0Blo-p0CnrwjhNrETKCwK",
    linkLabel: "Visit the folder",
    media: [],
  },
];

export const marketingDifference = [
  {
    theirs: "Most creative marketers hand video production off to an agency.",
    mine: "I write and produce it myself with AI tools like HeyGen and ElevenLabs.",
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
