"use client";

import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import { Loader2Icon, ShieldPlusIcon } from "lucide-react";
import { toast } from "sonner";


export const StudioUploadModal = () => {
  const utils = trpc.useUtils();
  const create = trpc.videos.create.useMutation({
    onSuccess: () => {
      toast.success('Video created');
      utils.studio.getMany.invalidate();
    },
    onError: (error) => {
      toast.error('Failed to create video');
      console.log('Error uploading video:', error);
    }
  });

  return (
    <Button 
      variant='default' 
      onClick={() => create.mutate()}
      disabled={create.isPending}
    >
      {create.isPending ? <Loader2Icon className='animate-spin' /> : <ShieldPlusIcon />}
      Create
    </Button>
  );
}