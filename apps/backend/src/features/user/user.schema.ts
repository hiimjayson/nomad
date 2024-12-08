import { z } from "zod";

export const UserSchema = z.object({
  uid: z.string().uuid(),
  id: z.string(),
  nickname: z.string(),
  phoneNumber: z.string(),
  isTester: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// 생성 시 필요한 필드만 포함하는 스키마
export const CreateUserSchema = UserSchema.omit({
  uid: true,
  createdAt: true,
  updatedAt: true,
});

// 업데이트 시 사용할 수 있는 선택적 필드들의 스키마
export const UpdateUserSchema = UserSchema.omit({
  uid: true,
  phoneNumber: true, // 전화번호는 변경 불가
  createdAt: true,
  updatedAt: true,
}).partial();

// TypeScript 타입 추출
export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
