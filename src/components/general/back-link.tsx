import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

import { Button, type ButtonProps } from "@/components/ui/button";

export function BackLink({ href, text, ...props }: { href: string; text?: string } & ButtonProps) {
    return (
        <Button asChild {...props}>
            <Link href={href}>
                <ArrowLeftIcon className="rtl:rotate-180" />
                {text}
            </Link>
        </Button>
    )
}