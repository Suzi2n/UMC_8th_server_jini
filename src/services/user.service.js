import { responseFromUser } from "../dtos/user.dto.js";
import { DuplicateUserEmailError } from "../error.js";
import {
  addUser,
  getUser,
  getUserPreferencesByUserId,
  setPreference,
} from "../repositories/user.repository.js";

export const userSignUp = async (db, data) => {
  const joinUserId = await addUser(db, {
    email: data.email,
    name: data.name,
    gender: data.gender,
    birth: data.birth,
    address: data.address,
    detailAddress: data.detailAddress,
    phoneNumber: data.phoneNumber,
  });

  if (joinUserId === null) {
    throw new DuplicateUserEmailError("이미 존재하는 이메일입니다.", data);
  }

  for (const preference of data.preferences) {
    await setPreference(db, joinUserId, preference);
  }

  const user = await getUser(db, joinUserId);
  const preferences = await getUserPreferencesByUserId(db, joinUserId);

  return responseFromUser({ user, preferences });
};