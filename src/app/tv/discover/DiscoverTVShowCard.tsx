import { Card, CardHeader, Chip, Image, Tooltip } from "@heroui/react";
import { useCallback } from "react";
import { Icon } from "@iconify/react";
import { useDisclosure, useHover } from "@mantine/hooks";
import Link from "next/link";
import { motion } from "framer-motion";
import { TV as TVShow } from "tmdb-ts/dist/types";
import { useLongPress } from "use-long-press";
import useBreakpoints from "@/hooks/useBreakpoints";
import useDeviceVibration from "@/hooks/useDeviceVibration";
import VaulDrawer from "@/components/ui/overlay/VaulDrawer";
import { HoverTVShowCard } from "./HoverTVShowCard";
import { getTVShowPosterImage, getTVShowReleaseYear, mutateTVShowName } from "@/utils/tvShows";
import Rating from "@/components/movies/Rating";

export const DiscoverTVShowCard: React.FC<{ tvShow: TVShow }> = ({ tvShow }) => {
  const { hovered, ref } = useHover();
  const [opened, handlers] = useDisclosure(false);
  const releaseYear = getTVShowReleaseYear(tvShow);
  const posterImage = getTVShowPosterImage(tvShow);
  const name = mutateTVShowName(tvShow);
  const { mobile } = useBreakpoints();
  const { startVibration } = useDeviceVibration();

  const callback = useCallback(() => {
    handlers.open();
    setTimeout(() => startVibration([100]), 300);
  }, []);

  const longPress = useLongPress(mobile ? callback : null, {
    cancelOnMovement: true,
    threshold: 300,
  });

  return (
    <>
      <Tooltip
        isDisabled={mobile}
        showArrow
        className="bg-secondary-background p-0"
        shadow="lg"
        delay={1000}
        placement="right-start"
        content={<HoverTVShowCard id={tvShow.id} />}
      >
        <Link href={`/tv/${tvShow.id}`}>
          <motion.div layout key={tvShow.id} className="size-full">
            <Card
              ref={ref}
              {...longPress()}
              isHoverable
              fullWidth
              shadow="md"
              className="group h-full bg-secondary-background"
            >
              <CardHeader className="flex items-center justify-center pb-0">
                <div className="relative size-full">
                  {hovered && (
                    <Icon
                      icon="line-md:play-filled"
                      width="64"
                      height="64"
                      className="absolute-center z-20 text-white"
                    />
                  )}
                  {tvShow.adult && (
                    <Chip
                      color="danger"
                      size="sm"
                      variant="shadow"
                      className="absolute left-2 top-2 z-20"
                    >
                      18+
                    </Chip>
                  )}
                  <div className="absolute bottom-0 z-[2] h-1/2 w-full bg-gradient-to-t from-black from-[1%]"></div>
                  <div className="absolute bottom-0 z-[3] flex w-full flex-col gap-1 px-4 py-3">
                    <h6 className="truncate text-sm font-semibold text-white">
                      {name} {releaseYear && `(${releaseYear})`}
                    </h6>
                    <div className="flex justify-between text-xs text-white">
                      <p>{releaseYear}</p>
                      <Rating rate={tvShow?.vote_average} />
                    </div>
                  </div>
                  <Image
                    alt={name}
                    src={posterImage}
                    radius="lg"
                    className="aspect-[2/3] size-full object-cover object-center transition group-hover:scale-110"
                    classNames={{
                      wrapper: "aspect-[2/3] size-full",
                      img: "group-hover:opacity-70",
                    }}
                  />
                </div>
              </CardHeader>
            </Card>
          </motion.div>
        </Link>
      </Tooltip>

      <VaulDrawer
        backdrop="blur"
        open={opened}
        onOpenChange={handlers.toggle}
        title={name}
        hiddenTitle
      >
        <HoverTVShowCard id={tvShow.id} fullWidth />
      </VaulDrawer>
    </>
  );
};
