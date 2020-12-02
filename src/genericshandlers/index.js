import { alertHandler } from './alert';
import { preloadHandler } from './preload';
import { preloadF2 } from './preloadF2';
import { submitHandler } from './submit';
import { refreshSubmitHandler } from './refreshDataAfterFormSubmit';
import { formCancelHandler } from './formCancel';
import { updateHandler } from './update';
import { individualUpdate } from './individualUpdate'

import { addBulkTag } from './addBulkTag';
import { insertTag } from './insert_tag';

import { getThemehandler } from './get_theme';
import { deleteUserIntimateHandler } from './delete_user_intimate';
import { sUpdateHandler } from './slideoutUpdate';
import { deleteHandler } from './delete';

import { integrationSubmitHandler } from './integrationSubmit';
import { filterSaveHandler } from './filerSave';

export var genericHandlers = [
  preloadHandler,
  submitHandler,
  preloadF2,
  individualUpdate,
  alertHandler,
  refreshSubmitHandler,
  formCancelHandler,
  updateHandler,
  addBulkTag,
  getThemehandler,
  deleteUserIntimateHandler,
  sUpdateHandler,
  insertTag,
  deleteHandler,
  integrationSubmitHandler,
  filterSaveHandler
];
