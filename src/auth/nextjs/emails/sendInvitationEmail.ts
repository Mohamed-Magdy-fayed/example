import "server-only";

import { render } from "@react-email/render";
import * as React from "react";

import { getT } from "@/lib/i18n/actions";

import { sendMail } from "./mailer";
import { BaseEmail } from "./templates/BaseEmail";
import { InvitationEmailExtra } from "./templates/InvitationEmailExtra";

export async function sendInvitationEmail(options: {
    to: string;
    organizationName?: string | null;
    inviteUrl: string;
    inviterName?: string | null;
}) {
    const { t } = await getT();
    const fallbackOrganization = t("authTranslations.emails.invitation.organizationFallback");
    const organizationName =
        options.organizationName?.trim() && options.organizationName.trim().length > 0
            ? options.organizationName.trim()
            : fallbackOrganization;

    const inviterName = options.inviterName?.trim();
    const subject = t("authTranslations.emails.invitation.subject", {
        organization: organizationName,
    });

    const inviterFallback = t("authTranslations.emails.invitation.inviterFallback");
    const text = t("authTranslations.emails.invitation.text", {
        organization: organizationName,
        inviteUrl: options.inviteUrl,
        inviter: inviterName ?? inviterFallback,
    });

    const greeting = t("authTranslations.emails.common.greetingHtml", {
        name: t("authTranslations.emails.common.defaultRecipientName"),
    }).replace(/<[^>]+>/g, "");
    const intro = t("authTranslations.emails.invitation.html.intro", {
        organization: organizationName,
    });
    const invitedByLine = inviterName
        ? t("authTranslations.emails.invitation.html.invitedBy", { inviter: inviterName })
        : undefined;
    const ctaLabel = t("authTranslations.emails.invitation.ctaLabel");
    const notice = t("authTranslations.emails.invitation.html.ignore");
    const signature = t("authTranslations.emails.common.signatureHtml").replace(/<br\s*\/?\s*>/gi, "\n");

    const html = await render(
        React.createElement(BaseEmail, {
            preview: subject,
            subject,
            greeting,
            intro,
            ctaLabel,
            ctaUrl: options.inviteUrl,
            notice,
            signature,
            extra: React.createElement(InvitationEmailExtra, { invitedByLine }),
        }),
    );

    await sendMail({
        toEmail: options.to,
        toName: t("authTranslations.emails.common.defaultRecipientName"),
        subject,
        text,
        html,
        fromName: t("authTranslations.emails.common.fromName"),
    });
}
