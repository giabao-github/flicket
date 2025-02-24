import { StudioLayout } from "@/modules/studio/ui/layouts/studio-layout";


interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <StudioLayout>
      <title>Flicket Studio</title>
      {children}
    </StudioLayout>
  );
}

export default Layout;