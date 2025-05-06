import { pool } from "../db.config.js";

// 가게 추가
export const addStore = async (data) => {
    const conn = await pool.getConnection();
    try {
        const [result] = await conn.query(
            `INSERT INTO store (name, address, region_id) VALUES (?, ?, ?);`,
            [data.name, data.address, data.regionId]
        );

        return result.insertId;
    } catch (err) {
        throw new Error(`가게 등록 중 오류 발생: ${err.message}`);
    } finally {
        conn.release();
    }
};

// 가게 ID로 가게 조회 (존재 여부 확인용)
export const getStoreById = async (storeId) => {
    const conn = await pool.getConnection();
    try {
        const [rows] = await conn.query(
            `SELECT * FROM store WHERE id = ?;`,
            [storeId]
        );
        return rows[0] || null;
    } catch (err) {
        throw new Error(`가게 조회 중 오류 발생: ${err.message}`);
    } finally {
        conn.release();
    }
};
