export function formatCurrency(value: number) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "EGP",
    }).format(value);
}

export function formatDate(
    date: Date | string | number | undefined,
    opts: Intl.DateTimeFormatOptions = {},
) {
    if (!date) return "";

    try {
        return new Intl.DateTimeFormat("en-US", {
            month: opts.month ?? "long",
            day: opts.day ?? "numeric",
            year: opts.year ?? "numeric",
            ...opts,
        }).format(new Date(date));
    } catch (_err) {
        return "";
    }
}
