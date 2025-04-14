import IconButton from "@/components/ui/button/IconButton";
import { getTvShowPlayers } from "@/utils/players";
import { Card, Image, Skeleton, Select, SelectItem, Tooltip, Tabs, Tab } from "@heroui/react";
import { forwardRef, useState, useEffect } from "react";
import { FaPlay, FaStar } from "react-icons/fa6";
import { IoIosRocket, IoMdHelpCircle } from "react-icons/io";
import { TvShowDetails } from "tmdb-ts/dist/types";
import { FaAd } from "react-icons/fa";
import AdsWarning from "@/components/ui/overlay/AdsWarning";
import { getTVShowBackdropImage, mutateTVShowName } from "@/utils/tvShows";
import { Season } from "tmdb-ts/dist/types";
import { tmdb } from "@/api/tmdb";

export interface TVShowPlayerProps {
  tvShow: TvShowDetails;
}

const TVShowPlayer = forwardRef<HTMLDivElement, TVShowPlayerProps>(({ tvShow }, ref) => {
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [selectedEpisode, setSelectedEpisode] = useState<number>(1);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [warning, setWarning] = useState(false);
  const [playTVShow, setPlayTVShow] = useState(false);
  const [selectedSource, setSelectedSource] = useState<string>("");

  const players = getTvShowPlayers(tvShow.id, selectedSeason, selectedEpisode);
  const name = mutateTVShowName(tvShow);
  const backdropImage = getTVShowBackdropImage(tvShow, true);

  // Set default selected source when players change
  useEffect(() => {
    if (players.length > 0 && !selectedSource) {
      setSelectedSource(players[0].title);
    }
  }, [players, selectedSource]);

  // Fetch episodes for the selected season
  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        const seasonData = await tmdb.tvShows.season(tvShow.id, selectedSeason);
        setEpisodes(seasonData.episodes);
        // Reset episode selection to 1 when changing seasons
        setSelectedEpisode(1);
      } catch (error) {
        console.error("Error fetching episodes:", error);
        setEpisodes([]);
      }
    };

    fetchEpisodes();
  }, [tvShow.id, selectedSeason]);

  const handlePlay = () => {
    if (localStorage.getItem("ads-warning-seen")) {
      setPlayTVShow(true);
    } else {
      setWarning(true);
    }
  };

  const Placeholder = () => (
    <Card shadow="md" className="group aspect-video size-full">
      <Image
        isBlurred
        alt={name}
        className="size-full"
        classNames={{
          wrapper: "absolute-center aspect-video size-full group-hover:opacity-70 transition",
        }}
        src={backdropImage}
      />
      <IconButton
        icon={<FaPlay />}
        radius="full"
        tooltip={`Play ${name}`}
        className="absolute-center"
        color="warning"
        variant="faded"
        size="lg"
        onPress={handlePlay}
      />
    </Card>
  );

  const PlayerTabs = () =>
    players.map(
      ({ title, source }) =>
        selectedSource === title && (
          <Card key={title} shadow="md" className="relative">
            <Skeleton className="absolute aspect-video size-full" />
            <iframe className="z-10 aspect-video size-full" src={source} allowFullScreen />
          </Card>
        ),
    );

  return (
    <div ref={ref} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <h4 className="text-lg font-bold md:text-2xl">Watch {name}</h4>
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="flex flex-wrap gap-2">
            <Select
              label="Season"
              selectedKeys={[selectedSeason.toString()]}
              onChange={(e) => setSelectedSeason(Number(e.target.value))}
              className="w-full md:w-40"
            >
              {tvShow.seasons
                .filter((season: Season) => season.season_number > 0)
                .map((season: Season) => (
                  <SelectItem
                    key={season.season_number.toString()}
                    value={season.season_number.toString()}
                  >
                    Season {season.season_number}
                  </SelectItem>
                ))}
            </Select>
            <Select
              label="Episode"
              selectedKeys={[selectedEpisode.toString()]}
              onChange={(e) => setSelectedEpisode(Number(e.target.value))}
              className="w-full md:w-40"
            >
              {episodes.map((episode) => (
                <SelectItem
                  key={episode.episode_number.toString()}
                  value={episode.episode_number.toString()}
                >
                  Episode {episode.episode_number}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div className="flex flex-wrap gap-2">
            <Select
              label="Source"
              selectedKeys={[selectedSource]}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="w-full md:w-40"
            >
              {players.map(({ title, recommended, fast, ads }) => (
                <SelectItem
                  key={title}
                  value={title}
                  textValue={title}
                  startContent={
                    recommended ? (
                      <Tooltip content="Recommended" placement="left">
                        <FaStar className="text-warning" />
                      </Tooltip>
                    ) : fast ? (
                      <Tooltip content="Fast loading" placement="left">
                        <IoIosRocket className="text-success" />
                      </Tooltip>
                    ) : ads ? (
                      <Tooltip content="Contains ads" placement="left">
                        <FaAd className="text-danger" />
                      </Tooltip>
                    ) : (
                      <IoMdHelpCircle className="text-default-400" />
                    )
                  }
                >
                  {title}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>
      </div>

      {playTVShow ? <PlayerTabs /> : <Placeholder />}

      {warning && <AdsWarning />}
    </div>
  );
});

TVShowPlayer.displayName = "TVShowPlayer";

export default TVShowPlayer;
