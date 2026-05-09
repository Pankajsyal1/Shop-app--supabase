export const BRANDING = {
  appName: 'RetailFlow',
  appTagline: 'Inventory, sales, invoicing, analytics and operations in one place.',
  dashboardTitleSuffix: 'Dashboard',
  packageName: 'retailflow-whitelabel',
  expo: {
    slug: 'retailflow-whitelabel',
    scheme: 'retailflow',
  },
};

export function getDashboardHeading() {
  return `${BRANDING.appName} ${BRANDING.dashboardTitleSuffix}`;
}
