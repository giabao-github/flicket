import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useEffect } from "react";
import { Button } from "./ui/button";

interface InfiniteScrollProps {
  count: number;
  isManual?: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

export const InfiniteScroll = ({
  count,
  isManual = false,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage
}: InfiniteScrollProps) => {
  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.5,
    rootMargin: '100px'
  });

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isManual && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, isIntersecting, isManual]);

  return (
    <div className='flex flex-col items-center gap-4 p-4 my-8'>
      <div ref={targetRef} className='h-1 flex items-center'>
        {hasNextPage ? (
          <Button
            variant='default'
            disabled={!hasNextPage || isFetchingNextPage}
            onClick={() => fetchNextPage()}
          >
            {isFetchingNextPage ? 'Loading...' : 'Load more'}
          </Button>
        ): (
          <p className='text-sm text-text-foreground'>
            {count === 0 ? 'No content' : 'End of content'}
          </p>
        )}
      </div>
    </div>
  );
}