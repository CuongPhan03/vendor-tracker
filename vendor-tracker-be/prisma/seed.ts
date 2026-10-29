import { PrismaClient, VendorStage } from '@prisma/client';

const prisma = new PrismaClient();

const password =
  '$argon2id$v=19$m=65536,t=3,p=4$bIudt8DBt/kiAcjI/2A63A$P0+87M3zosqLlF0KPHKfEBnK+xnrxJyQA71yVprprZI';

const coordinators = [
  { name: 'Phan Thế Cương', email: 'cuong@gmail.com' },
  { name: 'Nguyễn Minh Anh', email: 'anh@gmail.com' },
  { name: 'Trần Hoàng Nam', email: 'nam@gmail.com' },
  { name: 'Lê Khánh Linh', email: 'linh@gmail.com' },
];

const stages: VendorStage[] = [
  VendorStage.CONTRACT_SENT,
  VendorStage.CONTRACT_SIGNED,
  VendorStage.KYC_DOCS_RECEIVED,
  VendorStage.KYC_VERIFIED,
  VendorStage.ACTIVE,
];

const regions = [
  'HCMC',
  'Can Tho',
  'Ha Noi',
  'Da Nang',
  'Hue',
  'Hai Phong',
  'Dong Nai',
  'Da Lat',
];

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const MAX_HISTORY_AGE_IN_DAYS = 20;

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function seed() {
  await prisma.vendorStageHistory.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.user.deleteMany();

  const users = await Promise.all(
    coordinators.map((coordinator) =>
      prisma.user.create({
        data: {
          ...coordinator,
          password,
        },
      }),
    ),
  );

  for (let vendorIndex = 0; vendorIndex < 20; vendorIndex += 1) {
    // Five records cannot be valid because the workflow has only four transitions.
    const historyCount = Math.min(randomInt(0, 5), stages.length - 1);
    const coordinator = users[vendorIndex % users.length];
    const now = Date.now();
    const createdAt = new Date(now - MAX_HISTORY_AGE_IN_DAYS * DAY_IN_MS);
    const changedAtDates = Array.from({ length: historyCount }, () =>
      new Date(now - randomInt(0, MAX_HISTORY_AGE_IN_DAYS) * DAY_IN_MS),
    ).sort((first, second) => first.getTime() - second.getTime());
    let currentStage: VendorStage = VendorStage.CONTRACT_SENT;
    let stageEnteredAt = createdAt;

    const history: any = [];
    for (let historyIndex = 0; historyIndex < historyCount; historyIndex += 1) {
      const previousStage: VendorStage = currentStage;
      const newStage = stages[historyIndex + 1];
      if (!newStage) {
        throw new Error(`Invalid stage transition at history index ${historyIndex}`);
      }
      const changedAt = changedAtDates[historyIndex];
      if (!changedAt) {
        throw new Error(`Missing timestamp at history index ${historyIndex}`);
      }

      history.push({
        previousStage,
        newStage,
        changedById: coordinator.id,
        changedAt,
      });
      currentStage = newStage;
      stageEnteredAt = changedAt;
    }

    await prisma.vendor.create({
      data: {
        name: `Company ${String(vendorIndex + 1).padStart(2, '0')}`,
        region: regions[Math.floor(Math.random() * regions.length)]!,
        coordinatorId: coordinator.id,
        stage: currentStage,
        stageEnteredAt,
        createdAt,
        updatedAt: stageEnteredAt,
        stageHistory: {
          create: history,
        },
      },
    });
  }
}

seed()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
