import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AccessibilityTool from "@/components/AccessibilityTool";
import CookieBanner from "@/components/CookieBanner";
import StylesLoader from "@/components/StylesLoader";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <StylesLoader />
      <Header mosqueName="Фатиха" />
      <AccessibilityTool />
      <CookieBanner />
      <div>{children}</div>
      <Footer />
    </>
  );
}
