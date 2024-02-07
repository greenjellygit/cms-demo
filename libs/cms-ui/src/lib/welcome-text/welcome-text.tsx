import styles from './welcome-text.module.scss'

/* eslint-disable-next-line */
export interface WelcomeTextProps {
    name: string
}

export function WelcomeText({ name }: WelcomeTextProps) {
    return (
        <div className={styles.container}>
            <h1>Welcome dear {name}.</h1>
        </div>
    )
}

export default WelcomeText
