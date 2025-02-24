import { Separator } from "@/components/ui/separator";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { MainSection } from "./main-section";
import { PersonalSection } from "./personal-section";


export const HomeSidebar = () => {
  return (
    <Sidebar className='pt-20 z-40 border-none shadow-md' collapsible='icon'>
      <SidebarContent className='bg-background'>
        <MainSection />
        <Separator />
        <PersonalSection />
      </SidebarContent>
    </Sidebar>
  );
}