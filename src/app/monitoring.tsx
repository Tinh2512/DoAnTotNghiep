import { COLORS } from '@/constants/config';
import { useCurrentProduct, useProducts } from '@/store/product-store';
import { useState } from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const monitoringStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.TEXT,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 4,
  },
  currentProductSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  currentProductCard: {
    backgroundColor: COLORS.SURFACE,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  classificationBadge: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  classificationGood: {
    backgroundColor: '#E8F5E9',
  },
  classificationBad: {
    backgroundColor: '#FFEBEE',
  },
  classificationText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  classificationGoodText: {
    color: COLORS.SUCCESS,
  },
  classificationBadText: {
    color: COLORS.ERROR,
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  confidenceLabel: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
  },
  confidenceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT,
  },
  imagesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  imagesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT,
    marginBottom: 12,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  imageThumbnail: {
    width: Dimensions.get('window').width / 2.5,
    height: Dimensions.get('window').width / 2.5,
    borderRadius: 8,
    backgroundColor: COLORS.BORDER,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  productInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  productInfoLabel: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
  },
  productInfoValue: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.TEXT,
  },
  productsList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  productsListTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT,
    marginBottom: 12,
  },
  productItem: {
    backgroundColor: COLORS.SURFACE,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 4,
  },
  productItemGood: {
    borderLeftColor: COLORS.SUCCESS,
  },
  productItemBad: {
    borderLeftColor: COLORS.ERROR,
  },
  productItemInfo: {
    flex: 1,
  },
  productItemId: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT,
  },
  productItemTime: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 4,
  },
  productItemBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  productItemBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
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
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
};

export default function MonitoringScreen() {
  const currentProduct = useCurrentProduct();
  const products = useProducts();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <View style={monitoringStyles.container}>
      <View style={monitoringStyles.header}>
        <Text style={monitoringStyles.headerTitle}>Monitoring</Text>
        <Text style={monitoringStyles.headerSubtitle}>Real-time Product Classification</Text>
      </View>

      {currentProduct ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Current Product */}
          <View style={monitoringStyles.currentProductSection}>
            <View style={monitoringStyles.currentProductCard}>
              <View
                style={[
                  monitoringStyles.classificationBadge,
                  currentProduct.classification === 'GOOD'
                    ? monitoringStyles.classificationGood
                    : monitoringStyles.classificationBad,
                ]}
              >
                <Text
                  style={[
                    monitoringStyles.classificationText,
                    currentProduct.classification === 'GOOD'
                      ? monitoringStyles.classificationGoodText
                      : monitoringStyles.classificationBadText,
                  ]}
                >
                  {currentProduct.classification}
                </Text>
                <View style={monitoringStyles.confidenceContainer}>
                  <Text style={monitoringStyles.confidenceLabel}>Confidence:</Text>
                  <Text style={monitoringStyles.confidenceValue}>
                    {(currentProduct.confidence * 100).toFixed(1)}%
                  </Text>
                </View>
              </View>

              <View style={monitoringStyles.productInfoRow}>
                <View>
                  <Text style={monitoringStyles.productInfoLabel}>Product ID</Text>
                  <Text style={monitoringStyles.productInfoValue}>{currentProduct.id}</Text>
                </View>
                <View>
                  <Text style={monitoringStyles.productInfoLabel}>Time</Text>
                  <Text style={monitoringStyles.productInfoValue}>
                    {formatTime(currentProduct.timestamp)}
                  </Text>
                </View>
                <View>
                  <Text style={monitoringStyles.productInfoLabel}>Processing</Text>
                  <Text style={monitoringStyles.productInfoValue}>
                    {currentProduct.processingTime}ms
                  </Text>
                </View>
              </View>

              {/* Images */}
              {currentProduct.images && currentProduct.images.length > 0 && (
                <View style={monitoringStyles.imagesContainer}>
                  <Text style={monitoringStyles.imagesTitle}>
                    Captured Images ({currentProduct.images.length})
                  </Text>
                  <View style={monitoringStyles.imageGrid}>
                    {currentProduct.images.map((image, index) => (
                      <TouchableOpacity
                        key={index}
                        style={monitoringStyles.imageThumbnail}
                        onPress={() => setSelectedImage(image)}
                      >
                        <Image
                          source={{ uri: `data:image/jpeg;base64,${image}` }}
                          style={monitoringStyles.image}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Products History */}
          {products.length > 0 && (
            <View style={monitoringStyles.productsList}>
              <Text style={monitoringStyles.productsListTitle}>
                Recent Products ({products.length})
              </Text>
              <FlatList
                scrollEnabled={false}
                data={products.slice(1, 6)} // Show last 5 excluding current
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View
                    style={[
                      monitoringStyles.productItem,
                      item.classification === 'GOOD'
                        ? monitoringStyles.productItemGood
                        : monitoringStyles.productItemBad,
                    ]}
                  >
                    <View style={monitoringStyles.productItemInfo}>
                      <Text style={monitoringStyles.productItemId}>{item.id}</Text>
                      <Text style={monitoringStyles.productItemTime}>
                        {formatTime(item.timestamp)}
                      </Text>
                    </View>
                    <View
                      style={[
                        monitoringStyles.productItemBadge,
                        {
                          backgroundColor:
                            item.classification === 'GOOD'
                              ? COLORS.SUCCESS
                              : COLORS.ERROR,
                        },
                      ]}
                    >
                      <Text style={monitoringStyles.productItemBadgeText}>
                        {(item.confidence * 100).toFixed(0)}%
                      </Text>
                    </View>
                  </View>
                )}
              />
            </View>
          )}
        </ScrollView>
      ) : (
        <View style={monitoringStyles.emptyState}>
          <Text style={monitoringStyles.emptyStateText}>
            No products classified yet. Start the system to begin monitoring.
          </Text>
        </View>
      )}
    </View>
  );
}
