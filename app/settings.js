import { ModuleScreen } from '../components/ModuleScreen';

const MODULE_TITLE = 'Settings';
const MODULE_KEY = 'settings';

export default function Screen() {
  return <ModuleScreen title={MODULE_TITLE} moduleKey={MODULE_KEY} />;
}
