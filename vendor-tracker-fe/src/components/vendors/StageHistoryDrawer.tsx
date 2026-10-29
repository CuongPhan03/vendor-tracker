import { Button, Drawer } from "@heroui/react";
import type { StageHistoryDto } from "../../types/stage-history.dto";
import { VENDOR_STAGE_LABELS } from "../../utils/vendor-stage";

interface StageHistoryDrawerProps {
  vendorName?: string;
  history: StageHistoryDto[] | undefined;
  isOpen: boolean;
  isLoading: boolean;
  isError: boolean;
  onClose: () => void;
  onRetry: () => void;
}

export default function StageHistoryDrawer({
  vendorName,
  history,
  isOpen,
  isLoading,
  isError,
  onClose,
  onRetry,
}: StageHistoryDrawerProps) {
  return (
    <Drawer
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Drawer.Backdrop>
        <Drawer.Content placement="right">
          <Drawer.Dialog>
            <Drawer.Header>
              <div>
                <p className="text-sm text-slate-500">Stage history</p>
                <Drawer.Heading>{vendorName}</Drawer.Heading>
              </div>
            </Drawer.Header>
            <Drawer.Body>
              {isLoading ? <p className="text-slate-500">Loading history...</p> : null}
              {isError ? (
                <div className="space-y-3">
                  <p className="text-danger">Unable to load stage history.</p>
                  <Button variant="secondary" onPress={onRetry}>Retry</Button>
                </div>
              ) : null}
              {!isLoading && !isError && !history?.length ? (
                <p className="text-slate-500">No stage history yet.</p>
              ) : null}
              <ol className="space-y-4">
                {history?.map((h) => (
                  <li key={h.id} className="border-l-2 border-cyan-600 pl-4">
                    <p className="font-medium">
                      {VENDOR_STAGE_LABELS[h.previousStage]} → {VENDOR_STAGE_LABELS[h.newStage]}
                    </p>
                    <p className="text-sm text-slate-600">
                      {h.changedByName ?? "Unknown coordinator"} ·{" "}
                      {new Date(h.changedAt).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ol>
            </Drawer.Body>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  );
}
