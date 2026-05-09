import { View, Text, StyleSheet } from 'react-native';

export function Card({ title, value, subtitle }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
      {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#15192c',
    borderRadius: 18,
    padding: 16,
    minWidth: 160,
    flex: 1,
    borderWidth: 1,
    borderColor: '#2a3150',
  },
  title: { color: '#8e97ba', fontSize: 12, marginBottom: 10 },
  value: { color: '#fff', fontWeight: '700', fontSize: 20, marginBottom: 6 },
  subtitle: { color: '#7f89a8', fontSize: 12 },
});
