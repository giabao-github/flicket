"use client";

import Link from "next/link";
import { ChevronRightIcon, HistoryIcon, ListVideoIcon, SquarePlayIcon, ThumbsUpIcon } from "lucide-react";
import { useAuth, useClerk } from "@clerk/nextjs";
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";


const items = [
  {
    title: 'History',
    url: '/playlists/history',
    icon: HistoryIcon,
    auth: true
  },
  {
    title: 'Playlists',
    url: '/playlists',
    icon: ListVideoIcon,
    auth: true
  },
  {
    title: 'Liked videos',
    url: '/playlists/liked',
    icon: ThumbsUpIcon,
    auth: true
  },
  {
    title: 'Your videos',
    url: '/studio',
    icon: SquarePlayIcon,
    auth: true
  },
];

export const PersonalSection = () => {
  const clerk = useClerk();
  const { isSignedIn } = useAuth();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <Link
          href='/users/current' 
          className='flex flex-row items-center gap-x-2 cursor-pointer text-base mb-4 w-full px-2 py-1.5 rounded-lg hover:bg-sidebar-accent select-none'>
          You
          <ChevronRightIcon size={18} />
        </Link>
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                asChild
                isActive={false}
                onClick={(e) => {
                  if (!isSignedIn && item.auth) {
                    e.preventDefault();
                    return clerk.openSignIn();
                  }
                }}
                className='select-none'
              > 
                <Link href={item.url} className='flex items-center gap-4'>
                  <item.icon />
                  <span className='text-base'>
                    {item.title}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}