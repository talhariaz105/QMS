const allRoles = {
  admin: [
    'getUsers',
    'manageCapa',
    'buySubscription',
    'getSubscriptions',
    'manageUsers',
    // 'ManageWorkspaceRolespermissions',
    'updateRole',
    'getSingleRole',
    'createRole',
    'deleteRole',
    'getWorkspaceRoleNames',
    // "manageWorkspaceUserPermissions"
    'getWorkspaceUsers',
    'createWorkspaceUser',
    'updateWorkspaceUser',
    'deleteWorkspaceUser',
    'getSingleWorkspaceUser',
    // 'manageGroups',
    'createGroup',
    'getWorkspaceGroups',
    'getWorkspaceGroupNames',
    'getSingleGroup',
    'updateGroup',
    'deleteGroup',
    'removeGroupMember',
    'addGroupMember',
    'getGroupMembers',

    // 'manageLibrary',
    'deleteLibrary',
    'updateLibrary',
    'removeLibraryMember',
    'addLibraryMember',
    'getLibraryMembers',
    'getWorkspaceLibraryNames',
    'getWorkspaceLibraries',
    'createLibrary',
    'updateLibraryById',
    'getSingleLibrary',

    // Actions
    'deleteAction',
    'updateAction',
    'getSingleAction',
    'getActions',
    'createAction',
  ],
  subAdmin: {
    subAdmin: [
      'getSubscriptions',
      'manageCapa',
      // manageRoles
      'updateRole',
      'getSingleRole',
      `createRole`,
      'deleteRole',
      'getWorkspaceRoleNames',
      // 'manageWorkspaceUserPermissions'
      'getWorkspaceUsers',
      'createWorkspaceUser',
      'updateWorkspaceUser',
      'deleteWorkspaceUser',
      'getSingleWorkspaceUser',
      // 'manageGroups',
      'createGroup',
      'getWorkspaceGroups',
      'getWorkspaceGroupNames',
      'getSingleGroup',
      'updateGroup',
      'deleteGroup',
      // 'manageLibrary',
      'deleteLibrary',
      'updateLibrary',
      'removeLibraryMember',
      'addLibraryMember',
      'getLibraryMembers',
      'getWorkspaceLibraryNames',
      'getWorkspaceLibraries',
      'createLibrary',
      'updateLibraryById',
      'getSingleLibrary',

      // Actions
      'deleteAction',
      'updateAction',
      'getSingleAction',
      'getActions',
      'createAction',
    ],
    standardUser: [
      'getSubscriptions',
      'manageCapa',
      'getWorkspaceUsers',
      // 'manageLibrary',
      'deleteLibrary',
      'updateLibrary',
      'removeLibraryMember',
      'addLibraryMember',
      'getLibraryMembers',
      'getWorkspaceLibraryNames',
      'getWorkspaceLibraries',
      'createLibrary',
      'updateLibraryById',
      // Actions
      'deleteAction',
      'updateAction',
      'getSingleAction',
      'getActions',
      'createAction',
    ],
  },

  workspaceUser: {
    view: [
      'getLibraryMembers',
      'getWorkspaceLibraryNames',
      'getWorkspaceLibraries',
      'getSingleLibrary',
      'getWorkspaceUsers',
      // Actions
      'getSingleAction',
      'getActions',
    ],
    edit: [
      // 'manageLibrary',
      'deleteLibrary',
      'updateLibrary',
      'removeLibraryMember',
      'addLibraryMember',
      'getLibraryMembers',
      'getWorkspaceLibraryNames',
      'getWorkspaceLibraries',
      'createLibrary',
      'updateLibraryById',
      'getSingleLibrary',
      'getWorkspaceUsers',
      // Actions
      'deleteAction',
      'updateAction',
      'getSingleAction',
      'getActions',
    ],
    w_admin: [
      // permissions for workspace admin for role
      'updateRole',
      'getSingleRole',
      `createRole`,
      'deleteRole',
      'getWorkspaceRoleNames',

      // permissions for workspace admin for role
      'getWorkspaceUsers',
      'createWorkspaceUser',
      'updateWorkspaceUser',
      'deleteWorkspaceUser',
      'getSingleWorkspaceUser',
      // 'manageGroups',
      'createGroup',
      'getWorkspaceGroups',
      'getWorkspaceGroupNames',
      'getSingleGroup',
      'updateGroup',
      'deleteGroup',
      // 'manageLibrary',
      'deleteLibrary',
      'updateLibrary',
      'removeLibraryMember',
      'addLibraryMember',
      'getLibraryMembers',
      'getWorkspaceLibraryNames',
      'getWorkspaceLibraries',
      'createLibrary',
      'updateLibraryById',
      'getSingleLibrary',

      // Actions
      'deleteAction',
      'updateAction',
      'getSingleAction',
      'getActions',
      'createAction',
    ],
  },
};

export const roles: string[] = Object.keys(allRoles);

// Normalize allRoles so that each role maps to a string[]
const normalizedRoleRights: [string, string[]][] = [];

for (const [role, rights] of Object.entries(allRoles)) {
  if (Array.isArray(rights)) {
    normalizedRoleRights.push([role, rights]);
  } else if (typeof rights === 'object' && rights !== null) {
    for (const [subRole, subRights] of Object.entries(rights)) {
      normalizedRoleRights.push([subRole, subRights]);
    }
  }
}

export const roleRights: Map<string, string[]> = new Map(normalizedRoleRights);
