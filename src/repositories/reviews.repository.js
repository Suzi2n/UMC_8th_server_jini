import { prisma } from "../db.config.js";

export const addReview = async (review) => {
  try {
    const createdReview = await prisma.review.create({
      data: {
        store_id: review.storeId,
        user_id: review.userId,
        rating: review.rating,
        content: review.content,
        created_at: new Date()
      },
    });
    return createdReview.id;
  } catch (err) {
    throw new Error(`리뷰 등록 실패: ${err.message}`);
  }
};

// 리뷰 조회
export const getReviewById = async (reviewId) => {
  try {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        review_image: true,
        user: true,
        store: true
      }
    });
    
    if (!review) {
      throw new Error("존재하지 않는 리뷰입니다.");
    }
    
    
    return review;
  } catch (err) {
    throw new Error(`리뷰 조회 중 오류가 발생했습니다: ${err.message}`);
  }
};


// 가게의 리뷰 목록 조회
export const getAllStoreReviews = async (storeId) => {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        store_id: parseInt(storeId),
      },
      include: {
        user: true,
        store: true,
        review_image: true,
      },
      orderBy: { created_at: "desc" }, // 최신순 정렬
      take: 5, // 가장 최근 5개만 가져옴 (원하면 제거 가능)
    });

    return reviews;
  } catch (error) {
    console.error("Prisma 오류:", error);
    throw new Error(`가게 리뷰 조회 중 오류 발생: ${error.message}`);
  }
};


// 사용자가 작성한 리뷰 목록 조회 (커서 없이)
export const getUserReviews = async (userId) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { 
        user_id: BigInt(userId)
      },
      include: {
        store: true,
        review_image: true
      },
      orderBy: { created_at: 'desc' },
      take: 10
    });
    
    return reviews;
  } catch (error) {
    console.error("사용자 리뷰 조회 오류:", error);
    throw new Error(`사용자 리뷰 조회 중 오류가 발생했습니다: ${error.message}`);
  }
};
