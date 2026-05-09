import { ModuleScreen } from '../components/ModuleScreen';

const MODULE_TITLE = 'Inventory';
const MODULE_KEY = 'inventory';

export default function Screen() {
  return <ModuleScreen title={MODULE_TITLE} moduleKey={MODULE_KEY} />;
}
