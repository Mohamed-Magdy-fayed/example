"use client";

import { Brain, CheckCircle2, Code2, Server, ShieldCheck, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { H2, P } from "@/components/ui/typography";
import { useScrollAnimation } from "@/hooks/use-animation";
import { useTranslation } from "@/features/core/i18n/useTranslation";

const categoryOrder = [
    { key: "productStrategy", Icon: Target },
    { key: "experienceDesign", Icon: Brain },
    { key: "frontendEngineering", Icon: Code2 },
    { key: "backendAndInfra", Icon: Server },
    { key: "opsEnablement", Icon: ShieldCheck },
] as const;

const bulletKeys = ["item1", "item2", "item3"] as const;

export function SkillsCategoriesSection() {
    const { t } = useTranslation();
    const categoriesAnimation = useScrollAnimation();

    return (
        <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
            <div className="container mx-auto px-4">
                <div
                    ref={categoriesAnimation.elementRef}
                    className={`text-center mb-16 transition-all duration-1000 ${categoriesAnimation.isVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-10"
                        }`}
                >
                    <H2 className="mb-4">{t("skills.categories.sectionTitle")}</H2>
                    <P className="text-muted-foreground max-w-3xl mx-auto">
                        {t("skills.categories.sectionDescription")}
                    </P>
                </div>

                <div
                    className={`grid md:grid-cols-2 xl:grid-cols-3 gap-8 transition-all duration-1000 delay-200 ${categoriesAnimation.isVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-10"
                        }`}
                >
                    {categoryOrder.map(({ key, Icon }) => (
                        <Card
                            key={key}
                            className="h-full hover:-translate-y-2 hover:shadow-xl transition-all duration-300"
                        >
                            <CardHeader>
                                <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center mb-4">
                                    <Icon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                                </div>
                                <CardTitle>{t(`skills.categories.${key}.title`)}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <P className="text-muted-foreground">
                                    {t(`skills.categories.${key}.description`)}
                                </P>
                                <ul className="space-y-3">
                                    {bulletKeys.map((bullet) => (
                                        <li key={`${key}-${bullet}`} className="flex items-start gap-2 text-sm">
                                            <CheckCircle2 className="w-4 h-4 text-orange-500 mt-1" />
                                            <span>{t(`skills.categories.${key}.items.${bullet}`)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
