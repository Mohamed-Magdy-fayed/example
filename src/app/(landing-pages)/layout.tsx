import { Footer } from "@/app/(landing-pages)/_layout/footer";
import { Header } from "@/app/(landing-pages)/_layout/header";

export default async function LandingPageLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
