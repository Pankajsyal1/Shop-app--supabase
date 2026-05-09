import { ModuleScreen } from '../components/ModuleScreen';

const MODULE_TITLE = 'Stock';
const MODULE_KEY = 'stock';

export default function Screen() {
  return <ModuleScreen title={MODULE_TITLE} moduleKey={MODULE_KEY} />;
}
