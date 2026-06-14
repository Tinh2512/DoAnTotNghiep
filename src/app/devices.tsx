import { COLORS } from '@/constants/config';
import { useDeviceStatus, useSystemStore } from '@/store/system-store';
import { useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const deviceStyles = StyleSheet.create({
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
  deviceCard: {
    backgroundColor: COLORS.SURFACE,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  deviceCardConnected: {
    borderLeftColor: COLORS.SUCCESS,
  },
  deviceCardDisconnected: {
    borderLeftColor: COLORS.ERROR,
  },
  deviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusBadgeConnected: {
    backgroundColor: '#E8F5E9',
  },
  statusBadgeDisconnected: {
    backgroundColor: '#FFEBEE',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusConnectedText: {
    color: COLORS.SUCCESS,
  },
  statusDisconnectedText: {
    color: COLORS.ERROR,
  },
  deviceInfo: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  infoLabel: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    flex: 1,
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.TEXT,
    flex: 1,
    textAlign: 'right',
  },
  servoContainer: {
    gap: 8,
  },
  servoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  servoLabel: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
  },
  servoBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  servoActive: {
    backgroundColor: '#E8F5E9',
  },
  servoInactive: {
    backgroundColor: '#F5F5F5',
  },
  servoBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  servoActiveText: {
    color: COLORS.SUCCESS,
  },
  servoInactiveText: {
    color: COLORS.TEXT_SECONDARY,
  },
  lastUpdate: {
    fontSize: 10,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 8,
    fontStyle: 'italic',
  },
  refreshButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
});

const formatTime = (timestamp: number) => {
  const now = Date.now();
  const diff = now - timestamp;

  if (diff < 1000) return 'Just now';
  if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`;
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  return `${Math.floor(diff / 3600000)}h ago`;
};

export default function DeviceStatusScreen() {
  const devices = useDeviceStatus();
  const [refreshing, setRefreshing] = useState(false);
  const systemStore = useSystemStore();

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Simulate refresh - in a real app, this would fetch from API
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <ScrollView style={deviceStyles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={deviceStyles.header}>
        <Text style={deviceStyles.title}>Devices</Text>
        <Text style={deviceStyles.subtitle}>System Components Status</Text>
      </View>

      {/* Raspberry Pi */}
      {devices.raspberryPi && (
        <View
          style={[
            deviceStyles.deviceCard,
            devices.raspberryPi.status === 'CONNECTED'
              ? deviceStyles.deviceCardConnected
              : deviceStyles.deviceCardDisconnected,
          ]}
        >
          <View style={deviceStyles.deviceHeader}>
            <Text style={deviceStyles.deviceName}>{devices.raspberryPi.name}</Text>
            <View
              style={[
                deviceStyles.statusBadge,
                devices.raspberryPi.status === 'CONNECTED'
                  ? deviceStyles.statusBadgeConnected
                  : deviceStyles.statusBadgeDisconnected,
              ]}
            >
              <View
                style={[
                  deviceStyles.statusDot,
                  {
                    backgroundColor:
                      devices.raspberryPi.status === 'CONNECTED'
                        ? COLORS.SUCCESS
                        : COLORS.ERROR,
                  },
                ]}
              />
              <Text
                style={[
                  deviceStyles.statusText,
                  devices.raspberryPi.status === 'CONNECTED'
                    ? deviceStyles.statusConnectedText
                    : deviceStyles.statusDisconnectedText,
                ]}
              >
                {devices.raspberryPi.status}
              </Text>
            </View>
          </View>

          <View style={deviceStyles.deviceInfo}>
            <View style={deviceStyles.infoRow}>
              <Text style={deviceStyles.infoLabel}>CPU Usage</Text>
              <Text style={deviceStyles.infoValue}>
                {(devices.raspberryPi.data?.cpu as number) || 0}%
              </Text>
            </View>
            <View style={deviceStyles.infoRow}>
              <Text style={deviceStyles.infoLabel}>Memory Usage</Text>
              <Text style={deviceStyles.infoValue}>
                {(devices.raspberryPi.data?.memory as number) || 0}%
              </Text>
            </View>
            <View style={deviceStyles.infoRow}>
              <Text style={deviceStyles.infoLabel}>Temperature</Text>
              <Text style={deviceStyles.infoValue}>
                {(devices.raspberryPi.data?.temperature as number) || 0}°C
              </Text>
            </View>
            <View style={deviceStyles.infoRow}>
              <Text style={deviceStyles.infoLabel}>Uptime</Text>
              <Text style={deviceStyles.infoValue}>
                {formatTime(devices.raspberryPi.lastUpdate)}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* ESP32 */}
      {devices.esp32 && (
        <View
          style={[
            deviceStyles.deviceCard,
            devices.esp32.status === 'CONNECTED'
              ? deviceStyles.deviceCardConnected
              : deviceStyles.deviceCardDisconnected,
          ]}
        >
          <View style={deviceStyles.deviceHeader}>
            <Text style={deviceStyles.deviceName}>{devices.esp32.name}</Text>
            <View
              style={[
                deviceStyles.statusBadge,
                devices.esp32.status === 'CONNECTED'
                  ? deviceStyles.statusBadgeConnected
                  : deviceStyles.statusBadgeDisconnected,
              ]}
            >
              <View
                style={[
                  deviceStyles.statusDot,
                  {
                    backgroundColor:
                      devices.esp32.status === 'CONNECTED'
                        ? COLORS.SUCCESS
                        : COLORS.ERROR,
                  },
                ]}
              />
              <Text
                style={[
                  deviceStyles.statusText,
                  devices.esp32.status === 'CONNECTED'
                    ? deviceStyles.statusConnectedText
                    : deviceStyles.statusDisconnectedText,
                ]}
              >
                {devices.esp32.status}
              </Text>
            </View>
          </View>

          <View style={deviceStyles.deviceInfo}>
            <View style={deviceStyles.infoRow}>
              <Text style={deviceStyles.infoLabel}>Signal Strength</Text>
              <Text style={deviceStyles.infoValue}>
                {(devices.esp32.data?.signalStrength as number) || 0} dBm
              </Text>
            </View>
            <View style={deviceStyles.infoRow}>
              <Text style={deviceStyles.infoLabel}>IP Address</Text>
              <Text style={deviceStyles.infoValue}>
                {(devices.esp32.ipAddress as string) || 'N/A'}
              </Text>
            </View>
            <View style={deviceStyles.infoRow}>
              <Text style={deviceStyles.infoLabel}>Last Update</Text>
              <Text style={deviceStyles.infoValue}>{formatTime(devices.esp32.lastUpdate)}</Text>
            </View>
          </View>
        </View>
      )}

      {/* Servos */}
      <View
        style={[
          deviceStyles.deviceCard,
          devices.servos
            ? deviceStyles.deviceCardConnected
            : deviceStyles.deviceCardDisconnected,
        ]}
      >
        <View style={deviceStyles.deviceHeader}>
          <Text style={deviceStyles.deviceName}>Servo Motors</Text>
          <View style={[deviceStyles.statusBadge, deviceStyles.statusBadgeConnected]}>
            <View style={[deviceStyles.statusDot, { backgroundColor: COLORS.SUCCESS }]} />
            <Text style={[deviceStyles.statusText, deviceStyles.statusConnectedText]}>
              CONNECTED
            </Text>
          </View>
        </View>

        <View style={deviceStyles.servoContainer}>
          <View style={deviceStyles.servoItem}>
            <Text style={deviceStyles.servoLabel}>Feeder Servo</Text>
            <View
              style={[
                deviceStyles.servoBadge,
                devices.servos?.feeder ? deviceStyles.servoActive : deviceStyles.servoInactive,
              ]}
            >
              <Text
                style={[
                  deviceStyles.servoBadgeText,
                  devices.servos?.feeder
                    ? deviceStyles.servoActiveText
                    : deviceStyles.servoInactiveText,
                ]}
              >
                {devices.servos?.feeder ? 'ACTIVE' : 'INACTIVE'}
              </Text>
            </View>
          </View>

          <View style={deviceStyles.servoItem}>
            <Text style={deviceStyles.servoLabel}>Good Sorter Servo</Text>
            <View
              style={[
                deviceStyles.servoBadge,
                devices.servos?.goodSorter ? deviceStyles.servoActive : deviceStyles.servoInactive,
              ]}
            >
              <Text
                style={[
                  deviceStyles.servoBadgeText,
                  devices.servos?.goodSorter
                    ? deviceStyles.servoActiveText
                    : deviceStyles.servoInactiveText,
                ]}
              >
                {devices.servos?.goodSorter ? 'ACTIVE' : 'INACTIVE'}
              </Text>
            </View>
          </View>

          <View style={deviceStyles.servoItem}>
            <Text style={deviceStyles.servoLabel}>Bad Sorter Servo</Text>
            <View
              style={[
                deviceStyles.servoBadge,
                devices.servos?.badSorter ? deviceStyles.servoActive : deviceStyles.servoInactive,
              ]}
            >
              <Text
                style={[
                  deviceStyles.servoBadgeText,
                  devices.servos?.badSorter
                    ? deviceStyles.servoActiveText
                    : deviceStyles.servoInactiveText,
                ]}
              >
                {devices.servos?.badSorter ? 'ACTIVE' : 'INACTIVE'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Conveyor Belt */}
      <View
        style={[
          deviceStyles.deviceCard,
          devices.conveyorBelt
            ? deviceStyles.deviceCardConnected
            : deviceStyles.deviceCardDisconnected,
        ]}
      >
        <View style={deviceStyles.deviceHeader}>
          <Text style={deviceStyles.deviceName}>Conveyor Belt</Text>
          <View style={[deviceStyles.statusBadge, deviceStyles.statusBadgeConnected]}>
            <View style={[deviceStyles.statusDot, { backgroundColor: COLORS.SUCCESS }]} />
            <Text style={[deviceStyles.statusText, deviceStyles.statusConnectedText]}>
              CONNECTED
            </Text>
          </View>
        </View>

        <View style={deviceStyles.deviceInfo}>
          <View style={deviceStyles.infoRow}>
            <Text style={deviceStyles.infoLabel}>Status</Text>
            <Text style={deviceStyles.infoValue}>
              {devices.conveyorBelt?.running ? 'RUNNING' : 'STOPPED'}
            </Text>
          </View>
          <View style={deviceStyles.infoRow}>
            <Text style={deviceStyles.infoLabel}>Speed</Text>
            <Text style={deviceStyles.infoValue}>{devices.conveyorBelt?.speed || 0}%</Text>
          </View>
        </View>
      </View>

      {/* LED Lights */}
      <View
        style={[
          deviceStyles.deviceCard,
          devices.lights ? deviceStyles.deviceCardConnected : deviceStyles.deviceCardDisconnected,
        ]}
      >
        <View style={deviceStyles.deviceHeader}>
          <Text style={deviceStyles.deviceName}>LED Lights</Text>
          <View style={[deviceStyles.statusBadge, deviceStyles.statusBadgeConnected]}>
            <View style={[deviceStyles.statusDot, { backgroundColor: COLORS.SUCCESS }]} />
            <Text style={[deviceStyles.statusText, deviceStyles.statusConnectedText]}>
              CONNECTED
            </Text>
          </View>
        </View>

        <View style={deviceStyles.deviceInfo}>
          <View style={deviceStyles.infoRow}>
            <Text style={deviceStyles.infoLabel}>Status</Text>
            <Text style={deviceStyles.infoValue}>
              {devices.lights?.on ? 'ON' : 'OFF'}
            </Text>
          </View>
          <View style={deviceStyles.infoRow}>
            <Text style={deviceStyles.infoLabel}>Brightness</Text>
            <Text style={deviceStyles.infoValue}>{devices.lights?.brightness || 0}%</Text>
          </View>
        </View>
      </View>

      {/* Refresh Button */}
      <TouchableOpacity style={deviceStyles.refreshButton} onPress={handleRefresh}>
        {refreshing ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <Text style={deviceStyles.refreshButtonText}>Refresh Status</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
