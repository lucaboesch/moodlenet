import { isJust } from '@moodlenet/common/lib/utils/array'
import { DomainSetup, DomainStart, SubDomain } from '../../../../../lib/domain/types'
import { MoodleNetDomain } from '../../../../MoodleNetDomain'
import { StaticAssetsIO } from '../types'

export type MoodleNetFSStaticAssetsDomain = SubDomain<MoodleNetDomain, 'StaticAssets', {}>

export const defaultFSStaticAssetSetup: DomainSetup<MoodleNetFSStaticAssetsDomain> = {
  'StaticAssets.PersistTempFilesAll': { kind: 'wrk' },
  'StaticAssets.DeleteAsset': { kind: 'wrk' },
}

export const defaultFSStaticAssetStartServices = ({ io }: { io: StaticAssetsIO }) => {
  const moodleNetFSStaticAssetsDomainStart: DomainStart<MoodleNetFSStaticAssetsDomain> = {
    'StaticAssets.PersistTempFilesAll': {
      init: async () => [
        async tempFiles => {
          if (!tempFiles.length) {
            return []
          }
          const results = await Promise.all(
            tempFiles.map(({ tempFileId, uploadType }) => io.persistTemp({ tempFileId, uploadType })),
          )
          const dones = results.filter(isJust)
          if (dones.length < results.length) {
            dones.forEach(_ => io.delAsset(_.assetId))
            return null
          }
          return dones
        },
      ],
    },
    'StaticAssets.DeleteAsset': {
      init: async () => [async ({ assetId }) => io.delAsset(assetId)],
    },
  }
  return moodleNetFSStaticAssetsDomainStart
}
