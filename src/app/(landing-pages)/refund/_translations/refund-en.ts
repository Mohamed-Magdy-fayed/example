import { dt } from "@/features/core/i18n/lib";

export default {
  refundPage: {
    dispute: {
      title: "Dispute Resolution",
      intro: "If you disagree with our refund decision, you may:",
      review: "Request a review by our senior support team",
      documentation: "Provide additional documentation or evidence",
      escalate: "Escalate to our customer success manager",
      legal: "Contact our legal department for complex cases",
      note: "We are committed to fair and reasonable resolution of all refund disputes."
    },
    processingTime: {
      title: "Refund Processing Time",
      intro: "Once a refund is approved, processing times vary by payment method:",
      cardsTitle: "Credit/Debit Cards",
      cardsTime: "5-10 business days",
      cardsNote: "Depends on your bank's processing time",
      bankTitle: "Bank Transfers",
      bankTime: "3-7 business days",
      bankNote: "May vary by country and banking system",
      paypalTitle: "PayPal",
      paypalTime: "1-3 business days",
      paypalNote: "Usually processed within 24 hours",
      walletTitle: "Digital Wallets",
      walletTime: "1-5 business days",
      walletNote: "Varies by wallet provider"
    },
    nonRefundable: {
      title: "Non-Refundable Items",
      intro: "The following are generally not eligible for refunds:",
      setupFees: "Setup fees and one-time implementation costs",
      customDev: "Custom development or integration work",
      training: "Training sessions that have been completed",
      migration: "Data migration services that have been performed",
      thirdParty: "Third-party add-ons or integrations",
      cancelled: "Subscriptions cancelled after the applicable refund period",
      note: "Exceptions may be made on a case-by-case basis for extraordinary circumstances."
    },
    partialRefunds: {
      title: "Partial Refunds",
      intro: "In some cases, we may offer partial refunds based on:",
      usagePeriod: "Usage Period:",
      usagePeriodDesc: "Prorated refund based on unused subscription time",
      serviceLevel: "Service Level:",
      serviceLevelDesc: "Partial refund if only certain features were affected",
      resolutionTimeline: "Resolution Timeline:",
      resolutionTimelineDesc: "Compensation for extended service disruptions",
      downgradeRequests: "Downgrade Requests:",
      downgradeRequestsDesc: "Difference between plan levels",
      note: "Partial refunds are calculated based on the unused portion of your subscription and the specific circumstances of your request."
    },
    requiredInfo: {
      title: "Required Information for Refund Requests",
      intro: "To process your refund request efficiently, please provide:",
      accountInfoTitle: "Account Information",
      accountEmail: "Account email address",
      institutionName: "Institution name",
      planDetails: "Subscription plan details",
      paymentMethod: "Payment method used",
      requestDetailsTitle: "Request Details",
      refundReason: "Reason for refund request",
      purchaseDate: "Date of purchase/subscription",
      issueDescription: "Description of issues experienced",
      resolutionSteps: "Steps taken to resolve the issue"
    },
    timeframes: {
      title: "Refund Timeframes",
      intro: "Refund eligibility depends on when you submit your request:",
      days30: {
        title: "30 Days",
        description: "Service quality issues, feature discrepancies"
      },
      days60: {
        title: "60 Days",
        description: "Technical issues, platform accessibility problems"
      },
      days90: {
        title: "90 Days",
        description: "Billing errors, unauthorized charges"
      },
      noticeTitle: "Time Limit Notice",
      noticeText: "Refund requests submitted after the applicable timeframe will not be considered, except in cases of billing errors or technical issues beyond your control."
    },
    overview: {
      title: "Refund Policy Overview",
      intro1: "At HBS, we are committed to providing exceptional service to educational institutions. This refund policy outlines the circumstances under which refunds may be granted and the process for requesting them.",
      intro2: "We understand that choosing a Teaching Management System is an important decision for your institution, and we want you to feel confident in your choice.",
      importantLabel: "Important:",
      importantText: "All refund requests are subject to review and approval based on the terms outlined in this policy."
    },
    hero: {
      title: "Refund Policy",
      lead: "We stand behind our Teaching Management System. Learn about our refund policy and how we handle refund requests.",
      lastUpdated: dt("Last updated: {date:date}", { date: { date: { dateStyle: "long" } } })
    },
    eligibility: {
      title: "Refund Eligibility",
      intro: "Refunds may be considered under the following circumstances:",
      eligible: "Eligible",
      notEligible: "Not Eligible",
      scenarios: {
        serviceNotAsDescribed: {
          title: "Service Not as Described",
          description: "If our platform significantly differs from what was advertised"
        },
        technicalIssues: {
          title: "Technical Issues",
          description: "Persistent technical problems that prevent platform use"
        },
        billingErrors: {
          title: "Billing Errors",
          description: "Incorrect charges or duplicate billing"
        },
        changeOfMind: {
          title: "Change of Mind",
          description: "Simple change of mind after service activation"
        },
        partialUsage: {
          title: "Partial Usage",
          description: "After actively using the platform for course management"
        }
      }
    },
    process: {
      title: "Refund Request Process",
      intro: "Follow these steps to request a refund:",
      steps: {
        contact: {
          title: "Contact Support",
          description: "Reach out to our support team with your refund request and reason",
          timeframe: "Within applicable timeframe",
        },
        review: {
          title: "Review Process",
          description: "Our team reviews your request and account activity",
          timeframe: "2-3 business days",
        },
        decision: {
          title: "Decision Notification",
          description: "You'll receive an email with our decision and next steps",
          timeframe: "1 business day",
        },
        processing: {
          title: "Refund Processing",
          description: "If approved, refund is processed to your original payment method",
          timeframe: "5-10 business days",
        }
      }
    },
    contact: {
      title: "Need to Request a Refund?",
      intro: "Our support team is here to help you with your refund request and answer any questions you may have.",
      email: "Email Support",
      emailAddress: "refunds@gateling.com",
      emailNote: "Response within 24 hours",
      chat: "Live Chat",
      chatNote: "Available 24/7",
      chatInstant: "Instant assistance",
      requestButton: "Request Refund",
      termsButton: "Terms of Service"
    }
  }
}
