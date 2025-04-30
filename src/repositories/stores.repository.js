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