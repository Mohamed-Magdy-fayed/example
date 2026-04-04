"use client";

import { ArrowRight, ArrowUpRight, Code2, Globe2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTranslation } from "@/features/core/i18n/useTranslation";
import { cn } from "@/lib/utils";
import type { Project } from "@/server/db/schema";

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
        draft: t("projects.detail.status.draft"),
        published: t("projects.detail.status.published"),
        archived: t("projects.detail.status.archived"),
    };

    return (
        <Card
            className={cn(
                "group flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/60 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl",
                className,
            )}
        >
            <div className="relative">
                <Link href={`/projects/${project.id}`} className="block">
                    <div className="relative aspect-[16/9] w-full overflow-hidden">
                        {project.coverImageUrl ? (
                            <>
                                <Image
                                    src={project.coverImageUrl}
                                    alt={project.title}
                                    fill
                                    className="object-cover transition duration-500 group-hover:scale-105"
                                />
                                <span className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
                            </>
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-muted/70 via-background to-background/80 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                {t("projects.card.preview")}
                            </div>
                        )}
                    </div>
                    <span className="sr-only">
                        {t("projects.card.viewProject", { title: project.title })}
                    </span>
                </Link>
                <div className="pointer-events-none absolute left-4 top-4 flex flex-wrap items-center gap-2">
                    {project.featured ? (
                        <Badge variant="secondary" className="backdrop-blur-sm">
                            {t("projects.detail.badges.featured")}
                        </Badge>
                    ) : null}
                    <Badge
                        variant="outline"
                        className={cn(
                            "text-[0.65rem] font-semibold uppercase tracking-wide backdrop-blur",
                            statusStyles[project.status],
                        )}
                    >
                        {statusLabels[project.status]}
                    </Badge>
                </div>
            </div>
            <div className="flex flex-1 flex-col gap-5 p-6">
                <div className="space-y-3">
                    <Link
                        href={`/projects/${project.id}`}
                        className="group/link inline-flex items-center gap-2 text-left"
                    >
                        <h3 className="text-xl font-semibold leading-tight tracking-tight transition-colors group-hover/link:text-primary">
                            {project.title}
                        </h3>
                        <ArrowUpRight
                            className="h-4 w-4 text-muted-foreground transition-colors group-hover/link:text-primary"
                            aria-hidden="true"
                        />
                    </Link>
                    {project.subtitle ? (
                        <p className="text-sm text-muted-foreground">{project.subtitle}</p>
                    ) : null}
                    {project.summary ? (
                        <p className="text-sm text-muted-foreground/90 line-clamp-4">
                            {project.summary}
                        </p>
                    ) : null}
                </div>
                <div className="mt-auto flex flex-wrap items-center gap-3">
                    {project.liveUrl ? (
                        <Button asChild size="sm" className="gap-1.5">
                            <a href={project.liveUrl} target="_blank" rel="noreferrer">
                                <Globe2 className="h-4 w-4" aria-hidden="true" />
                                {t("projects.card.visitSite")}
                            </a>
                        </Button>
                    ) : null}
                    {project.repoUrl ? (
                        <Button
                            asChild
                            size="sm"
                            variant={project.liveUrl ? "outline" : "default"}
                            className="gap-1.5"
                        >
                            <a href={project.repoUrl} target="_blank" rel="noreferrer">
                                <Code2 className="h-4 w-4" aria-hidden="true" />
                                {t("projects.card.viewCode")}
                            </a>
                        </Button>
                    ) : null}
                    <Button
                        asChild
                        size="sm"
                        variant="ghost"
                        className="ml-auto gap-1.5 text-muted-foreground hover:text-primary"
                    >
                        <Link href={`/projects/${project.id}`}>
                            {t("projects.card.learnMore")}
                            <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </Link>
                    </Button>
                </div>
            </div>
        </Card>
    );
}
