import { View, Text, StyleSheet } from 'react-native';

export default function Screen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sales</Text>
      <Text style={styles.text}>Modern module ready for Supabase-powered sales workflows, CRUD, reporting, and automation.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090d1d', padding: 20, justifyContent: 'center' },
  title: { color: '#fff', fontSize: 30, fontWeight: '700', marginBottom: 14 },
  text: { color: '#a2add0', fontSize: 15, lineHeight: 22 },
});
