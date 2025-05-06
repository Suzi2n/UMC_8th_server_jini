import {
    addMission as addMissionRepo,
    challengeMissionForUser,
    checkMissionAlreadyChallenged,
    checkMissionExist,
} from "../repositories/missions.repository.js";
import { getStoreById } from "../repositories/stores.repository.js";
import { StatusCodes } from "http-status-codes";

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
