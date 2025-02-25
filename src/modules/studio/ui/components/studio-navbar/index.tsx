import Image from "next/image";
import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SearchInput } from "./search-input";
import { AuthButton } from "@/modules/auth/ui/component/auth-button";
import { StudioUploadModal } from "../studio-upload-modal";


export const StudioNavbar = () => {
  return (
    <nav className='fixed top-0 left-0 right-0 h-16 bg-white flex items-center px-2 pr-5 z-50 border-b shadow-md'>
      <div className='flex items-center gap-4 w-full'>
        {/* Menu and Logo */}
        <div className='flex items-center flex-shrink-0'>
          <SidebarTrigger />
          <Link href='/studio'>
          <div className='p-4 flex items-center gap-1'>
            <Image 
              src='/studio.png' 
              alt='Flicket Studio' 
              width={180} 
              height={0}
              priority
              className='w-[180px] h-auto object-contain select-none'
            />
          </div>
          </Link>
        </div>

        {/* Search bar */}
        <div className='flex-1 flex justify-center max-w-[720px] mx-auto'>
          <SearchInput />
        </div>

        <div className='flex flex-shrink-0 items-center gap-4'>
          <StudioUploadModal />
          <AuthButton />
        </div>
      </div>
    </nav>
  );
}