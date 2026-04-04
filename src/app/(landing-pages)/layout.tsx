import { Footer } from "@/app/(landing-pages)/_layout/footer";
import { Header } from "@/app/(landing-pages)/_layout/header";
import { HydrateClient } from "@/trpc/server";

export default async function LandingPageLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <HydrateClient>
      <Header />
      <main>{children}</main>
      <Footer />
    </HydrateClient>
  );
}
