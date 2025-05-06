export const bodyToMission = (body) => {
    if (!body.missionSpec || typeof body.missionSpec !== "string") {
        throw new Error("missionSpec은 문자열이어야 합니다.");
    }

    return {
        missionSpec: body.missionSpec.trim(),
        reward: body.reward,
        startAt: body.startAt,
        endAt: body.endAt,
        status: body.status || 'ONGOING'
    };
};

export const bodyToChallengeMission = (body) => {
    return {
        userId: body.userId,
        missionId: body.missionId
    };
};