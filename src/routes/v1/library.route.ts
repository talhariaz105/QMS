import express, { Router } from 'express';
import { checkValidation, libraryController, libraryValidationSchema } from '../../modules/capa/workspace/capalibrary';
import { validate } from '../../modules/validate';
import { auth } from '../../modules/auth';
import checkCreateRole from '../../modules/capa/workspace/mangeRole.middleware';

const router: Router = express.Router();

router.post(
  '/',
  auth('createLibrary'),
  checkCreateRole,
  validate(libraryValidationSchema.libraryValidationSchema),
  libraryController.createLibrary
);
router.get('/workspace/:workspaceId', auth('getWorkspaceLibraries'), checkCreateRole, libraryController.getLibraries);
router.get(
  '/workspace/:libraryId/names',
  auth('getWorkspaceLibraryNames'),
  checkCreateRole,
  libraryController.getLibraryNamesController
);

router.get(
  '/:workspaceId/:libraryId/members',
  auth('getLibraryMembers'),
  checkValidation,
  libraryController.getLibraryMembersController
);
router.post(
  '/:workspaceId/:libraryId/members',
  auth('addLibraryMember'),
  checkValidation,
  libraryController.addMemberToLibraryController
);
router.delete(
  '/:workspaceId/:libraryId/:memberId',
  auth('removeLibraryMember'),
  checkValidation,
  libraryController.removeMemberFromLibraryController
);

router.get('/:workspaceId/:libraryId', auth('getSingleLibrary'), checkValidation, libraryController.getLibrary);
router.patch('/:libraryId/restore', auth('restoreLibrary'), libraryController.RestoreLibrary);
router.delete('/:libraryId', auth('deletePermanentLibrary'), libraryController.deletePermanentLibrary);
router.patch(
  '/:workspaceId/:libraryId',
  auth('updateLibrary'),
  checkValidation,
  validate(libraryValidationSchema.updateLibraryValidationSchema),
  libraryController.updateLibraryById
);
router.delete('/:workspaceId/:libraryId', auth('deleteLibrary'), checkValidation, libraryController.deleteLibraryById);
router.patch(
  '/:workspaceId/:libraryId/form5W2H',
  auth('update5W2H'),
  checkValidation,
  libraryController.updateForm5W2HController
);
router.get(
  '/workspace/:workspaceId/libraries/User',
  auth('getUserLibraries'),
  checkCreateRole,
  libraryController.getLibrariesForUser
);

export default router;
