import { TvShowDetails } from "tmdb-ts";

export interface SavedTVShowDetails extends TvShowDetails {
  backdrop_path: string;
  id: number;
  poster_path: string;
  first_air_date: string;
  name: string;
  vote_average: number;
  saved_date: string;
}

export const DISCOVER_TV_SHOWS_VALID_QUERY_TYPES = [
  "discover",
  "todayTrending",
  "thisWeekTrending",
  "popular",
  "onTheAir",
  "topRated",
] as const;

export type DiscoverTVShowsFetchQueryType = (typeof DISCOVER_TV_SHOWS_VALID_QUERY_TYPES)[number];
