import { FormSection } from "../sections/form-section";

interface PageProps {
  videoId: string;
}

export const VideoView = ({ videoId }: PageProps) => {
  return (
    <div className='px-8 pt-6 max-w-screen-lg 2xl:max-w-screen-2xl xl:max-w-screen-xl'>
      <FormSection videoId={videoId} /> 
    </div>
  );
}