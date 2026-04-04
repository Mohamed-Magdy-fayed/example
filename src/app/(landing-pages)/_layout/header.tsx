'use client';

import {
  LayoutDashboardIcon,
  LogInIcon,
  LogOutIcon,
  MenuIcon,
  XIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, useTransition } from 'react';

import LogoLink from '@/app/(landing-pages)/_shared/logo-link';
import { mainTranslations } from '@/features/core/i18n/global';
import { ThemeToggle } from '@/features/core/color-theme/theme-toggle';
import { LanguageSwitcher, useTranslation } from '@/features/core/i18n/useTranslation';
import layoutAr from '@/app/(landing-pages)/_layout/_translations/layout-ar';
import layoutEn from '@/app/(landing-pages)/_layout/_translations/layout-en';
import WrapWithTooltip from '@/components/wrap-with-tooltip';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Spinner } from '@/components/ui/spinner';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { signOutAction } from '@/features/core/auth/nextjs/actions';
import { useAuth } from '@/features/core/auth/nextjs/components/auth-provider';
import { SignInForm } from '@/features/core/auth/nextjs/components/sign-in-form';
import { AuthManager } from '@/features/core/auth/nextjs/components/auth-manager';
import { UserAvatar } from '@/features/core/auth/nextjs/components/user-avatar';

const landingTranslations = {
  en: { ...mainTranslations.en, ...layoutEn },
  ar: { ...mainTranslations.ar, ...layoutAr },
} as const;

export function Header() {
  const { t } = useTranslation(landingTranslations);

  const { isAuthenticated, session } = useAuth()

  const isMobile = useIsMobile();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: t('header.navigation.home'), href: '/' },
    { name: t('header.navigation.about'), href: '/about' },
    { name: t('header.navigation.skills'), href: '/skills' },
    { name: t('header.navigation.projects'), href: '/projects' },
    { name: t('header.navigation.contact'), href: '/contact' },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 ease-in-out",
        isScrolled
          ? "border-b bg-background/80 backdrop-blur-md shadow-sm supports-backdrop-filter:bg-background/80"
          : "border-b border-transparent bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60"
      )}
    >
      <div className="container mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex h-16 gap-4 items-center justify-between">
          {/* Logo with enhanced styling */}
          <LogoLink />

          {/* Desktop Navigation with enhanced styling */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-all duration-200 rounded-md hover:bg-accent/50 group"
              >
                {item.name}
                <span className="absolute inset-x-4 bottom-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
              </Link>
            ))}
          </nav>

          {/* Right side actions with improved spacing and animations */}
          <div className="flex items-center gap-2">
            {/* Authentication Actions */}
            <div className="flex items-center gap-2 ml-2">
              {!isAuthenticated && (
                <Popover>
                  <WrapWithTooltip text={t("authTranslations.signIn.tooltip")}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="secondary"
                        size="icon"
                      >
                        <LogInIcon size={16} />
                      </Button>
                    </PopoverTrigger>
                  </WrapWithTooltip>
                  <PopoverContent className="w-80 p-4">
                    <SignInForm />
                  </PopoverContent>
                </Popover>
              )}

              {isAuthenticated && (
                <AuthManager
                  trigger={
                    <Button variant="ghost" size={"icon"} className="rounded-full">
                      <UserAvatar />
                    </Button>
                  }
                />
              )}

              {/* CTA Buttons */}
              {(!isAuthenticated || session?.user.role !== "admin") && (
                <Button
                  asChild
                  className="hidden sm:inline-flex transition-all duration-200 hover:translate-y-0.5 shadow-sm hover:shadow-md"
                >
                  <Link href="/contact">
                    {t('getStarted')}
                  </Link>
                </Button>
              )}

              {isAuthenticated && session?.user.role === "admin" && (
                <Button
                  asChild
                  className="hidden md:inline-flex transition-all duration-200 hover:translate-y-0.5 shadow-sm hover:shadow-md"
                >
                  <Link href="/dashboard">
                    <LayoutDashboardIcon size={16} className="mr-2" />
                    {t('common.dashboard')}
                  </Link>
                </Button>
              )}
            </div>

            {/* Enhanced Mobile Navigation */}
            <div className="lg:hidden ml-2">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen} modal>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="transition-all duration-200 hover:scale-105"
                  >
                    <MenuIcon size={20} />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side={isMobile ? 'bottom' : "right"}
                  className="w-full md:w-80 p-0"
                >
                  {/* Mobile Menu Header */}
                  <div className="flex items-center justify-between p-6 border-b">
                    <LogoLink />
                    <SheetClose asChild>
                      <Button variant="ghost" size="sm">
                        <XIcon size={20} />
                      </Button>
                    </SheetClose>
                  </div>

                  {/* Mobile Navigation Links */}
                  <div className="flex flex-col p-6 space-y-2">
                    {navigation.map((item, index) => (
                      <Button
                        variant="ghost"
                        size="lg"
                        key={item.name}
                        className="w-full justify-start text-left transition-all duration-200 hover:translate-x-2"
                        asChild
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <Link
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      </Button>
                    ))}
                  </div>

                  {/* Mobile CTA Section */}
                  <div className="p-6 border-t bg-accent/20">
                    {isAuthenticated ? (
                      <Button asChild className="w-full" size="lg">
                        <Link href="/dashboard">
                          <LayoutDashboardIcon size={16} className="mr-2" />
                          {t('common.dashboard')}
                        </Link>
                      </Button>
                    ) : (
                      <Button asChild className="w-full" size="lg">
                        <Link href="/contact">
                          {t('getStarted')}
                        </Link>
                      </Button>
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