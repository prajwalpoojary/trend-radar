// data.js — DATA LAYER
//
// This is dummy/manually-curated data for the v1 demo. It is shaped exactly
// like what a human researcher would log by hand (or what Instagram's own
// Insights API returns for an account you manage) — NOT scraped.
//
// Each reel has 4 snapshots taken over time (e.g. logged every few hours
// while manually watching #UdupiKrishna / #Janmashtami2026 hashtags).
// followers = the creator's follower count, used to normalize velocity so a
// small account's genuine spike isn't drowned out by a big account's flat line.

const REELS = [
  {
    id: "r1",
    creator: "@udupi.krishna.mutt",
    followers: 42000,
    caption: "Live Nadaswaram at Krishna Matha ahead of Janmashtami night",
    hashtags: ["#UdupiKrishnaMutt", "#Janmashtami2026", "#Nadaswaram"],
    postedAt: "2026-09-04T06:00:00+05:30",
    snapshots: [
      { hour: 0, views: 1200, likes: 90, comments: 4 },
      { hour: 6, views: 4100, likes: 310, comments: 18 },
      { hour: 12, views: 9800, likes: 740, comments: 41 },
      { hour: 18, views: 21500, likes: 1650, comments: 96 },
    ],
  },
  {
    id: "r2",
    creator: "@udupi.foodie.trails",
    followers: 118000,
    caption: "Udupi-style avalakki payasa recipe for Janmashtami fasting",
    hashtags: ["#JanmashtamiRecipe", "#UdupiFood", "#Payasa"],
    postedAt: "2026-09-03T14:00:00+05:30",
    snapshots: [
      { hour: 0, views: 8000, likes: 400, comments: 12 },
      { hour: 6, views: 15200, likes: 780, comments: 25 },
      { hour: 12, views: 19800, likes: 990, comments: 33 },
      { hour: 18, views: 22100, likes: 1080, comments: 37 },
    ],
  },
  {
    id: "r3",
    creator: "@littlekanha.reels",
    followers: 6500,
    caption: "3-year-old dressed as baby Krishna doing the butter-thief pose",
    hashtags: ["#BalaKrishna", "#Janmashtami2026", "#CuteKids"],
    postedAt: "2026-09-04T09:00:00+05:30",
    snapshots: [
      { hour: 0, views: 900, likes: 120, comments: 9 },
      { hour: 6, views: 5200, likes: 810, comments: 64 },
      { hour: 12, views: 18700, likes: 2900, comments: 210 },
      { hour: 18, views: 46200, likes: 7100, comments: 480 },
    ],
  },
  {
    id: "r4",
    creator: "@karnataka.temple.tours",
    followers: 31000,
    caption: "Which Krishna temple in coastal Karnataka should you visit this Janmashtami",
    hashtags: ["#KarnatakaTemples", "#Janmashtami2026", "#TempleTourism"],
    postedAt: "2026-09-02T11:00:00+05:30",
    snapshots: [
      { hour: 0, views: 3000, likes: 150, comments: 6 },
      { hour: 6, views: 4200, likes: 190, comments: 8 },
      { hour: 12, views: 4900, likes: 210, comments: 9 },
      { hour: 18, views: 5100, likes: 215, comments: 9 },
    ],
  },
  {
    id: "r5",
    creator: "@dandiya.dance.udupi",
    followers: 9800,
    caption: "Dahi handi practice run — Udupi youth association",
    hashtags: ["#DahiHandi", "#Janmashtami2026", "#UdupiEvents"],
    postedAt: "2026-09-04T05:00:00+05:30",
    snapshots: [
      { hour: 0, views: 700, likes: 60, comments: 3 },
      { hour: 6, views: 2600, likes: 240, comments: 14 },
      { hour: 12, views: 7100, likes: 690, comments: 48 },
      { hour: 18, views: 16800, likes: 1620, comments: 121 },
    ],
  },
  {
    id: "r6",
    creator: "@simple.satvik.kitchen",
    followers: 54000,
    caption: "5-minute no-fry Janmashtami sweets for working parents",
    hashtags: ["#JanmashtamiSweets", "#QuickRecipes", "#SatvikFood"],
    postedAt: "2026-09-03T08:00:00+05:30",
    snapshots: [
      { hour: 0, views: 2000, likes: 140, comments: 5 },
      { hour: 6, views: 3100, likes: 190, comments: 7 },
      { hour: 12, views: 3400, likes: 200, comments: 7 },
      { hour: 18, views: 3550, likes: 205, comments: 8 },
    ],
  },
  {
    id: "r7",
    creator: "@udupi.krishna.mutt",
    followers: 42000,
    caption: "Behind the scenes: flower decoration for the Matha's main hall",
    hashtags: ["#UdupiKrishnaMutt", "#Janmashtami2026"],
    postedAt: "2026-09-04T13:00:00+05:30",
    snapshots: [
      { hour: 0, views: 600, likes: 40, comments: 2 },
      { hour: 6, views: 1100, likes: 70, comments: 3 },
      { hour: 12, views: 1400, likes: 85, comments: 4 },
      { hour: 18, views: 1500, likes: 88, comments: 4 },
    ],
  },
  {
    id: "r8",
    creator: "@coastal.karnataka.vlogs",
    followers: 210000,
    caption: "Janmashtami crowd timelapse outside the Matha",
    hashtags: ["#Janmashtami2026", "#Udupi", "#TravelVlog"],
    postedAt: "2026-09-04T16:00:00+05:30",
    snapshots: [
      { hour: 0, views: 15000, likes: 900, comments: 30 },
      { hour: 6, views: 41000, likes: 2600, comments: 88 },
      { hour: 12, views: 78000, likes: 5100, comments: 175 },
      { hour: 18, views: 118000, likes: 7900, comments: 260 },
    ],
  },
];
