import { COLORS } from '@/constants/config';
import { useProducts } from '@/store/product-store';
import { useSystemStats } from '@/store/system-store';
import {
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';

const statisticsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    padding: 16,
  },
  header: {
    marginTop: 16,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.TEXT,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
  },
  statsContainer: {
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: COLORS.SURFACE,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  statCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statInfo: {
    flex: 1,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.TEXT,
  },
  statUnit: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 4,
  },
  statBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: COLORS.BACKGROUND,
  },
  statBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT,
  },
  chartContainer: {
    backgroundColor: COLORS.SURFACE,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT,
    marginBottom: 16,
  },
  barChart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 200,
    marginBottom: 16,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 40,
    backgroundColor: COLORS.SUCCESS,
    borderRadius: 8,
    marginBottom: 8,
  },
  barBad: {
    backgroundColor: COLORS.ERROR,
  },
  barLabel: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 8,
  },
  barValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT,
    marginBottom: 4,
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  legendLabel: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
  },
  timelineContainer: {
    backgroundColor: COLORS.SURFACE,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT,
    marginBottom: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  timelineInfo: {
    flex: 1,
  },
  timelineTime: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 4,
  },
  timelineText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.TEXT,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.SURFACE,
    padding: 16,
    borderRadius: 12,
  },
  summaryLabel: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.TEXT,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
});

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

export default function StatisticsScreen() {
  const stats = useSystemStats();
  const products = useProducts();

  const maxProducts = Math.max(stats.goodProducts, stats.badProducts, 1);

  return (
    <ScrollView style={statisticsStyles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={statisticsStyles.header}>
        <Text style={statisticsStyles.title}>Statistics</Text>
        <Text style={statisticsStyles.subtitle}>Product Classification Analytics</Text>
      </View>

      {/* Summary Grid */}
      <View style={statisticsStyles.summaryGrid}>
        <View style={statisticsStyles.summaryCard}>
          <Text style={statisticsStyles.summaryLabel}>Total Products</Text>
          <Text style={statisticsStyles.summaryValue}>{stats.totalProducts}</Text>
        </View>

        <View style={statisticsStyles.summaryCard}>
          <Text style={statisticsStyles.summaryLabel}>Success Rate</Text>
          <Text style={[statisticsStyles.summaryValue, { color: COLORS.SUCCESS }]}>
            {stats.successRate.toFixed(1)}%
          </Text>
        </View>

        <View style={statisticsStyles.summaryCard}>
          <Text style={statisticsStyles.summaryLabel}>Good Products</Text>
          <Text style={[statisticsStyles.summaryValue, { color: COLORS.SUCCESS }]}>
            {stats.goodProducts}
          </Text>
        </View>

        <View style={statisticsStyles.summaryCard}>
          <Text style={statisticsStyles.summaryLabel}>Bad Products</Text>
          <Text style={[statisticsStyles.summaryValue, { color: COLORS.ERROR }]}>
            {stats.badProducts}
          </Text>
        </View>
      </View>

      {/* Classification Chart */}
      {stats.totalProducts > 0 && (
        <View style={statisticsStyles.chartContainer}>
          <Text style={statisticsStyles.chartTitle}>Product Distribution</Text>

          <View style={statisticsStyles.barChart}>
            <View style={statisticsStyles.barContainer}>
              <Text style={statisticsStyles.barValue}>{stats.goodProducts}</Text>
              <View
                style={[
                  statisticsStyles.bar,
                  {
                    height: (stats.goodProducts / maxProducts) * 150,
                  },
                ]}
              />
              <Text style={statisticsStyles.barLabel}>Good</Text>
            </View>

            <View style={statisticsStyles.barContainer}>
              <Text style={statisticsStyles.barValue}>{stats.badProducts}</Text>
              <View
                style={[
                  statisticsStyles.bar,
                  statisticsStyles.barBad,
                  {
                    height: (stats.badProducts / maxProducts) * 150,
                  },
                ]}
              />
              <Text style={statisticsStyles.barLabel}>Bad</Text>
            </View>
          </View>

          <View style={statisticsStyles.chartLegend}>
            <View style={statisticsStyles.legendItem}>
              <View style={[statisticsStyles.legendColor, { backgroundColor: COLORS.SUCCESS }]} />
              <Text style={statisticsStyles.legendLabel}>Good Products</Text>
            </View>
            <View style={statisticsStyles.legendItem}>
              <View style={[statisticsStyles.legendColor, { backgroundColor: COLORS.ERROR }]} />
              <Text style={statisticsStyles.legendLabel}>Bad Products</Text>
            </View>
          </View>
        </View>
      )}

      {/* Performance Metrics */}
      <View style={statisticsStyles.statsContainer}>
        <View style={statisticsStyles.statCard}>
          <View style={statisticsStyles.statCardRow}>
            <View style={statisticsStyles.statInfo}>
              <Text style={statisticsStyles.statLabel}>Average Processing Time</Text>
              <Text style={statisticsStyles.statValue}>
                {stats.averageProcessingTime.toFixed(0)}
              </Text>
              <Text style={statisticsStyles.statUnit}>milliseconds</Text>
            </View>
            <View style={statisticsStyles.statBadge}>
              <Text style={statisticsStyles.statBadgeText}>
                {stats.totalProducts > 0 ? '✓' : '—'}
              </Text>
            </View>
          </View>
        </View>

        <View style={statisticsStyles.statCard}>
          <View style={statisticsStyles.statCardRow}>
            <View style={statisticsStyles.statInfo}>
              <Text style={statisticsStyles.statLabel}>Session Duration</Text>
              <Text style={statisticsStyles.statValue}>
                {Math.floor(stats.sessionDuration / 1000 / 60)}
              </Text>
              <Text style={statisticsStyles.statUnit}>minutes</Text>
            </View>
            <View style={statisticsStyles.statBadge}>
              <Text style={statisticsStyles.statBadgeText}>
                {stats.sessionDuration > 0 ? '✓' : '—'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Recent Products Timeline */}
      {products.length > 0 && (
        <View style={statisticsStyles.timelineContainer}>
          <Text style={statisticsStyles.timelineTitle}>Recent Products</Text>

          {products.slice(0, 5).map((product) => (
            <View key={product.id} style={statisticsStyles.timelineItem}>
              <View
                style={[
                  statisticsStyles.timelineDot,
                  {
                    backgroundColor:
                      product.classification === 'GOOD'
                        ? COLORS.SUCCESS
                        : COLORS.ERROR,
                  },
                ]}
              />
              <View style={statisticsStyles.timelineInfo}>
                <Text style={statisticsStyles.timelineTime}>
                  {formatTime(product.timestamp)}
                </Text>
                <Text style={statisticsStyles.timelineText}>
                  {product.classification} - {(product.confidence * 100).toFixed(0)}%
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
