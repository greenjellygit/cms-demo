import { WelcomeText } from '@cms/ui'
import styles from './App.module.scss'

export function App() {
    return (
        <div className={styles.test}>
            <h1 className={styles.bla}>
                <span> Hello there cms-web! 👋</span>
                <WelcomeText name="John" />
            </h1>
        </div>
    )
}

export default App
