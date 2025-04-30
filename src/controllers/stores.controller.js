import {addStore} from "../services/stores.service.js";
import {StatusCodes} from "http-status-codes";

export const handleAddStore = async (req, res, next) => {
    console.log("가게 추가를 요청했습니다!");
    console.log("body:", req.body);

    try {
        const store = await addStore(req.body);
        res.status(StatusCodes.OK).json({ result: store });
    } catch (err) {
        next(err);
    }


};