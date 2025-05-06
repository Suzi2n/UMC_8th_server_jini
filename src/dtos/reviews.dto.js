export const bodyToReview = (body) => {
    return {
        storeId: body.storeId,
        userId: body.userId,
        rating: body.rating,
        content: body.content
    };
};