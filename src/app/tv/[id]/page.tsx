"use client";

import { Spinner } from "@heroui/spinner";
import { useQuery } from "@tanstack/react-query";
import { tmdb } from "@/api/tmdb";
import { Cast } from "tmdb-ts/dist/types/credits";
import { notFound } from "next/navigation";
import { Image } from "tmdb-ts";
import { useScrollIntoView } from "@mantine/hooks";
import TVShowPlayer from "./TVShowPlayer";
import { OverviewSection } from "./OverviewSection";
import BackdropSection from "./BackdropSection";
import CastsSection from "./CastsSection";
import GallerySection from "./GallerySection";
import RelatedSection from "./RelatedSection";

export default function TVShowDetailPage({ params }: { params: { id: number } }) {
  const {
    data: tvShow,
    isPending,
    error,
  } = useQuery({
    queryFn: () =>
      tmdb.tvShows.details(params.id, [
        "images",
        "videos",
        "credits",
        "keywords",
        "recommendations",
        "similar",
        "reviews",
        "watch/providers",
      ]),
    queryKey: ["tv-show-detail", params.id],
  });

  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
    duration: 500,
  });

  if (error) notFound();

  return (
    <div className="mx-auto max-w-5xl">
      {isPending ? (
        <Spinner size="lg" className="absolute-center" />
      ) : (
        <div className="flex flex-col gap-10">
          <BackdropSection tvShow={tvShow} />
          <OverviewSection
            onPlayNowClick={() => scrollIntoView({ alignment: "center" })}
            tvShow={tvShow}
          />
          <CastsSection casts={tvShow?.credits.cast as Cast[]} />
          <GallerySection images={tvShow?.images.backdrops as Image[]} />
          <TVShowPlayer ref={targetRef} tvShow={tvShow} />
          <RelatedSection tvShow={tvShow} />
        </div>
      )}
    </div>
  );
}
