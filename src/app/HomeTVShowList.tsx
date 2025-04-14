"use client";

import { Link, Skeleton } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { kebabCase } from "string-ts";
import { useInViewport } from "@mantine/hooks";
import {
  TV as TVShow,
  PopularTvShowResult,
  OnTheAirResult,
  TopRatedTvShowResult,
} from "tmdb-ts/dist/types";
import Carousel from "@/components/ui/wrapper/Carousel";
import HomeTVShowCard from "./HomeTVShowCard";

const HomeTVShowList: React.FC<{
  query: Promise<{
    page: number;
    results: TVShow[] | PopularTvShowResult[] | OnTheAirResult[] | TopRatedTvShowResult[];
    total_results: number;
    total_pages: number;
  }>;
  name: string;
  param: string;
}> = ({ query, name, param }) => {
  const key = kebabCase(name) + "-list";
  const { ref, inViewport } = useInViewport();
  const { data, isPending } = useQuery({
    queryFn: () => query,
    queryKey: [key],
    enabled: inViewport,
  });

  return (
    <section id={key} className="min-h-[250px] md:min-h-[300px]" ref={ref}>
      {isPending ? (
        <div className="flex w-full flex-col gap-5">
          <div className="flex flex-grow items-center justify-between">
            <Skeleton className="h-7 w-40 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <Skeleton className="h-[250px] rounded-lg md:h-[300px]" />
        </div>
      ) : (
        <div className="z-[3] flex flex-col gap-2">
          <div className="flex flex-grow items-center justify-between">
            <h4 className="text-lg font-bold md:text-2xl">{name}</h4>
            <Link
              size="sm"
              href={`/tv/discover?type=${param}`}
              isBlock
              color="foreground"
              className="rounded-full"
            >
              See All &gt;
            </Link>
          </div>
          <Carousel classNames={{ container: "gap-2" }}>
            {data?.results.map((tvShow) => {
              return (
                <div
                  key={tvShow.id}
                  className="min-w-[150px] max-w-[150px] md:min-w-[200px] md:max-w-[200px]"
                >
                  <HomeTVShowCard tvShow={tvShow} />
                </div>
              );
            })}
          </Carousel>
        </div>
      )}
    </section>
  );
};

export default HomeTVShowList;
