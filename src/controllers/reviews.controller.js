import { StatusCodes } from "http-status-codes";
import { bodyToReview } from "../dtos/reviews.dto.js";
import { addReview } from "../services/reviews.service.js";
import { getStoreById } from "../services/stores.service.js"; // 가게 존재 여부 확인용 함수

export const handleAddReview = async (req, res, next) => {
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
        res.status(StatusCodes.OK).json({ result });
    } catch (err) {
        next(err);
    }
};

