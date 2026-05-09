import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/theme';

const MODULE_DESCRIPTION_TEMPLATE =
  'Modern module ready for Supabase-powered %s workflows, CRUD, reporting, and automation.';

export function ModuleScreen({ title, moduleKey }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.text}>{formatModuleDescription(moduleKey)}</Text>
    </View>
  );
}

function formatModuleDescription(moduleKey) {
  return MODULE_DESCRIPTION_TEMPLATE.replace('%s', moduleKey);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.pagePadding,
    justifyContent: 'center',
  },
  title: {
    color: COLORS.title,
    fontSize: TYPOGRAPHY.pageTitleSize,
    fontWeight: '700',
    marginBottom: SPACING.titleBottom,
  },
  text: {
    color: COLORS.body,
    fontSize: TYPOGRAPHY.bodySize,
    lineHeight: TYPOGRAPHY.bodyLineHeight,
  },
});
