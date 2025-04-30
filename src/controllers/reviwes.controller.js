import { StatusCodes } from "http-status-codes";
import { bodyToReview } from "../dtos/reviews.dto.js";
import { addReview } from "../services/reviews.service.js";

export const handleAddReview = async (req, res, next) => {
    console.log("리뷰 추가 요청:", req.body);
    try {
        const reviewData = bodyToReview(req.body);
        const result = await addReview(reviewData);
        res.status(StatusCodes.OK).json({ result });
    } catch (err) {
        next(err);
    }
};
