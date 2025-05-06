import { pool } from "../db.config.js";

export const addMission = async (storeId, missionData) => {
    const conn = await pool.getConnection();
    try {
        const [result] = await conn.query(
            `INSERT INTO missions (store_id, mission_spec, reward, start_at, end_at, status) VALUES (?, ?, ?, ?, ?, ?)`,
            [storeId, missionData.missionSpec, missionData.reward, missionData.startAt, missionData.endAt, missionData.status || 'ONGOING']
        );
        return result.insertId;
    } finally {
        conn.release();
    }
};

export const checkMissionExist = async (missionId) => {
    const conn = await pool.getConnection();
    try {
        const [rows] = await conn.query(
            `SELECT * FROM missions WHERE id = ?`,
            [missionId]
        );
        return rows.length > 0;
    } finally {
        conn.release();
    }
};

// 이미 도전 중인지 확인
export const checkMissionAlreadyChallenged = async (userId, missionId) => {
    const conn = await pool.getConnection();
    try {
        const [rows] = await conn.query(
            `SELECT * FROM mission_challenge WHERE user_id = ? AND mission_id = ?`,
            [userId, missionId]
        );
        return rows.length > 0;
    } finally {
        conn.release();
    }
};

// 미션 도전 추가
export const challengeMissionForUser = async (challengeData) => {
    const conn = await pool.getConnection();
    try {
        const [result] = await conn.query(
            `INSERT INTO mission_challenge (user_id, mission_id, status, created_at, updated_at)
             VALUES (?, ?, 'ONGOING', now(), now())`,
            [challengeData.userId, challengeData.missionId]
        );
        return result.insertId;
    } catch (err) {
        throw new Error(`미션 도전 시작 실패: ${err.message}`);
    } finally {
        conn.release();
    }
};