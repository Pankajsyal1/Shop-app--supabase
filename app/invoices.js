import { ModuleScreen } from '../components/ModuleScreen';

const MODULE_TITLE = 'Invoices';
const MODULE_KEY = 'invoices';

export default function Screen() {
  return <ModuleScreen title={MODULE_TITLE} moduleKey={MODULE_KEY} />;
}
