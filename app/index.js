import { Link } from 'expo-router';
import { ScrollView, View, Text, StyleSheet, Pressable } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { dashboardData, products } from '../data/mock';
import { Card } from '../components/Card';
import { BRANDING, getDashboardHeading } from '../constants/branding';

export default function Dashboard() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>{getDashboardHeading()}</Text>
      <Text style={styles.subheading}>{BRANDING.appTagline}</Text>

      <View style={styles.grid}>
        <Card title="Total Revenue" value={dashboardData.revenue} subtitle="+14% this month" />
        <Card title="Today Sales" value={dashboardData.todaySales} subtitle="vs yesterday +9" />
        <Card title="Low Stock Items" value={dashboardData.lowStock} subtitle="Need restock" />
        <Card title="Pending Invoices" value={dashboardData.invoicesPending} subtitle="Awaiting payment" />
      </View>

      <Text style={styles.sectionTitle}>Sales Trend</Text>
      <LineChart
        data={{ labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], datasets: [{ data: [4, 6, 8, 7, 10, 12] }] }}
        width={340}
        height={220}
        chartConfig={{
          backgroundColor: '#12162a',
          backgroundGradientFrom: '#12162a',
          backgroundGradientTo: '#12162a',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(100, 154, 255, ${opacity})`,
          labelColor: () => '#98a1c0',
          propsForDots: { r: '5', strokeWidth: '2', stroke: '#73b1ff' },
        }}
        bezier
        style={styles.chart}
      />

      <Text style={styles.sectionTitle}>Quick Access</Text>
      {[
        ['Inventory', '/inventory'], ['Sales', '/sales'], ['Products', '/products'], ['Categories', '/categories'],
        ['Invoices', '/invoices'], ['Stock Management', '/stock'], ['Analytics', '/analytics'], ['Settings', '/settings'],
        ['Auth', '/auth'], ['Profile', '/profile'], ['Backup', '/backup'], ['Policies', '/policies'],
      ].map(([name, route]) => (
        <Link key={name} href={route} asChild>
          <Pressable style={styles.linkCard}><Text style={styles.linkText}>{name}</Text></Pressable>
        </Link>
      ))}

      <Text style={styles.sectionTitle}>Recent Products</Text>
      {products.map((item) => (
        <View key={item.id} style={styles.productRow}>
          <View>
            <Text style={styles.productTitle}>{item.name}</Text>
            <Text style={styles.productMeta}>{item.sku} • {item.category}</Text>
          </View>
          <View>
            <Text style={styles.productTitle}>{item.price}</Text>
            <Text style={styles.productMeta}>Stock {item.stock}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090d1d' },
  content: { padding: 16, gap: 14 },
  heading: { color: '#fff', fontWeight: '700', fontSize: 28 },
  subheading: { color: '#9ea9ca', fontSize: 14 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  sectionTitle: { color: '#d2dcff', fontSize: 18, fontWeight: '700', marginTop: 8 },
  chart: { borderRadius: 16, marginVertical: 8 },
  linkCard: { backgroundColor: '#141a31', borderRadius: 14, borderWidth: 1, borderColor: '#2b3358', padding: 14 },
  linkText: { color: '#ecf1ff', fontWeight: '600' },
  productRow: { backgroundColor: '#11172d', borderRadius: 14, borderWidth: 1, borderColor: '#253056', padding: 14, flexDirection: 'row', justifyContent: 'space-between' },
  productTitle: { color: '#f2f5ff', fontWeight: '600' },
  productMeta: { color: '#93a0c7', fontSize: 12 },
});
