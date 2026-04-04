"use client";

import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  Mail,
  MapPin,
  Phone,
  YoutubeIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { subscribeToNewsletter } from "@/app/(landing-pages)/_layout/actions";
import LogoLink from "@/app/(landing-pages)/_shared/logo-link";
import { ActionButton } from "@/components/ui/action-button";
import { H3, P, Small } from "@/components/ui/typography";
import { useTranslation } from "@/features/core/i18n/useTranslation";

const APP_CONFIG = {
  name: "Mohamed Magdy (Megz)",
  email: "info@gateling.com",
  phoneDisplay: "201123862218",
  phoneDial: "+20112386221",
  whatsapp: "20112386221",
  facebook: "https://www.facebook.com/mohamedmagdyfayed",
  youtube: "https://www.youtube.com/@mohamedfayed",
  linkedin: "https://www.linkedin.com/in/mohamedmagdyfayed/",
  instagram: "https://www.instagram.com/mohamedmagdyfayed/",
} as const;

export function Footer() {
  const { t } = useTranslation();

  const [email, setEmail] = useState("");

  const navigation = {
    workTogether: [
      { name: t("footer.navigation.workTogether.contact"), href: "/contact" },
      { name: t("footer.navigation.workTogether.pricing"), href: "/pricing" },
      { name: t("footer.navigation.workTogether.skills"), href: "/skills" },
    ],
    company: [
      { name: t("footer.navigation.company.about"), href: "/about" },
      { name: t("footer.navigation.company.projects"), href: "/projects" },
      { name: t("footer.navigation.company.process"), href: "/#process" },
      {
        name: t("footer.navigation.company.testimonials"),
        href: "/#testimonials",
      },
    ],
    resources: [
      { name: t("footer.navigation.resources.features"), href: "/features" },
      {
        name: t("footer.navigation.resources.verifyEmail"),
        href: "/verify-email",
      },
      { name: t("footer.navigation.resources.privacy"), href: "/privacy" },
      { name: t("footer.navigation.resources.terms"), href: "/terms" },
      { name: t("footer.navigation.resources.cookies"), href: "/cookies" },
      { name: t("footer.navigation.resources.refund"), href: "/refund" },
    ],
  };

  const socialLinks = [
    { name: "Facebook", href: APP_CONFIG.facebook, icon: FacebookIcon },
    { name: "Youtube", href: APP_CONFIG.youtube, icon: YoutubeIcon },
    { name: "LinkedIn", href: APP_CONFIG.linkedin, icon: LinkedinIcon },
    { name: "Instagram", href: APP_CONFIG.instagram, icon: InstagramIcon },
  ];

  return (
    <footer className="bg-muted/30 border-t border-border/50">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-6 gap-8">
            {/* Company info */}
            <div className="lg:col-span-2">
              <LogoLink />

              <Small className="text-muted-foreground max-w-md mt-0">
                {t("footer.companyInfo.description")}
              </Small>

              {/* Contact info */}
              <div className="space-y-3 mt-6">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-primary" />
                  <Link
                    href={`mailto:${APP_CONFIG.email}`}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {APP_CONFIG.email}
                  </Link>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-primary" />
                  <Link
                    href={`tel:${APP_CONFIG.phoneDial}`}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {APP_CONFIG.phoneDisplay}
                  </Link>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">
                    {t("footer.companyInfo.location")}
                  </span>
                </div>
              </div>

              {/* Social links */}
              <div className="flex items-center gap-4 mt-6">
                {socialLinks.map((social) => (
                  <Link
                    key={social.name}
                    href={social.href}
                    className="w-9 h-9 bg-muted rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200"
                  >
                    <social.icon className="h-4 w-4 scale-100" />
                    <span className="sr-only">{social.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Navigation links */}
            <div>
              <H3 className="text-foreground mb-4 border-none pb-0">
                {t("footer.navigation.workTogether.title")}
              </H3>
              <ul className="space-y-3">
                {navigation.workTogether.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <H3 className="text-foreground mb-4 border-none pb-0">
                {t("footer.navigation.company.title")}
              </H3>
              <ul className="space-y-3">
                {navigation.company.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-2">
              {/* Newsletter signup */}
              <div className="bg-background rounded-lg p-4 border border-border/50">
                <H3 className="text-sm mb-2 border-none pb-0">
                  {t("footer.newsletter.title")}
                </H3>
                <P className="text-xs text-muted-foreground mb-3 mt-0">
                  {t("footer.newsletter.description")}
                </P>
                <div className="flex items-center gap-2">
                  <input
                    type="email"
                    placeholder={t("footer.newsletter.placeholder")}
                    className="flex-1 min-w-0 px-3 py-2 text-xs bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary/20"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <ActionButton
                    action={() => subscribeToNewsletter(email)}
                    size="sm"
                    className="px-3 py-2 bg-primary text-primary-foreground text-xs rounded hover:bg-primary/90 transition-colors"
                  >
                    {t("footer.newsletter.subscribeButton")}
                  </ActionButton>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom footer */}
        <FooterCopywrite />
      </div>
    </footer>
  );
}

export function FooterCopywrite() {
  const { t } = useTranslation();

  return (
    <div className="py-6 border-t border-border/50">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <P className="text-sm text-muted-foreground mt-0">
          {t("footer.copyright", {
            year: new Date(),
            appName: APP_CONFIG.name,
          })}
        </P>
        <P className="text-sm text-muted-foreground mt-0">
          {t("footer.companyInfo.location")}
        </P>
      </div>
    </div>
  );
}
