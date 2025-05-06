import { StatusCodes } from "http-status-codes";
import { addChallengeMission, addMission } from "../services/missions.service.js";
import { bodyToChallengeMission, bodyToMission } from "../dtos/missions.dto.js";

export const handleAddMission = async (req, res, next) => {
    console.log("미션 추가 요청:", req.body);

    try {
        const storeId = parseInt(req.params.storeId);
        const missionData = bodyToMission(req.body);

        const { missionId } = await addMission(storeId, missionData);

        res.status(StatusCodes.CREATED).json({
            result: {
                missionId,
                message: "미션이 성공적으로 추가되었습니다."
            }
        });
    } catch (err) {
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
