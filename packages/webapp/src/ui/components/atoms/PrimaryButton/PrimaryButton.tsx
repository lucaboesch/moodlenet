import { FC } from 'react'
import './styles.scss'

export type PrimaryButtonProps = {
  onClick?(arg0: unknown): unknown
  className?: string
  disabled?: boolean
  color?: '' | 'green'
  onHoverColor?: '' | 'green' | 'orange'
}

export const PrimaryButton: FC<PrimaryButtonProps> = ({ children, className, color, onHoverColor, onClick, disabled }) => {
  return (
    <div className={`primary-button button ${className} ${disabled ? 'disabled' : ''} ${color} hover-${onHoverColor}`} onClick={!disabled ? onClick : () => {}}>
      {children}
    </div>
  )
}

PrimaryButton.defaultProps = {
  color: '',
  onHoverColor: ''
}

export default PrimaryButton
