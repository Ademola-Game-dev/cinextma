"use client";

import { Button, Chip, Pagination, Select, SelectItem } from "@heroui/react";
import { useQueryState, parseAsInteger, parseAsString } from "nuqs";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { tmdb } from "@/api/tmdb";
import { TV as TVShow } from "tmdb-ts/dist/types";
import { AnimatePresence, motion } from "framer-motion";
import { useDebouncedValue, useLocalStorage } from "@mantine/hooks";
import SearchInput from "@/components/ui/input/SearchInput";
import { DiscoverTVShowCard } from "../discover/DiscoverTVShowCard";

export default function SearchList() {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useQueryState("q", parseAsString.withDefault(""));
  const [isSearchTriggered, setIsSearchTriggered] = useState(false);
  const [debouncedSearchQuery] = useDebouncedValue(searchQuery.trim(), 1000);
  const [searchHistories, setSearchHistories] = useLocalStorage<string[]>({
    key: "tv-search-histories",
    defaultValue: [],
    getInitialValueInEffect: false,
  });
  const { data, isPending } = useQuery({
    queryFn: () => tmdb.search.tvShows({ query: debouncedSearchQuery, page: page }),
    queryKey: ["search-tv-show", page, debouncedSearchQuery],
  });

  const tvShows = data?.results as TVShow[];
  const totalResults = data?.total_results as number;
  const isEmpty = totalResults === 0;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // const handleSearch = (value: string) => {
  //   setSearchQuery(value);
  //   setPage(1);
  //   setIsSearchTriggered(true);

  //   if (value.trim() !== "") {
  //     setSearchHistories((prev) => {
  //       const newHistories = prev.filter((history) => history !== value);
  //       return [value, ...newHistories].slice(0, 5);
  //     });
  //   }
  // };

  const handleClearSearch = () => {
    setSearchQuery("");
    setIsSearchTriggered(false);
  };

  const handleHistoryClick = (history: string) => {
    setSearchQuery(history);
    setIsSearchTriggered(true);
  };

  useEffect(() => {
    if (data?.total_pages) {
      setTotalPages(data.total_pages);
    }
  }, [data?.total_pages]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <SearchInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          // onSearch={handleSearch}
          onClear={handleClearSearch}
          placeholder="Search TV Shows..."
          className="w-full"
        />
        {searchHistories.length > 0 && !isSearchTriggered && (
          <div className="flex flex-wrap gap-2">
            <p className="text-sm text-default-500">Recent searches:</p>
            {searchHistories.map((history) => (
              <Chip
                key={history}
                variant="flat"
                color="primary"
                className="cursor-pointer"
                onClick={() => handleHistoryClick(history)}
              >
                {history}
              </Chip>
            ))}
            <Button size="sm" variant="light" color="danger" onPress={() => setSearchHistories([])}>
              Clear
            </Button>
          </div>
        )}
      </div>

      {isSearchTriggered && (
        <>
          {isEmpty ? (
            <div className="flex h-[50vh] flex-col items-center justify-center gap-3">
              <h3 className="text-2xl font-bold">No TV Shows Found</h3>
              <p className="text-center text-gray-500">
                Try searching for something else or check your spelling.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                <AnimatePresence mode="wait">
                  {isPending ? (
                    Array.from({ length: 10 }).map((_, index) => (
                      <motion.div
                        key={`skeleton-${index}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="aspect-[2/3] w-full"
                      >
                        <div className="h-full w-full animate-pulse rounded-lg bg-secondary-background"></div>
                      </motion.div>
                    ))
                  ) : (
                    <>
                      {tvShows?.map((tvShow) => (
                        <DiscoverTVShowCard key={tvShow.id} tvShow={tvShow} />
                      ))}
                    </>
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-5 flex justify-center">
                <Pagination
                  showControls
                  total={totalPages}
                  initialPage={page}
                  page={page}
                  onChange={handlePageChange}
                />
              </div>

              <div className="flex items-center justify-between">
                <Chip variant="flat" color="primary">
                  Page {page} of {totalPages}
                </Chip>
                <Chip variant="flat" color="primary">
                  Total {totalResults || 0} TV Shows
                </Chip>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
