export interface DateRangeValue {
    from: Date;
    to: Date;
}

export interface DateRangePreset {
    id: string;
    label: string;
    getRange: () => DateRangeValue;
}

export function startOfDay(date: Date): Date {
    const value = new Date(date);
    value.setHours(0, 0, 0, 0);
    return value;
}

export function endOfDay(date: Date): Date {
    const value = new Date(date);
    value.setHours(23, 59, 59, 999);
    return value;
}

function shiftDays(date: Date, days: number): Date {
    const value = new Date(date);
    value.setDate(value.getDate() + days);
    return value;
}

export function getTodayRange(): DateRangeValue {
    const today = new Date();
    return {
        from: startOfDay(today),
        to: endOfDay(today),
    };
}

export function getYesterdayRange(): DateRangeValue {
    const yesterday = shiftDays(new Date(), -1);
    return {
        from: startOfDay(yesterday),
        to: endOfDay(yesterday),
    };
}

export function getLastNDaysRange(days: number): DateRangeValue {
    const safeDays = Number.isFinite(days) && days > 0 ? Math.floor(days) : 1;
    const today = new Date();
    const start = shiftDays(today, -(safeDays - 1));

    return {
        from: startOfDay(start),
        to: endOfDay(today),
    };
}

export function getLastMonthRange(): DateRangeValue {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const end = new Date(now.getFullYear(), now.getMonth(), 0);

    return {
        from: startOfDay(start),
        to: endOfDay(end),
    };
}
