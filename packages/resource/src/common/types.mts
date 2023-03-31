import { Href } from '@moodlenet/react-app/ui'
import { ClientSessionData, PkgContextT } from '@moodlenet/react-app/web-lib'
import { expose as me } from '../server/expose.mjs'

export type MyWebDeps = {
  me: typeof me
}

export type MyPkgContext = PkgContextT<MyWebDeps>
export type MainContextResourceType = MyPkgContext & {
  rpcCaller: RpcCaller
  auth: {
    isAuthenticated: boolean
    isAdmin: boolean
    clientSessionData: ClientSessionData | null | undefined
  }
}

export type ResourceFormValues = {
  title: string
  description: string
}

export type ResourceData = {
  resourceId: string
  mnUrl: string
  contentType: 'link' | 'file'
  imageUrl: string | null

  contentUrl: string | null
  downloadFilename: string | null
  // specificContentType: string // ex: url, pdf, doc...
  isWaitingForApproval?: boolean
  // numLikes: number
}

export type ResourceState = {
  isPublished: boolean
  uploadProgress?: number
  // liked: boolean
  // bookmarked: boolean
}

export type ResourceTypeForm = {
  resourceForm: ResourceFormValues
  access: ResourceAccess
  state: ResourceState
  data: ResourceData
  contributor: {
    avatarUrl: string | null
    displayName: string
    timeSinceCreation: string
    creatorProfileHref: Href
  }
}

export type ResourceActions = {
  publish: () => void
  unpublish: () => void
  editData: (values: ResourceFormValues) => Promise<ResourceFormValues>
  setImage: (file: File) => Promise<unknown>
  setContent: (content: File | string) => Promise<unknown>
  deleteResource(): unknown
  // toggleLike(): unknown
  // toggleBookmark(): unknown
}

export type ResourceAccess = {
  isAuthenticated: boolean
  isCreator: boolean
  canEdit: boolean
  canPublish: boolean
  canDelete: boolean
  // canLike: boolean
  // canBookmark: boolean
}

export type ResourceCardData = {
  // tags?: FollowTag[]
  // numLikes: number
  owner: {
    displayName: string
    avatar: string | null
    profileHref: Href
  }
  resourceHomeHref?: Href
} & Pick<
  ResourceData,
  'imageUrl' | 'downloadFilename' | 'contentType' | 'resourceId' | 'isWaitingForApproval'
> &
  Pick<ResourceFormValues, 'title'>

export type ResourceCardState = {
  isSelected: boolean
  selectionMode: boolean // When selection resources to be added to a collection
  // liked: boolean
  // bookmarked: boolean
} & Pick<ResourceState, 'isPublished'>

export type ResourceCardActions = Pick<ResourceActions, 'publish' | 'unpublish'>

export type ResourceCardAccess = Pick<
  ResourceAccess,
  | 'isAuthenticated'
  //  'canLike' |
  //  'canBookmark' |
  | 'canPublish'
  | 'canDelete'
>
// {
//   isCreator: boolean
//   canEdit: boolean
//   isAuthenticated: boolean
// }

export type RpcCaller = {
  edit: (resourceKey: string, res: ResourceFormValues) => Promise<ResourceFormValues>
  get: (resourceKey: string) => Promise<ResourceTypeForm>
  _delete: (resourceKey: string) => Promise<ResourceTypeForm>
  setImage: (resourceKey: string, file: File) => Promise<ResourceTypeForm>
  setContent: (resourceKey: string, file: File | string) => Promise<ResourceTypeForm>
  setIsPublished: (resourceKey: string, approve: boolean) => Promise<ResourceTypeForm>
  // toggleBooÇkmark: (resourceKey: string) => Promise<ResourceTypeForm>
  // toggleLike: (resourceKey: string) => Promise<ResourceTypeForm>
}

export type Organization = {
  name: string
  shortName: string
  title: string
  subtitle: string
  url: string
  logo: string
  smallLogo: string
  color: string
}

export const getResourceTypeInfo = (
  isLikeOrFile?: 'link' | 'file',
  filename?: string | null,
): { typeName: string | null; typeColor: string | null } => {
  const filenameExtension = filename?.split('.').pop()
  const resourceType = isLikeOrFile === 'link' ? 'link' : filenameExtension ?? 'unknown'
  switch (resourceType) {
    case 'mp4':
    case 'avi':
    case 'mov':
    case 'wmv':
    case 'mkv':
    case 'webm':
    case 'avchd':
    case 'flv':
    case 'f4v':
    case 'swf':
      return { typeName: `Video`, typeColor: '#2A75C0' }
    case 'mp3':
    case 'wav':
    case 'wma':
    case 'aac':
    case 'm4a':
      return { typeName: `Audio`, typeColor: '#8033c7' }
    case 'jpeg':
    case 'jpg':
    case 'png':
    case 'gif':
      return { typeName: `Image`, typeColor: '#27a930' }
    case 'pdf':
      return { typeName: 'pdf', typeColor: '#df3131' }
    case 'xls':
    case 'xlsx':
    case 'ods':
      return { typeName: `Spreadsheet`, typeColor: '#0f9d58' }
    case 'doc':
    case 'docx':
    case 'odt':
      return { typeName: 'Word', typeColor: '#4285f4' }
    case 'ppt':
    case 'pptx':
    case 'odp':
      return { typeName: `Presentation`, typeColor: '#dfa600' }
    case 'mbz':
      return { typeName: 'Moodle course', typeColor: '#f88012' }
    case 'link':
      return { typeName: `Web page`, typeColor: '#C233C7' }
    case 'unknown':
      return { typeName: null, typeColor: null }
    default:
      return { typeName: resourceType, typeColor: '#15845A' }
  }
}

export const maxUploadSize = 1024 * 1024 * 50
