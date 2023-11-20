import type { AssetInfo } from '@moodlenet/component-library/common'
import type {
  ProvidedImage,
  ResourceMeta,
  ResourceMetaValidationErrors,
} from '@moodlenet/core-domain/resource'
import type { ResourceFormProps, ResourceMetaFormRpc } from '../../../common/types.mjs'
import { getResourceFileUrl, getValidations } from '../../services.mjs'

export async function validate_xsm_meta(resourceMeta: ResourceMeta) {
  const validationSchemas = await getValidations()
  //const resourceEdits = resourceEdits2ResourceDataResourceEdits(resourceEdits)
  const resourceFormProps: ResourceFormProps = meta_2_form(resourceMeta)

  const validatedResp = await validationSchemas.draftResourceValidationSchema
    .validate(resourceFormProps, { stripUnknown: true })
    .then(validatedPatch => {
      const validatedMeta = form_2_meta({
        ...validatedPatch,
        learningOutcomes: validatedPatch.learningOutcomes ?? [],
      })
      return { valid: true, validatedMeta } as const
    })
    .catch((validatedError: { path: keyof ResourceMeta; message: string }) => {
      console.log(['StoreResourceEdits', validatedError])
      const errors = [validatedError].flat().reduce((acc, cur) => {
        acc[cur.path] = cur.message
        return acc
      }, {} as ResourceMetaValidationErrors)
      return { valid: false, errors } as const
    })
  if (!validatedResp.valid) {
    return validatedResp
  }
  return { valid: true, validatedMeta: validatedResp.validatedMeta } as const
}

export function meta_2_form(meta: ResourceMeta): ResourceMetaFormRpc {
  const resourceFormRpc: ResourceMetaFormRpc = {
    description: meta.description ?? '',
    title: meta.title ?? '',
    language: meta.language?.code ?? '',
    license: meta.license?.code ?? '',
    subject: meta.subject?.code ?? '',
    level: meta.level?.code ?? '',
    type: meta.type?.code ?? '',
    learningOutcomes: (meta.learningOutcomes ?? []).map(({ value }) => value),
    ...(meta.originalPublicationInfo
      ? {
          year: String(meta.originalPublicationInfo.year),
          month: String(meta.originalPublicationInfo.month),
        }
      : { year: '', month: '' }),
  }
  return resourceFormRpc
}

export function form_2_meta(resourceFormRpc: ResourceMetaFormRpc): ResourceMeta {
  const meta: ResourceMeta = {
    description: resourceFormRpc.description,
    title: resourceFormRpc.title,
    language: { code: resourceFormRpc.language },
    license: { code: resourceFormRpc.license },
    subject: { code: resourceFormRpc.subject },
    level: { code: resourceFormRpc.level },
    type: { code: resourceFormRpc.type },
    learningOutcomes: resourceFormRpc.learningOutcomes.map(value => ({
      sentence: value.sentence,
      value,
    })),
    originalPublicationInfo: resourceFormRpc.year
      ? {
          year: Number(resourceFormRpc.year),
          month: Number(resourceFormRpc.month || 1),
        }
      : null,
  }
  return meta
}

export function resourceMetaForm_2_meta(resourceMetaFormRpc: ResourceMetaFormRpc): ResourceMeta {
  const meta: ResourceMeta = {
    description: resourceMetaFormRpc.description,
    title: resourceMetaFormRpc.title,
    language: resourceMetaFormRpc.language ? { code: resourceMetaFormRpc.language } : null,
    license: resourceMetaFormRpc.license ? { code: resourceMetaFormRpc.license } : null,
    subject: resourceMetaFormRpc.subject ? { code: resourceMetaFormRpc.subject } : null,
    level: resourceMetaFormRpc.level ? { code: resourceMetaFormRpc.level } : null,
    type: resourceMetaFormRpc.type ? { code: resourceMetaFormRpc.type } : null,
    learningOutcomes: resourceMetaFormRpc.learningOutcomes.map(value => ({
      sentence: value.sentence,
      value,
    })),
    originalPublicationInfo: resourceMetaFormRpc.year
      ? {
          year: Number(resourceMetaFormRpc.year),
          month: Number(resourceMetaFormRpc.month || 1),
        }
      : null,
  }
  return meta
}

export async function providedImage_2_assetInfo(
  providedImage: ProvidedImage,
  resourceKey: string,
): Promise<AssetInfo> {
  const assetInfo: AssetInfo = {
    location:
      providedImage.kind === 'file'
        ? await getResourceFileUrl({ _key: resourceKey, rpcFile: providedImage.rpcFile })
        : providedImage.url,
    credits: providedImage.kind === 'url' ? providedImage.credits : null,
  }
  return assetInfo
}
