import { StatusCodes } from "http-status-codes";
import { bodyToUser } from "../dtos/user.dto.js";
import { userSignUp } from "../services/user.service.js";
import { UserReviewList } from "../services/reviews.service.js";
import { prisma } from "../db.config.js"; 

export const handleUserSignUp = async (req, res, next) => {
    /*
    #swagger.summary = '회원 가입 API';
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              email: { type: "string" },
              name: { type: "string" },
              gender: { type: "string" },
              birth: { type: "string", format: "date" },
              address: { type: "string" },
              detailAddress: { type: "string" },
              phoneNumber: { type: "string" },
              preferences: { type: "array", items: { type: "number" } }
            }
          }
        }
      }
    };
    #swagger.responses[200] = {
      description: "회원 가입 성공 응답",
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
                  email: { type: "string" },
                  name: { type: "string" },
                  preferCategory: { type: "array", items: { type: "string" } }
                }
              }
            }
          }
        }
      }
    };
    #swagger.responses[400] = {
      description: "회원 가입 실패 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "U001" },
                  reason: { type: "string" },
                  data: { type: "object" }
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    };
  */
  console.log("회원가입을 요청했습니다!");
  console.log("body:", req.body); // 테스트용

  const user = await userSignUp(bodyToUser(req.body));

   res.status(StatusCodes.OK).success(user);
};

// export const handleUserReviewList = async (req, res, next) => {
//   const userId = parseInt(req.params.userId);
//   if (!userId) {
//     return res.status(StatusCodes.UNAUTHORIZED).json({ error: "인증이 필요합니다." });
//   }

//   try {
//     const reviews = await prisma.review.findMany({
//       where: { user_id: userId },
//       include: { store: true },
//     });

//     res.status(StatusCodes.OK).json({ result: reviews });
//   } catch (err) {
//     next(err);
//   }
// };

export const handleUserReviewList = async (req, res, next) => {
  /*
    #swagger.tags = ['User']
    #swagger.summary = '사용자 리뷰 목록 조회'
    #swagger.parameters['userId'] = {
      in: 'path',
      description: '리뷰를 조회할 사용자 ID',
      required: true,
      type: 'integer'
    }
    #swagger.responses[200] = {
      description: '사용자 리뷰 목록 조회 성공',
      schema: {
        resultType: "SUCCESS",
        error: null,
        success: [
          {
            id: 1,
            content: "맛있어요.",
            rating: 4.5,
            created_at: "2025-05-01T12:34:56Z",
            updated_at: "2025-05-01T12:34:56Z",
            store: {
              id: 42,
              name: "식당"
            }
          }
        ]
      }
    }
    #swagger.responses[401] = {
      description: '인증되지 않은 사용자 요청',
      schema: {
        resultType: "FAIL",
        error: {
          errorCode: "UNAUTHORIZED",
          reason: "인증이 필요합니다.",
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

  const userId = parseInt(req.params.userId);
  if (!userId) {
    return res.status(StatusCodes.UNAUTHORIZED).error({
      errorCode: "UNAUTHORIZED",
      reason: "인증이 필요합니다.",
    });
  }

  try {
    const reviews = await prisma.review.findMany({
      where: { user_id: userId },
      include: { store: true },
    });

    return res.success(reviews);
  } catch (err) {
    console.error("사용자 리뷰 목록 조회 오류:", err);
    next(new CustomError("S001", "서버 내부 오류가 발생했습니다.", 500));
  }
};

