import type { CollectionDataType } from '@moodlenet/collection/server'
import * as collectionSrv from '@moodlenet/collection/server'
import type { EventPayload } from '@moodlenet/core'
import * as resourceDomain from '@moodlenet/core-domain/resource'
import type { ResourceDataType } from '@moodlenet/ed-resource/server'
import * as resourceSrv from '@moodlenet/ed-resource/server'
import type { EntityFullDocument } from '@moodlenet/system-entities/server'
import { setCurrentSystemUser, sysEntitiesDB } from '@moodlenet/system-entities/server'
import { waitFor } from 'xstate/lib/waitFor.js'
import type { WebUserActivityEvents } from '../exports.mjs'
import { getProfileOwnKnownEntities, Profile, WebUserEntitiesTools } from '../exports.mjs'
import { shell } from '../shell.mjs'
import { deltaPoints, pointSystem as Points } from './point-system.mjs'
import { deltaPopularity } from './popularity.mjs'

export async function digestActivityEvent(activity: EventPayload<WebUserActivityEvents>) {
  switch (activity.event) {
    case 'resource-deleted': {
      const {
        resource,
        // userId: { _key },
      } = activity.data
      removeFeaturedFromAllUsers({ featuredEntityId: resource._id })
      removeResourceFromAllCollectionsAndCount({ resource })
      break
    }
    case 'collection-deleted': {
      const { collection } = activity.data
      removeFeaturedFromAllUsers({ featuredEntityId: collection._id })
      break
    }
    case 'feature-entity': {
      const { action, item, profile /* , targetEntityDoc */ } = activity.data
      if (profile.publisher) {
        const add = action === 'add'
        const delta = add ? 1 : -1
        deltaPopularity(delta, {
          feature: item.feature,
          entityType: item.entityType,
          entityKey: item._key,
        })
      }
      break
    }
    case 'collection-created': {
      break
    }
    case 'collection-published': {
      const {
        userId: { _key: profileKey },
        collection,
      } = activity.data
      deltaPoints({ profileKey, delta: Points.contribution.collection.publish.creator })
      collection.resourceList.forEach(async ({ _key: resourceKey }) => {
        const resource = await resourceSrv.getResource(resourceKey)
        const resourceCreatorProfileIds = resource?.meta.creatorEntityId
          ? WebUserEntitiesTools.getIdentifiersById({
              _id: resource.meta.creatorEntityId,
              type: 'Profile',
            })
          : undefined

        const resourceOwnerProfileKey = resourceCreatorProfileIds?.entityIdentifier._key
        assignPointsForCollectionsResourceListCuration({
          action: 'add',
          collectionOwnerProfileKey: profileKey,
          resourceOwnerProfileKey,
        })
      })
      break
    }
    case 'collection-resource-list-curation': {
      const { action, resource, userId, collection } = activity.data
      if (!collection.published) {
        return
      }
      const resourceOwnerProfileIds =
        resource.published && resource._meta.creatorEntityId
          ? WebUserEntitiesTools.getIdentifiersById({
              _id: resource._meta.creatorEntityId,
              type: 'Profile',
            })
          : undefined
      const resourceOwnerProfileKey = resourceOwnerProfileIds?.entityIdentifier._key
      assignPointsForCollectionsResourceListCuration({
        action,
        collectionOwnerProfileKey: userId._key,
        resourceOwnerProfileKey,
      })
      break
    }
    case 'collection-unpublished': {
      const {
        userId: { _key: profileKey },
        collection,
      } = activity.data
      deltaPoints({ profileKey, delta: Points.contribution.collection.unpublish.creator })

      collection.resourceList.forEach(async ({ _key: resourceKey }) => {
        const resource = await resourceSrv.getResource(resourceKey)
        const resourceCreatorProfileIds = resource?.meta.creatorEntityId
          ? WebUserEntitiesTools.getIdentifiersById({
              _id: resource.meta.creatorEntityId,
              type: 'Profile',
            })
          : undefined

        const resourceOwnerProfileKey = resourceCreatorProfileIds?.entityIdentifier._key
        assignPointsForCollectionsResourceListCuration({
          action: 'remove',
          collectionOwnerProfileKey: profileKey,
          resourceOwnerProfileKey,
        })
      })
      break
    }
    case 'collection-updated-meta': {
      break
    }
    case 'created-web-user-account': {
      deltaPoints({ profileKey: activity.data.profileKey, delta: Points.account.creation })
      break
    }
    case 'deleted-web-user-account': {
      const { profile } = activity.data
      await unpublishAllProfileContributions(profile._key)
      break
    }
    case 'edit-profile-interests': {
      deltaPoints({
        profileKey: activity.data.profileKey,
        delta: Points.engagment.profile.interests.points,
      })
      break
    }
    case 'edit-profile-meta': {
      deltaPoints({
        profileKey: activity.data.profileKey,
      })
      break
    }
    case 'request-send-message-to-web-user': {
      break
    }
    case 'resource-created': {
      break
    }
    case 'resource-downloaded': {
      break
    }
    case 'resource-published': {
      const {
        userId: { _key },
      } = activity.data
      deltaPoints({ profileKey: _key, delta: Points.contribution.resource.publish.creator })
      break
    }
    case 'resource-request-metadata-generation': {
      break
    }
    case 'resource-unpublished': {
      const {
        userId: { _key },
      } = activity.data
      deltaPoints({ profileKey: _key, delta: Points.contribution.resource.unpublish.creator })
      break
    }
    case 'user-publishing-permission-change': {
      const given = activity.data.type === 'given'
      const revoked = activity.data.type === 'revoked'
      const profile = activity.data.profile
      const profileKey = profile._key
      if (revoked) {
        await unpublishAllProfileContributions(profileKey)
      }
      activity.data.profile.knownFeaturedEntities.forEach(({ feature, entityType, _key }) => {
        const delta = given ? 1 : -1
        deltaPopularity(delta, {
          feature,
          entityType,
          entityKey: _key,
        })
      })
      break
    }
    case 'resource-updated-meta': {
      break
    }
    case 'web-user-logged-in': {
      break
    }
  }
}

function unpublishAllProfileContributions(profileKey: string) {
  return shell.initiateCall(async () => {
    const profileIds = WebUserEntitiesTools.getIdentifiersByKey({
      _key: profileKey,
      type: 'Profile',
    })
    await setCurrentSystemUser({
      type: 'entity',
      entityIdentifier: profileIds.entityIdentifier,
      restrictToScopes: false,
    })

    const ownResources = await getProfileOwnKnownEntities({
      knownEntity: 'resource',
      profileKey,
    })
    await Promise.all(
      ownResources
        .filter(res => res.entity.published)
        .map(async res => {
          const [interpreter] = await resourceSrv.stdEdResourceMachine({
            by: 'key',
            key: res.entity._key,
          })
          interpreter.send('unpublish')
          await waitFor(interpreter, resourceDomain.nameMatcher('Unpublished'))
        }),
    )
    const ownCollection = await getProfileOwnKnownEntities({
      knownEntity: 'collection',
      profileKey,
    })
    await Promise.all(
      ownCollection
        .filter(coll => coll.entity.published)
        .map(coll => collectionSrv.setPublished(coll.entity._key, false)),
    )
  })
}

async function removeFeaturedFromAllUsers({ featuredEntityId }: { featuredEntityId: string }) {
  sysEntitiesDB.query(
    `
FOR profile IN \`${Profile.collection.name}\`
  FILTER @featuredEntityId IN profile.knownFeaturedEntities[*]._id
  LET filteredFeats = profile.knownFeaturedEntities[* FILTER CURRENT._id != @featuredEntityId] 
  UPDATE profile WITH { knownFeaturedEntities: filteredFeats } IN \`${Profile.collection.name}\`
`,
    { featuredEntityId },
    { retryOnConflict: 5 },
  )
}
async function removeResourceFromAllCollectionsAndCount({
  resource,
}: {
  resource: EntityFullDocument<ResourceDataType>
}) {
  /*   const cursor = */ await sysEntitiesDB.query<EntityFullDocument<CollectionDataType>>(
    `
FOR collection IN \`${collectionSrv.Collection.collection.name}\`
  FILTER @resourceKey IN collection.resourceList[*]._key
  LET filteredResourceList = collection.resourceList[* FILTER CURRENT._key != @resourceKey] 
  UPDATE collection WITH { resourceList: filteredResourceList } IN \`${collectionSrv.Collection.collection.name}\`
  RETURN NEW
`,
    { resourceKey: resource._key },
    { retryOnConflict: 5 },
  )
  // while (cursor.hasNext) {
  //   const collection = await cursor.next()
  //   if (!collection) {
  //     return
  //   }
  //   const collectionOwnerProfileIds = collection._meta.creatorEntityId
  //     ? WebUserEntitiesTools.getIdentifiersById({
  //         _id: collection._meta.creatorEntityId,
  //         type: 'Profile',
  //       })
  //     : undefined
  //   const resourceOwnerProfileIds = resource._meta.creatorEntityId
  //     ? WebUserEntitiesTools.getIdentifiersById({
  //         _id: resource._meta.creatorEntityId,
  //         type: 'Profile',
  //       })
  //     : undefined

  //   assignPointsForCollectionsResourceListCuration({
  //     action: 'remove',
  //     collectionOwnerProfileKey: collectionOwnerProfileIds?.entityIdentifier._key,
  //     resourceOwnerProfileKey: resourceOwnerProfileIds?.entityIdentifier._key,
  //   })
  // }
}

async function assignPointsForCollectionsResourceListCuration({
  action,
  collectionOwnerProfileKey,
  resourceOwnerProfileKey,
}: {
  action: 'add' | 'remove'
  collectionOwnerProfileKey: string | undefined
  resourceOwnerProfileKey: string | undefined
}) {
  collectionOwnerProfileKey &&
    deltaPoints({
      profileKey: collectionOwnerProfileKey,
      delta: Points.contribution.collection.resourceInCollection[action].collectionCreator,
    })
  resourceOwnerProfileKey &&
    deltaPoints({
      profileKey: resourceOwnerProfileKey,
      delta: Points.contribution.collection.resourceInCollection[action].resourceCreator,
    })
}
