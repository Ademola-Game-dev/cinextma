import { Image, Link } from "@heroui/react";
import { getImageUrl } from "@/utils/movies";
import { Cast } from "tmdb-ts/dist/types/credits";
import Carousel from "@/components/ui/wrapper/Carousel";

export default function CastsSection({ casts }: { casts?: Cast[] }) {
  if (!casts || casts.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-bold md:text-2xl">Cast</h4>
        <Link size="sm" href="#" isBlock color="foreground" className="rounded-full">
          See All &gt;
        </Link>
      </div>
      <Carousel classNames={{ container: "gap-3" }}>
        {casts.slice(0, 20).map((cast) => (
          <div
            key={cast.id}
            className="min-w-[120px] max-w-[120px] overflow-hidden rounded-xl md:min-w-[150px] md:max-w-[150px]"
          >
            <div className="flex flex-col gap-2">
              <Image
                alt={cast.name}
                src={getImageUrl(cast.profile_path, "avatar")}
                className="aspect-[2/3] w-full object-cover"
              />
              <div className="flex flex-col px-1">
                <p className="truncate text-sm font-semibold">{cast.name}</p>
                <p className="truncate text-xs text-default-500">{cast.character}</p>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
}
