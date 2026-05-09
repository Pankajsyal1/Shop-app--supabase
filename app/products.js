import { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView } from 'react-native';
import { products } from '../data/mock';
import { Card } from '../components/Card';

const STOCK_FILTERS = ['All', 'Low Stock', 'In Stock'];
const SORT_OPTIONS = ['Name (A-Z)', 'Price (High-Low)', 'Stock (Low-High)'];

const parsePrice = (price) => {
  const numericPrice = Number.parseFloat(String(price).replace(/[^0-9.-]+/g, ''));
  return Number.isNaN(numericPrice) ? 0 : numericPrice;
};

export default function Screen() {
  const [query, setQuery] = useState('');
  const [stockFilter, setStockFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Name (A-Z)');

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return [...products]
      .filter((item) => {
        const matchQuery =
          !normalizedQuery ||
          item.name.toLowerCase().includes(normalizedQuery) ||
          item.sku.toLowerCase().includes(normalizedQuery) ||
          item.category.toLowerCase().includes(normalizedQuery);

        const matchStock =
          stockFilter === 'All' ||
          (stockFilter === 'Low Stock' && item.stock <= 10) ||
          (stockFilter === 'In Stock' && item.stock > 10);

        return matchQuery && matchStock;
      })
      .sort((a, b) => {
        if (sortBy === 'Price (High-Low)') {
          const priceA = parsePrice(a.price);
          const priceB = parsePrice(b.price);
          return priceB - priceA;
        }

        if (sortBy === 'Stock (Low-High)') {
          return a.stock - b.stock;
        }

        return a.name.localeCompare(b.name);
      });
  }, [query, stockFilter, sortBy]);

  const stats = useMemo(() => {
    const totalProducts = filteredProducts.length;
    const lowStockCount = filteredProducts.filter((item) => item.stock <= 10).length;
    const categories = new Set(filteredProducts.map((item) => item.category)).size;

    return { totalProducts, lowStockCount, categories };
  }, [filteredProducts]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Products</Text>
      <Text style={styles.text}>Browse your catalog, spot low-stock items, and search quickly across SKU, name, and category.</Text>

      <TextInput
        placeholder="Search by product name, SKU, or category"
        placeholderTextColor="#7d88ad"
        value={query}
        onChangeText={setQuery}
        style={styles.input}
      />

      <View style={styles.filterRow}>
        {STOCK_FILTERS.map((item) => {
          const active = item === stockFilter;
          return (
            <Pressable key={item} onPress={() => setStockFilter(item)} style={[styles.filterBtn, active && styles.filterBtnActive]}>
              <Text style={[styles.filterText, active && styles.filterTextActive]}>{item}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.filterRow}>
        {SORT_OPTIONS.map((item) => {
          const active = item === sortBy;
          return (
            <Pressable key={item} onPress={() => setSortBy(item)} style={[styles.filterBtn, active && styles.filterBtnActive]}>
              <Text style={[styles.filterText, active && styles.filterTextActive]}>{item}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.grid}>
        <Card title="Visible Products" value={stats.totalProducts} subtitle="After filtering" />
        <Card title="Low Stock" value={stats.lowStockCount} subtitle="10 units or less" />
        <Card title="Categories" value={stats.categories} subtitle="Unique segments" />
      </View>

      {filteredProducts.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No products found</Text>
          <Text style={styles.emptyText}>Try changing the stock filter or search keywords.</Text>
        </View>
      ) : (
        filteredProducts.map((item) => (
          <View key={item.id} style={styles.row}>
            <View>
              <Text style={styles.productTitle}>{item.name}</Text>
              <Text style={styles.productMeta}>{item.sku} • {item.category}</Text>
            </View>
            <View style={styles.alignEnd}>
              <Text style={styles.productTitle}>{item.price}</Text>
              <Text style={[styles.productMeta, item.stock <= 10 && styles.lowStock]}>Stock {item.stock}</Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090d1d' },
  content: { padding: 20, gap: 12 },
  title: { color: '#fff', fontSize: 30, fontWeight: '700' },
  text: { color: '#a2add0', fontSize: 15, lineHeight: 22 },
  input: {
    backgroundColor: '#121730',
    borderColor: '#2a3359',
    borderWidth: 1,
    borderRadius: 12,
    color: '#edf2ff',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  filterRow: { flexDirection: 'row', gap: 8, marginBottom: 4 },
  filterBtn: { borderRadius: 999, borderWidth: 1, borderColor: '#2b355c', paddingHorizontal: 12, paddingVertical: 8 },
  filterBtnActive: { backgroundColor: '#2a3c7f', borderColor: '#4b68c7' },
  filterText: { color: '#a5b0d5', fontSize: 13, fontWeight: '600' },
  filterTextActive: { color: '#eff3ff' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 6 },
  row: {
    backgroundColor: '#11172d',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#253056',
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  alignEnd: { alignItems: 'flex-end' },
  productTitle: { color: '#f2f5ff', fontWeight: '600' },
  productMeta: { color: '#93a0c7', fontSize: 12 },
  lowStock: { color: '#ffb3b3' },
  emptyState: { backgroundColor: '#11172d', borderRadius: 14, borderWidth: 1, borderColor: '#253056', padding: 16 },
  emptyTitle: { color: '#e6ebff', fontWeight: '700', marginBottom: 6 },
  emptyText: { color: '#93a0c7' },
});
