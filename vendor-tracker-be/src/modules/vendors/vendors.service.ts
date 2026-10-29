import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { VendorStage } from '@prisma/client';
import { PagingDto } from 'src/common/dto/paging.dto';
import { PrismaService } from 'src/config/db.config';
import { StageHistoryListDto } from './dto/stage-history.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { VendorListDto } from './dto/vendor.dto';

const NEXT_STAGE_MAP = {
  [VendorStage.CONTRACT_SENT]: VendorStage.CONTRACT_SIGNED,
  [VendorStage.CONTRACT_SIGNED]: VendorStage.KYC_DOCS_RECEIVED,
  [VendorStage.KYC_DOCS_RECEIVED]: VendorStage.KYC_VERIFIED,
  [VendorStage.KYC_VERIFIED]: VendorStage.ACTIVE
}
const STUCK_STAGE_THRESHOLD_MS = 7 * 24 * 60 * 60 * 1000;

@Injectable()
export class VendorsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: number, findAllDto: PagingDto): Promise<VendorListDto> {
    const { page = 1, pageSize = 10 } = findAllDto;

    const [count, items] = await Promise.all([
      this.prisma.vendor.count(),
      this.prisma.vendor.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { stageEnteredAt: 'desc' },
        include: { coordinator: { select: { name: true } } },
      })
    ])

    return {
      count,
      items: items.map(({ coordinator, ...vendor }) => ({
        ...vendor,
        coordinatorName: coordinator?.name ?? null,
        isStuck:
          Date.now() - vendor.stageEnteredAt.getTime() >=
          STUCK_STAGE_THRESHOLD_MS,
      })),
      totalPages: Math.ceil(count / pageSize),
      currentPage: page,
    };
  }

  async updateOneById(userId: number, id: number, updateDto: UpdateVendorDto): Promise<boolean> {
    const vendor = await this.prisma.vendor.findFirst({ where: { id } })
    if (!vendor) {
      throw new NotFoundException("Vendor not found")
    }

    if (vendor.coordinatorId !== userId) {
      throw new ForbiddenException("You don't have permission to update this vendor")
    }

    const nextStage = NEXT_STAGE_MAP[vendor.stage];
    if (!nextStage || updateDto.stage !== nextStage) {
      throw new BadRequestException("Can not update from this stage");
    }

    await this.prisma.$transaction([
      this.prisma.vendor.update({
        where: { id },
        data: {
          stage: nextStage,
          stageEnteredAt: new Date(),
        },
      }),
      this.prisma.vendorStageHistory.create({
        data: {
          vendorId: id,
          changedById: userId,
          previousStage: vendor.stage,
          newStage: nextStage,
        },
      }),
    ]);

    return true;
  }

  async findHistory(
    userId: number,
    vendorId: number,
    findAllDto: PagingDto,
  ): Promise<StageHistoryListDto> {
    const { page = 1, pageSize = 10 } = findAllDto;

    const vendor = await this.prisma.vendor.findFirst({
      where: { id: vendorId },
    });

    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    const [count, items] = await Promise.all([
      this.prisma.vendorStageHistory.count({
        where: { vendorId },
      }),
      this.prisma.vendorStageHistory.findMany({
        where: { vendorId },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { changedAt: 'desc' },
        include: {
          changedBy: {
            select: { name: true },
          },
        },
      }),
    ]);

    return {
      count,
      items: items.map(({ changedBy, ...history }) => ({
        ...history,
        changedByName: changedBy.name,
      })),
      totalPages: Math.ceil(count / pageSize),
      currentPage: page,
    };
  }
}
