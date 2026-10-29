# Vendor Onboarding Tracker

## Problems Identified and Solutions

### 1. Manual and Unreliable Progress Tracking
The spreadsheet requires manually update stages and the "Last Updated" date. Missing or incorrect updates make it difficult to determine how long a vendor has been waiting.

### 2. Fragmented Information Across Multiple Tools

Vendor onboarding involves multiple tools, including email, Slack, and internal systems for activation. Forcing coordinators to switch between them to understand a vendor's status and locate relevant documents or communications.

### 3. No Clear Distinction Between Delays and Rejected KYC
The existing workflow does not distinguish between a vendor that is waiting for review and one whose KYC documents have failed verification. Both situations can appear as stalled progress, causing confusion.

## Overall Approach

I focused on building a simple, coordinator-oriented application around four core capabilities:

- **Simple authentication**: Provide a login page using a pre-seeded coordinator account.
- **Vendor overview:** Display vendor information, current stages, and indicators for vendors that have been stuck beyond the defined threshold.
- **Stage management:** Allow authenticated coordinators to update a vendor's stage.
- **Audit history:** Record the previous stage, new stage, coordinator, and timestamp for every stage transition.

## Technical Decisions

- **PostgreSQL:** Stores vendor records, coordinator accounts, and stage transition history in a relational structure with foreign-key constraints.
- **Stage enum:** Restricts vendor stages to the five defined workflow values.
- **Automatic timestamps:** Update last updated when a vendor entered its current stage without manual date entry.
- **Separate history table:** Preserves stage transitions instead of overwriting the only record of a vendor's progress.
- **Stuck-vendor detection**: Use a seven-day threshold to highlight vendors that have not progressed.

## Assumptions

- A vendor has one current stage at a time.
- Vendors normally progress through the five stages in the defined order.
- Failed KYC verification leaves the vendor at KYC Docs Received until the required documents are resubmitted and verified.
- A vendor is considered stuck after more than seven days in its current stage.
- Contract management, KYC document collection and review, and final activation remain outside the application.
- User registration, password resets, and user administration are out of scope.

## Shortcuts and Trade-offs

Given the time constraint, I prioritized the core workflow over a comprehensive vendor management system.

- Used seeded coordinator accounts instead of implementing full authentication and authorization.
- Used a fixed seven-day threshold rather than configurable per-stage thresholds.
- Kept the five-stage workflow simple instead of introducing a separate KYC rejection stage.
- Stored basic vendor information without introducing separate contact, document, or contract tables.
- Did not implement email, Slack, document-storage, or internal activation-system integrations.
- Kept the audit history focused on stage changes instead of logging every field modification.

## Future Improvements

With more time, I would prioritize the following:

1. **Explicit KYC rejection tracking:** Introduce a rejection status or review outcome.
2. **Stronger validation:** Enforce valid stage transitions and handle concurrent updates safely.
3. **Search, sorting, and filtering**: Allow find vendors by name or email, filter by stage or stuck status, and sort by time in the current stage or creation date.
4. **Notifications and reminders:** Notify coordinators when vendors exceed their expected stage duration.
5. **Production authentication and authorization:** Add secure authentication and role-based access control.
8. **External integrations:** Explore email, Slack, and internal activation-system integrations to reduce manual coordination.
