import { supabase } from "../../providers/supabase";

export async function getByPhoneNumber(phoneNumber: string) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("phoneNumber", phoneNumber)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function getByUid(uid: string) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("uid", uid)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function checkUserType(phoneNumber: string) {
  const { data, error } = await supabase
    .from("users")
    .select("isTester, uid")
    .eq("phoneNumber", phoneNumber)
    .single();

  if (error) {
    throw error;
  }

  return {
    type: data?.isTester ? "tester" : data != null ? "user" : null,
    uid: data?.uid,
  };
}

export async function createByPhoneNumber(phoneNumber: string) {
  const { data: newUser, error } = await supabase
    .from("users")
    .insert({ phoneNumber })
    .select("*")
    .single();

  if (error || !newUser) {
    throw error;
  }

  return newUser;
}
