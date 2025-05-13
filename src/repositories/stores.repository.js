import { prisma } from "../db.config.js";

// 가게 추가
export const addStore = async (data) => {
  try {
    const store = await prisma.store.create({
      data: {
        name: data.name,
        address: data.address,
        regionId: data.regionId,
      },
    });
    return store.id;
  } catch (err) {
    throw new Error(`가게 등록 중 오류 발생: ${err.message}`);
  }
};

// 가게 ID로 가게 조회
export const getStoreById = async (storeId) => {
  try {
    const store = await prisma.store.findUnique({
      where: { id: storeId },
    });
    return store || null;
  } catch (err) {
    throw new Error(`가게 조회 중 오류 발생: ${err.message}`);
  }
};
