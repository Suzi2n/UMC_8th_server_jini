import { pool } from "../db.config.js";

export const addReview = async (review) => {
    const conn = await pool.getConnection();
    try {
        const [result] = await conn.query(
            `INSERT INTO review (store_id, user_id, rating, content) VALUES (?, ?, ?, ?)`,
            [review.storeId, review.userId, review.rating, review.content]
        );
        return result.insertId;
    } catch (err) {
        throw new Error(`리뷰 등록 실패: ${err.message}`);
    } finally {
        conn.release();
    }
};
