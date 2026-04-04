"use client";

import { Compass, Hammer, PenTool, Rocket } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { H2, P } from "@/components/ui/typography";
import { useScrollAnimation } from "@/hooks/use-animation";
import { useTranslation } from "@/features/core/i18n/useTranslation";

const timelineSteps = [
    { key: "discovery", Icon: Compass },
    { key: "design", Icon: PenTool },
    { key: "build", Icon: Hammer },
    { key: "scale", Icon: Rocket },
] as const;

export function SkillsTimelineSection() {
    const { t } = useTranslation();
    const timelineAnimation = useScrollAnimation();

    return (
        <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
            <div className="container mx-auto px-4">
                <div
                    ref={timelineAnimation.elementRef}
                    className={`text-center mb-16 transition-all duration-1000 ${timelineAnimation.isVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-10"
                        }`}
                >
                    <H2 className="mb-4">{t("skills.timeline.title")}</H2>
                    <P className="text-muted-foreground max-w-3xl mx-auto">
                        {t("skills.timeline.description")}
                    </P>
                </div>

                <div
                    className={`grid md:grid-cols-2 gap-8 transition-all duration-1000 delay-200 ${timelineAnimation.isVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-10"
                        }`}
                >
                    {timelineSteps.map(({ key, Icon }, index) => (
                        <Card
                            key={key}
                            className="relative h-full overflow-hidden"
                            style={{ transitionDelay: `${index * 100}ms` }}
                        >
                            <div className="absolute inset-0 border border-dashed border-orange-200 dark:border-orange-900/40 rounded-xl pointer-events-none" />
                            <CardHeader className="relative flex flex-row items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                                    <Icon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                                </div>
                                <CardTitle>{t(`skills.timeline.steps.${key}.title`)}</CardTitle>
                            </CardHeader>
                            <CardContent className="relative">
                                <P className="text-muted-foreground">
                                    {t(`skills.timeline.steps.${key}.description`)}
                                </P>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
