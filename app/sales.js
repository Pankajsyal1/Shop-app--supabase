import { ModuleScreen } from '../components/ModuleScreen';

const MODULE_TITLE = 'Sales';
const MODULE_KEY = 'sales';

export default function Screen() {
  return <ModuleScreen title={MODULE_TITLE} moduleKey={MODULE_KEY} />;
}
