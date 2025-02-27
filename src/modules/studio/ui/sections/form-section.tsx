"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { z } from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { ErrorBoundary } from "react-error-boundary";
import { zodResolver } from "@hookform/resolvers/zod";
import { CopyCheckIcon, CopyIcon, Globe2Icon, ImagePlusIcon, Loader2Icon, LockIcon, MoreVerticalIcon, RotateCcwIcon, SparklesIcon, TrashIcon } from "lucide-react";
import { trpc } from "@/trpc/client";
import { snakeCaseToTitle } from "@/lib/utils";
import { videoUpdateSchema } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Form, FormControl, FormField, FormLabel, FormMessage, FormItem } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VideoPlayer } from "@/modules/videos/ui/components/video-player";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ThumbnailUploadModal } from "../components/thumbnail-upload-modal";
import { ThumbnailGenerateModal } from "../components/thumbnail-generate-modal";
import { THUMBNAIL_FALLBACK } from "@/modules/videos/constants";
import { Skeleton } from "@/components/ui/skeleton";


interface FormSectionProps {
  videoId: string;
}

export const FormSection = ({ videoId }: FormSectionProps) => {
  return (
    <Suspense fallback={<FormSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <FormSectionSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
}

const FormSectionSkeleton = () => {
  return (
    <div>
      <div className='flex items-center justify-between mb-8'>
        <div className='space-y-2'>
          <Skeleton className='h-8 w-40' />
          <Skeleton className='h-5 w-[181px]' />
        </div>
        <div className='flex flex-row gap-x-4'>
          <Skeleton className='h-9 w-[66px]' />
          <Skeleton className='size-9' />
        </div>
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-5 gap-12'>
        <div className='space-y-8 lg:col-span-3'>
          <div className='space-y-3'>
            <Skeleton className='h-6 w-[70px]' />
            <Skeleton className='h-9 w-full' />
          </div>
          <div className='space-y-3'>
            <Skeleton className='h-6 w-32' />
            <Skeleton className='h-[218px] w-full' />
          </div>
          <div className='space-y-3'>
            <Skeleton className='h-6 w-[84px]' />
            <Skeleton className='h-[126px] w-[226px]' />
          </div>
          <div className='space-y-3'>
            <Skeleton className='h-6 w-[72px]' />
            <Skeleton className='h-9 w-full' />
          </div>
        </div>
        <div className='flex flex-col gap-y-8 lg:col-span-2'>
          <div className='bg-muted/50 flex flex-col gap-4 rounded-xl overflow-hidden h-fit'>
            <Skeleton className='aspect-video' />
            <div className='p-4 space-y-6'>
              <div className='space-y-3'>
                <Skeleton className='h-5 w-[68px]' />
                <Skeleton className='my-2 h-5 w-full' />
              </div>
              <div className='space-y-2'>
                <Skeleton className='h-5 w-[85px]' />
                <Skeleton className='h-5 w-11' />
              </div>
              <div className='space-y-2'>
                <Skeleton className='h-5 w-[98px]' />
                <Skeleton className='h-5 w-11' />
              </div>
            </div>
          </div>
          <div className='space-y-3'>
            <Skeleton className='h-6 w-[110px]' />
            <Skeleton className='h-9 w-full' />
          </div>
        </div>
      </div>
    </div>
  );
}

const FormSectionSuspense = ({ videoId }: FormSectionProps) => {
  const router = useRouter();
  const utils = trpc.useUtils();

  const [thumbnailModalOpen, setThumbnailModalOpen] = useState(false);
  const [thumbnailGenerateModalOpen, setThumbnailGenerateModalOpen] = useState(false);

  const [video] = trpc.studio.getOne.useSuspenseQuery({ id: videoId });
  const [categories] = trpc.categories.getMany.useSuspenseQuery();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const update = trpc.videos.update.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
      utils.studio.getOne.invalidate({ id: videoId });
      toast.success('Video updated');
    },
    onError: (error) => {
      toast.error('Failed to update your video', { description: 'Please refresh the page and try again' });
      console.log('Error updating video:', error.message);
    }
  });

  const remove = trpc.videos.remove.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
      toast.success('Video deleted');
      router.push('/studio');
    },
    onError: (error) => {
      toast.error('Failed to delete your video', { description: 'Please refresh the page and try again' });
      console.log('Error deleting video:', error.message);
    }
  });

  const restoreThumbnail = trpc.videos.restoreThumbnail.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
      utils.studio.getOne.invalidate({ id: videoId });
      toast.success('Thumbnail restored');
    },
    onError: (error) => {
      toast.error('Failed to restore your thumbnail', { description: 'Please refresh the page and try again' });
      console.log('Error restoring thumbnail:', error.message);
    }
  });

  const generateTitle = trpc.videos.generateTitle.useMutation({
    onSuccess: () => {
      toast.success('Title generation has started', { description: 'This could take a while' });
    },
    onError: (error) => {
      toast.error('Failed to generate your title', { description: 'Please refresh the page and try again' });
      console.log('Error generating title:', error.message);
    }
  });

  const generateDescription = trpc.videos.generateDescription.useMutation({
    onSuccess: () => {
      toast.success('Description generation has started', { description: 'This could take a while' });
    },
    onError: (error) => {
      toast.error('Failed to generate your description', { description: 'Please refresh the page and try again' });
      console.log('Error generating description:', error.message);
    }
  });

  const form = useForm<z.infer<typeof videoUpdateSchema>>({
    resolver: zodResolver(videoUpdateSchema),
    defaultValues: video
  });

  const onSubmit = (data: z.infer<typeof videoUpdateSchema>) => {
    update.mutate(data);
  }

  const fullUrl = `${process.env.VERCEL_URL || 'http://localhost:3000'}/videos/${videoId}`;
  const [isCopied, setIsCopied] = useState(false);

  const onCopy = async () => {
    await navigator.clipboard.writeText(fullUrl);
    setIsCopied(true);
    toast.success('Link copied to clipboard');

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  }

  return (
    <>
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent className='p-7 gap-y-8'>
          <AlertDialogHeader className='gap-y-2'>
            <AlertDialogTitle className='text-xl'>Are you sure to delete this video?</AlertDialogTitle>
            <AlertDialogDescription className='text-text text-base'>
              This action cannot be undone. This will permanently delete your video
              from the server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className='gap-x-2'>
            <AlertDialogCancel title='Come back'>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              title='I understand and still want to delete this video'
              onClick={() => remove.mutate({ id: videoId })}
              className='bg-destructive hover:bg-destructive/80' 
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <ThumbnailUploadModal 
        open={thumbnailModalOpen} 
        onOpenChangeAction={setThumbnailModalOpen}
        videoId={videoId}
      />
      <ThumbnailGenerateModal 
        open={thumbnailGenerateModalOpen} 
        onOpenChangeAction={setThumbnailGenerateModalOpen} 
        videoId={videoId}
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='flex items-center justify-between mb-8'>
            <div className='flex flex-col gap-y-2'>
              <h1 className='text-2xl font-bold'>Video details</h1>
              <p className='text-sm text-text-foreground'>Manage your video details</p>
            </div>
            <div className='flex items-center gap-x-4'>
              <Button 
                type='submit' 
                variant='basic' 
                disabled={update.isPending || !form.formState.isDirty}
                className='select-none'
              >
                Save
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' size='icon'>
                    <MoreVerticalIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuItem 
                    onClick={() => setIsDeleteOpen(true)}
                    className='cursor-pointer select-none' 
                  >
                    <TrashIcon className='size-4 mr-2 text-destructive' />
                    <span className='text-destructive'>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className='grid grid-cols-1 lg:grid-cols-5 gap-12'>
            <div className='space-y-8 lg:col-span-3'>
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem className='flex flex-col gap-y-1'>
                    <FormLabel className='text-base'>
                      <div
                        title='Generate a title using AI. This feature may not work for non-English video.'
                        className='flex items-center gap-x-3'
                      >
                        Title
                        <Button
                          size='icon'
                          variant='outline'
                          type='button'
                          className='rounded-full size-6 [&_svg]:size-3'
                          onClick={() => generateTitle.mutate({ id: videoId })}
                          disabled={generateTitle.isPending || generateDescription.isPending}
                        >
                          {generateTitle.isPending 
                            ? <Loader2Icon className='animate-spin' /> 
                            : <SparklesIcon />
                          }
                        </Button>
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder='Add a title to your video'
                        className='placeholder:text-text-foreground'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem className='flex flex-col gap-y-1'>
                    <FormLabel className='text-base'>
                      <div
                        title='Generate a description using AI. This feature may not work for non-English video.'
                        className='flex items-center gap-x-3'
                      >
                        Description
                        <Button
                          size='icon'
                          variant='outline'
                          type='button'
                          className='rounded-full size-6 [&_svg]:size-3'
                          onClick={() => generateDescription.mutate({ id: videoId })}
                          disabled={generateDescription.isPending || !video.muxTrackId || generateTitle.isPending}
                        >
                          {generateDescription.isPending 
                            ? <Loader2Icon className='animate-spin' /> 
                            : <SparklesIcon />
                          }
                        </Button>
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        value={field.value ?? ''}
                        rows={10}
                        className='resize-none pr-10 placeholder:text-text-foreground'
                        placeholder='Add a description to your video'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name='thumbnailUrl'
                control={form.control}
                render={() => (
                  <FormItem className='space-y-3'>
                    <FormLabel>
                      <span className='text-base'>
                        Thumbnail
                      </span>
                    </FormLabel>
                    <FormControl>
                      <div className='p-1 border border-dotted border-neutral-700 rounded-md relative h-32 aspect-video group'>
                        <Image
                          src={video.thumbnailUrl ?? THUMBNAIL_FALLBACK}
                          fill
                          alt='Thumbnail'
                          className='object-cover rounded-md'
                        />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              type='button'
                              size='icon'
                              className='bg-black/50 hover:bg-black/50 absolute top-1 right-1 rounded-full opacity-100 md:opacity-0 group-hover:opacity-100 duration-200 size-7'
                            >
                              <MoreVerticalIcon className='text-white' />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className='ml-3' align='start' side='right'>
                            <DropdownMenuItem
                              onClick={() => setThumbnailModalOpen(true)}
                              className='cursor-pointer'
                            >
                              <ImagePlusIcon className='size-4 mr-1' />
                              Change
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => setThumbnailGenerateModalOpen(true)}
                              className='cursor-pointer'
                            >
                              <SparklesIcon className='size-4 mr-1' />
                              AI-generated
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => restoreThumbnail.mutate({ id: videoId })}
                              className='cursor-pointer'
                            >
                              <RotateCcwIcon className='size-4 mr-1' />
                              Restore
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              >
              </FormField>
              <FormField
                control={form.control}
                name='categoryId'
                render={({ field }) => (
                  <FormItem className='flex flex-col gap-y-1'>
                    <FormLabel className='text-base'>
                      Category
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value ?? undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Choose a category'/>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='flex flex-col gap-y-8 lg:col-span-2'>
              <div className='bg-muted/50 flex flex-col gap-4 rounded-xl overflow-hidden h-fit'>
                <div className='aspect-video overflow-hidden relative'>
                  <VideoPlayer
                    playbackId={video.muxPlaybackId}
                    thumbnailUrl={video.thumbnailUrl}
                  />
                </div>
                <div className='p-4 space-y-6'>
                  <div className='flex justify-between items-center gap-x-2'>
                    <div className='flex flex-col gap-y-1'>
                      <p className='text-text text-sm'>
                        Video link
                      </p>
                      <div className='flex items-center gap-x-2'>
                        <Link href={`/videos/${video.id}`}>
                          <p className='line-clamp-1 text-sm text-secondary hover:underline'>
                          {fullUrl}
                          </p>
                        </Link>
                        <Button
                          title='Copy link'
                          type='button'
                          variant='ghost'
                          size='icon'
                          className='shrink-0'
                          onClick={onCopy}
                          disabled={isCopied}
                        >
                          {isCopied ? <CopyCheckIcon /> : <CopyIcon />}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className='flex justify-between items-center'>
                    <div className='flex flex-col gap-y-1'>
                      <p className='text-text text-sm'>
                        Video status
                      </p>
                      <p className='text-sm'>
                        {snakeCaseToTitle(video.muxStatus)}
                      </p>
                    </div>
                  </div>

                  <div className='flex justify-between items-center'>
                    <div className='flex flex-col gap-y-1'>
                      <p className='text-text text-sm'>
                        Subtitle status
                      </p>
                      <p className='text-sm'>
                        {video.muxTrackStatus ? snakeCaseToTitle(video.muxTrackStatus) : 'No subtitle'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <FormField
                control={form.control}
                name='visibility'
                render={({ field }) => (
                  <FormItem className='flex flex-col gap-y-1'>
                    <FormLabel className='text-base'>
                      Display mode
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value ?? undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Choose a display mode'/>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='public'>
                          <div className='flex items-center'>
                            <Globe2Icon className='size-4 mr-2' />
                            Public
                          </div>
                        </SelectItem>
                        <SelectItem value='private'>
                          <div className='flex items-center'>
                            <LockIcon className='size-4 mr-2' />
                            Private
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
    </>
  );
}