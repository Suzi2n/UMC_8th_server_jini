import { addReview as addReviewRepo } from "../repositories/reviews.repository.js";

export const addReview = async (reviewData) => {
    const reviewId = await addReviewRepo(reviewData);
    return { reviewId };
};
