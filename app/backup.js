import { ModuleScreen } from '../components/ModuleScreen';

const MODULE_TITLE = 'Backup';
const MODULE_KEY = 'backup';

export default function Screen() {
  return <ModuleScreen title={MODULE_TITLE} moduleKey={MODULE_KEY} />;
}
