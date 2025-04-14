import { Image, Link } from "@heroui/react";
import { getImageUrl } from "@/utils/movies";
import { Image as ImageType } from "tmdb-ts";
import Carousel from "@/components/ui/wrapper/Carousel";

export default function GallerySection({ images }: { images?: ImageType[] }) {
  if (!images || images.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-bold md:text-2xl">Gallery</h4>
        <Link size="sm" href="#" isBlock color="foreground" className="rounded-full">
          See All &gt;
        </Link>
      </div>
      <Carousel classNames={{ container: "gap-3" }}>
        {images.slice(0, 10).map((image, index) => (
          <div
            key={index}
            className="min-w-[250px] max-w-[250px] overflow-hidden rounded-xl md:min-w-[300px] md:max-w-[300px]"
          >
            <Image
              alt={`Gallery image ${index + 1}`}
              src={getImageUrl(image.file_path, "backdrop")}
              className="aspect-video w-full object-cover"
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
}
