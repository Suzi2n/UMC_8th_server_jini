// user.dto.js
// 요청 body를 user 객체로 변환
export const bodyToUser = (body) => {
    const birth = new Date(body.birth);

    return {
        email: body.email,
        name: body.name,
        gender: body.gender,
        birth,
        address: body.address || "",
        detailAddress: body.detailAddress || "",
        phoneNumber: body.phoneNumber,
        preferences: body.preferences,
    };
};

// DB 유저 + 취향을 응답 형태로 변환
export const responseFromUser = ({ user, preferences }) => {
    return {
        id: user.id,
        email: user.email,
        name: user.name,
        gender: user.gender,
        birth: user.birth instanceof Date
            ? user.birth.toISOString().split("T")[0]
            : user.birth,
        address: user.address,
        detailAddress: user.detailAddress,
        phoneNumber: user.phoneNumber,
        preferences: preferences.map((pref) => ({
            id: pref.id,
            name: pref.name,
        })),
        createdAt: user.created_at,
        updatedAt: user.updated_at,
    };
};
