import { addStore as addStoreRepo } from "../repositories/stores.repository.js";


// 가게 추가
export const addStore = async (storeData) => {
    const storeId = await addStoreRepo(storeData);
    return { storeId }; // storeId만 반환
};