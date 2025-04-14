"use client";

import { Button, Chip, Pagination, Select, SelectItem } from "@heroui/react";
import { useQueryState, parseAsInteger, parseAsStringLiteral } from "nuqs";
import { useEffect, useState } from "react";
import { DiscoverTVShowsFetchQueryType, DISCOVER_TV_SHOWS_VALID_QUERY_TYPES } from "@/types/tv";
import useFetchDiscoverTVShows from "@/hooks/useFetchDiscoverTVShows";
import { TV as TVShow } from "tmdb-ts/dist/types";
import { AnimatePresence, motion } from "framer-motion";
import { tmdb } from "@/api/tmdb";
import GenresSelect from "@/components/movies/GenresSelect";
import { IoFilterOutline } from "react-icons/io5";
import { useDisclosure } from "@mantine/hooks";
import { Drawer } from "@heroui/drawer";
import { DiscoverTVShowCard } from "./DiscoverTVShowCard";

export default function DiscoverList() {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [queryType, setQueryType] = useQueryState<DiscoverTVShowsFetchQueryType>(
    "type",
    parseAsStringLiteral(DISCOVER_TV_SHOWS_VALID_QUERY_TYPES).withDefault("discover"),
  );
  const [genres, setGenres] = useState<Set<string>>(new Set());
  const [opened, handlers] = useDisclosure(false);

  const selectItems = [
    {
      name: "Discover",
      key: "discover",
    },
    {
      name: "Today's Trending",
      key: "todayTrending",
    },
    {
      name: "This Week's Trending",
      key: "thisWeekTrending",
    },
    {
      name: "Popular",
      key: "popular",
    },
    {
      name: "On The Air",
      key: "onTheAir",
    },
    {
      name: "Top Rated",
      key: "topRated",
    },
  ];

  const { data, isPending } = useFetchDiscoverTVShows({
    page: page,
    type: queryType,
    genres: Array.from(genres)
      .filter((genre) => genre !== "")
      .join(","),
  });

  const tvShows = data?.results as TVShow[];

  const totalResults = data?.total_results as number;

  const isEmpty = totalResults === 0;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleQueryTypeChange = (value: string) => {
    setQueryType(value as DiscoverTVShowsFetchQueryType);
    setPage(1);
  };

  const handleGenreChange = (value: string[]) => {
    setGenres(new Set(value));
    setPage(1);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Select
            label="Sort by"
            selectedKeys={[queryType]}
            onChange={(e) => handleQueryTypeChange(e.target.value)}
            className="w-full md:w-48"
          >
            {selectItems.map((item) => (
              <SelectItem key={item.key} value={item.key}>
                {item.name}
              </SelectItem>
            ))}
          </Select>
          <Button
            isIconOnly
            variant="flat"
            color="primary"
            className="md:hidden"
            onPress={handlers.open}
          >
            <IoFilterOutline />
          </Button>
        </div>
        {/* <div className="hidden md:block"> */}
        <GenresSelect
          query={tmdb.genres.tvShows()}
          type="tv"
          label="Filter by genres"
          placeholder="Select genres"
          selectedKeys={genres}
          onSelectionChange={(keys) => handleGenreChange(Array.from(keys) as string[])}
          className="w-full md:w-96"
        />
        {/* </div> */}
      </div>

      {/* <Drawer
        backdrop="opaque"
        open={opened}
        onOpenChange={handlers.toggle}
        title="Filter by genres"
      >
        <GenresSelect
          query={tmdb.genres.tv()}
          type="tv"
          label="Filter by genres"
          placeholder="Select genres"
          selectionMode="multiple"
          selectedKeys={genres}
          onSelectionChange={(keys) => handleGenreChange(Array.from(keys) as string[])}
          className="w-full"
        />
      </Drawer> */}

      {isEmpty ? (
        <div className="flex h-[50vh] flex-col items-center justify-center gap-3">
          <h3 className="text-2xl font-bold">No TV Shows Found</h3>
          <p className="text-center text-gray-500">
            Try changing your search criteria or check back later.
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
                  {tvShows?.map((tvShow) => <DiscoverTVShowCard key={tvShow.id} tvShow={tvShow} />)}
                </>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-5 flex justify-center">
            <Pagination
              showControls
              total={data?.total_pages || 1}
              initialPage={page}
              page={page}
              onChange={handlePageChange}
            />
          </div>
        </>
      )}

      <div className="flex items-center justify-between">
        <Chip variant="flat" color="primary">
          Page {page} of {data?.total_pages || 1}
        </Chip>
        <Chip variant="flat" color="primary">
          Total {totalResults || 0} TV Shows
        </Chip>
      </div>
    </div>
  );
}
