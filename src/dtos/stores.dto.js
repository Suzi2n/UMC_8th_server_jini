export const bodyToStore = (body) => {
    return {
        name: body.name,
        address: body.address,
        regionId: body.regionId,
    };
};

export const storeToResponse = (store) => {
  return {
    id: store.id,
    name: store.name,
    address: store.address,
    contact: store.contact,
    category: {
      id: store.category.id,
      name: store.category.name
    },
    region: {
      id: store.region.id,
      name: store.region.name
    },
    description: store.description,
    opening_hours: store.opening_hours,
    created_at: store.created_at
  };
};