import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { handleUserSignUp} from "./controllers/user.controller.js";
import { handleAddStore} from "./controllers/stores.controller.js"
import {handleAddReview} from "./controllers/reviwes.controller.js";
import {handleAddMission, handleChallengeMission} from "./controllers/missions.controller.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors()); // cors 방식 허용
app.use(express.static("public")); // 정적 파일 접근
app.use(express.json()); // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// 워크북 수행(UserSign API)
app.post("/users", handleUserSignUp);

// 특정 지역에 가게 추가하기 API
app.post("/stores", handleAddStore);

// 가게에 리뷰 추가하기 API
app.post("/reviews", handleAddReview);

// 가게에 미션 추가하기 API
app.post("/stores/:storeId/missions", handleAddMission);

// 미션 도전하기 API
app.post("/missions/:missionId/challenges", handleChallengeMission);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});