import { BadRequestException } from '@nestjs/common';
import { VendorStage } from '@prisma/client';
import { PrismaService } from 'src/config/db.config';
import { VendorsService } from './vendors.service';

describe('VendorsService', () => {
  const findFirst = jest.fn();
  const update = jest.fn().mockResolvedValue({});
  const create = jest.fn().mockResolvedValue({});
  const transaction = jest.fn().mockResolvedValue([]);
  const prisma = {
    vendor: {
      findFirst,
      update,
    },
    vendorStageHistory: {
      create,
    },
    $transaction: transaction,
  } as unknown as PrismaService;

  let service: VendorsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new VendorsService(prisma);
  });

  async function expectStageMovements(
    startStage: VendorStage,
    validNextStage?: VendorStage,
  ) {
    const vendorId = 12;
    const userId = 3;
    const destinationStages: VendorStage[] = [
      VendorStage.CONTRACT_SENT,
      VendorStage.CONTRACT_SIGNED,
      VendorStage.KYC_DOCS_RECEIVED,
      VendorStage.KYC_VERIFIED,
      VendorStage.ACTIVE,
    ];

    for (const destinationStage of destinationStages) {
      jest.clearAllMocks();
      findFirst.mockResolvedValue({
        id: vendorId,
        coordinatorId: userId,
        stage: startStage,
      });

      const result = service.updateOneById(userId, vendorId, {
        stage: destinationStage,
      });

      if (destinationStage === validNextStage) {
        await expect(result).resolves.toBe(true);
        expect(update).toHaveBeenCalledWith({
          where: { id: vendorId },
          data: {
            stage: destinationStage,
            stageEnteredAt: expect.any(Date),
          },
        });
        expect(create).toHaveBeenCalledWith({
          data: {
            vendorId,
            changedById: userId,
            previousStage: startStage,
            newStage: destinationStage,
          },
        });
        expect(transaction).toHaveBeenCalled();
      } else {
        await expect(result).rejects.toBeInstanceOf(BadRequestException);
        expect(update).not.toHaveBeenCalled();
        expect(transaction).not.toHaveBeenCalled();
      }
    }
  }

  it('checks movements from CONTRACT_SENT', async () => {
    await expectStageMovements(
      VendorStage.CONTRACT_SENT,
      VendorStage.CONTRACT_SIGNED,
    );
  });

  it('checks movements from CONTRACT_SIGNED', async () => {
    await expectStageMovements(
      VendorStage.CONTRACT_SIGNED,
      VendorStage.KYC_DOCS_RECEIVED,
    );
  });

  it('checks movements from KYC_DOCS_RECEIVED', async () => {
    await expectStageMovements(
      VendorStage.KYC_DOCS_RECEIVED,
      VendorStage.KYC_VERIFIED,
    );
  });

  it('checks movements from KYC_VERIFIED', async () => {
    await expectStageMovements(
      VendorStage.KYC_VERIFIED,
      VendorStage.ACTIVE,
    );
  });

  it('rejects movements from ACTIVE', async () => {
    await expectStageMovements(VendorStage.ACTIVE);
  });
});
