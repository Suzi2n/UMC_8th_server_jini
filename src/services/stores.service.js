import { addStore as addStoreRepo, getStoreById as getStoreByIdRepo } from "../repositories/stores.repository.js";

// 가게 추가
export const addStore = async (storeData) => {
    const storeId = await addStoreRepo(storeData);
    return { storeId };
};

// 가게 조회 (존재 여부 확인용)
export const getStoreById = async (storeId) => {
    const store = await getStoreByIdRepo(storeId);
    return store;
};