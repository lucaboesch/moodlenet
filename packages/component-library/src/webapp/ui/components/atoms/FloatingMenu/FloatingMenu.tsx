import React, { FC, KeyboardEvent, ReactElement, useRef, useState } from 'react'
import Card from '../Card/Card.js'
import './FloatingMenu.scss'

export type FloatingMenuContentItem = {
  Icon: ReactElement
  text: string
  key: string
  onClick(): unknown
  className?: string
}

export type FloatingMenuProps = {
  menuContent: React.ReactElement[] | React.ReactElement
  hoverElement: React.ReactNode
  abbr?: string
  hover?: boolean
  className?: string
}

export const FloatingMenu: FC<FloatingMenuProps> = ({
  menuContent,
  className,
  abbr,
  hover,
  hoverElement,
}) => {
  const [currentVisible, setCurrentVisible] = useState<boolean | undefined>(false)
  const hoverElementRef = useRef<HTMLDivElement>(null)
  const [isOnHover, setIsOnHover] = useState<boolean>(false)
  const switchMenu = (e: KeyboardEvent<HTMLDivElement>) => {
    ;['ArrowDown', 'ArrowUp'].includes(e.key) && expand()
    ;['Enter'].includes(e.key) && setCurrentVisible(!currentVisible)
  }
  const closeMenu = (e: KeyboardEvent<HTMLDivElement>) => {
    ;['Tab', 'Enter'].includes(e.key) && e.shiftKey && close()
  }
  const closeMenuUp = (e: KeyboardEvent<HTMLDivElement>) => {
    ;['ArrowUp'].includes(e.key) && close()
    ;['Tab'].includes(e.key) && e.shiftKey && close()
  }
  const closeMenuDown = (e: KeyboardEvent<HTMLDivElement>) => {
    ;['ArrowDown'].includes(e.key) && close()
    ;['Tab'].includes(e.key) && !e.shiftKey && close()
  }
  const oneElementActions = (e: KeyboardEvent<HTMLDivElement>) => {
    closeMenuUp(e)
    closeMenuDown(e)
  }

  const toggle = () => {
    setCurrentVisible(p => !p)
  }

  const expand = () => {
    console.log('Expanding')
    !currentVisible && setCurrentVisible(true)
  }

  const close = () => {
    console.log('Closing')
    currentVisible && setCurrentVisible(false)
  }

  const updatedMenuContent = Array.isArray(menuContent)
    ? menuContent.map((element, i) => {
        if (menuContent.length === 1) {
          return (
            <div
              className={`${element.key}`}
              key={element.key}
              tabIndex={i + 1}
              onKeyDown={oneElementActions}
            >
              {element}
            </div>
          )
        } else if (i === 0) {
          return (
            <div
              className={`${element.key}`}
              key={element.key}
              tabIndex={i + 1}
              onKeyDown={closeMenuUp}
            >
              {element}
            </div>
          )
        } else if (menuContent.length - 1 === i) {
          return (
            <div className={`last element ${element.key}`} key={element.key} tabIndex={i + 1}>
              {element}
            </div>
          )
        } else {
          return (
            <div className={`${element.key}`} key={element.key} tabIndex={i + 1}>
              {element}
            </div>
          )
        }
      })
    : menuContent

  const handleBlur = (e: React.FocusEvent<HTMLDivElement, Element>) => {
    const currentTarget = e.currentTarget

    requestAnimationFrame(() => !currentTarget.contains(document.activeElement) && close())
  }

  const handleOnMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // const currentTarget = e.currentTarget

    // requestAnimationFrame(() => {
    // if (
    //   !(
    //     currentTarget.contains(document.activeElement) && currentTarget !== document.activeElement
    //   )
    // ) {
    console.log('currentVisible ', currentVisible)
    currentVisible ? close() : expand()
    // }
    // })
    e.stopPropagation()
  }

  // useEffect(() => {
  //   hoverElementRef?.current?.setAttribute('inert', '')
  // }, [hoverElementRef])

  return (
    <div
      className={`floating-menu ${className}`}
      onBlur={e => handleBlur(e)}
      onFocus={() => {
        console.log('OnFocus expanding')
        expand()
      }}
      onMouseDown={e => handleOnMouseDown(e)}
      tabIndex={0}
    >
      <abbr
        className="hover-element"
        title={abbr}
        ref={hoverElementRef}
        onKeyUp={switchMenu}
        onKeyDown={closeMenu}
        // onClick={toggle}
        onMouseEnter={() => hover && expand()}
        onMouseLeave={() => hover && close()}
      >
        {hoverElement}
      </abbr>
      <div
        className={`menu ${currentVisible || (hover && isOnHover) ? 'visible' : ''}`}
        role="navigation"
        style={{
          top:
            hoverElementRef.current?.clientHeight && `${hoverElementRef.current?.clientHeight}px`,
        }}
        onMouseEnter={() => hover && setIsOnHover(true)}
        onMouseLeave={() => hover && setIsOnHover(false)}
        onClick={close}
      >
        <Card className="content">{updatedMenuContent}</Card>
      </div>
    </div>
  )
}

FloatingMenu.defaultProps = {
  hover: false,
}
export default FloatingMenu
