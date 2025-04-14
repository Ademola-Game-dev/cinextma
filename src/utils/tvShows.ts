import { TV as TVShow, TvShowDetails } from "tmdb-ts";
import { getImageUrl } from "./movies";

/**
 * Returns the name of a TV show. If the TV show is not provided, an empty string is returned.
 *
 * @param tvShow The TV show to get the name for. Optional.
 * @param language The language to get the name in. Defaults to "en".
 * @returns The name of the TV show, or an empty string if the TV show is not provided.
 */
export function mutateTVShowName(tvShow?: TvShowDetails | TVShow, language: string = "en"): string {
  if (!tvShow) return "";
  return tvShow.original_language === language ? tvShow.original_name : tvShow.name;
}

/**
 * Formats the number of seasons and episodes into a readable string.
 *
 * @param seasons The number of seasons. If not provided, defaults to 0.
 * @param episodes The number of episodes. If not provided, defaults to 0.
 * @returns A string representing the number of seasons and episodes.
 */
export function formatSeasonsEpisodes(seasons?: number, episodes?: number): string {
  if (!seasons && !episodes) return "No data";

  const seasonsText = seasons ? `${seasons} Season${seasons > 1 ? "s" : ""}` : "";
  const episodesText = episodes ? `${episodes} Episode${episodes > 1 ? "s" : ""}` : "";

  if (seasonsText && episodesText) {
    return `${seasonsText}, ${episodesText}`;
  }

  return seasonsText || episodesText;
}

/**
 * Gets the poster image URL for a TV show.
 *
 * @param tvShow The TV show to get the poster for.
 * @param fullSize Whether to get the full size image. Defaults to false.
 * @returns The URL of the poster image.
 */
export function getTVShowPosterImage(tvShow?: TvShowDetails | TVShow, fullSize?: boolean): string {
  if (!tvShow) return "";
  return getImageUrl(tvShow.poster_path, "poster", fullSize);
}

/**
 * Gets the backdrop image URL for a TV show.
 *
 * @param tvShow The TV show to get the backdrop for.
 * @param fullSize Whether to get the full size image. Defaults to false.
 * @returns The URL of the backdrop image.
 */
export function getTVShowBackdropImage(
  tvShow?: TvShowDetails | TVShow,
  fullSize?: boolean,
): string {
  if (!tvShow) return "";
  return getImageUrl(tvShow.backdrop_path, "backdrop", fullSize);
}

/**
 * Gets the release year of a TV show.
 *
 * @param tvShow The TV show to get the release year for.
 * @returns The release year of the TV show, or undefined if the TV show is not provided or has no release date.
 */
export function getTVShowReleaseYear(tvShow?: TvShowDetails | TVShow): number | undefined {
  if (!tvShow || !tvShow.first_air_date) return undefined;
  return new Date(tvShow.first_air_date).getFullYear();
}
