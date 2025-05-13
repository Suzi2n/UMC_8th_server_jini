export const bodyToReview = (body) => {
    return {
        storeId: body.storeId,
        userId: body.userId,
        rating: body.rating,
        content: body.content,
        created_at: new Date()
    };
};

export const responseFromReviews = (reviews) => {
    return {
        data: reviews.map(review => ({
            id: String(review.id),
            body: review.body,
            score: review.score,
            userId: review.user_id ? String(review.user_id) : null,
            storeId: review.store_id ? String(review.store_id) : null,
            createdAt: review.created_at,
            updatedAt: review.updated_at
        }))
    };
};