"use client";

import { ArrowRight, ArrowUpRight, Code2, Globe2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AnchorButton, LinkButton } from "@/components/general/link-button";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useTranslation } from "@/features/core/i18n/useTranslation";
import { cn } from "@/lib/utils";

type Project = {
    id: string;
    title: string;
    subtitle?: string | null;
    summary?: string | null;
    coverImageUrl?: string | null;
    featured?: boolean | null;
    status: "draft" | "published" | "archived";
    liveUrl?: string | null;
    repoUrl?: string | null;
};

type ProjectCardProps = {
    project: Project;
    className?: string;
};

const statusStyles: Record<Project["status"], string> = {
    draft:
        "border-transparent bg-amber-200/80 text-amber-900 dark:bg-amber-300/20 dark:text-amber-200",
    published:
        "border-transparent bg-emerald-200/80 text-emerald-900 dark:bg-emerald-400/20 dark:text-emerald-200",
    archived:
        "border-transparent bg-slate-200/80 text-slate-800 dark:bg-slate-500/20 dark:text-slate-100",
};

export function ProjectCard({ project, className }: ProjectCardProps) {
    const { t } = useTranslation();

    const statusLabels: Record<Project["status"], string> = {
        draft: t("pricing.projects.detail.status.draft"),
        published: t("pricing.projects.detail.status.published"),
        archived: t("pricing.projects.detail.status.archived"),
    };

    return (
        <Card
            className={cn(
                "group flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/60 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl",
                className,
            )}
        >
            <div className="relative">
                <Link className="block" href={`/projects/${project.id}`}>
                    <div className="relative aspect-[16/9] w-full overflow-hidden">
                        {project.coverImageUrl ? (
                            <>
                                <Image
                                    alt={project.title}
                                    className="object-cover transition duration-500 group-hover:scale-105"
                                    fill
                                    src={project.coverImageUrl}
                                />
                                <span className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
                            </>
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-muted/70 via-background to-background/80 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                                {t("pricing.projects.card.preview")}
                            </div>
                        )}
                    </div>
                    <span className="sr-only">
                        {t("pricing.projects.card.viewProject", {
                            title: project.title,
                        })}
                    </span>
                </Link>
                <div className="pointer-events-none absolute top-4 left-4 flex flex-wrap items-center gap-2">
                    {project.featured ? (
                        <Badge className="backdrop-blur-sm" variant="secondary">
                            {t("pricing.projects.detail.badges.featured")}
                        </Badge>
                    ) : null}
                    <Badge
                        className={cn(
                            "font-semibold text-[0.65rem] uppercase tracking-wide backdrop-blur",
                            statusStyles[project.status],
                        )}
                        variant="outline"
                    >
                        {statusLabels[project.status]}
                    </Badge>
                </div>
            </div>
            <div className="flex flex-1 flex-col gap-5 p-6">
                <div className="space-y-3">
                    <Link
                        className="group/link inline-flex items-center gap-2 text-left"
                        href={`/projects/${project.id}`}
                    >
                        <h3 className="font-semibold text-xl leading-tight tracking-tight transition-colors group-hover/link:text-primary">
                            {project.title}
                        </h3>
                        <ArrowUpRight
                            aria-hidden="true"
                            className="h-4 w-4 text-muted-foreground transition-colors group-hover/link:text-primary"
                        />
                    </Link>
                    {project.subtitle ? (
                        <p className="text-muted-foreground text-sm">{project.subtitle}</p>
                    ) : null}
                    {project.summary ? (
                        <p className="line-clamp-4 text-muted-foreground/90 text-sm">
                            {project.summary}
                        </p>
                    ) : null}
                </div>
                <div className="mt-auto flex flex-wrap items-center gap-3">
                    {project.liveUrl ? (
                        <AnchorButton
                            className="gap-1.5"
                            href={project.liveUrl}
                            rel="noreferrer"
                            size="sm"
                            target="_blank"
                        >
                            <Globe2 aria-hidden="true" className="h-4 w-4" />
                            {t("pricing.projects.card.visitSite")}
                        </AnchorButton>
                    ) : null}
                    {project.repoUrl ? (
                        <AnchorButton
                            className="gap-1.5"
                            href={project.repoUrl}
                            rel="noreferrer"
                            size="sm"
                            target="_blank"
                            variant={project.liveUrl ? "outline" : "default"}
                        >
                            <Code2 aria-hidden="true" className="h-4 w-4" />
                            {t("pricing.projects.card.viewCode")}
                        </AnchorButton>
                    ) : null}
                    <LinkButton
                        className="ml-auto gap-1.5 text-muted-foreground hover:text-primary"
                        href={`/projects/${project.id}`}
                        size="sm"
                        variant="ghost"
                    >
                        {t("pricing.projects.card.learnMore")}
                        <ArrowRight aria-hidden="true" className="h-4 w-4" />
                    </LinkButton>
                </div>
            </div>
        </Card>
    );
}
