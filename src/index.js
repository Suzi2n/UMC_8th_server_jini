import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { handleUserSignUp} from "./controllers/user.controller.js";
import { handleAddStore} from "./controllers/stores.controller.js";
import {handleAddReview} from "./controllers/reviews.controller.js";
import {handleAddMission, handleChallengeMission} from "./controllers/missions.controller.js";
import { handleUserReviewList } from "./controllers/user.controller.js";
import { handleGetStoreMissions, handleGetUserMissionsList } from "./controllers/missions.controller.js";
import { UpdateMissionStatus } from "./controllers/missions.controller.js";

import swaggerAutogen from "swagger-autogen";
import swaggerUiExpress from "swagger-ui-express";


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

/**
 * 공통 응답을 사용할 수 있는 헬퍼 함수 등록
 */
app.use((req, res, next) => {
  res.success = (success) => {
    return res.json({ resultType: "SUCCESS", error: null, success });
  };

  res.error = ({ errorCode = "unknown", reason = null, data = null }) => {
    return res.json({
      resultType: "FAIL",
      error: { errorCode, reason, data },
      success: null,
    });
  };

  next();
});

app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false })); 

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/api/users", handleUserSignUp);


// 사용자 리뷰 목록 조회 API
app.get("/api/users/:userId/reviews", handleUserReviewList);

// 사용자 진행 중인 미션 목록 조회 API
app.get("/api/users/:userId/missions",handleGetUserMissionsList);

// 사용자 진행 중인 미션을 진행 완료로 변경 API
app.patch("/api/missions/:userId/status", UpdateMissionStatus);

// 특정 지역에 가게 추가하기 API
app.post("/api/stores", handleAddStore);

// 가게에 리뷰 추가하기 API
app.post("/api/reviews", handleAddReview);

// 가게에 미션 추가하기 API
app.post("/api/stores/:storeId/missions", handleAddMission);

// 가게의 미션 목록 조회 API
app.get("/api/stores/:storeId/missions", handleGetStoreMissions);

// 미션 도전하기 API
app.post("/api/missions/:missionId/challenges", handleChallengeMission);



/**
 * 전역 오류를 처리하기 위한 미들웨어
 */
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  res.status(err.statusCode || 500).error({
    errorCode: err.errorCode || "unknown",
    reason: err.reason || err.message || null,
    data: err.data || null,
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});


// Swagger UI가 렌더링 되도록 설정
app.use(
  "/docs",
  swaggerUiExpress.serve,
  swaggerUiExpress.setup({}, {
    swaggerOptions: {
      url: "/openapi.json",
    },
  })
);

app.get("/openapi.json", async (req, res, next) => {
  // #swagger.ignore = true
  const options = {
    openapi: "3.0.0",
    disableLogs: true,
    writeOutputFile: false,
  };
  const outputFile = "/dev/null"; // 파일 출력은 사용하지 않습니다.
  const routes = ["./src/index.js"];
  const doc = {
    info: {
      title: "UMC 8th",
      description: "UMC 8th Node.js 테스트 프로젝트입니다.",
    },
    host: "localhost:3000",
  };

  const result = await swaggerAutogen(options)(outputFile, routes, doc);
  res.json(result ? result.data : null);
});