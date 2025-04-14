import { Tabs, Tab, Link } from "@heroui/react";
import { AppendToResponse, TvShowDetails } from "tmdb-ts/dist/types";
import { TV as TVShow } from "tmdb-ts/dist/types";
import Carousel from "@/components/ui/wrapper/Carousel";
import HomeTVShowCard from "@/app/HomeTVShowCard";

export default function RelatedSection({
  tvShow,
}: {
  tvShow: AppendToResponse<TvShowDetails, ("recommendations" | "similar")[], "tvShow">;
}) {
  if (!tvShow) return null;

  // @ts-ignore
  const recommendations = tvShow.recommendations?.results as TVShow[];
  const similar = tvShow.similar?.results as TVShow[];

  if ((!recommendations || recommendations.length === 0) && (!similar || similar.length === 0))
    return null;

  return (
    <div className="flex flex-col gap-3">
      <Tabs aria-label="Related TV Shows" color="primary" variant="underlined">
        {recommendations && recommendations.length > 0 && (
          <Tab key="recommendations" title="Recommendations">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-bold md:text-2xl">Recommendations</h4>
                <Link size="sm" href="#" isBlock color="foreground" className="rounded-full">
                  See All &gt;
                </Link>
              </div>
              <Carousel classNames={{ container: "gap-3" }}>
                {recommendations.slice(0, 10).map((tvShow) => (
                  <div
                    key={tvShow.id}
                    className="min-w-[150px] max-w-[150px] md:min-w-[200px] md:max-w-[200px]"
                  >
                    <HomeTVShowCard tvShow={tvShow} />
                  </div>
                ))}
              </Carousel>
            </div>
          </Tab>
        )}
        {similar && similar.length > 0 && (
          <Tab key="similar" title="Similar">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-bold md:text-2xl">Similar TV Shows</h4>
                <Link size="sm" href="#" isBlock color="foreground" className="rounded-full">
                  See All &gt;
                </Link>
              </div>
              <Carousel classNames={{ container: "gap-3" }}>
                {similar.slice(0, 10).map((tvShow) => (
                  <div
                    key={tvShow.id}
                    className="min-w-[150px] max-w-[150px] md:min-w-[200px] md:max-w-[200px]"
                  >
                    <HomeTVShowCard tvShow={tvShow} />
                  </div>
                ))}
              </Carousel>
            </div>
          </Tab>
        )}
      </Tabs>
    </div>
  );
}
