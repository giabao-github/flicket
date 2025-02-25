import { FileVideoIcon } from "lucide-react";
import MuxUploader, { MuxUploaderDrop, MuxUploaderFileSelect, MuxUploaderProgress, MuxUploaderStatus } from "@mux/mux-uploader-react";
import { Button } from "@/components/ui/button";


interface StudioUploaderProps {
  endpoint?: string | null;
  onSuccess: () => void;
}

const UPLOADER_ID = 'video-uploader';

export const StudioUploader = ({ endpoint, onSuccess }: StudioUploaderProps) => {
  return (
    <div>
      <MuxUploader 
        onSuccess={onSuccess}
        endpoint={endpoint} 
        id={UPLOADER_ID}
        className='hidden group/uploader'
      />
      <MuxUploaderDrop muxUploader={UPLOADER_ID} className='group/drop'>
        <div slot='heading' className='flex flex-col items-center gap-8'>
          <div className='flex items-center justify-center gap-2 rounded-full bg-muted h-32 w-32'>
            <FileVideoIcon className='size-12 text-text group/drop-[&[active]]:animate-bounce transition-all duration-200' />
          </div>
          <div className='flex flex-col gap-2 text-center'>
            <p className='text-base'>Drag and drop a video file to upload</p>
            <p className='text-sm text-text-foreground'>Your video will be private until it is published</p>
          </div>
          <MuxUploaderFileSelect muxUploader={UPLOADER_ID}>
            <Button 
              type='button' 
              variant='basic'
              className='rounded-full'
            >
              Select a file
            </Button>
          </MuxUploaderFileSelect>
        </div>
        <span slot='separator' className='hidden' />
        <MuxUploaderStatus 
          muxUploader={UPLOADER_ID}
          className='text-base'
        />
        <MuxUploaderProgress
          muxUploader={UPLOADER_ID}
          className='text-base'
          type='percentage'
        />
        <MuxUploaderProgress
          muxUploader={UPLOADER_ID}
          type='bar'
        />
      </MuxUploaderDrop>
    </div>
  );
}