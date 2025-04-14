import { Button, Card, CardBody, CardFooter, CardHeader, Image, Skeleton } from "@heroui/react";
import { useElementSize } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { tmdb } from "@/api/tmdb";
import { formatSeasonsEpisodes, getTVShowBackdropImage, mutateTVShowName } from "@/utils/tvShows";
import { getImageUrl } from "@/utils/movies";
import Rating from "@/components/movies/Rating";
import Genres from "@/components/movies/Genres";
import { FaCirclePlay } from "react-icons/fa6";
import Link from "next/link";
import { Genre } from "tmdb-ts";

export const HoverTVShowCard: React.FC<{ id: number; fullWidth?: boolean }> = ({
  id,
  fullWidth,
}) => {
  const { ref, width, height } = useElementSize();
  const { data: tvShow, isPending } = useQuery({
    queryFn: () => tmdb.tvShows.details(id, ["images"]),
    queryKey: ["get-tv-show-detail-on-hover-poster", id],
  });

  const name = mutateTVShowName(tvShow);
  const releaseYear = tvShow?.first_air_date
    ? new Date(tvShow.first_air_date).getFullYear()
    : undefined;
  const fullName = `${name} ${releaseYear ? `(${releaseYear})` : ""}`;
  const backdropImage = getTVShowBackdropImage(tvShow);
  const titleImage = getImageUrl(
    tvShow?.images?.logos?.find((logo) => logo.iso_639_1 === "en")?.file_path,
    "title",
  );
  const paddingTop = width * (9 / 16) - height / 4;

  return (
    <Card
      ref={ref}
      shadow="none"
      className={`${fullWidth ? "w-full" : "w-[300px]"} bg-transparent`}
    >
      {isPending ? (
        <Skeleton className="aspect-video w-full" />
      ) : (
        <>
          <CardHeader className="relative aspect-video w-full p-0">
            <Image
              alt={name}
              src={backdropImage}
              radius="lg"
              className="aspect-video w-full"
              classNames={{
                wrapper: "aspect-video w-full",
              }}
            />
            <div className="absolute bottom-0 h-1/2 w-full bg-gradient-to-t from-black from-[1%]"></div>
            <div
              className="absolute bottom-0 flex w-full flex-col items-center justify-center gap-2 px-4 py-3"
              style={{ paddingTop: `${paddingTop}px` }}
            >
              {titleImage ? (
                <Image alt={name} src={titleImage} radius="none" className="h-10 object-contain" />
              ) : (
                <h5 className="text-center text-lg font-bold text-white">{fullName}</h5>
              )}
            </div>
          </CardHeader>
          <CardBody className="flex flex-col gap-2 px-2 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p className="text-sm">{releaseYear}</p>
                <Rating rate={tvShow?.vote_average} />
              </div>
              <p className="text-sm">
                {formatSeasonsEpisodes(tvShow?.number_of_seasons, tvShow?.number_of_episodes)}
              </p>
            </div>
            <Genres genres={tvShow?.genres as Genre[]} />
            <p className="line-clamp-3 text-sm">{tvShow?.overview}</p>
          </CardBody>
          <CardFooter className="px-2 py-0">
            <Link href={`/tv/${id}`} className="w-full">
              <Button
                startContent={<FaCirclePlay />}
                color="primary"
                variant="flat"
                radius="full"
                fullWidth
              >
                Watch Now
              </Button>
            </Link>
          </CardFooter>
        </>
      )}
    </Card>
  );
};
