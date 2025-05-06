export const bodyToStore = (body) => {
    return {
        name: body.name,
        address: body.address,
        regionId: body.regionId,
    };
};