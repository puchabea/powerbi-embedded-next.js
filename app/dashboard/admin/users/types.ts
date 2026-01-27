export type Role = "ADMIN" | "USER";
export type RoleFilter = "ALL" | Role;
export type ActiveFilter = "ALL" | "TRUE" | "FALSE";

export type UserRow = {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  isActive: boolean;
  createdAt: string;
};

export function parseRole(value: string): Role {
  return value === "ADMIN" ? "ADMIN" : "USER";
}

export function parseRoleFilter(value: string): RoleFilter {
  if (value === "ALL") return "ALL";
  return parseRole(value);
}

export function parseActiveFilter(value: string): ActiveFilter {
  if (value === "TRUE") return "TRUE";
  if (value === "FALSE") return "FALSE";
  return "ALL";
}
