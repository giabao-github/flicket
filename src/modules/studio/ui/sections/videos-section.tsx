"use client";

import { Suspense } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { ErrorBoundary } from "react-error-boundary";
import { Globe2Icon, LockIcon } from "lucide-react";
import { trpc } from "@/trpc/client";
import { DEFAULT_LIMIT } from "@/constants";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { VideoThumbnail } from "@/modules/videos/ui/components/video-thumbnail";
import { snakeCaseToTitle } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";


export const VideosSection = () => {
  return (
    <Suspense fallback={<VideosSectionSkeleton />}>
      <ErrorBoundary fallback={<p>ERROR</p>}>
        <VideosSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
}

const VideosSectionSkeleton = () => {
  return (
    <>
      <div className='border-y'>
        <Table>
          <TableHeader>
            <TableRow className='text-base'>
              <TableHead className='w-[520px] pl-[76px] py-1'>Video</TableHead>
              <TableHead className='w-[275px]'>
                <span className='flex justify-center items-center'>
                  Display mode
                </span>
              </TableHead>
              <TableHead className='w-[147px]'>
                <span className='flex justify-center items-center'>
                  Status
                </span>
              </TableHead>
              <TableHead className='w-[214px]'>
                <span className='flex justify-center items-center'>
                  Date
                </span>
              </TableHead>
              <TableHead className='w-[138px]'>
                <span className='flex justify-center items-center'>
                  Views
                </span>
              </TableHead>
              <TableHead className='w-[222px]'>
                <span className='flex justify-center items-center'>
                  Comments
                </span>
              </TableHead>
              <TableHead className='w-[125px]'>
                <span className='flex justify-center items-center'>
                  Likes
                </span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell className='pl-6'>
                  <div className='flex items-center gap-4'>
                    <Skeleton className='h-[81px] w-36' />
                    <div className='flex flex-col gap-y-1'>
                      <Skeleton className='h-6 w-[80px]' />
                      <Skeleton className='h-5 w-[100px]' />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className='flex justify-center items-center'>
                    <Skeleton className='h-5 w-20' />
                  </span>
                </TableCell>
                <TableCell>
                  <span className='flex justify-center items-center'>
                    <Skeleton className='h-5 w-16' />
                  </span>
                </TableCell>
                <TableCell>
                  <span className='flex justify-center items-center'>
                    <Skeleton className='h-5 w-24' />
                  </span>
                </TableCell>
                <TableCell className='text-right'>
                  <span className='flex justify-center items-center'>
                    <Skeleton className='h-5 w-12' />
                  </span>
                </TableCell>
                <TableCell className='text-right'>
                  <span className='flex justify-center items-center'>
                    <Skeleton className='h-5 w-12' />
                  </span>
                </TableCell>
                <TableCell className='text-right'>
                  <span className='flex justify-center items-center'>
                    <Skeleton className='h-5 w-12' />
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

export const VideosSectionSuspense = () => {
  const [videos, query] = trpc.studio.getMany.useSuspenseInfiniteQuery({
    limit: DEFAULT_LIMIT
  }, {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const count = query.data.pages[0]?.count ?? 0;

  return (
    <div>
      <div className='border-y'>
        <Table>
          <TableHeader>
            <TableRow className='text-base'>
              <TableHead className='w-[520px] pl-[76px] py-1'>Video</TableHead>
              <TableHead>
                <span className='flex justify-center items-center'>
                  Display mode
                </span>
              </TableHead>
              <TableHead>
                <span className='flex justify-center items-center'>
                  Status
                </span>
              </TableHead>
              <TableHead>
                <span className='flex justify-center items-center'>
                  Date
                </span>
              </TableHead>
              <TableHead>
                <span className='flex justify-center items-center'>
                  Views
                </span>
              </TableHead>
              <TableHead>
                <span className='flex justify-center items-center'>
                  Comments
                </span>
              </TableHead>
              <TableHead>
                <span className='flex justify-center items-center'>
                  Likes
                </span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {videos.pages.flatMap((page) => page.items).map((video) => (
              <Link 
                href={`/studio/videos/${video.id}`} 
                key={video.id}
                legacyBehavior
              >
                <TableRow className='cursor-pointer'>
                  <TableCell className='pl-6'>
                    <div className='flex items-center gap-4'>
                      <div className='relative aspect-video w-36 shrink-0'>
                        <VideoThumbnail 
                          title={video.title}
                          duration={video.duration || 0}
                          thumbnailUrl={video.thumbnailUrl} 
                          previewUrl={video.previewUrl}
                        />
                      </div>
                      <div className='flex flex-col overflow-hidden gap-y-1 max-w-[65%]'>
                        <span className='text-base line-clamp-1'>{video.title}</span>
                        <span className='text-sm text-text-foreground line-clamp-1'>
                          {video.description || 'No description'}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center justify-center'>
                      {video.visibility === 'private' ? (
                        <LockIcon className='size-4 mr-2' />
                      ) : (
                        <Globe2Icon className='size-4 mr-2' />
                      )}
                      {snakeCaseToTitle(video.visibility)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center justify-center'>
                      {snakeCaseToTitle(video.muxStatus)}
                    </div>
                  </TableCell>
                  <TableCell className='truncate'>
                    <span className='flex items-center justify-center'>
                      {format(new Date(video.createdAt), 'd MMM yyyy')}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className='flex items-center justify-center'>
                      1326
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className='flex items-center justify-center'>
                      125
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className='flex items-center justify-center'>
                      562
                    </span>
                  </TableCell>
                </TableRow>
              </Link>
            ))}
          </TableBody>
        </Table>
      </div>
      <InfiniteScroll 
        count={count}
        isManual
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
      />
    </div>
  );
}