import type { Href } from '@moodlenet/component-library'
import { ListCard, SecondaryButton } from '@moodlenet/component-library'
import type { ProxyProps } from '@moodlenet/react-app/ui'
import { Link } from '@moodlenet/react-app/ui'
import { ArrowForwardRounded } from '@mui/icons-material'
import type { FC } from 'react'
import { useMemo } from 'react'
import type { ProfileCardProps } from '../../ProfileCard/ProfileCard.js'
import { ProfileCard } from '../../ProfileCard/ProfileCard.js'
import './LandingProfileList.scss'

export type LandingProfileListProps = {
  searchAuthorsHref: Href
  profilesPropsList: { props: ProxyProps<ProfileCardProps>; key: string }[]
  hasSetInterests: boolean
}

export const LandingProfileList: FC<LandingProfileListProps> = ({
  profilesPropsList,
  searchAuthorsHref,
  hasSetInterests,
}) => {
  const title = (
    <div className="title">{hasSetInterests ? 'Authors selection' : 'Featured authors'}</div>
  )

  const subtitle = (
    <div className="subtitle">
      {hasSetInterests
        ? 'Top contributors you might appreciate'
        : 'Authors with outstanding contributions'}
    </div>
  )

  return (
    <ListCard
      className={`landing-profile-list`}
      content={useMemo(
        () =>
          profilesPropsList
            .slice(0, 11)
            .map(({ key, props }) => ({ key, el: <ProfileCard key={key} {...props} /> })),
        [profilesPropsList],
      )}
      header={
        <div className="card-header">
          <div className="info">
            {title}
            {subtitle}
          </div>
          {null && (
            <SecondaryButton className="more" color="dark-blue">
              <Link href={searchAuthorsHref}>See more authors</Link>
              <ArrowForwardRounded />
            </SecondaryButton>
          )}
        </div>
      }
      noCard={true}
      minGrid={170}
      maxRows={2}
    />
  )
}

LandingProfileList.defaultProps = {}

export default LandingProfileList
