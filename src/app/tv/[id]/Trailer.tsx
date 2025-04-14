import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";
import { useDisclosure } from "@mantine/hooks";
import { FaYoutube } from "react-icons/fa";
import { Video } from "tmdb-ts/dist/types";

export default function Trailer({ videos }: { videos?: { results: Video[] } }) {
  const [opened, handlers] = useDisclosure(false);

  if (!videos || !videos.results || videos.results.length === 0) return null;

  const trailers = videos.results.filter(
    (video) => video.type === "Trailer" && video.site === "YouTube",
  );

  if (trailers.length === 0) return null;

  const trailer = trailers[0];

  return (
    <>
      <div className="flex flex-col gap-2">
        <h4 className="text-lg font-bold">Trailer</h4>
        <Button
          color="danger"
          variant="flat"
          radius="full"
          startContent={<FaYoutube />}
          onPress={handlers.open}
        >
          Watch Trailer
        </Button>
      </div>

      <Modal
        backdrop="blur"
        isOpen={opened}
        onOpenChange={handlers.toggle}
        size="5xl"
        placement="center"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader>
            <h3>{trailer.name}</h3>
          </ModalHeader>
          <ModalBody className="p-0">
            <div className="aspect-video w-full">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${trailer.key}`}
                title={trailer.name}
                allowFullScreen
              ></iframe>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={handlers.close}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
