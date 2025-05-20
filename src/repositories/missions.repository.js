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

// 사용자 미션 상세 정보 조회
export const getUserMissionWithDetails = async (userMissionId) => {
  try {
    const userMission = await prisma.user_mission.findUnique({
      where: {
        id: Number(userMissionId)
      },
      include: {
        mission: {
          select: {
            reward: true,
            deadline: true,
            mission_spec: true,
            store: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });
    
    if (!userMission) {
      return null;
    }
    
    // 원래 쿼리와 동일한 결과 구조로 변환
    return {
      ...userMission,
      reward: userMission.mission?.reward,
      deadline: userMission.mission?.deadline,
      mission_spec: userMission.mission?.mission_spec,
      store_name: userMission.mission?.store?.name
    };
  } catch (err) {
    console.error(`사용자 미션 상세 조회 오류: ${err.message}`);
    throw new Error(`사용자 미션 조회 중 오류가 발생했습니다: ${err.message}`);
  }
};