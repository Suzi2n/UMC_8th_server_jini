import {addStore} from "../services/stores.service.js";
import {StatusCodes} from "http-status-codes";      

export const handleAddStore = async (req, res, next) => {

/*
  #swagger.summary = '가게 추가'
  #swagger.description = '특정 지역에 새로운 가게를 등록합니다.'
  #swagger.tags = ['Store']
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          required: ["name", "regionId", "address", "phone"],
          properties: {
            name: { type: "string", example: "식당" },
            regionId: { type: "integer", example: 3 },
            address: { type: "string", example: "전주시 덕진구 명륜5길" },
          }
        }
      }
    }
  }
  #swagger.responses[200] = {
    description: "가게 등록 성공",
    schema: {
      resultType: "SUCCESS",
      error: null,
      success: {
        id: 12,
        name: "식당",
        regionId: 3,
        address: "전주시 덕진구 명륜5길",
        created_at: "2025-05-20T12:34:56Z"
      }
    }
  }
  #swagger.responses[400] = {
    description: "잘못된 입력값으로 인한 요청 실패",
    schema: {
      resultType: "FAIL",
      error: {
        errorCode: "S001",
        reason: "필수 입력값이 누락되었습니다.",
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
        errorCode: "S002",
        reason: "서버 내부 오류가 발생했습니다.",
        data: null
      },
      success: null
    }
  }
*/

    console.log("가게 추가를 요청했습니다!");
    console.log("body:", req.body);

    try {
        const store = await addStore(req.body);
        return res.success(store);
    } catch (err) {
        next(err);
    }


};