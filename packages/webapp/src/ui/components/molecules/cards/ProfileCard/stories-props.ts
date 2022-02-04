import { t } from '@lingui/macro'
import { fileExceedsMaxUploadSize } from '@moodlenet/common/dist/staticAsset/lib'
import { action } from '@storybook/addon-actions'
import { useFormik } from 'formik'
import { mixed, object, SchemaOf, string } from 'yup'
import { people } from '../../../../../helpers/factories'
import { randomIntFromInterval } from '../../../../../helpers/utilities'
import { ProfileFormValues } from '../../../pages/Profile/types'
import { ProfileCardProps } from './ProfileCard'

const maxUploadSize = 1024 * 1024 * 50
export const validationSchema: SchemaOf<ProfileFormValues> = object({
  avatarImage: mixed()
    .test((v, { createError }) =>
      v instanceof Blob && fileExceedsMaxUploadSize(v.size, maxUploadSize)
        ? createError({ message: t`This file is too big for uploading` })
        : true
    )
    .optional(),
  backgroundImage: mixed()
    .test((v, { createError }) =>
      v instanceof Blob && fileExceedsMaxUploadSize(v.size, maxUploadSize)
        ? createError({ message: t`This file is too big for uploading` })
        : true
    )
    .optional(),
  displayName: string()
    .max(160)
    .min(3)
    .required(t`Please provide a display name`),
  location: string().optional(),
  organizationName: string().max(30).min(3).optional(),
  siteUrl: string().url().optional(),
  description: string()
    .max(4096)
    .min(3)
    .required(t`Please provide a description`),
})

export const useProfileCardStoryProps = (overrides?: {
  editFormValues?: Partial<ProfileFormValues>
  props?: Partial<ProfileCardProps>
}): ProfileCardProps => {
  const person = people[randomIntFromInterval(0, 3)]
  return {
    isOwner: false,
    isAuthenticated: false,
    approveUserForm: useFormik({
      initialValues: {},
      onSubmit: action('approve User'),
    }),
    unapproveUserForm: useFormik({
      initialValues: {},
      onSubmit: action('unapprove User'),
    }),
    toggleFollowForm: useFormik({
      initialValues: {},
      onSubmit: action('toggle Follow'),
    }),
    requestApprovalForm: useFormik({
      initialValues: {},
      onSubmit: action('request Approval'),
    }),
    toggleIsEditing: action('toogle Is Editing'),
    openSendMessage: action('open Send Message'),
    editForm: useFormik<ProfileFormValues>({
      onSubmit: action('submit edit'),
      validationSchema,
      initialValues: {
        displayName: person!.username,
        description:
          'Italian biologist specialized in endangered rainforest monitoring. Cooperating with local organizations to improve nature reserves politics.',
        organizationName: person!.organization,
        location: person!.location,
        siteUrl: 'https://iuri.is/',
        avatarImage: null,
        backgroundImage: null,
        ...overrides?.editFormValues,
      },
    }),
    ...overrides?.props,
  }
}
