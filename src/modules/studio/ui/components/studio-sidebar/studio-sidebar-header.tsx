import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { UserAvatar } from "@/components/user-avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { SidebarHeader, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";


export const StudioSidebarHeader = () => {
  const { user } = useUser();
  const { state } = useSidebar();

  if (!user) {
    return (
      <SidebarHeader className='flex items-center justify-center pb-6'>
        <Skeleton className='size-[120px] rounded-full' />
        <div className='flex flex-col gap-y-1 items-center mt-4'>
          <Skeleton className='h-6 w-[100px]' />
          <Skeleton className='h-5 w-[100px]' />
        </div>
      </SidebarHeader>
    );
  }

  if (state === 'collapsed') {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton tooltip='Your profile' asChild>
          <Link href='/users/current'>
            <UserAvatar
              avatarUrl={user.imageUrl}
              name={user.fullName ?? 'User'}
              size='sm'
              className='select-none'
            />
            <span className='text-base'>Your profile</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  return (
    <SidebarHeader className='flex items-center justify-center pb-6'>
      <Link href='/users/current'>
        <UserAvatar
          avatarUrl={user?.imageUrl}
          name={user.fullName ?? 'User'}
          className='size-[120px] hover:opacity-80 transition-opacity select-none'
        />
      </Link>
      <div className='flex flex-col gap-y-1 items-center mt-4'>
        <p className='text-base font-semibold'>
          Your profile
        </p>
        <p className='text-sm text-text-foreground'>
          {user.fullName}
        </p>
      </div>
    </SidebarHeader>
  );
}