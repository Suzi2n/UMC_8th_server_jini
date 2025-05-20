import { StatusCodes } from "http-status-codes";
import {
  addChallengeMission,
  addMission,
} from "../services/missions.service.js";
import { bodyToChallengeMission, bodyToMission } from "../dtos/missions.dto.js";
import { getStoreMissions } from "../services/missions.service.js";
import { getStoreById } from "../services/stores.service.js";
import { prisma } from "../db.config.js";
import { updateMissionStatus } from "../services/missions.service.js";

export const handleAddMission = async (req, res, next) => {

   /*
    #swagger.summary = '특정 가게에 미션 추가'
    #swagger.description = 'storeId를 통해 특정 가게에 새로운 미션을 등록합니다.'
    #swagger.tags = ['Store']
    #swagger.parameters['storeId'] = {
      in: 'path',
      description: '가게 ID',
      required: true,
      type: 'integer',
      example: 3
    }
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["missionSpec", "reward", "deadline"],
            properties: {
              missionSpec: { type: "string", example: "10000원 이상 식사하세요!" },
              reward: { type: "integer", example: 300 },
              deadline: {
                type: "string",
                format: "date-time",
                example: "2025-06-30T23:59:59Z"
              }
            }
          }
        }
      }
    }
    #swagger.responses[201] = {
  description: "미션 생성 성공 응답",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          resultType: { type: "string", example: "SUCCESS" },
          error: { type: "object", nullable: true, example: null },
          success: {
            type: "object",
            properties: {
              id: { type: "integer", example: 123 },
              storeId: { type: "integer", example: 3 },
              storeName: { type: "string", example: "식당" },
              missionSpec: { type: "string", example: "10000원이상 식사하세요!" },
              reward: { type: "integer", example: 300 },
              deadline: { type: "string", format: "date-time" },
              createdAt: { type: "string", format: "date-time"},
              updatedAt: { type: "string", format: "date-time"}
            }
          }
        }
      }
    }
  }
}
    #swagger.responses[404] = {
      description: "존재하지 않는 가게",
      schema: {
        resultType: "FAIL",
        error: {
          errorCode: "M001",
          reason: "해당 가게를 찾을 수 없습니다.",
          data: null
        },
        success: null
      }
    }
    #swagger.responses[500] = {
      description: "서버 내부 오류",
      schema: {
        resultType: "FAIL",
        error: {
          errorCode: "S001",
          reason: "서버 내부 오류가 발생했습니다.",
          data: null
        },
        success: null
      }
    }
  */

  try {
    console.log("요청 바디 확인:", req.body);
    const storeId = parseInt(req.params.storeId);
    const missionData = bodyToMission(req.body); // 여기도 로그 찍기
    console.log("파싱된 미션 데이터:", missionData);

    const store = await getStoreById(storeId);
    if (!store) return res.status(404).json({ message: "가게 없음" });

    const result = await addMission(storeId, missionData);

    return res.success({ missionId: result.missionId.toString() });
  } catch (err) {
    console.error("미션 추가 중 오류:", err); // ❗ 꼭 찍기
    next(err);
  }
};

export const handleChallengeMission = async (req, res, next) => {

  /*
  #swagger.summary = '미션 도전'
  #swagger.description = '사용자가 특정 미션에 도전합니다.'
  #swagger.tags = ['Mission']
  #swagger.parameters['missionId'] = {
    in: 'path',
    description: '도전할 미션 ID',
    required: true,
    type: 'integer',
    example: 123
  }
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          required: ["userId"],
          properties: {
            userId: { type: "integer", example: 1 }
          }
        }
      }
    }
  }
  #swagger.responses[201] = {
    description: "미션 도전 성공 응답",
    schema: {
      resultType: "SUCCESS",
      error: null,
      success: {
        id: 55,
        userId: 1,
        missionId: 123,
        status: "ONGOING",
        storeName: "식당",
        missionSpec: "10000원이상 식사하세요!",
        reward: "500p",
        deadline: "2025-06-30T23:59:59Z",
        createdAt: "2025-05-19T10:15:30Z",
        updatedAt: "2025-05-19T10:15:30Z"
      }
    }
  }
  #swagger.responses[401] = {
    description: "인증되지 않은 사용자",
    schema: {
      resultType: "FAIL",
      error: {
        errorCode: "A001",
        reason: "인증이 필요합니다.",
        data: null
      },
      success: null
    }
  }
  #swagger.responses[500] = {
    description: "서버 내부 오류",
    schema: {
      resultType: "FAIL",
      error: {
        errorCode: "S001",
        reason: "서버 내부 오류가 발생했습니다.",
        data: null
      },
      success: null
    }
  }
*/


  console.log("미션 도전 요청");
  console.log("미션 ID:", req.params.missionId);

  try {
    const missionId = parseInt(req.params.missionId);
    const userId = parseInt(req.body.userId);
    if (!userId) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "인증이 필요합니다." });
    }

    const challengeData = bodyToChallengeMission({ userId, missionId });

    const result = await addChallengeMission(challengeData);

     return res.status(StatusCodes.CREATED).success(result);
  } catch (err) {
    next(err);
  }
};

// 특정 가게의 미션 목록 조회
export const handleGetStoreMissions = async (req, res, next) => {

  /*
  #swagger.summary = '특정 가게의 미션 목록 조회'
  #swagger.description = 'storeId를 통해 특정 가게에 등록된 미션 목록을 조회합니다.'
  #swagger.tags = ['Store']
  #swagger.parameters['storeId'] = {
    in: 'path',
    description: '가게 ID',
    required: true,
    type: 'integer',
    example: 3
  }
  #swagger.responses[200] = {
    description: '미션 목록 조회 성공',
    schema: {
      resultType: "SUCCESS",
      error: null,
      success: [
        {
          id: 1,
          store_id: 3,
          mission_spec: "10000원 이상 식사하기",
          reward: 500,
          deadline: "2025-06-30T23:59:59Z",
          created_at: "2025-05-20T12:34:56Z"
        }
      ]
    }
  }
  #swagger.responses[400] = {
    description: '유효하지 않은 가게 ID',
    schema: {
      resultType: "FAIL",
      error: {
        errorCode: "S001",
        reason: "유효하지 않은 가게 ID입니다.",
        data: null
      },
      success: null
    }
  }
  #swagger.responses[500] = {
    description: '서버 내부 오류',
    schema: {
      resultType: "FAIL",
      error: {
        errorCode: "S002",
        reason: "서버 내부 오류가 발생했습니다.",
        data: null
      },
      success: null
    }
  }
*/

  const storeId = parseInt(req.params.storeId);
  if (isNaN(storeId)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "유효하지 않은 가게 ID입니다." });
  }

  try {
    const missions = await prisma.mission.findMany({
      where: { store_id: storeId },
    });

    return res.success(missions);
  } catch (err) {
    next(err);
  }
};

// 사용자 미션 목록 조회 (status 쿼리 필터 가능)
export const handleGetUserMissionsList = async (req, res, next) => {
/*
  #swagger.summary = '사용자 미션 목록 조회';
  #swagger.description = '특정 사용자의 미션 목록을 조회합니다. status 필터링이 가능합니다.';
  #swagger.tags = ['User'];
  #swagger.parameters['userId'] = {
    in: 'path',
    description: '사용자 ID',
    required: true,
    type: 'integer',
    example: 1
  };
  #swagger.parameters['cursor'] = {
    in: 'query',
    description: '페이지네이션 커서 (다음 페이지 조회 시 이전 응답의 cursor 값 사용)',
    required: false,
    type: 'integer',
    example: 0
  };
  #swagger.parameters['status'] = {
    in: 'query',
    description: '미션 상태 필터',
    required: false,
    type: 'string',
    enum: ['ONGOING','COMPLETED'],
    default: 'ONGOING',
    example: 'ONGOING'
  };
  #swagger.responses[200] = {
    description: "미션 목록 조회 성공 응답",
    schema: {
      resultType: "SUCCESS",
      error: null,
      success: {
        data: [
          {
            id: 123,
            userId: 1,
            missionId: 456,
            status: "ONGOING",
            storeName: "식당",
            missionSpec: "20000원 이상의 식사를 하세요!",
            reward: "500p",
            deadline: "2025-06-30T23:59:59Z",
            createdAt: "2025-05-01T12:34:56Z",
            updatedAt: "2025-05-01T12:34:56Z"
          }
        ],
        pagination: {
          cursor: 456
        }
      }
    }
  };
  #swagger.responses[400] = {
    description: '잘못된 요청 (예: 유효하지 않은 사용자 ID)',
    schema: {
      resultType: "FAIL",
      error: {
        errorCode: "U001",
        reason: "유효하지 않은 사용자 ID입니다.",
        data: null
      },
      success: null
    }
  };
  #swagger.responses[500] = {
    description: '서버 내부 오류',
    schema: {
      resultType: "FAIL",
      error: {
        errorCode: "S001",
        reason: "서버 내부 오류가 발생했습니다.",
        data: null
      },
      success: null
    }
  };
*/

  const userId = parseInt(req.params.userId, 10);
  const { status } = req.query;

  if (isNaN(userId)) {
    return res.status(StatusCodes.BAD_REQUEST).error({
      errorCode: "INVALID_USER_ID",
      reason: "유효하지 않은 사용자 ID입니다.",
    });
  }

  const whereClause = {
    user_id: userId,
    ...(status && { status }),
  };

  try {
    const missions = await prisma.user_mission.findMany({
      where: whereClause,
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

    return res.success(missions);
  } catch (err) {
    console.error("사용자 미션 목록 조회 오류:", err);
    next(err);
  }
};

// 미션 상태 업데이트
export const UpdateMissionStatus = async (req, res, next) => {

/*
  #swagger.summary = '사용자 미션 상태 변경'
  #swagger.description = '사용자의 진행 중인 미션을 COMPLETED(완료) 또는 다른 상태로 변경합니다.'
  #swagger.tags = ['Mission']
  #swagger.parameters['userId'] = {
    in: 'path',
    description: '사용자 미션 ID',
    required: true,
    type: 'integer',
    example: 1
  }
  #swagger.parameters['status'] = {
    in: 'query',
    description: '변경할 미션 상태 (기본값: COMPLETED)',
    required: false,
    type: 'string',
    enum: ['COMPLETED', 'FAILED', 'CANCELED'],
    example: 'COMPLETED'
  }
  #swagger.responses[200] = {
    description: '미션 상태 변경 성공',
    schema: {
      resultType: "SUCCESS",
      error: null,
      success: {
        id: 1,
        userId: 1,
        missionId: 123,
        status: "COMPLETED",
        updatedAt: "2025-05-20T12:34:56Z"
      }
    }
  }
  #swagger.responses[400] = {
    description: '유효하지 않은 요청',
    schema: {
      resultType: "FAIL",
      error: {
        errorCode: "M001",
        reason: "유효하지 않은 미션 ID 또는 상태값입니다.",
        data: null
      },
      success: null
    }
  }
  #swagger.responses[500] = {
    description: '서버 내부 오류',
    schema: {
      resultType: "FAIL",
      error: {
        errorCode: "S001",
        reason: "서버 내부 오류가 발생했습니다.",
        data: null
      },
      success: null
    }
  }
*/


  try {
    const userMissionId = parseInt(req.params.userId, 10);
    const status = req.query.status || "COMPLETED"; // 기본값은 COMPLETED
    const updated = await updateMissionStatus(userMissionId, status);

    return res.success(updated);
  } catch (err) {
    console.error("미션 상태 업데이트 실패:", err);
    next(err);
  }
};
