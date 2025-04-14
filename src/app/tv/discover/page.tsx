import { Metadata } from "next/types";
import { siteConfig } from "@/config/site";
import dynamic from "next/dynamic";

const DiscoverList = dynamic(() => import("@/app/tv/discover/DiscoverList"), { ssr: false });

export const metadata: Metadata = {
  title: `Discover TV Shows | ${siteConfig.name}`,
};

export default function DiscoverTVShowsPage() {
  return (
    <>
      <h1 className="mb-14 text-center">Discover TV Shows</h1>
      <DiscoverList />
    </>
  );
}
