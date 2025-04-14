"use client";

import { Image, Chip, Button } from "@heroui/react";
import { getImageUrl } from "@/utils/movies";
import BookmarkButton from "@/components/ui/button/BookmarkButton";
import Rating from "@/components/movies/Rating";
import ShareButton from "@/components/ui/button/ShareButton";
import { AppendToResponse } from "tmdb-ts/dist/types/options";
import { useDocumentTitle } from "@mantine/hooks";
import { siteConfig } from "@/config/site";
import { FaCirclePlay } from "react-icons/fa6";
import Genres from "@/components/movies/Genres";
import { formatSeasonsEpisodes, getTVShowReleaseYear, mutateTVShowName } from "@/utils/tvShows";
import { TvShowDetails } from "tmdb-ts/dist/types";
import Trailer from "./Trailer";

export interface OverviewSectionProps {
  tvShow: AppendToResponse<TvShowDetails, "videos"[], "tvShow">;
  onPlayNowClick: () => void;
}

export const OverviewSection: React.FC<OverviewSectionProps> = ({ tvShow, onPlayNowClick }) => {
  const releaseYear = getTVShowReleaseYear(tvShow);
  const posterImage = getImageUrl(tvShow.poster_path);
  const name = mutateTVShowName(tvShow);
  const fullName = `${name} ${releaseYear ? `(${releaseYear})` : ""}`;

  useDocumentTitle(`${fullName} | ${siteConfig.name}`);

  return (
    <div className="flex flex-col gap-5 md:flex-row">
      <div className="flex-shrink-0">
        <Image
          isBlurred
          alt={name}
          src={posterImage}
          className="aspect-[2/3] w-full max-w-[300px] rounded-xl object-cover md:w-[200px]"
        />
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold md:text-4xl">{name}</h1>
          <div className="flex flex-wrap items-center gap-2">
            <Chip variant="flat" color="primary">
              {releaseYear}
            </Chip>
            <Chip variant="flat" color="primary">
              {formatSeasonsEpisodes(tvShow.number_of_seasons, tvShow.number_of_episodes)}
            </Chip>
            <Rating rate={tvShow.vote_average} />
          </div>
        </div>

        <Genres genres={tvShow.genres} />

        <div className="flex flex-wrap gap-2">
          <Button
            color="warning"
            variant="flat"
            radius="full"
            startContent={<FaCirclePlay />}
            onPress={onPlayNowClick}
          >
            Play Now
          </Button>
          {/* <BookmarkButton
            movie={tvShow}
            type="tv"
          /> */}
          <ShareButton id={tvShow.id} title={name} />
        </div>

        <div className="flex flex-col gap-2">
          <h4 className="text-lg font-bold">Overview</h4>
          <p className="text-sm text-default-500">{tvShow.overview || "No overview available."}</p>
        </div>

        <Trailer videos={tvShow.videos} />
      </div>
    </div>
  );
};
