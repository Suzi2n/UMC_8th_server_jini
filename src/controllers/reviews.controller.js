import { StatusCodes } from "http-status-codes";
import { bodyToReview } from "../dtos/reviews.dto.js";
import { addReview } from "../services/reviews.service.js";
import { getStoreById } from "../services/stores.service.js"; // 가게 존재 여부 확인용 함수

export const handleAddReview = async (req, res, next) => {

    /*
  #swagger.summary = '리뷰 추가'
  #swagger.description = '사용자가 특정 가게에 리뷰를 추가합니다.'
  #swagger.tags = ['Review']
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          required: ["storeId", "userId", "content", "rating"],
          properties: {
            storeId: { type: "integer", example: 42 },
            userId: { type: "integer", example: 1 },
            content: { type: "string", example: "정말 맛있었어요!" },
            rating: { type: "number", example: 4.5 }
          }
        }
      }
    }
  }
  #swagger.responses[200] = {
    description: "리뷰 등록 성공",
    schema: {
      resultType: "SUCCESS",
      error: null,
      success: {
        id: 101,
        storeId: 42,
        userId: 1,
        content: "정말 맛있었어요!",
        rating: 4.5,
        created_at: "2025-05-20T12:34:56Z"
      }
    }
  }
  #swagger.responses[404] = {
    description: "존재하지 않는 가게에 대한 요청",
    schema: {
      resultType: "FAIL",
      error: {
        errorCode: "R001",
        reason: "존재하지 않는 가게입니다.",
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

    console.log("리뷰 추가 요청:", req.body);
    try {
        const reviewData = bodyToReview(req.body);

        // 1. 가게 존재 여부 검증
        const store = await getStoreById(reviewData.storeId);
        if (!store) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "존재하지 않는 가게입니다.",
            });
        }

        // 2. 리뷰 추가
        const result = await addReview(reviewData);
        return res.success(result);
    } catch (err) {
        next(err);
    }
};

