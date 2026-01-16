import type { UserRole } from "@/auth/tables";
import type { PartialUser } from "@/auth/types";

export type DefaultAction = "view" | "update" | "create" | "delete";

type PermissionCheck<Key extends keyof Permissions> =
  | boolean
  | ((user: PartialUser, data: Permissions[Key]["dataType"]) => boolean);

type RolesWithPermissions = {
  [R in UserRole]: Partial<{
    [Key in keyof Permissions]: Partial<{
      [Action in Permissions[Key]["action"]]: PermissionCheck<Key>;
    }>;
  }>;
};

type Permissions = {
  users: {
    dataType: PartialUser;
    action: DefaultAction;
  };
  screens: {
    dataType: { screenKey: ScreenKey };
    action: DefaultAction;
  };
};

export const unrestricted = {
  create: true,
  view: true,
  update: true,
  delete: true,
};

export const screenKeys = ["dashboard", "my-account"] as const;
export type ScreenKey = (typeof screenKeys)[number];

export const rolesPermissions = {
  admin: {
    users: unrestricted,
    screens: unrestricted,
  },
  user: {
    screens: {
      view: (_, { screenKey }) => screenKey === "my-account",
    },
    users: {
      view: (user: PartialUser, data: PartialUser) => user.id === data.id,
      update: (user: PartialUser, data: PartialUser) => user.id === data.id,
      delete: (user: PartialUser, data: PartialUser) => user.id === data.id,
    },
  },
} as const satisfies RolesWithPermissions;

export function hasPermission<Resource extends keyof Permissions>(
  user: PartialUser,
  resource: Resource,
  action: Permissions[Resource]["action"],
  data?: Permissions[Resource]["dataType"],
): boolean {
  const permission = (rolesPermissions as RolesWithPermissions)[user.role]?.[
    resource
  ]?.[action];
  if (permission == null) return false;

  if (typeof permission === "boolean") return permission;
  return data != null && permission(user, data);
}
