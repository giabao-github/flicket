import { VideosSection } from "../sections/videos-section";

const StudioView = () => {
  return (
    <div className='flex flex-col gap-y-8 pt-6'>
      <div className='px-8 flex flex-col gap-y-2'>
        <h1 className='text-2xl font-bold'>Channel content</h1>
        <p className='text-sm text-text-foreground'>Manage your channel content and videos</p>
      </div>
      <VideosSection />
    </div>
  );
}

export default StudioView;