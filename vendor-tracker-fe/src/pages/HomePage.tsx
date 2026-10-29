import { Button, Spinner } from "@heroui/react";
import { useState } from "react";
import ChangeStageButton from "../components/vendors/ChangeStageButton";
import StageHistoryDrawer from "../components/vendors/StageHistoryDrawer";
import { useGetVendorHistory, useGetVendors } from "../hooks/useVendors";
import { useUserStore } from "../stores/userStore";
import type { VendorDto } from "../types/vendor.dto";
import { getTimeInStage, VENDOR_STAGE_LABELS } from "../utils/vendor-stage";

const STAGE_BADGE_CLASSES = {
  CONTRACT_SENT: "text-slate-800",
  CONTRACT_SIGNED: "text-blue-800 border border-blue-800/50",
  KYC_DOCS_RECEIVED: "text-yellow-800 border border-yellow-800/50",
  KYC_VERIFIED: "text-green-800 border border-green-800/50",
  ACTIVE: "bg-green-100 text-green-800",
} as const;

export default function HomePage() {
  const user = useUserStore((state) => state.user);
  const [selectedVendor, setSelectedVendor] = useState<VendorDto | null>(null);
  const vendorsQuery = useGetVendors({ page: 1, pageSize: 100 });
  const historyQuery = useGetVendorHistory(selectedVendor?.id ?? 0);

  if (vendorsQuery.isPending) {
    return <div className="flex min-h-64 items-center justify-center"><Spinner /></div>;
  }

  if (vendorsQuery.isError) {
    return (
      <div className="space-y-3 p-6">
        <p className="text-danger">Unable to load vendors.</p>
        <Button variant="secondary" onPress={() => void vendorsQuery.refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  const vendors = vendorsQuery.data?.items ?? [];

  return (
    <>
      <main className="space-y-6 p-6">
        <p className="text-sm text-slate-500">Select one vendor to view its history.</p>

        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full min-w-225 text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
              <tr>
                <th scope="col" className="px-4 py-3">Vendor</th>
                <th scope="col" className="px-4 py-3">Region</th>
                <th scope="col" className="px-4 py-3">Stage</th>
                <th scope="col" className="px-4 py-3">Coordinator</th>
                <th scope="col" className="px-4 py-3">Time in stage</th>
                <th scope="col" className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {vendors.map((vendor) => {
                const isOwner = vendor.coordinatorId === user?.id;

                return (
                  <tr
                    key={vendor.id}
                    className="cursor-pointer hover:bg-slate-50"
                    onClick={() => setSelectedVendor(vendor)}
                  >
                    <td className="px-4 py-4 font-medium text-slate-900">{vendor.name}</td>
                    <td className="px-4 py-4 text-slate-600">{vendor.region}</td>
                    <td className="px-4 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STAGE_BADGE_CLASSES[vendor.stage]}`}>
                        {VENDOR_STAGE_LABELS[vendor.stage]}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-600">
                      {vendor.coordinatorName ?? "Unassigned"}
                    </td>
                    <td className="px-4 py-4">
                      <span className={vendor.isStuck ? "font-medium text-amber-700" : "text-slate-600"}>
                        {getTimeInStage(vendor.stageEnteredAt)}
                      </span>
                    </td>
                    <td
                      className="px-4 py-4"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <ChangeStageButton vendor={vendor} isOwner={isOwner} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!vendors.length ? <p className="p-8 text-center text-slate-500">No vendors found.</p> : null}
        </div>
      </main>

      <StageHistoryDrawer
        vendorName={selectedVendor?.name}
        history={historyQuery.data?.items}
        isOpen={selectedVendor !== null}
        isLoading={historyQuery.isPending}
        isError={historyQuery.isError}
        onClose={() => setSelectedVendor(null)}
        onRetry={() => void historyQuery.refetch()}
      />
    </>
  );
}