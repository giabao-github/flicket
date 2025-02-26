"use client";

import { toast } from "sonner";
import { ResponsiveModal } from "@/components/reponsive-dialog";
import { UploadDropzone } from "@/lib/uploadthing";
import { trpc } from "@/trpc/client";


interface ThumbnailUploadModalProps {
  videoId: string;
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
}

export const ThumbnailUploadModal = ({ videoId, open, onOpenChangeAction }: ThumbnailUploadModalProps) => {
  const utils = trpc.useUtils();

  const onUploadComplete = () => {
    utils.studio.getMany.invalidate();
    utils.studio.getOne.invalidate({ id: videoId });
    onOpenChangeAction(false);
    toast.success('Thumbnail updated');
  }
  return (
    <ResponsiveModal
      title='Upload a thumbnail'
      open={open}
      onOpenChange={onOpenChangeAction}
    >
      <UploadDropzone 
        endpoint='thumbnailUploader'
        input={{ videoId }}
        onClientUploadComplete={onUploadComplete}
      />
    </ResponsiveModal>
  );
}