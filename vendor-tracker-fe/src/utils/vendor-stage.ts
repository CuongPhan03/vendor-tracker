import type { VendorStage } from "../types/vendor.dto";

export const NEXT_STAGE_MAP: Partial<Record<VendorStage, VendorStage>> = {
  "CONTRACT_SENT": "CONTRACT_SIGNED",
  "CONTRACT_SIGNED": "KYC_DOCS_RECEIVED",
  "KYC_DOCS_RECEIVED": "KYC_VERIFIED",
  "KYC_VERIFIED": "ACTIVE"
}

export const VENDOR_STAGE_LABELS: Record<VendorStage, string> = {
  CONTRACT_SENT: "Contract Sent",
  CONTRACT_SIGNED: "Contract Signed",
  KYC_DOCS_RECEIVED: "KYC Docs Received",
  KYC_VERIFIED: "KYC Verified",
  ACTIVE: "Active",
};

export function getTimeInStage(stageEnteredAt: string, now = Date.now()) {
  const elapsedDays = Math.max(
    0,
    Math.floor(
      (now - new Date(stageEnteredAt).getTime()) / (24 * 60 * 60 * 1000),
    ),
  );

  return `${elapsedDays} day${elapsedDays === 1 ? "" : "s"}`;
}
