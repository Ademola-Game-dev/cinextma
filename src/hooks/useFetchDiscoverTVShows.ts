"use client";

import { tmdb } from "@/api/tmdb";
import { DiscoverTVShowsFetchQueryType } from "@/types/tv";
import { useQuery } from "@tanstack/react-query";
import { kebabCase } from "string-ts";

interface FetchDiscoverTVShows {
  page?: number;
  type?: DiscoverTVShowsFetchQueryType;
  genres?: string;
}

/**
 * Fetches the list of TV shows from the specified discover type.
 *
 * @param {Object} [options] - Options for the fetch.
 * @param {number} [options.page=1] - Page number to fetch.
 * @param {DiscoverTVShowsFetchQueryType} [options.type="discover"] - Type of discover query to fetch.
 * @param {string} [options.genres] - Comma-separated list of genre IDs to filter by.
 *
 * @returns {QueryResult<TVShow[], Error>} - The result of the query, which is a list of TV shows.
 */
const useFetchDiscoverTVShows = ({ page = 1, type = "discover", genres }: FetchDiscoverTVShows) => {
  const discover = tmdb.discover.tvShow({ page: page, with_genres: genres });
  const todayTrending = tmdb.trending.trending("tv", "day", { page: page });
  const thisWeekTrending = tmdb.trending.trending("tv", "week", { page: page });
  const popular = tmdb.tvShows.popular({ page: page });
  const onTheAir = tmdb.tvShows.onTheAir({ page: page });
  const topRated = tmdb.tvShows.topRated({ page: page });

  const queryData = {
    discover,
    todayTrending,
    thisWeekTrending,
    popular,
    onTheAir,
    topRated,
  }[type];

  return useQuery({
    queryFn: () => queryData,
    queryKey: [kebabCase(type) + "-tv-shows", page, genres],
  });
};

export default useFetchDiscoverTVShows;
