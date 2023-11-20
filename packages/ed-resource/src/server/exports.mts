export { canPublish } from './aql.mjs'
export { EdResourceEntitiesTools } from './entities.mjs'
export { publicFiles } from './init/fs.mjs'
export { Resource } from './init/sys-entities.mjs'
export { getImageAssetInfo } from './lib.mjs'
export {
  createResource,
  deleteImageFile,
  delResource,
  delResourceFile,
  deltaResourcePopularityItem,
  EMPTY_RESOURCE,
  getImageLogicalFilename,
  getResource,
  getResourceFileUrl,
  getValidations,
  patchResource,
  saveResourceImage,
  setResourceContent,
  setResourceImage,
  storeResourceFile,
  validationsConfigs,
} from './services.mjs'
export * from './types.mjs'
export * from './xsm/exports.mjs'
import './xsm/core-interfaces.mjs'
