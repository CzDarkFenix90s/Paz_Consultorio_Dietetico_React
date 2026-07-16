// src/domain/enums/role.enum.ts

export const UserRole = {
  ADMIN: 'admin',
  NUTRICIONISTA: 'nutricionista',
  PACIENTE: 'paciente',
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];
