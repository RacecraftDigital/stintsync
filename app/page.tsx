// Racecraft Digital contact email update v175
// Export Help Final UI cleanup v174
"use client";

// Save button state + request type cleanup v168

// Hide global message box v167

// Schedule warning override rows v166

// Schedule warning badges and manual lock cleanup v165

// Nurburgring alias search fix v164

// Remove unused Use button v163

// Accent-insensitive search + Race Data escape v162

// Expanded car track master options v161

// Datalist add car + escape reset v160

// Fuel tank edit updates tests + race car search v159

// Remove baseline fuel tank display v158

// Race testing cleanup and schedule manual lock v157

// Race length default and validation v156

// Help page rewrite v155

// Obvious settings cleanup v154

// Settings support cleanup v153

// Template cleanup v152

// Requests flow cleanup v151

// Individual test sharing v150

// Shared setup folders v149

// Folder share and move modals v148

// Shared testing folders v147

// URL refresh persistence v146

// Uniform thin schedule grid lines v145

// Hard schedule table grid lines v144

// Actual End blank until manual or completed + stronger schedule grid v143

// Schedule timezone and grid cleanup v142

// Dynamic schedule rebuild and clean regenerate v141

// Schedule race end cap and stable stint count v140

// Strong schedule weather and stint preference fix v139

// Schedule weather timing recalculation v138

// Fix testing top grid layout v137

// Driver baseline test layout separation v136

// Group baseline tests by driver v135

// Driver tests owner separation v134

// Race Data view-only inputs disabled v133

// Team permissions and admin race controls v132

// Testing compare + fuel save calculator v131

// Prevent Race Data form reset during auto-sync v130

// Correct open-race workspace full-width v51
// Schedule right-side column spacing fix v52
// Only Schedule tab full-width v53
// Only schedule table/card expands full-width v54
// Race Data visual cleanup v55
// Removed Race Data calculation preview v56
// Race Testing visual cleanup v57
// Changed iRacing car dropdown label v58
// Align Cars box height with Driver Baseline Tests v59
// Availability visual cleanup v60
// Availability edit fix + smart schedule availability driver picker v61
// Neutral black dropdown option styling v62
// Schedule visual cleanup v63
// Greener completed row highlight v64
// Brighter completed row highlight v65
// Sidebar and profile polish v66
// Help page polish v67
// Added Help contact email v68
// Testing Library folders and visual polish v69
// Testing Library edit buttons, add-test modal, nested folders v70
// Requests tab for missing cars/tracks v71
// Email notifications for requests v72
// Request email debug/status v73
// Requests admin view/status manager v74
// Requests admin status update fix v75
// Requests admin status API route fix v76
// Clean compile fix for request status functions v78
// Hide requests after marking Added v79
// Calendar visual polish + request Add button label v80
// Calendar button function fix v81
// Calendar inline edit form fix v82
// Real month calendar view v83
// Calendar multi-day race span v84
// Google-style continuous multi-day calendar bars v85
// Setup file upload support for tests v86
// Clean Testing Library folder/test flow v87
// Testing Library top buttons + setup save fix v88
// Testing folder auto-save + Setups tab v89
// Test form setup field type fix v90
// Remove Tests from Testing root; rename All Tests to Tests v91

// True full-width race workspace v50

// Race full-width tabs and schedule fit v49

// Schedule full-width + single-field searchable selects v48

// Race workspace shell polish v47

// Teams visual cleanup v46

// Instruction cards clipped shared image v45

// Home instruction banner image v44

// Track image direct bucket priority v43

// Hide broken track images + folder-path SQL helper v42

// Create stays on home + race date sort + storage image fallback v41

// Track required + edit layout + image fallback fix v40

// Track image support + inlap/outlap info button polish v37

// Home guidance + optional team + inlap/outlap info v36

// Home layout polish v35

// Removed Race Data track selector v34

// Schedule test selection v33 - fastest or manual test choice

// Searchable car/track dropdowns + edit race track v32

// v30 row type compile fix

// Add Race track compile fix v28

// Real Add Race track fix v27

// Race track selection + testing track sync v25

// Sidebar Testing Library v24 - car/track dropdowns and load into race

// v20 focused fix: invite filter, optimistic schedule controls, self-invite prevention

// Single delete confirmation modal v14

// Wider test data panel + mark completed toggle fix v13

// Schedule toggle complete + fixed testing panel heights v12

// In-app notes/delete modals v11

// Notes inline + no pre-race completed popup v10

// Testing calculations v9 - saved tests and teammate tests use calculation tables

// Testing calculations table v8 - full car card click + calculated test summaries

// Testing table layout v7 - equal top boxes and teammate table with notes

// Testing layout v6 - teammate-only testing + no data result cards

// Testing layout cleanup v3 - grouped driver tests only

// Restored working testing page - removed bad cleanup patch

// Testing grouped by driver v2

// Auth/profile sidebar button added

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const SUPPORT_EMAIL = "contact@racecraftdigital.com";

type PageName =
  | "Home"
  | "Teams"
  | "Testing"
  | "Setups"
  | "Calendar"
  | "Analytics"
  | "Templates"
  | "Exports"
  | "Requests"
  | "Settings"
  | "Help"
  | "Donate";

type RaceTab =
  | "Data"
  | "Testing"
  | "Availability"
  | "Schedule"
  | "Live Strategy"
  | "Fuel Calc";

type Profile = {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
};

type CloudTeam = {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
};

type TeamMember = {
  id: string;
  team_id: string | null;
  user_id: string;
  role: string | null;
  status: string | null;
  profiles: Profile | null;
};

type TeamInvite = {
  id: string;
  team_id: string;
  invited_user_id: string;
  invited_by: string;
  status: string | null;
  created_at: string;
  teams?: CloudTeam | null;
};

type Race = {
  id: string;
  team_id: string;
  created_by: string | null;
  name: string;
  race_date: string | null;
  race_start_real: string | null;
  race_start_sim: string | null;
  main_time_zone: string | null;
  extra_time_zones: string[] | null;
  race_length_hours: number | null;
  selected_car_id?: string | null;
  selected_team_test_id?: string | null;
  selected_driver_test_id?: string | null;
  created_at: string;
  track_id: string | null;
  track_name: string | null;
  track_image_url?: string | null;
};

type RaceTemplate = {
  id: string;
  name: string;
  race_length_hours: string;
  race_start_real: string;
  race_start_sim: string;
  main_time_zone: string;
  extra_time_zones: string[];
  track_id: string;
  track_name: string;
  team_id: string;
  selected_car_id: string;
  created_at: string;
};

type Car = {
  id: string;
  team_id: string;
  created_by: string | null;
  name: string;
  fuel_tank?: number | null;
};

type IRacingCar = {
  id: string;
  name: string;
  category: string | null;
  is_active: boolean | null;
};

type IRacingTrack = {
  id: string;
  name: string;
  category: string | null;
  image_url?: string | null;
  is_active: boolean | null;
};

type TestLibraryItem = {
  id: string;
  user_id: string;
  team_id: string | null;
  folder_id?: string | null;
  car_id: string | null;
  track_id: string | null;
  car_name: string | null;
  track_name: string | null;
  weather: string | null;
  average_lap: number | null;
  fuel_tank: number | null;
  fuel_burn: number | null;
  inlap: number | null;
  outlap: number | null;
  notes: string | null;
  setup_file_url?: string | null;
  setup_file_name?: string | null;
  created_at: string;
};

type TestFolder = {
  id: string;
  user_id: string;
  team_id?: string | null;
  name: string;
  folder_type: string | null;
  parent_id?: string | null;
  created_at: string;
};

type TeamSetupFolder = {
  id: string;
  user_id: string;
  team_id: string | null;
  name: string;
  parent_id?: string | null;
  created_at: string;
};

type TeamSetupFile = {
  id: string;
  user_id: string;
  team_id: string | null;
  folder_id: string | null;
  name: string;
  car_id: string | null;
  track_id: string | null;
  car_name: string | null;
  track_name: string | null;
  notes: string | null;
  file_url: string | null;
  file_name: string | null;
  created_at: string;
};

type AddRequest = {
  id: string;
  user_id: string;
  request_type: string;
  name: string;
  category: string | null;
  notes: string | null;
  status: string | null;
  created_at: string;
};

type AppAdmin = {
  user_id: string;
  email: string | null;
};

type CarTest = {
  id: string;
  team_id: string;
  car_id: string;
  created_by: string | null;
  weather: string | null;
  average_lap: number | null;
  fuel_tank: number | null;
  fuel_burn: number | null;
  inlap: number | null;
  outlap: number | null;
  notes: string | null;
  setup_file_url?: string | null;
  setup_file_name?: string | null;
};

type DriverTest = {
  id: string;
  race_id: string;
  team_id: string;
  car_id: string;
  driver_id: string;
  weather: string | null;
  average_lap: number | null;
  fuel_burn: number | null;
  notes: string | null;
  profiles?: Profile | null;
};

type DriverAvailability = {
  id: string;
  race_id: string;
  team_id: string;
  driver_id: string;
  stint_number: number;
  status: string | null;
  target_stints: number | null;
  ideal_stint_type: string | null;
};

type StintWeather = {
  id: string;
  race_id: string;
  team_id: string;
  stint_number: number;
  weather: string | null;
};

type ScheduleAdjustment = {
  id: string;
  race_id: string;
  team_id: string;
  stint_number: number;
  driver_id: string | null;
  add_seconds: number | null;
  actual_end_time: string | null;
  completed: boolean | null;
  completed_by: string | null;
};

type ScheduleRow = {
  stint: number;
  driverId: string | null;
  weather: string;
  start: Date;
  end: Date;
  simStart: Date;
  simEnd: Date;
  addSeconds: number;
  actualEndTime: string;
  completed: boolean;
  pickReason?: string;
  driverStatus?: string;
  driverAvgLap?: number | null;
  usedDriverPace?: boolean;
  warning?: string;
};

const sidebarItems: PageName[] = [
  "Home",
  "Teams",
  "Testing",
  "Setups",
  "Calendar",
  "Analytics",
  "Templates",
  "Exports",
  "Requests",
  "Settings",
  "Help",
  "Donate",
];

const timeZoneOptions = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Phoenix",
  "America/Toronto",
  "America/Vancouver",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "UTC",
  "Australia/Sydney",
  "Asia/Tokyo",
];

const weatherOptions = [
  "Sunny",
  "Partly Cloudy",
  "Mostly Cloudy",
  "Overcast",
  "Fog",
  "Light Rain",
  "Rain",
  "Heavy Rain",
  "Thunderstorm",
];

const fallbackIRacingCars: IRacingCar[] = [
  {
    id: "fallback-acura-arx-06-gtp",
    name: "Acura ARX-06 GTP",
    category: "GTP",
    is_active: true,
  },
  {
    id: "fallback-bmw-m-hybrid-v8",
    name: "BMW M Hybrid V8",
    category: "GTP",
    is_active: true,
  },
  {
    id: "fallback-cadillac-v-series-r-gtp",
    name: "Cadillac V-Series.R GTP",
    category: "GTP",
    is_active: true,
  },
  {
    id: "fallback-porsche-963-gtp",
    name: "Porsche 963 GTP",
    category: "GTP",
    is_active: true,
  },
  {
    id: "fallback-dallara-p217",
    name: "Dallara P217",
    category: "LMP2",
    is_active: true,
  },
  {
    id: "fallback-ferrari-296-gt3",
    name: "Ferrari 296 GT3",
    category: "GT3",
    is_active: true,
  },
  {
    id: "fallback-bmw-m4-gt3",
    name: "BMW M4 GT3",
    category: "GT3",
    is_active: true,
  },
  {
    id: "fallback-mercedes-amg-gt3-2020",
    name: "Mercedes-AMG GT3 2020",
    category: "GT3",
    is_active: true,
  },
  {
    id: "fallback-porsche-911-gt3-r-992",
    name: "Porsche 911 GT3 R (992)",
    category: "GT3",
    is_active: true,
  },
  {
    id: "fallback-audi-r8-lms-evo-ii-gt3",
    name: "Audi R8 LMS EVO II GT3",
    category: "GT3",
    is_active: true,
  },
  {
    id: "fallback-lamborghini-huracan-gt3-evo",
    name: "Lamborghini Huracán GT3 EVO",
    category: "GT3",
    is_active: true,
  },
  {
    id: "fallback-mclaren-720s-gt3-evo",
    name: "McLaren 720S GT3 EVO",
    category: "GT3",
    is_active: true,
  },
  {
    id: "fallback-ford-mustang-gt3",
    name: "Ford Mustang GT3",
    category: "GT3",
    is_active: true,
  },
  {
    id: "fallback-chevrolet-corvette-z06-gt3-r",
    name: "Chevrolet Corvette Z06 GT3.R",
    category: "GT3",
    is_active: true,
  },
  {
    id: "fallback-porsche-718-cayman-gt4",
    name: "Porsche 718 Cayman GT4 Clubsport MR",
    category: "GT4",
    is_active: true,
  },
  {
    id: "fallback-bmw-m4-gt4",
    name: "BMW M4 GT4",
    category: "GT4",
    is_active: true,
  },
  {
    id: "fallback-mercedes-amg-gt4",
    name: "Mercedes-AMG GT4",
    category: "GT4",
    is_active: true,
  },
  {
    id: "fallback-mclaren-570s-gt4",
    name: "McLaren 570S GT4",
    category: "GT4",
    is_active: true,
  },
  {
    id: "fallback-mazda-mx-5-cup",
    name: "Global Mazda MX-5 Cup",
    category: "Production",
    is_active: true,
  },
  {
    id: "fallback-toyota-gr86",
    name: "Toyota GR86",
    category: "Production",
    is_active: true,
  },
  {
    id: "fallback-porsche-911-gt3-cup-992",
    name: "Porsche 911 GT3 Cup (992)",
    category: "Cup",
    is_active: true,
  },
  {
    id: "fallback-super-formula-lights",
    name: "Super Formula Lights",
    category: "Formula",
    is_active: true,
  },
  {
    id: "fallback-super-formula-sf23",
    name: "Super Formula SF23",
    category: "Formula",
    is_active: true,
  },
  {
    id: "fallback-dallara-f3",
    name: "Dallara F3",
    category: "Formula",
    is_active: true,
  },
  {
    id: "fallback-dallara-ir-18",
    name: "Dallara IR18",
    category: "IndyCar",
    is_active: true,
  },
  {
    id: "fallback-nascar-next-gen-chevrolet-camaro-zl1",
    name: "NASCAR Next Gen Chevrolet Camaro ZL1",
    category: "Oval",
    is_active: true,
  },
  {
    id: "fallback-nascar-next-gen-ford-mustang",
    name: "NASCAR Next Gen Ford Mustang",
    category: "Oval",
    is_active: true,
  },
  {
    id: "fallback-nascar-next-gen-toyota-camry",
    name: "NASCAR Next Gen Toyota Camry",
    category: "Oval",
    is_active: true,
  },
  {
    id: "fallback-nascar-xfinity-chevrolet-camaro",
    name: "NASCAR Xfinity Chevrolet Camaro",
    category: "Oval",
    is_active: true,
  },
  {
    id: "fallback-nascar-truck-chevrolet-silverado",
    name: "NASCAR Truck Chevrolet Silverado",
    category: "Oval",
    is_active: true,
  },
];

const fallbackIRacingTracks: IRacingTrack[] = [
  {
    id: "fallback-nurburgring-grand-prix-strecke",
    name: "Nürburgring Grand-Prix-Strecke",
    category: "Road",
    is_active: true,
  },
  {
    id: "fallback-nurburgring-nordschleife",
    name: "Nürburgring Nordschleife",
    category: "Road",
    is_active: true,
  },
  {
    id: "fallback-nurburgring-gesamtstrecke-24h",
    name: "Nürburgring Combined 24h",
    category: "Road",
    is_active: true,
  },
  {
    id: "fallback-daytona-international-speedway",
    name: "Daytona International Speedway",
    category: "Road/Oval",
    is_active: true,
  },
  {
    id: "fallback-sebring-international-raceway",
    name: "Sebring International Raceway",
    category: "Road",
    is_active: true,
  },
  {
    id: "fallback-road-atlanta",
    name: "Michelin Raceway Road Atlanta",
    category: "Road",
    is_active: true,
  },
  {
    id: "fallback-watkins-glen",
    name: "Watkins Glen International",
    category: "Road",
    is_active: true,
  },
  {
    id: "fallback-road-america",
    name: "Road America",
    category: "Road",
    is_active: true,
  },
  {
    id: "fallback-virginia-international-raceway",
    name: "Virginia International Raceway",
    category: "Road",
    is_active: true,
  },
  {
    id: "fallback-circuit-of-the-americas",
    name: "Circuit of the Americas",
    category: "Road",
    is_active: true,
  },
  {
    id: "fallback-indianapolis-motor-speedway",
    name: "Indianapolis Motor Speedway",
    category: "Road/Oval",
    is_active: true,
  },
  {
    id: "fallback-weathertech-raceway-laguna-seca",
    name: "WeatherTech Raceway Laguna Seca",
    category: "Road",
    is_active: true,
  },
  {
    id: "fallback-long-beach-street-circuit",
    name: "Long Beach Street Circuit",
    category: "Road",
    is_active: true,
  },
  {
    id: "fallback-detroit-grand-prix-at-belle-isle",
    name: "Detroit Grand Prix at Belle Isle",
    category: "Road",
    is_active: true,
  },
  {
    id: "fallback-canadian-tire-motorsport-park",
    name: "Canadian Tire Motorsport Park",
    category: "Road",
    is_active: true,
  },
  {
    id: "fallback-le-mans",
    name: "Circuit des 24 Heures du Mans",
    category: "Road",
    is_active: true,
  },
  {
    id: "fallback-spa-francorchamps",
    name: "Circuit de Spa-Francorchamps",
    category: "Road",
    is_active: true,
  },
  {
    id: "fallback-silverstone",
    name: "Silverstone Circuit",
    category: "Road",
    is_active: true,
  },
  {
    id: "fallback-monza",
    name: "Autodromo Nazionale Monza",
    category: "Road",
    is_active: true,
  },
  {
    id: "fallback-imola",
    name: "Autodromo Internazionale Enzo e Dino Ferrari",
    category: "Road",
    is_active: true,
  },
  {
    id: "fallback-red-bull-ring",
    name: "Red Bull Ring",
    category: "Road",
    is_active: true,
  },
  {
    id: "fallback-hockenheimring",
    name: "Hockenheimring Baden-Württemberg",
    category: "Road",
    is_active: true,
  },
  {
    id: "fallback-zandvoort",
    name: "Circuit Zandvoort",
    category: "Road",
    is_active: true,
  },
  {
    id: "fallback-brands-hatch",
    name: "Brands Hatch Circuit",
    category: "Road",
    is_active: true,
  },
  {
    id: "fallback-oulton-park",
    name: "Oulton Park Circuit",
    category: "Road",
    is_active: true,
  },
  {
    id: "fallback-donington-park",
    name: "Donington Park Racing Circuit",
    category: "Road",
    is_active: true,
  },
  {
    id: "fallback-mount-panorama",
    name: "Mount Panorama Circuit",
    category: "Road",
    is_active: true,
  },
  {
    id: "fallback-suzuka",
    name: "Suzuka International Racing Course",
    category: "Road",
    is_active: true,
  },
  {
    id: "fallback-fuji-speedway",
    name: "Fuji International Speedway",
    category: "Road",
    is_active: true,
  },
  {
    id: "fallback-motegi",
    name: "Mobility Resort Motegi",
    category: "Road/Oval",
    is_active: true,
  },
  {
    id: "fallback-charlotte-motor-speedway",
    name: "Charlotte Motor Speedway",
    category: "Oval/Road",
    is_active: true,
  },
  {
    id: "fallback-atlanta-motor-speedway",
    name: "Atlanta Motor Speedway",
    category: "Oval",
    is_active: true,
  },
  {
    id: "fallback-talladega-superspeedway",
    name: "Talladega Superspeedway",
    category: "Oval",
    is_active: true,
  },
  {
    id: "fallback-darlington-raceway",
    name: "Darlington Raceway",
    category: "Oval",
    is_active: true,
  },
  {
    id: "fallback-bristol-motor-speedway",
    name: "Bristol Motor Speedway",
    category: "Oval",
    is_active: true,
  },
  {
    id: "fallback-martinsville-speedway",
    name: "Martinsville Speedway",
    category: "Oval",
    is_active: true,
  },
];

function mergeMasterListByName<T extends { name: string }>(
  primary: T[],
  fallback: T[],
) {
  const seen = new Set<string>();
  const merged: T[] = [];

  [...primary, ...fallback].forEach((item) => {
    const key = item.name.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    merged.push(item);
  });

  return merged.sort((a, b) => a.name.localeCompare(b.name));
}

const availabilityOptions = [
  "Want to Drive",
  "Available to Drive",
  "Prefer Not to Drive",
  "Unavailable to Drive",
];

const idealStintOptions = [
  "Doesn\'t matter",
  "Single",
  "Double",
  "Triple",
  "Quadruple",
];

function emptyResults() {
  return {
    raceLaps: "",
    stintLength: "",
    stintMinutes: "",
    exactStints: "",
    stintsNeeded: "",
    pitStops: "",
    pitTime: "",
    totalPitTime: "",
    scheduleRows: "",
  };
}

function toNumber(value: string | number | null | undefined, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function isPositiveNumberString(value: string | number | null | undefined) {
  const cleaned = String(value ?? "").trim();
  if (!cleaned) return false;
  const n = Number(cleaned);
  return Number.isFinite(n) && n > 0;
}

function normalizeSearchText(value: string | null | undefined) {
  return String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ü/g, "u")
    .replace(/Ü/g, "u")
    .replace(/ä/g, "a")
    .replace(/Ä/g, "a")
    .replace(/ö/g, "o")
    .replace(/Ö/g, "o")
    .replace(/ß/g, "ss")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function searchAliases(name: string | null | undefined) {
  const normalized = normalizeSearchText(name);
  const aliases = [normalized];

  if (
    normalized.includes("nurburgring") ||
    normalized.includes("nürburgring")
  ) {
    aliases.push(
      "nurburgring",
      "nurb",
      "nurburg",
      "nurburgring nordschleife",
      "nurburgring gp",
      "nurburgring 24h",
    );
  }

  return aliases.join(" ");
}

function searchMatches(
  name: string | null | undefined,
  query: string | null | undefined,
) {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return true;
  return searchAliases(name).includes(normalizedQuery);
}

function parseLapSeconds(
  value: string | number | null | undefined,
  fallback = 0,
) {
  if (typeof value === "number")
    return Number.isFinite(value) ? value : fallback;
  if (!value) return fallback;

  const cleaned = String(value).trim();
  if (!cleaned) return fallback;

  if (cleaned.includes(":")) {
    const parts = cleaned.split(":").map((part) => Number(part));
    if (parts.length === 2 && parts.every(Number.isFinite))
      return parts[0] * 60 + parts[1];
    if (parts.length === 3 && parts.every(Number.isFinite))
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }

  const numeric = Number(cleaned);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function formatLapSeconds(seconds: number | null | undefined) {
  const safe = toNumber(seconds, 0);
  if (!safe) return "—";

  const minutes = Math.floor(safe / 60);
  const secs = safe - minutes * 60;
  return `${minutes}:${secs.toFixed(3).padStart(6, "0")}`;
}

function formatDeltaSeconds(seconds: number | null | undefined) {
  const safe = toNumber(seconds, 0);
  const sign = safe > 0 ? "+" : safe < 0 ? "-" : "";
  const abs = Math.abs(safe);
  if (abs >= 60) return `${sign}${formatLapSeconds(abs)}`;
  return `${sign}${abs.toFixed(3)}s`;
}

function formatPlainTime(seconds: number | null | undefined) {
  const safe = Math.max(0, toNumber(seconds, 0));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const secs = Math.round(safe % 60);

  if (hours > 0) return `${hours}h ${minutes}m ${secs}s`;
  if (minutes > 0) return `${minutes}m ${secs}s`;
  return `${secs}s`;
}

function format12(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatInZone(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function shortTimeZoneLabel(timeZone: string) {
  if (!timeZone) return "Time";
  if (timeZone === "UTC") return "UTC";
  const city = timeZone.split("/").pop() || timeZone;
  return city.replace(/_/g, " ");
}

function formatCountdown(ms: number) {
  const clamped = Math.max(0, ms);
  const totalSeconds = Math.floor(clamped / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
  return `${minutes}m ${seconds}s`;
}

function profileName(profile?: Profile | null) {
  return profile?.display_name || profile?.username || "Unknown Driver";
}

function roleLabel(role?: string | null) {
  if (role === "owner" || role === "admin" || role === "manager")
    return "Admin";
  return role || "Driver";
}

function parseTimeParts(time: string | null | undefined) {
  if (!time) return { hour: 0, minute: 0 };
  const cleaned = time.trim();
  const match24 = cleaned.match(/^(\d{1,2}):(\d{2})$/);
  if (match24) return { hour: Number(match24[1]), minute: Number(match24[2]) };

  const match12 = cleaned.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (match12) {
    let hour = Number(match12[1]);
    const minute = Number(match12[2]);
    const suffix = match12[3].toUpperCase();
    if (suffix === "PM" && hour !== 12) hour += 12;
    if (suffix === "AM" && hour === 12) hour = 0;
    return { hour, minute };
  }

  return { hour: 0, minute: 0 };
}

function makeLocalDate(
  dateText: string | null | undefined,
  timeText: string | null | undefined,
) {
  const date = dateText || new Date().toISOString().slice(0, 10);
  const [year, month, day] = date.split("-").map(Number);
  const parts = parseTimeParts(timeText);
  return new Date(
    year,
    (month || 1) - 1,
    day || 1,
    parts.hour,
    parts.minute,
    0,
    0,
  );
}

function timeInputFromDate(date: Date) {
  const h = String(date.getHours()).padStart(2, "0");
  const m = String(date.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

function dateInputInZone(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = parts.find((part) => part.type === "year")?.value || "1970";
  const month = parts.find((part) => part.type === "month")?.value || "01";
  const day = parts.find((part) => part.type === "day")?.value || "01";

  return `${year}-${month}-${day}`;
}

function timeInputInZone(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const hour = parts.find((part) => part.type === "hour")?.value || "00";
  const minute = parts.find((part) => part.type === "minute")?.value || "00";

  return `${hour === "24" ? "00" : hour}:${minute}`;
}

function getTeamById(teams: CloudTeam[], id: string | null | undefined) {
  return teams.find((team: any) => team.id === id) || null;
}

export default function App() {
  const [activePage, setActivePage] = useState<PageName>("Home");
  const [selectedRaceId, setSelectedRaceId] = useState<string | null>(null);
  const [exportRaceId, setExportRaceId] = useState<string>("");
  const [activeRaceTab, setActiveRaceTab] = useState<RaceTab>("Data");
  const [fuelCalcState, setFuelCalcState] = useState({
    tankSize: 100,
    fuelPerLap: 2.9,
    lapTimeSeconds: 118,
    raceLengthMinutes: 360,
    pitLossSeconds: 55,
    safetyMarginLaps: 1,
    targetSaveLaps: 2,
  });
  const [hasHydratedRoute, setHasHydratedRoute] = useState(false);

  const [userId, setUserId] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [noteModalText, setNoteModalText] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    title: string;
    onConfirm: () => void;
  } | null>(null);

  const [teams, setTeams] = useState<CloudTeam[]>([]);
  const [teamMembersByTeam, setTeamMembersByTeam] = useState<
    Record<string, TeamMember[]>
  >({});
  const [teamInvites, setTeamInvites] = useState<TeamInvite[]>([]);
  const [selectedTeamViewId, setSelectedTeamViewId] = useState<string | null>(
    null,
  );

  const [races, setRaces] = useState<Race[]>([]);
  const [raceTemplates, setRaceTemplates] = useState<RaceTemplate[]>([]);
  const [templateRaceDate, setTemplateRaceDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(
    null,
  );
  const [templateForm, setTemplateForm] = useState({
    name: "",
    race_length_hours: "",
    race_start_real: "",
    race_start_sim: "",
    main_time_zone: "",
    extra_time_zone: "America/Los_Angeles",
    extra_time_zones: [] as string[],
    track_id: "",
    team_id: "",
    selected_car_id: "",
  });
  const [cars, setCars] = useState<Car[]>([]);
  const [iracingCars, setIracingCars] = useState<IRacingCar[]>([]);
  const [iracingTracks, setIracingTracks] = useState<IRacingTrack[]>([]);
  const [testLibrary, setTestLibrary] = useState<TestLibraryItem[]>([]);
  const [testFolders, setTestFolders] = useState<TestFolder[]>([]);
  const [setupFolders, setSetupFolders] = useState<TeamSetupFolder[]>([]);
  const [setupFiles, setSetupFiles] = useState<TeamSetupFile[]>([]);
  const [addRequests, setAddRequests] = useState<AddRequest[]>([]);
  const [appAdmins, setAppAdmins] = useState<AppAdmin[]>([]);
  const [carTests, setCarTests] = useState<CarTest[]>([]);
  const [driverTests, setDriverTests] = useState<DriverTest[]>([]);
  const [availability, setAvailability] = useState<DriverAvailability[]>([]);
  const [stintWeather, setStintWeather] = useState<StintWeather[]>([]);
  const [scheduleAdjustments, setScheduleAdjustments] = useState<
    ScheduleAdjustment[]
  >([]);

  const [now, setNow] = useState(new Date());
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [message, setMessage] = useState("");
  const [liveSyncStatus, setLiveSyncStatus] = useState("Live sync ready");
  const [scheduleRefreshKey, setScheduleRefreshKey] = useState(0);
  const [overriddenScheduleWarnings, setOverriddenScheduleWarnings] = useState<
    Record<string, boolean>
  >({});
  const [appDefaultTimeZone, setAppDefaultTimeZone] =
    useState("America/New_York");
  const [appDefaultRaceLength, setAppDefaultRaceLength] = useState("24");
  const [appDefaultStartTime, setAppDefaultStartTime] = useState("08:00");
  const [requestForm, setRequestForm] = useState({
    request_type: "car",
    name: "",
    category: "",
    notes: "",
  });
  const [savedButtons, setSavedButtons] = useState<Record<string, boolean>>({});

  function markSaveSaved(key: string) {
    setSavedButtons((prev) => ({ ...prev, [key]: true }));
  }

  function markSaveDirty(key: string) {
    setSavedButtons((prev) =>
      prev[key] ? { ...prev, [key]: false } : prev,
    );
  }

  function markSaveSavedAfterFormReset(key: string) {
    window.setTimeout(() => markSaveSaved(key), 0);
  }

  function saveButtonLabel(
    key: string,
    defaultLabel = "Save",
    savedLabel = "Saved",
  ) {
    return savedButtons[key] ? savedLabel : defaultLabel;
  }

  const [showAddRace, setShowAddRace] = useState(false);
  const [newRaceName, setNewRaceName] = useState("");
  const [newRaceDate, setNewRaceDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [newRaceTrackId, setNewRaceTrackId] = useState("");
  const [newRaceTeamId, setNewRaceTeamId] = useState("");

  const [editingRaceId, setEditingRaceId] = useState<string | null>(null);
  const [editingRaceName, setEditingRaceName] = useState("");
  const [editingRaceDate, setEditingRaceDate] = useState("");
  const [editingRaceTrackId, setEditingRaceTrackId] = useState("");

  const [newTeamName, setNewTeamName] = useState("");
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [editingTeamName, setEditingTeamName] = useState("");

  const [raceForm, setRaceForm] = useState<any>({
    race_name: "",
    race_date: "",
    race_start_real: "08:00",
    race_start_sim: "08:00",
    main_time_zone: "America/New_York",
    extra_time_zone: "America/Los_Angeles",
    extra_time_zones: [] as string[],
    race_length_hours: "1",
    selected_car_id: "",
    selected_team_test_id: "",
    selected_driver_test_id: "",
    track_id: "",
    team_id: "",
  });
  const [loadedRaceFormRaceId, setLoadedRaceFormRaceId] = useState<
    string | null
  >(null);

  const [selectedTestingCarId, setSelectedTestingCarId] = useState("");
  const [raceAddCarSearch, setRaceAddCarSearch] = useState("");
  const [newRaceCarFuelTank, setNewRaceCarFuelTank] = useState("");
  const [editingRaceCarId, setEditingRaceCarId] = useState<string | null>(null);
  const [editingRaceCarFuelTank, setEditingRaceCarFuelTank] = useState("");
  const [compareRaceCarIds, setCompareRaceCarIds] = useState<string[]>([]);
  const [selectedMasterCarId, setSelectedMasterCarId] = useState("");
  const [selectedLibraryTestId, setSelectedLibraryTestId] = useState("");
  const [compareTestIds, setCompareTestIds] = useState<string[]>([]);
  const [fuelSaveForm, setFuelSaveForm] = useState({
    race_hours: "24",
    pit_loss: "45",
    normal_lap: "",
    normal_fuel: "",
    save_lap: "",
    save_fuel: "",
    fuel_tank: "",
  });
  const [selectedRaceSetupId, setSelectedRaceSetupId] = useState("");
  const [selectedTestFolderId, setSelectedTestFolderId] = useState("all");
  const [newTestFolderName, setNewTestFolderName] = useState("");
  const [newTestFolderParentId, setNewTestFolderParentId] = useState("");
  const [newTestFolderTeamId, setNewTestFolderTeamId] = useState("");
  const [editingTestFolderId, setEditingTestFolderId] = useState<string | null>(
    null,
  );
  const [editingTestFolderName, setEditingTestFolderName] = useState("");
  const [showAddTestFolder, setShowAddTestFolder] = useState(false);
  const [showAddLibraryTest, setShowAddLibraryTest] = useState(false);
  const [editingLibraryTestId, setEditingLibraryTestId] = useState<
    string | null
  >(null);
  const [movingLibraryTest, setMovingLibraryTest] =
    useState<TestLibraryItem | null>(null);
  const [sharingLibraryTest, setSharingLibraryTest] =
    useState<TestLibraryItem | null>(null);
  const [shareLibraryTestTeamId, setShareLibraryTestTeamId] = useState("");
  const [movingSetupFile, setMovingSetupFile] = useState<TeamSetupFile | null>(
    null,
  );
  const [sharingTestFolder, setSharingTestFolder] = useState<TestFolder | null>(
    null,
  );
  const [shareTestFolderTeamId, setShareTestFolderTeamId] = useState("");

  const [selectedSetupFolderId, setSelectedSetupFolderId] = useState("all");
  const [showAddSetupFolder, setShowAddSetupFolder] = useState(false);
  const [newSetupFolderName, setNewSetupFolderName] = useState("");
  const [newSetupFolderParentId, setNewSetupFolderParentId] = useState("");
  const [editingSetupFolderId, setEditingSetupFolderId] = useState<
    string | null
  >(null);
  const [editingSetupFolderName, setEditingSetupFolderName] = useState("");
  const [sharingSetupFolder, setSharingSetupFolder] =
    useState<TeamSetupFolder | null>(null);
  const [shareSetupFolderTeamId, setShareSetupFolderTeamId] = useState("");
  const [showAddSetupFile, setShowAddSetupFile] = useState(false);
  const [editingSetupFileId, setEditingSetupFileId] = useState<string | null>(
    null,
  );
  const [setupFileUpload, setSetupFileUpload] = useState<File | null>(null);
  const [setupForm, setSetupForm] = useState({
    team_id: "",
    folder_id: "",
    car_id: "",
    track_id: "",
    name: "",
    notes: "",
    file_url: "",
    file_name: "",
  });
  const [addRaceTrackSearch, setAddRaceTrackSearch] = useState("");
  const [libraryCarSearch, setLibraryCarSearch] = useState("");
  const [libraryTrackSearch, setLibraryTrackSearch] = useState("");
  const [raceCarSearch, setRaceCarSearch] = useState("");
  const [raceTrackSearch, setRaceTrackSearch] = useState("");
  const [libraryForm, setLibraryForm] = useState({
    team_id: "",
    folder_id: "",
    car_id: "",
    track_id: "",
    weather: "Sunny",
    average_lap: "",
    fuel_tank: "",
    fuel_burn: "",
    inlap: "",
    outlap: "",
    notes: "",
    setup_file_url: "",
    setup_file_name: "",
  });
  const [librarySetupFile, setLibrarySetupFile] = useState<File | null>(null);
  const [testForm, setTestForm] = useState({
    weather: "Sunny",
    average_lap: "",
    fuel_tank: "",
    fuel_burn: "",
    inlap: "",
    outlap: "",
    notes: "",
    setup_file_url: "",
    setup_file_name: "",
  });
  const [teamSetupFile, setTeamSetupFile] = useState<File | null>(null);
  const [driverTestForm, setDriverTestForm] = useState({
    weather: "Sunny",
    average_lap: "",
    fuel_burn: "",
    notes: "",
  });
  const [preferredStintCount, setPreferredStintCount] = useState("");
  const [preferredStintType, setPreferredStintType] =
    useState("Doesn't matter");
  const [editingTestId, setEditingTestId] = useState<string | null>(null);
  const [editingDriverTestId, setEditingDriverTestId] = useState<string | null>(
    null,
  );

  const [results, setResults] = useState(emptyResults());
  const [finishedPopup, setFinishedPopup] = useState(false);
  const [lastFinishedRaceId, setLastFinishedRaceId] = useState<string | null>(
    null,
  );

  const selectedRace = useMemo(
    () => races.find((race: any) => race.id === selectedRaceId) || null,
    [races, selectedRaceId],
  );

  const selectedRaceTeam = useMemo(
    () =>
      selectedRace?.team_id ? getTeamById(teams, selectedRace.team_id) : null,
    [teams, selectedRace],
  );

  const selectedRaceMembers = selectedRace?.team_id
    ? teamMembersByTeam[selectedRace.team_id] || []
    : [];
  const selectedRaceCars = selectedRace?.team_id
    ? cars.filter((car: any) => car.team_id === selectedRace.team_id)
    : [];
  const filteredAddRaceTracks = iracingTracks.filter((track: IRacingTrack) =>
    searchMatches(track.name, addRaceTrackSearch),
  );

  const filteredLibraryCars = iracingCars.filter((car: IRacingCar) =>
    searchMatches(car.name, libraryCarSearch),
  );

  const filteredLibraryTracks = iracingTracks.filter((track: IRacingTrack) =>
    searchMatches(track.name, libraryTrackSearch),
  );

  const filteredRaceCars = selectedRaceCars.filter((car: any) =>
    searchMatches(car.name, raceCarSearch),
  );

  const filteredRaceTracks = iracingTracks.filter((track: IRacingTrack) =>
    searchMatches(track.name, raceTrackSearch),
  );

  const selectedCar =
    selectedRaceCars.find((car: any) => car.id === raceForm.selected_car_id) ||
    null;

  const selectedRaceCarTests = selectedRace
    ? carTests.filter((test: any) => test.team_id === selectedRace.team_id)
    : [];

  const visibleLibraryTests = userId
    ? testLibrary.filter((item: any) => {
        const teamId = effectiveTestTeamId(item);
        return (
          item.user_id === userId ||
          (teamId && selectedRace && teamId === selectedRace.team_id)
        );
      })
    : [];

  const visibleRaceSetups =
    userId && selectedRace
      ? setupFiles.filter(
          (setup: any) =>
            setup.user_id === userId ||
            (setup.team_id && setup.team_id === selectedRace.team_id),
        )
      : [];

  const selectedRaceCarName = raceForm.selected_car_id
    ? selectedRaceCars.find((car: any) => car.id === raceForm.selected_car_id)
        ?.name || ""
    : "";

  const matchingRaceSetups = visibleRaceSetups.filter((setup: any) => {
    const carMatch =
      !setup.car_name ||
      !selectedRaceCarName ||
      setup.car_name === selectedRaceCarName;

    const trackMatch =
      !setup.track_id ||
      !selectedRace?.track_id ||
      setup.track_id === selectedRace.track_id ||
      setup.track_name === selectedRace.track_name;

    return carMatch && trackMatch;
  });

  const selectedRaceSetup = selectedRaceSetupId
    ? visibleRaceSetups.find(
        (setup: any) => setup.id === selectedRaceSetupId,
      ) || null
    : null;

  function carNameFromMaster(id: string | null | undefined) {
    return iracingCars.find((car: any) => car.id === id)?.name || "Unknown Car";
  }

  function trackNameFromMaster(id: string | null | undefined) {
    return (
      iracingTracks.find((track: IRacingTrack) => track.id === id)?.name ||
      "Unknown Track"
    );
  }

  useEffect(() => {
    markSaveDirty("race-data");
  }, [raceForm]);

  useEffect(() => {
    markSaveDirty("race-baseline-test");
  }, [testForm, teamSetupFile, editingTestId]);

  useEffect(() => {
    markSaveDirty("template");
  }, [templateForm, editingTemplateId]);

  useEffect(() => {
    markSaveDirty("settings");
  }, [appDefaultTimeZone, appDefaultRaceLength, appDefaultStartTime]);

  useEffect(() => {
    markSaveDirty("request");
  }, [requestForm]);

  useEffect(() => {
    loadInitialData();

    if (typeof window !== "undefined") {
      try {
        const savedTemplates = window.localStorage.getItem(
          "iracing-stint-planner-templates",
        );
        if (savedTemplates) setRaceTemplates(JSON.parse(savedTemplates));

        const savedSettings = window.localStorage.getItem(
          "iracing-stint-planner-settings",
        );
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings);
          setAppDefaultTimeZone(parsed.defaultTimeZone || "America/New_York");
          setAppDefaultRaceLength(parsed.defaultRaceLength || "24");
          setAppDefaultStartTime(parsed.defaultStartTime || "08:00");
        }
      } catch {
        // Ignore bad local storage data.
      }
    }

    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!userId) return;

    let refreshTimer: number | null = null;
    let pollingTimer: number | null = null;
    let isRefreshing = false;
    let lastAutoRefresh = 0;

    const runLiveRefresh = async (reason: string) => {
      const nowMs = Date.now();

      if (isRefreshing || nowMs - lastAutoRefresh < 900) return;

      isRefreshing = true;
      lastAutoRefresh = nowMs;
      setLiveSyncStatus(`Syncing ${reason}...`);

      await refreshAll();

      isRefreshing = false;
      setLiveSyncStatus(
        `Live synced ${new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`,
      );
    };

    const queueRefresh = (reason: string) => {
      if (refreshTimer) window.clearTimeout(refreshTimer);

      refreshTimer = window.setTimeout(() => {
        runLiveRefresh(reason);
      }, 250);
    };

    const liveTables = [
      "teams",
      "team_members",
      "team_invites",
      "races",
      "cars",
      "car_tests",
      "driver_car_tests",
      "driver_availability",
      "race_stint_weather",
      "race_schedule_adjustments",
      "test_folders",
      "driver_test_library",
      "team_setup_folders",
      "team_setup_files",
      "add_requests",
    ];

    const channel = supabase.channel(`stint-planner-live-${userId}`);

    liveTables.forEach((table) => {
      channel.on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        () => queueRefresh(table.replaceAll("_", " ")),
      );
    });

    channel.subscribe((status) => {
      if (status === "SUBSCRIBED") setLiveSyncStatus("Live sync connected");
      if (status === "CHANNEL_ERROR")
        setLiveSyncStatus("Live sync fallback active");
      if (status === "TIMED_OUT")
        setLiveSyncStatus("Live sync fallback active");
      if (status === "CLOSED") setLiveSyncStatus("Live sync fallback active");
    });

    // Fallback because Supabase Realtime can be delayed or blocked by publication/RLS settings.
    // This keeps teams, invites, tests, setups, availability, and schedules updating without manual refresh.
    pollingTimer = window.setInterval(() => {
      runLiveRefresh("team data");
    }, 2500);

    return () => {
      if (refreshTimer) window.clearTimeout(refreshTimer);
      if (pollingTimer) window.clearInterval(pollingTimer);
      supabase.removeChannel(channel);
    };
  }, [userId]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const requestedRace = params.get("race");
    const requestedTab = params.get("tab") as RaceTab | null;
    const requestedPage = params.get("page") as PageName | null;
    const requestedTeam = params.get("team");

    if (requestedRace) {
      setSelectedRaceId(requestedRace);
      setActivePage("Home");
      if (
        requestedTab &&
        ["Data", "Testing", "Availability", "Schedule", "Live Strategy", "Fuel Calc"].includes(requestedTab)
      ) {
        setActiveRaceTab(requestedTab);
      }
      setHasHydratedRoute(true);
      return;
    }

    if (requestedPage && sidebarItems.includes(requestedPage)) {
      setActivePage(requestedPage);
      setSelectedRaceId(null);
      if (requestedPage === "Teams" && requestedTeam)
        setSelectedTeamViewId(requestedTeam);
      setHasHydratedRoute(true);
      return;
    }

    const savedRoute = window.localStorage.getItem("stintPlannerRoute");
    if (savedRoute) {
      try {
        const route = JSON.parse(savedRoute);
        if (route?.race) {
          setSelectedRaceId(route.race);
          setActivePage("Home");
          if (
            route.tab &&
            ["Data", "Testing", "Availability", "Schedule", "Live Strategy", "Fuel Calc"].includes(route.tab)
          ) {
            setActiveRaceTab(route.tab);
          }
        } else if (route?.page && sidebarItems.includes(route.page)) {
          setActivePage(route.page);
          setSelectedRaceId(null);
          if (route.page === "Teams" && route.team)
            setSelectedTeamViewId(route.team);
        }
      } catch {
        // Ignore bad saved routes.
      }
    }

    setHasHydratedRoute(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !hasHydratedRoute) return;

    const params = new URLSearchParams();

    if (selectedRaceId) {
      params.set("race", selectedRaceId);
      params.set("tab", activeRaceTab);
      window.localStorage.setItem(
        "stintPlannerRoute",
        JSON.stringify({ race: selectedRaceId, tab: activeRaceTab }),
      );
    } else {
      params.set("page", activePage);
      if (activePage === "Teams" && selectedTeamViewId)
        params.set("team", selectedTeamViewId);
      window.localStorage.setItem(
        "stintPlannerRoute",
        JSON.stringify({
          page: activePage,
          team: activePage === "Teams" ? selectedTeamViewId : null,
        }),
      );
    }

    const nextUrl = `/?${params.toString()}`;
    if (window.location.pathname + window.location.search !== nextUrl) {
      window.history.replaceState({}, "", nextUrl);
    }
  }, [
    hasHydratedRoute,
    activePage,
    selectedRaceId,
    activeRaceTab,
    selectedTeamViewId,
  ]);

  useEffect(() => {
    if (selectedRace && selectedRace.id !== loadedRaceFormRaceId) {
      setRaceForm({
        race_name: selectedRace.name || "",
        race_date: selectedRace.race_date || "",
        race_start_real: selectedRace.race_start_real || "08:00",
        race_start_sim: selectedRace.race_start_sim || "08:00",
        main_time_zone: selectedRace.main_time_zone || "America/New_York",
        extra_time_zone: "America/Los_Angeles",
        extra_time_zones: Array.isArray(selectedRace.extra_time_zones)
          ? selectedRace.extra_time_zones
          : [],
        race_length_hours: String(selectedRace.race_length_hours || "1"),
        selected_car_id: selectedRace.selected_car_id || "",
        selected_team_test_id: selectedRace.selected_team_test_id || "",
        selected_driver_test_id: selectedRace.selected_driver_test_id || "",
        track_id: selectedRace.track_id || "",
        team_id: selectedRace.team_id,
      });
      setSelectedTestingCarId(
        selectedRace.selected_car_id || selectedRaceCars[0]?.id || "",
      );
      setRaceTrackSearch(
        selectedRace.track_name ||
          iracingTracks.find(
            (track: IRacingTrack) => track.id === selectedRace.track_id,
          )?.name ||
          "",
      );
      setLoadedRaceFormRaceId(selectedRace.id);
      const savedTarget = availability.find(
        (item: any) =>
          item.race_id === selectedRace.id &&
          item.driver_id === userId &&
          item.target_stints !== null &&
          item.target_stints !== undefined,
      );
      setPreferredStintCount(
        savedTarget?.target_stints ? String(savedTarget.target_stints) : "",
      );
      setPreferredStintType(savedTarget?.ideal_stint_type || "Doesn't matter");
      recalculateFromRace(selectedRace);
    }
  }, [
    selectedRaceId,
    races,
    cars.length,
    carTests.length,
    stintWeather.length,
    scheduleAdjustments.length,
    availability.length,
    driverTests.length,
    userId,
    loadedRaceFormRaceId,
  ]);

  useEffect(() => {
    const finishedRace = races.find((race: any) => {
      const start = makeLocalDate(race.race_date, race.race_start_real);
      const hours = toNumber(race.race_length_hours);
      if (!hours) return false;
      const end = new Date(start.getTime() + hours * 3600 * 1000);
      return now >= end && race.id !== lastFinishedRaceId;
    });

    if (finishedRace) {
      setLastFinishedRaceId(finishedRace.id);
      setFinishedPopup(true);
    }
  }, [now, races, lastFinishedRaceId]);

  async function loadInitialData() {
    setMessage("");

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      setMessage("Sign in at /login to use cloud teams and shared races.");
      return;
    }

    const id = userData.user.id;
    setUserId(id);

    const discordName =
      userData.user.user_metadata?.full_name ||
      userData.user.user_metadata?.name ||
      userData.user.user_metadata?.preferred_username ||
      userData.user.user_metadata?.user_name ||
      "Discord User";

    const profile = {
      id,
      username: discordName,
      display_name: discordName,
      avatar_url: userData.user.user_metadata?.avatar_url || null,
    };

    setUserProfile(profile);

    await supabase.from("profiles").upsert(profile);

    await Promise.all([
      loadTeams(),
      loadRaces(),
      loadCarsAndTests(),
      loadInvites(),
      loadMasterLists(),
    ]);
  }

  async function loadTeams() {
    const { data, error } = await supabase
      .from("teams")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage(error.message);
      return;
    }

    const loadedTeams = (data || []) as CloudTeam[];
    setTeams(loadedTeams);

    const memberEntries: Record<string, TeamMember[]> = {};

    for (const team of loadedTeams) {
      const { data: members } = await supabase
        .from("team_members")
        .select(
          `
          id,
          team_id,
          user_id,
          role,
          status,
          profiles:user_id (
            id,
            username,
            display_name,
            avatar_url
          )
        `,
        )
        .eq("team_id", team.id)
        .eq("status", "active");

      memberEntries[team.id] = (members || []) as unknown as TeamMember[];
    }

    setTeamMembersByTeam(memberEntries);

    // Do not auto-select a team for new races. Users should choose a team intentionally.
  }

  async function loadMasterLists() {
    const [carsRes, tracksRes] = await Promise.all([
      supabase
        .from("iracing_cars")
        .select("*")
        .eq("is_active", true)
        .order("name", { ascending: true }),
      supabase
        .from("iracing_tracks")
        .select("*")
        .eq("is_active", true)
        .order("name", { ascending: true }),
    ]);

    setIracingCars(
      mergeMasterListByName(
        (!carsRes.error ? carsRes.data || [] : []) as IRacingCar[],
        fallbackIRacingCars,
      ),
    );
    setIracingTracks(
      mergeMasterListByName(
        (!tracksRes.error ? tracksRes.data || [] : []) as IRacingTrack[],
        fallbackIRacingTracks,
      ),
    );
  }

  async function loadInvites() {
    const { data: userData } = await supabase.auth.getUser();
    const currentUserId = userData.user?.id;

    if (!currentUserId) {
      setTeamInvites([]);
      return;
    }

    const { data, error } = await supabase
      .from("team_invites")
      .select(
        `
        id,
        team_id,
        invited_user_id,
        invited_by,
        status,
        created_at,
        teams:team_id (
          id,
          name,
          owner_id,
          created_at
        )
      `,
      )
      .eq("status", "pending")
      .eq("invited_user_id", currentUserId)
      .order("created_at", { ascending: false });

    if (error) {
      setMessage(error.message);
      return;
    }

    setTeamInvites((data || []) as unknown as TeamInvite[]);
  }

  async function loadRaces() {
    const { data, error } = await supabase
      .from("races")
      .select("*")
      .order("race_date", { ascending: true });

    if (error) {
      setMessage(error.message);
      return;
    }

    const parsed = (data || []).map((race: any) => ({
      ...race,
      extra_time_zones: Array.isArray(race.extra_time_zones)
        ? race.extra_time_zones
        : [],
      race_length_hours:
        race.race_length_hours === null ? null : Number(race.race_length_hours),
    })) as Race[];

    setRaces(parsed);
  }

  async function loadCarsAndTests() {
    const [
      carsRes,
      masterCarsRes,
      tracksRes,
      foldersRes,
      setupFoldersRes,
      setupFilesRes,
      requestsRes,
      adminsRes,
      libraryRes,
      carTestsRes,
      driverTestsRes,
      availabilityRes,
      weatherRes,
      adjustmentsRes,
    ] = await Promise.all([
      supabase
        .from("cars")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("iracing_cars")
        .select("*")
        .eq("is_active", true)
        .order("name", { ascending: true }),
      supabase
        .from("iracing_tracks")
        .select("*")
        .eq("is_active", true)
        .order("name", { ascending: true }),
      supabase
        .from("test_folders")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("team_setup_folders")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("team_setup_files")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("add_requests")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase.from("app_admins").select("*"),
      supabase
        .from("driver_test_library")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("car_tests")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("driver_car_tests")
        .select(
          "*, profiles:driver_id (id, username, display_name, avatar_url)",
        )
        .order("created_at", { ascending: false }),
      supabase
        .from("driver_availability")
        .select("*")
        .order("stint_number", { ascending: true }),
      supabase
        .from("race_stint_weather")
        .select("*")
        .order("stint_number", { ascending: true }),
      supabase
        .from("race_schedule_adjustments")
        .select("*")
        .order("stint_number", { ascending: true }),
    ]);

    if (carsRes.error) setMessage(carsRes.error.message);
    if (masterCarsRes.error) setMessage(masterCarsRes.error.message);
    if (tracksRes.error) setMessage(tracksRes.error.message);
    if (foldersRes.error) setMessage(foldersRes.error.message);
    if (setupFoldersRes.error) setMessage(setupFoldersRes.error.message);
    if (setupFilesRes.error) setMessage(setupFilesRes.error.message);
    if (requestsRes.error) setMessage(requestsRes.error.message);
    if (adminsRes.error) setMessage(adminsRes.error.message);
    if (libraryRes.error) setMessage(libraryRes.error.message);
    if (carTestsRes.error) setMessage(carTestsRes.error.message);
    if (driverTestsRes.error) setMessage(driverTestsRes.error.message);
    if (availabilityRes.error) setMessage(availabilityRes.error.message);
    if (weatherRes.error) setMessage(weatherRes.error.message);
    if (adjustmentsRes.error) setMessage(adjustmentsRes.error.message);

    setCars((carsRes.data || []) as Car[]);
    setIracingCars((masterCarsRes.data || []) as IRacingCar[]);
    setIracingTracks((tracksRes.data || []) as IRacingTrack[]);
    setTestFolders((foldersRes.data || []) as TestFolder[]);
    setSetupFolders((setupFoldersRes.data || []) as TeamSetupFolder[]);
    setSetupFiles((setupFilesRes.data || []) as TeamSetupFile[]);
    setAddRequests((requestsRes.data || []) as AddRequest[]);
    setAppAdmins((adminsRes.data || []) as AppAdmin[]);
    setTestLibrary((libraryRes.data || []) as TestLibraryItem[]);
    setCarTests((carTestsRes.data || []) as CarTest[]);
    setDriverTests((driverTestsRes.data || []) as unknown as DriverTest[]);
    setAvailability((availabilityRes.data || []) as DriverAvailability[]);
    setStintWeather((weatherRes.data || []) as StintWeather[]);
    setScheduleAdjustments((adjustmentsRes.data || []) as ScheduleAdjustment[]);
  }

  async function refreshAll(showSuccessMessage = false) {
    try {
      await Promise.all([
        loadTeams(),
        loadRaces(),
        loadCarsAndTests(),
        loadInvites(),
        loadMasterLists(),
      ]);

      if (showSuccessMessage) {
        setMessage(
          `Cloud data refreshed at ${new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}.`,
        );
      }
    } catch (error) {
      setMessage(
        `Could not refresh cloud data: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  async function createTeam() {
    if (!userId || !newTeamName.trim()) return;

    const { data: team, error } = await supabase
      .from("teams")
      .insert({ name: newTeamName.trim(), owner_id: userId })
      .select()
      .single();

    if (error) {
      setMessage(error.message);
      return;
    }

    const { error: memberError } = await supabase.from("team_members").insert({
      team_id: team.id,
      user_id: userId,
      role: "admin",
      status: "active",
    });

    if (memberError) setMessage(memberError.message);

    setMessage("Team created. You were added as the team admin.");

    setNewTeamName("");
    await loadTeams();
  }

  async function saveTeamEdit() {
    if (!editingTeamId || !editingTeamName.trim()) return;

    const { error } = await supabase
      .from("teams")
      .update({ name: editingTeamName.trim() })
      .eq("id", editingTeamId);

    if (error) setMessage(error.message);

    setEditingTeamId(null);
    setEditingTeamName("");
    await loadTeams();
  }

  async function deleteTeam(team: CloudTeam) {
    const { error } = await supabase.from("teams").delete().eq("id", team.id);

    if (error) {
      setMessage(error.message);
      return;
    }

    await refreshAll();
  }

  async function acceptInvite(invite: TeamInvite) {
    if (!userId) return;

    const alreadyMember = Object.values(teamMembersByTeam)
      .flat()
      .some(
        (member: any) =>
          member.team_id === invite.team_id && member.user_id === userId,
      );

    if (!alreadyMember) {
      const { error: memberError } = await supabase
        .from("team_members")
        .insert({
          team_id: invite.team_id,
          user_id: userId,
          role: "driver",
          status: "active",
        });

      if (memberError && !memberError.message.includes("duplicate")) {
        setMessage(memberError.message);
        return;
      }
    }

    await supabase
      .from("team_invites")
      .update({ status: "accepted" })
      .eq("id", invite.id);
    await refreshAll();
    setActivePage("Teams");
    setSelectedRaceId(null);
    setSelectedTeamViewId(invite.team_id);
  }

  async function declineInvite(invite: TeamInvite) {
    await supabase
      .from("team_invites")
      .update({ status: "declined" })
      .eq("id", invite.id);
    await loadInvites();
  }

  function getRaceTimer(race: Race) {
    if (!race.race_date || !race.race_start_real)
      return "Set start time in Data";
    const start = makeLocalDate(race.race_date, race.race_start_real);
    const hours = toNumber(race.race_length_hours);
    const end = new Date(start.getTime() + hours * 3600 * 1000);

    if (now < start)
      return `Race starts in ${formatCountdown(start.getTime() - now.getTime())}`;
    if (hours && now < end)
      return `Race ends in ${formatCountdown(end.getTime() - now.getTime())}`;
    if (hours && now >= end) return "Race finished";
    return "Race started";
  }

  function slugFileName(value: string) {
    return value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function getStorageTrackImageUrl(trackName: string | null | undefined) {
    if (!trackName) return null;

    const possibleFiles = [
      `${slugFileName(trackName)}.jpg`,
      `${slugFileName(trackName)}.jpeg`,
      `${slugFileName(trackName)}.png`,
      `${slugFileName(trackName)}.webp`,
    ];

    for (const fileName of possibleFiles) {
      const { data } = supabase.storage
        .from("track-images")
        .getPublicUrl(fileName);
      if (data.publicUrl) return data.publicUrl;
    }

    return null;
  }

  function getRaceTrackImage(race: Race) {
    const track = iracingTracks.find(
      (item: IRacingTrack) => item.id === race.track_id,
    );

    // Prefer the file directly from the public Supabase Storage bucket.
    // This avoids old/wrong image_url values that may have been saved in the database.
    return (
      getStorageTrackImageUrl(track?.name || race.track_name) ||
      track?.image_url ||
      race.track_image_url ||
      null
    );
  }

  function isTeamAdminRole(role?: string | null) {
    return role === "owner" || role === "admin" || role === "manager";
  }

  function canManageTeamById(teamId: string | null | undefined) {
    if (!teamId || !userId) return false;

    const team = teams.find((item: any) => item.id === teamId);
    if (team?.owner_id === userId) return true;

    return (teamMembersByTeam[teamId] || []).some(
      (member: any) =>
        member.user_id === userId &&
        isTeamAdminRole(member.role) &&
        (member.status || "active") === "active",
    );
  }

  function canCreateRaceForTeam(teamId: string | null | undefined) {
    if (!teamId) return true;
    return canManageTeamById(teamId);
  }

  function canEditRace(race: Race | null | undefined) {
    if (!race || !userId) return false;
    if (race.created_by === userId) return true;
    if (race.team_id && canManageTeamById(race.team_id)) return true;
    return false;
  }

  async function createRace() {
    if (!newRaceName.trim() || !newRaceDate || !newRaceTrackId || !userId) {
      setMessage("Race name, date, and track are required.");
      return;
    }

    if (newRaceTeamId && !canCreateRaceForTeam(newRaceTeamId)) {
      setMessage(
        "Only the team owner or a team admin can create races for that team.",
      );
      return;
    }

    if (!isPositiveNumberString(appDefaultRaceLength)) {
      setMessage(
        "Default race length in Settings must be a positive number before creating a race.",
      );
      return;
    }

    const defaultRaceLength = toNumber(appDefaultRaceLength, 1);

    const { data, error } = await supabase
      .from("races")
      .insert({
        name: newRaceName.trim(),
        race_date: newRaceDate,
        team_id: newRaceTeamId || null,
        track_id: newRaceTrackId || null,
        track_name:
          iracingTracks.find(
            (track: IRacingTrack) => track.id === newRaceTrackId,
          )?.name || null,
        track_image_url:
          iracingTracks.find(
            (track: IRacingTrack) => track.id === newRaceTrackId,
          )?.image_url || null,
        created_by: userId,
        race_start_real: "08:00",
        race_start_sim: "08:00",
        main_time_zone: "America/New_York",
        extra_time_zones: [],
        race_length_hours: defaultRaceLength,
      })
      .select()
      .single();

    if (error) {
      setMessage(error.message);
      return;
    }

    setNewRaceName("");
    setNewRaceTrackId("");
    setAddRaceTrackSearch("");
    setNewRaceTeamId("");
    setShowAddRace(false);
    await loadRaces();
    setMessage("Race created. Click Open when you are ready to set it up.");
  }

  async function saveRaceEdit(race: Race) {
    if (!canEditRace(race)) {
      setMessage(
        "Only the race creator, team owner, or team admin can edit this race.",
      );
      return;
    }

    if (!editingRaceName.trim() || !editingRaceDate || !editingRaceTrackId) {
      setMessage("Race name, date, and track are required.");
      return;
    }

    await supabase
      .from("races")
      .update({
        name: editingRaceName.trim(),
        race_date: editingRaceDate,
        track_id: editingRaceTrackId || null,
        track_name:
          iracingTracks.find(
            (track: IRacingTrack) => track.id === editingRaceTrackId,
          )?.name || null,
        track_image_url:
          iracingTracks.find(
            (track: IRacingTrack) => track.id === editingRaceTrackId,
          )?.image_url || null,
      })
      .eq("id", race.id);

    setEditingRaceId(null);
    setEditingRaceName("");
    setEditingRaceDate("");
    setEditingRaceTrackId("");
    await loadRaces();
  }

  async function deleteRace(race: Race) {
    if (!canEditRace(race)) {
      setMessage(
        "Only the race creator, team owner, or team admin can delete this race.",
      );
      return;
    }

    await supabase.from("races").delete().eq("id", race.id);
    if (selectedRaceId === race.id) setSelectedRaceId(null);
    await loadRaces();
  }

  async function saveRaceData(): Promise<boolean> {
    if (!selectedRace) return false;

    if (!canEditRace(selectedRace)) {
      setMessage(
        "Only the race creator, team owner, or team admin can edit Race Data.",
      );
      return false;
    }

    if (!isPositiveNumberString(raceForm.race_length_hours)) {
      setMessage("Race length must be a positive number. Example: 12 or 24.");
      return false;
    }

    const extraZones = raceForm.extra_time_zones.filter(
      (zone: string) => zone && zone !== raceForm.main_time_zone,
    );

    const nextTrackId = raceForm.track_id || selectedRace.track_id || null;
    const nextTrack = nextTrackId
      ? iracingTracks.find((track: IRacingTrack) => track.id === nextTrackId)
      : null;

    const { error } = await supabase
      .from("races")
      .update({
        name: raceForm.race_name?.trim() || selectedRace.name,
        race_date: raceForm.race_date || selectedRace.race_date,
        team_id: raceForm.team_id || null,
        race_start_real: raceForm.race_start_real,
        race_start_sim: raceForm.race_start_sim,
        main_time_zone: raceForm.main_time_zone,
        extra_time_zones: extraZones,
        race_length_hours: toNumber(raceForm.race_length_hours, 0),
        selected_car_id: raceForm.selected_car_id || null,
        track_id: nextTrackId,
        track_name: nextTrack?.name || selectedRace.track_name || null,
        track_image_url:
          nextTrack?.image_url || selectedRace.track_image_url || null,
      })
      .eq("id", selectedRace.id);

    if (error) {
      setMessage(error.message);
      return false;
    }

    await loadRaces();
    await loadCarsAndTests();
    markSaveSaved("race-data");
    return true;
  }

  async function calculateRace() {
    const saved = await saveRaceData();
    if (!saved) return;
    if (selectedRace)
      recalculateFromRace({ ...selectedRace, ...raceForm } as unknown as Race);
  }

  function fastestCarTest(tests: CarTest[]) {
    const valid = tests.filter((test) => toNumber(test.average_lap, 0) > 0);
    if (valid.length === 0) return tests[0] || null;

    return [...valid].sort(
      (a, b) =>
        toNumber(a.average_lap, Number.POSITIVE_INFINITY) -
        toNumber(b.average_lap, Number.POSITIVE_INFINITY),
    )[0];
  }

  function fastestDriverTest(tests: DriverTest[]) {
    const valid = tests.filter((test) => toNumber(test.average_lap, 0) > 0);
    if (valid.length === 0) return tests[0] || null;

    return [...valid].sort(
      (a, b) =>
        toNumber(a.average_lap, Number.POSITIVE_INFINITY) -
        toNumber(b.average_lap, Number.POSITIVE_INFINITY),
    )[0];
  }

  function getSelectedRaceCarId(race?: Race | null) {
    return (
      raceForm.selected_car_id ||
      race?.selected_car_id ||
      selectedRace?.selected_car_id ||
      selectedTestingCarId ||
      ""
    );
  }

  function fastestWeatherTest(tests: CarTest[]) {
    return fastestCarTest(tests);
  }

  function getBaseTestForWeather(weather: string, carId?: string | null) {
    const selectedCarId = carId || getSelectedRaceCarId(selectedRace);
    if (!selectedCarId) return null;

    const normalizedWeather = weather || "Sunny";

    // Manual baseline only applies to matching weather. If the row weather changes,
    // the schedule must switch to that row's matching weather test.
    if (raceForm.selected_team_test_id) {
      const chosen = selectedRaceCarTests.find(
        (test: any) =>
          test.id === raceForm.selected_team_test_id &&
          test.car_id === selectedCarId &&
          (test.weather || "Sunny") === normalizedWeather,
      );
      if (chosen) return chosen;
    }

    const exactWeatherTests = selectedRaceCarTests.filter(
      (test: any) =>
        test.car_id === selectedCarId &&
        (test.weather || "Sunny") === normalizedWeather,
    );

    const sunnyTests = selectedRaceCarTests.filter(
      (test: any) =>
        test.car_id === selectedCarId && (test.weather || "Sunny") === "Sunny",
    );

    const anyWeatherTests = selectedRaceCarTests.filter(
      (test: any) => test.car_id === selectedCarId,
    );

    return (
      fastestWeatherTest(exactWeatherTests) ||
      fastestWeatherTest(sunnyTests) ||
      fastestWeatherTest(anyWeatherTests) ||
      null
    );
  }

  function getDriverPace(
    driverId: string | null,
    weather: string,
    race?: Race | null,
  ) {
    const selectedCarId = getSelectedRaceCarId(race);
    if (!driverId || !selectedCarId) return null;

    const normalizedWeather = weather || "Sunny";

    // Only use this driver's own test when it matches the selected schedule weather.
    // If Driver 1 has no Rain test but Driver 2 does, timing should fall back to the
    // team's fastest Rain baseline instead of Driver 1's Sunny/other-weather test.
    const exactWeatherTests = selectedRaceCarTests.filter(
      (test: any) =>
        test.car_id === selectedCarId &&
        test.created_by === driverId &&
        (test.weather || "Sunny") === normalizedWeather,
    );

    return fastestWeatherTest(exactWeatherTests) || null;
  }

  function availabilityRankForStatus(status: string | null | undefined) {
    if (status === "Want to Drive") return 0;
    if (status === "Available to Drive") return 1;
    if (status === "Prefer Not to Drive") return 2;
    return 3;
  }

  function getRaceWindow(race?: Race | null) {
    const targetRace = race || selectedRace;
    if (!targetRace) return null;

    const start = makeLocalDate(
      targetRace.race_date,
      raceForm.race_start_real || targetRace.race_start_real,
    );
    const raceLengthSeconds =
      toNumber(raceForm.race_length_hours || targetRace.race_length_hours, 0) *
      3600;
    const end = new Date(
      start.getTime() + Math.max(0, raceLengthSeconds) * 1000,
    );

    return { start, end, raceLengthSeconds };
  }

  function getAvailabilityHourSlots(race?: Race | null) {
    const targetRace = race || selectedRace;
    const window = getRaceWindow(targetRace);
    if (!targetRace || !window || window.raceLengthSeconds <= 0) return [];

    const slots = [];
    const totalHours = Math.max(1, Math.ceil(window.raceLengthSeconds / 3600));

    for (let index = 0; index < totalHours; index++) {
      const start = new Date(window.start.getTime() + index * 3600 * 1000);
      const end = new Date(
        Math.min(start.getTime() + 3600 * 1000, window.end.getTime()),
      );
      if (start >= window.end) break;
      slots.push({ slot: index + 1, start, end });
    }

    return slots;
  }

  function availabilityRowsForDriver(
    driverId: string | null | undefined,
    race?: Race | null,
  ) {
    const targetRace = race || selectedRace;
    if (!targetRace || !driverId) return [];

    return availability.filter(
      (item: any) =>
        item.race_id === targetRace.id && item.driver_id === driverId,
    );
  }

  function getDriverAvailabilityPreference(
    driverId: string | null | undefined,
    slotNumber: number,
    race?: Race | null,
  ) {
    const row = availabilityRowsForDriver(driverId, race).find(
      (item: any) => item.stint_number === slotNumber,
    );
    return row || null;
  }

  function getDriverAvailabilityForRange(
    driverId: string | null | undefined,
    start: Date,
    end: Date,
    race?: Race | null,
  ) {
    const targetRace = race || selectedRace;
    if (!targetRace || !driverId) {
      return {
        status: "Available to Drive",
        rank: 1,
        rows: [],
        conflictSlots: [] as number[],
      };
    }

    const slots = getAvailabilityHourSlots(targetRace).filter(
      (slot) => start < slot.end && end > slot.start,
    );
    const savedRows = availabilityRowsForDriver(driverId, targetRace);
    const overlapping = slots.map((slot) => {
      const saved = savedRows.find(
        (item: any) => item.stint_number === slot.slot,
      );
      return {
        slot: slot.slot,
        status: saved?.status || "Available to Drive",
        row: saved,
      };
    });

    const worst = overlapping.reduce(
      (current, item) =>
        availabilityRankForStatus(item.status) >
        availabilityRankForStatus(current.status)
          ? item
          : current,
      { slot: 0, status: "Available to Drive", row: null as any },
    );

    return {
      status: worst.status,
      rank: availabilityRankForStatus(worst.status),
      rows: overlapping,
      conflictSlots: overlapping
        .filter(
          (item) =>
            item.status === "Unavailable to Drive" ||
            item.status === "Prefer Not to Drive",
        )
        .map((item) => item.slot),
    };
  }

  function buildSchedule(
    raceOverride?: Race,
    weatherOverride?: StintWeather[],
    _refreshKey?: number,
  ) {
    const race = raceOverride || selectedRace;
    if (!race) return [];

    const teamId = raceForm.team_id || race.team_id;
    const members = teamMembersByTeam[teamId] || [];
    const startReal = makeLocalDate(
      race.race_date,
      raceForm.race_start_real || race.race_start_real,
    );
    let simStart = makeLocalDate(
      race.race_date,
      raceForm.race_start_sim || race.race_start_sim,
    );
    let currentStart = new Date(startReal);

    const selectedScheduleCarId = getSelectedRaceCarId(race);
    const raceLengthSeconds =
      toNumber(raceForm.race_length_hours || race.race_length_hours, 0) * 3600;
    const defaultTest = getBaseTestForWeather("Sunny", selectedScheduleCarId);
    const defaultAvgLap = toNumber(defaultTest?.average_lap, 90);
    const defaultTank = toNumber(defaultTest?.fuel_tank, 100);
    const defaultFuelBurn = toNumber(defaultTest?.fuel_burn, 3);
    const defaultInlap = toNumber(defaultTest?.inlap, defaultAvgLap);
    const defaultOutlap = toNumber(defaultTest?.outlap, defaultAvgLap);
    const defaultLapsPerStint = defaultFuelBurn
      ? defaultTank / defaultFuelBurn
      : 1;
    const rawFuelStintSeconds = Math.max(
      60,
      (defaultLapsPerStint - 2) * defaultAvgLap + defaultInlap + defaultOutlap,
    );

    // Build the schedule from actual baseline-test fuel math, then cap the final stint
    // exactly at the race end. This keeps weather timing accurate without letting rows run past 24h.
    const raceEnd = new Date(startReal.getTime() + raceLengthSeconds * 1000);
    const estimatedStints = Math.max(
      1,
      Math.ceil(raceLengthSeconds / rawFuelStintSeconds),
    );
    const maxScheduleRows = 80;

    const rows: ScheduleRow[] = [];

    function idealBonus(
      ideal: string | null | undefined,
      currentStreak: number,
    ) {
      const preferred = !ideal || ideal === "Doesn't matter" ? "Double" : ideal;
      if (preferred === "Single" && currentStreak === 0) return -2;
      if (preferred === "Double" && currentStreak === 1) return -2;
      if (preferred === "Triple" && currentStreak === 2) return -2;
      if (preferred === "Quadruple" && currentStreak === 3) return -2;
      if (preferred === "Single" && currentStreak >= 1) return 5;
      if (preferred === "Double" && currentStreak >= 2) return 5;
      if (preferred === "Triple" && currentStreak >= 3) return 5;
      return 0;
    }

    for (
      let stint = 1;
      currentStart < raceEnd && stint <= maxScheduleRows;
      stint++
    ) {
      const weatherSource = weatherOverride || stintWeather;
      const savedWeather =
        weatherSource.find(
          (row) => row.race_id === race.id && row.stint_number === stint,
        )?.weather || "Sunny";

      const adjustment = scheduleAdjustments.find(
        (row) => row.race_id === race.id && row.stint_number === stint,
      );

      const assignedCounts = rows.reduce(
        (counts: Record<string, number>, row) => {
          if (row.driverId)
            counts[row.driverId] = (counts[row.driverId] || 0) + 1;
          return counts;
        },
        {},
      );

      const lastDriverId = rows[rows.length - 1]?.driverId || null;
      const currentStreak = lastDriverId
        ? [...rows].reverse().findIndex((row) => row.driverId !== lastDriverId)
        : 0;
      const streakCount = currentStreak === -1 ? rows.length : currentStreak;

      const rankedMembers = members
        .map((member: any, index: number) => {
          const startSlot = getAvailabilityHourSlots(race).find(
            (slot) => currentStart >= slot.start && currentStart < slot.end,
          );
          const saved = getDriverAvailabilityPreference(
            member.user_id,
            startSlot?.slot || 1,
            race,
          );
          const preference = getDriverStintPreference(member.user_id);
          const status = saved?.status || "Available to Drive";
          const availabilityRank = availabilityRankForStatus(status);
          const driverPace = getDriverPace(member.user_id, savedWeather, race);
          const avgLap = toNumber(
            driverPace?.average_lap,
            Number.POSITIVE_INFINITY,
          );
          const assignedCount = assignedCounts[member.user_id] || 0;
          const isContinuing = member.user_id === lastDriverId;
          const targetStints = toNumber(
            saved?.target_stints,
            toNumber(preference.count, 0),
          );
          const preferredType =
            saved?.ideal_stint_type || preference.type || "Doesn't matter";
          const idealTarget =
            targetStints > 0
              ? targetStints
              : Math.ceil(estimatedStints / Math.max(1, members.length));
          const targetDeficit =
            targetStints > 0 ? Math.max(0, targetStints - assignedCount) : 0;
          const targetOverage =
            targetStints > 0 ? Math.max(0, assignedCount - targetStints) : 0;
          const belowTargetBonus = targetStints > 0 ? -targetDeficit * 220 : 0;
          const overTargetPenalty = targetStints > 0 ? targetOverage * 1000 : 0;
          const evenSplitPenalty = targetStints > 0 ? 0 : assignedCount * 120;
          const roundRobinPenalty =
            (index - (stint - 1) + members.length) %
            Math.max(1, members.length);

          return {
            member,
            index,
            saved,
            status,
            availabilityRank,
            assignedCount,
            driverPace,
            avgLap,
            isContinuing,
            targetStints,
            score:
              availabilityRank * 1000 +
              evenSplitPenalty +
              (assignedCount > idealTarget ? 400 : 0) +
              belowTargetBonus +
              overTargetPenalty +
              (Number.isFinite(avgLap) ? avgLap / 20 : 25) +
              idealBonus(preferredType, isContinuing ? streakCount : 0) +
              roundRobinPenalty,
          };
        })
        .sort((a: any, b: any) => a.score - b.score);

      const bestAvailableDriver =
        rankedMembers.find((item: any) => item.availabilityRank < 3) ||
        rankedMembers[0];

      const driverId =
        adjustment?.driver_id ||
        bestAvailableDriver?.member?.user_id ||
        (members.length > 0
          ? members[(stint - 1) % members.length].user_id
          : null);

      const picked = rankedMembers.find(
        (item: any) => item.member.user_id === driverId,
      );
      const baseTest = getBaseTestForWeather(
        savedWeather,
        selectedScheduleCarId,
      );
      const driverPace = getDriverPace(driverId, savedWeather, race);
      const timingTest = driverPace || baseTest;
      const avgLap = toNumber(timingTest?.average_lap, defaultAvgLap);
      const tank = toNumber(
        timingTest?.fuel_tank,
        toNumber(baseTest?.fuel_tank, defaultTank),
      );
      const fuelBurn = toNumber(
        timingTest?.fuel_burn,
        toNumber(baseTest?.fuel_burn, defaultFuelBurn),
      );
      const inlap = toNumber(
        timingTest?.inlap,
        toNumber(baseTest?.inlap, defaultInlap),
      );
      const outlap = toNumber(
        timingTest?.outlap,
        toNumber(baseTest?.outlap, defaultOutlap),
      );
      const lapsPerStint = fuelBurn ? tank / fuelBurn : defaultLapsPerStint;
      const addSeconds = toNumber(adjustment?.add_seconds, 0);

      const rawWeatherStintSeconds = Math.max(
        60,
        (lapsPerStint - 2) * avgLap + inlap + outlap,
      );
      const remainingSeconds = Math.max(
        0,
        (raceEnd.getTime() - currentStart.getTime()) / 1000,
      );

      let durationSeconds = Math.max(60, rawWeatherStintSeconds + addSeconds);
      durationSeconds = Math.min(durationSeconds, remainingSeconds);

      let end = new Date(currentStart.getTime() + durationSeconds * 1000);
      if (end > raceEnd) end = new Date(raceEnd);

      if (adjustment?.actual_end_time) {
        const mainZone =
          raceForm.main_time_zone || race.main_time_zone || "America/New_York";
        const actualDate = dateInputInZone(currentStart, mainZone);
        const actual = makeLocalDate(actualDate, adjustment.actual_end_time);
        if (actual > currentStart && actual <= raceEnd) end = actual;
      }

      const simEnd = new Date(
        simStart.getTime() + (end.getTime() - currentStart.getTime()),
      );
      const finalAvailability = getDriverAvailabilityForRange(
        driverId,
        currentStart,
        end,
        race,
      );

      let pickReason = "Balanced rotation";
      if (adjustment?.driver_id) pickReason = "Manual override";
      else if (picked?.status === "Want to Drive")
        pickReason = "Wanted this stint";
      else if (picked?.driverPace?.average_lap)
        pickReason = "Best availability + pace";
      else if (picked?.status === "Available to Drive")
        pickReason = "Available and balanced";

      let warning = "";
      if (!members.length) warning = "No team drivers found.";
      else if (!driverId) warning = "No driver selected.";
      else if (finalAvailability.status === "Unavailable to Drive")
        warning = `Availability conflict: driver marked unavailable during hour ${finalAvailability.conflictSlots.join(", ")}.`;
      else if (finalAvailability.status === "Prefer Not to Drive")
        warning = `Preference conflict: driver preferred not to drive during hour ${finalAvailability.conflictSlots.join(", ")}.`;
      else if ((finalAvailability.rank ?? 0) >= 3)
        warning = "Only unavailable drivers matched.";
      else if (!baseTest) warning = "No baseline test for this car/weather.";
      else if (
        baseTest &&
        (baseTest.weather || "Sunny") !== savedWeather &&
        !driverPace
      )
        warning = `Using ${baseTest.weather || "Sunny"} fallback for ${savedWeather}.`;

      rows.push({
        stint,
        driverId,
        weather: savedWeather,
        start: new Date(currentStart),
        end,
        simStart: new Date(simStart),
        simEnd,
        addSeconds,
        actualEndTime: adjustment?.actual_end_time || "",
        completed: Boolean(adjustment?.completed),
        pickReason,
        driverStatus:
          finalAvailability.status || picked?.status || "Available to Drive",
        driverAvgLap: driverPace?.average_lap ?? null,
        usedDriverPace: Boolean(driverPace?.average_lap),
        warning,
      });

      currentStart = end;
      simStart = simEnd;

      if (currentStart >= raceEnd) break;
    }

    if (
      rows.length >= maxScheduleRows &&
      rows[rows.length - 1]?.end < raceEnd
    ) {
      rows[rows.length - 1].warning =
        "Schedule hit the row safety limit. Check fuel burn/lap test data.";
      rows[rows.length - 1].end = new Date(raceEnd);
    }

    return rows;
  }

  function recalculateFromRace(race?: Race) {
    const schedule = buildSchedule(race);
    const defaultTest = getBaseTestForWeather(
      "Sunny",
      raceForm.selected_car_id || race?.selected_car_id,
    );
    const avgLap = toNumber(defaultTest?.average_lap, 0);
    const tank = toNumber(defaultTest?.fuel_tank, 0);
    const fuelBurn = toNumber(defaultTest?.fuel_burn, 0);
    const inlap = toNumber(defaultTest?.inlap, 0);
    const outlap = toNumber(defaultTest?.outlap, 0);
    const raceLengthHours = toNumber(
      raceForm.race_length_hours || race?.race_length_hours,
      0,
    );
    const raceSeconds = raceLengthHours * 3600;

    if (!avgLap || !tank || !fuelBurn) {
      setResults({
        ...emptyResults(),
        scheduleRows: schedule.length ? String(schedule.length) : "",
      });
      return;
    }

    const raceLaps = raceSeconds / avgLap;
    const lapsPerStint = tank / fuelBurn;
    const stintSeconds = Math.max(
      60,
      (lapsPerStint - 2) * avgLap + inlap + outlap,
    );
    const exactStints = raceSeconds / stintSeconds;
    const stintsNeeded = schedule.length || Math.max(1, Math.ceil(exactStints));
    const pitStops = Math.max(0, stintsNeeded - 1);
    const pitTime = (inlap + outlap) / 2 - avgLap;
    const totalPit = pitTime * pitStops;

    setResults({
      raceLaps: raceLaps.toFixed(0),
      stintLength: `${lapsPerStint.toFixed(1)} laps`,
      stintMinutes: `${Math.round(stintSeconds / 60)}m`,
      exactStints: exactStints.toFixed(2),
      stintsNeeded: String(stintsNeeded),
      pitStops: String(pitStops),
      pitTime: `${Math.round(pitTime)}s`,
      totalPitTime: `${Math.round(totalPit / 60)}m`,
      scheduleRows: String(schedule.length || stintsNeeded),
    });
  }

  async function addExtraTimeZone() {
    if (!raceForm.extra_time_zones.includes(raceForm.extra_time_zone)) {
      setRaceForm((prev: any) => ({
        ...prev,
        extra_time_zones: [...prev.extra_time_zones, prev.extra_time_zone],
      }));
    }
  }

  async function uploadSetupFile(file: File, folder: string) {
    if (!userId) return null;

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const path = `${folder}/${userId}/${Date.now()}-${safeName}`;

    const { error } = await supabase.storage
      .from("setup-files")
      .upload(path, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      setMessage(`Setup file upload failed: ${error.message}`);
      return null;
    }

    const { data } = supabase.storage.from("setup-files").getPublicUrl(path);

    return {
      url: data.publicUrl,
      name: file.name,
    };
  }

  async function createTestFolder() {
    if (!userId) return;
    if (!newTestFolderName.trim()) {
      setMessage("Enter a folder name before creating the folder.");
      return;
    }

    const inheritedTeamId = getInheritedTestFolderTeamId(newTestFolderParentId);
    const folderTeamId = inheritedTeamId || newTestFolderTeamId || "";

    const { error } = await supabase.from("test_folders").insert({
      user_id: userId,
      team_id: folderTeamId || null,
      name: newTestFolderName.trim(),
      folder_type: folderTeamId ? "team" : "custom",
      parent_id: newTestFolderParentId || null,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setNewTestFolderName("");
    setNewTestFolderParentId("");
    setNewTestFolderTeamId("");
    setShowAddTestFolder(false);
    await loadCarsAndTests();
  }

  function startEditTestFolder(folder: TestFolder) {
    setEditingTestFolderId(folder.id);
    setEditingTestFolderName(folder.name);
  }

  async function saveTestFolderEdit(folder: TestFolder) {
    if (!userId || !canEditTestFolder(folder) || !editingTestFolderName.trim())
      return;

    const { error } = await supabase
      .from("test_folders")
      .update({ name: editingTestFolderName.trim() })
      .eq("id", folder.id);

    if (error) {
      setMessage(error.message);
      return;
    }

    setEditingTestFolderId(null);
    setEditingTestFolderName("");
    await loadCarsAndTests();
  }

  async function shareTestFolderWithTeam(folder: TestFolder, teamId: string) {
    if (!userId || !canEditTestFolder(folder)) {
      setMessage("You can only share folders you own or manage.");
      return;
    }

    const { error } = await supabase
      .from("test_folders")
      .update({
        team_id: teamId || null,
        folder_type: teamId ? "team" : "custom",
      })
      .eq("id", folder.id);

    if (error) {
      setMessage(error.message);
      return;
    }

    setSharingTestFolder(null);
    setShareTestFolderTeamId("");
    setMessage(
      teamId
        ? "Folder shared with team. Tests inside this folder are now shared."
        : "Folder sharing removed. Tests inside are now personal unless moved into another shared folder.",
    );
    await loadCarsAndTests();
  }

  async function deleteTestFolder(folder: TestFolder) {
    if (!userId || !canEditTestFolder(folder)) return;

    const { error } = await supabase
      .from("test_folders")
      .delete()
      .eq("id", folder.id);

    if (error) {
      setMessage(error.message);
      return;
    }

    if (selectedTestFolderId === folder.id) setSelectedTestFolderId("all");
    await loadCarsAndTests();
  }

  async function updateLibraryTestFolder(
    test: TestLibraryItem,
    folderId: string,
  ) {
    if (!userId || !canEditSharedItem(test)) return;

    const inheritedTeamId = getInheritedTestFolderTeamId(folderId);
    const nextTeamId = inheritedTeamId || test.team_id || null;

    setTestLibrary((prev: any) =>
      prev.map((item: any) =>
        item.id === test.id
          ? { ...item, folder_id: folderId || null, team_id: nextTeamId }
          : item,
      ),
    );

    const { error } = await supabase
      .from("driver_test_library")
      .update({ folder_id: folderId || null, team_id: nextTeamId })
      .eq("id", test.id);

    if (error) {
      setMessage(error.message);
      await loadCarsAndTests();
      return;
    }

    await loadCarsAndTests();
  }

  async function shareLibraryTestWithTeam(
    test: TestLibraryItem,
    teamId: string,
  ) {
    if (!userId || !canEditSharedItem(test)) {
      setMessage("You can only share tests you own or manage.");
      return;
    }

    const inheritedTeamId = getInheritedTestFolderTeamId(test.folder_id);

    if (inheritedTeamId && teamId !== inheritedTeamId) {
      setMessage(
        "This test is inside a team-shared folder. Move it out of that folder before changing individual sharing.",
      );
      return;
    }

    setTestLibrary((prev: any) =>
      prev.map((item: any) =>
        item.id === test.id ? { ...item, team_id: teamId || null } : item,
      ),
    );

    const { error } = await supabase
      .from("driver_test_library")
      .update({ team_id: teamId || null })
      .eq("id", test.id);

    if (error) {
      setMessage(error.message);
      await loadCarsAndTests();
      return;
    }

    setSharingLibraryTest(null);
    setShareLibraryTestTeamId("");
    setMessage(teamId ? "Test shared with team." : "Test sharing removed.");
    await loadCarsAndTests();
  }

  async function saveLibraryTest() {
    if (!userId) return;

    const carId =
      libraryForm.car_id ||
      iracingCars.find((item: any) => item.name === libraryCarSearch)?.id ||
      "";

    const trackId =
      libraryForm.track_id ||
      iracingTracks.find((item: any) => item.name === libraryTrackSearch)?.id ||
      "";

    if (!carId || !trackId) {
      setMessage("Choose both a car and a track before saving the test.");
      return;
    }

    setMessage(editingLibraryTestId ? "Updating test..." : "Saving test...");

    const car = iracingCars.find((item: any) => item.id === carId);
    const track = iracingTracks.find((item: any) => item.id === trackId);
    const uploadedSetup = librarySetupFile
      ? await uploadSetupFile(librarySetupFile, "library-tests")
      : null;

    if (librarySetupFile && !uploadedSetup) {
      return;
    }

    const selectedFolderForTest =
      selectedTestFolderId === "all" ? "" : selectedTestFolderId;
    const inheritedTeamId = getInheritedTestFolderTeamId(selectedFolderForTest);

    const payload = {
      user_id: userId,
      team_id: inheritedTeamId || null,
      folder_id: selectedFolderForTest || null,
      car_id: carId,
      track_id: trackId,
      car_name: car?.name || libraryCarSearch || null,
      track_name: track?.name || libraryTrackSearch || null,
      weather: libraryForm.weather,
      average_lap: toNumber(libraryForm.average_lap, 0),
      fuel_tank: toNumber(libraryForm.fuel_tank, 0),
      fuel_burn: toNumber(libraryForm.fuel_burn, 0),
      inlap: toNumber(libraryForm.inlap, 0),
      outlap: toNumber(libraryForm.outlap, 0),
      notes: libraryForm.notes,
      setup_file_url: uploadedSetup?.url || libraryForm.setup_file_url || null,
      setup_file_name:
        uploadedSetup?.name || libraryForm.setup_file_name || null,
    };

    const result = editingLibraryTestId
      ? await supabase
          .from("driver_test_library")
          .update(payload)
          .eq("id", editingLibraryTestId)
          .eq("user_id", userId)
      : await supabase.from("driver_test_library").insert(payload);

    if (result.error) {
      setMessage(result.error.message);
      return;
    }

    setLibraryForm({
      team_id: "",
      folder_id: selectedTestFolderId === "all" ? "" : selectedTestFolderId,
      car_id: "",
      track_id: "",
      weather: "Sunny",
      average_lap: "",
      fuel_tank: "",
      fuel_burn: "",
      inlap: "",
      outlap: "",
      notes: "",
      setup_file_url: "",
      setup_file_name: "",
    });
    setLibrarySetupFile(null);
    setLibraryCarSearch("");
    setLibraryTrackSearch("");
    setEditingLibraryTestId(null);
    setShowAddLibraryTest(false);
    setMessage(editingLibraryTestId ? "Test updated." : "Test saved.");
    await loadCarsAndTests();
  }

  function editLibraryTest(test: TestLibraryItem) {
    setEditingLibraryTestId(test.id);
    setShowAddLibraryTest(true);
    setLibraryForm({
      team_id: test.team_id || "",
      folder_id: test.folder_id || "",
      car_id: test.car_id || "",
      track_id: test.track_id || "",
      weather: test.weather || "Sunny",
      average_lap: String(test.average_lap || ""),
      fuel_tank: String(
        selectedRaceCars.find((car: any) => car.id === test.car_id)
          ?.fuel_tank ||
          test.fuel_tank ||
          "",
      ),
      fuel_burn: String(test.fuel_burn || ""),
      inlap: String(test.inlap || ""),
      outlap: String(test.outlap || ""),
      notes: test.notes || "",
      setup_file_url: test.setup_file_url || "",
      setup_file_name: test.setup_file_name || "",
    });
    setLibrarySetupFile(null);
    setLibraryCarSearch(test.car_name || carNameFromMaster(test.car_id) || "");
    setLibraryTrackSearch(
      test.track_name || trackNameFromMaster(test.track_id) || "",
    );
  }

  function cancelLibraryTestEdit() {
    setEditingLibraryTestId(null);
    setShowAddLibraryTest(false);
    setLibraryForm({
      team_id: "",
      folder_id: "",
      car_id: "",
      track_id: "",
      weather: "Sunny",
      average_lap: "",
      fuel_tank: "",
      fuel_burn: "",
      inlap: "",
      outlap: "",
      notes: "",
      setup_file_url: "",
      setup_file_name: "",
    });
    setLibrarySetupFile(null);
    setLibraryCarSearch("");
    setLibraryTrackSearch("");
  }

  async function deleteLibraryTest(test: TestLibraryItem) {
    if (!userId || !canEditSharedItem(test)) return;
    await supabase.from("driver_test_library").delete().eq("id", test.id);
    await loadCarsAndTests();
  }

  async function loadLibraryTestIntoRace(test: TestLibraryItem) {
    if (!selectedRace || !userId || !test.car_name) return;

    let car = selectedRaceCars.find((item: any) => item.name === test.car_name);

    if (!car) {
      const { data, error } = await supabase
        .from("cars")
        .insert({
          name: test.car_name,
          team_id: selectedRace.team_id,
          created_by: userId,
          fuel_tank: toNumber(test.fuel_tank, 0) || null,
        })
        .select()
        .single();

      if (error) {
        setMessage(error.message);
        return;
      }
      car = data as Car;
    }

    setSelectedTestingCarId(car.id);
    setTestForm({
      weather: test.weather || "Sunny",
      average_lap: String(test.average_lap || ""),
      fuel_tank: String(car.fuel_tank || test.fuel_tank || ""),
      fuel_burn: String(test.fuel_burn || ""),
      inlap: String(test.inlap || ""),
      outlap: String(test.outlap || ""),
      notes: test.notes || "",
      setup_file_url: (test as any).setup_file_url || "",
      setup_file_name: (test as any).setup_file_name || "",
    });
    setDriverTestForm({
      weather: test.weather || "Sunny",
      average_lap: String(test.average_lap || ""),
      fuel_burn: String(test.fuel_burn || ""),
      notes: test.notes || "",
    });
    setMessage(
      "Loaded saved test into this race. Review it, then click Save Test to add it as a race baseline.",
    );
    await loadCarsAndTests();
  }

  function applySetupToRace(setup: TeamSetupFile) {
    setSelectedRaceSetupId(setup.id);

    const setupNotes = [
      setup.notes ? `Setup notes: ${setup.notes}` : "",
      setup.file_name ? `Setup file: ${setup.file_name}` : "",
    ]
      .filter(Boolean)
      .join(" | ");

    setTestForm((prev: any) => ({
      ...prev,
      notes: setupNotes || prev.notes,
      setup_file_url: setup.file_url || prev.setup_file_url || "",
      setup_file_name: setup.file_name || prev.setup_file_name || "",
    }));

    setMessage(`Setup selected for this race: ${setup.name}`);
  }

  function findTrackBySearchValue(value: string) {
    const normalizedValue = normalizeSearchText(value);

    return (
      iracingTracks.find((track: IRacingTrack) => {
        const normalizedName = normalizeSearchText(track.name);
        if (normalizedName === normalizedValue) return true;

        if (normalizedName.includes("nurburgring")) {
          const aliases = [
            normalizedName,
            normalizedName.replace("nurburgring", "nurburgring"),
            track.name.replace("Nürburgring", "Nurburgring"),
            "nurburgring grand prix strecke",
            "nurburgring nordschleife",
            "nurburgring combined 24h",
            "nurb",
            "nurburg",
          ].map((item) => normalizeSearchText(item));

          return aliases.includes(normalizedValue);
        }

        return false;
      }) || null
    );
  }

  function resetAddRaceTrackSearch() {
    const track = iracingTracks.find(
      (item: IRacingTrack) => item.id === newRaceTrackId,
    );
    setAddRaceTrackSearch(track?.name || "");
  }

  function resetLibraryCarSearch() {
    const car = iracingCars.find(
      (item: IRacingCar) => item.id === libraryForm.car_id,
    );
    setLibraryCarSearch(car?.name || "");
  }

  function resetLibraryTrackSearch() {
    const track = iracingTracks.find(
      (item: IRacingTrack) => item.id === libraryForm.track_id,
    );
    setLibraryTrackSearch(track?.name || "");
  }

  function resetRaceEditTrackSearch() {
    const track = iracingTracks.find(
      (item: IRacingTrack) => item.id === editingRaceTrackId,
    );
    setRaceTrackSearch(track?.name || "");
  }

  function resetRaceAddCarSearch() {
    const car = iracingCars.find(
      (item: IRacingCar) => item.id === selectedMasterCarId,
    );
    setRaceAddCarSearch(car?.name || "");
  }

  function resetRaceDataTrackSearch() {
    const track = iracingTracks.find(
      (item: IRacingTrack) =>
        item.id === raceForm.track_id || item.id === selectedRace?.track_id,
    );
    setRaceTrackSearch(track?.name || "");
  }

  async function createCar() {
    if (!selectedRace || !selectedMasterCarId || !userId) {
      setMessage("Choose a car before adding it to the race.");
      return;
    }

    if (!isPositiveNumberString(newRaceCarFuelTank)) {
      setMessage("Enter the car fuel tank capacity before adding the car.");
      return;
    }

    const masterCar = iracingCars.find(
      (car: any) => car.id === selectedMasterCarId,
    );
    if (!masterCar) {
      setMessage("Choose a valid car before adding it to the race.");
      return;
    }

    const existing = selectedRaceCars.find(
      (car: any) => car.name === masterCar.name,
    );
    if (existing) {
      setSelectedTestingCarId(existing.id);
      setSelectedMasterCarId("");
      setRaceAddCarSearch("");
      setNewRaceCarFuelTank("");
      setMessage("That car is already added. It has been selected.");
      return;
    }

    const { data, error } = await supabase
      .from("cars")
      .insert({
        name: masterCar.name,
        team_id: selectedRace.team_id,
        created_by: userId,
        fuel_tank: toNumber(newRaceCarFuelTank, 0),
      })
      .select()
      .single();

    if (error) {
      setMessage(error.message);
      return;
    }

    setSelectedMasterCarId("");
    setRaceAddCarSearch("");
    setNewRaceCarFuelTank("");
    setSelectedTestingCarId(data.id);
    setMessage("Car added with fuel tank capacity.");
    await loadCarsAndTests();
  }

  async function saveRaceCarFuelTank(car: Car) {
    if (!isPositiveNumberString(editingRaceCarFuelTank)) {
      setMessage("Fuel tank must be a positive number.");
      return;
    }

    const nextFuelTank = toNumber(editingRaceCarFuelTank, 0);

    const { error } = await supabase
      .from("cars")
      .update({ fuel_tank: nextFuelTank })
      .eq("id", car.id);

    if (error) {
      setMessage(error.message);
      return;
    }

    const { error: testError } = await supabase
      .from("car_tests")
      .update({ fuel_tank: nextFuelTank })
      .eq("car_id", car.id);

    if (testError) {
      setMessage(testError.message);
      return;
    }

    setCarTests((prev: any) =>
      prev.map((test: any) =>
        test.car_id === car.id ? { ...test, fuel_tank: nextFuelTank } : test,
      ),
    );
    setCars((prev: any) =>
      prev.map((item: any) =>
        item.id === car.id ? { ...item, fuel_tank: nextFuelTank } : item,
      ),
    );

    setEditingRaceCarId(null);
    setEditingRaceCarFuelTank("");
    setMessage(
      "Car fuel tank updated. Existing baseline tests for this car were updated too.",
    );
    await loadCarsAndTests();
  }

  async function deleteCar(car: Car) {
    await supabase.from("cars").delete().eq("id", car.id);
    if (selectedTestingCarId === car.id) setSelectedTestingCarId("");
    setCompareRaceCarIds((prev) => prev.filter((id) => id !== car.id));
    await loadCarsAndTests();
  }

  async function saveCarTest() {
    if (!selectedRace || !userId) return;

    if (!selectedTestingCarId) {
      setMessage("No car selected. Choose a car before saving the test.");
      return;
    }

    const selectedTestCar = selectedRaceCars.find(
      (car: any) => car.id === selectedTestingCarId,
    );
    const selectedFuelTank = toNumber(selectedTestCar?.fuel_tank, 0);

    if (!selectedFuelTank) {
      setMessage("Set the fuel tank on the car before saving tests for it.");
      return;
    }

    if (!isPositiveNumberString(testForm.average_lap)) {
      setMessage(
        "Average lap must be a positive number of seconds before saving the test.",
      );
      return;
    }

    if (!isPositiveNumberString(testForm.fuel_burn)) {
      setMessage(
        "Fuel burn per lap must be a positive number before saving the test.",
      );
      return;
    }

    const uploadedSetup = teamSetupFile
      ? await uploadSetupFile(teamSetupFile, "race-tests")
      : null;

    const payload = {
      team_id: selectedRace.team_id,
      car_id: selectedTestingCarId,
      created_by: userId,
      weather: testForm.weather,
      average_lap: toNumber(testForm.average_lap, 0),
      fuel_tank: selectedFuelTank,
      fuel_burn: toNumber(testForm.fuel_burn, 0),
      inlap: toNumber(testForm.inlap, 0),
      outlap: toNumber(testForm.outlap, 0),
      notes: testForm.notes,
      setup_file_url: uploadedSetup?.url || testForm.setup_file_url || null,
      setup_file_name: uploadedSetup?.name || testForm.setup_file_name || null,
    };

    if (editingTestId) {
      await supabase.from("car_tests").update(payload).eq("id", editingTestId);
    } else {
      await supabase.from("car_tests").insert(payload);
    }

    setEditingTestId(null);
    setTestForm({
      weather: "Sunny",
      average_lap: "",
      fuel_tank: "",
      fuel_burn: "",
      inlap: "",
      outlap: "",
      notes: "",
      setup_file_url: "",
      setup_file_name: "",
    });
    setTeamSetupFile(null);
    markSaveSavedAfterFormReset("race-baseline-test");
    await loadCarsAndTests();
  }

  function editCarTest(test: CarTest) {
    if (
      !userId ||
      (test.created_by !== userId && !canManageTeamById(test.team_id))
    ) {
      setMessage(
        "You can only edit your own baseline tests unless you are a team owner/admin.",
      );
      return;
    }

    setEditingTestId(test.id);
    setSelectedTestingCarId(test.car_id);
    setTestForm({
      weather: test.weather || "Sunny",
      average_lap: String(test.average_lap || ""),
      fuel_tank: String(test.fuel_tank || ""),
      fuel_burn: String(test.fuel_burn || ""),
      inlap: String(test.inlap || ""),
      outlap: String(test.outlap || ""),
      notes: test.notes || "",
      setup_file_url: test.setup_file_url || "",
      setup_file_name: test.setup_file_name || "",
    });
    setTeamSetupFile(null);
  }

  async function deleteCarTest(test: CarTest) {
    if (
      !userId ||
      (test.created_by !== userId && !canManageTeamById(test.team_id))
    ) {
      setMessage(
        "You can only delete your own baseline tests unless you are a team owner/admin.",
      );
      return;
    }

    await supabase.from("car_tests").delete().eq("id", test.id);
    await loadCarsAndTests();
  }

  async function saveMyDriverTest() {
    if (!selectedRace || !userId) return;

    if (!selectedTestingCarId) {
      setMessage(
        "No car selected. Choose a car before saving a driver pace test.",
      );
      return;
    }

    const payload = {
      race_id: selectedRace.id,
      team_id: selectedRace.team_id,
      car_id: selectedTestingCarId,
      driver_id: userId,
      weather: driverTestForm.weather,
      average_lap: toNumber(driverTestForm.average_lap, 0),
      fuel_burn: toNumber(driverTestForm.fuel_burn, 0),
      notes: driverTestForm.notes,
    };

    const result = editingDriverTestId
      ? await supabase
          .from("driver_car_tests")
          .update(payload)
          .eq("id", editingDriverTestId)
          .eq("driver_id", userId)
      : await supabase.from("driver_car_tests").insert(payload);

    if (result.error) {
      setMessage(result.error.message);
      return;
    }

    setMessage(
      editingDriverTestId
        ? "Your driver pace test was updated."
        : "Your driver pace test was saved.",
    );
    setEditingDriverTestId(null);
    setDriverTestForm({
      weather: "Sunny",
      average_lap: "",
      fuel_burn: "",
      notes: "",
    });
    await loadCarsAndTests();
  }

  function editDriverTest(test: DriverTest) {
    if (!userId || test.driver_id !== userId) return;

    setEditingDriverTestId(test.id);
    setSelectedTestingCarId(test.car_id);
    setDriverTestForm({
      weather: test.weather || "Sunny",
      average_lap: String(test.average_lap || ""),
      fuel_burn: String(test.fuel_burn || ""),
      notes: test.notes || "",
    });
  }

  async function deleteDriverTest(test: DriverTest) {
    if (!userId || test.driver_id !== userId) {
      setMessage("You can only delete your own driver pace tests.");
      return;
    }

    const { error } = await supabase
      .from("driver_car_tests")
      .delete()
      .eq("id", test.id)
      .eq("driver_id", userId);

    if (error) {
      setMessage(error.message);
      return;
    }

    if (editingDriverTestId === test.id) {
      setEditingDriverTestId(null);
      setDriverTestForm({
        weather: "Sunny",
        average_lap: "",
        fuel_burn: "",
        notes: "",
      });
    }

    await loadCarsAndTests();
  }

  async function saveAvailability(stintNumber: number, status: string) {
    if (!selectedRace || !userId) return;

    const existingRows = availability.filter(
      (item: any) =>
        item.race_id === selectedRace.id &&
        item.driver_id === userId &&
        item.stint_number === stintNumber,
    );

    const optimisticRow = {
      id:
        existingRows[0]?.id ||
        `local-availability-${selectedRace.id}-${userId}-${stintNumber}`,
      race_id: selectedRace.id,
      team_id: selectedRace.team_id,
      driver_id: userId,
      stint_number: stintNumber,
      status,
      target_stints:
        existingRows[0]?.target_stints ??
        (preferredStintCount === "" ? null : toNumber(preferredStintCount, 0)),
      ideal_stint_type:
        existingRows[0]?.ideal_stint_type ??
        preferredStintType ??
        "Doesn't matter",
    };

    setAvailability((prev: any) => [
      ...prev.filter(
        (item: any) =>
          !(
            item.race_id === selectedRace.id &&
            item.driver_id === userId &&
            item.stint_number === stintNumber
          ),
      ),
      optimisticRow,
    ]);

    let error = null;

    if (existingRows.length > 0) {
      const updateResult = await supabase
        .from("driver_availability")
        .update({
          status,
          target_stints:
            existingRows[0]?.target_stints ??
            (preferredStintCount === ""
              ? null
              : toNumber(preferredStintCount, 0)),
          ideal_stint_type:
            existingRows[0]?.ideal_stint_type ??
            preferredStintType ??
            "Doesn't matter",
        })
        .eq("race_id", selectedRace.id)
        .eq("driver_id", userId)
        .eq("stint_number", stintNumber);

      error = updateResult.error;
    } else {
      const insertResult = await supabase.from("driver_availability").insert({
        race_id: selectedRace.id,
        team_id: selectedRace.team_id,
        driver_id: userId,
        stint_number: stintNumber,
        status,
        target_stints:
          preferredStintCount === "" ? null : toNumber(preferredStintCount, 0),
        ideal_stint_type: preferredStintType || "Doesn't matter",
      });

      error = insertResult.error;
    }

    if (error) {
      setMessage(error.message);
      await loadCarsAndTests();
      return;
    }

    await loadCarsAndTests();
  }

  function getMyStintPreference() {
    return getDriverStintPreference(userId);
  }

  function getDriverStintPreference(driverId?: string | null) {
    if (!selectedRace || !driverId)
      return { count: "", type: "Doesn't matter" };

    const driverRows = availability.filter(
      (item: any) =>
        item.race_id === selectedRace.id && item.driver_id === driverId,
    );

    const savedWithPreference =
      driverRows.find(
        (item: any) =>
          item.target_stints !== null && item.target_stints !== undefined,
      ) || driverRows.find((item: any) => item.ideal_stint_type);

    return {
      count: savedWithPreference?.target_stints
        ? String(savedWithPreference.target_stints)
        : "",
      type: savedWithPreference?.ideal_stint_type || "Doesn't matter",
    };
  }

  async function saveStintPreferences() {
    if (!selectedRace || !userId) return;

    const target =
      preferredStintCount === ""
        ? null
        : Math.max(0, Math.floor(toNumber(preferredStintCount, 0)));
    const type = preferredStintType || "Doesn't matter";

    const myRows = availability.filter(
      (item: any) =>
        item.race_id === selectedRace.id && item.driver_id === userId,
    );

    const hasRowOne = myRows.some((item: any) => item.stint_number === 1);
    const rowsToSave = hasRowOne
      ? myRows
      : [
          ...myRows,
          {
            race_id: selectedRace.id,
            team_id: selectedRace.team_id,
            driver_id: userId,
            stint_number: 1,
            status: "Available to Drive",
          },
        ];

    const nextAvailability = [
      ...availability.filter(
        (item: any) =>
          !(item.race_id === selectedRace.id && item.driver_id === userId),
      ),
      ...rowsToSave.map((item: any) => ({
        ...item,
        id:
          item.id ||
          `local-availability-${selectedRace.id}-${userId}-${item.stint_number}`,
        target_stints: target,
        ideal_stint_type: type,
      })),
    ];

    setAvailability(nextAvailability);

    for (const row of rowsToSave) {
      const existing = myRows.find(
        (item: any) => item.stint_number === row.stint_number,
      );

      if (existing) {
        const { error } = await supabase
          .from("driver_availability")
          .update({ target_stints: target, ideal_stint_type: type })
          .eq("race_id", selectedRace.id)
          .eq("driver_id", userId)
          .eq("stint_number", row.stint_number);

        if (error) {
          setMessage(error.message);
          await loadCarsAndTests();
          return;
        }
      } else {
        const { error } = await supabase.from("driver_availability").insert({
          race_id: selectedRace.id,
          team_id: selectedRace.team_id,
          driver_id: userId,
          stint_number: row.stint_number,
          status: "Available to Drive",
          target_stints: target,
          ideal_stint_type: type,
        });

        if (error) {
          setMessage(error.message);
          await loadCarsAndTests();
          return;
        }
      }
    }

    setScheduleRefreshKey((value) => value + 1);
    setMessage(
      "Your stint preferences were saved. Press Regenerate Schedule to rebuild driver assignments with the new targets.",
    );
    await loadCarsAndTests();
  }

  async function regenerateSchedule() {
    if (!selectedRace) return;

    // Clean regenerate means clear manual schedule junk:
    // manual drivers, add-time, actual-end, completed flags.
    // Saved weather stays in race_stint_weather.
    setScheduleAdjustments((prev: any) =>
      prev.filter((row: any) => row.race_id !== selectedRace.id),
    );

    const { error } = await supabase
      .from("race_schedule_adjustments")
      .delete()
      .eq("race_id", selectedRace.id);

    if (error) {
      setMessage(error.message);
      await loadCarsAndTests();
      return;
    }

    setScheduleRefreshKey((value) => value + 1);
    setMessage(
      "Schedule regenerated cleanly. Manual drivers, added time, actual end times, and completed flags were cleared. Weather was kept.",
    );
    await loadCarsAndTests();
  }

  async function updateStintWeather(stintNumber: number, weather: string) {
    if (!selectedRace) return;

    const optimisticRow: StintWeather = {
      id: `local-weather-${selectedRace.id}-${stintNumber}`,
      race_id: selectedRace.id,
      team_id: selectedRace.team_id,
      stint_number: stintNumber,
      weather,
    };

    const nextWeather = [
      ...stintWeather.filter(
        (row: any) =>
          !(
            row.race_id === selectedRace.id && row.stint_number === stintNumber
          ),
      ),
      optimisticRow,
    ];

    // Update local state immediately so the schedule rebuilds with the new weather/timing.
    setStintWeather(nextWeather);
    setScheduleRefreshKey((value) => value + 1);

    // Do not use upsert here. Some Supabase projects do not have a unique
    // race_id/stint_number constraint yet, which makes onConflict fail and causes
    // the dropdown to revert back to Sunny after another save/reload.
    const deleteResult = await supabase
      .from("race_stint_weather")
      .delete()
      .eq("race_id", selectedRace.id)
      .eq("stint_number", stintNumber);

    if (deleteResult.error) {
      setMessage(deleteResult.error.message);
      return;
    }

    const insertResult = await supabase.from("race_stint_weather").insert({
      race_id: selectedRace.id,
      team_id: selectedRace.team_id,
      stint_number: stintNumber,
      weather,
    });

    if (insertResult.error) {
      setMessage(insertResult.error.message);
      return;
    }

    setMessage(
      `Stint ${stintNumber} weather changed to ${weather}. Timing updated from the matching baseline test.`,
    );

    // Pull the saved DB row back down so Complete/Add Time/etc. won't reload stale Sunny data.
    await loadCarsAndTests();
  }

  async function updateScheduleDriverLocked(
    stintNumber: number,
    driverId: string | null,
  ) {
    if (!selectedRace) return;

    const rowsToLock = scheduleRows.filter(
      (row) =>
        row.stint >= stintNumber && (row.driverId || row.stint === stintNumber),
    );

    setScheduleAdjustments((prev: any) => {
      const withoutRaceRows = prev.filter(
        (item: any) =>
          !(
            item.race_id === selectedRace.id &&
            rowsToLock.some((row) => row.stint === item.stint_number)
          ),
      );

      const locked = rowsToLock.map((row) => {
        const existing = scheduleAdjustments.find(
          (item) =>
            item.race_id === selectedRace.id && item.stint_number === row.stint,
        );

        return {
          id:
            existing?.id || `local-adjustment-${selectedRace.id}-${row.stint}`,
          race_id: selectedRace.id,
          team_id: selectedRace.team_id,
          stint_number: row.stint,
          driver_id: row.stint === stintNumber ? driverId : row.driverId,
          add_seconds: existing?.add_seconds ?? 0,
          actual_end_time: existing?.actual_end_time ?? null,
          completed: existing?.completed ?? false,
          completed_by: existing?.completed_by ?? null,
        };
      });

      return [...withoutRaceRows, ...locked];
    });

    for (const row of rowsToLock) {
      const existing = scheduleAdjustments.find(
        (item) =>
          item.race_id === selectedRace.id && item.stint_number === row.stint,
      );
      const dbPayload = {
        race_id: selectedRace.id,
        team_id: selectedRace.team_id,
        stint_number: row.stint,
        driver_id: row.stint === stintNumber ? driverId : row.driverId,
        add_seconds: existing?.add_seconds ?? 0,
        actual_end_time: existing?.actual_end_time ?? null,
        completed: existing?.completed ?? false,
        completed_by: existing?.completed_by ?? null,
      };

      const { error } = await supabase
        .from("race_schedule_adjustments")
        .upsert(dbPayload, { onConflict: "race_id,stint_number" });

      if (error) {
        setMessage(error.message);
        await loadCarsAndTests();
        return;
      }
    }

    setMessage(
      `Stint ${stintNumber} driver changed. Stint ${stintNumber} and later rows were locked so lower stints do not reshuffle.`,
    );
    await loadCarsAndTests();
  }

  async function updateScheduleAdjustment(
    stintNumber: number,
    fields: Partial<ScheduleAdjustment>,
  ) {
    if (!selectedRace) return;

    const existing = scheduleAdjustments.find(
      (row) =>
        row.race_id === selectedRace.id && row.stint_number === stintNumber,
    );

    const payload: ScheduleAdjustment = {
      id: existing?.id || `local-adjustment-${selectedRace.id}-${stintNumber}`,
      race_id: selectedRace.id,
      team_id: selectedRace.team_id,
      stint_number: stintNumber,
      driver_id:
        fields.driver_id !== undefined
          ? fields.driver_id
          : (existing?.driver_id ?? null),
      add_seconds:
        fields.add_seconds !== undefined
          ? fields.add_seconds
          : (existing?.add_seconds ?? 0),
      actual_end_time:
        fields.actual_end_time !== undefined
          ? fields.actual_end_time
          : (existing?.actual_end_time ?? null),
      completed:
        fields.completed !== undefined
          ? fields.completed
          : (existing?.completed ?? false),
      completed_by:
        fields.completed_by !== undefined
          ? fields.completed_by
          : (existing?.completed_by ?? null),
    };

    setScheduleAdjustments((prev: any) => [
      ...prev.filter(
        (row: any) =>
          !(
            row.race_id === selectedRace.id && row.stint_number === stintNumber
          ),
      ),
      payload,
    ]);

    const { id: _localId, ...dbPayload } = payload;

    const { error } = await supabase
      .from("race_schedule_adjustments")
      .upsert(dbPayload, { onConflict: "race_id,stint_number" });

    if (error) {
      setMessage(error.message);
      return;
    }

    await loadCarsAndTests();
  }

  async function markCompleted(row: ScheduleRow) {
    if (!selectedRace || !userId) return;

    const currentAdjustment = scheduleAdjustments.find(
      (adjustment) =>
        adjustment.race_id === selectedRace.id &&
        adjustment.stint_number === row.stint,
    );

    const isCompleted = Boolean(row.completed || currentAdjustment?.completed);

    await updateScheduleAdjustment(row.stint, {
      completed: !isCompleted,
      completed_by: isCompleted ? null : userId,
      actual_end_time: isCompleted
        ? null
        : row.actualEndTime ||
          timeInputInZone(
            row.end,
            raceForm.main_time_zone ||
              selectedRace.main_time_zone ||
              "America/New_York",
          ),
    });
  }

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  const scheduleRows = selectedRace
    ? buildSchedule(undefined, undefined, scheduleRefreshKey)
    : [];

  const workspaceTimer = selectedRace ? getRaceTimer(selectedRace) : "";

  function resultCards() {
    const cards = [
      ["ESTIMATED RACE LAPS", results.raceLaps],
      ["STINT LENGTH", results.stintLength, results.stintMinutes],
      ["EXACT STINTS", results.exactStints],
      ["STINTS NEEDED", results.stintsNeeded],
      ["PIT STOPS", results.pitStops],
      ["PIT TIME", results.pitTime],
      ["TOTAL PIT TIME", results.totalPitTime],
      ["SCHEDULE ROWS", results.scheduleRows],
    ];

    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {cards.map(([title, value, sub]) => (
          <div
            key={title}
            className="rounded-lg border border-zinc-700 border-l-4 border-l-amber-500/70 bg-zinc-950 shadow-md shadow-black/30 p-5"
          >
            <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">
              {title}
            </p>
            <p className="mt-3 min-h-[32px] text-3xl font-bold">
              {value || ""}
            </p>
            {sub ? <p className="text-sm text-zinc-500">{sub}</p> : null}
          </div>
        ))}
      </div>
    );
  }

  const pageIconMap: Record<string, string> = {
    Home: "🏁",
    Teams: "👥",
    Testing: "🧪",
    Setups: "🔧",
    Calendar: "📅",
    Analytics: "📊",
    Templates: "📋",
    Exports: "⬇️",
    Requests: "➕",
    Settings: "⚙️",
    Help: "❔",
    Donate: "💙",
  };

  const pageDescriptionMap: Record<string, string> = {
    Home: "Build races, organize data, and jump back into upcoming events.",
    Teams:
      "Manage team workspaces, drivers, invites, and shared race resources.",
    Testing:
      "Save car, track, weather, fuel, lap, and setup data for future races.",
    Setups: "Store and organize shared setup files for your team.",
    Calendar: "See upcoming races and multi-day events in one place.",
    Templates:
      "Create reusable race presets for special events, leagues, and endurance formats.",
    Exports: "Download or print clean schedule outputs for your team.",
    Requests: "Request missing cars or tracks and manage submitted additions.",
    Settings: "Adjust defaults, refresh data, and manage local app settings.",
    Help: "Quick guidance for using the planner and contacting support.",
    Analytics: "Review race summaries and driver workload data.",
    Donate: "Support the project.",
  };

  function pageHero(title: string, label?: string, description?: string) {
    return (
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-zinc-900/92 via-zinc-950 to-black p-7 shadow-2xl shadow-black/35">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(37,99,235,0.26),transparent_32%),radial-gradient(circle_at_88%_0%,rgba(14,165,233,0.12),transparent_25%)]" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className={sectionHeaderLabel}>{label || title}</p>
            <div className="mt-4 flex items-center gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-2xl shadow-lg shadow-black/20">
                {pageIconMap[title] || "🏁"}
              </span>
              <h2 className="text-4xl font-black tracking-tight md:text-5xl">
                {title}
              </h2>
            </div>
            <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-300">
              {description || pageDescriptionMap[title] || ""}
            </p>
          </div>
        </div>
      </section>
    );
  }

  function appShell(content: React.ReactNode) {
    const builtPages = [
      "Home",
      "Teams",
      "Testing",
      "Setups",
      "Calendar",
      "Templates",
      "Exports",
      "Requests",
      "Settings",
      "Help",
    ];
    const mutedPages = ["Analytics", "Donate"];

    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_12%_8%,rgba(245,166,35,0.10),transparent_30%),radial-gradient(circle_at_92%_88%,rgba(245,166,35,0.06),transparent_28%),linear-gradient(180deg,#0b0c0e_0%,#141519_55%,#08090a_100%)] text-white">
        <aside className="fixed left-0 top-0 z-20 flex h-screen w-60 flex-col border-r-2 border-amber-500/70 bg-[#0e0f12] shadow-2xl shadow-black/60">
          <div className="border-b border-white/10 px-4 py-5">
            <div className="flex items-center gap-3">
              <img
                src="/stintsync-mark.png"
                alt="StintSync mark"
                className="h-11 w-11 shrink-0 object-contain"
              />
              <div className="min-w-0">
                <h1 className="truncate text-lg font-black leading-tight tracking-tight">
                  StintSync
                </h1>
                <p className="mt-0.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400" />
                  Racecraft Digital
                </p>
              </div>
            </div>
          </div>

          <nav className="min-h-0 flex-1 space-y-0.5 overflow-y-auto px-2 py-3">
            {sidebarItems.map((item: any) => {
              const isActive = activePage === item && !selectedRaceId;
              const isMuted = mutedPages.includes(item);

              return (
                <button
                  key={item}
                  onClick={() => {
                    if (
                      (item === "Exports" || item === "Templates") &&
                      selectedRaceId
                    )
                      setExportRaceId(selectedRaceId);
                    setActivePage(item);
                    setSelectedRaceId(null);
                    if (item !== "Teams") setSelectedTeamViewId(null);
                  }}
                  className={`group flex w-full items-center justify-between border-l-[3px] px-3 py-2.5 text-left text-sm font-bold transition ${
                    isActive
                      ? "border-l-amber-400 bg-amber-500/10 text-amber-300"
                      : isMuted
                        ? "border-l-transparent text-zinc-500 hover:border-l-zinc-700 hover:bg-white/5 hover:text-zinc-300"
                        : "border-l-transparent text-zinc-300 hover:border-l-zinc-700 hover:bg-white/5"
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="w-5 shrink-0 text-center text-base">
                      {pageIconMap[item] || "•"}
                    </span>
                    <span className="truncate">{item}</span>
                  </span>
                  {isMuted ? (
                    <span className="ml-2 rounded-full border border-zinc-700 px-1.5 py-0.5 text-[9px] uppercase tracking-wide text-zinc-600">
                      Soon
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>

          <div className="border-t border-white/10 bg-black/40 p-3">
            {userId ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {userProfile?.avatar_url ? (
                    <img
                      src={userProfile.avatar_url}
                      alt="Profile"
                      className="h-10 w-10 rounded-full border-2 border-amber-500/60"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 font-black text-zinc-950">
                      {(
                        userProfile?.display_name ||
                        userProfile?.username ||
                        "U"
                      )
                        .slice(0, 1)
                        .toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold">
                      {userProfile?.display_name ||
                        userProfile?.username ||
                        "Signed in"}
                    </p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      <p className="text-xs text-zinc-500">Online</p>
                    </div>
                    <p className="mt-1 truncate font-mono text-[10px] text-amber-400">
                      {liveSyncStatus}
                    </p>
                  </div>
                </div>
                <button
                  onClick={signOut}
                  className="w-full rounded-md border border-red-900/60 bg-red-950/40 px-3 py-2 text-sm font-bold text-red-200 transition hover:bg-red-900/60 hover:text-white"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm font-bold">Not signed in</p>
                <p className="text-xs text-zinc-500">
                  Login to sync teams, tests, and schedules.
                </p>
                <a
                  href="/login"
                  className="block w-full rounded-md bg-gradient-to-r from-amber-500 to-amber-400 px-3 py-2 text-center text-sm font-black uppercase tracking-wide text-zinc-950 transition hover:from-amber-400 hover:to-amber-300"
                >
                  Login
                </a>
              </div>
            )}
          </div>
        </aside>

        <section className="ml-60 min-h-screen overflow-x-hidden p-8">
          {content}
        </section>

        {finishedPopup && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-6">
            <div className="max-w-md rounded-lg border border-green-700 bg-zinc-900 p-8 text-center shadow-2xl shadow-black/25">
              <h2 className="text-3xl font-black text-green-400">
                Race Finished
              </h2>
              <p className="mt-3 text-zinc-300">The race timer ended.</p>
              <button
                onClick={() => setFinishedPopup(false)}
                className="mt-6 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 px-5 py-3 font-bold hover:from-green-500 hover:to-emerald-400"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {noteModalText !== null && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4">
            <div className="w-full max-w-lg rounded-lg border border-zinc-700 border-t-4 border-t-amber-500 bg-zinc-900 p-6 shadow-2xl shadow-black/25">
              <h2 className="mb-3 text-xl font-bold">Notes</h2>
              <div className="rounded-2xl bg-zinc-950 p-4 text-sm text-zinc-300">
                <p className="mb-1 font-semibold text-white">Notes:</p>
                <p className="whitespace-pre-wrap">
                  {noteModalText || "No notes."}
                </p>
              </div>
              <button
                onClick={() => setNoteModalText(null)}
                className="mt-5 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-600 px-4 py-2 font-bold hover:from-amber-500 hover:to-amber-500"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {deleteConfirm && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4">
            <div className="w-full max-w-md rounded-lg border border-zinc-600 bg-zinc-900 p-6 shadow-2xl shadow-black/25">
              <h2 className="mb-2 text-xl font-bold">
                Are you sure you want to delete?
              </h2>
              <p className="text-sm text-zinc-400">{deleteConfirm.title}</p>
              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="rounded-2xl bg-zinc-700 px-4 py-2 font-bold hover:bg-zinc-600"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const action = deleteConfirm.onConfirm;
                    setDeleteConfirm(null);
                    action();
                  }}
                  className="rounded-2xl bg-gradient-to-r from-red-600 to-red-500 px-4 py-2 font-bold hover:from-red-500 hover:to-rose-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    );
  }

  const panelClass =
    "rounded-lg border border-white/10 bg-zinc-900/72 shadow-2xl shadow-black/25";
  const softPanelClass =
    "rounded-lg border border-white/10 bg-black/30 shadow-2xl shadow-black/25";
  const sectionHeaderLabel =
    "text-xs font-black uppercase tracking-[0.32em] text-amber-300";
  const primaryButtonClass =
    "rounded-2xl bg-gradient-to-r from-amber-600 to-amber-600 px-5 py-3 font-black text-white shadow-lg shadow-amber-950/40 ring-1 ring-white/10 transition hover:-translate-y-0.5 hover:from-amber-500 hover:to-amber-500";

  function homePage() {
    return appShell(
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-zinc-900/95 via-zinc-950 to-black p-8 shadow-2xl shadow-black/40">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(37,99,235,0.32),transparent_30%),radial-gradient(circle_at_85%_5%,rgba(14,165,233,0.14),transparent_28%)]" />
          <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <img
                src="/stintsync-logo.png"
                alt="StintSync by Racecraft Digital"
                className="mb-6 h-auto w-full max-w-[520px] object-contain drop-shadow-[0_0_22px_rgba(37,99,235,0.22)]"
              />
              <p className={sectionHeaderLabel}>StintSync Race Control</p>
              <h2 className="mt-4 max-w-4xl text-5xl font-black leading-[0.96] tracking-tight md:text-6xl">
                Build the stint plan before the green flag.
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-300">
                A complete team workspace for race setup, testing data,
                availability, stint scheduling, exports, and endurance prep.
              </p>
            </div>

            <button
              onClick={() => setShowAddRace(true)}
              className={primaryButtonClass}
            >
              + Add Race
            </button>
          </div>
        </div>

        <section className="grid gap-4 lg:grid-cols-3">
          {[
            [
              "1",
              "Create or list events",
              "Add races now, even if you do not know the final team yet.",
              "0% center",
            ],
            [
              "2",
              "Add testing data",
              "Use the Testing page for general tests, or add race-specific car/weather tests later.",
              "50% center",
            ],
            [
              "3",
              "Build the schedule",
              "Choose team, car, weather, availability, and let the app calculate stints.",
              "100% center",
            ],
          ].map(([step, title, body, position]) => (
            <div
              key={step}
              className="relative min-h-[185px] overflow-hidden rounded-lg border border-white/10 bg-zinc-900/70 shadow-lg"
              style={{
                backgroundImage: "url('/stintsync-mark.png')",
                backgroundSize: "230px 230px",
                backgroundPosition: "right -70px center",
                backgroundRepeat: "no-repeat",
              }}
            >
              <div className="absolute inset-0 bg-black/58" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />
              <div className="relative p-5">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-600 text-lg font-black">
                  {step}
                </div>
                <h3 className="text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-300">{body}</p>
              </div>
            </div>
          ))}
        </section>

        {message && (
          <div className="rounded-2xl border border-zinc-600 bg-zinc-900/90 p-4 text-sm text-zinc-200 shadow-lg">
            {message}
          </div>
        )}

        {showAddRace && (
          <section className="rounded-lg border border-white/10 border-l-4 border-l-amber-500 bg-zinc-900 p-6 shadow-lg shadow-black/40">
            <div className="mb-5 flex flex-col gap-1">
              <h3 className="text-2xl font-bold">Add Race</h3>
              <p className="text-sm text-zinc-400">
                Team is optional for now. You can create special events first
                and assign the team later in Race Data.
              </p>
            </div>

            <div className="grid gap-4 xl:grid-cols-4">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-zinc-300">
                  Race Name
                </span>
                <input
                  value={newRaceName}
                  onChange={(event) => setNewRaceName(event.target.value)}
                  placeholder="Spa 24"
                  className="w-full rounded-md border border-white/10 bg-black/40 px-4 py-3 font-mono outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-zinc-300">
                  Race Date
                </span>
                <input
                  type="date"
                  value={newRaceDate}
                  onChange={(event) => setNewRaceDate(event.target.value)}
                  className="w-full rounded-md border border-white/10 bg-black/40 px-4 py-3 font-mono outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-zinc-300">
                  Track <span className="text-red-400">*</span>
                </span>
                <input
                  value={addRaceTrackSearch}
                  list="add-race-track-options"
                  onChange={(event) => {
                    const value = event.target.value;
                    setAddRaceTrackSearch(value);
                    const match = findTrackBySearchValue(value);
                    setNewRaceTrackId(match?.id || "");
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Escape") {
                      event.preventDefault();
                      resetAddRaceTrackSearch();
                    }
                  }}
                  placeholder="Search and select a track"
                  className="w-full rounded-md border border-white/10 bg-black/40 px-4 py-3 font-mono outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                />
                <datalist id="add-race-track-options">
                  {filteredAddRaceTracks.map((track: IRacingTrack) => (
                    <option key={track.id} value={track.name} />
                  ))}
                  {filteredAddRaceTracks
                    .filter((track: IRacingTrack) =>
                      normalizeSearchText(track.name).includes("nurburgring"),
                    )
                    .map((track: IRacingTrack) => (
                      <option
                        key={`${track.id}-ascii`}
                        value={track.name.replace("Nürburgring", "Nurburgring")}
                      />
                    ))}
                </datalist>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-zinc-300">
                  Team <span className="text-zinc-500">(optional)</span>
                </span>
                <select
                  value={newRaceTeamId}
                  onChange={(event) => setNewRaceTeamId(event.target.value)}
                  className="w-full rounded-md border border-white/10 bg-black/40 px-4 py-3 font-mono outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                >
                  <option value="">Assign later</option>
                  {teams
                    .filter((team: any) => canCreateRaceForTeam(team.id))
                    .map((team: any) => (
                      <option
                        key={team.id}
                        value={team.id}
                        className="bg-zinc-950 text-white"
                      >
                        {team.name}
                      </option>
                    ))}
                </select>
              </label>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={createRace}
                className="rounded-md bg-gradient-to-r from-amber-500 to-amber-400 px-6 py-3 font-black uppercase tracking-wide text-zinc-950 shadow-lg shadow-amber-950/40 transition hover:from-amber-400 hover:to-amber-300"
              >
                Create Race
              </button>
              <button
                onClick={() => setShowAddRace(false)}
                className="rounded-2xl bg-zinc-700 px-6 py-3 font-bold transition hover:bg-zinc-600"
              >
                Cancel
              </button>
            </div>
          </section>
        )}

        <section className="rounded-lg border border-white/10 border-l-4 border-l-amber-500 bg-zinc-900 p-6 shadow-lg shadow-black/40">
          <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-2xl font-bold">Races</h3>
              <p className="text-sm text-zinc-400">
                Open an event to manage data, testing, availability, and
                schedule.
              </p>
            </div>
            <span className="rounded-full bg-white/[0.08] px-3 py-1 text-xs font-semibold text-zinc-300">
              {races.length} active
            </span>
          </div>

          {races.length === 0 ? (
            <div className="rounded-lg border border-dashed border-zinc-700 bg-zinc-950/60 p-10 text-center">
              <p className="text-lg font-semibold">No races yet.</p>
              <p className="mt-2 text-sm text-zinc-500">
                Click Add Race to create your first event.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 xl:grid-cols-2">
              {[...races]
                .sort((a: any, b: any) =>
                  String(a.race_date || "").localeCompare(
                    String(b.race_date || ""),
                  ),
                )
                .map((race: any) => {
                  const team = race.team_id
                    ? getTeamById(teams, race.team_id)
                    : null;
                  const trackName =
                    race.track_name ||
                    iracingTracks.find(
                      (track: IRacingTrack) => track.id === race.track_id,
                    )?.name ||
                    "No track selected";

                  const trackImage = getRaceTrackImage(race);

                  return (
                    <div
                      key={race.id}
                      className="group overflow-hidden rounded-lg border border-zinc-700 border-l-4 border-l-amber-500 bg-zinc-950 shadow-lg shadow-black/40 shadow-lg transition hover:-translate-y-0.5 hover:border-amber-900 hover:bg-black"
                    >
                      {editingRaceId === race.id ? (
                        <div className="p-5">
                          <div className="mb-4 rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
                            <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-300">
                              Edit Race
                            </p>
                            <p className="mt-1 text-sm text-zinc-400">
                              Track is required. Team can be assigned later in
                              Race Data.
                            </p>
                          </div>

                          <div className="grid gap-3">
                            <label className="space-y-2">
                              <span className="text-sm font-semibold text-zinc-300">
                                Race Name
                              </span>
                              <input
                                value={editingRaceName}
                                onChange={(event) =>
                                  setEditingRaceName(event.target.value)
                                }
                                className="w-full rounded-md border border-white/10 bg-black/40 px-4 py-3 font-mono outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                              />
                            </label>

                            <label className="space-y-2">
                              <span className="text-sm font-semibold text-zinc-300">
                                Race Date
                              </span>
                              <input
                                type="date"
                                value={editingRaceDate}
                                onChange={(event) =>
                                  setEditingRaceDate(event.target.value)
                                }
                                className="w-full rounded-md border border-white/10 bg-black/40 px-4 py-3 font-mono outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                              />
                            </label>

                            <label className="space-y-2">
                              <span className="text-sm font-semibold text-zinc-300">
                                Track
                              </span>
                              <select
                                value={editingRaceTrackId}
                                onChange={(event) =>
                                  setEditingRaceTrackId(event.target.value)
                                }
                                className="w-full rounded-md border border-white/10 bg-black/40 px-4 py-3 font-mono outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                              >
                                <option value="">Choose Track</option>
                                {iracingTracks.map((track: IRacingTrack) => (
                                  <option
                                    key={track.id}
                                    value={track.id}
                                    className="bg-zinc-950 text-white"
                                  >
                                    {track.name}
                                  </option>
                                ))}
                              </select>
                            </label>

                            <div className="flex gap-2 pt-2">
                              <button
                                onClick={() => saveRaceEdit(race)}
                                className="rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 px-4 py-3 font-bold hover:from-green-500 hover:to-emerald-400"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingRaceId(null)}
                                className="rounded-2xl bg-zinc-700 px-4 py-3 font-bold hover:bg-zinc-600"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex h-full flex-col justify-between gap-5 p-5">
                          <button
                            onClick={() => {
                              setSelectedRaceId(race.id);
                              setActiveRaceTab("Data");
                            }}
                            className="text-left"
                          >
                            <div className="relative mb-5 h-40 overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-br from-amber-950/80 to-zinc-900">
                              {trackImage && (
                                <img
                                  src={trackImage}
                                  alt=""
                                  onError={(event) => {
                                    event.currentTarget.style.display = "none";
                                  }}
                                  className="absolute inset-0 h-full w-full object-cover opacity-70"
                                />
                              )}
                              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/10" />
                              <div className="relative flex h-full items-end p-4">
                                <div>
                                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-300">
                                    Track
                                  </p>
                                  <p className="mt-1 text-xl font-black text-white drop-shadow">
                                    {trackName}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                              <div>
                                <h4 className="text-2xl font-black tracking-tight transition group-hover:text-amber-300">
                                  {race.name}
                                </h4>
                                <p className="mt-1 text-sm text-zinc-400">
                                  {race.race_date || "No date"}
                                </p>
                              </div>
                              <span className="rounded-full border border-amber-900 bg-amber-950/50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-300">
                                {team?.name || "No Team Yet"}
                              </span>
                            </div>

                            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                              <div className="rounded-2xl bg-zinc-900 p-4">
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                                  Date
                                </p>
                                <p className="mt-2 font-semibold text-zinc-100">
                                  {race.race_date || "No date"}
                                </p>
                              </div>
                              <div className="rounded-2xl bg-zinc-900 p-4">
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                                  Timer
                                </p>
                                <p className="mt-2 font-semibold text-amber-300">
                                  {getRaceTimer(race)}
                                </p>
                              </div>
                            </div>
                          </button>

                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => {
                                setSelectedRaceId(race.id);
                                setActiveRaceTab("Data");
                              }}
                              className="rounded-2xl bg-gradient-to-r from-amber-600 to-amber-600 px-4 py-2 font-bold transition hover:from-amber-500 hover:to-amber-500"
                            >
                              Open
                            </button>
                            {canEditRace(race) ? (
                              <>
                                <button
                                  onClick={() => {
                                    setEditingRaceId(race.id);
                                    setEditingRaceName(race.name);
                                    setEditingRaceDate(race.race_date || "");
                                    setEditingRaceTrackId(race.track_id || "");
                                  }}
                                  className="rounded-2xl bg-yellow-600 px-4 py-2 font-bold text-black transition hover:bg-yellow-500"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() =>
                                    setDeleteConfirm({
                                      title: `Delete ${race.name}?`,
                                      onConfirm: () => deleteRace(race),
                                    })
                                  }
                                  className="rounded-2xl bg-gradient-to-r from-red-600 to-red-500 px-4 py-2 font-bold transition hover:from-red-500 hover:to-rose-500"
                                >
                                  Delete
                                </button>
                              </>
                            ) : (
                              <span className="rounded-2xl bg-white/[0.06] px-4 py-2 text-sm font-bold text-zinc-400">
                                View only
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          )}
        </section>
      </div>,
    );
  }

  async function removeTeamMember(team: CloudTeam, member: TeamMember) {
    if (!userId || team.owner_id !== userId) return;

    if (member.user_id === team.owner_id) {
      setMessage("You cannot remove the team owner from their own team.");
      return;
    }

    const previousMembers = teamMembersByTeam[team.id] || [];

    setTeamMembersByTeam((prev: any) => ({
      ...prev,
      [team.id]: (prev[team.id] || []).filter(
        (item: any) => item.user_id !== member.user_id,
      ),
    }));

    const { error } = await supabase
      .from("team_members")
      .delete()
      .eq("team_id", team.id)
      .eq("user_id", member.user_id);

    if (error) {
      setTeamMembersByTeam((prev: any) => ({
        ...prev,
        [team.id]: previousMembers,
      }));
      setMessage(error.message);
      return;
    }

    setMessage(
      `${profileName(member.profiles)} was removed from ${team.name}.`,
    );

    // Give Supabase a moment to finish the delete before pulling fresh data back in.
    window.setTimeout(() => {
      refreshAll();
    }, 600);
  }

  function teamsPage() {
    const selectedTeam = selectedTeamViewId
      ? teams.find((team: any) => team.id === selectedTeamViewId) || null
      : null;
    const selectedMembers = selectedTeam
      ? teamMembersByTeam[selectedTeam.id] || []
      : [];
    const selectedTeamRaces = selectedTeam
      ? races.filter((race: any) => race.team_id === selectedTeam.id)
      : [];
    const selectedTeamCars = selectedTeam
      ? cars.filter((car: any) => car.team_id === selectedTeam.id)
      : [];
    const selectedTeamSetups = selectedTeam
      ? setupFiles.filter((setup: any) => setup.team_id === selectedTeam.id)
      : [];
    const selectedTeamTests = selectedTeam
      ? testLibrary.filter((test: any) => test.team_id === selectedTeam.id)
      : [];
    const selectedIsAdmin = selectedTeam
      ? canManageTeamById(selectedTeam.id)
      : false;

    if (selectedTeam) {
      return appShell(
        <div className="mx-auto max-w-7xl space-y-6">
          <section className="overflow-hidden rounded-lg border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black p-6 shadow-2xl">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <button
                  onClick={() => setSelectedTeamViewId(null)}
                  className="mb-4 rounded-2xl bg-white/[0.08] px-4 py-2 text-sm font-bold text-zinc-200 transition hover:bg-zinc-700"
                >
                  ← Back to Teams
                </button>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-amber-400">
                  Team Workspace
                </p>
                <h2 className="text-4xl font-black tracking-tight">
                  {selectedTeam.name}
                </h2>
                <p className="mt-2 max-w-3xl text-zinc-400">
                  Manage drivers, team data, cars, races, tests, and setups from
                  one place.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {selectedIsAdmin ? (
                  <>
                    <button
                      onClick={() => {
                        setEditingTeamId(selectedTeam.id);
                        setEditingTeamName(selectedTeam.name);
                      }}
                      className="rounded-2xl bg-yellow-600 px-5 py-3 font-bold text-black transition hover:bg-yellow-500"
                    >
                      Edit Team
                    </button>
                    <button
                      onClick={() =>
                        setDeleteConfirm({
                          title: `Delete ${selectedTeam.name}?`,
                          onConfirm: () => deleteTeam(selectedTeam),
                        })
                      }
                      className="rounded-2xl bg-gradient-to-r from-red-600 to-red-500 px-5 py-3 font-bold transition hover:from-red-500 hover:to-rose-500"
                    >
                      Delete Team
                    </button>
                  </>
                ) : null}
              </div>
            </div>
          </section>

          {message && (
            <div className="rounded-2xl border border-zinc-600 bg-zinc-900/90 p-4 text-sm text-zinc-200 shadow-lg">
              {message}
            </div>
          )}

          {editingTeamId === selectedTeam.id ? (
            <section className="rounded-lg border border-yellow-800/60 bg-yellow-950/20 p-6 shadow-2xl shadow-black/25">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-yellow-300">
                Edit Team
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  value={editingTeamName}
                  onChange={(event) => setEditingTeamName(event.target.value)}
                  className="min-w-0 flex-1 rounded-2xl border border-zinc-600 bg-zinc-900 px-4 py-3 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20"
                />
                <button
                  onClick={saveTeamEdit}
                  className="rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 px-5 py-3 font-bold hover:from-green-500 hover:to-emerald-400"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingTeamId(null)}
                  className="rounded-2xl bg-zinc-700 px-5 py-3 font-bold hover:bg-zinc-600"
                >
                  Cancel
                </button>
              </div>
            </section>
          ) : null}

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {[
              ["Drivers", selectedMembers.length],
              ["Cars", selectedTeamCars.length],
              ["Races", selectedTeamRaces.length],
              ["Tests", selectedTeamTests.length],
              ["Setups", selectedTeamSetups.length],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-lg border border-white/10 bg-zinc-900/70 p-5 shadow-2xl shadow-black/25"
              >
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">
                  {label}
                </p>
                <p className="mt-3 text-4xl font-black">{value}</p>
              </div>
            ))}
          </section>

          <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <section className="rounded-lg border border-white/10 border-l-4 border-l-amber-500 bg-zinc-900 p-6 shadow-lg shadow-black/40">
              <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="text-2xl font-bold">Drivers</h3>
                  <p className="text-sm text-zinc-400">
                    Everyone currently connected to this team. Team owners can
                    remove drivers from here.
                  </p>
                </div>
                <a
                  href={`/teams/${selectedTeam.id}?return=planner`}
                  className="rounded-2xl bg-gradient-to-r from-amber-600 to-amber-600 px-4 py-2 font-bold transition hover:from-amber-500 hover:to-amber-500"
                >
                  Manage Invites
                </a>
              </div>

              {selectedMembers.length === 0 ? (
                <div className="rounded-lg border border-dashed border-zinc-700 bg-zinc-950/60 p-10 text-center">
                  <p className="text-lg font-semibold">
                    No drivers loaded yet.
                  </p>
                  <p className="mt-2 text-sm text-zinc-500">
                    Use Manage Invites to add drivers.
                  </p>
                </div>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {selectedMembers.map((member: any) => {
                    const isOwnerMember =
                      member.user_id === selectedTeam.owner_id ||
                      member.role === "owner";
                    const canRemoveMember = selectedIsAdmin && !isOwnerMember;

                    return (
                      <div
                        key={member.user_id}
                        className="rounded-lg border border-zinc-700 border-l-4 border-l-amber-500/70 bg-zinc-950 p-4 shadow-md shadow-black/30"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-lg font-black">
                              {profileName(member.profiles)}
                            </p>
                            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-zinc-500">
                              {roleLabel(member.role)}
                            </p>
                          </div>
                          <div className="flex shrink-0 flex-col items-end gap-2">
                            <span
                              className={`rounded-full border px-3 py-1 text-xs font-bold uppercase ${
                                isOwnerMember
                                  ? "border-amber-900 bg-amber-950/60 text-amber-200"
                                  : "border-zinc-600 bg-zinc-900 text-zinc-300"
                              }`}
                            >
                              {isOwnerMember ? "Owner" : "Driver"}
                            </span>
                            {canRemoveMember ? (
                              <button
                                onClick={() =>
                                  setDeleteConfirm({
                                    title: `Remove ${profileName(member.profiles)} from ${selectedTeam.name}?`,
                                    onConfirm: () =>
                                      removeTeamMember(selectedTeam, member),
                                  })
                                }
                                className="rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-3 py-1.5 text-xs font-black text-white transition hover:from-red-500 hover:to-rose-500"
                              >
                                Remove
                              </button>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            <section className="rounded-lg border border-white/10 border-l-4 border-l-amber-500 bg-zinc-900 p-6 shadow-lg shadow-black/40">
              <h3 className="text-2xl font-bold">Quick Actions</h3>
              <p className="mt-1 text-sm text-zinc-400">
                Jump to team-related areas.
              </p>

              <div className="mt-5 grid gap-3">
                {selectedIsAdmin ? (
                  <button
                    onClick={() => {
                      setSelectedTeamViewId(null);
                      setActivePage("Home");
                      setShowAddRace(true);
                      setNewRaceTeamId(selectedTeam.id);
                    }}
                    className="rounded-2xl bg-gradient-to-r from-amber-600 to-amber-600 px-5 py-3 text-left font-bold transition hover:from-amber-500 hover:to-amber-500"
                  >
                    + Create Race for Team
                  </button>
                ) : (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-zinc-500">
                    Only team admins can create team races.
                  </div>
                )}
                <button
                  onClick={() => {
                    setActivePage("Setups");
                    setSetupForm((prev: any) => ({
                      ...prev,
                      team_id: selectedTeam.id,
                    }));
                  }}
                  className="rounded-2xl bg-zinc-800 px-5 py-3 text-left font-bold transition hover:bg-zinc-700"
                >
                  Open Team Setups
                </button>
                <button
                  onClick={() => setActivePage("Testing")}
                  className="rounded-2xl bg-zinc-800 px-5 py-3 text-left font-bold transition hover:bg-zinc-700"
                >
                  Open Testing Library
                </button>
                <a
                  href={`/teams/${selectedTeam.id}?return=planner`}
                  className="rounded-2xl bg-zinc-800 px-5 py-3 text-left font-bold transition hover:bg-zinc-700"
                >
                  Invite Drivers
                </a>
              </div>
            </section>
          </div>

          <section className="grid gap-6 xl:grid-cols-3">
            <div className="rounded-lg border border-white/10 border-l-4 border-l-amber-500 bg-zinc-900 p-6 shadow-lg shadow-black/40">
              <h3 className="text-2xl font-bold">Team Races</h3>
              <p className="mt-1 text-sm text-zinc-400">
                Recent races using this team.
              </p>
              <div className="mt-5 space-y-3">
                {selectedTeamRaces.slice(0, 5).map((race: any) => (
                  <button
                    key={race.id}
                    onClick={() => {
                      setSelectedRaceId(race.id);
                      setActiveRaceTab("Data");
                    }}
                    className="block w-full rounded-lg border border-zinc-700 border-l-4 border-l-amber-500/70 bg-zinc-950 p-4 shadow-md shadow-black/30 text-left transition hover:border-amber-900"
                  >
                    <p className="font-black">{race.name}</p>
                    <p className="mt-1 text-sm text-zinc-500">
                      {race.race_date || "No date"} ·{" "}
                      {race.track_name ||
                        trackNameFromMaster(race.track_id) ||
                        "No track"}
                    </p>
                  </button>
                ))}
                {selectedTeamRaces.length === 0 ? (
                  <p className="rounded-2xl border border-dashed border-zinc-600 bg-zinc-950 p-6 text-sm text-zinc-500">
                    No races for this team yet.
                  </p>
                ) : null}
              </div>
            </div>

            <div className="rounded-lg border border-white/10 border-l-4 border-l-amber-500 bg-zinc-900 p-6 shadow-lg shadow-black/40">
              <h3 className="text-2xl font-bold">Team Tests</h3>
              <p className="mt-1 text-sm text-zinc-400">
                Saved tests assigned to this team.
              </p>
              <div className="mt-5 space-y-3">
                {selectedTeamTests.slice(0, 5).map((test: any) => (
                  <div
                    key={test.id}
                    className="rounded-lg border border-zinc-700 border-l-4 border-l-amber-500/70 bg-zinc-950 p-4 shadow-md shadow-black/30"
                  >
                    <p className="font-black">
                      {test.car_name || carNameFromMaster(test.car_id)}
                    </p>
                    <p className="mt-1 text-sm text-zinc-500">
                      {test.track_name || trackNameFromMaster(test.track_id)} ·{" "}
                      {test.weather || "Sunny"}
                    </p>
                  </div>
                ))}
                {selectedTeamTests.length === 0 ? (
                  <p className="rounded-2xl border border-dashed border-zinc-600 bg-zinc-950 p-6 text-sm text-zinc-500">
                    No tests assigned to this team yet.
                  </p>
                ) : null}
              </div>
            </div>

            <div className="rounded-lg border border-white/10 border-l-4 border-l-amber-500 bg-zinc-900 p-6 shadow-lg shadow-black/40">
              <h3 className="text-2xl font-bold">Team Setups</h3>
              <p className="mt-1 text-sm text-zinc-400">
                Setup files assigned to this team.
              </p>
              <div className="mt-5 space-y-3">
                {selectedTeamSetups.slice(0, 5).map((setup: any) => (
                  <div
                    key={setup.id}
                    className="rounded-lg border border-zinc-700 border-l-4 border-l-amber-500/70 bg-zinc-950 p-4 shadow-md shadow-black/30"
                  >
                    <p className="font-black">{setup.name}</p>
                    <p className="mt-1 text-sm text-zinc-500">
                      {setup.car_name || "Any car"} ·{" "}
                      {setup.track_name || "Any track"}
                    </p>
                    {setup.file_url ? (
                      <a
                        href={setup.file_url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex rounded-xl bg-green-700 px-3 py-2 text-xs font-bold hover:bg-green-600"
                      >
                        Download
                      </a>
                    ) : null}
                  </div>
                ))}
                {selectedTeamSetups.length === 0 ? (
                  <p className="rounded-2xl border border-dashed border-zinc-600 bg-zinc-950 p-6 text-sm text-zinc-500">
                    No setups assigned to this team yet.
                  </p>
                ) : null}
              </div>
            </div>
          </section>
        </div>,
      );
    }

    return appShell(
      <div className="mx-auto max-w-7xl space-y-6">
        {pageHero(
          "Teams",
          "Team Control",
          "Manage team workspaces, drivers, invites, and shared race resources.",
        )}

        {message && (
          <div className="rounded-2xl border border-zinc-600 bg-zinc-900/90 p-4 text-sm text-zinc-200 shadow-lg">
            {message}
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
          <section className="rounded-lg border border-white/10 border-l-4 border-l-amber-500 bg-zinc-900 p-6 shadow-lg shadow-black/40">
            <div className="mb-5">
              <h3 className="text-2xl font-bold">Create Team</h3>
              <p className="mt-1 text-sm text-zinc-400">
                Start a team, then invite drivers from the team workspace.
              </p>
            </div>

            <div className="space-y-3">
              <input
                value={newTeamName}
                onChange={(event) => setNewTeamName(event.target.value)}
                placeholder="Team name"
                className="w-full rounded-md border border-white/10 bg-black/40 px-4 py-3 font-mono outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              />
              <button
                onClick={createTeam}
                className="w-full rounded-md bg-gradient-to-r from-amber-500 to-amber-400 px-6 py-3 font-black uppercase tracking-wide text-zinc-950 shadow-lg shadow-amber-950/40 transition hover:from-amber-400 hover:to-amber-300"
              >
                Create Team
              </button>
            </div>
          </section>

          <section className="rounded-lg border border-white/10 border-l-4 border-l-amber-500 bg-zinc-900 p-6 shadow-lg shadow-black/40">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-2xl font-bold">Invites</h3>
                <p className="mt-1 text-sm text-zinc-400">
                  Accept or decline team invitations.
                </p>
              </div>
              <span className="rounded-full bg-white/[0.08] px-3 py-1 text-xs font-bold text-zinc-300">
                {teamInvites.length} pending
              </span>
            </div>

            {teamInvites.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-zinc-600 bg-zinc-950 p-8 text-center">
                <p className="font-semibold text-zinc-200">
                  No pending invites.
                </p>
                <p className="mt-2 text-sm text-zinc-500">
                  When someone invites you, it will show up here.
                </p>
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {teamInvites.map((invite) => (
                  <div
                    key={invite.id}
                    className="rounded-lg border border-zinc-700 border-l-4 border-l-amber-500/70 bg-zinc-950 p-4 shadow-md shadow-black/30"
                  >
                    <p className="text-lg font-bold">
                      {invite.teams?.name ||
                        teams.find((team: any) => team.id === invite.team_id)
                          ?.name ||
                        "Unknown Team"}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-zinc-500">
                      Team Invite
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        onClick={() => acceptInvite(invite)}
                        className="rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 px-4 py-2 font-bold hover:from-green-500 hover:to-emerald-400"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => declineInvite(invite)}
                        className="rounded-xl bg-zinc-700 px-4 py-2 font-bold hover:bg-zinc-600"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <section className="rounded-lg border border-white/10 border-l-4 border-l-amber-500 bg-zinc-900 p-6 shadow-lg shadow-black/40">
          <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-2xl font-bold">Your Teams</h3>
              <p className="text-sm text-zinc-400">
                Open a team to manage drivers, races, tests, and setup files.
              </p>
            </div>
            <span className="rounded-full bg-white/[0.08] px-3 py-1 text-xs font-bold text-zinc-300">
              {teams.length} teams
            </span>
          </div>

          {teams.length === 0 ? (
            <div className="rounded-lg border border-dashed border-zinc-700 bg-zinc-950/60 p-10 text-center">
              <p className="text-lg font-semibold">No teams yet.</p>
              <p className="mt-2 text-sm text-zinc-500">
                Create a team above to start inviting drivers.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 xl:grid-cols-2">
              {teams.map((team: any) => {
                const members = teamMembersByTeam[team.id] || [];
                const isAdmin = team.owner_id === userId;
                const teamRaceCount = races.filter(
                  (race: any) => race.team_id === team.id,
                ).length;
                const teamSetupCount = setupFiles.filter(
                  (setup: any) => setup.team_id === team.id,
                ).length;

                return (
                  <div
                    key={team.id}
                    className="rounded-lg border border-zinc-700 border-l-4 border-l-amber-500 bg-zinc-950 p-5 shadow-lg shadow-black/40 shadow-lg transition hover:border-amber-900/70"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-amber-400">
                          Team
                        </p>
                        <h4 className="truncate text-3xl font-black tracking-tight">
                          {team.name}
                        </h4>
                        <p className="mt-1 text-xs text-zinc-600">
                          ID: {team.id}
                        </p>
                      </div>
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                          isAdmin
                            ? "border-amber-900 bg-amber-950/50 text-amber-300"
                            : "border-zinc-600 bg-zinc-900 text-zinc-300"
                        }`}
                      >
                        {isAdmin ? "Admin" : "Driver"}
                      </span>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-2xl bg-zinc-900 p-4">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                          Drivers
                        </p>
                        <p className="mt-2 text-2xl font-black">
                          {members.length}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-zinc-900 p-4">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                          Races
                        </p>
                        <p className="mt-2 text-2xl font-black">
                          {teamRaceCount}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-zinc-900 p-4">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                          Setups
                        </p>
                        <p className="mt-2 text-2xl font-black">
                          {teamSetupCount}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
                      <p className="mb-3 text-sm font-bold text-zinc-200">
                        Drivers
                      </p>
                      {members.length === 0 ? (
                        <p className="text-sm text-zinc-500">
                          No members loaded yet.
                        </p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {members.slice(0, 6).map((member: any) => (
                            <span
                              key={member.user_id}
                              className="rounded-full bg-white/[0.08] px-3 py-1 text-xs font-semibold text-zinc-300"
                            >
                              {profileName(member.profiles)} ·{" "}
                              {roleLabel(member.role)}
                            </span>
                          ))}
                          {members.length > 6 && (
                            <span className="rounded-full bg-white/[0.08] px-3 py-1 text-xs font-semibold text-zinc-500">
                              +{members.length - 6} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      <button
                        onClick={() => setSelectedTeamViewId(team.id)}
                        className="rounded-2xl bg-gradient-to-r from-amber-600 to-amber-600 px-4 py-2 font-bold transition hover:from-amber-500 hover:to-amber-500"
                      >
                        Open Team
                      </button>
                      <a
                        href={`/teams/${team.id}?return=planner`}
                        className="rounded-2xl bg-white/[0.08] px-4 py-2 font-bold transition hover:bg-zinc-700"
                      >
                        Invites
                      </a>
                      {isAdmin ? (
                        <>
                          <button
                            onClick={() => {
                              setEditingTeamId(team.id);
                              setEditingTeamName(team.name);
                              setSelectedTeamViewId(team.id);
                            }}
                            className="rounded-2xl bg-yellow-600 px-4 py-2 font-bold text-black transition hover:bg-yellow-500"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              setDeleteConfirm({
                                title: `Delete ${team.name}?`,
                                onConfirm: () => deleteTeam(team),
                              })
                            }
                            className="rounded-2xl bg-gradient-to-r from-red-600 to-red-500 px-4 py-2 font-bold transition hover:from-red-500 hover:to-rose-500"
                          >
                            Delete
                          </button>
                        </>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>,
    );
  }

  async function createAddRequest() {
    if (!userId) return;

    if (!requestForm.name.trim()) {
      setMessage("Enter a request name or title before submitting.");
      return;
    }

    const selectedRequestType = requestForm.request_type || "other";

    const payload = {
      user_id: userId,
      request_type: selectedRequestType,
      name: requestForm.name.trim(),
      category: requestForm.category.trim() || null,
      notes: requestForm.notes.trim() || null,
      status: "pending",
    };

    const { error } = await supabase.from("add_requests").insert(payload);

    if (error) {
      const typeHint =
        error.message.toLowerCase().includes("request_type") ||
        error.message.toLowerCase().includes("check constraint")
          ? " Supabase is still using the old car/track-only request_type constraint. Run supabase_requests_all_types_fix.sql once."
          : "";
      setMessage(`${error.message}${typeHint}`);
      return;
    }

    markSaveSavedAfterFormReset("request");

    let emailMessage = "Request saved, but email was not checked.";

    try {
      const emailResponse = await fetch("/api/send-request-email", {
        method: "POST",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          request_type: payload.request_type,
          name: payload.name,
          category: payload.category,
          notes: payload.notes,
          submitted_by:
            userProfile?.display_name || userProfile?.username || userId,
          user_id: userId,
          contact_email: SUPPORT_EMAIL,
          recipient_email: SUPPORT_EMAIL,
          to_email: SUPPORT_EMAIL,
          page_context: selectedRace
            ? `Race: ${selectedRace.name} / Tab: ${activeRaceTab}`
            : selectedTeamViewId
              ? `Team: ${getTeamById(teams, selectedTeamViewId)?.name || selectedTeamViewId}`
              : `Page: ${activePage}`,
        }),
      });

      const emailResult = await emailResponse.json();

      if (emailResult.ok) {
        emailMessage = `Request submitted and email notification sent to ${SUPPORT_EMAIL}.`;
      } else {
        emailMessage = `Request submitted, but email did not send: ${emailResult.error || "Unknown email error"}`;
      }
    } catch (error) {
      emailMessage = `Request submitted, but email route failed: ${error instanceof Error ? error.message : "Unknown error"}`;
    }

    setRequestForm({
      request_type: "car",
      name: "",
      category: "",
      notes: "",
    });
    setMessage(emailMessage);
    await loadCarsAndTests();
  }

  async function deleteAddRequest(request: AddRequest) {
    if (
      !userId ||
      (request.user_id !== userId &&
        !appAdmins.some((admin: any) => admin.user_id === userId))
    )
      return;

    const { error } = await supabase
      .from("add_requests")
      .delete()
      .eq("id", request.id);

    if (error) {
      setMessage(error.message);
      return;
    }

    await loadCarsAndTests();
  }

  async function updateAddRequestStatus(request: AddRequest, status: string) {
    if (!userId) return;

    setAddRequests((prev: any) =>
      prev.map((item: any) =>
        item.id === request.id ? { ...item, status } : item,
      ),
    );
    setMessage(`Updating request to ${status}...`);

    try {
      const response = await fetch("/api/update-request-status", {
        method: "POST",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          request_id: request.id,
          status,
          user_id: userId,
        }),
      });

      const result = await response.json();

      if (!result.ok) {
        setMessage(
          `Could not update request status: ${result.error || "Unknown error"}`,
        );
        await loadCarsAndTests();
        return;
      }

      setMessage(`Request marked ${status}.`);
      await loadCarsAndTests();
    } catch (error) {
      setMessage(
        `Could not update request status: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
      await loadCarsAndTests();
    }
  }

  function userTeamIds() {
    return teams.map((team: any) => team.id);
  }

  function canEditSharedItem(item: any) {
    if (!userId) return false;
    if (item.user_id === userId || item.created_by === userId) return true;

    const team = item.team_id
      ? teams.find((teamItem: any) => teamItem.id === item.team_id)
      : null;
    if (!team) return false;

    return team.owner_id === userId;
  }

  function isVisibleSharedItem(item: any) {
    if (!userId) return false;
    if (item.user_id === userId || item.created_by === userId) return true;
    if (!item.team_id) return false;
    return userTeamIds().includes(item.team_id);
  }

  function getTestFolderById(folderId?: string | null) {
    if (!folderId) return null;
    return testFolders.find((folder: any) => folder.id === folderId) || null;
  }

  function getInheritedTestFolderTeamId(folderId?: string | null): string {
    const folder = getTestFolderById(folderId);
    if (!folder) return "";

    if (folder.team_id) return folder.team_id;

    if (folder.parent_id) return getInheritedTestFolderTeamId(folder.parent_id);

    return "";
  }

  function canViewTestFolder(folder: TestFolder) {
    if (!userId) return false;
    if (folder.user_id === userId) return true;
    const inheritedTeamId =
      folder.team_id || getInheritedTestFolderTeamId(folder.parent_id);
    return Boolean(inheritedTeamId && userTeamIds().includes(inheritedTeamId));
  }

  function canEditTestFolder(folder: TestFolder) {
    if (!userId) return false;
    if (folder.user_id === userId) return true;
    const inheritedTeamId =
      folder.team_id || getInheritedTestFolderTeamId(folder.parent_id);
    const team = inheritedTeamId
      ? teams.find((teamItem: any) => teamItem.id === inheritedTeamId)
      : null;
    return Boolean(team && team.owner_id === userId);
  }

  function effectiveTestTeamId(test: TestLibraryItem) {
    return test.team_id || getInheritedTestFolderTeamId(test.folder_id) || "";
  }

  function isVisibleTestLibraryItem(test: TestLibraryItem) {
    if (!userId) return false;
    if (test.user_id === userId) return true;
    const teamId = effectiveTestTeamId(test);
    return Boolean(teamId && userTeamIds().includes(teamId));
  }

  function setupFolderName(folderId?: string | null) {
    if (!folderId) return "Setups";
    return (
      setupFolders.find((folder: any) => folder.id === folderId)?.name ||
      "Unknown Folder"
    );
  }

  function setupFolderIndent(folder: TeamSetupFolder) {
    let depth = 0;
    let current = folder;
    while (current.parent_id && depth < 6) {
      const parent = setupFolders.find(
        (item: any) => item.id === current.parent_id,
      );
      if (!parent) break;
      depth += 1;
      current = parent;
    }
    return depth;
  }

  function getSetupFolderById(folderId?: string | null) {
    if (!folderId) return null;
    return setupFolders.find((folder: any) => folder.id === folderId) || null;
  }

  function getInheritedSetupFolderTeamId(folderId?: string | null): string {
    const folder = getSetupFolderById(folderId);
    if (!folder) return "";

    if (folder.team_id) return folder.team_id;

    if (folder.parent_id)
      return getInheritedSetupFolderTeamId(folder.parent_id);

    return "";
  }

  function canViewSetupFolder(folder: TeamSetupFolder) {
    if (!userId) return false;
    if (folder.user_id === userId) return true;
    const inheritedTeamId =
      folder.team_id || getInheritedSetupFolderTeamId(folder.parent_id);
    return Boolean(inheritedTeamId && userTeamIds().includes(inheritedTeamId));
  }

  function canEditSetupFolder(folder: TeamSetupFolder) {
    if (!userId) return false;
    if (folder.user_id === userId) return true;
    const inheritedTeamId =
      folder.team_id || getInheritedSetupFolderTeamId(folder.parent_id);
    const team = inheritedTeamId
      ? teams.find((teamItem: any) => teamItem.id === inheritedTeamId)
      : null;
    return Boolean(team && team.owner_id === userId);
  }

  function effectiveSetupTeamId(setup: TeamSetupFile) {
    return (
      setup.team_id || getInheritedSetupFolderTeamId(setup.folder_id) || ""
    );
  }

  function isVisibleSetupFile(setup: TeamSetupFile) {
    if (!userId) return false;
    if (setup.user_id === userId) return true;
    const teamId = effectiveSetupTeamId(setup);
    return Boolean(teamId && userTeamIds().includes(teamId));
  }

  async function createSetupFolder() {
    if (!userId) return;
    if (!newSetupFolderName.trim()) {
      setMessage("Enter a setup folder name before creating the folder.");
      return;
    }

    const inheritedTeamId = getInheritedSetupFolderTeamId(
      newSetupFolderParentId,
    );
    const folderTeamId = inheritedTeamId || setupForm.team_id || "";

    const { error } = await supabase.from("team_setup_folders").insert({
      user_id: userId,
      team_id: folderTeamId || null,
      name: newSetupFolderName.trim(),
      parent_id: newSetupFolderParentId || null,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setNewSetupFolderName("");
    setNewSetupFolderParentId("");
    setShowAddSetupFolder(false);
    await loadCarsAndTests();
  }

  function startEditSetupFolder(folder: TeamSetupFolder) {
    setEditingSetupFolderId(folder.id);
    setEditingSetupFolderName(folder.name);
  }

  async function saveSetupFolderEdit(folder: TeamSetupFolder) {
    if (
      !userId ||
      !canEditSetupFolder(folder) ||
      !editingSetupFolderName.trim()
    )
      return;

    const { error } = await supabase
      .from("team_setup_folders")
      .update({ name: editingSetupFolderName.trim() })
      .eq("id", folder.id);

    if (error) {
      setMessage(error.message);
      return;
    }

    setEditingSetupFolderId(null);
    setEditingSetupFolderName("");
    await loadCarsAndTests();
  }

  async function shareSetupFolderWithTeam(
    folder: TeamSetupFolder,
    teamId: string,
  ) {
    if (!userId || !canEditSetupFolder(folder)) {
      setMessage("You can only share setup folders you own or manage.");
      return;
    }

    const { error } = await supabase
      .from("team_setup_folders")
      .update({ team_id: teamId || null })
      .eq("id", folder.id);

    if (error) {
      setMessage(error.message);
      return;
    }

    setSharingSetupFolder(null);
    setShareSetupFolderTeamId("");
    setMessage(
      teamId
        ? "Setup folder shared with team. Setup files inside this folder are now shared."
        : "Setup folder sharing removed. Setup files inside are now personal unless moved into another shared folder.",
    );
    await loadCarsAndTests();
  }

  async function deleteSetupFolder(folder: TeamSetupFolder) {
    if (!userId || !canEditSetupFolder(folder)) return;

    const { error } = await supabase
      .from("team_setup_folders")
      .delete()
      .eq("id", folder.id);

    if (error) {
      setMessage(error.message);
      return;
    }

    if (selectedSetupFolderId === folder.id) setSelectedSetupFolderId("all");
    await loadCarsAndTests();
  }

  function openAddSetupForCurrentFolder() {
    const folderId =
      selectedSetupFolderId === "all" ? "" : selectedSetupFolderId;
    const inheritedTeamId = getInheritedSetupFolderTeamId(folderId);

    setEditingSetupFileId(null);
    setSetupForm((prev: any) => ({
      ...prev,
      folder_id: folderId,
      team_id: inheritedTeamId || "",
      name: "",
      notes: "",
      file_url: "",
      file_name: "",
    }));
    setSetupFileUpload(null);
    setShowAddSetupFile(true);
  }

  function openAddSetupFolderForCurrentFolder() {
    const parentId =
      selectedSetupFolderId === "all" ? "" : selectedSetupFolderId;
    setNewSetupFolderName("");
    setNewSetupFolderParentId(parentId);
    setSetupForm((prev: any) => ({
      ...prev,
      team_id: getInheritedSetupFolderTeamId(parentId) || prev.team_id || "",
    }));
    setShowAddSetupFolder(true);
  }

  async function saveTeamSetupFile() {
    if (!userId) return;

    if (!setupForm.name.trim()) {
      setMessage("Name the setup before saving.");
      return;
    }

    const uploaded = setupFileUpload
      ? await uploadSetupFile(setupFileUpload, "team-setups")
      : null;

    if (setupFileUpload && !uploaded) return;

    const car = iracingCars.find((item: any) => item.id === setupForm.car_id);
    const track = iracingTracks.find(
      (item: any) => item.id === setupForm.track_id,
    );

    const selectedFolderForSetup =
      selectedSetupFolderId === "all" ? "" : selectedSetupFolderId;
    const inheritedTeamId = getInheritedSetupFolderTeamId(
      selectedFolderForSetup,
    );

    const payload = {
      user_id: userId,
      team_id: inheritedTeamId || null,
      folder_id: selectedFolderForSetup || null,
      name: setupForm.name.trim(),
      car_id: setupForm.car_id || null,
      track_id: setupForm.track_id || null,
      car_name: car?.name || null,
      track_name: track?.name || null,
      notes: setupForm.notes || null,
      file_url: uploaded?.url || setupForm.file_url || null,
      file_name: uploaded?.name || setupForm.file_name || null,
    };

    const result = editingSetupFileId
      ? await supabase
          .from("team_setup_files")
          .update(payload)
          .eq("id", editingSetupFileId)
          .eq("user_id", userId)
      : await supabase.from("team_setup_files").insert(payload);

    if (result.error) {
      setMessage(result.error.message);
      return;
    }

    setSetupForm({
      team_id: "",
      folder_id: selectedSetupFolderId === "all" ? "" : selectedSetupFolderId,
      car_id: "",
      track_id: "",
      name: "",
      notes: "",
      file_url: "",
      file_name: "",
    });
    setSetupFileUpload(null);
    setEditingSetupFileId(null);
    setShowAddSetupFile(false);
    await loadCarsAndTests();
  }

  function editTeamSetupFile(setup: TeamSetupFile) {
    setEditingSetupFileId(setup.id);
    setSetupForm({
      team_id: setup.team_id || "",
      folder_id: setup.folder_id || "",
      car_id: setup.car_id || "",
      track_id: setup.track_id || "",
      name: setup.name || "",
      notes: setup.notes || "",
      file_url: setup.file_url || "",
      file_name: setup.file_name || "",
    });
    setSetupFileUpload(null);
    setShowAddSetupFile(true);
  }

  async function deleteTeamSetupFile(setup: TeamSetupFile) {
    if (!userId || !canEditSharedItem(setup)) return;
    await supabase.from("team_setup_files").delete().eq("id", setup.id);
    await loadCarsAndTests();
  }

  async function updateTeamSetupFolder(setup: TeamSetupFile, folderId: string) {
    if (!userId || !canEditSharedItem(setup)) return;

    const inheritedTeamId = getInheritedSetupFolderTeamId(folderId);
    const nextTeamId = inheritedTeamId || null;

    setSetupFiles((prev: any) =>
      prev.map((item: any) =>
        item.id === setup.id
          ? { ...item, folder_id: folderId || null, team_id: nextTeamId }
          : item,
      ),
    );

    const { error } = await supabase
      .from("team_setup_files")
      .update({ folder_id: folderId || null, team_id: nextTeamId })
      .eq("id", setup.id);

    if (error) {
      setMessage(error.message);
      await loadCarsAndTests();
      return;
    }

    await loadCarsAndTests();
  }

  function testingLibraryPage() {
    const myFolders = userId
      ? testFolders.filter((folder: any) => canViewTestFolder(folder))
      : [];
    const myTests = userId
      ? testLibrary.filter((test: any) => isVisibleTestLibraryItem(test))
      : [];

    function folderName(folderId?: string | null) {
      if (!folderId) return "Tests";
      return (
        myFolders.find((folder: any) => folder.id === folderId)?.name ||
        "Unknown Folder"
      );
    }

    function folderIndent(folder: TestFolder) {
      let depth = 0;
      let current = folder;
      while (current.parent_id && depth < 6) {
        const parent = myFolders.find(
          (item: any) => item.id === current.parent_id,
        );
        if (!parent) break;
        depth += 1;
        current = parent;
      }
      return depth;
    }

    const folderOptions = myFolders.map((folder: any) => ({
      ...folder,
      displayName: `${"— ".repeat(folderIndent(folder))}${folder.name}`,
    }));

    const activeFolder =
      selectedTestFolderId !== "all"
        ? myFolders.find((folder: any) => folder.id === selectedTestFolderId)
        : null;

    const childFolders =
      selectedTestFolderId === "all"
        ? myFolders.filter((folder: any) => !folder.parent_id)
        : myFolders.filter(
            (folder: any) => folder.parent_id === selectedTestFolderId,
          );

    const visibleTests =
      selectedTestFolderId === "all"
        ? myTests.filter((test: any) => !test.folder_id)
        : myTests.filter(
            (test: any) => test.folder_id === selectedTestFolderId,
          );

    const comparedTests = compareTestIds
      .map((id) => myTests.find((test: any) => test.id === id))
      .filter(Boolean) as TestLibraryItem[];

    const fastestComparedLap = comparedTests.length
      ? Math.min(
          ...comparedTests
            .map((test: any) =>
              parseLapSeconds(test.average_lap, Number.POSITIVE_INFINITY),
            )
            .filter(Number.isFinite),
        )
      : 0;

    const bestComparedFuelBurn = comparedTests.length
      ? Math.min(
          ...comparedTests
            .map((test: any) =>
              toNumber(test.fuel_burn, Number.POSITIVE_INFINITY),
            )
            .filter(Number.isFinite),
        )
      : 0;

    function toggleCompareTest(testId: string) {
      setCompareTestIds((prev) =>
        prev.includes(testId)
          ? prev.filter((id) => id !== testId)
          : [...prev, testId],
      );
    }

    function testMetrics(test: TestLibraryItem) {
      const lapSeconds = parseLapSeconds(test.average_lap, 0);
      const fuelTank = toNumber(test.fuel_tank, 0);
      const fuelBurn = toNumber(test.fuel_burn, 0);
      const stintLaps =
        fuelTank > 0 && fuelBurn > 0 ? Math.floor(fuelTank / fuelBurn) : 0;
      const stintSeconds =
        stintLaps > 0 && lapSeconds > 0 ? stintLaps * lapSeconds : 0;
      const paceDelta =
        fastestComparedLap && lapSeconds ? lapSeconds - fastestComparedLap : 0;
      const fuelDelta =
        bestComparedFuelBurn && fuelBurn ? fuelBurn - bestComparedFuelBurn : 0;

      return {
        lapSeconds,
        fuelTank,
        fuelBurn,
        stintLaps,
        stintSeconds,
        paceDelta,
        fuelDelta,
      };
    }

    function fuelSaveResult() {
      const raceHours = toNumber(fuelSaveForm.race_hours, 0);
      const pitLoss = toNumber(fuelSaveForm.pit_loss, 0);
      const normalLap = parseLapSeconds(fuelSaveForm.normal_lap, 0);
      const saveLap = parseLapSeconds(fuelSaveForm.save_lap, 0);
      const normalFuel = toNumber(fuelSaveForm.normal_fuel, 0);
      const saveFuel = toNumber(fuelSaveForm.save_fuel, 0);
      const tank = toNumber(fuelSaveForm.fuel_tank, 0);
      const raceSeconds = raceHours * 3600;

      if (
        !raceSeconds ||
        !pitLoss ||
        !normalLap ||
        !saveLap ||
        !normalFuel ||
        !saveFuel ||
        !tank
      )
        return null;

      const normalStintLaps = Math.max(1, Math.floor(tank / normalFuel));
      const saveStintLaps = Math.max(1, Math.floor(tank / saveFuel));
      const normalStintSeconds = normalStintLaps * normalLap;
      const saveStintSeconds = saveStintLaps * saveLap;
      const normalStints = Math.max(
        1,
        Math.ceil(raceSeconds / normalStintSeconds),
      );
      const saveStints = Math.max(1, Math.ceil(raceSeconds / saveStintSeconds));
      const normalPitStops = Math.max(0, normalStints - 1);
      const savePitStops = Math.max(0, saveStints - 1);
      const pitStopsSaved = normalPitStops - savePitStops;
      const estimatedRaceLaps = Math.floor(raceSeconds / normalLap);
      const slowerLapLoss = (saveLap - normalLap) * estimatedRaceLaps;
      const pitTimeSaved = pitStopsSaved * pitLoss;
      const net = pitTimeSaved - slowerLapLoss;
      const breakEvenLapLoss =
        estimatedRaceLaps > 0 ? pitTimeSaved / estimatedRaceLaps : 0;

      return {
        normalStintLaps,
        saveStintLaps,
        normalPitStops,
        savePitStops,
        pitStopsSaved,
        estimatedRaceLaps,
        slowerLapLoss,
        pitTimeSaved,
        net,
        breakEvenLapLoss,
      };
    }

    function loadTestIntoFuelSave(
      test: TestLibraryItem,
      mode: "normal" | "save",
    ) {
      setFuelSaveForm((prev) => ({
        ...prev,
        fuel_tank: prev.fuel_tank || String(test.fuel_tank || ""),
        [`${mode}_lap`]: String(test.average_lap || ""),
        [`${mode}_fuel`]: String(test.fuel_burn || ""),
      }));
    }

    const fuelResult = fuelSaveResult();

    const folderCounts: Record<string, number> = myTests.reduce(
      (counts: Record<string, number>, test: any) => {
        const key = test.folder_id || "unfiled";
        counts[key] = (counts[key] || 0) + 1;
        return counts;
      },
      {},
    );

    const breadcrumbs: TestFolder[] = [];
    if (activeFolder) {
      let current: TestFolder | undefined = activeFolder as TestFolder;
      while (current) {
        breadcrumbs.unshift(current);
        current = current.parent_id
          ? myFolders.find((folder: any) => folder.id === current?.parent_id)
          : undefined;
      }
    }

    function openAddTestForCurrentFolder() {
      const folderId =
        selectedTestFolderId === "all" ? "" : selectedTestFolderId;
      const inheritedTeamId = getInheritedTestFolderTeamId(folderId);

      setEditingLibraryTestId(null);
      setLibraryForm((prev: any) => ({
        ...prev,
        folder_id: folderId,
        team_id: inheritedTeamId || prev.team_id || "",
      }));
      setShowAddLibraryTest(true);
    }

    function openAddFolderForCurrentFolder() {
      const parentId =
        selectedTestFolderId === "all" ? "" : selectedTestFolderId;
      setNewTestFolderName("");
      setNewTestFolderParentId(parentId);
      setNewTestFolderTeamId(getInheritedTestFolderTeamId(parentId));
      setShowAddTestFolder(true);
    }

    return appShell(
      <div className="mx-auto max-w-7xl space-y-6">
        {pageHero(
          "Testing",
          "Testing Library",
          "Save car, track, weather, fuel, lap, and setup data for future races.",
        )}

        <section className="rounded-lg border border-white/10 bg-black/35 p-5 shadow-2xl shadow-black/25">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className={sectionHeaderLabel}>Testing Library Actions</p>
              <h3 className="mt-2 text-2xl font-black">
                Add tests or organize folders
              </h3>
              <p className="mt-2 text-sm text-zinc-400">
                New tests and folders are created in the folder you currently
                have open.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={openAddTestForCurrentFolder}
                className={primaryButtonClass}
              >
                + Add Test
              </button>
              <button
                onClick={openAddFolderForCurrentFolder}
                className="rounded-2xl border border-white/10 bg-white/[0.08] px-5 py-3 font-black text-zinc-100 transition hover:-translate-y-0.5 hover:bg-white/[0.12]"
              >
                + Add Folder
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-white/10 bg-zinc-900/70 p-6 shadow-2xl shadow-black/25">
          <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className={sectionHeaderLabel}>Test Compare</p>
              <h3 className="mt-2 text-3xl font-black">
                Compare cars, setups, and fuel strategy
              </h3>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
                Select 2 or more saved tests to compare pace, fuel burn, stint
                length, setup files, and strategy tradeoffs side-by-side.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-bold text-zinc-300">
                {comparedTests.length} selected
              </span>
              <button
                onClick={() => setCompareTestIds([])}
                className="rounded-xl border border-white/10 bg-white/[0.08] px-3 py-1 text-xs font-bold text-zinc-200 transition hover:bg-white/[0.12]"
              >
                Clear
              </button>
            </div>
          </div>

          {comparedTests.length < 2 ? (
            <div className="rounded-2xl border border-dashed border-zinc-600 bg-black/25 p-6 text-sm text-zinc-400">
              Use the <span className="font-bold text-zinc-200">Compare</span>{" "}
              buttons on saved test cards below. Once you pick at least 2 tests,
              the comparison table and fuel-save calculator will activate.
            </div>
          ) : (
            <div className="space-y-5">
              <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/25">
                <table className="min-w-full border-collapse text-sm">
                  <thead className="bg-black/35 text-xs uppercase tracking-wide text-zinc-500">
                    <tr>
                      <th className="border-b border-white/10 px-4 py-3 text-left">
                        Metric
                      </th>
                      {comparedTests.map((test: any) => (
                        <th
                          key={test.id}
                          className="min-w-[220px] border-b border-white/10 px-4 py-3 text-left"
                        >
                          <p className="font-black text-zinc-200">
                            {test.car_name || carNameFromMaster(test.car_id)}
                          </p>
                          <p className="mt-1 normal-case tracking-normal text-zinc-500">
                            {test.track_name ||
                              trackNameFromMaster(test.track_id)}
                          </p>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      [
                        "Weather",
                        (test: TestLibraryItem) => test.weather || "Sunny",
                      ],
                      [
                        "Average Lap",
                        (test: TestLibraryItem) =>
                          formatLapSeconds(testMetrics(test).lapSeconds),
                      ],
                      [
                        "Pace Delta",
                        (test: TestLibraryItem) =>
                          formatDeltaSeconds(testMetrics(test).paceDelta),
                      ],
                      [
                        "Fuel Tank",
                        (test: TestLibraryItem) =>
                          `${testMetrics(test).fuelTank || "—"}`,
                      ],
                      [
                        "Fuel Burn",
                        (test: TestLibraryItem) =>
                          `${testMetrics(test).fuelBurn || "—"} / lap`,
                      ],
                      [
                        "Fuel Delta",
                        (test: TestLibraryItem) =>
                          testMetrics(test).fuelDelta
                            ? `${testMetrics(test).fuelDelta > 0 ? "+" : ""}${testMetrics(test).fuelDelta.toFixed(3)} / lap`
                            : "Best",
                      ],
                      [
                        "Estimated Stint Laps",
                        (test: TestLibraryItem) =>
                          testMetrics(test).stintLaps || "—",
                      ],
                      [
                        "Estimated Stint Time",
                        (test: TestLibraryItem) =>
                          testMetrics(test).stintSeconds
                            ? formatPlainTime(testMetrics(test).stintSeconds)
                            : "—",
                      ],
                      [
                        "Inlap",
                        (test: TestLibraryItem) =>
                          test.inlap ? formatLapSeconds(test.inlap) : "—",
                      ],
                      [
                        "Outlap",
                        (test: TestLibraryItem) =>
                          test.outlap ? formatLapSeconds(test.outlap) : "—",
                      ],
                      [
                        "Setup",
                        (test: TestLibraryItem) =>
                          test.setup_file_name || "None",
                      ],
                    ].map(([label, getter]: any) => (
                      <tr
                        key={label}
                        className="border-b border-white/10 last:border-b-0"
                      >
                        <td className="bg-black/20 px-4 py-3 font-bold text-zinc-300">
                          {label}
                        </td>
                        {comparedTests.map((test: any) => (
                          <td
                            key={test.id}
                            className="px-4 py-3 font-semibold text-zinc-100"
                          >
                            {getter(test)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
                <div className="rounded-2xl border border-white/10 bg-black/25 p-5">
                  <h4 className="text-xl font-black">Fuel Save Calculator</h4>
                  <p className="mt-2 text-sm text-zinc-400">
                    Compare normal pace vs fuel-save pace to see if saving a pit
                    stop is worth the slower lap time.
                  </p>

                  <div className="mt-5 grid gap-3 md:grid-cols-2">
                    <label className="space-y-2">
                      <span className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
                        Race Hours
                      </span>
                      <input
                        value={fuelSaveForm.race_hours}
                        onChange={(event) =>
                          setFuelSaveForm((prev) => ({
                            ...prev,
                            race_hours: event.target.value,
                          }))
                        }
                        className="w-full rounded-md border border-white/10 bg-black/40 px-4 py-3 font-mono outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                      />
                    </label>
                    <label className="space-y-2">
                      <span className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
                        Pit Loss Seconds
                      </span>
                      <input
                        value={fuelSaveForm.pit_loss}
                        onChange={(event) =>
                          setFuelSaveForm((prev) => ({
                            ...prev,
                            pit_loss: event.target.value,
                          }))
                        }
                        className="w-full rounded-md border border-white/10 bg-black/40 px-4 py-3 font-mono outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                      />
                    </label>
                    <label className="space-y-2">
                      <span className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
                        Normal Lap
                      </span>
                      <input
                        placeholder="94.5 or 1:34.500"
                        value={fuelSaveForm.normal_lap}
                        onChange={(event) =>
                          setFuelSaveForm((prev) => ({
                            ...prev,
                            normal_lap: event.target.value,
                          }))
                        }
                        className="w-full rounded-md border border-white/10 bg-black/40 px-4 py-3 font-mono outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                      />
                    </label>
                    <label className="space-y-2">
                      <span className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
                        Normal Fuel / Lap
                      </span>
                      <input
                        value={fuelSaveForm.normal_fuel}
                        onChange={(event) =>
                          setFuelSaveForm((prev) => ({
                            ...prev,
                            normal_fuel: event.target.value,
                          }))
                        }
                        className="w-full rounded-md border border-white/10 bg-black/40 px-4 py-3 font-mono outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                      />
                    </label>
                    <label className="space-y-2">
                      <span className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
                        Fuel Save Lap
                      </span>
                      <input
                        placeholder="96.0 or 1:36.000"
                        value={fuelSaveForm.save_lap}
                        onChange={(event) =>
                          setFuelSaveForm((prev) => ({
                            ...prev,
                            save_lap: event.target.value,
                          }))
                        }
                        className="w-full rounded-md border border-white/10 bg-black/40 px-4 py-3 font-mono outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                      />
                    </label>
                    <label className="space-y-2">
                      <span className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
                        Fuel Save Fuel / Lap
                      </span>
                      <input
                        value={fuelSaveForm.save_fuel}
                        onChange={(event) =>
                          setFuelSaveForm((prev) => ({
                            ...prev,
                            save_fuel: event.target.value,
                          }))
                        }
                        className="w-full rounded-md border border-white/10 bg-black/40 px-4 py-3 font-mono outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                      />
                    </label>
                    <label className="space-y-2 md:col-span-2">
                      <span className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
                        Fuel Tank
                      </span>
                      <input
                        value={fuelSaveForm.fuel_tank}
                        onChange={(event) =>
                          setFuelSaveForm((prev) => ({
                            ...prev,
                            fuel_tank: event.target.value,
                          }))
                        }
                        className="w-full rounded-md border border-white/10 bg-black/40 px-4 py-3 font-mono outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                      />
                    </label>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {comparedTests.slice(0, 4).map((test: any) => (
                      <div
                        key={test.id}
                        className="flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-2"
                      >
                        <button
                          onClick={() => loadTestIntoFuelSave(test, "normal")}
                          className="rounded-xl bg-white/[0.08] px-3 py-2 text-xs font-bold hover:bg-white/[0.12]"
                        >
                          Use as Normal
                        </button>
                        <button
                          onClick={() => loadTestIntoFuelSave(test, "save")}
                          className="rounded-xl bg-amber-700 px-3 py-2 text-xs font-bold hover:bg-amber-600"
                        >
                          Use as Save
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/25 p-5">
                  <h4 className="text-xl font-black">Strategy Verdict</h4>
                  {!fuelResult ? (
                    <p className="mt-3 rounded-2xl border border-dashed border-zinc-600 bg-black/25 p-5 text-sm text-zinc-400">
                      Fill in both lap times, both fuel burns, race hours, pit
                      loss, and fuel tank to calculate the net gain/loss.
                    </p>
                  ) : (
                    <div className="mt-5 space-y-3">
                      <div
                        className={`rounded-2xl border p-5 ${fuelResult.net >= 0 ? "border-green-900 bg-green-950/30" : "border-red-900 bg-red-950/30"}`}
                      >
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
                          Net Result
                        </p>
                        <p className="mt-2 text-4xl font-black">
                          {fuelResult.net >= 0 ? "+" : "-"}
                          {formatPlainTime(Math.abs(fuelResult.net))}
                        </p>
                        <p className="mt-2 text-sm text-zinc-400">
                          {fuelResult.net >= 0
                            ? "Fuel saving is estimated to save time."
                            : "Fuel saving is estimated to lose time."}
                        </p>
                      </div>

                      <div className="grid gap-3 md:grid-cols-2">
                        {[
                          ["Normal Stint Laps", fuelResult.normalStintLaps],
                          ["Fuel Save Stint Laps", fuelResult.saveStintLaps],
                          ["Normal Pit Stops", fuelResult.normalPitStops],
                          ["Fuel Save Pit Stops", fuelResult.savePitStops],
                          ["Pit Stops Saved", fuelResult.pitStopsSaved],
                          [
                            "Pit Time Saved",
                            formatPlainTime(fuelResult.pitTimeSaved),
                          ],
                          [
                            "Slow Lap Loss",
                            formatPlainTime(fuelResult.slowerLapLoss),
                          ],
                          [
                            "Break Even Lap Loss",
                            `${fuelResult.breakEvenLapLoss.toFixed(3)}s/lap`,
                          ],
                        ].map(([label, value]) => (
                          <div
                            key={label}
                            className="rounded-2xl border border-white/10 bg-white/[0.05] p-4"
                          >
                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
                              {label}
                            </p>
                            <p className="mt-1 text-lg font-black">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>

        <section className="rounded-lg border border-white/10 border-l-4 border-l-amber-500 bg-zinc-900 p-6 shadow-lg shadow-black/40">
          <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
                <button
                  onClick={() => setSelectedTestFolderId("all")}
                  className={`rounded-full px-3 py-1 font-bold transition ${selectedTestFolderId === "all" ? "bg-amber-600 text-white" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"}`}
                >
                  Tests
                </button>
                {breadcrumbs.map((folder: any) => (
                  <button
                    key={folder.id}
                    onClick={() => setSelectedTestFolderId(folder.id)}
                    className="rounded-full bg-white/[0.08] px-3 py-1 font-bold text-zinc-300 transition hover:bg-zinc-700"
                  >
                    / {folder.name}
                  </button>
                ))}
              </div>

              <h3 className="text-3xl font-black">
                {selectedTestFolderId === "all"
                  ? "Tests"
                  : activeFolder?.name || "Folder"}
              </h3>
              <p className="mt-1 text-sm text-zinc-400">
                {childFolders.length} folder
                {childFolders.length === 1 ? "" : "s"} and {visibleTests.length}{" "}
                test{visibleTests.length === 1 ? "" : "s"} shown.
              </p>
            </div>
          </div>

          {childFolders.length > 0 ? (
            <div className="mb-8">
              <h4 className="mb-3 text-lg font-bold">Folders</h4>
              <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                {childFolders.map((folder: any) => (
                  <div
                    key={folder.id}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => {
                      event.preventDefault();
                      const testId = event.dataTransfer.getData("text/plain");
                      const draggedTest = myTests.find(
                        (item: any) => item.id === testId,
                      );
                      if (draggedTest)
                        updateLibraryTestFolder(draggedTest, folder.id);
                    }}
                    className={`rounded-lg border p-5 transition ${
                      selectedTestFolderId === folder.id
                        ? "border-amber-500 bg-amber-950/30"
                        : "border-zinc-800 bg-zinc-950 hover:border-amber-900/70"
                    }`}
                  >
                    {editingTestFolderId === folder.id ? (
                      <div className="space-y-3">
                        <input
                          value={editingTestFolderName}
                          onChange={(event) =>
                            setEditingTestFolderName(event.target.value)
                          }
                          className="w-full rounded-xl border border-white/10 bg-white/[0.07] px-3 py-2 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => saveTestFolderEdit(folder)}
                            className="rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 px-3 py-2 text-xs font-bold hover:from-green-500 hover:to-emerald-400"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingTestFolderId(null)}
                            className="rounded-xl bg-zinc-700 px-3 py-2 text-xs font-bold hover:bg-zinc-600"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => setSelectedTestFolderId(folder.id)}
                          className="block w-full text-left"
                        >
                          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-amber-400">
                            {folder.team_id ||
                            getInheritedTestFolderTeamId(folder.parent_id)
                              ? "Team Folder"
                              : "Folder"}
                          </p>
                          <h5 className="truncate text-2xl font-black">
                            {folder.name}
                          </h5>
                          <p className="mt-2 text-sm text-zinc-500">
                            {folderCounts[folder.id] || 0} direct test
                            {(folderCounts[folder.id] || 0) === 1 ? "" : "s"}
                            {folder.team_id ||
                            getInheritedTestFolderTeamId(folder.parent_id)
                              ? ` · Shared with ${teams.find((team: any) => team.id === (folder.team_id || getInheritedTestFolderTeamId(folder.parent_id)))?.name || "team"}`
                              : ""}
                          </p>
                        </button>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <button
                            onClick={() => setSelectedTestFolderId(folder.id)}
                            className="rounded-2xl bg-gradient-to-r from-amber-600 to-amber-600 px-4 py-2 text-sm font-bold hover:from-amber-500 hover:to-amber-500"
                          >
                            Open
                          </button>
                          {canEditTestFolder(folder) ? (
                            <>
                              <button
                                onClick={() => {
                                  setSharingTestFolder(folder);
                                  setShareTestFolderTeamId(
                                    folder.team_id ||
                                      getInheritedTestFolderTeamId(
                                        folder.parent_id,
                                      ) ||
                                      "",
                                  );
                                }}
                                className="rounded-2xl bg-amber-700 px-4 py-2 text-sm font-bold text-white hover:bg-amber-600"
                              >
                                Share
                              </button>
                              <button
                                onClick={() => startEditTestFolder(folder)}
                                className="rounded-2xl bg-yellow-600 px-4 py-2 text-sm font-bold text-black hover:bg-yellow-500"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() =>
                                  setDeleteConfirm({
                                    title: `Delete folder "${folder.name}"? Tests inside move back to Tests.`,
                                    onConfirm: () => deleteTestFolder(folder),
                                  })
                                }
                                className="rounded-2xl bg-gradient-to-r from-red-600 to-red-500 px-4 py-2 text-sm font-bold hover:from-red-500 hover:to-rose-500"
                              >
                                Delete
                              </button>
                            </>
                          ) : (
                            <span className="rounded-2xl bg-white/[0.05] px-4 py-2 text-sm font-bold text-zinc-500">
                              View only
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div>
            <h4 className="mb-3 text-lg font-bold">Tests</h4>
            {visibleTests.length === 0 ? (
              <div className="rounded-lg border border-dashed border-zinc-700 bg-zinc-950/60 p-10 text-center">
                <p className="text-lg font-semibold">No tests here yet.</p>
                <p className="mt-2 text-sm text-zinc-500">
                  Click Add Test to save one in this location.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 2xl:grid-cols-2">
                {visibleTests.map((test: any) => (
                  <div
                    key={test.id}
                    draggable={canEditSharedItem(test)}
                    onDragStart={(event) => {
                      if (!canEditSharedItem(test)) return;
                      event.dataTransfer.setData("text/plain", test.id);
                    }}
                    className="rounded-lg border border-zinc-700 border-l-4 border-l-amber-500 bg-zinc-950 p-5 shadow-lg shadow-black/40"
                  >
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <h5 className="truncate text-xl font-black">
                          {test.car_name || carNameFromMaster(test.car_id)}
                        </h5>
                        <p className="mt-1 text-sm text-zinc-400">
                          {test.track_name ||
                            trackNameFromMaster(test.track_id)}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {test.team_id ||
                        getInheritedTestFolderTeamId(test.folder_id) ? (
                          <span className="rounded-full border border-green-900 bg-green-950/60 px-3 py-1 text-xs font-bold text-green-200">
                            Shared
                          </span>
                        ) : null}
                        <span className="rounded-full border border-amber-900 bg-amber-950/60 px-3 py-1 text-xs font-bold text-amber-200">
                          {test.weather || "Sunny"}
                        </span>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-4">
                      {[
                        [
                          "Avg Lap",
                          test.average_lap
                            ? formatLapSeconds(test.average_lap)
                            : "—",
                        ],
                        ["Fuel Tank", test.fuel_tank ?? "—"],
                        ["Fuel Burn", test.fuel_burn ?? "—"],
                        ["Folder", folderName(test.folder_id)],
                      ].map(([label, value]) => (
                        <div
                          key={label}
                          className="rounded-2xl border border-white/10 bg-zinc-900/70 p-3"
                        >
                          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
                            {label}
                          </p>
                          <p className="mt-1 truncate font-bold text-zinc-100">
                            {value}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex flex-wrap items-end gap-2">
                      {!canEditSharedItem(test) ? (
                        <span className="rounded-2xl bg-amber-950/50 px-3 py-2 text-xs font-bold uppercase tracking-wide text-amber-200">
                          Team shared
                        </span>
                      ) : null}

                      <button
                        onClick={() => toggleCompareTest(test.id)}
                        className={`rounded-2xl px-4 py-2 text-sm font-bold transition ${
                          compareTestIds.includes(test.id)
                            ? "bg-amber-600 text-white hover:bg-amber-500"
                            : "bg-white/[0.08] text-zinc-100 hover:bg-white/[0.12]"
                        }`}
                      >
                        {compareTestIds.includes(test.id)
                          ? "Selected"
                          : "Compare"}
                      </button>

                      {canEditSharedItem(test) ? (
                        <button
                          onClick={() => {
                            setSharingLibraryTest(test);
                            setShareLibraryTestTeamId(
                              test.team_id ||
                                getInheritedTestFolderTeamId(test.folder_id) ||
                                "",
                            );
                          }}
                          className="rounded-2xl bg-amber-700 px-4 py-2 text-sm font-bold transition hover:bg-amber-600"
                        >
                          Share
                        </button>
                      ) : null}

                      {canEditSharedItem(test) ? (
                        <button
                          onClick={() => setMovingLibraryTest(test)}
                          className="rounded-2xl bg-zinc-700 px-4 py-2 text-sm font-bold transition hover:bg-zinc-600"
                        >
                          Move
                        </button>
                      ) : null}

                      {canEditSharedItem(test) ? (
                        <button
                          onClick={() => editLibraryTest(test)}
                          className="rounded-2xl bg-yellow-600 px-4 py-2 text-sm font-bold text-black transition hover:bg-yellow-500"
                        >
                          Edit
                        </button>
                      ) : null}
                      {test.notes ? (
                        <button
                          onClick={() => setNoteModalText(test.notes || "")}
                          className="rounded-2xl bg-zinc-700 px-4 py-2 text-sm font-bold transition hover:bg-zinc-600"
                        >
                          Notes
                        </button>
                      ) : null}
                      {test.setup_file_url ? (
                        <a
                          href={test.setup_file_url}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-2xl bg-green-700 px-4 py-2 text-sm font-bold transition hover:bg-green-600"
                        >
                          Setup
                        </a>
                      ) : null}
                      {canEditSharedItem(test) ? (
                        <button
                          onClick={() =>
                            setDeleteConfirm({
                              title: "Delete this saved test?",
                              onConfirm: () => deleteLibraryTest(test),
                            })
                          }
                          className="rounded-2xl bg-gradient-to-r from-red-600 to-red-500 px-4 py-2 text-sm font-bold transition hover:from-red-500 hover:to-rose-500"
                        >
                          Delete
                        </button>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {sharingLibraryTest && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 p-4">
            <div className="w-full max-w-lg rounded-lg border border-zinc-700 border-t-4 border-t-amber-500 bg-zinc-900 p-6 shadow-2xl">
              <div className="mb-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-amber-400">
                  Share Test
                </p>
                <h3 className="text-3xl font-black">
                  {sharingLibraryTest.car_name ||
                    carNameFromMaster(sharingLibraryTest.car_id)}
                </h3>
                <p className="mt-1 text-sm text-zinc-400">
                  Share only this saved test with a team. If the test is inside
                  a team-shared folder, folder sharing controls it.
                </p>
              </div>

              {getInheritedTestFolderTeamId(sharingLibraryTest.folder_id) ? (
                <div className="mb-4 rounded-2xl border border-amber-900 bg-amber-950/30 p-4 text-sm text-amber-100">
                  This test is already shared through its folder with{" "}
                  {teams.find(
                    (team: any) =>
                      team.id ===
                      getInheritedTestFolderTeamId(
                        sharingLibraryTest.folder_id,
                      ),
                  )?.name || "a team"}
                  . Move it out of the shared folder before changing individual
                  sharing.
                </div>
              ) : null}

              <label className="block space-y-2">
                <span className="text-sm font-semibold text-zinc-300">
                  Team
                </span>
                <select
                  value={shareLibraryTestTeamId}
                  disabled={Boolean(
                    getInheritedTestFolderTeamId(sharingLibraryTest.folder_id),
                  )}
                  onChange={(event) =>
                    setShareLibraryTestTeamId(event.target.value)
                  }
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3 outline-none transition disabled:cursor-not-allowed disabled:opacity-60 focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20"
                >
                  <option value="" className="bg-zinc-950 text-white">
                    Do not share / personal test
                  </option>
                  {teams.map((team: any) => (
                    <option
                      key={team.id}
                      value={team.id}
                      className="bg-zinc-950 text-white"
                    >
                      {team.name}
                    </option>
                  ))}
                </select>
              </label>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={() =>
                    shareLibraryTestWithTeam(
                      sharingLibraryTest,
                      shareLibraryTestTeamId,
                    )
                  }
                  disabled={Boolean(
                    getInheritedTestFolderTeamId(sharingLibraryTest.folder_id),
                  )}
                  className="rounded-2xl bg-gradient-to-r from-amber-600 to-amber-600 px-5 py-3 font-bold transition disabled:cursor-not-allowed disabled:opacity-50 hover:from-amber-500 hover:to-amber-500"
                >
                  Save Sharing
                </button>
                <button
                  onClick={() => {
                    setSharingLibraryTest(null);
                    setShareLibraryTestTeamId("");
                  }}
                  className="rounded-md border border-zinc-600 bg-zinc-800 px-5 py-3 font-bold uppercase tracking-wide text-zinc-200 transition hover:bg-zinc-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {movingLibraryTest && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 p-4">
            <div className="w-full max-w-lg rounded-lg border border-zinc-700 border-t-4 border-t-amber-500 bg-zinc-900 p-6 shadow-2xl">
              <div className="mb-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-amber-400">
                  Move Test
                </p>
                <h3 className="text-3xl font-black">Choose Folder</h3>
                <p className="mt-1 text-sm text-zinc-400">
                  Move this test into a folder, or move it back out to Tests /
                  No folder.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    updateLibraryTestFolder(movingLibraryTest, "");
                    setMovingLibraryTest(null);
                  }}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-left font-bold transition hover:bg-white/[0.1]"
                >
                  Tests / No folder
                </button>

                {folderOptions.map((folder: any) => (
                  <button
                    key={folder.id}
                    onClick={() => {
                      updateLibraryTestFolder(movingLibraryTest, folder.id);
                      setMovingLibraryTest(null);
                    }}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-left font-bold transition hover:bg-white/[0.1]"
                  >
                    {folder.displayName}
                    {folder.team_id ||
                    getInheritedTestFolderTeamId(folder.parent_id) ? (
                      <span className="ml-2 rounded-full bg-amber-950/70 px-2 py-1 text-[10px] text-amber-200">
                        Shared
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setMovingLibraryTest(null)}
                className="mt-5 rounded-md border border-zinc-600 bg-zinc-800 px-5 py-3 font-bold uppercase tracking-wide text-zinc-200 transition hover:bg-zinc-700"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {sharingTestFolder && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 p-4">
            <div className="w-full max-w-lg rounded-lg border border-zinc-700 border-t-4 border-t-amber-500 bg-zinc-900 p-6 shadow-2xl">
              <div className="mb-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-amber-400">
                  Share Folder
                </p>
                <h3 className="text-3xl font-black">
                  {sharingTestFolder.name}
                </h3>
                <p className="mt-1 text-sm text-zinc-400">
                  Tests inside this folder will be visible to the selected team.
                </p>
              </div>

              <label className="block space-y-2">
                <span className="text-sm font-semibold text-zinc-300">
                  Team
                </span>
                <select
                  value={shareTestFolderTeamId}
                  onChange={(event) =>
                    setShareTestFolderTeamId(event.target.value)
                  }
                  className="w-full rounded-md border border-white/10 bg-black/40 px-4 py-3 font-mono outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                >
                  <option value="" className="bg-zinc-950 text-white">
                    Do not share / personal folder
                  </option>
                  {teams.map((team: any) => (
                    <option
                      key={team.id}
                      value={team.id}
                      className="bg-zinc-950 text-white"
                    >
                      {team.name}
                    </option>
                  ))}
                </select>
              </label>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={() =>
                    shareTestFolderWithTeam(
                      sharingTestFolder,
                      shareTestFolderTeamId,
                    )
                  }
                  className="rounded-md bg-gradient-to-r from-amber-500 to-amber-400 px-5 py-3 font-black uppercase tracking-wide text-zinc-950 transition hover:from-amber-400 hover:to-amber-300"
                >
                  Save Sharing
                </button>
                <button
                  onClick={() => {
                    setSharingTestFolder(null);
                    setShareTestFolderTeamId("");
                  }}
                  className="rounded-md border border-zinc-600 bg-zinc-800 px-5 py-3 font-bold uppercase tracking-wide text-zinc-200 transition hover:bg-zinc-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showAddTestFolder && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 p-4">
            <div className="w-full max-w-lg rounded-lg border border-zinc-700 border-t-4 border-t-amber-500 bg-zinc-900 p-6 shadow-2xl">
              <div className="mb-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-amber-400">
                  Add Folder
                </p>
                <h3 className="text-3xl font-black">Create Folder</h3>
                <p className="mt-1 text-sm text-zinc-400">
                  This folder will be created inside{" "}
                  {selectedTestFolderId === "all"
                    ? "Tests"
                    : activeFolder?.name || "the current folder"}
                  .
                </p>
              </div>

              <div className="space-y-4">
                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-zinc-300">
                    Folder Name
                  </span>
                  <input
                    value={newTestFolderName}
                    onChange={(event) =>
                      setNewTestFolderName(event.target.value)
                    }
                    placeholder="New folder name"
                    className="w-full rounded-md border border-white/10 bg-black/40 px-4 py-3 font-mono outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-zinc-300">
                    Share Folder With Team
                  </span>
                  <select
                    value={
                      getInheritedTestFolderTeamId(
                        selectedTestFolderId === "all"
                          ? ""
                          : selectedTestFolderId,
                      ) || newTestFolderTeamId
                    }
                    onChange={(event) =>
                      setNewTestFolderTeamId(event.target.value)
                    }
                    disabled={Boolean(
                      getInheritedTestFolderTeamId(
                        selectedTestFolderId === "all"
                          ? ""
                          : selectedTestFolderId,
                      ),
                    )}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3 outline-none transition disabled:cursor-not-allowed disabled:opacity-60 focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20"
                  >
                    <option value="" className="bg-zinc-950 text-white">
                      Personal folder
                    </option>
                    {teams.map((team: any) => (
                      <option
                        key={team.id}
                        value={team.id}
                        className="bg-zinc-950 text-white"
                      >
                        {team.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-zinc-500">
                    If this folder is inside a team-shared folder, it
                    automatically uses the same team.
                  </p>
                </label>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={createTestFolder}
                    className="rounded-md bg-gradient-to-r from-amber-500 to-amber-400 px-5 py-3 font-black uppercase tracking-wide text-zinc-950 transition hover:from-amber-400 hover:to-amber-300"
                  >
                    Create Folder
                  </button>
                  <button
                    onClick={() => {
                      setShowAddTestFolder(false);
                      setNewTestFolderName("");
                      setNewTestFolderParentId("");
                      setNewTestFolderTeamId("");
                    }}
                    className="rounded-md border border-zinc-600 bg-zinc-800 px-5 py-3 font-bold uppercase tracking-wide text-zinc-200 transition hover:bg-zinc-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showAddLibraryTest && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-black/75 p-4">
            <div className="my-8 w-full max-w-5xl rounded-lg border border-zinc-600 bg-zinc-900 p-6 shadow-2xl">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-amber-400">
                    {editingLibraryTestId
                      ? "Edit Saved Test"
                      : "Add Saved Test"}
                  </p>
                  <h3 className="text-3xl font-black">
                    {editingLibraryTestId ? "Edit Test" : "Add Test"}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-400">
                    Save reusable data for a specific car, track, and weather
                    combo.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={cancelLibraryTestEdit}
                  className="rounded-2xl bg-zinc-700 px-4 py-2 font-bold hover:bg-zinc-600"
                >
                  Close
                </button>
              </div>

              <div className="space-y-6">
                <div className="rounded-lg border border-zinc-700 border-l-4 border-l-amber-500 bg-zinc-950 p-5 shadow-lg shadow-black/40">
                  <h4 className="mb-4 text-lg font-bold">Save Location</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                        Folder
                      </p>
                      <p className="mt-2 font-bold">
                        {selectedTestFolderId === "all"
                          ? "Tests"
                          : activeFolder?.name || "Tests"}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                        Sharing
                      </p>
                      <p className="mt-2 font-bold">
                        {getInheritedTestFolderTeamId(
                          selectedTestFolderId === "all"
                            ? ""
                            : selectedTestFolderId,
                        )
                          ? `Shared through folder: ${teams.find((team: any) => team.id === getInheritedTestFolderTeamId(selectedTestFolderId === "all" ? "" : selectedTestFolderId))?.name || "Team"}`
                          : "Personal unless moved into a team-shared folder"}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">
                        Share folders, not individual tests. Move this test into
                        a team-shared folder to share it.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-zinc-700 border-l-4 border-l-amber-500 bg-zinc-950 p-5 shadow-lg shadow-black/40">
                  <h4 className="mb-4 text-lg font-bold">
                    Car / Track / Weather
                  </h4>
                  <section className="rounded-lg border border-white/10 bg-black/35 p-5 shadow-2xl shadow-black/25">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <p className={sectionHeaderLabel}>Workflow</p>
                        <h3 className="mt-2 text-2xl font-black">
                          Fastest way to build a race
                        </h3>
                        <p className="mt-2 text-sm text-zinc-400">
                          Create/open a race → fill Race Data → add tests/setups
                          → set availability → check Schedule → export.
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "Race Data",
                          "Testing",
                          "Availability",
                          "Schedule",
                          "Exports",
                        ].map((step) => (
                          <span
                            key={step}
                            className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-bold text-zinc-300"
                          >
                            {step}
                          </span>
                        ))}
                      </div>
                    </div>
                  </section>

                  <div className="grid gap-4 md:grid-cols-3">
                    <label className="space-y-2">
                      <span className="text-sm font-semibold text-zinc-300">
                        Car
                      </span>
                      <input
                        value={libraryCarSearch}
                        list="library-car-options"
                        onChange={(event) => {
                          const value = event.target.value;
                          setLibraryCarSearch(value);
                          const match = iracingCars.find(
                            (car: IRacingCar) =>
                              normalizeSearchText(car.name) ===
                              normalizeSearchText(value),
                          );
                          setLibraryForm((prev: any) => ({
                            ...prev,
                            car_id: match?.id || "",
                          }));
                        }}
                        onKeyDown={(event) => {
                          if (event.key === "Escape") {
                            event.preventDefault();
                            resetLibraryCarSearch();
                          }
                        }}
                        placeholder="Search and select car"
                        className="w-full rounded-md border border-white/10 bg-black/40 px-4 py-3 font-mono outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                      />
                      <datalist id="library-car-options">
                        {filteredLibraryCars.map((car: IRacingCar) => (
                          <option key={car.id} value={car.name} />
                        ))}
                      </datalist>
                    </label>

                    <label className="space-y-2">
                      <span className="text-sm font-semibold text-zinc-300">
                        Track
                      </span>
                      <input
                        value={libraryTrackSearch}
                        list="library-track-options"
                        onChange={(event) => {
                          const value = event.target.value;
                          setLibraryTrackSearch(value);
                          const match = findTrackBySearchValue(value);
                          setLibraryForm((prev: any) => ({
                            ...prev,
                            track_id: match?.id || "",
                          }));
                        }}
                        onKeyDown={(event) => {
                          if (event.key === "Escape") {
                            event.preventDefault();
                            resetLibraryTrackSearch();
                          }
                        }}
                        placeholder="Search and select track"
                        className="w-full rounded-md border border-white/10 bg-black/40 px-4 py-3 font-mono outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                      />
                      <datalist id="library-track-options">
                        {filteredLibraryTracks.map((track: IRacingTrack) => (
                          <option key={track.id} value={track.name} />
                        ))}
                        {filteredLibraryTracks
                          .filter((track: IRacingTrack) =>
                            normalizeSearchText(track.name).includes(
                              "nurburgring",
                            ),
                          )
                          .map((track: IRacingTrack) => (
                            <option
                              key={`${track.id}-ascii`}
                              value={track.name.replace(
                                "Nürburgring",
                                "Nurburgring",
                              )}
                            />
                          ))}
                      </datalist>
                    </label>

                    <label className="space-y-2">
                      <span className="text-sm font-semibold text-zinc-300">
                        Weather
                      </span>
                      <select
                        value={libraryForm.weather}
                        onChange={(event) =>
                          setLibraryForm((prev: any) => ({
                            ...prev,
                            weather: event.target.value,
                          }))
                        }
                        className="w-full rounded-md border border-white/10 bg-black/40 px-4 py-3 font-mono outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                      >
                        {weatherOptions.map((weather) => (
                          <option
                            key={weather}
                            className="bg-zinc-950 text-white"
                          >
                            {weather}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                </div>

                <div className="rounded-lg border border-zinc-700 border-l-4 border-l-amber-500 bg-zinc-950 p-5 shadow-lg shadow-black/40">
                  <h4 className="mb-4 text-lg font-bold">Lap / Fuel Data</h4>
                  <div className="grid gap-4 md:grid-cols-3">
                    {[
                      ["Average Lap Seconds", "average_lap"],
                      ["Fuel Tank", "fuel_tank"],
                      ["Fuel Burn/Lap", "fuel_burn"],
                      ["Inlap Seconds", "inlap"],
                      ["Outlap Seconds", "outlap"],
                    ].map(([label, key]) => (
                      <label key={key} className="space-y-2">
                        <span className="flex items-center gap-2 text-sm font-semibold text-zinc-300">
                          {label}
                          {(key === "inlap" || key === "outlap") && (
                            <button
                              type="button"
                              onClick={() =>
                                setNoteModalText(
                                  key === "inlap"
                                    ? "Inlap is the lap where you enter pit road. Use the full lap time in seconds for the lap that includes pit entry."
                                    : "Outlap is the lap where you leave pit road. Use the full lap time in seconds for the lap that includes pit exit and getting back up to speed.",
                                )
                              }
                              className="flex h-5 w-5 items-center justify-center rounded-full border border-zinc-600 text-xs font-bold text-zinc-300 hover:border-amber-400 hover:text-amber-300"
                            >
                              i
                            </button>
                          )}
                        </span>
                        <input
                          value={(libraryForm as any)[key]}
                          onChange={(event) =>
                            setLibraryForm((prev: any) => ({
                              ...prev,
                              [key]: event.target.value,
                            }))
                          }
                          className="w-full rounded-md border border-white/10 bg-black/40 px-4 py-3 font-mono outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                        />
                      </label>
                    ))}

                    <label className="space-y-2 md:col-span-3">
                      <span className="text-sm font-semibold text-zinc-300">
                        Notes
                      </span>
                      <textarea
                        value={libraryForm.notes}
                        onChange={(event) =>
                          setLibraryForm((prev: any) => ({
                            ...prev,
                            notes: event.target.value,
                          }))
                        }
                        className="h-24 w-full rounded-md border border-white/10 bg-black/40 px-4 py-3 font-mono outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                      />
                    </label>

                    <label className="space-y-2 md:col-span-3">
                      <span className="text-sm font-semibold text-zinc-300">
                        Setup File
                      </span>
                      <input
                        type="file"
                        accept=".sto,.zip,.json,.txt,.pdf"
                        onChange={(event) =>
                          setLibrarySetupFile(event.target.files?.[0] || null)
                        }
                        className="w-full rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3 outline-none transition file:mr-4 file:rounded-xl file:border-0 file:bg-amber-600 file:px-4 file:py-2 file:font-bold file:text-white hover:file:bg-amber-500"
                      />
                      <p className="text-xs text-zinc-500">
                        {librarySetupFile
                          ? `Selected: ${librarySetupFile.name}`
                          : libraryForm.setup_file_name
                            ? `Current: ${libraryForm.setup_file_name}`
                            : "Optional. Upload the iRacing setup file used for this test. If saving fails, make sure the setup-files SQL was run."}
                      </p>
                    </label>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={saveLibraryTest}
                    className="rounded-md bg-gradient-to-r from-amber-500 to-amber-400 px-6 py-3 font-black uppercase tracking-wide text-zinc-950 shadow-lg shadow-amber-950/40 transition hover:from-amber-400 hover:to-amber-300"
                  >
                    {editingLibraryTestId ? "Update Test" : "Save Test"}
                  </button>
                  <button
                    type="button"
                    onClick={cancelLibraryTestEdit}
                    className="rounded-2xl bg-zinc-700 px-6 py-3 font-bold transition hover:bg-zinc-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>,
    );
  }

  function setupsPage() {
    const mySetupFolders = userId
      ? setupFolders.filter((folder: any) => canViewSetupFolder(folder))
      : [];
    const mySetups = userId
      ? setupFiles.filter((setup: any) => isVisibleSetupFile(setup))
      : [];

    const activeFolder =
      selectedSetupFolderId !== "all"
        ? mySetupFolders.find(
            (folder: any) => folder.id === selectedSetupFolderId,
          )
        : null;

    const childFolders =
      selectedSetupFolderId === "all"
        ? mySetupFolders.filter((folder: any) => !folder.parent_id)
        : mySetupFolders.filter(
            (folder: any) => folder.parent_id === selectedSetupFolderId,
          );

    const visibleSetups =
      selectedSetupFolderId === "all"
        ? mySetups.filter((setup: any) => !setup.folder_id)
        : mySetups.filter(
            (setup: any) => setup.folder_id === selectedSetupFolderId,
          );

    const setupFolderCounts: Record<string, number> = mySetups.reduce(
      (counts: Record<string, number>, setup: any) => {
        const key = setup.folder_id || "unfiled";
        counts[key] = (counts[key] || 0) + 1;
        return counts;
      },
      {},
    );

    const setupFolderOptions = mySetupFolders.map((folder: any) => ({
      ...folder,
      displayName: `${"— ".repeat(setupFolderIndent(folder))}${folder.name}`,
    }));

    const breadcrumbs: TeamSetupFolder[] = [];
    if (activeFolder) {
      let current: TeamSetupFolder | undefined =
        activeFolder as TeamSetupFolder;
      while (current) {
        breadcrumbs.unshift(current);
        current = current.parent_id
          ? mySetupFolders.find(
              (folder: any) => folder.id === current?.parent_id,
            )
          : undefined;
      }
    }

    return appShell(
      <div className="mx-auto max-w-7xl space-y-6">
        {pageHero(
          "Setups",
          "Team Setups",
          "Store and organize shared setup files for your team.",
        )}

        <section className="rounded-lg border border-white/10 bg-black/35 p-5 shadow-2xl shadow-black/25">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className={sectionHeaderLabel}>Setup Library Actions</p>
              <h3 className="mt-2 text-2xl font-black">
                Upload setups or organize folders
              </h3>
              <p className="mt-2 text-sm text-zinc-400">
                New setup files and folders are created in the setup folder you
                currently have open.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={openAddSetupForCurrentFolder}
                className={primaryButtonClass}
              >
                + Add Setup
              </button>
              <button
                onClick={openAddSetupFolderForCurrentFolder}
                className="rounded-2xl border border-white/10 bg-white/[0.08] px-5 py-3 font-black text-zinc-100 transition hover:-translate-y-0.5 hover:bg-white/[0.12]"
              >
                + Add Folder
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-white/10 border-l-4 border-l-amber-500 bg-zinc-900 p-6 shadow-lg shadow-black/40">
          <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
                <button
                  onClick={() => setSelectedSetupFolderId("all")}
                  className={`rounded-full px-3 py-1 font-bold transition ${selectedSetupFolderId === "all" ? "bg-amber-600 text-white" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"}`}
                >
                  Setups
                </button>

                {breadcrumbs.map((folder: any) => (
                  <button
                    key={folder.id}
                    onClick={() => setSelectedSetupFolderId(folder.id)}
                    className="rounded-full bg-white/[0.08] px-3 py-1 font-bold text-zinc-300 transition hover:bg-zinc-700"
                  >
                    / {folder.name}
                  </button>
                ))}
              </div>

              <h3 className="text-3xl font-black">
                {selectedSetupFolderId === "all"
                  ? "Setups"
                  : activeFolder?.name || "Folder"}
              </h3>
              <p className="mt-1 text-sm text-zinc-400">
                {childFolders.length} folder
                {childFolders.length === 1 ? "" : "s"} and{" "}
                {visibleSetups.length} setup
                {visibleSetups.length === 1 ? "" : "s"} shown.
              </p>
            </div>
          </div>

          {childFolders.length > 0 ? (
            <div className="mb-8">
              <h4 className="mb-3 text-lg font-bold">Folders</h4>
              <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                {childFolders.map((folder: any) => (
                  <div
                    key={folder.id}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => {
                      event.preventDefault();
                      const setupId = event.dataTransfer.getData("text/plain");
                      const draggedSetup = mySetups.find(
                        (item: any) => item.id === setupId,
                      );
                      if (draggedSetup)
                        updateTeamSetupFolder(draggedSetup, folder.id);
                    }}
                    className="rounded-lg border border-zinc-700 border-l-4 border-l-amber-500 bg-zinc-950 p-5 shadow-lg shadow-black/40 transition hover:border-amber-900/70"
                  >
                    {editingSetupFolderId === folder.id ? (
                      <div className="space-y-3">
                        <input
                          value={editingSetupFolderName}
                          onChange={(event) =>
                            setEditingSetupFolderName(event.target.value)
                          }
                          className="w-full rounded-xl border border-white/10 bg-white/[0.07] px-3 py-2 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => saveSetupFolderEdit(folder)}
                            className="rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 px-3 py-2 text-xs font-bold hover:from-green-500 hover:to-emerald-400"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingSetupFolderId(null)}
                            className="rounded-xl bg-zinc-700 px-3 py-2 text-xs font-bold hover:bg-zinc-600"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => setSelectedSetupFolderId(folder.id)}
                          className="block w-full text-left"
                        >
                          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-amber-400">
                            {folder.team_id ||
                            getInheritedSetupFolderTeamId(folder.parent_id)
                              ? "Team Setup Folder"
                              : "Folder"}
                          </p>
                          <h5 className="truncate text-2xl font-black">
                            {folder.name}
                          </h5>
                          <p className="mt-2 text-sm text-zinc-500">
                            {setupFolderCounts[folder.id] || 0} direct setup
                            {(setupFolderCounts[folder.id] || 0) === 1
                              ? ""
                              : "s"}
                            {folder.team_id ||
                            getInheritedSetupFolderTeamId(folder.parent_id)
                              ? ` · Shared with ${teams.find((team: any) => team.id === (folder.team_id || getInheritedSetupFolderTeamId(folder.parent_id)))?.name || "team"}`
                              : ""}
                          </p>
                        </button>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <button
                            onClick={() => setSelectedSetupFolderId(folder.id)}
                            className="rounded-2xl bg-gradient-to-r from-amber-600 to-amber-600 px-4 py-2 text-sm font-bold hover:from-amber-500 hover:to-amber-500"
                          >
                            Open
                          </button>
                          {canEditSetupFolder(folder) ? (
                            <>
                              <button
                                onClick={() => {
                                  setSharingSetupFolder(folder);
                                  setShareSetupFolderTeamId(
                                    folder.team_id ||
                                      getInheritedSetupFolderTeamId(
                                        folder.parent_id,
                                      ) ||
                                      "",
                                  );
                                }}
                                className="rounded-2xl bg-amber-700 px-4 py-2 text-sm font-bold text-white hover:bg-amber-600"
                              >
                                Share
                              </button>
                              <button
                                onClick={() => startEditSetupFolder(folder)}
                                className="rounded-2xl bg-yellow-600 px-4 py-2 text-sm font-bold text-black hover:bg-yellow-500"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() =>
                                  setDeleteConfirm({
                                    title: `Delete folder "${folder.name}"? Setups inside move back to Setups.`,
                                    onConfirm: () => deleteSetupFolder(folder),
                                  })
                                }
                                className="rounded-2xl bg-gradient-to-r from-red-600 to-red-500 px-4 py-2 text-sm font-bold hover:from-red-500 hover:to-rose-500"
                              >
                                Delete
                              </button>
                            </>
                          ) : (
                            <span className="rounded-2xl bg-white/[0.05] px-4 py-2 text-sm font-bold text-zinc-500">
                              View only
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div>
            <h4 className="mb-3 text-lg font-bold">Setup Files</h4>
            {visibleSetups.length === 0 ? (
              <div className="rounded-lg border border-dashed border-zinc-700 bg-zinc-950/60 p-10 text-center">
                <p className="text-lg font-semibold">No setups here yet.</p>
                <p className="mt-2 text-sm text-zinc-500">
                  Click Add Setup to upload one in this location.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 2xl:grid-cols-2">
                {visibleSetups.map((setup: any) => (
                  <div
                    key={setup.id}
                    draggable={canEditSharedItem(setup)}
                    onDragStart={(event) => {
                      if (!canEditSharedItem(setup)) return;
                      event.dataTransfer.setData("text/plain", setup.id);
                    }}
                    className="rounded-lg border border-zinc-700 border-l-4 border-l-amber-500 bg-zinc-950 p-5 shadow-lg shadow-black/40"
                  >
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <h5 className="truncate text-xl font-black">
                          {setup.name}
                        </h5>
                        <p className="mt-1 text-sm text-zinc-400">
                          {setup.car_name || "Any Car"} ·{" "}
                          {setup.track_name || "Any Track"}
                        </p>
                      </div>
                      <span className="rounded-full border border-amber-900 bg-amber-950/60 px-3 py-1 text-xs font-bold text-amber-200">
                        {setupFolderName(setup.folder_id)}
                      </span>
                    </div>

                    {setup.notes ? (
                      <p className="mb-4 text-sm text-zinc-400">
                        {setup.notes}
                      </p>
                    ) : null}

                    <div className="flex flex-wrap gap-2">
                      {!canEditSharedItem(setup) ? (
                        <span className="rounded-2xl bg-amber-950/50 px-3 py-2 text-xs font-bold uppercase tracking-wide text-amber-200">
                          Team shared
                        </span>
                      ) : null}
                      {setup.file_url ? (
                        <a
                          href={setup.file_url}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-2xl bg-green-700 px-4 py-2 text-sm font-bold transition hover:bg-green-600"
                        >
                          Download
                        </a>
                      ) : null}
                      {canEditSharedItem(setup) ? (
                        <button
                          onClick={() => setMovingSetupFile(setup)}
                          className="rounded-2xl bg-zinc-700 px-4 py-2 text-sm font-bold transition hover:bg-zinc-600"
                        >
                          Move
                        </button>
                      ) : null}

                      {canEditSharedItem(setup) ? (
                        <button
                          onClick={() => editTeamSetupFile(setup)}
                          className="rounded-2xl bg-yellow-600 px-4 py-2 text-sm font-bold text-black transition hover:bg-yellow-500"
                        >
                          Edit
                        </button>
                      ) : null}
                      {canEditSharedItem(setup) ? (
                        <button
                          onClick={() =>
                            setDeleteConfirm({
                              title: "Delete this setup?",
                              onConfirm: () => deleteTeamSetupFile(setup),
                            })
                          }
                          className="rounded-2xl bg-gradient-to-r from-red-600 to-red-500 px-4 py-2 text-sm font-bold transition hover:from-red-500 hover:to-rose-500"
                        >
                          Delete
                        </button>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {sharingSetupFolder && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 p-4">
            <div className="w-full max-w-lg rounded-lg border border-zinc-700 border-t-4 border-t-amber-500 bg-zinc-900 p-6 shadow-2xl">
              <div className="mb-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-amber-400">
                  Share Setup Folder
                </p>
                <h3 className="text-3xl font-black">
                  {sharingSetupFolder.name}
                </h3>
                <p className="mt-1 text-sm text-zinc-400">
                  Setup files inside this folder will be visible to the selected
                  team.
                </p>
              </div>

              <label className="block space-y-2">
                <span className="text-sm font-semibold text-zinc-300">
                  Team
                </span>
                <select
                  value={shareSetupFolderTeamId}
                  onChange={(event) =>
                    setShareSetupFolderTeamId(event.target.value)
                  }
                  className="w-full rounded-md border border-white/10 bg-black/40 px-4 py-3 font-mono outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                >
                  <option value="" className="bg-zinc-950 text-white">
                    Do not share / personal folder
                  </option>
                  {teams.map((team: any) => (
                    <option
                      key={team.id}
                      value={team.id}
                      className="bg-zinc-950 text-white"
                    >
                      {team.name}
                    </option>
                  ))}
                </select>
              </label>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={() =>
                    shareSetupFolderWithTeam(
                      sharingSetupFolder,
                      shareSetupFolderTeamId,
                    )
                  }
                  className="rounded-md bg-gradient-to-r from-amber-500 to-amber-400 px-5 py-3 font-black uppercase tracking-wide text-zinc-950 transition hover:from-amber-400 hover:to-amber-300"
                >
                  Save Sharing
                </button>
                <button
                  onClick={() => {
                    setSharingSetupFolder(null);
                    setShareSetupFolderTeamId("");
                  }}
                  className="rounded-md border border-zinc-600 bg-zinc-800 px-5 py-3 font-bold uppercase tracking-wide text-zinc-200 transition hover:bg-zinc-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {movingSetupFile && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 p-4">
            <div className="w-full max-w-lg rounded-lg border border-zinc-700 border-t-4 border-t-amber-500 bg-zinc-900 p-6 shadow-2xl">
              <div className="mb-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-amber-400">
                  Move Setup
                </p>
                <h3 className="text-3xl font-black">Choose Folder</h3>
                <p className="mt-1 text-sm text-zinc-400">
                  Move this setup into a folder, or move it back out to Setups /
                  No folder.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    updateTeamSetupFolder(movingSetupFile, "");
                    setMovingSetupFile(null);
                  }}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-left font-bold transition hover:bg-white/[0.1]"
                >
                  Setups / No folder
                </button>

                {setupFolderOptions.map((folder: any) => (
                  <button
                    key={folder.id}
                    onClick={() => {
                      updateTeamSetupFolder(movingSetupFile, folder.id);
                      setMovingSetupFile(null);
                    }}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-left font-bold transition hover:bg-white/[0.1]"
                  >
                    {folder.displayName}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setMovingSetupFile(null)}
                className="mt-5 rounded-md border border-zinc-600 bg-zinc-800 px-5 py-3 font-bold uppercase tracking-wide text-zinc-200 transition hover:bg-zinc-700"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {showAddSetupFolder && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 p-4">
            <div className="w-full max-w-lg rounded-lg border border-zinc-700 border-t-4 border-t-amber-500 bg-zinc-900 p-6 shadow-2xl">
              <div className="mb-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-amber-400">
                  Add Folder
                </p>
                <h3 className="text-3xl font-black">Create Setup Folder</h3>
                <p className="mt-1 text-sm text-zinc-400">
                  This folder will be created inside{" "}
                  {selectedSetupFolderId === "all"
                    ? "Setups"
                    : activeFolder?.name || "the current folder"}
                  .
                </p>
              </div>

              <div className="space-y-4">
                <input
                  value={newSetupFolderName}
                  onChange={(event) =>
                    setNewSetupFolderName(event.target.value)
                  }
                  placeholder="New folder name"
                  className="w-full rounded-md border border-white/10 bg-black/40 px-4 py-3 font-mono outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                />

                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-zinc-300">
                    Share Folder With Team
                  </span>
                  <select
                    value={
                      getInheritedSetupFolderTeamId(
                        selectedSetupFolderId === "all"
                          ? ""
                          : selectedSetupFolderId,
                      ) || setupForm.team_id
                    }
                    disabled={Boolean(
                      getInheritedSetupFolderTeamId(
                        selectedSetupFolderId === "all"
                          ? ""
                          : selectedSetupFolderId,
                      ),
                    )}
                    onChange={(event) =>
                      setSetupForm((prev: any) => ({
                        ...prev,
                        team_id: event.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3 outline-none transition disabled:cursor-not-allowed disabled:opacity-60 focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20"
                  >
                    <option value="" className="bg-zinc-950 text-white">
                      Personal folder
                    </option>
                    {teams.map((team: any) => (
                      <option
                        key={team.id}
                        value={team.id}
                        className="bg-zinc-950 text-white"
                      >
                        {team.name}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={createSetupFolder}
                    className="rounded-md bg-gradient-to-r from-amber-500 to-amber-400 px-5 py-3 font-black uppercase tracking-wide text-zinc-950 transition hover:from-amber-400 hover:to-amber-300"
                  >
                    Create Folder
                  </button>
                  <button
                    onClick={() => setShowAddSetupFolder(false)}
                    className="rounded-md border border-zinc-600 bg-zinc-800 px-5 py-3 font-bold uppercase tracking-wide text-zinc-200 transition hover:bg-zinc-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showAddSetupFile && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-black/75 p-4">
            <div className="my-8 w-full max-w-4xl rounded-lg border border-zinc-600 bg-zinc-900 p-6 shadow-2xl">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-amber-400">
                    {editingSetupFileId ? "Edit Setup" : "Add Setup"}
                  </p>
                  <h3 className="text-3xl font-black">
                    {editingSetupFileId
                      ? "Edit Setup File"
                      : "Upload Setup File"}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-400">
                    Save a setup file for the team to use.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddSetupFile(false)}
                  className="rounded-2xl bg-zinc-700 px-4 py-2 font-bold hover:bg-zinc-600"
                >
                  Close
                </button>
              </div>

              <div className="space-y-5">
                <div className="rounded-lg border border-zinc-700 border-l-4 border-l-amber-500 bg-zinc-950 p-5 shadow-lg shadow-black/40">
                  <h4 className="mb-4 text-lg font-bold">Setup Info</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <input
                      value={setupForm.name}
                      onChange={(event) =>
                        setSetupForm((prev: any) => ({
                          ...prev,
                          name: event.target.value,
                        }))
                      }
                      placeholder="Setup name"
                      className="rounded-md border border-white/10 bg-black/40 px-4 py-3 font-mono outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                    />

                    <div className="rounded-2xl border border-white/10 bg-zinc-900/70 px-4 py-3">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
                        Sharing
                      </p>
                      <p className="mt-1 font-bold">
                        {getInheritedSetupFolderTeamId(
                          selectedSetupFolderId === "all"
                            ? ""
                            : selectedSetupFolderId,
                        )
                          ? `Shared through folder: ${teams.find((team: any) => team.id === getInheritedSetupFolderTeamId(selectedSetupFolderId === "all" ? "" : selectedSetupFolderId))?.name || "Team"}`
                          : "Personal unless moved into a team-shared folder"}
                      </p>
                    </div>

                    <select
                      value={setupForm.car_id}
                      onChange={(event) =>
                        setSetupForm((prev: any) => ({
                          ...prev,
                          car_id: event.target.value,
                        }))
                      }
                      className="rounded-md border border-white/10 bg-black/40 px-4 py-3 font-mono outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                    >
                      <option value="" className="bg-zinc-950 text-white">
                        Any car
                      </option>
                      {iracingCars.map((car: any) => (
                        <option
                          key={car.id}
                          value={car.id}
                          className="bg-zinc-950 text-white"
                        >
                          {car.name}
                        </option>
                      ))}
                    </select>

                    <select
                      value={setupForm.track_id}
                      onChange={(event) =>
                        setSetupForm((prev: any) => ({
                          ...prev,
                          track_id: event.target.value,
                        }))
                      }
                      className="rounded-md border border-white/10 bg-black/40 px-4 py-3 font-mono outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                    >
                      <option value="" className="bg-zinc-950 text-white">
                        Any track
                      </option>
                      {iracingTracks.map((track: any) => (
                        <option
                          key={track.id}
                          value={track.id}
                          className="bg-zinc-950 text-white"
                        >
                          {track.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="rounded-lg border border-zinc-700 border-l-4 border-l-amber-500 bg-zinc-950 p-5 shadow-lg shadow-black/40">
                  <h4 className="mb-4 text-lg font-bold">File / Notes</h4>
                  <div className="grid gap-4">
                    <input
                      type="file"
                      accept=".sto,.zip,.json,.txt,.pdf"
                      onChange={(event) =>
                        setSetupFileUpload(event.target.files?.[0] || null)
                      }
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3 outline-none transition file:mr-4 file:rounded-xl file:border-0 file:bg-amber-600 file:px-4 file:py-2 file:font-bold file:text-white hover:file:bg-amber-500"
                    />
                    <p className="text-xs text-zinc-500">
                      {setupFileUpload
                        ? `Selected: ${setupFileUpload.name}`
                        : setupForm.file_name
                          ? `Current: ${setupForm.file_name}`
                          : "Upload the setup file."}
                    </p>
                    <textarea
                      value={setupForm.notes}
                      onChange={(event) =>
                        setSetupForm((prev: any) => ({
                          ...prev,
                          notes: event.target.value,
                        }))
                      }
                      placeholder="Notes, conditions, tire set, fuel, or anything useful"
                      className="h-28 rounded-md border border-white/10 bg-black/40 px-4 py-3 font-mono outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={saveTeamSetupFile}
                    className="rounded-md bg-gradient-to-r from-amber-500 to-amber-400 px-6 py-3 font-black uppercase tracking-wide text-zinc-950 shadow-lg shadow-amber-950/40 transition hover:from-amber-400 hover:to-amber-300"
                  >
                    {editingSetupFileId ? "Update Setup" : "Save Setup"}
                  </button>
                  <button
                    onClick={() => setShowAddSetupFile(false)}
                    className="rounded-2xl bg-zinc-700 px-6 py-3 font-bold transition hover:bg-zinc-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>,
    );
  }

  function calendarPage() {
    const monthStart = new Date(
      calendarMonth.getFullYear(),
      calendarMonth.getMonth(),
      1,
    );
    const firstGridDay = new Date(monthStart);
    firstGridDay.setDate(monthStart.getDate() - monthStart.getDay());

    const calendarDays = Array.from({ length: 42 }, (_, index) => {
      const day = new Date(firstGridDay);
      day.setDate(firstGridDay.getDate() + index);
      return day;
    });

    const sortedRaces = [...races].sort((a: any, b: any) => {
      const aTime = a.race_date
        ? new Date(`${a.race_date}T12:00:00`).getTime()
        : Number.MAX_SAFE_INTEGER;
      const bTime = b.race_date
        ? new Date(`${b.race_date}T12:00:00`).getTime()
        : Number.MAX_SAFE_INTEGER;
      return aTime - bTime;
    });

    const monthRaces = sortedRaces.filter((race: any) => {
      if (!race.race_date) return false;
      const raceDate = new Date(`${race.race_date}T12:00:00`);
      return (
        raceDate.getMonth() === calendarMonth.getMonth() &&
        raceDate.getFullYear() === calendarMonth.getFullYear()
      );
    });

    const upcomingRaces = sortedRaces.filter((race: any) => {
      if (!race.race_date) return true;
      const raceEnd = new Date(`${race.race_date}T12:00:00`);
      raceEnd.setDate(raceEnd.getDate() + 1);
      return raceEnd.getTime() >= Date.now();
    });

    const nextRace = upcomingRaces[0];

    function raceTrackLabel(race: Race) {
      return (
        race.track_name ||
        trackNameFromMaster(race.track_id) ||
        "No track selected"
      );
    }

    function dateKey(date: Date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }

    function raceLengthHours(race: any) {
      const value =
        race.race_length_hours ?? race.race_length ?? race.length_hours ?? 24;
      const parsed = Number(value);
      return Number.isFinite(parsed) && parsed > 0 ? parsed : 24;
    }

    function raceStartDate(race: any) {
      if (!race.race_date) return null;
      return new Date(`${race.race_date}T00:00:00`);
    }

    function raceEndDate(race: any) {
      const start = raceStartDate(race);
      if (!start) return null;

      const end = new Date(start);
      end.setHours(end.getHours() + raceLengthHours(race));

      // If a race ends exactly at midnight, still show it on the next day
      // for clarity because users think of a Sat 24 as Sat-Sun.
      return end;
    }

    function raceTouchesDay(race: any, day: Date) {
      const start = raceStartDate(race);
      const end = raceEndDate(race);
      if (!start || !end) return false;

      const dayStart = new Date(
        day.getFullYear(),
        day.getMonth(),
        day.getDate(),
        0,
        0,
        0,
        0,
      );
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);

      return start < dayEnd && end >= dayStart;
    }

    function raceSpanPosition(race: any, day: Date) {
      const start = raceStartDate(race);
      const end = raceEndDate(race);
      if (!start || !end) return "single";

      const dayKeyValue = dateKey(day);
      const startKey = dateKey(start);
      const endKey = dateKey(end);

      if (dayKeyValue === startKey && dayKeyValue === endKey) return "single";
      if (dayKeyValue === startKey) return "start";
      if (dayKeyValue === endKey) return "end";
      return "middle";
    }

    function multiDayBarClass(position: string) {
      if (position === "start") return "ml-0 -mr-3 rounded-l-xl rounded-r-none";
      if (position === "middle") return "-mx-3 rounded-none";
      if (position === "end") return "-ml-3 mr-0 rounded-l-none rounded-r-xl";
      return "rounded-xl";
    }

    function racesForDay(day: Date) {
      return sortedRaces.filter((race: any) => raceTouchesDay(race, day));
    }

    function goToPreviousMonth() {
      setCalendarMonth(
        (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
      );
    }

    function goToNextMonth() {
      setCalendarMonth(
        (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
      );
    }

    function goToToday() {
      setCalendarMonth(new Date());
    }

    const monthTitle = calendarMonth.toLocaleDateString(undefined, {
      month: "long",
      year: "numeric",
    });
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return appShell(
      <div className="mx-auto max-w-7xl space-y-6">
        {pageHero(
          "Calendar",
          "Calendar",
          "See upcoming races and multi-day events in one place.",
        )}

        <section className="rounded-lg border border-white/10 border-l-4 border-l-amber-500 bg-zinc-900 p-6 shadow-lg shadow-black/40">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-3xl font-black">{monthTitle}</h3>
              <p className="mt-1 text-sm text-zinc-400">
                Click a race on the calendar or use the agenda below.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={goToPreviousMonth}
                className="rounded-2xl bg-white/[0.08] px-4 py-2 font-bold transition hover:bg-zinc-700"
              >
                Previous
              </button>
              <button
                onClick={goToToday}
                className="rounded-2xl bg-gradient-to-r from-amber-600 to-amber-600 px-4 py-2 font-bold transition hover:from-amber-500 hover:to-amber-500"
              >
                Today
              </button>
              <button
                onClick={goToNextMonth}
                className="rounded-2xl bg-white/[0.08] px-4 py-2 font-bold transition hover:bg-zinc-700"
              >
                Next
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-zinc-700 border-l-4 border-l-amber-500 bg-zinc-950 shadow-lg shadow-black/40">
            <div className="grid grid-cols-7 border-b border-zinc-800 bg-zinc-900">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="px-3 py-3 text-center text-xs font-bold uppercase tracking-[0.2em] text-zinc-500"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7">
              {calendarDays.map((day) => {
                const isCurrentMonth =
                  day.getMonth() === calendarMonth.getMonth();
                const isToday = dateKey(day) === dateKey(new Date());
                const dayRaces = racesForDay(day);

                return (
                  <div
                    key={dateKey(day)}
                    className={`min-h-[145px] border-b border-r border-zinc-900 p-3 ${
                      isCurrentMonth
                        ? "bg-zinc-950"
                        : "bg-black/40 text-zinc-700"
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-black ${
                          isToday
                            ? "bg-amber-600 text-white"
                            : isCurrentMonth
                              ? "text-zinc-200"
                              : "text-zinc-600"
                        }`}
                      >
                        {day.getDate()}
                      </span>
                      {dayRaces.length > 0 ? (
                        <span className="rounded-full bg-amber-950 px-2 py-0.5 text-[10px] font-bold text-amber-200">
                          {dayRaces.length}
                        </span>
                      ) : null}
                    </div>

                    <div className="space-y-2">
                      {dayRaces.slice(0, 3).map((race: any) => {
                        const team = race.team_id
                          ? getTeamById(teams, race.team_id)
                          : null;
                        const position = raceSpanPosition(race, day);
                        const showText =
                          position === "single" || position === "start";

                        return (
                          <button
                            key={`${race.id}-${dateKey(day)}`}
                            onClick={() => {
                              setSelectedRaceId(race.id);
                              setActiveRaceTab("Data");
                            }}
                            title={`${race.name} · ${team?.name || raceTrackLabel(race)}`}
                            className={`block h-[42px] w-full border-y border-amber-800/70 bg-amber-700/90 px-2 py-1 text-left shadow-sm transition hover:bg-amber-600 ${multiDayBarClass(position)}`}
                          >
                            {showText ? (
                              <>
                                <p className="truncate text-xs font-black text-white">
                                  {race.name}
                                </p>
                                <p className="mt-0.5 truncate text-[10px] text-amber-100/80">
                                  {team?.name || raceTrackLabel(race)}
                                </p>
                              </>
                            ) : (
                              <span className="sr-only">{race.name}</span>
                            )}
                          </button>
                        );
                      })}

                      {dayRaces.length > 3 ? (
                        <p className="text-[10px] font-bold text-zinc-500">
                          +{dayRaces.length - 3} more
                        </p>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {nextRace ? (
          <section className="rounded-lg border border-white/10 border-l-4 border-l-amber-500 bg-zinc-900 p-6 shadow-lg shadow-black/40">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-amber-300">
                  Next Up
                </p>
                <h3 className="text-3xl font-black">{nextRace.name}</h3>
                <p className="mt-2 text-zinc-300">{raceTrackLabel(nextRace)}</p>
                <p className="mt-1 text-sm text-zinc-500">
                  {nextRace.race_date || "No date selected"}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="rounded-lg border border-zinc-700 border-l-4 border-l-amber-500/70 bg-zinc-950 shadow-md shadow-black/30 px-5 py-4">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                    Countdown
                  </p>
                  <p className="mt-2 font-black text-amber-200">
                    {getRaceTimer(nextRace)}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedRaceId(nextRace.id);
                    setActiveRaceTab("Data");
                  }}
                  className="rounded-md bg-gradient-to-r from-amber-500 to-amber-400 px-6 py-3 font-black uppercase tracking-wide text-zinc-950 shadow-lg shadow-amber-950/40 transition hover:from-amber-400 hover:to-amber-300"
                >
                  Open Race
                </button>
              </div>
            </div>
          </section>
        ) : null}

        <section className="rounded-lg border border-white/10 border-l-4 border-l-amber-500 bg-zinc-900 p-6 shadow-lg shadow-black/40">
          <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-2xl font-bold">Monthly Agenda</h3>
              <p className="text-sm text-zinc-400">
                Detailed list for races in the selected month.
              </p>
            </div>
            <span className="rounded-full bg-white/[0.08] px-3 py-1 text-xs font-bold text-zinc-300">
              {monthRaces.length} races
            </span>
          </div>

          {monthRaces.length === 0 ? (
            <div className="rounded-lg border border-dashed border-zinc-700 bg-zinc-950/60 p-10 text-center">
              <p className="text-lg font-semibold">No races this month.</p>
              <p className="mt-2 text-sm text-zinc-500">
                Use Previous/Next to view other months.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {monthRaces.map((race: any) => {
                const team = race.team_id
                  ? getTeamById(teams, race.team_id)
                  : null;
                return (
                  <div
                    key={race.id}
                    className="rounded-lg border border-zinc-700 border-l-4 border-l-amber-500 bg-zinc-950 p-5 shadow-lg shadow-black/40"
                  >
                    {editingRaceId === race.id ? (
                      <div className="space-y-4">
                        <div>
                          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-yellow-400">
                            Edit Race
                          </p>
                          <h5 className="text-2xl font-black">
                            Edit {race.name}
                          </h5>
                        </div>

                        <div className="grid gap-3 md:grid-cols-3">
                          <input
                            value={editingRaceName}
                            onChange={(event) =>
                              setEditingRaceName(event.target.value)
                            }
                            placeholder="Race name"
                            className="rounded-md border border-white/10 bg-black/40 px-4 py-3 font-mono outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                          />
                          <input
                            type="date"
                            value={editingRaceDate}
                            onChange={(event) =>
                              setEditingRaceDate(event.target.value)
                            }
                            className="rounded-md border border-white/10 bg-black/40 px-4 py-3 font-mono outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                          />
                          <input
                            value={raceTrackSearch}
                            list="calendar-edit-track-options"
                            onChange={(event) => {
                              const value = event.target.value;
                              setRaceTrackSearch(value);
                              const match = findTrackBySearchValue(value);
                              setEditingRaceTrackId(match?.id || "");
                            }}
                            onKeyDown={(event) => {
                              if (event.key === "Escape") {
                                event.preventDefault();
                                resetRaceEditTrackSearch();
                              }
                            }}
                            placeholder="Search and select track"
                            className="rounded-md border border-white/10 bg-black/40 px-4 py-3 font-mono outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                          />
                          <datalist id="calendar-edit-track-options">
                            {filteredRaceTracks.map((track: IRacingTrack) => (
                              <option key={track.id} value={track.name} />
                            ))}
                            {filteredRaceTracks
                              .filter((track: IRacingTrack) =>
                                normalizeSearchText(track.name).includes(
                                  "nurburgring",
                                ),
                              )
                              .map((track: IRacingTrack) => (
                                <option
                                  key={`${track.id}-ascii`}
                                  value={track.name.replace(
                                    "Nürburgring",
                                    "Nurburgring",
                                  )}
                                />
                              ))}
                          </datalist>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => saveRaceEdit(race)}
                            className="rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 px-4 py-2 font-bold transition hover:from-green-500 hover:to-emerald-400"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingRaceId(null);
                              setEditingRaceName("");
                              setEditingRaceDate("");
                              setEditingRaceTrackId("");
                              setRaceTrackSearch("");
                            }}
                            className="rounded-2xl bg-zinc-700 px-4 py-2 font-bold transition hover:bg-zinc-600"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <h5 className="truncate text-2xl font-black">
                              {race.name}
                            </h5>
                            <p className="mt-1 text-sm text-zinc-400">
                              {raceTrackLabel(race)}
                            </p>
                          </div>
                          <span className="rounded-full border border-amber-900 bg-amber-950/60 px-3 py-1 text-xs font-bold text-amber-200">
                            {team?.name || "No Team"}
                          </span>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                              Date
                            </p>
                            <p className="mt-2 font-bold">
                              {race.race_date || "No date"}
                              {race.race_date && raceLengthHours(race) >= 24
                                ? ` - ${dateKey(raceEndDate(race) || new Date())}`
                                : ""}
                            </p>
                          </div>
                          <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                              Timer
                            </p>
                            <p className="mt-2 font-bold text-amber-200">
                              {getRaceTimer(race)}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <button
                            onClick={() => {
                              setSelectedRaceId(race.id);
                              setActiveRaceTab("Data");
                            }}
                            className="rounded-2xl bg-gradient-to-r from-amber-600 to-amber-600 px-4 py-2 font-bold transition hover:from-amber-500 hover:to-amber-500"
                          >
                            Open
                          </button>
                          <button
                            onClick={() => {
                              setEditingRaceId(race.id);
                              setEditingRaceName(race.name);
                              setEditingRaceDate(race.race_date || "");
                              setEditingRaceTrackId(race.track_id || "");
                              setRaceTrackSearch(
                                race.track_name ||
                                  trackNameFromMaster(race.track_id) ||
                                  "",
                              );
                            }}
                            className="rounded-2xl bg-yellow-600 px-4 py-2 font-bold text-black transition hover:bg-yellow-500"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              setDeleteConfirm({
                                title: `Delete ${race.name}?`,
                                onConfirm: () => deleteRace(race),
                              })
                            }
                            className="rounded-2xl bg-gradient-to-r from-red-600 to-red-500 px-4 py-2 font-bold transition hover:from-red-500 hover:to-rose-500"
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>,
    );
  }

  function getExportRace() {
    return (
      races.find((race: any) => race.id === exportRaceId) ||
      selectedRace ||
      null
    );
  }

  function scheduleRowsForRace(race: Race | null) {
    if (!race) return [];
    if (selectedRace && race.id === selectedRace.id)
      return scheduleRows.length ? scheduleRows : buildSchedule(race);
    return buildSchedule(race);
  }

  function csvEscape(value: any) {
    const textValue = String(value ?? "");
    if (/[",\n\r]/.test(textValue)) return `"${textValue.replace(/"/g, '""')}"`;
    return textValue;
  }

  function htmlEscape(value: any) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function currentScheduleRows() {
    const race = getExportRace();
    return scheduleRowsForRace(race);
  }

  function raceExportName(extension: string) {
    const race = getExportRace();
    const safeRace = (race?.name || "iracing-stint-schedule")
      .replace(/[^a-z0-9-_]+/gi, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .toLowerCase();
    return `${safeRace || "iracing-stint-schedule"}.${extension}`;
  }

  function scheduleExportRows() {
    const race = getExportRace();
    const rows = scheduleRowsForRace(race);
    const zones = [
      raceForm.main_time_zone,
      ...raceForm.extra_time_zones,
    ].filter(Boolean);

    return rows.map((row) => {
      const driver = selectedRaceMembers.find(
        (member: any) => member.user_id === row.driverId,
      );
      const base: Record<string, any> = {
        Stint: row.stint,
        Driver: profileName(driver?.profiles) || "",
        Weather: row.weather,
        "Sim Start": format12(row.simStart),
        "Sim End": format12(row.simEnd),
        "Add Time Seconds": row.addSeconds || "",
        "Actual End": row.actualEndTime || "",
        Complete: row.completed ? "Yes" : "No",
      };

      zones.forEach((zone: string) => {
        base[`${zone} Start`] = formatInZone(row.start, zone);
        base[`${zone} End`] = formatInZone(row.end, zone);
      });

      return base;
    });
  }

  function downloadScheduleCsv() {
    const race = getExportRace();
    if (!race) {
      setMessage("Choose a race before exporting.");
      return;
    }

    const rows = scheduleExportRows();
    if (rows.length === 0) {
      setMessage("No schedule rows to export. Calculate the race first.");
      return;
    }

    const columns = Object.keys(rows[0]);
    const csv = [
      columns.map(csvEscape).join(","),
      ...rows.map((row) =>
        columns.map((column) => csvEscape(row[column])).join(","),
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = raceExportName("csv");
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
    setMessage("Schedule CSV exported.");
  }

  function openPrintableSchedule() {
    const race = getExportRace();
    if (!race) {
      setMessage("Choose a race before exporting.");
      return;
    }

    const rows = currentScheduleRows();
    if (rows.length === 0) {
      setMessage("No schedule rows to print. Calculate the race first.");
      return;
    }

    const zones = [
      raceForm.main_time_zone || race.main_time_zone || "America/New_York",
      ...(raceForm.extra_time_zones?.length
        ? raceForm.extra_time_zones
        : Array.isArray(race.extra_time_zones)
          ? race.extra_time_zones
          : []),
    ]
      .filter(Boolean)
      .filter((zone: string, index: number, list: string[]) => list.indexOf(zone) === index);

    const teamName = race.team_id
      ? getTeamById(teams, race.team_id)?.name || "Unknown Team"
      : "No Team";
    const carName =
      selectedRaceCars.find(
        (car: any) =>
          car.id === (race.selected_car_id || raceForm.selected_car_id),
      )?.name || "No car selected";
    const selectedCar = selectedRaceCars.find(
      (car: any) => car.id === (race.selected_car_id || raceForm.selected_car_id),
    );
    const trackName =
      race.track_name ||
      iracingTracks.find((track: IRacingTrack) => track.id === race.track_id)
        ?.name ||
      "No track selected";
    const completedCount = rows.filter((row) => row.completed).length;
    const warningRows = rows.filter((row) => row.warning);
    const raceLength = toNumber(race.race_length_hours, 24);
    const primaryZone = zones[0] || "America/New_York";
    const startDate = race.race_date ? new Date(`${race.race_date}T00:00:00`) : null;
    const endDate = startDate ? new Date(startDate.getTime() + raceLength * 3600000) : null;

    const zoneHeaderPairs = zones
      .map(
        (zone: string) =>
          `<th colspan="2" class="zone-group">${htmlEscape(shortTimeZoneLabel(zone))}<span>${htmlEscape(zone)}</span></th>`,
      )
      .join("");
    const zoneSubHeaders = zones
      .map(() => `<th>Start</th><th>End</th>`)
      .join("");

    const htmlRows = rows
      .map((row) => {
        const driver = selectedRaceMembers.find(
          (member: any) => member.user_id === row.driverId,
        );
        const zoneCells = zones
          .map(
            (zone: string) =>
              `<td>${htmlEscape(formatInZone(row.start, zone))}</td><td>${htmlEscape(formatInZone(row.end, zone))}</td>`,
          )
          .join("");
        const rowClass = row.warning ? " class=\"warning-row\"" : "";

        return `
        <tr${rowClass}>
          <td class="num">${row.stint}</td>
          <td class="driver">${htmlEscape(profileName(driver?.profiles) || "")}</td>
          <td>${htmlEscape(row.weather)}</td>
          ${zoneCells}
          <td>${htmlEscape(format12(row.simStart))}</td>
          <td>${htmlEscape(format12(row.simEnd))}</td>
          <td>${row.addSeconds ? htmlEscape(formatPlainTime(row.addSeconds)) : ""}</td>
          <td>${htmlEscape(row.actualEndTime || "")}</td>
          <td>${row.completed ? "Complete" : ""}</td>
          <td>${htmlEscape(row.warning || "")}</td>
        </tr>`;
      })
      .join("");

    const warningHtml = warningRows.length
      ? `<div class="warnings"><h2>Active Warnings</h2>${warningRows
          .map(
            (row) =>
              `<div class="warning"><strong>Stint ${row.stint}</strong> — ${htmlEscape(row.warning || "")}</div>`,
          )
          .join("")}</div>`
      : `<div class="no-warnings">No active schedule warnings.</div>`;

    const printable = `
      <!doctype html>
      <html>
        <head>
          <title>${htmlEscape(race.name)} Schedule</title>
          <style>
            * { box-sizing: border-box; }
            body { font-family: Arial, sans-serif; margin: 28px; color: #111827; background: #f8fafc; }
            .toolbar { margin-bottom: 18px; display: flex; gap: 10px; }
            button { border: 0; border-radius: 10px; padding: 10px 14px; font-weight: 800; background: #2563eb; color: white; cursor: pointer; }
            .sheet { background: white; border: 1px solid #d1d5db; border-radius: 18px; padding: 22px; box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08); }
            .top { display: flex; justify-content: space-between; gap: 18px; border-bottom: 3px solid #111827; padding-bottom: 14px; }
            h1 { margin: 0; font-size: 30px; line-height: 1.05; letter-spacing: -0.03em; }
            .subtitle { margin-top: 7px; color: #4b5563; font-size: 13px; }
            .stamp { text-align: right; color: #374151; font-size: 12px; }
            .meta { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; margin: 18px 0; }
            .box { border: 1px solid #d1d5db; border-radius: 12px; padding: 10px 11px; background: #f9fafb; min-height: 58px; }
            .label { font-size: 9px; text-transform: uppercase; letter-spacing: 1.4px; color: #6b7280; font-weight: 800; }
            .value { margin-top: 5px; font-weight: 800; font-size: 13px; overflow-wrap: anywhere; }
            .warnings, .no-warnings { margin: 14px 0 18px; border-radius: 12px; padding: 12px; }
            .warnings { border: 1px solid #f59e0b; background: #fffbeb; }
            .warnings h2 { margin: 0 0 8px; font-size: 15px; }
            .warning { font-size: 12px; margin-top: 5px; }
            .no-warnings { border: 1px solid #16a34a; background: #f0fdf4; font-weight: 800; color: #166534; }
            .table-wrap { overflow-x: auto; }
            table { width: 100%; border-collapse: collapse; font-size: 10.5px; background: white; }
            th, td { border: 1px solid #cbd5e1; padding: 6px 7px; text-align: left; white-space: nowrap; vertical-align: middle; }
            th { background: #111827; color: white; font-weight: 800; }
            th.zone-group { text-align: center; background: #1f2937; }
            th.zone-group span { display: block; margin-top: 2px; font-size: 8px; color: #cbd5e1; font-weight: 600; }
            thead tr:nth-child(2) th { background: #374151; }
            td.num { text-align: center; font-weight: 800; }
            td.driver { font-weight: 800; }
            tbody tr:nth-child(even) { background: #f8fafc; }
            tbody tr.warning-row { background: #fff7ed; }
            .footer { margin-top: 14px; display: flex; justify-content: space-between; gap: 12px; color: #6b7280; font-size: 10px; }
            @page { size: landscape; margin: 10mm; }
            @media print {
              body { margin: 0; background: white; }
              .toolbar { display: none; }
              .sheet { border: 0; border-radius: 0; padding: 0; box-shadow: none; }
              .meta { grid-template-columns: repeat(4, minmax(0, 1fr)); }
              table { font-size: 8.5px; }
              th, td { padding: 4px 5px; }
            }
          </style>
        </head>
        <body>
          <div class="toolbar">
            <button onclick="window.print()">Print / Save as PDF</button>
          </div>
          <main class="sheet">
            <div class="top">
              <div>
                <h1>${htmlEscape(race.name)} Stint Schedule</h1>
                <div class="subtitle">${htmlEscape(trackName)} · ${htmlEscape(teamName)} · ${htmlEscape(carName)}</div>
              </div>
              <div class="stamp">
                <strong>Generated</strong><br />${htmlEscape(new Date().toLocaleString())}
              </div>
            </div>
            <div class="meta">
              <div class="box"><div class="label">Race Date</div><div class="value">${htmlEscape(race.race_date || "—")}</div></div>
              <div class="box"><div class="label">Race Length</div><div class="value">${htmlEscape(raceLength ? `${raceLength} hr` : "—")}</div></div>
              <div class="box"><div class="label">Real Start</div><div class="value">${htmlEscape(startDate ? `${formatInZone(startDate, primaryZone)} ${shortTimeZoneLabel(primaryZone)}` : "—")}</div></div>
              <div class="box"><div class="label">Projected End</div><div class="value">${htmlEscape(endDate ? `${formatInZone(endDate, primaryZone)} ${shortTimeZoneLabel(primaryZone)}` : "—")}</div></div>
              <div class="box"><div class="label">Track</div><div class="value">${htmlEscape(trackName)}</div></div>
              <div class="box"><div class="label">Car</div><div class="value">${htmlEscape(carName)}${selectedCar?.fuel_tank ? ` · ${htmlEscape(selectedCar.fuel_tank)} L` : ""}</div></div>
              <div class="box"><div class="label">Rows</div><div class="value">${rows.length}</div></div>
              <div class="box"><div class="label">Complete / Warnings</div><div class="value">${completedCount} complete · ${warningRows.length} warnings</div></div>
            </div>
            ${warningHtml}
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th rowspan="2">Stint</th>
                    <th rowspan="2">Driver</th>
                    <th rowspan="2">Weather</th>
                    ${zoneHeaderPairs}
                    <th colspan="2" class="zone-group">Sim Time</th>
                    <th rowspan="2">Add Time</th>
                    <th rowspan="2">Actual End</th>
                    <th rowspan="2">Status</th>
                    <th rowspan="2">Warning</th>
                  </tr>
                  <tr>
                    ${zoneSubHeaders}
                    <th>Start</th>
                    <th>End</th>
                  </tr>
                </thead>
                <tbody>${htmlRows}</tbody>
              </table>
            </div>
            <div class="footer">
              <span>Times are based on saved Race Data time zones and schedule adjustments.</span>
              <span>StintSync</span>
            </div>
          </main>
        </body>
      </html>
    `;

    const win = window.open("", "_blank");
    if (!win) {
      setMessage("Popup blocked. Allow popups to open the printable schedule.");
      return;
    }

    win.document.open();
    win.document.write(printable);
    win.document.close();
    setMessage("Printable schedule opened. Use Print / Save as PDF.");
  }

  function exportsPage() {
    const chosenRace = getExportRace();
    const rows = scheduleRowsForRace(chosenRace);
    const selectedCar = selectedRaceCars.find(
      (car: any) => car.id === (chosenRace?.selected_car_id || raceForm.selected_car_id),
    );
    const selectedCarName = selectedCar?.name || "No car selected";
    const teamName = chosenRace?.team_id
      ? getTeamById(teams, chosenRace.team_id)?.name || "Unknown Team"
      : "No Team Yet";
    const trackName =
      chosenRace?.track_name ||
      iracingTracks.find(
        (track: IRacingTrack) => track.id === chosenRace?.track_id,
      )?.name ||
      "No track selected";
    const exportZones = chosenRace
      ? [
          raceForm.main_time_zone || chosenRace.main_time_zone || "America/New_York",
          ...(raceForm.extra_time_zones?.length
            ? raceForm.extra_time_zones
            : Array.isArray(chosenRace.extra_time_zones)
              ? chosenRace.extra_time_zones
              : []),
        ]
          .filter(Boolean)
          .filter((zone: string, index: number, list: string[]) => list.indexOf(zone) === index)
      : [];
    const completedCount = rows.filter((row) => row.completed).length;
    const warningRows = rows.filter((row) => row.warning);
    const previewRows = rows.slice(0, 8);

    return appShell(
      <div className="mx-auto max-w-7xl space-y-6">
        {pageHero(
          "Exports",
          "Exports",
          "Create a clean race packet: CSV for spreadsheets or a polished print/PDF schedule for sharing with the team.",
        )}

        <section className="rounded-lg border border-white/10 border-l-4 border-l-amber-500 bg-zinc-900 p-6 shadow-lg shadow-black/40">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0 flex-1">
              <p className={sectionHeaderLabel}>Race Export</p>
              <h3 className="mt-2 text-2xl font-black">Choose the race packet</h3>
              <p className="mt-1 text-sm text-zinc-400">
                Pick a saved race, confirm the summary, then export the schedule.
              </p>
              <select
                value={chosenRace?.id || ""}
                onChange={(event) => setExportRaceId(event.target.value)}
                className="mt-4 w-full rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3 font-bold outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20"
              >
                <option value="" className="bg-zinc-950 text-white">
                  Choose a race
                </option>
                {races.map((race: any) => (
                  <option
                    key={race.id}
                    value={race.id}
                    className="bg-zinc-950 text-white"
                  >
                    {race.name} · {race.race_date || "No date"} ·{" "}
                    {race.track_name || "No track"}
                  </option>
                ))}
              </select>
            </div>

            {chosenRace ? (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setSelectedRaceId(chosenRace.id);
                    setActiveRaceTab("Schedule");
                  }}
                  className="rounded-md border border-zinc-600 bg-zinc-800 px-5 py-3 font-bold uppercase tracking-wide text-zinc-200 transition hover:bg-zinc-700"
                >
                  Open Schedule
                </button>
                <button
                  onClick={downloadScheduleCsv}
                  className="rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 px-5 py-3 font-bold transition hover:from-green-500 hover:to-emerald-400"
                >
                  Export CSV
                </button>
                <button
                  onClick={openPrintableSchedule}
                  className="rounded-md bg-gradient-to-r from-amber-500 to-amber-400 px-5 py-3 font-black uppercase tracking-wide text-zinc-950 transition hover:from-amber-400 hover:to-amber-300"
                >
                  Print / PDF
                </button>
              </div>
            ) : null}
          </div>
        </section>

        {!chosenRace ? (
          <section className="rounded-lg border border-dashed border-zinc-600 bg-zinc-900 p-10 text-center shadow-2xl shadow-black/25">
            <h3 className="text-2xl font-black">Choose a race first.</h3>
            <p className="mt-2 text-zinc-400">
              Pick the race you want to export using the dropdown above.
            </p>
          </section>
        ) : (
          <>
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {[
                ["Race", chosenRace.name || "—"],
                ["Team", teamName],
                ["Car", selectedCar?.fuel_tank ? `${selectedCarName} · ${selectedCar.fuel_tank} L` : selectedCarName],
                ["Track", trackName],
                ["Date", chosenRace.race_date || "—"],
                ["Time Zones", exportZones.map(shortTimeZoneLabel).join(" / ") || "—"],
                ["Schedule", `${rows.length} stints · ${completedCount} complete`],
                ["Warnings", warningRows.length ? `${warningRows.length} active` : "None"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-[1.35rem] border border-white/10 bg-zinc-900/70 p-5 shadow-lg shadow-black/20"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                    {label}
                  </p>
                  <p className="mt-2 font-black text-zinc-100">{value}</p>
                </div>
              ))}
            </section>

            <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
              <div className="rounded-lg border border-white/10 bg-zinc-900/70 p-6 shadow-2xl shadow-black/25">
                <h3 className="text-2xl font-black">Export Options</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  CSV is for Google Sheets/Excel. Print/PDF opens a clean race packet in a new browser tab.
                </p>

                <div className="mt-5 grid gap-4">
                  <button
                    onClick={downloadScheduleCsv}
                    className="rounded-[1.35rem] border border-green-800 bg-green-950/40 p-5 text-left transition hover:bg-green-900/50"
                  >
                    <p className="text-xl font-black text-green-200">Export CSV</p>
                    <p className="mt-2 text-sm leading-6 text-zinc-400">
                      Downloads stints, drivers, weather, every selected time zone, sim time, added time, actual end, completion, and warnings.
                    </p>
                  </button>

                  <button
                    onClick={openPrintableSchedule}
                    className="rounded-[1.35rem] border border-amber-800 bg-amber-950/40 p-5 text-left transition hover:bg-amber-900/50"
                  >
                    <p className="text-xl font-black text-amber-200">Print / Save as PDF</p>
                    <p className="mt-2 text-sm leading-6 text-zinc-400">
                      Opens a polished schedule page with race summary, warning summary, time-zone grouped columns, and a print-friendly layout.
                    </p>
                  </button>
                </div>
              </div>

              <div className="rounded-lg border border-white/10 bg-zinc-900/70 p-6 shadow-2xl shadow-black/25">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-2xl font-black">Schedule Preview</h3>
                    <p className="mt-1 text-sm text-zinc-400">
                      First {Math.min(previewRows.length, 8)} rows shown. Full export includes all {rows.length} rows.
                    </p>
                  </div>
                  {warningRows.length ? (
                    <span className="rounded-full border border-yellow-700 bg-yellow-950/60 px-3 py-1 text-xs font-black text-yellow-100">
                      {warningRows.length} warning{warningRows.length === 1 ? "" : "s"}
                    </span>
                  ) : (
                    <span className="rounded-full border border-green-700 bg-green-950/60 px-3 py-1 text-xs font-black text-green-100">
                      No warnings
                    </span>
                  )}
                </div>

                <div className="mt-5 overflow-x-auto rounded-2xl border border-zinc-700">
                  <table className="min-w-full text-sm">
                    <thead className="bg-black/70 text-zinc-200">
                      <tr>
                        <th className="px-3 py-3 text-left">Stint</th>
                        <th className="px-3 py-3 text-left">Driver</th>
                        <th className="px-3 py-3 text-left">Weather</th>
                        <th className="px-3 py-3 text-left">Start</th>
                        <th className="px-3 py-3 text-left">End</th>
                        <th className="px-3 py-3 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {previewRows.map((row) => {
                        const driver = selectedRaceMembers.find(
                          (member: any) => member.user_id === row.driverId,
                        );
                        const primaryZone = exportZones[0] || "America/New_York";
                        return (
                          <tr
                            key={row.stint}
                            className={`border-t border-zinc-800 ${row.warning ? "bg-yellow-950/20" : "bg-black/20"}`}
                          >
                            <td className="px-3 py-3 font-black">#{row.stint}</td>
                            <td className="px-3 py-3">{profileName(driver?.profiles) || "—"}</td>
                            <td className="px-3 py-3">{row.weather}</td>
                            <td className="px-3 py-3">{formatInZone(row.start, primaryZone)}</td>
                            <td className="px-3 py-3">{formatInZone(row.end, primaryZone)}</td>
                            <td className="px-3 py-3">
                              {row.warning ? "Warning" : row.completed ? "Complete" : "Planned"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </>
        )}
      </div>,
    );
  }

  function saveTemplates(nextTemplates: RaceTemplate[]) {
    setRaceTemplates(nextTemplates);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        "iracing-stint-planner-templates",
        JSON.stringify(nextTemplates),
      );
    }
  }

  function saveAppSettings() {
    if (!isPositiveNumberString(appDefaultRaceLength)) {
      setMessage(
        "Default race length must be a positive number. Example: 12 or 24.",
      );
      return;
    }

    const settings = {
      defaultTimeZone: appDefaultTimeZone,
      defaultRaceLength: appDefaultRaceLength,
      defaultStartTime: appDefaultStartTime,
    };

    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        "iracing-stint-planner-settings",
        JSON.stringify(settings),
      );
    }

    setMessage("Settings saved on this device.");
    markSaveSaved("settings");
  }

  function saveTemplateFromForm() {
    if (!templateForm.name.trim()) {
      setMessage("Enter a template name before saving.");
      return;
    }

    if (
      templateForm.race_length_hours &&
      toNumber(templateForm.race_length_hours, 0) <= 0
    ) {
      setMessage("Race length must be a positive number, or leave it blank.");
      return;
    }

    if (templateForm.race_start_sim && !templateForm.race_start_real) {
      setMessage(
        "If you set a sim start time, also set a real start time or leave both blank.",
      );
      return;
    }

    const track = templateForm.track_id
      ? iracingTracks.find(
          (item: IRacingTrack) => item.id === templateForm.track_id,
        )
      : null;

    const template: RaceTemplate = {
      id: editingTemplateId || `template-${Date.now()}`,
      name: templateForm.name.trim(),
      race_length_hours: templateForm.race_length_hours || "",
      race_start_real: templateForm.race_start_real || "",
      race_start_sim: templateForm.race_start_sim || "",
      main_time_zone: templateForm.main_time_zone || "",
      extra_time_zones: templateForm.extra_time_zones || [],
      track_id: templateForm.track_id || "",
      track_name: track?.name || "",
      team_id: templateForm.team_id || "",
      selected_car_id: templateForm.selected_car_id || "",
      created_at: editingTemplateId
        ? raceTemplates.find((item) => item.id === editingTemplateId)
            ?.created_at || new Date().toISOString()
        : new Date().toISOString(),
    };

    if (editingTemplateId) {
      saveTemplates(
        raceTemplates.map((item) =>
          item.id === editingTemplateId ? template : item,
        ),
      );
      setMessage(`Template "${template.name}" updated.`);
    } else {
      saveTemplates([template, ...raceTemplates]);
      setMessage(`Template "${template.name}" saved.`);
    }

    cancelTemplateEdit();
    markSaveSavedAfterFormReset("template");
  }

  function editTemplate(template: RaceTemplate) {
    setEditingTemplateId(template.id);
    setTemplateForm({
      name: template.name || "",
      race_length_hours: template.race_length_hours || "",
      race_start_real: template.race_start_real || "",
      race_start_sim: template.race_start_sim || "",
      main_time_zone: template.main_time_zone || "",
      extra_time_zone: "America/Los_Angeles",
      extra_time_zones: template.extra_time_zones || [],
      track_id: template.track_id || "",
      team_id: template.team_id || "",
      selected_car_id: template.selected_car_id || "",
    });
    setMessage("Editing template.");
  }

  function cancelTemplateEdit() {
    setEditingTemplateId(null);
    setTemplateForm({
      name: "",
      race_length_hours: "",
      race_start_real: "",
      race_start_sim: "",
      main_time_zone: "",
      extra_time_zone: "America/Los_Angeles",
      extra_time_zones: [],
      track_id: "",
      team_id: "",
      selected_car_id: "",
    });
  }

  function createTemplateFromRace(race: Race) {
    const teamCars = race.team_id
      ? cars.filter((car: any) => car.team_id === race.team_id)
      : [];
    const template: RaceTemplate = {
      id: `template-${Date.now()}`,
      name: `${race.name} Template`,
      race_length_hours: String(
        race.race_length_hours || appDefaultRaceLength || "24",
      ),
      race_start_real: race.race_start_real || appDefaultStartTime || "08:00",
      race_start_sim: race.race_start_sim || race.race_start_real || "08:00",
      main_time_zone:
        race.main_time_zone || appDefaultTimeZone || "America/New_York",
      extra_time_zones: Array.isArray(race.extra_time_zones)
        ? race.extra_time_zones
        : [],
      track_id: race.track_id || "",
      track_name: race.track_name || "",
      team_id: race.team_id || "",
      selected_car_id: race.selected_car_id || teamCars[0]?.id || "",
      created_at: new Date().toISOString(),
    };

    saveTemplates([template, ...raceTemplates]);
    setMessage("Template created from race.");
  }

  async function createRaceFromTemplate(template: RaceTemplate) {
    if (!userId) return;

    if (!templateRaceDate) {
      setMessage("Choose a date before creating a race from a template.");
      return;
    }

    if (
      !template.race_length_hours &&
      !isPositiveNumberString(appDefaultRaceLength)
    ) {
      setMessage(
        "Default race length in Settings must be a positive number before using a template with blank race length.",
      );
      return;
    }

    if (
      template.race_length_hours &&
      !isPositiveNumberString(template.race_length_hours)
    ) {
      setMessage(
        "This template has an invalid race length. Edit the template and enter a positive number or leave it blank.",
      );
      return;
    }

    const track = template.track_id
      ? iracingTracks.find(
          (item: IRacingTrack) => item.id === template.track_id,
        )
      : null;

    const { data, error } = await supabase
      .from("races")
      .insert({
        name: `${template.name} Race`,
        race_date: templateRaceDate,
        team_id: template.team_id || null,
        track_id: template.track_id || null,
        track_name: track?.name || template.track_name || null,
        track_image_url: track?.image_url || null,
        created_by: userId,
        race_start_real:
          template.race_start_real || appDefaultStartTime || "08:00",
        race_start_sim:
          template.race_start_sim ||
          template.race_start_real ||
          appDefaultStartTime ||
          "08:00",
        main_time_zone:
          template.main_time_zone || appDefaultTimeZone || "America/New_York",
        extra_time_zones: template.extra_time_zones || [],
        race_length_hours: toNumber(
          template.race_length_hours || appDefaultRaceLength,
          24,
        ),
        selected_car_id: template.selected_car_id || null,
      })
      .select()
      .single();

    if (error) {
      setMessage(error.message);
      return;
    }

    await loadRaces();
    setSelectedRaceId(data.id);
    setActiveRaceTab("Data");
    setMessage(
      `Race created from "${template.name}". You can change race name, date, track, and setup in Race Data.`,
    );
  }

  function deleteTemplate(templateId: string) {
    const template = raceTemplates.find((item) => item.id === templateId);
    saveTemplates(raceTemplates.filter((item) => item.id !== templateId));
    if (editingTemplateId === templateId) cancelTemplateEdit();
    setMessage(`Template "${template?.name || "Untitled"}" deleted.`);
  }

  function duplicateTemplate(template: RaceTemplate) {
    const copy: RaceTemplate = {
      ...template,
      id: `template-${Date.now()}`,
      name: `${template.name} Copy`,
      created_at: new Date().toISOString(),
    };

    saveTemplates([copy, ...raceTemplates]);
    setMessage(`Template "${copy.name}" created.`);
  }

  function templatesPage() {
    const selectedTemplateTeamCars = templateForm.team_id
      ? cars.filter((car: any) => car.team_id === templateForm.team_id)
      : [];
    const currentRace = getExportRace() || selectedRace;

    return appShell(
      <div className="mx-auto max-w-7xl space-y-6">
        {pageHero(
          "Templates",
          "Templates",
          "Create reusable race presets for special events, leagues, and endurance formats.",
        )}

        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-lg border border-white/10 border-l-4 border-l-amber-500 bg-zinc-900 p-6 shadow-lg shadow-black/40">
            <h3 className="text-2xl font-bold">
              {editingTemplateId ? "Edit Template" : "Create Template"}
            </h3>
            <p className="mt-1 text-sm text-zinc-400">
              Only the template name is required. Leave anything blank if each
              event using this template will be different.
            </p>

            <div className="mt-5 grid gap-4">
              <input
                value={templateForm.name}
                onChange={(event) =>
                  setTemplateForm((prev: any) => ({
                    ...prev,
                    name: event.target.value,
                  }))
                }
                placeholder="Template name, example: 24H Endurance"
                className="rounded-md border border-white/10 bg-black/40 px-4 py-3 font-mono outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              />

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-zinc-300">
                    Race length
                  </span>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={templateForm.race_length_hours}
                    onChange={(event) =>
                      setTemplateForm((prev: any) => ({
                        ...prev,
                        race_length_hours: event.target.value,
                      }))
                    }
                    placeholder="Optional, example: 24"
                    className="w-full rounded-md border border-white/10 bg-black/40 px-4 py-3 font-mono outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-semibold text-zinc-300">
                    Main time zone
                  </span>
                  <select
                    value={templateForm.main_time_zone}
                    onChange={(event) =>
                      setTemplateForm((prev: any) => ({
                        ...prev,
                        main_time_zone: event.target.value,
                      }))
                    }
                    className="w-full rounded-md border border-white/10 bg-black/40 px-4 py-3 font-mono outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  >
                    <option value="" className="bg-zinc-950 text-white">
                      Optional / use default
                    </option>
                    {timeZoneOptions.map((zone) => (
                      <option
                        key={zone}
                        value={zone}
                        className="bg-zinc-950 text-white"
                      >
                        {zone}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-semibold text-zinc-300">
                    Real start
                  </span>
                  <input
                    type="time"
                    value={templateForm.race_start_real}
                    onChange={(event) =>
                      setTemplateForm((prev: any) => ({
                        ...prev,
                        race_start_real: event.target.value,
                      }))
                    }
                    className="w-full rounded-md border border-white/10 bg-black/40 px-4 py-3 font-mono outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-semibold text-zinc-300">
                    Sim start
                  </span>
                  <input
                    type="time"
                    value={templateForm.race_start_sim}
                    onChange={(event) =>
                      setTemplateForm((prev: any) => ({
                        ...prev,
                        race_start_sim: event.target.value,
                      }))
                    }
                    className="w-full rounded-md border border-white/10 bg-black/40 px-4 py-3 font-mono outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-semibold text-zinc-300">
                    Team
                  </span>
                  <select
                    value={templateForm.team_id}
                    onChange={(event) =>
                      setTemplateForm((prev: any) => ({
                        ...prev,
                        team_id: event.target.value,
                        selected_car_id: "",
                      }))
                    }
                    className="w-full rounded-md border border-white/10 bg-black/40 px-4 py-3 font-mono outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  >
                    <option value="" className="bg-zinc-950 text-white">
                      No default team
                    </option>
                    {teams.map((team: any) => (
                      <option
                        key={team.id}
                        value={team.id}
                        className="bg-zinc-950 text-white"
                      >
                        {team.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-semibold text-zinc-300">
                    Default car
                  </span>
                  <select
                    value={templateForm.selected_car_id}
                    onChange={(event) =>
                      setTemplateForm((prev: any) => ({
                        ...prev,
                        selected_car_id: event.target.value,
                      }))
                    }
                    className="w-full rounded-md border border-white/10 bg-black/40 px-4 py-3 font-mono outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  >
                    <option value="" className="bg-zinc-950 text-white">
                      No default car
                    </option>
                    {selectedTemplateTeamCars.map((car: any) => (
                      <option
                        key={car.id}
                        value={car.id}
                        className="bg-zinc-950 text-white"
                      >
                        {car.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-zinc-300">
                  Track
                </span>
                <select
                  value={templateForm.track_id}
                  onChange={(event) =>
                    setTemplateForm((prev: any) => ({
                      ...prev,
                      track_id: event.target.value,
                    }))
                  }
                  className="w-full rounded-md border border-white/10 bg-black/40 px-4 py-3 font-mono outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                >
                  <option value="" className="bg-zinc-950 text-white">
                    Optional / choose track later
                  </option>
                  {iracingTracks.map((track: IRacingTrack) => (
                    <option
                      key={track.id}
                      value={track.id}
                      className="bg-zinc-950 text-white"
                    >
                      {track.name}
                    </option>
                  ))}
                </select>
              </label>

              <div className="rounded-2xl border border-amber-900 bg-amber-950/25 p-4 text-sm leading-6 text-amber-100">
                <p className="font-bold">Template rule:</p>
                <p>
                  Blank fields are allowed. When you create a race from a
                  template, blank fields use Settings defaults or can be changed
                  later in Race Data.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={saveTemplateFromForm}
                  className="rounded-md bg-gradient-to-r from-amber-500 to-amber-400 px-5 py-3 font-black uppercase tracking-wide text-zinc-950 transition hover:from-amber-400 hover:to-amber-300"
                >
                  {saveButtonLabel(
                    "template",
                    editingTemplateId ? "Update Template" : "Save Template",
                    "Saved",
                  )}
                </button>
                {editingTemplateId ? (
                  <button
                    onClick={cancelTemplateEdit}
                    className="rounded-md border border-zinc-600 bg-zinc-800 px-5 py-3 font-bold uppercase tracking-wide text-zinc-200 transition hover:bg-zinc-700"
                  >
                    Cancel Edit
                  </button>
                ) : null}
              </div>

              {currentRace ? (
                <button
                  onClick={() => createTemplateFromRace(currentRace)}
                  className="rounded-md border border-zinc-600 bg-zinc-800 px-5 py-3 font-bold uppercase tracking-wide text-zinc-200 transition hover:bg-zinc-700"
                >
                  Create Template From Selected Race
                </button>
              ) : null}
            </div>
          </section>

          <section className="rounded-lg border border-white/10 border-l-4 border-l-amber-500 bg-zinc-900 p-6 shadow-lg shadow-black/40">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="text-2xl font-bold">Saved Templates</h3>
                <p className="text-sm text-zinc-400">
                  Create a new race from a saved preset. Blank template fields
                  use your Settings defaults or can be filled in later in Race
                  Data.
                </p>
              </div>

              <label className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
                  New race date
                </span>
                <input
                  type="date"
                  value={templateRaceDate}
                  onChange={(event) => setTemplateRaceDate(event.target.value)}
                  className="rounded-md border border-white/10 bg-black/40 px-4 py-3 font-mono outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                />
              </label>
            </div>

            {raceTemplates.length === 0 ? (
              <div className="rounded-lg border border-dashed border-zinc-700 bg-zinc-950/60 p-10 text-center">
                <p className="text-lg font-semibold">No templates saved yet.</p>
                <p className="mt-2 text-sm text-zinc-500">
                  Create one from the form or from a selected race.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {raceTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="rounded-lg border border-zinc-700 border-l-4 border-l-amber-500 bg-zinc-950 p-5 shadow-lg shadow-black/40"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h4 className="text-2xl font-black">{template.name}</h4>
                        <p className="mt-1 text-sm text-zinc-500">
                          {template.race_length_hours
                            ? `${template.race_length_hours}h`
                            : "Length later"}{" "}
                          · {template.track_name || "Track later"} ·{" "}
                          {template.main_time_zone || "Default time zone"}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => createRaceFromTemplate(template)}
                          className="rounded-2xl bg-gradient-to-r from-amber-600 to-amber-600 px-4 py-2 font-bold transition hover:from-amber-500 hover:to-amber-500"
                        >
                          Create Race
                        </button>
                        <button
                          onClick={() => editTemplate(template)}
                          className="rounded-2xl bg-yellow-600 px-4 py-2 font-bold text-black transition hover:bg-yellow-500"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => duplicateTemplate(template)}
                          className="rounded-2xl bg-zinc-700 px-4 py-2 font-bold transition hover:bg-zinc-600"
                        >
                          Duplicate
                        </button>
                        <button
                          onClick={() =>
                            setDeleteConfirm({
                              title: `Delete template "${template.name}"?`,
                              onConfirm: () => deleteTemplate(template.id),
                            })
                          }
                          className="rounded-2xl bg-gradient-to-r from-red-600 to-red-500 px-4 py-2 font-bold transition hover:from-red-500 hover:to-rose-500"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3 md:grid-cols-3">
                      {[
                        ["Real Start", template.race_start_real || "Default"],
                        ["Sim Start", template.race_start_sim || "Default"],
                        [
                          "Team",
                          getTeamById(teams, template.team_id)?.name ||
                            "Choose later",
                        ],
                        [
                          "Car",
                          cars.find(
                            (car: any) => car.id === template.selected_car_id,
                          )?.name || "Choose later",
                        ],
                        [
                          "Extra Zones",
                          template.extra_time_zones?.length
                            ? `${template.extra_time_zones.length} saved`
                            : "None",
                        ],
                        [
                          "Created",
                          template.created_at
                            ? new Date(template.created_at).toLocaleDateString()
                            : "Unknown",
                        ],
                      ].map(([label, value]) => (
                        <div
                          key={label}
                          className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4"
                        >
                          <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                            {label}
                          </p>
                          <p className="mt-2 font-bold text-zinc-100">
                            {value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>,
    );
  }

  function settingsPage() {
    const isAdmin = appAdmins.some((admin: any) => admin.user_id === userId);
    const pendingRequests = addRequests.filter(
      (request: any) => (request.status || "pending") === "pending",
    ).length;
    const totalMembers = Object.values(teamMembersByTeam).reduce(
      (total: number, members: any) => total + (members?.length || 0),
      0,
    );
    const routeContext = selectedRace
      ? `Race: ${selectedRace.name} / Tab: ${activeRaceTab}`
      : selectedTeamViewId
        ? `Team: ${getTeamById(teams, selectedTeamViewId)?.name || selectedTeamViewId}`
        : `Page: ${activePage}`;
    const supportInfo = [
      `User: ${userProfile?.display_name || userProfile?.username || "Unknown"}`,
      `User ID: ${userId || "Not signed in"}`,
      `Support Email: ${SUPPORT_EMAIL}`,
      `Context: ${routeContext}`,
      `URL: ${typeof window !== "undefined" ? window.location.href : ""}`,
    ].join("\n");

    return appShell(
      <div className="mx-auto max-w-7xl space-y-6">
        {pageHero(
          "Settings",
          "Settings & Support",
          "Refresh cloud data, copy account info, save defaults, and manage local templates.",
        )}

        <section className="rounded-lg border border-white/10 border-l-4 border-l-amber-500 bg-zinc-900 p-6 shadow-lg shadow-black/40">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-amber-400">
                Settings Tools
              </p>
              <h3 className="text-3xl font-black">
                Account, refresh, and support tools
              </h3>
              <p className="mt-2 text-sm text-zinc-400">
                Pull the latest data from the cloud, or grab your account
                info to send to support.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => refreshAll(true)}
                className="rounded-md bg-gradient-to-r from-amber-500 to-amber-400 px-5 py-3 font-black uppercase tracking-wide text-zinc-950 transition hover:from-amber-400 hover:to-amber-300"
              >
                Refresh Cloud Data
              </button>
              <button
                onClick={() => {
                  if (!userId) {
                    setMessage(
                      "No user ID to copy because you are not signed in.",
                    );
                    return;
                  }

                  navigator.clipboard?.writeText(userId);
                  setMessage("User ID copied to clipboard.");
                }}
                className="rounded-md border border-zinc-600 bg-zinc-800 px-5 py-3 font-bold uppercase tracking-wide text-zinc-200 transition hover:bg-zinc-700"
              >
                Copy User ID
              </button>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(supportInfo);
                  setMessage("Support info copied to clipboard.");
                }}
                className="rounded-md border border-zinc-600 bg-zinc-800 px-5 py-3 font-bold uppercase tracking-wide text-zinc-200 transition hover:bg-zinc-700"
              >
                Copy Support Info
              </button>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <section className="rounded-lg border border-white/10 border-l-4 border-l-amber-500 bg-zinc-900 p-6 shadow-lg shadow-black/40">
            <h3 className="text-2xl font-bold">Default Race Settings</h3>
            <p className="mt-1 text-sm text-zinc-400">
              These are saved locally on this device and used for templates.
            </p>

            <div className="mt-5 grid gap-4">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-zinc-300">
                  Default time zone
                </span>
                <select
                  value={appDefaultTimeZone}
                  onChange={(event) =>
                    setAppDefaultTimeZone(event.target.value)
                  }
                  className="w-full rounded-md border border-white/10 bg-black/40 px-4 py-3 font-mono outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                >
                  {timeZoneOptions.map((zone) => (
                    <option
                      key={zone}
                      value={zone}
                      className="bg-zinc-950 text-white"
                    >
                      {zone}
                    </option>
                  ))}
                </select>
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-zinc-300">
                    Default race length
                  </span>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={appDefaultRaceLength}
                    onChange={(event) =>
                      setAppDefaultRaceLength(event.target.value)
                    }
                    className="w-full rounded-md border border-white/10 bg-black/40 px-4 py-3 font-mono outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-semibold text-zinc-300">
                    Default start time
                  </span>
                  <input
                    type="time"
                    value={appDefaultStartTime}
                    onChange={(event) =>
                      setAppDefaultStartTime(event.target.value)
                    }
                    className="w-full rounded-md border border-white/10 bg-black/40 px-4 py-3 font-mono outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  />
                </label>
              </div>

              <button
                onClick={saveAppSettings}
                className="rounded-md bg-gradient-to-r from-amber-500 to-amber-400 px-5 py-3 font-black uppercase tracking-wide text-zinc-950 transition hover:from-amber-400 hover:to-amber-300"
              >
                {saveButtonLabel("settings", "Save Settings", "Saved")}
              </button>
            </div>
          </section>

          <section className="rounded-lg border border-white/10 border-l-4 border-l-amber-500 bg-zinc-900 p-6 shadow-lg shadow-black/40">
            <h3 className="text-2xl font-bold">Account & Local Data</h3>
            <p className="mt-1 text-sm text-zinc-400">
              Quick actions for refreshing or clearing local app data.
            </p>

            <div className="mt-5 grid gap-3">
              {[
                [
                  "User",
                  userProfile?.display_name ||
                    userProfile?.username ||
                    "Unknown",
                ],
                ["User ID", userId || "Not signed in"],
                ["Templates Stored", `${raceTemplates.length} on this device`],
                ["Pending Requests", String(pendingRequests)],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-lg border border-zinc-700 border-l-4 border-l-amber-500/70 bg-zinc-950 p-4 shadow-md shadow-black/30"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                    {label}
                  </p>
                  <p className="mt-2 break-all font-bold text-zinc-100">
                    {value}
                  </p>
                </div>
              ))}

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => refreshAll(true)}
                  className="rounded-2xl bg-amber-700 px-5 py-3 font-bold transition hover:bg-amber-600"
                >
                  Refresh Cloud Data
                </button>
                <button
                  onClick={() => {
                    if (!userId) {
                      setMessage(
                        "No user ID to copy because you are not signed in.",
                      );
                      return;
                    }

                    navigator.clipboard?.writeText(userId);
                    setMessage("User ID copied to clipboard.");
                  }}
                  className="rounded-md border border-zinc-600 bg-zinc-800 px-5 py-3 font-bold uppercase tracking-wide text-zinc-200 transition hover:bg-zinc-700"
                >
                  Copy User ID
                </button>
                <button
                  onClick={() =>
                    setDeleteConfirm({
                      title: "Clear all local templates on this device?",
                      onConfirm: () => {
                        saveTemplates([]);
                        setMessage("Local templates cleared.");
                      },
                    })
                  }
                  className="rounded-2xl bg-gradient-to-r from-red-600 to-red-500 px-5 py-3 font-bold transition hover:from-red-500 hover:to-rose-500"
                >
                  Clear Local Templates
                </button>
              </div>
            </div>
          </section>
        </div>

        <section className="rounded-lg border border-white/10 border-l-4 border-l-amber-500 bg-zinc-900 p-6 shadow-lg shadow-black/40">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h3 className="text-2xl font-bold">Support / Bug Info</h3>
              <p className="mt-1 text-sm text-zinc-400">
                Copy this into a bug report for {SUPPORT_EMAIL} so the request includes account and
                page context automatically.
              </p>
            </div>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(supportInfo);
                setMessage("Support info copied to clipboard.");
              }}
              className="rounded-md border border-zinc-600 bg-zinc-800 px-5 py-3 font-bold uppercase tracking-wide text-zinc-200 transition hover:bg-zinc-700"
            >
              Copy Support Info
            </button>
          </div>
          <pre className="mt-5 overflow-x-auto rounded-2xl border border-zinc-600 bg-black/35 p-4 text-xs leading-6 text-zinc-300">
            {supportInfo}
          </pre>
        </section>

        <section className="rounded-lg border border-white/10 border-l-4 border-l-amber-500 bg-zinc-900 p-6 shadow-lg shadow-black/40">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-2xl font-bold">Admin / Requests</h3>
              <p className="mt-1 text-sm text-zinc-400">
                Use the Requests page to approve, reject, or mark requested
                cars/tracks as added.
              </p>
            </div>
            <button
              onClick={() => setActivePage("Requests")}
              className="rounded-md bg-gradient-to-r from-amber-500 to-amber-400 px-5 py-3 font-black uppercase tracking-wide text-zinc-950 transition hover:from-amber-400 hover:to-amber-300"
            >
              Open Requests
            </button>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {[
              ["Admin Access", isAdmin ? "Enabled" : "No"],
              ["Pending Requests", String(pendingRequests)],
              ["Total Requests", String(addRequests.length)],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-lg border border-zinc-700 border-l-4 border-l-amber-500/70 bg-zinc-950 p-4 shadow-md shadow-black/30"
              >
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                  {label}
                </p>
                <p className="mt-2 text-2xl font-black">{value}</p>
              </div>
            ))}
          </div>
        </section>
      </div>,
    );
  }

  function placeholderPage(title: string) {
    const comingSoonCopy: Record<string, string> = {
      Analytics:
        "Analytics will summarize stint counts, driver workload, drive time, weather split, and race performance once we build the final dashboard.",
      Donate:
        "Support options will go here later if you want to help keep development moving.",
    };

    return appShell(
      <div className="mx-auto max-w-7xl space-y-6">
        {pageHero(
          title,
          title,
          comingSoonCopy[title] ||
            pageDescriptionMap[title] ||
            "This section is still being built.",
        )}

        <section className="rounded-lg border border-white/10 bg-black/35 p-6 shadow-2xl shadow-black/25">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-2xl font-black">
                {title === "Analytics" ? "Planned Dashboard" : "Coming Soon"}
              </h3>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
                {title === "Analytics"
                  ? "We’ll add this last so it can use the finished schedule, testing, setup, and availability systems correctly."
                  : "This page is parked for now so the main planner stays focused and clean."}
              </p>
            </div>

            {title === "Analytics" ? (
              <button
                onClick={() => setActivePage("Exports")}
                className={primaryButtonClass}
              >
                Open Exports
              </button>
            ) : (
              <button
                onClick={() => setActivePage("Home")}
                className={primaryButtonClass}
              >
                Back Home
              </button>
            )}
          </div>
        </section>
      </div>,
    );
  }

  function requestsPage() {
    const isAdmin = appAdmins.some((admin: any) => admin.user_id === userId);
    const myRequests = userId
      ? addRequests.filter((request: any) => request.user_id === userId)
      : [];
    const requestPool = isAdmin ? addRequests : myRequests;
    const pendingCount = requestPool.filter(
      (request: any) => (request.status || "pending") === "pending",
    ).length;
    const approvedCount = requestPool.filter(
      (request: any) => (request.status || "pending") === "approved",
    ).length;
    const addedCount = requestPool.filter(
      (request: any) => (request.status || "pending") === "added",
    ).length;

    const requestTypeLabels: Record<string, string> = {
      car: "Car",
      track: "Track",
      feature: "Feature",
      bug: "Bug Report",
      setup: "Setup/Data",
      other: "Other",
    };

    function requestBadgeClass(status: string | null | undefined) {
      const value = status || "pending";
      if (value === "approved")
        return "border-green-700 bg-green-950/60 text-green-200";
      if (value === "rejected")
        return "border-red-700 bg-red-950/60 text-red-200";
      if (value === "added")
        return "border-amber-700 bg-amber-950/60 text-amber-200";
      return "border-yellow-700 bg-yellow-950/60 text-yellow-200";
    }

    function requestCard(request: AddRequest, adminMode = false) {
      const status = request.status || "pending";

      return (
        <div
          key={request.id}
          className="rounded-lg border border-zinc-700 border-l-4 border-l-amber-500 bg-zinc-950 p-5 shadow-lg shadow-black/40"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="truncate text-xl font-black">{request.name}</h4>
                <span className="rounded-full border border-zinc-600 bg-zinc-900 px-3 py-1 text-xs font-bold uppercase text-zinc-300">
                  {requestTypeLabels[request.request_type] ||
                    request.request_type}
                </span>
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-bold uppercase ${requestBadgeClass(status)}`}
                >
                  {status}
                </span>
              </div>

              <p className="mt-1 text-sm text-zinc-500">
                {request.category || "No category"} · Submitted{" "}
                {request.created_at
                  ? new Date(request.created_at).toLocaleDateString()
                  : "recently"}
              </p>

              {request.notes ? (
                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-zinc-300">
                  {request.notes}
                </p>
              ) : null}

              {adminMode ? (
                <p className="mt-3 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-zinc-500">
                  User ID: {request.user_id}
                </p>
              ) : null}

              {!adminMode && status === "approved" ? (
                <p className="mt-3 text-xs font-semibold text-green-300">
                  Approved — waiting to be added.
                </p>
              ) : null}
              {!adminMode && status === "added" ? (
                <p className="mt-3 text-xs font-semibold text-amber-300">
                  Added — you can delete/dismiss this request when you are done.
                </p>
              ) : null}
              {!adminMode && status === "rejected" ? (
                <p className="mt-3 text-xs font-semibold text-red-300">
                  Rejected — delete/dismiss it or submit a clearer request.
                </p>
              ) : null}
            </div>

            <div className="flex shrink-0 flex-wrap gap-2">
              {adminMode ? (
                <>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      updateAddRequestStatus(request, "approved");
                    }}
                    className="rounded-xl bg-green-700 px-3 py-2 text-xs font-bold text-white transition hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      updateAddRequestStatus(request, "added");
                    }}
                    className="rounded-xl bg-gradient-to-r from-amber-600 to-amber-600 px-3 py-2 text-xs font-bold transition hover:from-amber-500 hover:to-amber-500"
                  >
                    Mark Added
                  </button>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      updateAddRequestStatus(request, "rejected");
                    }}
                    className="rounded-xl bg-zinc-700 px-3 py-2 text-xs font-bold transition hover:bg-zinc-600"
                  >
                    Reject
                  </button>
                  {status !== "pending" ? (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        updateAddRequestStatus(request, "pending");
                      }}
                      className="rounded-xl bg-yellow-600 px-3 py-2 text-xs font-bold text-black transition hover:bg-yellow-500"
                    >
                      Reset
                    </button>
                  ) : null}
                </>
              ) : null}

              <button
                onClick={() =>
                  setDeleteConfirm({
                    title: `Delete request "${request.name}"?`,
                    onConfirm: () => deleteAddRequest(request),
                  })
                }
                className="rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-3 py-2 text-xs font-bold transition hover:from-red-500 hover:to-rose-500"
              >
                {adminMode ? "Delete" : "Dismiss/Delete"}
              </button>
            </div>
          </div>
        </div>
      );
    }

    return appShell(
      <div className="mx-auto max-w-7xl space-y-6">
        {pageHero(
          "Requests",
          "Requests",
          "Request missing cars, tracks, features, bug fixes, or setup/test data improvements.",
        )}

        <section className="grid gap-4 md:grid-cols-3">
          {[
            ["Pending", pendingCount],
            ["Approved", approvedCount],
            ["Added", addedCount],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-lg border border-white/10 bg-zinc-900/70 p-5 shadow-xl shadow-black/20"
            >
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                {label}
              </p>
              <p className="mt-2 text-3xl font-black">{value}</p>
            </div>
          ))}
        </section>

        <div className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
          <section className="rounded-lg border border-white/10 border-l-4 border-l-amber-500 bg-zinc-900 p-6 shadow-lg shadow-black/40">
            <div className="mb-5">
              <h3 className="text-2xl font-bold">Submit Request</h3>
              <p className="mt-1 text-sm text-zinc-400">
                Send the exact name if you know it. Requests are sent to {SUPPORT_EMAIL}. Use notes for feature
                details, bug steps, links, layouts, or extra context.
              </p>
            </div>

            <div className="space-y-4">
              <label className="space-y-2 block">
                <span className="text-sm font-semibold text-zinc-300">
                  Request Type
                </span>
                <select
                  value={requestForm.request_type}
                  onChange={(event) => {
                    markSaveDirty("request");
                    setRequestForm((prev: any) => ({
                      ...prev,
                      request_type: event.target.value,
                    }));
                  }}
                  className="w-full rounded-md border border-white/10 bg-black/40 px-4 py-3 font-mono outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                >
                  <option value="car" className="bg-zinc-950 text-white">
                    Car
                  </option>
                  <option value="track" className="bg-zinc-950 text-white">
                    Track
                  </option>
                  <option value="feature" className="bg-zinc-950 text-white">
                    Feature Request
                  </option>
                  <option value="bug" className="bg-zinc-950 text-white">
                    Bug Report
                  </option>
                  <option value="setup" className="bg-zinc-950 text-white">
                    Setup/Test Data
                  </option>
                  <option value="other" className="bg-zinc-950 text-white">
                    Other
                  </option>
                </select>
              </label>

              <label className="space-y-2 block">
                <span className="text-sm font-semibold text-zinc-300">
                  Name / Title
                </span>
                <input
                  value={requestForm.name}
                  onChange={(event) => {
                    markSaveDirty("request");
                    setRequestForm((prev: any) => ({
                      ...prev,
                      name: event.target.value,
                    }));
                  }}
                  placeholder={
                    requestForm.request_type === "car"
                      ? "Example: Ferrari 296 GT3"
                      : requestForm.request_type === "track"
                        ? "Example: Daytona International Speedway"
                        : requestForm.request_type === "bug"
                          ? "Example: Schedule weather not saving"
                          : "Example: Add stint comparison chart"
                  }
                  className="w-full rounded-md border border-white/10 bg-black/40 px-4 py-3 font-mono outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                />
              </label>

              <label className="space-y-2 block">
                <span className="text-sm font-semibold text-zinc-300">
                  Category <span className="text-zinc-500">(optional)</span>
                </span>
                <input
                  value={requestForm.category}
                  onChange={(event) => {
                    markSaveDirty("request");
                    setRequestForm((prev: any) => ({
                      ...prev,
                      category: event.target.value,
                    }));
                  }}
                  placeholder={
                    requestForm.request_type === "car"
                      ? "GT3, GTP, NASCAR, Formula, etc."
                      : requestForm.request_type === "track"
                        ? "Road, Oval, Dirt, Rallycross, etc."
                        : "Testing, Schedule, Teams, Setups, UI, etc."
                  }
                  className="w-full rounded-md border border-white/10 bg-black/40 px-4 py-3 font-mono outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                />
              </label>

              <label className="space-y-2 block">
                <span className="text-sm font-semibold text-zinc-300">
                  Notes{" "}
                  <span className="text-zinc-500">
                    (optional, but helpful)
                  </span>
                </span>
                <textarea
                  value={requestForm.notes}
                  onChange={(event) => {
                    markSaveDirty("request");
                    setRequestForm((prev: any) => ({
                      ...prev,
                      notes: event.target.value,
                    }));
                  }}
                  placeholder={
                    requestForm.request_type === "bug"
                      ? "What happened? What page were you on? What did you click? What should have happened instead?"
                      : "Add layout/configuration details, links, or anything else useful."
                  }
                  className="h-28 w-full rounded-md border border-white/10 bg-black/40 px-4 py-3 font-mono outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                />
              </label>

              <button
                onClick={createAddRequest}
                className="rounded-md bg-gradient-to-r from-amber-500 to-amber-400 px-6 py-3 font-black uppercase tracking-wide text-zinc-950 shadow-lg shadow-amber-950/40 transition hover:from-amber-400 hover:to-amber-300"
              >
                {saveButtonLabel("request", "Submit Request", "Submitted")}
              </button>
            </div>
          </section>

          <section className="rounded-lg border border-white/10 border-l-4 border-l-amber-500 bg-zinc-900 p-6 shadow-lg shadow-black/40">
            <div className="mb-5">
              <h3 className="text-2xl font-bold">
                {isAdmin ? "Admin Request Queue" : "Your Requests"}
              </h3>
              <p className="mt-1 text-sm text-zinc-400">
                {isAdmin
                  ? "Approve, reject, mark added, reset, or delete requests."
                  : "Track your requests. Approved/added requests stay here until you dismiss/delete them."}
              </p>
            </div>

            {requestPool.length === 0 ? (
              <div className="rounded-lg border border-dashed border-zinc-700 bg-zinc-950/60 p-10 text-center">
                <p className="text-lg font-semibold">No requests yet.</p>
                <p className="mt-2 text-sm text-zinc-500">
                  Submit a request on the left.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {requestPool.map((request: any) =>
                  requestCard(request, isAdmin),
                )}
              </div>
            )}
          </section>
        </div>
      </div>,
    );
  }

  function helpPage() {
    const quickStart = [
      {
        title: "1. Create or open a race",
        icon: "🏁",
        body: "Use Home to create a race, or use Templates if the race follows a saved format. Race name, date, and track can still be changed later in Race Data.",
      },
      {
        title: "2. Fill Race Data",
        icon: "🗂️",
        body: "Set the race length, start times, main time zone, selected team, track, and selected race car. Press Save after changing race data.",
      },
      {
        title: "3. Add baseline tests",
        icon: "🧪",
        body: "In Race → Testing, add baseline tests for the selected car. These are grouped by the driver who created them and power schedule timing.",
      },
      {
        title: "4. Set availability",
        icon: "🕒",
        body: "Each driver marks availability in one-hour blocks from race start to race end. Drivers can also save preferred stint count/type. Use Clean Regenerate in Schedule after preference changes.",
      },
      {
        title: "5. Review schedule",
        icon: "📋",
        body: "Schedule uses race data, baseline tests, weather, availability, preferences, and manual overrides to build the stint plan.",
      },
      {
        title: "6. Export",
        icon: "⬇️",
        body: "Use Exports to download CSV or open the polished printable schedule for PDF sharing with race info, time zones, warnings, and completion status.",
      },
    ];

    const deepDiveSections = [
      {
        title: "Teams",
        icon: "👥",
        body: "Create teams, invite drivers, and manage team races. Team owners/admins can create/edit team races and remove members. Regular members can view team races and shared resources.",
        tips: [
          "Invites and team updates live-refresh.",
          "If something does not appear instantly, Refresh Cloud Data in Settings can force a sync.",
          "Owner/admin permissions control race edits and team management.",
        ],
      },
      {
        title: "Testing",
        icon: "🧪",
        body: "Testing is split between Race Testing and the reusable Testing Library. Race baseline tests are used for schedule timing. Library tests can be saved for future races.",
        tips: [
          "Add separate baseline tests for Sunny, Rain, Heavy Rain, etc.",
          "Tests can be shared individually with a team.",
          "Tests can also be shared by putting them inside a team-shared folder.",
          "Use Move to put a test into a folder or move it back to Tests / No folder.",
        ],
      },
      {
        title: "Setups",
        icon: "🔧",
        body: "Setups stores iRacing setup files and notes. Setup files can be organized into folders and shared with teammates through shared setup folders.",
        tips: [
          "Use Move to move setup files into folders or back to Setups / No folder.",
          "Shared setup folders make files inside visible to the selected team.",
          "Setup files can be attached to saved tests where applicable.",
        ],
      },
      {
        title: "Schedule",
        icon: "📋",
        body: "The Schedule tab calculates stint start/end times and driver assignments. Weather changes use matching baseline tests when available, and if a driver's stint moves into an unavailable hourly block, the row warns you.",
        tips: [
          "Actual End should be entered in the race's main time zone.",
          "Complete saves the actual end for that stint.",
          "Manual driver changes lock that stint so later rows do not reshuffle unexpectedly.",
          "Clean Regenerate clears manual drivers, completed flags, added time, and actual end times while keeping weather, race data, testing data, and availability.",
          "If a driver has no test for selected weather, the schedule can use a matching-weather teammate baseline before falling back.",
        ],
      },
      {
        title: "Requests",
        icon: "➕",
        body: "Requests lets users ask for missing cars, tracks, features, bug fixes, and setup/test data improvements.",
        tips: [
          "Admins can Approve, Mark Added, Reject, Reset, or Delete requests.",
          "Feature and bug requests should include notes.",
          "Approved/added requests stay visible until dismissed.",
        ],
      },
      {
        title: "Settings",
        icon: "⚙️",
        body: "Settings stores local defaults and support tools. Use it to refresh cloud data, copy your user ID, copy support info, and manage local templates.",
        tips: [
          "Copy Support Info before reporting a bug.",
          "Clear Local Templates only clears templates saved on that device.",
          "Refresh Cloud Data is useful if live sync feels delayed.",
        ],
      },
    ];

    const whatsNew = [
      "Exports cleanup: CSV and printable PDF now include a cleaner race summary, time-zone grouped schedule columns, completion status, and warnings.",
      "Hourly availability: Availability now uses one-hour race blocks instead of schedule rows, so weather/added-time changes can still trigger driver warnings.",
      "Schedule warnings: active warnings are shown above the table, rows highlight yellow, and Override / Override All clears acknowledged warnings.",
      "Weather timing fallback: if one driver has no baseline for a weather type, the schedule can use a teammate's matching-weather baseline before falling back.",
      "Manual schedule locks: changing a driver manually no longer reshuffles lower stints unexpectedly.",
      "Live Strategy placeholder: available as its own race tab and reserved for in-race fuel, pit, weather, and driver-swap tools.",
      "Save buttons: sections can show Saved after a successful save and return to Save after edits.",
      "Requests cleanup: car, track, feature, bug, setup/data, and other all use the same submit flow.",
    ];

    const comingSoon = [
      "Live Strategy working version with fuel remaining, fuel burn per lap, average lap time, laps/time left in tank, fuel needed to finish, and recommended pit time.",
      "Fuel-save what-if and pit comparison tools for deciding whether saving fuel actually removes a stop.",
      "Analytics dashboard for stint counts, driver workload, drive time, weather split, and race summaries.",
      "More setup/test comparison tools and deeper export formats after beta feedback.",
    ];

    const quickLinks = [
      ["Home", "Create and open races"],
      ["Teams", "Manage teams and invites"],
      ["Testing", "Saved tests and sharing"],
      ["Setups", "Setup folders and files"],
      ["Templates", "Reusable race presets"],
      ["Requests", "Missing data and bug reports"],
      ["Settings", "Support and defaults"],
      ["Exports", "CSV and printable schedules"],
    ];

    return appShell(
      <div className="mx-auto max-w-7xl space-y-6">
        {pageHero(
          "Help",
          "Help & Release Notes",
          "Quick instructions, current workflow, what changed, and what is coming next.",
        )}

        <section className="rounded-lg border border-amber-800 bg-amber-950/25 p-6 shadow-2xl shadow-black/25">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className={sectionHeaderLabel}>Quick Start</p>
              <h3 className="mt-2 text-3xl font-black">
                Build a race in the correct order
              </h3>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-amber-100/80">
                For the least bugs/confusion, go in this order: Race Data →
                Testing → Availability → Schedule → Export.
              </p>
            </div>

            <button
              onClick={() => setActivePage("Home")}
              className={primaryButtonClass}
            >
              Go to Home
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {quickStart.map((step) => (
              <div
                key={step.title}
                className="rounded-2xl border border-white/10 bg-black/25 p-4"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.08] text-xl">
                    {step.icon}
                  </span>
                  <div>
                    <h4 className="font-black">{step.title}</h4>
                    <p className="mt-2 text-sm leading-6 text-zinc-300">
                      {step.body}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          {deepDiveSections.map((section) => (
            <div
              key={section.title}
              className="rounded-lg border border-white/10 bg-zinc-900/70 p-6 shadow-2xl shadow-black/25"
            >
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-2xl">
                  {section.icon}
                </span>
                <div>
                  <h3 className="text-xl font-black">{section.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">
                    {section.body}
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-2">
                {section.tips.map((tip) => (
                  <div
                    key={tip}
                    className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-zinc-300"
                  >
                    {tip}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <div className="rounded-lg border border-green-800 bg-green-950/20 p-6 shadow-2xl shadow-black/25">
            <p className={sectionHeaderLabel}>What’s New</p>
            <h3 className="mt-2 text-2xl font-black">Current beta changes</h3>
            <div className="mt-5 space-y-2">
              {whatsNew.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-green-900/60 bg-black/25 px-4 py-3 text-sm text-green-100"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-purple-800 bg-purple-950/20 p-6 shadow-2xl shadow-black/25">
            <p className={sectionHeaderLabel}>Coming Soon</p>
            <h3 className="mt-2 text-2xl font-black">Live Timing</h3>
            <div className="mt-5 space-y-2">
              {comingSoon.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-purple-900/60 bg-black/25 px-4 py-3 text-sm text-purple-100"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
          <div className="rounded-lg border border-white/10 bg-zinc-900/70 p-6 shadow-2xl shadow-black/25">
            <p className={sectionHeaderLabel}>Quick Navigation</p>
            <h3 className="mt-2 text-2xl font-black">Jump to a section</h3>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {quickLinks.map(([page, detail]) => (
                <button
                  key={page}
                  onClick={() => setActivePage(page as PageName)}
                  className="rounded-2xl border border-white/10 bg-black/30 p-4 text-left transition hover:border-amber-500/40 hover:bg-white/[0.06]"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.06] text-lg">
                      {pageIconMap[page] || "•"}
                    </span>
                    <div>
                      <p className="font-black">{page}</p>
                      <p className="mt-1 text-xs text-zinc-500">{detail}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-black/35 p-6 shadow-2xl shadow-black/25">
            <p className={sectionHeaderLabel}>Support</p>
            <h3 className="mt-2 text-2xl font-black">Found a bug?</h3>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Use Requests for bugs/features, or copy Support Info from Settings
              before emailing {SUPPORT_EMAIL}.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={() => setActivePage("Requests")}
                className={primaryButtonClass}
              >
                Open Requests
              </button>
              <button
                onClick={() => setActivePage("Settings")}
                className="rounded-md border border-zinc-600 bg-zinc-800 px-5 py-3 font-bold uppercase tracking-wide text-zinc-200 transition hover:bg-zinc-700"
              >
                Open Settings
              </button>
            </div>

            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="mt-5 block rounded-2xl border border-amber-900/50 bg-amber-950/20 p-4 text-sm font-bold text-amber-200 transition hover:border-amber-500/60 hover:bg-amber-950/35"
            >
              Email support: {SUPPORT_EMAIL}
            </a>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.05] p-4">
              <p className="font-black text-zinc-100">Best bug report format</p>
              <p className="mt-2 text-sm text-zinc-400">
                Include the page, what you clicked, what you expected, what
                happened, and a screenshot if possible.
              </p>
            </div>
          </div>
        </section>
      </div>,
    );
  }

  function raceWorkspace() {
    if (!selectedRace) {
      return appShell(
        <div className="mx-auto max-w-4xl rounded-lg border border-white/10 bg-zinc-900/70 p-8 text-center shadow-2xl shadow-black/25">
          <p className={sectionHeaderLabel}>Loading Race</p>
          <h2 className="mt-3 text-3xl font-black">Opening saved race...</h2>
          <p className="mt-2 text-sm text-zinc-400">
            If this stays here, the race may have been deleted or you may not
            have access.
          </p>
          <button
            onClick={() => {
              setSelectedRaceId(null);
              setActivePage("Home");
            }}
            className="mt-5 rounded-md bg-gradient-to-r from-amber-500 to-amber-400 px-5 py-3 font-black uppercase tracking-wide text-zinc-950 transition hover:from-amber-400 hover:to-amber-300"
          >
            Go Home
          </button>
        </div>,
      );
    }

    const trackName =
      selectedRace.track_name ||
      iracingTracks.find(
        (track: IRacingTrack) => track.id === selectedRace.track_id,
      )?.name ||
      "No track selected";
    const teamName = selectedRace.team_id
      ? getTeamById(teams, selectedRace.team_id)?.name || "Unknown Team"
      : "No Team Yet";
    const trackImage = getRaceTrackImage(selectedRace);

    const tabDescriptions: Record<RaceTab, string> = {
      Data: "Race length, car, team, time zones, and calculation settings.",
      Testing:
        "Team baseline tests, driver pace tests, and saved testing data.",
      Availability:
        "Driver availability, stint targets, and preferred stint types.",
      Schedule:
        "Calculated stint plan, driver/weather edits, and completion tracking.",
      "Live Strategy":
        "Reserved live race strategy view for fuel, pit, weather, and driver calls.",
      "Fuel Calc":
        "Advanced fuel and stint-length calculator: tank size, burn rate, save targets, and splash strategy.",
    };

    return appShell(
      <div className="mx-auto max-w-7xl space-y-6">
        <button
          onClick={() => setSelectedRaceId(null)}
          className="rounded-md border border-white/10 bg-zinc-900 px-4 py-2 text-sm font-bold text-amber-400 transition hover:border-amber-600 hover:bg-zinc-800"
        >
          ← Back to Home
        </button>

        <section className="overflow-hidden rounded-lg border border-zinc-700 bg-zinc-950 shadow-lg shadow-black/40">
          <div className="relative min-h-[240px]">
            {trackImage && (
              <img
                src={trackImage}
                alt=""
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
                className="absolute inset-0 h-full w-full object-cover opacity-60"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
            <div className="absolute inset-x-0 top-0 h-1 bg-[repeating-linear-gradient(90deg,#f5a623_0px,#f5a623_20px,transparent_20px,transparent_40px)]" />

            <div className="relative flex min-h-[240px] flex-col justify-between gap-6 p-6 lg:p-8">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-amber-400">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400" />
                    Race Workspace
                  </p>
                  <h2 className="max-w-3xl text-4xl font-black tracking-tight lg:text-5xl">
                    {selectedRace.name}
                  </h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-sm border border-zinc-700 bg-black/60 px-3 py-1 font-mono text-xs font-bold uppercase tracking-wide text-zinc-200">
                      {selectedRace.race_date || "No date"}
                    </span>
                    <span className="rounded-sm border border-zinc-700 bg-black/60 px-3 py-1 font-mono text-xs font-bold uppercase tracking-wide text-zinc-200">
                      {trackName}
                    </span>
                    <span className="rounded-sm border border-amber-600/70 bg-amber-950/40 px-3 py-1 font-mono text-xs font-bold uppercase tracking-wide text-amber-300">
                      {teamName}
                    </span>
                  </div>
                </div>

                <div className="w-full border border-amber-600/50 bg-black/70 p-5 text-left shadow-lg shadow-black/40 lg:w-[300px]">
                  <p className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.24em] text-amber-400">
                    Race Timer
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  </p>
                  <p className="mt-3 font-mono text-3xl font-black text-white">
                    {workspaceTimer}
                  </p>
                  <p className="mt-2 text-xs text-zinc-400">
                    Live countdown based on the race date and start time.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 divide-x divide-white/10 border-t border-white/10 pt-4">
                <div className="px-4 first:pl-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                    Track
                  </p>
                  <p className="mt-1 truncate font-bold text-zinc-100">
                    {trackName}
                  </p>
                </div>
                <div className="px-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                    Team
                  </p>
                  <p className="mt-1 truncate font-bold text-zinc-100">
                    {teamName}
                  </p>
                </div>
                <div className="px-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                    Active Tab
                  </p>
                  <p className="mt-1 truncate font-bold text-amber-400">
                    {activeRaceTab}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 shadow-lg shadow-black/30">
          <div className="grid w-full sm:grid-cols-2 xl:grid-cols-6">
            {(
              [
                "Data",
                "Testing",
                "Availability",
                "Schedule",
                "Live Strategy",
                "Fuel Calc",
              ] as RaceTab[]
            ).map(
              (tab) => {
                const tabIcons: Record<RaceTab, string> = {
                  Data: "🗂️",
                  Testing: "🧪",
                  Availability: "🕒",
                  Schedule: "📋",
                  "Live Strategy": "🟣",
                  "Fuel Calc": "⛽",
                };

                return (
                  <button
                    key={tab}
                    onClick={() => setActiveRaceTab(tab)}
                    className={`flex items-center justify-center gap-2 border-b-2 px-4 py-3.5 text-sm font-black uppercase tracking-wide transition ${
                      activeRaceTab === tab
                        ? "border-b-amber-400 bg-amber-500/10 text-amber-300"
                        : "border-b-transparent text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200"
                    }`}
                  >
                    <span>{tabIcons[tab]}</span>
                    <span>{tab}</span>
                  </button>
                );

              },
            )}
          </div>
        </section>

        {activeRaceTab === "Data" && dataTab()}
        {activeRaceTab === "Testing" && testingTab()}
        {activeRaceTab === "Availability" && availabilityTab()}
        {activeRaceTab === "Schedule" && scheduleTab()}
        {activeRaceTab === "Live Strategy" && liveStrategyTab()}
        {activeRaceTab === "Fuel Calc" && fuelCalcTab()}
      </div>,
    );
  }

  function fuelCalcTab() {
    const tankSize = fuelCalcState.tankSize;
    const fuelPerLap = fuelCalcState.fuelPerLap;
    const lapTimeSeconds = fuelCalcState.lapTimeSeconds;
    const raceLengthMinutes = fuelCalcState.raceLengthMinutes;
    const pitLossSeconds = fuelCalcState.pitLossSeconds;
    const safetyMarginLaps = fuelCalcState.safetyMarginLaps;
    const targetSaveLaps = fuelCalcState.targetSaveLaps;

    const rawLapsPerTank = fuelPerLap > 0 ? tankSize / fuelPerLap : 0;
    const usableLapsPerTank = Math.max(
      0,
      Math.floor(rawLapsPerTank) - safetyMarginLaps,
    );
    const totalRaceLaps =
      lapTimeSeconds > 0
        ? Math.ceil((raceLengthMinutes * 60) / lapTimeSeconds)
        : 0;
    const stopsRequired =
      usableLapsPerTank > 0
        ? Math.max(0, Math.ceil(totalRaceLaps / usableLapsPerTank) - 1)
        : 0;
    const totalFuelNeeded = totalRaceLaps * fuelPerLap;
    const totalPitTimeLost = stopsRequired * pitLossSeconds;
    const finalStintLaps =
      usableLapsPerTank > 0
        ? totalRaceLaps - usableLapsPerTank * Math.floor(totalRaceLaps / usableLapsPerTank) || usableLapsPerTank
        : 0;

    // Fuel-saving pace delta: if the driver needs to stretch the tank by
    // targetSaveLaps extra laps, how much fuel per lap (and lap time) do
    // they need to give up to make it happen.
    const stretchedLaps = usableLapsPerTank + targetSaveLaps;
    const requiredFuelPerLapToStretch =
      stretchedLaps > 0 ? tankSize / stretchedLaps : 0;
    const fuelToSavePerLap = Math.max(
      0,
      fuelPerLap - requiredFuelPerLapToStretch,
    );

    // Splash-and-go feasibility: fuel needed just to finish the final laps
    // of a stint, and whether a short splash (under 10s) covers it.
    const splashLapsCovered =
      fuelPerLap > 0 ? Math.floor((tankSize * 0.15) / fuelPerLap) : 0;

    function updateFuelCalc(
      key: keyof typeof fuelCalcState,
      value: number,
    ) {
      setFuelCalcState((prev) => ({ ...prev, [key]: value }));
    }

    const inputClass =
      "w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 font-mono text-sm text-white placeholder-zinc-600 outline-none transition focus:border-amber-500/60 focus:bg-black/60";
    const labelClass =
      "mb-1.5 block text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500";

    function readout(
      label: string,
      value: string,
      accent: "amber" | "zinc" | "green" = "amber",
    ) {
      const colorClass =
        accent === "amber"
          ? "text-amber-400"
          : accent === "green"
            ? "text-emerald-400"
            : "text-zinc-200";
      return (
        <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
          <p className={`font-mono text-2xl font-bold ${colorClass}`}>
            {value}
          </p>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">
            {label}
          </p>
        </div>
      );
    }

    return (
      <div className="mt-6 space-y-6">
        <section className="overflow-hidden rounded-lg border border-zinc-700 border-l-4 border-l-amber-500 bg-zinc-950 shadow-lg shadow-black/40 p-6 shadow-2xl">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-lg">⛽</span>
            <h3 className="text-xl font-black tracking-tight">
              Advanced Fuel Calculator
            </h3>
          </div>
          <p className="mb-6 text-sm text-zinc-400">
            Work out stint length, pit-stop count, and fuel-saving targets
            independent of the main schedule above. Nothing here changes
            your saved stint plan.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <div>
              <label className={labelClass}>Fuel tank size (L)</label>
              <input
                type="number"
                className={inputClass}
                value={tankSize}
                min={1}
                onChange={(event) =>
                  updateFuelCalc("tankSize", Number(event.target.value) || 0)
                }
              />
            </div>
            <div>
              <label className={labelClass}>Fuel use / lap (L)</label>
              <input
                type="number"
                step="0.1"
                className={inputClass}
                value={fuelPerLap}
                min={0.1}
                onChange={(event) =>
                  updateFuelCalc(
                    "fuelPerLap",
                    Number(event.target.value) || 0,
                  )
                }
              />
            </div>
            <div>
              <label className={labelClass}>Avg lap time (sec)</label>
              <input
                type="number"
                className={inputClass}
                value={lapTimeSeconds}
                min={1}
                onChange={(event) =>
                  updateFuelCalc(
                    "lapTimeSeconds",
                    Number(event.target.value) || 0,
                  )
                }
              />
            </div>
            <div>
              <label className={labelClass}>Race length (min)</label>
              <input
                type="number"
                className={inputClass}
                value={raceLengthMinutes}
                min={1}
                onChange={(event) =>
                  updateFuelCalc(
                    "raceLengthMinutes",
                    Number(event.target.value) || 0,
                  )
                }
              />
            </div>
            <div>
              <label className={labelClass}>Pit stop loss (sec)</label>
              <input
                type="number"
                className={inputClass}
                value={pitLossSeconds}
                min={0}
                onChange={(event) =>
                  updateFuelCalc(
                    "pitLossSeconds",
                    Number(event.target.value) || 0,
                  )
                }
              />
            </div>
            <div>
              <label className={labelClass}>Safety margin (laps)</label>
              <input
                type="number"
                className={inputClass}
                value={safetyMarginLaps}
                min={0}
                onChange={(event) =>
                  updateFuelCalc(
                    "safetyMarginLaps",
                    Number(event.target.value) || 0,
                  )
                }
              />
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-zinc-700 border-l-4 border-l-amber-500 bg-zinc-950 shadow-lg shadow-black/40 p-6 shadow-2xl">
          <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
            Results
          </h4>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {readout(
              "Usable laps / tank",
              String(usableLapsPerTank || 0),
            )}
            {readout("Total race laps", String(totalRaceLaps || 0), "zinc")}
            {readout("Pit stops required", String(stopsRequired || 0))}
            {readout(
              "Fuel needed (L)",
              totalFuelNeeded ? totalFuelNeeded.toFixed(1) : "0",
              "zinc",
            )}
            {readout(
              "Final stint laps",
              String(Math.round(finalStintLaps) || 0),
              "green",
            )}
            {readout(
              "Time lost to pits",
              totalPitTimeLost
                ? `${Math.floor(totalPitTimeLost / 60)}:${String(
                    Math.round(totalPitTimeLost % 60),
                  ).padStart(2, "0")}`
                : "0:00",
              "zinc",
            )}
            {readout(
              "Splash covers (laps)",
              String(splashLapsCovered || 0),
              "green",
            )}
          </div>
        </section>

        <section className="rounded-lg border border-zinc-700 border-l-4 border-l-amber-500 bg-zinc-950 shadow-lg shadow-black/40 p-6 shadow-2xl">
          <h4 className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
            Fuel-Save Target
          </h4>
          <p className="mb-4 text-sm text-zinc-400">
            If a driver needs to stretch the tank by extra laps (to skip a
            stop or reach a caution), this shows the burn rate and lap-time
            trade-off required.
          </p>
          <div className="mb-4 max-w-xs">
            <label className={labelClass}>Extra laps to stretch</label>
            <input
              type="number"
              className={inputClass}
              value={targetSaveLaps}
              min={0}
              onChange={(event) =>
                updateFuelCalc(
                  "targetSaveLaps",
                  Number(event.target.value) || 0,
                )
              }
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {readout(
              "Required L / lap",
              requiredFuelPerLapToStretch
                ? requiredFuelPerLapToStretch.toFixed(2)
                : "0.00",
            )}
            {readout(
              "Fuel to save / lap",
              fuelToSavePerLap ? fuelToSavePerLap.toFixed(2) + " L" : "0 L",
              "green",
            )}
          </div>
        </section>
      </div>
    );
  }

  function liveStrategyTab() {
    const selectedCarId = getSelectedRaceCarId(selectedRace);
    const liveStrategyCar =
      selectedRaceCars.find((car: any) => car.id === selectedCarId) || null;
    const fuelTank = liveStrategyCar?.fuel_tank ?? null;

    const plannedTools = [
      {
        title: "Current Race Status",
        body: "Current race time, time remaining, current driver, current lap, current weather, fuel in tank, and live average lap time.",
      },
      {
        title: "Fuel Calculator",
        body: "Uses the selected Race Data car and fuel tank to estimate laps left, time left, pit window, fuel needed to finish, and whether the car can make it.",
      },
      {
        title: "Pit Strategy",
        body: "Compare pit now, pit next lap, stretch, splash only, or full tank options with projected stop count and risk level.",
      },
      {
        title: "Fuel Save What-If",
        body: "Check if saving fuel avoids a pit stop, how many laps it gains, how much lap time it costs, and whether it is actually worth it.",
      },
      {
        title: "Weather What-If",
        body: "Preview how rain/clouds/heavy rain change stint time, fuel burn, next driver timing, and availability warnings.",
      },
      {
        title: "Driver Swap Helper",
        body: "Show who is available now, who is unavailable, who prefers not to drive, and the recommended next driver.",
      },
      {
        title: "Quick Delay Buttons",
        body: "+10 sec, +30 sec, +1 min, +5 min, safety car, tow/repair, and undo last adjustment for fast race-control changes.",
      },
      {
        title: "Live Recommendation",
        body: "Big simple calls like pit this lap, stay out, fuel-save target, projected laps short, or driver availability conflict.",
      },
    ];

    return (
      <div className="space-y-6">
        <section className={`${panelClass} p-6`}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className={sectionHeaderLabel}>Coming Soon</p>
              <h3 className="mt-3 text-4xl font-black tracking-tight">
                Live Strategy
              </h3>
              <p className="mt-3 max-w-3xl text-sm text-zinc-400">
                This tab is reserved for in-race strategy tools that are easy to
                find during a live race. It will pull the selected car from Race
                Data and use that car's saved fuel tank size for live fuel and
                pit calculations.
              </p>
            </div>
            <div className="rounded-[1.35rem] border border-amber-900 bg-amber-950/40 p-4 text-sm text-amber-100 lg:w-[340px]">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-300">
                Selected Race Car
              </p>
              <p className="mt-2 text-xl font-black text-white">
                {liveStrategyCar?.name || "No car selected"}
              </p>
              <p className="mt-1 text-sm text-amber-100/80">
                Fuel tank: {fuelTank ? `${fuelTank} L` : "Not set yet"}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveRaceTab("Schedule")}
                  className="rounded-xl border border-purple-500/40 bg-purple-600/20 px-3 py-2 text-xs font-black text-purple-100 hover:bg-purple-600/30"
                >
                  Back to Schedule
                </button>
                <button
                  onClick={() => setActiveRaceTab("Data")}
                  className="rounded-xl border border-amber-500/40 bg-amber-600/20 px-3 py-2 text-xs font-black text-amber-100 hover:bg-amber-600/30"
                >
                  Edit Race Data
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {plannedTools.map((tool) => (
            <div
              key={tool.title}
              className="rounded-[1.35rem] border border-zinc-800 bg-zinc-950/70 p-5 shadow-lg shadow-black/20"
            >
              <p className="text-lg font-black text-zinc-100">{tool.title}</p>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                {tool.body}
              </p>
            </div>
          ))}
        </section>
      </div>
    );
  }

  function dataTab() {
    const selectedScheduleCar =
      selectedRaceCars.find(
        (car: any) => car.id === raceForm.selected_car_id,
      ) || null;
    const selectedCarName = selectedScheduleCar?.name || "No car selected";
    const selectedTeamName = raceForm.team_id
      ? getTeamById(teams, raceForm.team_id)?.name || "Unknown Team"
      : "No team selected";
    const selectedTeamTestLabel = raceForm.selected_team_test_id
      ? "Manual team baseline selected"
      : "Auto: fastest matching team test";
    const selectedDriverTestLabel = raceForm.selected_driver_test_id
      ? "Manual driver pace selected"
      : "Auto: fastest matching driver test";
    const canEditRaceData = canEditRace(selectedRace);

    return (
      <section className="w-full rounded-lg border border-white/10 border-l-4 border-l-amber-500 bg-zinc-900 p-6 shadow-lg shadow-black/40">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className={sectionHeaderLabel}>Race Setup</p>
            <h3 className="mt-3 text-4xl font-black tracking-tight">
              Race Data
            </h3>
            <p className="mt-2 max-w-3xl text-sm text-zinc-400">
              Set the race timing, car/team selection, time zones, and which
              test data the schedule should use.
            </p>
          </div>
          {canEditRaceData ? (
            <button
              onClick={calculateRace}
              className="rounded-md bg-gradient-to-r from-amber-500 to-amber-400 px-6 py-3 font-black uppercase tracking-wide text-zinc-950 shadow-lg shadow-amber-950/40 transition hover:from-amber-400 hover:to-amber-300"
            >
              {saveButtonLabel("race-data")}
            </button>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-6 py-3 text-sm font-bold text-zinc-400">
              View only — only the creator, team owner, or team admin can edit
              Race Data.
            </div>
          )}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <section className="rounded-lg border border-zinc-700 border-l-4 border-l-amber-500 bg-zinc-950 p-5 shadow-lg shadow-black/40">
              <div className="mb-5">
                <h4 className="text-xl font-bold">Race Info & Setup</h4>
                <p className="mt-1 text-sm text-zinc-500">
                  Edit the race details, timing, team, and length in one place.
                  These default from the race or template you created.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-amber-300">
                    Race Info
                  </p>
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="space-y-2 md:col-span-2">
                      <span className="text-sm font-semibold text-zinc-300">
                        Race Name
                      </span>
                      <input
                        disabled={!canEditRaceData}
                        value={raceForm.race_name || ""}
                        onChange={(event) =>
                          setRaceForm((prev: any) => ({
                            ...prev,
                            race_name: event.target.value,
                          }))
                        }
                        placeholder="Example: Daytona 24"
                        className="w-full rounded-md border border-white/10 bg-black/40 px-4 py-3 font-mono outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                      />
                    </label>

                    <label className="space-y-2">
                      <span className="text-sm font-semibold text-zinc-300">
                        Race Date
                      </span>
                      <input
                        disabled={!canEditRaceData}
                        type="date"
                        value={raceForm.race_date || ""}
                        onChange={(event) =>
                          setRaceForm((prev: any) => ({
                            ...prev,
                            race_date: event.target.value,
                          }))
                        }
                        className="w-full rounded-md border border-white/10 bg-black/40 px-4 py-3 font-mono outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                      />
                    </label>

                    <label className="space-y-2">
                      <span className="text-sm font-semibold text-zinc-300">
                        Track
                      </span>
                      <input
                        disabled={!canEditRaceData}
                        value={raceTrackSearch}
                        list="race-track-options"
                        onChange={(event) => {
                          const value = event.target.value;
                          setRaceTrackSearch(value);
                          const match = findTrackBySearchValue(value);
                          setRaceForm((prev: any) => ({
                            ...prev,
                            track_id: match?.id || "",
                          }));
                        }}
                        onKeyDown={(event) => {
                          if (event.key === "Escape") {
                            event.preventDefault();
                            resetRaceDataTrackSearch();
                          }
                        }}
                        placeholder="Search and select track"
                        className="w-full rounded-md border border-white/10 bg-black/40 px-4 py-3 font-mono outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                      />
                      <datalist id="race-track-options">
                        {filteredRaceTracks.map((track: IRacingTrack) => (
                          <option key={track.id} value={track.name} />
                        ))}
                        {filteredRaceTracks
                          .filter((track: IRacingTrack) =>
                            normalizeSearchText(track.name).includes(
                              "nurburgring",
                            ),
                          )
                          .map((track: IRacingTrack) => (
                            <option
                              key={`${track.id}-ascii`}
                              value={track.name.replace(
                                "Nürburgring",
                                "Nurburgring",
                              )}
                            />
                          ))}
                      </datalist>
                    </label>
                  </div>
                </div>

                <div className="border-t border-zinc-800 pt-5">
                  <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-amber-300">
                    Race Setup
                  </p>
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="space-y-2">
                      <span className="text-sm font-semibold text-zinc-300">
                        Race Start Time (Real Life)
                      </span>
                      <input
                        disabled={!canEditRaceData}
                        type="time"
                        value={raceForm.race_start_real}
                        onChange={(event) =>
                          setRaceForm((prev: any) => ({
                            ...prev,
                            race_start_real: event.target.value,
                          }))
                        }
                        className="w-full rounded-md border border-white/10 bg-black/40 px-4 py-3 font-mono outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                      />
                    </label>

                    <label className="space-y-2">
                      <span className="text-sm font-semibold text-zinc-300">
                        Race Start Time (In Sim)
                      </span>
                      <input
                        disabled={!canEditRaceData}
                        type="time"
                        value={raceForm.race_start_sim}
                        onChange={(event) =>
                          setRaceForm((prev: any) => ({
                            ...prev,
                            race_start_sim: event.target.value,
                          }))
                        }
                        className="w-full rounded-md border border-white/10 bg-black/40 px-4 py-3 font-mono outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                      />
                    </label>

                    <label className="space-y-2">
                      <span className="text-sm font-semibold text-zinc-300">
                        Race Length (Hours)
                      </span>
                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        disabled={!canEditRaceData}
                        value={raceForm.race_length_hours}
                        onChange={(event) =>
                          setRaceForm((prev: any) => ({
                            ...prev,
                            race_length_hours: event.target.value,
                          }))
                        }
                        placeholder="24"
                        className="w-full rounded-md border border-white/10 bg-black/40 px-4 py-3 font-mono outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                      />
                    </label>

                    <label className="space-y-2">
                      <span className="text-sm font-semibold text-zinc-300">
                        Team
                      </span>
                      <select
                        disabled={!canEditRaceData}
                        value={raceForm.team_id || ""}
                        onChange={(event) => {
                          const nextTeamId = event.target.value;
                          setRaceForm((prev: any) => ({
                            ...prev,
                            team_id: nextTeamId,
                            selected_car_id: "",
                            selected_team_test_id: "",
                            selected_driver_test_id: "",
                          }));
                          setRaceCarSearch("");
                          setSelectedTestingCarId("");
                        }}
                        className="w-full rounded-md border border-white/10 bg-black/40 px-4 py-3 font-mono outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <option value="" className="bg-zinc-950 text-white">
                          No team selected
                        </option>
                        {teams.map((team: any) => (
                          <option
                            key={team.id}
                            value={team.id}
                            className="bg-zinc-950 text-white"
                          >
                            {team.name} (
                            {teamMembersByTeam[team.id]?.length || 0} drivers)
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-lg border border-white/10 bg-zinc-900/70 p-5">
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h4 className="text-xl font-bold">Race Car Selection</h4>
                  <p className="mt-1 text-sm text-zinc-400">
                    Choose the car this race will use. These are the cars you
                    added in the Testing tab for this race/team.
                  </p>
                </div>
                <button
                  onClick={() => setActiveRaceTab("Testing")}
                  className="rounded-2xl bg-white/[0.08] px-4 py-2 text-sm font-bold transition hover:bg-zinc-700"
                >
                  Manage Cars in Testing
                </button>
              </div>

              {selectedRaceCars.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-zinc-600 bg-zinc-950 p-8 text-center">
                  <p className="font-semibold text-zinc-200">
                    No testing cars added yet.
                  </p>
                  <p className="mt-2 text-sm text-zinc-500">
                    Go to Testing and add the car first, then select it here for
                    the race.
                  </p>
                  <button
                    onClick={() => setActiveRaceTab("Testing")}
                    className="mt-4 rounded-md bg-gradient-to-r from-amber-500 to-amber-400 px-5 py-3 font-black uppercase tracking-wide text-zinc-950 transition hover:from-amber-400 hover:to-amber-300"
                  >
                    Go to Testing
                  </button>
                </div>
              ) : (
                <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
                  {selectedRaceCars.map((car: any) => {
                    const matchingTests = selectedRaceCarTests.filter(
                      (test: any) => test.car_id === car.id,
                    );
                    const isSelected = raceForm.selected_car_id === car.id;

                    return (
                      <button
                        key={car.id}
                        disabled={!canEditRaceData}
                        onClick={() => {
                          if (!canEditRaceData) return;
                          setRaceForm((prev: any) => ({
                            ...prev,
                            selected_car_id: car.id,
                            selected_team_test_id: "",
                            selected_driver_test_id: "",
                          }));
                          setSelectedTestingCarId(car.id);
                          setRaceCarSearch(car.name);
                        }}
                        className={`rounded-lg border p-5 text-left transition ${
                          isSelected
                            ? "border-amber-400 bg-amber-600/20 shadow-lg shadow-amber-950/30"
                            : "border-zinc-800 bg-zinc-950 hover:border-amber-900/70 hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-60"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-amber-300">
                              {isSelected ? "Selected Race Car" : "Testing Car"}
                            </p>
                            <h5 className="truncate text-xl font-black">
                              {car.name}
                            </h5>
                            <p className="mt-2 text-sm text-zinc-400">
                              {matchingTests.length} baseline test
                              {matchingTests.length === 1 ? "" : "s"} saved
                            </p>
                          </div>
                          {isSelected ? (
                            <span className="rounded-full bg-gradient-to-r from-amber-600 to-amber-600 px-3 py-1 text-xs font-black text-white">
                              Using
                            </span>
                          ) : null}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </section>

            <section className="rounded-lg border border-zinc-700 border-l-4 border-l-amber-500 bg-zinc-950 p-5 shadow-lg shadow-black/40">
              <div className="mb-5">
                <h4 className="text-xl font-bold">Time Zones</h4>
                <p className="mt-1 text-sm text-zinc-500">
                  Pick the main race time zone and any extra viewing zones.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-zinc-300">
                    Main Time Zone
                  </span>
                  <select
                    disabled={!canEditRaceData}
                    value={raceForm.main_time_zone}
                    onChange={(event) =>
                      setRaceForm((prev: any) => ({
                        ...prev,
                        main_time_zone: event.target.value,
                      }))
                    }
                    className="w-full rounded-md border border-white/10 bg-black/40 px-4 py-3 font-mono outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {timeZoneOptions.map((zone: string) => (
                      <option
                        key={zone}
                        value={zone}
                        className="bg-zinc-950 text-white"
                      >
                        {zone}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-semibold text-zinc-300">
                    Additional Time Zone
                  </span>
                  <div className="flex gap-2">
                    <select
                      disabled={!canEditRaceData}
                      value={raceForm.extra_time_zone}
                      onChange={(event) =>
                        setRaceForm((prev: any) => ({
                          ...prev,
                          extra_time_zone: event.target.value,
                        }))
                      }
                      className="min-w-0 flex-1 rounded-md border border-white/10 bg-black/40 px-4 py-3 font-mono outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {timeZoneOptions.map((zone: string) => (
                        <option
                          key={zone}
                          value={zone}
                          className="bg-zinc-950 text-white"
                        >
                          {zone}
                        </option>
                      ))}
                    </select>
                    <button
                      disabled={!canEditRaceData}
                      onClick={addExtraTimeZone}
                      className="rounded-2xl bg-zinc-700 px-5 font-bold transition hover:bg-zinc-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Add
                    </button>
                  </div>
                </label>

                <div className="md:col-span-2">
                  <p className="mb-2 text-sm font-semibold text-zinc-300">
                    Selected Additional Time Zones
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {raceForm.extra_time_zones.length === 0 ? (
                      <span className="text-sm text-zinc-500">
                        No extra time zones selected.
                      </span>
                    ) : (
                      raceForm.extra_time_zones.map((zone: string) => (
                        <button
                          key={zone}
                          disabled={!canEditRaceData}
                          onClick={() =>
                            setRaceForm((prev: any) => ({
                              ...prev,
                              extra_time_zones: prev.extra_time_zones.filter(
                                (item: any) => item !== zone,
                              ),
                            }))
                          }
                          className="rounded-full border border-white/10 bg-white/[0.07] px-3 py-2 text-sm font-semibold text-zinc-300 transition hover:border-red-700 hover:bg-red-950/60 hover:text-red-200"
                        >
                          {zone} ×
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-lg border border-zinc-700 border-l-4 border-l-amber-500 bg-zinc-950 p-5 shadow-lg shadow-black/40">
              <div className="mb-5">
                <h4 className="text-xl font-bold">Test Selection</h4>
                <p className="mt-1 text-sm text-zinc-500">
                  Leave these on Auto to use the fastest matching car/weather
                  data, or choose a specific test manually.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-zinc-300">
                    Team Baseline Test
                  </span>
                  <select
                    disabled={!canEditRaceData}
                    value={raceForm.selected_team_test_id || ""}
                    onChange={(event) =>
                      setRaceForm((prev: any) => ({
                        ...prev,
                        selected_team_test_id: event.target.value,
                      }))
                    }
                    className="w-full rounded-md border border-white/10 bg-black/40 px-4 py-3 font-mono outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <option value="">Auto: fastest matching team test</option>
                    {selectedRaceCarTests
                      .filter(
                        (test: any) =>
                          !raceForm.selected_car_id ||
                          test.car_id === raceForm.selected_car_id,
                      )
                      .sort(
                        (a: any, b: any) =>
                          toNumber(a.average_lap, 999999) -
                          toNumber(b.average_lap, 999999),
                      )
                      .map((test: any) => {
                        const car = selectedRaceCars.find(
                          (item: any) => item.id === test.car_id,
                        );
                        return (
                          <option
                            key={test.id}
                            value={test.id}
                            className="bg-zinc-950 text-white"
                          >
                            {car?.name || "Car"} · {test.weather || "Sunny"} ·{" "}
                            {test.average_lap ?? "—"}s avg
                          </option>
                        );
                      })}
                  </select>
                  <p className="text-xs text-zinc-500">
                    {selectedTeamTestLabel}
                  </p>
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-semibold text-zinc-300">
                    Driver Pace Test
                  </span>
                  <select
                    disabled={!canEditRaceData}
                    value={raceForm.selected_driver_test_id || ""}
                    onChange={(event) =>
                      setRaceForm((prev: any) => ({
                        ...prev,
                        selected_driver_test_id: event.target.value,
                      }))
                    }
                    className="w-full rounded-md border border-white/10 bg-black/40 px-4 py-3 font-mono outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <option value="">Auto: fastest matching driver test</option>
                    {driverTests
                      .filter(
                        (test: any) =>
                          selectedRace &&
                          test.race_id === selectedRace.id &&
                          (!raceForm.selected_car_id ||
                            test.car_id === raceForm.selected_car_id),
                      )
                      .sort(
                        (a: any, b: any) =>
                          toNumber(a.average_lap, 999999) -
                          toNumber(b.average_lap, 999999),
                      )
                      .map((test: any) => {
                        const driver = selectedRaceMembers.find(
                          (member: any) => member.user_id === test.driver_id,
                        );
                        const car = selectedRaceCars.find(
                          (item: any) => item.id === test.car_id,
                        );
                        return (
                          <option
                            key={test.id}
                            value={test.id}
                            className="bg-zinc-950 text-white"
                          >
                            {profileName(driver?.profiles)} ·{" "}
                            {car?.name || "Car"} · {test.weather || "Sunny"} ·{" "}
                            {test.average_lap ?? "—"}s avg
                          </option>
                        );
                      })}
                  </select>
                  <p className="text-xs text-zinc-500">
                    {selectedDriverTestLabel}
                  </p>
                </label>
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-lg border border-zinc-700 border-l-4 border-l-amber-500 bg-zinc-950 p-5 shadow-lg shadow-black/40">
              <h4 className="text-xl font-bold">Current Setup</h4>
              <p className="mt-1 text-sm text-zinc-500">
                Quick summary of the setup currently selected for this race.
              </p>
              <div className="mt-5 grid gap-3">
                {[
                  ["Race", raceForm.race_name || selectedRace?.name || "—"],
                  [
                    "Date",
                    raceForm.race_date || selectedRace?.race_date || "—",
                  ],
                  [
                    "Track",
                    iracingTracks.find(
                      (track: IRacingTrack) => track.id === raceForm.track_id,
                    )?.name ||
                      selectedRace?.track_name ||
                      "—",
                  ],
                  ["Team", selectedTeamName],
                  ["Car", selectedCarName],
                  ["Race Length", `${raceForm.race_length_hours || "—"} hours`],
                  ["Main Time Zone", raceForm.main_time_zone || "—"],
                  [
                    "Extra Time Zones",
                    raceForm.extra_time_zones.length
                      ? `${raceForm.extra_time_zones.length} selected`
                      : "None",
                  ],
                  [
                    "Attached Setup",
                    selectedRaceSetup?.name ||
                      testForm.setup_file_name ||
                      "None",
                  ],
                  ["Available Setups", `${visibleRaceSetups.length} shared`],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4"
                  >
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                      {label}
                    </p>
                    <p className="mt-2 font-bold text-zinc-100">{value}</p>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </section>
    );
  }

  function testingTab() {
    const carTestsForSelected = selectedTestingCarId
      ? selectedRaceCarTests.filter(
          (test: any) => test.car_id === selectedTestingCarId,
        )
      : [];

    const baselineTestGroups = selectedRaceMembers
      .map((member: any) => ({
        id: member.user_id,
        name:
          member.user_id === userId
            ? `${profileName(member.profiles)} (You)`
            : profileName(member.profiles),
        role: member.user_id === userId ? "You" : roleLabel(member.role),
        tests: carTestsForSelected.filter(
          (test: any) => test.created_by === member.user_id,
        ),
      }))
      .filter((group: any) => group.tests.length > 0);

    const unassignedBaselineTests = carTestsForSelected.filter((test: any) => {
      if (!test.created_by) return true;
      return !selectedRaceMembers.some(
        (member: any) => member.user_id === test.created_by,
      );
    });

    if (unassignedBaselineTests.length > 0) {
      baselineTestGroups.push({
        id: "unknown",
        name: "Unknown Driver",
        role: "Unknown",
        tests: unassignedBaselineTests,
      });
    }

    const selectedTestingCarName =
      selectedRaceCars.find((car: any) => car.id === selectedTestingCarId)
        ?.name || "No car selected";
    const filteredRaceAddCars = iracingCars.filter((car: any) =>
      searchMatches(car.name, raceAddCarSearch),
    );

    function formatTestDuration(seconds: number) {
      if (!Number.isFinite(seconds) || seconds <= 0) return "—";
      const totalMinutes = Math.round(seconds / 60);
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    }

    function calculateTestSummary(values: {
      average_lap?: number | null;
      fuel_tank?: number | null;
      fuel_burn?: number | null;
      inlap?: number | null;
      outlap?: number | null;
    }) {
      const avgLap = toNumber(values.average_lap, 0);
      const tank = toNumber(values.fuel_tank, 0);
      const fuelBurn = toNumber(values.fuel_burn, 0);
      const inlap = toNumber(values.inlap, avgLap);
      const outlap = toNumber(values.outlap, avgLap);
      const raceHours = toNumber(
        raceForm.race_length_hours || selectedRace?.race_length_hours,
        0,
      );
      const raceSeconds = raceHours * 3600;

      if (!avgLap || !tank || !fuelBurn) {
        return {
          avgLap: avgLap ? `${avgLap}s` : "—",
          stintTime: "—",
          lapsPerStint: "—",
          raceLaps: "—",
          exactStints: "—",
          stintsNeeded: "—",
        };
      }

      const lapsPerStint = tank / fuelBurn;
      const stintSeconds = Math.max(
        60,
        (lapsPerStint - 2) * avgLap + inlap + outlap,
      );
      const raceLaps = raceSeconds > 0 ? raceSeconds / avgLap : 0;
      const exactStints = raceSeconds > 0 ? raceSeconds / stintSeconds : 0;

      return {
        avgLap: `${avgLap}s`,
        stintTime: formatTestDuration(stintSeconds),
        lapsPerStint: `${lapsPerStint.toFixed(1)}`,
        raceLaps: raceLaps ? raceLaps.toFixed(0) : "—",
        exactStints: exactStints ? exactStints.toFixed(2) : "—",
        stintsNeeded: exactStints ? String(Math.ceil(exactStints)) : "—",
      };
    }

    return (
      <div className="space-y-6">
        <section className="rounded-lg border border-white/10 border-l-4 border-l-amber-500 bg-zinc-900 p-6 shadow-lg shadow-black/40">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-amber-400">
                Testing
              </p>
              <h3 className="text-3xl font-black tracking-tight">
                Race Testing
              </h3>
              <p className="mt-2 max-w-3xl text-sm text-zinc-400">
                Save team baseline tests, load saved library tests, and review
                teammate driver pace data for the selected race car.
              </p>
            </div>
            <div className="rounded-lg border border-zinc-700 border-l-4 border-l-amber-500/70 bg-zinc-950 shadow-md shadow-black/30 px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                Selected Car
              </p>
              <p className="mt-1 font-bold text-amber-200">
                {selectedTestingCarName}
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            {[
              ["Team Cars", String(selectedRaceCars.length)],
              ["Team Tests", String(carTestsForSelected.length)],
              ["Driver Baseline Tests", String(carTestsForSelected.length)],
              ["Team Setups", String(visibleRaceSetups.length)],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-lg border border-zinc-700 border-l-4 border-l-amber-500/70 bg-zinc-950 p-4 shadow-md shadow-black/30"
              >
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                  {label}
                </p>
                <p className="mt-2 text-2xl font-black">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-white/10 border-l-4 border-l-amber-500 bg-zinc-900 p-6 shadow-lg shadow-black/40">
          <div className="mb-5">
            <h3 className="text-2xl font-bold">Race Libraries</h3>
            <p className="mt-1 text-sm text-zinc-400">
              Pull shared team tests and setup files into this race so the stint
              math uses the correct car/track data.
            </p>
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            <div className="rounded-lg border border-zinc-700 border-l-4 border-l-amber-500 bg-zinc-950 p-5 shadow-lg shadow-black/40">
              <div className="mb-4">
                <h4 className="text-lg font-bold">Load Saved Test</h4>
                <p className="mt-1 text-sm text-zinc-500">
                  Loads lap, fuel, inlap/outlap, notes, and any attached setup
                  file into the race test form.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <select
                  value={selectedLibraryTestId}
                  onChange={(event) =>
                    setSelectedLibraryTestId(event.target.value)
                  }
                  className="min-w-0 flex-1 rounded-md border border-white/10 bg-black/40 px-4 py-3 font-mono outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                >
                  <option value="" className="bg-zinc-950 text-white">
                    Choose a saved test
                  </option>
                  {visibleLibraryTests.map((test: any) => (
                    <option
                      key={test.id}
                      value={test.id}
                      className="bg-zinc-950 text-white"
                    >
                      {test.team_id ? "Team" : "Personal"} ·{" "}
                      {test.car_name || carNameFromMaster(test.car_id)} ·{" "}
                      {test.track_name || trackNameFromMaster(test.track_id)} ·{" "}
                      {test.weather || "Sunny"} · Avg {test.average_lap || "—"}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    const test = visibleLibraryTests.find(
                      (item: any) => item.id === selectedLibraryTestId,
                    );
                    if (test) loadLibraryTestIntoRace(test);
                  }}
                  className="rounded-md bg-gradient-to-r from-amber-500 to-amber-400 px-6 py-3 font-black uppercase tracking-wide text-zinc-950 shadow-lg shadow-amber-950/40 transition hover:from-amber-400 hover:to-amber-300"
                >
                  Load Test Into Race
                </button>
              </div>
            </div>

            <div className="rounded-lg border border-zinc-700 border-l-4 border-l-amber-500 bg-zinc-950 p-5 shadow-lg shadow-black/40">
              <div className="mb-4">
                <h4 className="text-lg font-bold">Attach Team Setup</h4>
                <p className="mt-1 text-sm text-zinc-500">
                  Select a shared setup file for this race. Matching car/track
                  setups appear first.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <select
                  value={selectedRaceSetupId}
                  onChange={(event) => {
                    const setup = visibleRaceSetups.find(
                      (item: any) => item.id === event.target.value,
                    );
                    if (setup) applySetupToRace(setup);
                    else setSelectedRaceSetupId("");
                  }}
                  className="min-w-0 flex-1 rounded-md border border-white/10 bg-black/40 px-4 py-3 font-mono outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                >
                  <option value="" className="bg-zinc-950 text-white">
                    Choose a setup file
                  </option>
                  {matchingRaceSetups.length > 0 ? (
                    <optgroup label="Matching this race">
                      {matchingRaceSetups.map((setup: any) => (
                        <option
                          key={setup.id}
                          value={setup.id}
                          className="bg-zinc-950 text-white"
                        >
                          {setup.name} · {setup.car_name || "Any car"} ·{" "}
                          {setup.track_name || "Any track"}
                        </option>
                      ))}
                    </optgroup>
                  ) : null}
                  {visibleRaceSetups.filter(
                    (setup: any) =>
                      !matchingRaceSetups.some(
                        (match: any) => match.id === setup.id,
                      ),
                  ).length > 0 ? (
                    <optgroup label="Other shared setups">
                      {visibleRaceSetups
                        .filter(
                          (setup: any) =>
                            !matchingRaceSetups.some(
                              (match: any) => match.id === setup.id,
                            ),
                        )
                        .map((setup: any) => (
                          <option
                            key={setup.id}
                            value={setup.id}
                            className="bg-zinc-950 text-white"
                          >
                            {setup.name} · {setup.car_name || "Any car"} ·{" "}
                            {setup.track_name || "Any track"}
                          </option>
                        ))}
                    </optgroup>
                  ) : null}
                </select>

                {selectedRaceSetup ? (
                  <div className="rounded-2xl border border-amber-900/70 bg-amber-950/30 p-4">
                    <p className="font-black text-amber-100">
                      {selectedRaceSetup.name}
                    </p>
                    <p className="mt-1 text-sm text-zinc-400">
                      {selectedRaceSetup.car_name || "Any car"} ·{" "}
                      {selectedRaceSetup.track_name || "Any track"}
                    </p>
                    {selectedRaceSetup.notes ? (
                      <p className="mt-2 text-sm text-zinc-300">
                        {selectedRaceSetup.notes}
                      </p>
                    ) : null}
                    {selectedRaceSetup.file_url ? (
                      <a
                        href={selectedRaceSetup.file_url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex rounded-xl bg-green-700 px-3 py-2 text-xs font-bold hover:bg-green-600"
                      >
                        Download Setup
                      </a>
                    ) : null}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-zinc-600 bg-zinc-900 p-4 text-sm text-zinc-500">
                    No setup attached to this race yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="grid items-stretch gap-6 xl:grid-cols-[0.42fr_1.58fr]">
          <section className="flex h-full flex-col rounded-lg border border-white/10 border-l-4 border-l-amber-500 bg-zinc-900 p-6 shadow-lg shadow-black/40">
            <div className="mb-5">
              <h3 className="text-2xl font-bold">Cars</h3>
              <p className="mt-1 text-sm text-zinc-400">
                Add cars to this race, then select one to view or save testing.
              </p>
            </div>

            <div className="mb-5 flex flex-col gap-3">
              <input
                value={raceAddCarSearch}
                list="race-add-car-options"
                onChange={(event) => {
                  const value = event.target.value;
                  setRaceAddCarSearch(value);
                  const match = iracingCars.find(
                    (car: IRacingCar) =>
                      normalizeSearchText(car.name) ===
                      normalizeSearchText(value),
                  );
                  setSelectedMasterCarId(match?.id || "");
                }}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    event.preventDefault();
                    resetRaceAddCarSearch();
                  }
                }}
                placeholder="Search and select a car"
                className="w-full rounded-md border border-white/10 bg-black/40 px-4 py-3 font-mono outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              />
              <datalist id="race-add-car-options">
                {filteredRaceAddCars.map((car: any) => (
                  <option key={car.id} value={car.name} />
                ))}
              </datalist>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={newRaceCarFuelTank}
                onChange={(event) => setNewRaceCarFuelTank(event.target.value)}
                placeholder="Fuel tank capacity"
                className="w-full rounded-md border border-white/10 bg-black/40 px-4 py-3 font-mono outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              />
              <button
                onClick={createCar}
                className="rounded-md bg-gradient-to-r from-amber-500 to-amber-400 px-5 py-3 font-black uppercase tracking-wide text-zinc-950 transition hover:from-amber-400 hover:to-amber-300"
              >
                Add Car
              </button>
            </div>

            <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
              {selectedRaceCars.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-zinc-600 bg-zinc-950 p-6 text-center">
                  <p className="font-semibold text-zinc-300">
                    No cars added yet.
                  </p>
                  <p className="mt-1 text-sm text-zinc-500">
                    Add a car above to begin testing.
                  </p>
                </div>
              ) : (
                selectedRaceCars.map((car: any) => (
                  <div
                    key={car.id}
                    className={`rounded-2xl border p-4 transition ${
                      selectedTestingCarId === car.id
                        ? "border-amber-500 bg-amber-950/30"
                        : "border-zinc-800 bg-zinc-950"
                    }`}
                  >
                    <button
                      onClick={() => setSelectedTestingCarId(car.id)}
                      className="block w-full text-left"
                    >
                      <span className="block truncate font-bold">
                        {car.name}
                      </span>
                      <span className="mt-1 block text-xs text-zinc-500">
                        Fuel tank: {car.fuel_tank ?? "Not set"}
                      </span>
                    </button>

                    {editingRaceCarId === car.id ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        <input
                          type="number"
                          min="0.01"
                          step="0.01"
                          value={editingRaceCarFuelTank}
                          onChange={(event) =>
                            setEditingRaceCarFuelTank(event.target.value)
                          }
                          className="min-w-[120px] flex-1 rounded-xl border border-white/10 bg-white/[0.07] px-3 py-2 text-sm outline-none focus:border-amber-400"
                        />
                        <button
                          onClick={() => saveRaceCarFuelTank(car)}
                          className="rounded-xl bg-green-700 px-3 py-2 text-xs font-bold hover:bg-green-600"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingRaceCarId(null)}
                          className="rounded-xl bg-zinc-700 px-3 py-2 text-xs font-bold hover:bg-zinc-600"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          onClick={() => {
                            setEditingRaceCarId(car.id);
                            setEditingRaceCarFuelTank(
                              String(car.fuel_tank || ""),
                            );
                          }}
                          className="rounded-xl bg-yellow-600 px-3 py-1 text-xs font-bold text-black hover:bg-yellow-500"
                        >
                          Edit Fuel
                        </button>
                        <button
                          onClick={() =>
                            setCompareRaceCarIds((prev) =>
                              prev.includes(car.id)
                                ? prev.filter((id) => id !== car.id)
                                : [...prev, car.id],
                            )
                          }
                          className={`rounded-xl px-3 py-1 text-xs font-bold ${compareRaceCarIds.includes(car.id) ? "bg-amber-600 text-white" : "bg-white/[0.08] text-zinc-200 hover:bg-white/[0.12]"}`}
                        >
                          {compareRaceCarIds.includes(car.id)
                            ? "Comparing"
                            : "Compare"}
                        </button>
                        <button
                          onClick={() =>
                            setDeleteConfirm({
                              title: `Delete ${car.name}?`,
                              onConfirm: () => deleteCar(car),
                            })
                          }
                          className="rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-3 py-1 text-xs font-bold hover:from-red-500 hover:to-rose-500"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="rounded-lg border border-white/10 border-l-4 border-l-amber-500 bg-zinc-900 p-6 shadow-lg shadow-black/40">
            <div className="mb-5">
              <h3 className="text-2xl font-bold">Add Baseline Test</h3>
              <p className="mt-1 text-sm text-zinc-400">
                Save a car/weather test under your own driver name. The schedule
                uses these baseline tests for timing.
              </p>
            </div>

            <div className="rounded-lg border border-zinc-700 border-l-4 border-l-amber-500 bg-zinc-950 p-5 shadow-lg shadow-black/40">
              <h4 className="mb-4 text-lg font-bold">
                {editingTestId ? "Edit Test" : "Add Baseline Test"}
              </h4>
              <div className="grid gap-4 md:grid-cols-3">
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-zinc-300">
                    Weather
                  </span>
                  <select
                    value={testForm.weather}
                    onChange={(event) =>
                      setTestForm((prev: any) => ({
                        ...prev,
                        weather: event.target.value,
                      }))
                    }
                    className="w-full rounded-md border border-white/10 bg-black/40 px-4 py-3 font-mono outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  >
                    {weatherOptions.map((weather) => (
                      <option key={weather} className="bg-zinc-950 text-white">
                        {weather}
                      </option>
                    ))}
                  </select>
                </label>

                {[
                  ["Avg Lap Seconds", "average_lap"],
                  ["Fuel Burn/Lap", "fuel_burn"],
                  ["Inlap Seconds", "inlap"],
                  ["Outlap Seconds", "outlap"],
                ].map(([label, key]) => (
                  <label key={key} className="space-y-2">
                    <span className="text-sm font-semibold text-zinc-300">
                      {label}
                    </span>
                    <input
                      value={(testForm as any)[key]}
                      onChange={(event) =>
                        setTestForm((prev: any) => ({
                          ...prev,
                          [key]: event.target.value,
                        }))
                      }
                      className="w-full rounded-md border border-white/10 bg-black/40 px-4 py-3 font-mono outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                    />
                  </label>
                ))}

                <label className="space-y-2 md:col-span-3">
                  <span className="text-sm font-semibold text-zinc-300">
                    Notes
                  </span>
                  <input
                    value={testForm.notes}
                    onChange={(event) =>
                      setTestForm((prev: any) => ({
                        ...prev,
                        notes: event.target.value,
                      }))
                    }
                    className="w-full rounded-md border border-white/10 bg-black/40 px-4 py-3 font-mono outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  />
                </label>

                <label className="space-y-2 md:col-span-3">
                  <span className="text-sm font-semibold text-zinc-300">
                    Setup File
                  </span>
                  <input
                    type="file"
                    accept=".sto,.zip,.json,.txt,.pdf"
                    onChange={(event) =>
                      setTeamSetupFile(event.target.files?.[0] || null)
                    }
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3 outline-none transition file:mr-4 file:rounded-xl file:border-0 file:bg-amber-600 file:px-4 file:py-2 file:font-bold file:text-white hover:file:bg-amber-500"
                  />
                  <p className="text-xs text-zinc-500">
                    {teamSetupFile
                      ? `Selected: ${teamSetupFile.name}`
                      : testForm.setup_file_name
                        ? `Current: ${testForm.setup_file_name}`
                        : "Optional. Upload the iRacing setup file used for this baseline test."}
                  </p>
                </label>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={saveCarTest}
                  className="rounded-md bg-gradient-to-r from-amber-500 to-amber-400 px-5 py-3 font-black uppercase tracking-wide text-zinc-950 transition hover:from-amber-400 hover:to-amber-300"
                >
                  {saveButtonLabel(
                    "race-baseline-test",
                    editingTestId ? "Update Test" : "Save Test",
                    "Saved",
                  )}
                </button>
                {editingTestId && (
                  <button
                    onClick={() => setEditingTestId(null)}
                    className="rounded-md border border-zinc-600 bg-zinc-800 px-5 py-3 font-bold uppercase tracking-wide text-zinc-200 transition hover:bg-zinc-700"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </div>
          </section>
        </div>

        {compareRaceCarIds.length >= 2 ? (
          <section className="rounded-lg border border-white/10 border-l-4 border-l-amber-500 bg-zinc-900 p-6 shadow-lg shadow-black/40">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="text-2xl font-bold">Compare Race Car Tests</h3>
                <p className="mt-1 text-sm text-zinc-400">
                  Comparing selected race cars by weather. Use the Compare
                  button on car cards to add/remove cars.
                </p>
              </div>
              <button
                onClick={() => setCompareRaceCarIds([])}
                className="rounded-2xl bg-zinc-700 px-4 py-2 text-sm font-bold hover:bg-zinc-600"
              >
                Clear Compare
              </button>
            </div>

            <div className="space-y-5">
              {weatherOptions
                .map((weather) => ({
                  weather,
                  tests: selectedRaceCarTests
                    .filter(
                      (test: any) =>
                        compareRaceCarIds.includes(test.car_id) &&
                        (test.weather || "Sunny") === weather,
                    )
                    .sort(
                      (a: any, b: any) =>
                        toNumber(a.average_lap, Number.POSITIVE_INFINITY) -
                        toNumber(b.average_lap, Number.POSITIVE_INFINITY),
                    ),
                }))
                .filter((group) => group.tests.length > 0)
                .map((group) => (
                  <div
                    key={group.weather}
                    className="rounded-lg border border-zinc-600 bg-black/35 p-5"
                  >
                    <h4 className="mb-4 text-xl font-black">{group.weather}</h4>
                    <div className="overflow-x-auto rounded-2xl border border-zinc-700">
                      <table className="w-full min-w-[780px] text-left text-sm">
                        <thead className="bg-zinc-900 text-xs uppercase tracking-wide text-zinc-500">
                          <tr>
                            <th className="px-4 py-3">Car</th>
                            <th className="px-4 py-3">Driver/Test Owner</th>
                            <th className="px-4 py-3">Avg Lap</th>
                            <th className="px-4 py-3">Stint Time</th>
                            <th className="px-4 py-3">Laps/Stint</th>
                            <th className="px-4 py-3">Fuel Tank</th>
                            <th className="px-4 py-3">Fuel Burn</th>
                            <th className="px-4 py-3">Notes</th>
                          </tr>
                        </thead>
                        <tbody>
                          {group.tests.map((test: any) => {
                            const summary = calculateTestSummary(test);
                            const member = selectedRaceMembers.find(
                              (item: any) => item.user_id === test.created_by,
                            );

                            return (
                              <tr
                                key={test.id}
                                className="border-t border-zinc-800"
                              >
                                <td className="px-4 py-3 font-bold">
                                  {selectedRaceCars.find(
                                    (car: any) => car.id === test.car_id,
                                  )?.name || "Unknown Car"}
                                </td>
                                <td className="px-4 py-3">
                                  {member
                                    ? profileName(member.profiles)
                                    : "Unknown"}
                                </td>
                                <td className="px-4 py-3">{summary.avgLap}</td>
                                <td className="px-4 py-3">
                                  {summary.stintTime}
                                </td>
                                <td className="px-4 py-3">
                                  {summary.lapsPerStint}
                                </td>
                                <td className="px-4 py-3">
                                  {test.fuel_tank ?? "—"}
                                </td>
                                <td className="px-4 py-3">
                                  {test.fuel_burn ?? "—"}/lap
                                </td>
                                <td className="px-4 py-3">
                                  {test.notes ? (
                                    <button
                                      onClick={() =>
                                        setNoteModalText(test.notes || "")
                                      }
                                      className="rounded-xl bg-zinc-700 px-3 py-2 text-xs font-bold hover:bg-zinc-600"
                                    >
                                      View Notes
                                    </button>
                                  ) : (
                                    <span className="text-zinc-600">—</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        ) : null}

        <section className="rounded-lg border border-white/10 border-l-4 border-l-amber-500 bg-zinc-900 p-6 shadow-lg shadow-black/40">
          <div className="mb-5">
            <h3 className="text-2xl font-bold">Driver Baseline Tests</h3>
            <p className="mt-1 text-sm text-zinc-400">
              Baseline tests are grouped by the driver who created them.
            </p>
          </div>

          <div>
            {carTestsForSelected.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-zinc-600 bg-zinc-950 p-8 text-center">
                <p className="font-semibold text-zinc-300">
                  No baseline tests saved for this car yet.
                </p>
                <p className="mt-1 text-sm text-zinc-500">
                  Save a test above or load one from the Testing Library.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {baselineTestGroups.map((group: any) => (
                  <div
                    key={group.id}
                    className="rounded-lg border border-white/10 bg-black/35 p-5"
                  >
                    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h4 className="text-xl font-black">{group.name}</h4>
                        <p className="mt-1 text-sm text-zinc-500">
                          {group.tests.length} baseline test
                          {group.tests.length === 1 ? "" : "s"} · {group.role}
                        </p>
                      </div>
                      <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-bold text-zinc-300">
                        Schedule timing source
                      </span>
                    </div>

                    <div className="overflow-x-auto rounded-lg border border-zinc-700 border-l-4 border-l-amber-500/70 bg-zinc-950 shadow-md shadow-black/30">
                      <table className="w-full min-w-[820px] text-left text-sm">
                        <thead className="bg-zinc-900 text-xs uppercase tracking-wide text-zinc-500">
                          <tr>
                            <th className="px-4 py-3">Weather</th>
                            <th className="px-4 py-3">Avg Lap</th>
                            <th className="px-4 py-3">Stint Time</th>
                            <th className="px-4 py-3">Laps/Stint</th>
                            <th className="px-4 py-3">Fuel Tank</th>
                            <th className="px-4 py-3">Fuel Burn</th>
                            <th className="px-4 py-3">Notes</th>
                            <th className="px-4 py-3">Setup</th>
                            <th className="px-4 py-3">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {group.tests.map((test: any) => {
                            const summary = calculateTestSummary(test);
                            const canEditThisBaseline =
                              test.created_by === userId ||
                              canManageTeamById(test.team_id);

                            return (
                              <tr
                                key={test.id}
                                className="border-t border-zinc-900"
                              >
                                <td className="px-4 py-3 font-semibold">
                                  {test.weather || "Sunny"}
                                </td>
                                <td className="px-4 py-3">{summary.avgLap}</td>
                                <td className="px-4 py-3">
                                  {summary.stintTime}
                                </td>
                                <td className="px-4 py-3">
                                  {summary.lapsPerStint}
                                </td>
                                <td className="px-4 py-3">
                                  {test.fuel_tank ?? "—"}
                                </td>
                                <td className="px-4 py-3">
                                  {test.fuel_burn ?? "—"}/lap
                                </td>
                                <td className="px-4 py-3">
                                  {test.notes ? (
                                    <button
                                      onClick={() =>
                                        setNoteModalText(test.notes || "")
                                      }
                                      className="rounded-xl bg-zinc-700 px-3 py-2 text-xs font-bold hover:bg-zinc-600"
                                    >
                                      View Notes
                                    </button>
                                  ) : (
                                    <span className="text-zinc-600">—</span>
                                  )}
                                </td>
                                <td className="px-4 py-3">
                                  {test.setup_file_url ? (
                                    <a
                                      href={test.setup_file_url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="rounded-xl bg-green-700 px-3 py-2 text-xs font-bold hover:bg-green-600"
                                    >
                                      Setup
                                    </a>
                                  ) : (
                                    <span className="text-zinc-600">—</span>
                                  )}
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex gap-2">
                                    {canEditThisBaseline ? (
                                      <>
                                        <button
                                          onClick={() => editCarTest(test)}
                                          className="rounded-xl bg-yellow-600 px-3 py-2 text-xs font-bold text-black"
                                        >
                                          Edit
                                        </button>
                                        <button
                                          onClick={() =>
                                            setDeleteConfirm({
                                              title:
                                                "Delete this baseline test?",
                                              onConfirm: () =>
                                                deleteCarTest(test),
                                            })
                                          }
                                          className="rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-3 py-2 text-xs font-bold"
                                        >
                                          Delete
                                        </button>
                                      </>
                                    ) : (
                                      <span className="rounded-xl bg-white/[0.05] px-3 py-2 text-xs font-bold text-zinc-500">
                                        View only
                                      </span>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    );
  }

  function availabilityTab() {
    const availabilitySlots = getAvailabilityHourSlots(selectedRace);
    const selectedScheduleCar =
      selectedRaceCars.find(
        (car: any) => car.id === raceForm.selected_car_id,
      ) || null;
    const selectedCarName = selectedScheduleCar?.name || "No car selected";
    const teamName = selectedRace?.team_id
      ? getTeamById(teams, selectedRace.team_id)?.name || "Unknown Team"
      : "No Team Yet";
    const availabilityTimeZones = Array.from(
      new Set(
        [raceForm.main_time_zone || "America/New_York", ...raceForm.extra_time_zones].filter(Boolean),
      ),
    );

    function availabilityBadgeClass(status: string | null | undefined) {
      const value = status || "Available to Drive";
      if (value === "Want to Drive")
        return "border-amber-700 bg-amber-950/70 text-amber-200";
      if (value === "Available to Drive")
        return "border-green-700 bg-green-950/60 text-green-200";
      if (value === "Prefer Not to Drive")
        return "border-yellow-700 bg-yellow-950/60 text-yellow-200";
      if (value === "Unavailable to Drive")
        return "border-red-700 bg-red-950/70 text-red-200";
      return "border-zinc-600 bg-zinc-800 text-zinc-200";
    }

    return (
      <section className="space-y-6">
        <div className="rounded-lg border border-white/10 border-l-4 border-l-amber-500 bg-zinc-900 p-6 shadow-lg shadow-black/40">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className={sectionHeaderLabel}>Driver Planning</p>
              <h3 className="mt-3 text-4xl font-black tracking-tight">
                Availability
              </h3>
              <p className="mt-2 max-w-3xl text-sm text-zinc-400">
                Each teammate can mark availability in one-hour blocks from race
                start to race end. The schedule checks the full stint time, so
                weather or added time can still trigger a warning if a stint
                runs into an unavailable hour.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 xl:grid-cols-[1fr_1.1fr]">
            <div className="rounded-lg border border-zinc-700 border-l-4 border-l-amber-500/70 bg-zinc-950 p-4 shadow-md shadow-black/30">
              <p className="text-sm font-black text-amber-100">
                Your stint preferences
              </p>
              <p className="mt-1 text-xs text-zinc-400">
                These help the smart schedule balance drivers. If you choose
                Doesn’t matter, the app defaults to an even stint split and
                double-stint style.
              </p>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
                    Preferred stint count
                  </span>
                  <select
                    value={preferredStintCount}
                    onChange={(event) =>
                      setPreferredStintCount(event.target.value)
                    }
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3 font-bold outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20"
                  >
                    <option value="" className="bg-zinc-950 text-white">
                      Doesn’t matter
                    </option>
                    {Array.from(
                      {
                        length: Math.max(
                          12,
                          scheduleRows.length || availabilitySlots.length || 12,
                        ),
                      },
                      (_, index) => index + 1,
                    ).map((count) => (
                      <option
                        key={count}
                        value={count}
                        className="bg-zinc-950 text-white"
                      >
                        {count} stint{count === 1 ? "" : "s"}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
                    Preferred stint type
                  </span>
                  <select
                    value={preferredStintType}
                    onChange={(event) =>
                      setPreferredStintType(event.target.value)
                    }
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3 font-bold outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20"
                  >
                    {idealStintOptions.map((option) => (
                      <option
                        key={option}
                        value={option}
                        className="bg-zinc-950 text-white"
                      >
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <button
                onClick={saveStintPreferences}
                className="mt-4 rounded-md bg-gradient-to-r from-amber-500 to-amber-400 px-5 py-3 font-black uppercase tracking-wide text-zinc-950 transition hover:from-amber-400 hover:to-amber-300"
              >
                Save Stint Preferences
              </button>

              <p className="mt-2 text-xs text-zinc-500">
                Current saved:{" "}
                {getMyStintPreference().count || "Doesn’t matter"} · Type:{" "}
                {getMyStintPreference().type || "Doesn’t matter"}
              </p>
            </div>

            <div className="rounded-lg border border-zinc-700 border-l-4 border-l-amber-500/70 bg-zinc-950 p-4 shadow-md shadow-black/30">
              <p className="mb-3 text-sm font-bold text-zinc-200">
                Availability meanings
              </p>
              <div className="flex flex-wrap gap-2">
                {availabilityOptions.map((option) => (
                  <span
                    key={option}
                    className={`rounded-full border px-3 py-1 text-xs font-bold ${availabilityBadgeClass(option)}`}
                  >
                    {option}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <section className="rounded-lg border border-white/10 border-l-4 border-l-amber-500 bg-zinc-900 p-6 shadow-lg shadow-black/40">
          <div className="mb-5">
            <h3 className="text-2xl font-bold">Team Stint Preferences</h3>
            <p className="mt-1 text-sm text-zinc-400">
              These are the saved stint preferences for each teammate. The smart
              schedule uses these when balancing drivers.
            </p>
          </div>

          {selectedRaceMembers.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-600 bg-zinc-950 p-8 text-center text-sm text-zinc-500">
              No drivers loaded for this race.
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {selectedRaceMembers.map((member: any) => {
                const pref = getDriverStintPreference(member.user_id);
                const isMe = member.user_id === userId;

                return (
                  <div
                    key={member.user_id}
                    className={`rounded-2xl border p-4 ${isMe ? "border-amber-800 bg-amber-950/25" : "border-zinc-800 bg-zinc-950"}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-black text-zinc-100">
                          {profileName(member.profiles)}
                          {isMe ? " (You)" : ""}
                        </p>
                        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-zinc-500">
                          {roleLabel(member.role)}
                        </p>
                      </div>
                      <span className="rounded-full bg-white/[0.08] px-3 py-1 text-[10px] font-bold text-zinc-300">
                        {pref.count
                          ? `${pref.count} stint${pref.count === "1" ? "" : "s"}`
                          : "Even split"}
                      </span>
                    </div>
                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      <div className="rounded-xl border border-zinc-800 bg-black/20 p-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
                          Count
                        </p>
                        <p className="mt-1 font-bold">
                          {pref.count || "Doesn’t matter"}
                        </p>
                      </div>
                      <div className="rounded-xl border border-zinc-800 bg-black/20 p-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
                          Type
                        </p>
                        <p className="mt-1 font-bold">
                          {pref.type || "Doesn’t matter"}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="rounded-lg border border-white/10 border-l-4 border-l-amber-500 bg-zinc-900 p-6 shadow-lg shadow-black/40">
          <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-2xl font-bold">Team Availability Table</h3>
              <p className="text-sm text-zinc-400">
                You can edit your own column. Rows are one-hour blocks from race
                start to race end, not generated schedule stints. Times are labeled
                by their time zone.
              </p>
            </div>
            <span className="rounded-full bg-white/[0.08] px-3 py-1 text-xs font-bold text-zinc-300">
              {availabilitySlots.length} hourly rows
            </span>
          </div>

          {selectedRaceMembers.length === 0 ? (
            <div className="rounded-lg border border-dashed border-zinc-700 bg-zinc-950/60 p-10 text-center">
              <p className="text-lg font-semibold">
                No drivers loaded for this race.
              </p>
              <p className="mt-2 text-sm text-zinc-500">
                Choose a team in Race Data to show driver availability.
              </p>
            </div>
          ) : availabilitySlots.length === 0 ? (
            <div className="rounded-lg border border-dashed border-zinc-700 bg-zinc-950/60 p-10 text-center">
              <p className="text-lg font-semibold">No availability rows yet.</p>
              <p className="mt-2 text-sm text-zinc-500">
                Set a race start time and race length in Race Data first.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-zinc-700 border-l-4 border-l-amber-500/70 bg-zinc-950 shadow-md shadow-black/30">
              <table className="min-w-full border-collapse text-sm">
                <thead className="bg-zinc-900 text-xs uppercase tracking-wide text-zinc-500">
                  <tr>
                    <th className="border-b border-zinc-800 px-4 py-3 text-left">
                      Hour
                    </th>
                    {availabilityTimeZones.map((zone: string) => (
                      <th
                        key={zone}
                        className="min-w-[170px] border-b border-zinc-800 px-4 py-3 text-left"
                      >
                        <div className="flex flex-col">
                          <span className="font-bold text-zinc-300">
                            {shortTimeZoneLabel(zone)}
                          </span>
                          <span className="mt-1 text-[10px] normal-case tracking-normal text-zinc-600">
                            {zone}
                          </span>
                        </div>
                      </th>
                    ))}
                    {selectedRaceMembers.map((member: any) => (
                      <th
                        key={member.user_id}
                        className="min-w-[210px] border-b border-zinc-800 px-4 py-3 text-left"
                      >
                        <div className="flex flex-col">
                          <span className="font-bold text-zinc-300">
                            {profileName(member.profiles)}
                          </span>
                          <span className="mt-1 text-[10px] text-zinc-600">
                            {roleLabel(member.role)}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {availabilitySlots.map((slot) => (
                    <tr
                      key={slot.slot}
                      className="border-b border-zinc-900 last:border-b-0"
                    >
                      <td className="whitespace-nowrap px-4 py-3 font-bold text-zinc-200">
                        Hour {slot.slot}
                      </td>
                      {availabilityTimeZones.map((zone: string) => (
                        <td
                          key={zone}
                          className="whitespace-nowrap border-l border-zinc-900 px-4 py-3 text-zinc-400"
                        >
                          <div className="font-semibold text-zinc-300">
                            {formatInZone(slot.start, zone)} - {formatInZone(slot.end, zone)}
                          </div>
                          <div className="mt-1 text-[10px] uppercase tracking-[0.16em] text-zinc-600">
                            {shortTimeZoneLabel(zone)}
                          </div>
                        </td>
                      ))}
                      {selectedRaceMembers.map((member: any) => {
                        const saved = availability.find(
                          (item: any) =>
                            item.race_id === selectedRace?.id &&
                            item.driver_id === member.user_id &&
                            item.stint_number === slot.slot,
                        );
                        const canEdit = member.user_id === userId;
                        const status = saved?.status || "Available to Drive";

                        return (
                          <td
                            key={member.user_id}
                            className="px-4 py-3 align-middle"
                          >
                            {canEdit ? (
                              <select
                                value={status}
                                onChange={(event) =>
                                  saveAvailability(
                                    slot.slot,
                                    event.target.value,
                                  )
                                }
                                className={`w-full rounded-xl border px-3 py-2 text-sm font-semibold outline-none ${availabilityBadgeClass(status)}`}
                              >
                                {availabilityOptions.map((option) => (
                                  <option
                                    key={option}
                                    className="bg-zinc-950 text-white"
                                  >
                                    {option}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <span
                                className={`inline-flex rounded-xl border px-3 py-2 text-sm font-semibold ${availabilityBadgeClass(status)}`}
                              >
                                {status}
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </section>
    );
  }

  function scheduleWarningRows(rows: ScheduleRow[]) {
    return rows.filter((row) => row.warning);
  }

  function scheduleWarningKey(row: ScheduleRow) {
    return `${selectedRace?.id || "race"}-${row.stint}-${row.warning || ""}`;
  }

  function isScheduleWarningOverridden(row: ScheduleRow) {
    if (!row.warning) return false;
    return Boolean(overriddenScheduleWarnings[scheduleWarningKey(row)]);
  }

  function activeScheduleWarningRows(rows: ScheduleRow[]) {
    return rows.filter(
      (row) => row.warning && !isScheduleWarningOverridden(row),
    );
  }

  function scheduleDriverWorkload(rows: ScheduleRow[]) {
    const counts: Record<string, number> = {};
    rows.forEach((row) => {
      if (row.driverId) counts[row.driverId] = (counts[row.driverId] || 0) + 1;
    });
    return counts;
  }

  function scheduleStatusClass(status: string | null | undefined) {
    if (status === "Want to Drive")
      return "border-amber-700 bg-amber-950/70 text-amber-200";
    if (status === "Available to Drive")
      return "border-green-700 bg-green-950/60 text-green-200";
    if (status === "Prefer Not to Drive")
      return "border-yellow-700 bg-yellow-950/60 text-yellow-200";
    if (status === "Unavailable to Drive")
      return "border-red-700 bg-red-950/70 text-red-200";
    return "border-zinc-600 bg-zinc-800 text-zinc-200";
  }

  function scheduleWarningBadgeClass(kind: string) {
    if (kind === "Availability conflict")
      return "border-red-700 bg-red-950/70 text-red-100";
    if (kind === "Prefer not")
      return "border-yellow-700 bg-yellow-950/70 text-yellow-100";
    if (kind === "No baseline")
      return "border-orange-700 bg-orange-950/70 text-orange-100";
    if (kind === "Weather fallback")
      return "border-purple-700 bg-purple-950/70 text-purple-100";
    if (kind === "Manual override")
      return "border-amber-700 bg-amber-950/70 text-amber-100";
    if (kind === "Completed")
      return "border-green-700 bg-green-950/70 text-green-100";
    return "border-zinc-600 bg-zinc-800 text-zinc-100";
  }

  function scheduleWarningBadges(row: ScheduleRow, isComplete: boolean) {
    const badges: string[] = [];

    if (isComplete) badges.push("Completed");
    if (row.pickReason === "Manual override") badges.push("Manual override");
    if (
      row.driverStatus === "Unavailable to Drive" ||
      row.warning?.includes("unavailable")
    )
      badges.push("Availability conflict");
    if (
      row.driverStatus === "Prefer Not to Drive" ||
      row.warning?.includes("preferred not")
    )
      badges.push("Prefer not");
    if (row.warning?.includes("No baseline")) badges.push("No baseline");
    if (row.warning?.includes("fallback")) badges.push("Weather fallback");

    if (!badges.length && row.warning) badges.push("Warning");

    return [...new Set(badges)];
  }

  function scheduleTab() {
    const zones = [
      raceForm.main_time_zone,
      ...raceForm.extra_time_zones,
    ].filter(Boolean);
    const selectedScheduleCar =
      selectedRaceCars.find(
        (car: any) => car.id === raceForm.selected_car_id,
      ) || null;
    const selectedCarName = selectedScheduleCar?.name || "No car selected";
    const teamName = selectedRace?.team_id
      ? getTeamById(teams, selectedRace.team_id)?.name || "Unknown Team"
      : "No Team Yet";
    const completedRows = scheduleRows.filter(
      (row) =>
        row.completed ||
        scheduleAdjustments.some(
          (adjustment) =>
            adjustment.stint_number === row.stint && adjustment.completed,
        ),
    ).length;
    const warningRows = activeScheduleWarningRows(scheduleRows);
    const workload = scheduleDriverWorkload(scheduleRows);
    const missingBaseline = scheduleRows.some(
      (row) => row.warning === "No baseline test for this car/weather.",
    );
    const driverWarnings = warningRows.filter(
      (row) => row.warning !== "No baseline test for this car/weather.",
    );
    const scheduleTh =
      "border-t border-r border-b border-zinc-600 bg-black/80 px-3 py-3 text-center align-middle font-black";
    const scheduleSubTh =
      "border-r border-b border-zinc-600 bg-black/80 px-3 py-2 text-center align-middle font-black";
    const scheduleTd =
      "border-r border-b border-zinc-600 px-3 py-3 align-middle";
    const scheduleTdTight =
      "border-r border-b border-zinc-600 px-2 py-2 align-middle whitespace-nowrap";

    return (
      <section className="relative left-1/2 w-[calc(100vw-18rem)] max-w-none -translate-x-1/2 space-y-6">
        <div className="rounded-lg border border-white/10 border-l-4 border-l-amber-500 bg-zinc-900 p-6 shadow-lg shadow-black/40">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className={sectionHeaderLabel}>Smart Schedule</p>
              <h3 className="mt-3 text-4xl font-black tracking-tight">
                Stint Schedule
              </h3>
              <p className="mt-2 max-w-4xl text-sm text-zinc-400">
                The auto schedule uses teammate pace data, selected weather, and
                manual overrides. Manual driver changes override the auto-pick.
              </p>
            </div>
          </div>
        </div>

        {warningRows.length > 0 ? (
          <section className="rounded-lg border border-purple-800 bg-purple-950/20 p-5 shadow-2xl shadow-black/20">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className={sectionHeaderLabel}>Schedule Warnings</p>
                <h3 className="mt-2 text-2xl font-black">
                  {warningRows.length} row{warningRows.length === 1 ? "" : "s"}{" "}
                  need review
                </h3>
                <p className="mt-1 text-sm text-yellow-100/80">
                  Rows with active warnings are highlighted yellow. Press
                  Override on a row to acknowledge it and return it to normal.
                </p>
              </div>
              <button
                onClick={() =>
                  setOverriddenScheduleWarnings((prev) => {
                    const next = { ...prev };
                    warningRows.forEach((row) => {
                      next[scheduleWarningKey(row)] = true;
                    });
                    return next;
                  })
                }
                className="rounded-2xl bg-yellow-600 px-4 py-2 text-sm font-black text-black hover:bg-yellow-500"
              >
                Override All
              </button>
            </div>

            <div className="mt-4 grid gap-2 lg:grid-cols-2">
              {warningRows.map((row) => (
                <div
                  key={scheduleWarningKey(row)}
                  className="rounded-2xl border border-yellow-800/60 bg-black/25 p-3 text-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-black text-yellow-100">
                      Stint #{row.stint}
                    </p>
                    <button
                      onClick={() =>
                        setOverriddenScheduleWarnings((prev) => ({
                          ...prev,
                          [scheduleWarningKey(row)]: true,
                        }))
                      }
                      className="rounded-xl bg-yellow-600 px-3 py-1 text-xs font-black text-black hover:bg-yellow-500"
                    >
                      Override
                    </button>
                  </div>
                  <p className="mt-1 text-yellow-100/80">{row.warning}</p>
                  <p className="mt-1 text-xs text-zinc-400">
                    Driver:{" "}
                    {selectedRaceMembers.find(
                      (member: any) => member.user_id === row.driverId,
                    )?.profiles
                      ? profileName(
                          selectedRaceMembers.find(
                            (member: any) => member.user_id === row.driverId,
                          )?.profiles,
                        )
                      : "Unknown"}{" "}
                    · Weather: {row.weather}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <div className="rounded-lg border border-white/10 border-l-4 border-l-amber-500 bg-zinc-900 p-6 shadow-lg shadow-black/40">
          <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-2xl font-bold">Schedule Table</h3>
              <p className="text-sm text-zinc-400">
                Change drivers, weather, added time, actual end times, and
                completion status.
              </p>
            </div>
            <span className="rounded-full bg-white/[0.08] px-3 py-1 text-xs font-bold text-zinc-300">
              {scheduleRows.length} rows
            </span>
          </div>

          <div className="mb-5 grid gap-4 xl:grid-cols-[1fr_1fr]">
            <div className="rounded-lg border border-zinc-700 border-l-4 border-l-amber-500/70 bg-zinc-950 p-4 shadow-md shadow-black/30 text-sm text-amber-100">
              <p>
                <span className="font-bold">Schedule logic:</span> The app
                chooses drivers using saved availability, stint preferences,
                driver-owned baseline tests, selected weather, and manual
                overrides. Weather changes update timing automatically.
              </p>
              <p className="mt-2 text-xs text-amber-200/80">
                <span className="font-bold">Clean Regenerate clears:</span>{" "}
                manual drivers, completed flags, added time, and actual end
                times.
              </p>
              <p className="mt-1 text-xs text-amber-200/80">
                <span className="font-bold">Clean Regenerate keeps:</span> saved
                weather, race data, testing data, and availability.
              </p>
              <p className="mt-1 text-xs text-amber-200/80">
                Tip: weather timing changes only show clearly if you have
                separate baseline tests for that car/weather, like Sunny and
                Heavy Rain.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={regenerateSchedule}
                  className="rounded-xl bg-gradient-to-r from-amber-600 to-amber-600 px-4 py-2 font-bold text-white transition hover:from-amber-500 hover:to-amber-500"
                >
                  Clean Regenerate
                </button>
                <button
                  onClick={downloadScheduleCsv}
                  className="rounded-xl bg-green-700 px-4 py-2 font-bold text-white transition hover:bg-green-600"
                >
                  Export CSV
                </button>
                <button
                  onClick={openPrintableSchedule}
                  className="rounded-xl bg-zinc-700 px-4 py-2 font-bold text-white transition hover:bg-zinc-600"
                >
                  Print/PDF
                </button>
              </div>
            </div>

            <div className="rounded-lg border border-zinc-700 border-l-4 border-l-amber-500/70 bg-zinc-950 p-4 shadow-md shadow-black/30">
              <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-bold text-zinc-200">
                  Driver workload
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setActiveRaceTab("Fuel Calc")}
                    className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-zinc-950 shadow-lg shadow-amber-950/40 transition hover:bg-amber-400"
                  >
                    ⛽ Fuel Calc
                  </button>
                  <button
                    onClick={() => setActiveRaceTab("Live Strategy")}
                    className="rounded-xl bg-purple-700 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-white shadow-lg shadow-purple-950/40 transition hover:bg-purple-600"
                  >
                    Open Live Strategy
                  </button>
                </div>
              </div>
              <div className="mb-4 rounded-2xl border border-purple-700/70 bg-purple-950/30 p-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-purple-300">
                      Live Strategy
                    </p>
                    <p className="mt-1 text-xs leading-5 text-zinc-300">
                      Opens as its own race tab so the schedule table does not move down.
                    </p>
                  </div>
                  <p className="text-xs text-purple-100/85">
                    {selectedCarName} ·{" "}
                    {selectedScheduleCar?.fuel_tank
                      ? `${selectedScheduleCar.fuel_tank} L`
                      : "Fuel tank not set"}
                  </p>
                </div>
              </div>
              {selectedRaceMembers.length === 0 ? (
                <p className="text-sm text-zinc-500">No team drivers loaded.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {selectedRaceMembers.map((member: any) => (
                    <span
                      key={member.user_id}
                      className="rounded-full bg-white/[0.08] px-3 py-1 text-xs font-bold text-zinc-300"
                    >
                      {profileName(member.profiles)}:{" "}
                      {workload[member.user_id] || 0}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="w-full overflow-x-auto rounded-lg border border-zinc-700 border-l-4 border-l-amber-500/70 bg-zinc-950 shadow-md shadow-black/30">
            <table className="min-w-max w-full border-separate border-spacing-0 text-[11px] 2xl:text-sm">
              <thead className="bg-zinc-950">
                <tr>
                  <th
                    rowSpan={2}
                    className={`${scheduleTh} border-l w-[90px] min-w-[90px]`}
                  >
                    Stint
                  </th>
                  <th
                    rowSpan={2}
                    className={`${scheduleTh} w-[140px] min-w-[140px]`}
                  >
                    Driver
                  </th>
                  <th
                    rowSpan={2}
                    className={`${scheduleTh} w-[150px] min-w-[150px]`}
                  >
                    Weather
                  </th>
                  {zones.map((zone: string) => (
                    <th
                      key={zone}
                      colSpan={2}
                      className={`${scheduleTh} border-l`}
                    >
                      {zone}
                    </th>
                  ))}
                  <th colSpan={2} className={`${scheduleTh} border-l`}>
                    Sim Time
                  </th>
                  <th
                    rowSpan={2}
                    className={`${scheduleTh} border-l w-[120px] min-w-[120px] whitespace-nowrap`}
                  >
                    Add Time
                  </th>
                  <th
                    rowSpan={2}
                    className={`${scheduleTh} w-[150px] min-w-[150px] whitespace-nowrap`}
                  >
                    Actual End
                  </th>
                  <th
                    rowSpan={2}
                    className={`${scheduleTh} w-[150px] min-w-[150px] whitespace-nowrap`}
                  >
                    Complete
                  </th>
                </tr>
                <tr>
                  {zones.map((zone: string) => (
                    <FragmentHeaders key={zone} />
                  ))}
                  <th className={`${scheduleSubTh} border-l`}>Start</th>
                  <th className={scheduleSubTh}>End</th>
                </tr>
              </thead>
              <tbody>
                {scheduleRows.map((row) => {
                  const isComplete =
                    row.completed ||
                    scheduleAdjustments.some(
                      (adjustment) =>
                        adjustment.stint_number === row.stint &&
                        adjustment.completed,
                    );

                  const hasActiveWarning = Boolean(
                    row.warning && !isScheduleWarningOverridden(row),
                  );

                  return (
                    <tr
                      key={row.stint}
                      className={
                        isComplete
                          ? "bg-green-800/70 text-white shadow-[inset_4px_0_0_rgba(34,197,94,1)]"
                          : hasActiveWarning
                            ? "bg-yellow-950/40 shadow-[inset_4px_0_0_rgba(234,179,8,1)] hover:bg-yellow-950/55"
                            : "hover:bg-zinc-900/80"
                      }
                    >
                      <td
                        className={`${scheduleTd} border-l text-center font-black text-zinc-200`}
                      >
                        <div>#{row.stint}</div>
                        {hasActiveWarning ? (
                          <button
                            onClick={() =>
                              setOverriddenScheduleWarnings((prev) => ({
                                ...prev,
                                [scheduleWarningKey(row)]: true,
                              }))
                            }
                            className="mt-2 rounded-lg bg-yellow-600 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-black hover:bg-yellow-500"
                          >
                            Override
                          </button>
                        ) : null}
                      </td>
                      <td className={`${scheduleTd} whitespace-nowrap`}>
                        <select
                          value={row.driverId || ""}
                          onChange={(event) =>
                            updateScheduleDriverLocked(
                              row.stint,
                              event.target.value || null,
                            )
                          }
                          className="w-full rounded-xl border border-white/10 bg-white/[0.07] px-2 py-2 font-semibold outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20"
                        >
                          {selectedRaceMembers.map((member: any) => (
                            <option
                              key={member.user_id}
                              value={member.user_id}
                              className="bg-zinc-950 text-white"
                            >
                              {profileName(member.profiles)}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className={`${scheduleTd} whitespace-nowrap`}>
                        <select
                          value={row.weather}
                          onChange={(event) =>
                            updateStintWeather(row.stint, event.target.value)
                          }
                          className="w-full rounded-xl border border-white/10 bg-white/[0.07] px-2 py-2 font-semibold outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20"
                        >
                          {weatherOptions.map((weather) => (
                            <option
                              key={weather}
                              className="bg-zinc-950 text-white"
                            >
                              {weather}
                            </option>
                          ))}
                        </select>
                      </td>

                      {zones.map((zone: string) => (
                        <FragmentCells
                          key={zone}
                          start={formatInZone(row.start, zone)}
                          end={formatInZone(row.end, zone)}
                        />
                      ))}

                      <td
                        className={`${scheduleTd} border-l whitespace-nowrap font-medium`}
                      >
                        {format12(row.simStart)}
                      </td>
                      <td
                        className={`${scheduleTd} whitespace-nowrap font-medium`}
                      >
                        {format12(row.simEnd)}
                      </td>

                      <td
                        className={`${scheduleTd} border-l w-[120px] min-w-[120px]`}
                      >
                        <input
                          defaultValue={row.addSeconds || ""}
                          onChange={(event) =>
                            updateScheduleAdjustment(row.stint, {
                              add_seconds: toNumber(event.target.value, 0),
                            })
                          }
                          placeholder="+ sec"
                          className="w-full rounded-xl border border-white/10 bg-white/[0.07] px-2 py-2 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20"
                        />
                      </td>
                      <td className={`${scheduleTd} w-[150px] min-w-[150px]`}>
                        <input
                          type="time"
                          defaultValue={row.actualEndTime}
                          onChange={(event) =>
                            updateScheduleAdjustment(row.stint, {
                              actual_end_time: event.target.value || null,
                            })
                          }
                          title={`Actual end in ${raceForm.main_time_zone || selectedRace?.main_time_zone || "main time zone"}`}
                          className="w-full rounded-xl border border-white/10 bg-white/[0.07] px-2 py-2 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20"
                        />
                      </td>
                      <td className={`${scheduleTd} w-[150px] min-w-[150px]`}>
                        <button
                          onClick={() => markCompleted(row)}
                          className={`w-full rounded-xl px-3 py-2 font-bold whitespace-nowrap transition ${
                            isComplete
                              ? "bg-zinc-700 text-zinc-100 hover:bg-zinc-600"
                              : "bg-green-600 text-white hover:from-green-500 hover:to-emerald-400"
                          }`}
                        >
                          {isComplete ? "Undo" : "Complete"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    );
  }

  if (selectedRaceId) return raceWorkspace();

  if (activePage === "Home") return homePage();
  if (activePage === "Teams") return teamsPage();
  if (activePage === "Testing") return testingLibraryPage();
  if (activePage === "Setups") return setupsPage();
  if (activePage === "Calendar") return calendarPage();
  if (activePage === "Templates") return templatesPage();
  if (activePage === "Exports") return exportsPage();
  if (activePage === "Settings") return settingsPage();
  if (activePage === "Requests") return requestsPage();
  if (activePage === "Help") return helpPage();

  return placeholderPage(activePage);
}

function FragmentHeaders() {
  return (
    <>
      <th className="border-l border-r border-b border-zinc-600 bg-black/80 px-2 py-2 text-center font-black">
        Start
      </th>
      <th className="border-r border-b border-zinc-600 bg-black/80 px-2 py-2 text-center font-black">
        End
      </th>
    </>
  );
}

function FragmentCells({ start, end }: { start: string; end: string }) {
  return (
    <>
      <td className="border-l border-r border-b border-zinc-600 px-2 py-2 whitespace-nowrap">
        {start}
      </td>
      <td className="border-r border-b border-zinc-600 px-2 py-2 whitespace-nowrap">
        {end}
      </td>
    </>
  );
}
