import {
    addMission as addMissionRepo,
    challengeMissionForUser,
    checkMissionAlreadyChallenged,
    checkMissionExist,
    getUserMissionWithDetails
} from "../repositories/missions.repository.js";
import { getStoreById } from "../repositories/stores.repository.js";
import { StatusCodes } from "http-status-codes";
import { getMissionsByStoreId } from "../repositories/missions.repository.js";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

//  미션 추가
export const addMission = async (storeId, missionData) => {
    const exist_store = await getStoreById(storeId);
    if (!exist_store) {
        throw new Error("해당 가게가 존재하지 않습니다.");
    }

    const missionId = await addMissionRepo(storeId, missionData);
    return { missionId };
};

// 미션 도전 추가
export const addChallengeMission = async (challengeData) => {
    const { userId, missionId } = challengeData;

    // 미션 존재 여부 확인
    const missionExists = await checkMissionExist(missionId);
    if (!missionExists) {
        throw new Error("존재하지 않는 미션입니다.");
    }

    // 이미 도전중인지
    const alreadyChallenged = await checkMissionAlreadyChallenged(userId, missionId);
    if (alreadyChallenged) {
        throw new Error("이미 도전 중인 미션입니다.");
    }

    // 도전 추가
    const challengeId = await challengeMissionForUser({ userId, missionId });
    if (!challengeId) {
        const error = new Error("미션 도전 추가에 실패했습니다.");
        error.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
        throw error;
    }

    return { challengeId };
};

export const getStoreMissions = async (storeId) => {
  const missions = await getMissionsByStoreId(storeId);
  return missions;
};


// 미션 상태 업데이트 (완료로 변경)
export const updateMissionStatus = async (userMissionId, status) => {
  // 사용자 미션이 존재하는지 확인
  const existingMission = await getUserMissionWithDetails(userMissionId);
  if (!existingMission) {
    throw new Error("존재하지 않는 미션 참여 정보입니다.");
  }
  
  // 이미 같은 상태인지 확인
  if (existingMission.status === status) {
    throw new Error(`이미 '${status}' 상태인 미션입니다.`);
  }
  
  // 유효한 상태값인지 확인 (예: 진행중, 완료, 포기 등만 허용)
  const validStatuses = ['ONGOING', 'COMPLETED'];
  if (!validStatuses.includes(status)) {
    throw new Error(`'${status}'는 유효하지 않은 상태값입니다. ${validStatuses.join(', ')} 중 하나를 사용하세요.`);
  }
    
  // 상태 업데이트
  const updated = await prisma.user_mission.update({
    where: {
      id: Number(userMissionId),
    },
    data: {
      status, // ✅ 정상적으로 status 사용
      updated_at: new Date(),
    },
  });

  return updated;
};