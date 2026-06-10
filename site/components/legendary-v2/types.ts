/**
 * Type definitions shared across the legendary-v2 component system.
 *
 * Source of truth: docs/legendary/data-model.md §3–§5.
 * Changes here should be mirrored in the spec doc.
 */

// ============================================================================
// Fixed enums
// ============================================================================

export type HeroType = "MONUMENT" | "SPIKE" | "LAYERED" | "ABSENCE";
export type DisplayPairing = "CLASSICAL" | "AUSTERE" | "VERNACULAR";
export type VoiceRegister = "CLINICAL" | "REVERENT" | "ROMANTIC" | "SEVERE" | "WRY";
export type PhotoTier = "A" | "B";
export type PhotographyStatus = "tier_a_commissioned" | "tier_b_only" | "hybrid";

export const AUDIENCES = [
  "surfers",
  "spectators",
  "photographers",
  "geology",
  "ecology",
  "history",
  "culture",
  "safety",
  "operational",
  "families",
  "accessibility",
] as const;
export type Audience = (typeof AUDIENCES)[number];

export const AUDIENCE_LABELS: Record<Audience, string> = {
  surfers: "For Surfers",
  spectators: "For Spectators",
  photographers: "For Photographers",
  geology: "For Geology Nerds",
  ecology: "Ecology",
  history: "History",
  culture: "Culture",
  safety: "Safety",
  operational: "Logistics",
  families: "Families",
  accessibility: "Access",
};

// ============================================================================
// Composition (composition.json)
// ============================================================================

export interface Levers {
  primary_color: string;
  supporting_color: string;
  hero_type: HeroType;
  display_pairing: DisplayPairing;
  voice_register: VoiceRegister;
  motif_path: string;
  photo_tone: string;
}

export interface SpokeDeclaration {
  slug: string;
  type:
    | "deep_dive"
    | "audience_guide"
    | "event"
    | "anthology"
    | "honest_reckoning_expansion"
    | "operational_essay"
    | "photo_essay";
}

export interface Composition {
  slug: string;
  beach_name: string;
  version: string;                          // "0.7", "1.0"
  tier: 1 | 2;
  spike?: string;                           // Tier 1
  spike_statement?: string;                 // Tier 1
  subtitle?: string;                        // Tier 2
  levers: Levers;
  byline: string;                           // "Written by Erin Rose"
  sections: string[];
  spokes?: SpokeDeclaration[];

  // Flags
  reference_implementation?: boolean;
  reference_implementation_tier_2?: boolean;
  motif_cultural_clearance_required?: boolean;
  photography_grading_status?: PhotographyStatus;
}

// ============================================================================
// Images (meta.json)
// ============================================================================

export interface SectionImage {
  url: string;
  thumbnail?: string;
  title: string;
  author?: string;
  license: string;
  source_url?: string;
  width: number;
  height: number;
  tier: PhotoTier;
  role?: string;
}

export interface BeachMeta {
  tier: 1 | 2;
  showcase: boolean;
  images: {
    hero: SectionImage;
    section: Record<string, SectionImage>;
    gallery: SectionImage[];
  };
}

// ============================================================================
// Showcase content (showcase.json)
// ============================================================================

export interface TimelineEvent {
  year: number;
  month: number | null;
  event_type: string;
  title: string;
  description: string;
  wiki_url: string | null;
  source: string;
  image_role?: string;
}

export interface Zone {
  zone_code: string;
  name: string;
  position_along_beach_pct: number;
  lat: number;
  lng: number;
  character: string;
  best_for: string | null;
  notes: string | null;
}

export interface Landmark {
  name: string;
  landmark_type: string;
  year_built: number | null;
  architect_or_designer: string | null;
  description: string;
  wikipedia_url: string | null;
  image_role?: string;
}

export interface CulturalRef {
  ref_type:
    | "film"
    | "tv"
    | "music"
    | "literature"
    | "historic"
    | "brand"
    | "other";
  title: string;
  creator: string | null;
  year: number | null;
  description: string | null;
  wikipedia_url: string | null;
}

export interface RecurringEvent {
  name: string;
  when_text: string;
  month: number | null;
  description: string;
  typical_attendance: number | null;
}

export interface Business {
  name: string;
  category:
    | "restaurant"
    | "hotel"
    | "bar"
    | "museum"
    | "kiosk"
    | "market"
    | "rental";
  description: string;
  address: string | null;
  year_established: number | null;
  lat?: number;
  lng?: number;
  external_url: string | null;
  source: string;
}

export interface DayInTime {
  dawn: string;
  midday: string;
  golden: string;
  night: string;
}

export interface FoodItem {
  name: string;
  description: string;
  where: string;
}

export interface Showcase {
  intro_text?: string;
  favela_note?: string;
  honest_reckoning_note?: string;
  day_in_time?: DayInTime;
  food_drink?: FoodItem[];
  timeline?: TimelineEvent[];
  zones?: Zone[];
  landmarks?: Landmark[];
  cultural_refs?: CulturalRef[];
  recurring_events?: RecurringEvent[];
  businesses?: Business[];
}

// ============================================================================
// Pipeline data (site/data/beaches/<slug>.json)
// Loaded alongside composition/meta/showcase.
// ============================================================================

export interface ClimateData {
  air_temp_high: (number | null)[];
  air_temp_low: (number | null)[];
  water_temp: (number | null)[];
  rain_mm: (number | null)[];
  sun_hours: (number | null)[];
  wind_speed_kmh?: (number | null)[];
  wind_direction?: (number | null)[];
  humidity_pct?: (number | null)[];
  cloud_cover_pct?: (number | null)[];
  wave_height_m?: (number | null)[];
  wave_period_s?: (number | null)[];
  swell_direction?: (number | null)[];
  climate_source: string | null;
  ocean_source: string | null;
}

export interface TideData {
  range_spring_m: number;
  range_neap_m: number;
  type: string;
  source: string;
}

export interface BeachData {
  slug: string;
  name: string;
  centroid_lat: number;
  centroid_lng: number;
  country_code: string;
  admin_level_1: string;
  beach_length_m: number | null;
  water_body_type: string | null;
  substrate_type: string | null;
  wikipedia_url: string | null;
  nearest_city?: string;
  nearest_city_distance_km?: number;
  nearest_airport?: {
    iata: string;
    name: string;
    distance_km: number;
  };
  climate: ClimateData;
  tides: TideData;
  species: Array<{
    species_name: string;
    common_name: string;
    taxon_group: string;
    observation_count: number;
  }>;
  facilities?: {
    parking?: boolean;
    restrooms?: boolean;
    food_nearby?: boolean;
    showers?: boolean;
    lifeguard?: boolean;
    wheelchair_accessible?: boolean;
  };
}

// ============================================================================
// Full page bundle — what gets passed to the scaffold
// ============================================================================

export interface LegendaryPageBundle {
  composition: Composition;
  meta: BeachMeta;
  showcase: Showcase;
  data: BeachData;
  doneness?: {
    declared_version: string;
    final_version: string;
    warnings: string[];
  };
}
