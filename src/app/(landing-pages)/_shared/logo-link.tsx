import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/features/core/i18n/useTranslation";

export default function LogoLink() {
    const { dir } = useTranslation();
    const isRtl = dir === "rtl";
    const brandName = isRtl ? "محمد مجدي (ميجز)" : "Mohamed Magdy (Megz)";

    return (
        <Link
            href="/"
            className="flex items-center gap-3 group"
            aria-label={`${brandName} home`}
        >
            <Image
                src="/megz-logo.svg"
                alt={`${brandName} logo`}
                height={500}
                width={500}
                className="h-10 w-auto object-contain drop-shadow-sm"
                priority
            />
            <div className="leading-none text-start">
                <p className="text-sm font-semibold tracking-tight text-foreground">
                    {isRtl ? "ميجز" : "Megz"}
                </p>
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                    {isRtl ? "مهندس برمجيات" : "Software Engineer"}
                </p>
            </div>
        </Link>
    );
}
