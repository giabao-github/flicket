import { Kanit } from "next/font/google";

const kanit = Kanit({ 
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin", "thai", "vietnamese"] 
});

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div>
      <div className={`bg-primary p-4 w-full ${kanit.className}`}>Navbar here</div>
      {children}
    </div>
  );
}

export default Layout;  