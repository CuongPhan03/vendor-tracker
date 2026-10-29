import { Button } from "@heroui/react";
import type { VendorDto, VendorStage } from "../../types/vendor.dto";
import { NEXT_STAGE_MAP, VENDOR_STAGE_LABELS } from "../../utils/vendor-stage";
import { useUpdateVendor } from "../../hooks/useVendors";

interface ChangeStageButtonProps {
  vendor: VendorDto;
  isOwner: boolean;
}

export default function ChangeStageButton({
  vendor,
  isOwner,
}: ChangeStageButtonProps) {
  const { mutate, isPending } = useUpdateVendor();

  const nextStage = NEXT_STAGE_MAP[vendor.stage];

  if (!isOwner || !nextStage) {
    return <span className="text-sm text-slate-400">No action</span>;
  }
  
  const handleStageChange = (stage: VendorStage) => {
    mutate({ id: vendor.id, payload: { stage } });
  }

  return (
    <Button
      size="sm"
      variant="secondary"
      isDisabled={isPending}
      onPress={() => handleStageChange(nextStage)}
    >
      {isPending ? "Updating..." : `Move to ${VENDOR_STAGE_LABELS[nextStage]}`}
    </Button>
  );
}
