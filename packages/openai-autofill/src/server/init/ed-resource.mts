import { on } from '@moodlenet/ed-resource/server'
import { enqueueMetaGeneration } from '../prompt/function-call.mjs'
on('resource:request-metadata-generation', async ({ data: { resourceKey } }) => {
  enqueueMetaGeneration(resourceKey)
})
