"use client";

import {
  LayoutDashboardIcon,
  LogInIcon,
  MenuIcon,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import LogoLink from "@/app/(landing-pages)/_shared/logo-link";
import { LinkButton } from "@/components/general/link-button";
import { WrapWithTooltip } from "@/components/general/wrap-with-tooltip";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AuthManager } from "@/features/core/auth/nextjs/components/auth-manager";
import { useAuth } from "@/features/core/auth/nextjs/components/auth-provider";
import { SignInForm } from "@/features/core/auth/nextjs/components/sign-in-form";
import { UserAvatar } from "@/features/core/auth/nextjs/components/user-avatar";
import { useTranslation } from "@/features/core/i18n/useTranslation";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export function Header() {
  const { t } = useTranslation();

  const { isAuthenticated, session } = useAuth();

  const isMobile = useIsMobile();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigation = [
    { name: t("header.navigation.home"), href: "/" },
    { name: t("header.navigation.about"), href: "/about" },
    { name: t("header.navigation.skills"), href: "/skills" },
    { name: t("header.navigation.projects"), href: "/projects" },
    { name: t("header.navigation.contact"), href: "/contact" },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 ease-in-out",
        isScrolled
          ? "border-b bg-background/80 shadow-sm backdrop-blur-md supports-backdrop-filter:bg-background/80"
          : "border-transparent border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60",
      )}
    >
      <div className="container mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo with enhanced styling */}
          <LogoLink />

          {/* Desktop Navigation with enhanced styling */}
          <nav className="hidden items-center space-x-1 lg:flex">
            {navigation.map((item) => (
              <Link
                className="group relative rounded-md px-4 py-2 font-medium text-foreground/80 text-sm transition-all duration-200 hover:bg-accent/50 hover:text-foreground"
                href={item.href}
                key={item.name}
              >
                {item.name}
                <span className="absolute inset-x-4 bottom-0 h-0.5 origin-left scale-x-0 bg-primary transition-transform duration-200 group-hover:scale-x-100" />
              </Link>
            ))}
          </nav>

          {/* Right side actions with improved spacing and animations */}
          <div className="flex items-center gap-2">
            {/* Authentication Actions */}
            <div className="ml-2 flex items-center gap-2">
              {!isAuthenticated && (
                <Popover>
                  <WrapWithTooltip text={t("authTranslations.signIn.tooltip")}>
                    <PopoverTrigger
                      render={
                        <Button size="icon" variant="secondary">
                          <LogInIcon size={16} />
                        </Button>
                      }
                    />
                  </WrapWithTooltip>
                  <PopoverContent className="w-80 p-4">
                    <SignInForm />
                  </PopoverContent>
                </Popover>
              )}

              {isAuthenticated && (
                <AuthManager
                  trigger={
                    <Button
                      className="rounded-full"
                      size={"icon"}
                      variant="ghost"
                    >
                      <UserAvatar />
                    </Button>
                  }
                />
              )}

              {/* CTA Buttons */}
              {(!isAuthenticated || session?.user.role !== "admin") && (
                <LinkButton
                  className="hidden shadow-sm transition-all duration-200 hover:translate-y-0.5 hover:shadow-md sm:inline-flex"
                  href="/contact"
                >
                  {t("getStarted")}
                </LinkButton>
              )}

              {isAuthenticated && session?.user.role === "admin" && (
                <LinkButton
                  className="hidden shadow-sm transition-all duration-200 hover:translate-y-0.5 hover:shadow-md md:inline-flex"
                  href="/dashboard"
                >
                  <LayoutDashboardIcon className="mr-2" size={16} />
                  {t("common.dashboard")}
                </LinkButton>
              )}
            </div>

            {/* Enhanced Mobile Navigation */}
            <div className="ml-2 lg:hidden">
              <Sheet
                modal
                onOpenChange={setIsMobileMenuOpen}
                open={isMobileMenuOpen}
              >
                <SheetTrigger
                  render={
                    <Button
                      className="transition-all duration-200 hover:scale-105"
                      size="sm"
                      variant="ghost"
                    >
                      <MenuIcon size={20} />
                    </Button>
                  }
                />
                <SheetContent
                  className="w-full p-0 md:w-80"
                  side={isMobile ? "bottom" : "right"}
                >
                  {/* Mobile Menu Header */}
                  <div className="flex items-center justify-between border-b p-6">
                    <LogoLink />
                    <SheetClose
                      render={
                        <Button size="sm" variant="ghost">
                          <XIcon size={20} />
                        </Button>
                      }
                    />
                  </div>

                  {/* Mobile Navigation Links */}
                  <div className="flex flex-col space-y-2 p-6">
                    {navigation.map((item, index) => (
                      <LinkButton
                        className="w-full justify-start text-left transition-all duration-200 hover:translate-x-2"
                        href={item.href}
                        key={item.name}
                        onClick={() => setIsMobileMenuOpen(false)}
                        size="lg"
                        style={{ animationDelay: `${index * 50}ms` }}
                        variant="ghost"
                      >
                        {item.name}
                      </LinkButton>
                    ))}
                  </div>

                  {/* Mobile CTA Section */}
                  <div className="border-t bg-accent/20 p-6">
                    {isAuthenticated ? (
                      <LinkButton
                        className="w-full"
                        href="/dashboard"
                        size="lg"
                      >
                        <LayoutDashboardIcon className="mr-2" size={16} />
                        {t("common.dashboard")}
                      </LinkButton>
                    ) : (
                      <LinkButton
                        className="w-full"
                        href="/contact"
                        size="lg"
                      >
                        {t("getStarted")}
                      </LinkButton>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
