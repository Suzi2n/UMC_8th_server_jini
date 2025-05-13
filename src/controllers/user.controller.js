import { StatusCodes } from "http-status-codes";
import { bodyToUser } from "../dtos/user.dto.js";
import { userSignUp } from "../services/user.service.js";
import { UserReviewList } from "../services/reviews.service.js";
import { prisma } from "../db.config.js"; 

export const handleUserSignUp = async (req, res, next) => {
  console.log("회원가입을 요청했습니다!");
  console.log("body:", req.body); // 값이 잘 들어오나 확인하기 위한 테스트용

  const user = await userSignUp(bodyToUser(req.body));

   res.status(StatusCodes.OK).success(user);
};

export const handleUserReviewList = async (req, res, next) => {
  const userId = parseInt(req.params.userId);
  if (!userId) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: "인증이 필요합니다." });
  }

  try {
    const reviews = await prisma.review.findMany({
      where: { user_id: userId },
      include: { store: true },
    });

    res.status(StatusCodes.OK).json({ result: reviews });
  } catch (err) {
    next(err);
  }
};
