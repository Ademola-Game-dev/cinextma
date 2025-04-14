"use client";

import HomeMovieList from "./HomeMovieList";
import HomeTVShowList from "./HomeTVShowList";
import { siteConfig } from "@/config/site";
import { Tabs, Tab } from "@heroui/react";

export default function Home() {
  const movies = siteConfig.queryLists.movies;
  const tvShows = siteConfig.queryLists.tvShows;

  return (
    <div className="flex flex-col gap-8">
      <Tabs aria-label="Content Type" color="primary" variant="underlined">
        <Tab key="movies" title="Movies">
          <div className="flex flex-col gap-12 py-4">
            {movies.map(({ name, query, param }) => (
              <HomeMovieList key={name} name={name} query={query} param={param} />
            ))}
          </div>
        </Tab>
        <Tab key="tvshows" title="TV Shows">
          <div className="flex flex-col gap-12 py-4">
            {tvShows.map(({ name, query, param }) => (
              <HomeTVShowList key={name} name={name} query={query} param={param} />
            ))}
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}
