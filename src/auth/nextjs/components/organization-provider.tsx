"use client";

import { createContext, type ReactNode, useContext } from "react";

import type { getOrganizations } from "@/auth/nextjs/actions";

type OrganizationContextValue = Awaited<ReturnType<typeof getOrganizations>>;

const OrganizationContext = createContext<OrganizationContextValue | null>(null);
type OrganizationProviderProps = { value: OrganizationContextValue; children: ReactNode };

export function OrganizationProvider({ value, children }: OrganizationProviderProps) {
	return <OrganizationContext.Provider value={value}>{children}</OrganizationContext.Provider>;
}

export function useOrganization() {
	const context = useContext(OrganizationContext);
	if (context == null) {
		throw new Error("useOrganization must be used within an OrganizationProvider");
	}
	return context;
}
