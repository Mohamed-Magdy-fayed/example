"use client";

import { Laptop, Layers, Router, Wrench } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { H2, P } from "@/components/ui/typography";
import { useScrollAnimation } from "@/hooks/use-animation";
import { useTranslation } from "@/features/core/i18n/useTranslation";

const toolGroups = [
    { key: "interface", Icon: Laptop },
    { key: "frontend", Icon: Layers },
    { key: "backend", Icon: Router },
    { key: "devops", Icon: Wrench },
] as const;

export function SkillsToolsetSection() {
    const { t } = useTranslation();
    const toolsetAnimation = useScrollAnimation();

    return (
        <section className="py-20">
            <div className="container mx-auto px-4">
                <div
                    ref={toolsetAnimation.elementRef}
                    className={`text-center mb-16 transition-all duration-1000 ${toolsetAnimation.isVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-10"
                        }`}
                >
                    <H2 className="mb-4">{t("skills.toolset.title")}</H2>
                    <P className="text-muted-foreground max-w-3xl mx-auto">
                        {t("skills.toolset.description")}
                    </P>
                </div>

                <div
                    className={`grid md:grid-cols-2 gap-8 transition-all duration-1000 delay-200 ${toolsetAnimation.isVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-10"
                        }`}
                >
                    {toolGroups.map(({ key, Icon }) => (
                        <Card
                            key={key}
                            className="h-full hover:-translate-y-2 hover:shadow-lg transition-all duration-300"
                        >
                            <CardHeader className="flex flex-row items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                                    <Icon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                                </div>
                                <CardTitle>{t(`skills.toolset.groups.${key}.title`)}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <P className="text-muted-foreground">
                                    {t(`skills.toolset.groups.${key}.description`)}
                                </P>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
