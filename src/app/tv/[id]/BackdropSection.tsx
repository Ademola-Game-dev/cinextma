import { getTVShowBackdropImage, mutateTVShowName } from "@/utils/tvShows";
import { TvShowDetails } from "tmdb-ts/dist/types";

export default function BackdropSection({ tvShow }: { tvShow?: TvShowDetails }) {
  const backdropImage = getTVShowBackdropImage(tvShow, true);
  const name = mutateTVShowName(tvShow);

  return (
    <div className="relative -mx-4 -mt-4 h-[30vh] md:h-[50vh]">
      <div
        className="h-full w-full bg-cover bg-center"
        style={{
          backgroundImage: `url(${backdropImage})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
      </div>
    </div>
  );
}
