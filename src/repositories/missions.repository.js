import { prisma } from "../db.config.js";


// 미션 추가
export const addMission = async (storeId, missionData) => {
  const mission = await prisma.mission.create({
    data: {
      mission_spec: missionData.missionSpec,
      reward: missionData.reward,
      deadline: new Date(missionData.endAt),
      store: {
        connect: { id: storeId },
      },
    },
  });

  return mission.id;
};
// 미션 존재 여부 확인
export const checkMissionExist = async (missionId) => {
  const mission = await prisma.mission.findUnique({
    where: { id: missionId },
  });
  return !!mission;
};

// 이미 도전 중인지 확인
export const checkMissionAlreadyChallenged = async (userId, missionId) => {
  const challenge = await prisma.missionChallenge.findFirst({
    where: {
      userId,
      missionId,
    },
  });
  return !!challenge;
};

// 미션 도전 추가
export const challengeMissionForUser = async (challengeData) => {
  const challenge = await prisma.missionChallenge.create({
    data: {
      userId: challengeData.userId,
      missionId: challengeData.missionId,
      status: 'ONGOING',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  return challenge.id;
};


// 특정 가게의 미션 목록 조회
export const getMissionsByStoreId = async (storeId) => {
  try {
    const missions = await prisma.mission.findMany({
      where: {
        store_id: parseInt(storeId),
      },
      orderBy: {
        created_at: "desc",
      },
    });
    return missions;
  } catch (error) {
    throw new Error(`미션 조회 실패: ${error.message}`);
  }
};