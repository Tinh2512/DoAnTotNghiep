import { COLORS } from '@/constants/config';
import { useSystemControl } from '@/hooks/useSystemControl';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useIsConnected, useSystemStats, useSystemStore } from '@/store/system-store';
import { useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const systemStyles = StyleSheet.create({
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
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.TEXT,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
  connectionStatus: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: COLORS.SURFACE,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  connectionStatusText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusConnected: {
    backgroundColor: COLORS.SUCCESS,
  },
  statusDisconnected: {
    backgroundColor: COLORS.ERROR,
  },
  controlPanel: {
    marginBottom: 24,
  },
  controlButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonStart: {
    backgroundColor: COLORS.SUCCESS,
  },
  buttonStop: {
    backgroundColor: COLORS.ERROR,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.SURFACE,
    padding: 16,
    borderRadius: 12,
    justifyContent: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 8,
    fontWeight: '500',
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
  successRateCard: {
    backgroundColor: COLORS.SURFACE,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  successRateValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.SUCCESS,
    textAlign: 'center',
  },
  successRateLabel: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginTop: 8,
  },
  sessionInfo: {
    backgroundColor: COLORS.SURFACE,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  sessionLabel: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 4,
  },
  sessionValue: {
    fontSize: 16,
    color: COLORS.TEXT,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    backgroundColor: '#FEE',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.ERROR,
    marginBottom: 16,
  },
  errorText: {
    color: COLORS.ERROR,
    fontSize: 14,
  },
});

export default function DashboardScreen() {
  const { startSystem, stopSystem, isLoading, error } = useSystemControl();
  const systemStatus = useSystemStore((state) => state.status);
  const stats = useSystemStats();
  const sessionId = useSystemStore((state) => state.sessionId);
  const isConnected = useIsConnected();
  const [localError, setLocalError] = useState<string | null>(null);

  useWebSocket({
    autoConnect: true,
    onError: (err) => setLocalError(err),
  });

  const handleStart = async () => {
    setLocalError(null);
    try {
      await startSystem();
    } catch (err) {
      console.error('Start system error:', err);
    }
  };

  const handleStop = async () => {
    setLocalError(null);
    try {
      await stopSystem();
    } catch (err) {
      console.error('Stop system error:', err);
    }
  };

  const errorMessage = error?.message || localError;

  return (
    <ScrollView style={systemStyles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={systemStyles.header}>
        <Text style={systemStyles.title}>Dashboard</Text>
        <Text style={systemStyles.subtitle}>Product Classification System</Text>
      </View>

      {/* Connection Status */}
      <View style={systemStyles.connectionStatus}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={[
              systemStyles.statusDot,
              isConnected ? systemStyles.statusConnected : systemStyles.statusDisconnected,
            ]}
          />
          <Text style={systemStyles.connectionStatusText}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </Text>
        </View>
        <Text style={{ fontSize: 12, color: COLORS.TEXT_SECONDARY }}>
          {systemStatus.toUpperCase()}
        </Text>
      </View>

      {/* Error Message */}
      {errorMessage && (
        <View style={systemStyles.errorContainer}>
          <Text style={systemStyles.errorText}>{errorMessage}</Text>
        </View>
      )}

      {/* Control Panel */}
      <View style={systemStyles.controlPanel}>
        <View style={systemStyles.controlButtons}>
          <TouchableOpacity
            style={[systemStyles.button, systemStyles.buttonStart]}
            onPress={handleStart}
            disabled={isLoading || systemStatus === 'RUNNING'}
          >
            {isLoading && systemStatus !== 'RUNNING' ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={systemStyles.buttonText}>Start System</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[systemStyles.button, systemStyles.buttonStop]}
            onPress={handleStop}
            disabled={isLoading || systemStatus === 'STOPPED'}
          >
            {isLoading && systemStatus === 'RUNNING' ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={systemStyles.buttonText}>Stop System</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Session Info */}
      {sessionId && (
        <View style={systemStyles.sessionInfo}>
          <Text style={systemStyles.sessionLabel}>Current Session</Text>
          <Text style={systemStyles.sessionValue}>{sessionId}</Text>
        </View>
      )}

      {/* Success Rate */}
      <View style={systemStyles.successRateCard}>
        <Text style={systemStyles.successRateValue}>
          {stats.successRate.toFixed(1)}%
        </Text>
        <Text style={systemStyles.successRateLabel}>Success Rate</Text>
      </View>

      {/* Statistics Grid */}
      <View style={systemStyles.statsGrid}>
        <View style={systemStyles.statCard}>
          <Text style={systemStyles.statLabel}>Total Products</Text>
          <Text style={systemStyles.statValue}>{stats.totalProducts}</Text>
        </View>

        <View style={systemStyles.statCard}>
          <Text style={systemStyles.statLabel}>Good Products</Text>
          <Text style={[systemStyles.statValue, { color: COLORS.SUCCESS }]}>
            {stats.goodProducts}
          </Text>
        </View>

        <View style={systemStyles.statCard}>
          <Text style={systemStyles.statLabel}>Bad Products</Text>
          <Text style={[systemStyles.statValue, { color: COLORS.ERROR }]}>
            {stats.badProducts}
          </Text>
        </View>

        <View style={systemStyles.statCard}>
          <Text style={systemStyles.statLabel}>Avg Processing</Text>
          <Text style={systemStyles.statValue}>{stats.averageProcessingTime}</Text>
          <Text style={systemStyles.statUnit}>ms</Text>
        </View>
      </View>
    </ScrollView>
  );
}
