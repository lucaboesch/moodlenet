import { href } from '@moodlenet/react-app/common'
import { HeaderRightComponentRegItem } from '@moodlenet/react-app/ui'
import {
  ReactAppContext,
  ReactAppMainComponent,
  RouteRegItem,
  SettingsSectionItem,
  usePkgContext,
} from '@moodlenet/react-app/webapp'
import { useContext, useMemo } from 'react'

import { MyPkgContext } from '../common/my-webapp/types.mjs'
import { AuthCtx, useAuthCtx } from './context/AuthContext.js'
import { MainContext, MainContextT } from './context/MainContext.mjs'
import { getAccessButtons } from './exports/ui.mjs'
import { useMakeRegistries } from './registries.mjs'
import { routes } from './routes.js'
import { AddMenuContainer } from './ui/components/molecules/AddMenu/AddMenuContainer.js'
import { AvatarMenuContainer } from './ui/components/molecules/AvatarMenu/AvatarMenuContainer.js'
import { UsersContainer } from './ui/components/organisms/Roles/UsersContainer.js'
const routeRegItem: RouteRegItem = { routes }
const settingsSectionItem: SettingsSectionItem = {
  Content: UsersContainer,
  Menu: () => <span>Users</span>,
}

const avatarMenuItem: HeaderRightComponentRegItem = { Component: AvatarMenuContainer }
const addMenuItem: HeaderRightComponentRegItem = { Component: AddMenuContainer }
const accessButtons = getAccessButtons({ loginHref: href('/login'), signupHref: href('/signup') })
const accessButtonsHeaderItem: HeaderRightComponentRegItem = {
  Component: () => (
    <>
      {accessButtons.map(({ Item, key }) => (
        <Item key={key} />
      ))}
    </>
  ),
}

const MainComponent: ReactAppMainComponent = ({ children }) => {
  const pkgContext = usePkgContext<MyPkgContext>()
  const registries = useMakeRegistries()
  const mainContext = useMemo<MainContextT>(() => {
    const ctx: MainContextT = {
      ...pkgContext,
      registries,
    }
    return ctx
  }, [pkgContext, registries])
  const authCtx = useAuthCtx(registries, mainContext)
  const reactAppCtx = useContext(ReactAppContext)
  reactAppCtx.registries.rightComponents.useRegister(addMenuItem, {
    condition: !!authCtx?.isAuthenticated && !authCtx.clientSessionData.isRoot,
  })
  reactAppCtx.registries.rightComponents.useRegister(avatarMenuItem, {
    condition: !!authCtx?.isAuthenticated,
  })
  reactAppCtx.registries.rightComponents.useRegister(accessButtonsHeaderItem, {
    condition: !authCtx?.isAuthenticated,
  })

  reactAppCtx.registries.settingsSections.useRegister(settingsSectionItem)
  reactAppCtx.registries.routes.useRegister(routeRegItem)

  return (
    authCtx && (
      <MainContext.Provider value={mainContext}>
        <AuthCtx.Provider value={authCtx}>{children}</AuthCtx.Provider>
      </MainContext.Provider>
    )
  )
}
export default MainComponent
