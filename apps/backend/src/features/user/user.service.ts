import * as UserRepository from "./user.repository";

export function checkUserType(phoneNumber: string) {
  return UserRepository.checkUserType(phoneNumber);
}

export function getByUid(uid: string) {
  return UserRepository.getByUid(uid);
}

export async function findOrCreate(phoneNumber: string) {
  const { type, uid } = await UserRepository.checkUserType(phoneNumber);

  if (type != null) {
    const user = await UserRepository.getByUid(uid);

    return { isNew: false, user };
  } else {
    const user = await UserRepository.createByPhoneNumber(phoneNumber);

    return { isNew: true, user };
  }
}
