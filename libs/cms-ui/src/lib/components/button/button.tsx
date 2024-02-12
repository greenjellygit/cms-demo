import { ButtonHTMLAttributes } from 'react'
import styles from './button.module.scss'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: React.ReactNode
}

export function Button({ icon, children, ...rest }: ButtonProps) {
    return (
        <button className={styles.button} type="button" {...rest}>
            {icon}
            {children}
        </button>
    )
}

Button.defaultProps = {
    icon: null,
}

export default Button
