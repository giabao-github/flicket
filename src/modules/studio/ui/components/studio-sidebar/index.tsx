"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOutIcon, VideoIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Sidebar, SidebarContent, SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { StudioSidebarHeader } from "./studio-sidebar-header";


export const StudioSidebar = () => {
  const pathname = usePathname();

  return (
    <Sidebar className='pt-20 z-40 border-none shadow-md' collapsible='icon'>
      <SidebarContent className='bg-background'>
        <SidebarGroup>
          <SidebarMenu>
            <StudioSidebarHeader />
            <SidebarMenuItem>
              <SidebarMenuButton isActive={pathname === '/studio'} tooltip='Content' asChild>
                <Link href='/studio/videos' className='flex items-center gap-4'>
                  <VideoIcon className='size-5' />
                  <span className='text-base'>Content</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <Separator />
            <SidebarMenuItem>
              <SidebarMenuButton tooltip='Exit Studio' asChild>
                <Link href='/' className='flex items-center gap-4'>
                  <LogOutIcon className='size-5' />
                  <span className='text-base'>Exit Studio</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}