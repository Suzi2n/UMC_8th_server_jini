import { StatusCodes } from "http-status-codes";
import { addChallengeMission, addMission } from "../services/missions.service.js";
import { bodyToChallengeMission, bodyToMission } from "../dtos/missions.dto.js";
import { getStoreMissions } from "../services/missions.service.js";
import { getStoreById } from "../services/stores.service.js";
import { prisma } from "../db.config.js";
import {updateMissionStatus} from "../services/missions.service.js";

export const handleAddMission = async (req, res, next) => {
  try {
    console.log("요청 바디 확인:", req.body);
    const storeId = parseInt(req.params.storeId);
    const missionData = bodyToMission(req.body); // 여기도 로그 찍기
    console.log("파싱된 미션 데이터:", missionData);

    const store = await getStoreById(storeId);
    if (!store) return res.status(404).json({ message: "가게 없음" });

    const result = await addMission(storeId, missionData);
    
res.status(200).json({ result: { missionId: result.missionId.toString() } });

  } catch (err) {
    console.error("미션 추가 중 오류:", err); // ❗ 꼭 찍기
    next(err);
  }
};

export const handleChallengeMission = async (req, res, next) => {
    console.log("미션 도전 요청");
    console.log("미션 ID:", req.params.missionId);

    try {
        const missionId = parseInt(req.params.missionId);
        const userId = parseInt(req.body.userId);
        if (!userId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ error: "인증이 필요합니다." });
        }

        const challengeData = bodyToChallengeMission({ userId, missionId });

        const result = await addChallengeMission(challengeData);

        res.status(StatusCodes.CREATED).json({
            result,
            message: "미션 도전을 추가했습니다."
        });
    } catch (err) {
        next(err);
    }
};

// 특정 가게의 미션 목록 조회
export const handleGetStoreMissions = async (req, res, next) => {
  const storeId = parseInt(req.params.storeId);
  if (isNaN(storeId)) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "유효하지 않은 가게 ID입니다." });
  }

  try {
    const missions = await prisma.mission.findMany({
      where: { store_id: storeId },
    });

    res.status(StatusCodes.OK).json({ result: missions });
  } catch (err) {
    next(err);
  }
};

// 사용자가 진행중인 미션목록 조회
export const handleGetUserOngoingMissions = async (req, res, next) => {
  const userId = parseInt(req.params.userId, 10);

  if (isNaN(userId)) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: "유효하지 않은 사용자 ID입니다." });
  }

  try {
    const ongoingMissions = await prisma.user_mission.findMany({
      where: {
        user_id: userId,
        status: "진행중",
      },
      include: {
        mission: {
          select: {
            id: true,
            mission_spec: true,
            reward: true,
            deadline: true,
            store: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    res.status(StatusCodes.OK).json({
      success: true,
      result: ongoingMissions,
    });
  } catch (err) {
    console.error("사용자 진행 중 미션 조회 오류:", err);
    next(err);
  }
};

// 미션 상태 업데이트
export const UpdateMissionStatus = async (req, res, next) => {

  try {
    const userMissionId = parseInt(req.params.userMissionId, 10);
    const status = req.query.status || "진행완료";
    const updated = await updateMissionStatus(userMissionId, status);

    res.status(200).json({
      success: true,
      result: updated,
      message: `미션 상태가 '${status}'로 변경되었습니다.`,
    });
  } catch (err) {
    console.error("미션 상태 업데이트 실패:", err);
    next(err);
  }
};