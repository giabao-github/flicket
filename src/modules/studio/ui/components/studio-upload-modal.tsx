"use client";

import { useRouter } from "next/navigation";
import { Loader2Icon, ShieldPlusIcon } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/trpc/client";
import { ResponsiveModal } from "@/components/reponsive-dialog";
import { Button } from "@/components/ui/button";
import { StudioUploader } from "./studio-uploader";


export const StudioUploadModal = () => {
  const router = useRouter();
  const utils = trpc.useUtils();
  const create = trpc.videos.create.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
    },
    onError: (error) => {
      toast.error('Failed to create video');
      console.log('Error creating video:', error.message);
    }
  });

  const onSuccess = () => {
    if (!create.data?.video.id) {
      return;
    }

    create.reset();
    toast.success('Your video has been uploaded');
    router.push(`/studio/videos/${create.data?.video.id}`);
  }

  return (
    <>
      <ResponsiveModal
        title='Upload a video'
        open={!!create.data?.url}
        onOpenChange={() => {
          create.reset();
        }}
      >
        {create.data?.url 
          ? <StudioUploader 
              endpoint={create.data.url} 
              onSuccess={onSuccess}
            /> 
          : <Loader2Icon />
        }
      </ResponsiveModal>
      <Button 
        variant='default' 
        onClick={() => {
          create.mutate();
        }}
        disabled={create.isPending}
        className='select-none'
      >
        {create.isPending 
          ? <Loader2Icon className='animate-spin' /> 
          : <ShieldPlusIcon />
        }
        Create
      </Button>
    </>
  );
}