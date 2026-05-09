import { ModuleScreen } from '../components/ModuleScreen';

const MODULE_TITLE = 'Profile';
const MODULE_KEY = 'profile';

export default function Screen() {
  return <ModuleScreen title={MODULE_TITLE} moduleKey={MODULE_KEY} />;
}
