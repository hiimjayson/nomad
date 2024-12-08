import { supabase } from "../../providers/supabase";

export async function findByPhoneNumber(phoneNumber: string) {
  const { data, error } = await supabase
    .from("users")
    .select("uid")
    .eq("phoneNumber", phoneNumber)
    .single();

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  return data;
}

export async function create(phoneNumber: string) {
  const { data: newUser, error } = await supabase
    .from("users")
    .insert({ phoneNumber })
    .select("uid")
    .single();

  if (error || !newUser) {
    throw new Error("사용자 생성 중 오류가 발생했습니다.");
  }

  return newUser;
}

export async function checkExists(phoneNumber: string): Promise<boolean> {
  const user = await findByPhoneNumber(phoneNumber);
  return !!user;
}

export async function findOrCreate(
  phoneNumber: string
): Promise<{ isNew: boolean; uid: string }> {
  const user = await findByPhoneNumber(phoneNumber);
  if (user) return { isNew: false, uid: user.uid };
  return { isNew: true, uid: (await create(phoneNumber)).uid };
}
