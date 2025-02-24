"use client";

import { usePathname } from "next/navigation";
import { UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { ClapperboardIcon, HomeIcon, UserCircle2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";


export const AuthButton = () => {
  const pathname = usePathname();

  return (
    <>
      <SignedIn>
        <UserButton>
          <UserButton.MenuItems>
            {pathname.includes('/studio') ? (
              <UserButton.Link
              label='Flicket'
              href='/'
              labelIcon={<HomeIcon className='size-4' />}
            />
            ): (
              <UserButton.Link
                label='Flicket Studio'
                href='/studio'
                labelIcon={<ClapperboardIcon className='size-4' />}
              />
            )}
            <UserButton.Action label='manageAccount' />
          </UserButton.MenuItems>
        </UserButton>
      </SignedIn>
      <SignedOut>
        <SignInButton mode='modal'>
          <Button
            variant='outline'
            size={"lg"}
            className='px-4 py-4 text-base font-medium text-secondary hover:text-secondary/90 border-secondary/20 rounded-full shadow-none [&_svg]:size-5'
          >
            <UserCircle2Icon />
            Sign in
          </Button>
        </SignInButton>
      </SignedOut>
    </>
  );
}