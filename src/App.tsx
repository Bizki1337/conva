import { FPSMonitor, Map } from 'src/shared/ui';

import styles from './styles/app.module.scss';

function App() {
  return (
    <div className={styles.wrapper}>
      <FPSMonitor />
      <Map />
    </div>
  );
}

export default App;
