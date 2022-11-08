// import { Trans } from '@lingui/macro'
import { Card, Colorpicker, InputTextField, PrimaryButton } from '@moodlenet/component-library'
import { useFormik } from 'formik'
import { FC /* , useContext */, useCallback } from 'react'
import { AppearanceData } from '../../../../../../types.mjs'

import { getColorPalette } from '../../../../styles/utilities.js'
// import { Organization } from '../../../../types'
import './Appearance.scss'

export type AppearanceProps = {
  // organization: Pick<Organization, 'logo' | 'url' | 'smallLogo'>
  form: ReturnType<typeof useFormik<AppearanceData>>
}

export const AppearanceMenu = <span>Appearance</span>

export const Appearance: FC<AppearanceProps> = ({ form }) => {
  // const styleContext = useContext(SettingsCtx)
  // const [logo, setLogo] = useState(true)
  // const [compactLogo, setCompactLogo] = useState(true)

  const setColor = useCallback(
    (color: string) => {
      // styleContext.saveAppearance({ color })
      // styleContext.setStyle({
      const customStyle = {
        ...form.values.customStyle,
        // ...styleContext.style,
        ...getColorPalette(color),
        // '--primary-color': color,
        // '--primary-background-color': setOpacity(color, 0.25),
      }
      form.setValues({ color, customStyle })
    },
    [form],
  )

  // const setStyle = (style: string) => {
  //   // const result = sass.compileString(style)
  //   styleContext.setStyle({
  //     ...styleContext.style,
  //     ...(style as CSSProperties),
  //   })
  // }
  const saveDisabled = !form.dirty || !form.isValid

  return (
    <div className="appearance" key="appearance">
      <Card className="main-card">
        <div className="title">
          {/* <Trans> */}
          Appearance
          {/* </Trans> */}
          <PrimaryButton className="save-btn" type="submit">
            Save
          </PrimaryButton>
        </div>
        <div>
          Manage the look and feel of the platform
          {/* <Trans>Manage the look and feel of the platform</Trans> */}
        </div>
        {/* <Card className="logos">
        <h2>
          <Trans>Logos</Trans>
        </h2>
        <div>
          <h3>Default</h3>
          {logo ? (
            <div className="logo-container">
              <img className="logo big" src={organization.logo} alt="Logo" />
              <SecondaryButton onClick={() => setLogo(false)} color="grey">
                Delete
              </SecondaryButton>
            </div>
          ) : (
            <FileUploader type="image" />
          )}
        </div>
        <div>
          <h3>Compact</h3>
          {compactLogo ? (
            <div className="logo-container">
              <img
                className="logo small"
                src={organization.smallLogo}
                alt="small Logo"
              />
              <SecondaryButton
                onClick={() => setCompactLogo(false)}
                color="grey"
              >
                Delete
              </SecondaryButton>
            </div>
          ) : (
            <FileUploader type="image" />
          )}
        </div>
      </Card> */}
        <div className="color section">
          <div className="subtitle">
            Color
            {/* <Trans>Color</Trans> */}
          </div>
          <div>
            Define the primary color defining the whole color palette
            {/* <Trans>Define the primary color defining the whole color palette</Trans> */}
          </div>
          <div className="field">
            <Colorpicker
              value={form.values.customStyle?.['--primary-color']}
              // value={styleContext.style['--primary-color']}
              onChange={(e: React.FormEvent<HTMLInputElement>) => setColor(e.currentTarget.value)}
            />
            <InputTextField
              edit={true}
              value={form.values.customStyle?.['--primary-color']}
              // value={styleContext.style['--primary-color']}
              onChange={(e: React.FormEvent<HTMLInputElement>) => setColor(e.currentTarget.value)}
            />
          </div>
        </div>
        <div className="scss section">
          <div className="subtitle">
            SCSS
            {/* <Trans>SCSS</Trans> */}
          </div>
          <InputTextField
            textarea={true}
            edit /* onChange={c => setStyle(c.currentTarget.value)} */
          />
        </div>
      </Card>
      <PrimaryButton onClick={form.submitForm} disabled={saveDisabled}>
        Save
      </PrimaryButton>
    </div>
  )
}

export default Appearance
