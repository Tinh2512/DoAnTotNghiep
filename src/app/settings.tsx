import { COLORS, SERVER_CONFIG } from '@/constants/config';
import { getApiClient } from '@/services/api';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const settingsStyles = StyleSheet.create({
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT,
    marginBottom: 12,
  },
  card: {
    backgroundColor: COLORS.SURFACE,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.TEXT,
    flex: 1,
  },
  settingValue: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 4,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.TEXT,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.BACKGROUND,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.TEXT,
  },
  button: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusConnected: {
    backgroundColor: '#E8F5E9',
  },
  statusDisconnected: {
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
  infoText: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 12,
    lineHeight: 18,
  },
});

export default function SettingsScreen() {
  const [wsUrl, setWsUrl] = useState(SERVER_CONFIG.WS_URL);
  const [apiUrl, setApiUrl] = useState(SERVER_CONFIG.API_URL);
  const [isConnected, setIsConnected] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [autoStart, setAutoStart] = useState(false);

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      const client = getApiClient();
      const isHealthy = await client.healthCheck();

      if (isHealthy) {
        setIsConnected(true);
        Alert.alert('Success', 'Connected to server successfully!');
      } else {
        setIsConnected(false);
        Alert.alert('Error', 'Server connection failed');
      }
    } catch (error) {
      setIsConnected(false);
      Alert.alert('Error', 'Failed to connect to server');
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveSettings = () => {
    // In a real app, save to AsyncStorage or similar
    Alert.alert('Success', 'Settings saved successfully!');
  };

  return (
    <ScrollView style={settingsStyles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={settingsStyles.header}>
        <Text style={settingsStyles.title}>Settings</Text>
        <Text style={settingsStyles.subtitle}>Application Configuration</Text>
      </View>

      {/* Connection Settings */}
      <View style={settingsStyles.section}>
        <Text style={settingsStyles.sectionTitle}>Server Connection</Text>

        <View style={settingsStyles.card}>
          <View style={settingsStyles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={settingsStyles.settingLabel}>Server Status</Text>
            </View>
            <View
              style={[
                settingsStyles.statusBadge,
                isConnected ? settingsStyles.statusConnected : settingsStyles.statusDisconnected,
              ]}
            >
              <View
                style={[
                  settingsStyles.statusDot,
                  {
                    backgroundColor: isConnected ? COLORS.SUCCESS : COLORS.ERROR,
                  },
                ]}
              />
              <Text
                style={[
                  settingsStyles.statusText,
                  isConnected
                    ? settingsStyles.statusConnectedText
                    : settingsStyles.statusDisconnectedText,
                ]}
              >
                {isConnected ? 'Connected' : 'Disconnected'}
              </Text>
            </View>
          </View>

          <View style={settingsStyles.inputGroup}>
            <Text style={settingsStyles.inputLabel}>WebSocket URL</Text>
            <TextInput
              style={settingsStyles.input}
              placeholder="ws://192.168.1.100:8000"
              value={wsUrl}
              onChangeText={setWsUrl}
              editable={!isTesting}
            />
            <Text style={settingsStyles.infoText}>
              The WebSocket URL for real-time data communication with the Raspberry Pi
            </Text>
          </View>

          <View style={settingsStyles.inputGroup}>
            <Text style={settingsStyles.inputLabel}>API URL</Text>
            <TextInput
              style={settingsStyles.input}
              placeholder="http://192.168.1.100:8000"
              value={apiUrl}
              onChangeText={setApiUrl}
              editable={!isTesting}
            />
            <Text style={settingsStyles.infoText}>
              The REST API URL for control commands and status queries
            </Text>
          </View>

          <TouchableOpacity
            style={settingsStyles.button}
            onPress={handleTestConnection}
            disabled={isTesting}
          >
            {isTesting ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={settingsStyles.buttonText}>Test Connection</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* App Settings */}
      <View style={settingsStyles.section}>
        <Text style={settingsStyles.sectionTitle}>App Preferences</Text>

        <View style={settingsStyles.card}>
          <View style={settingsStyles.settingRow}>
            <Text style={settingsStyles.settingLabel}>Auto-start System</Text>
            <Switch value={autoStart} onValueChange={setAutoStart} />
          </View>

          <View style={settingsStyles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={settingsStyles.settingLabel}>Data Sync Interval</Text>
              <Text style={settingsStyles.settingValue}>Every 5 seconds</Text>
            </View>
            <Text style={settingsStyles.settingValue}>5s</Text>
          </View>

          <View style={settingsStyles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={settingsStyles.settingLabel}>History Limit</Text>
              <Text style={settingsStyles.settingValue}>Last 100 products</Text>
            </View>
            <Text style={settingsStyles.settingValue}>100</Text>
          </View>
        </View>
      </View>

      {/* Firebase Settings */}
      <View style={settingsStyles.section}>
        <Text style={settingsStyles.sectionTitle}>Firebase Configuration</Text>

        <View style={settingsStyles.card}>
          <View style={settingsStyles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={settingsStyles.settingLabel}>Status</Text>
              <Text style={settingsStyles.settingValue}>Not configured</Text>
            </View>
            <View
              style={[
                settingsStyles.statusBadge,
                settingsStyles.statusDisconnected,
              ]}
            >
              <View
                style={[
                  settingsStyles.statusDot,
                  {
                    backgroundColor: COLORS.ERROR,
                  },
                ]}
              />
              <Text
                style={[
                  settingsStyles.statusText,
                  settingsStyles.statusDisconnectedText,
                ]}
              >
                Offline
              </Text>
            </View>
          </View>

          <Text style={settingsStyles.infoText}>
            To enable Firebase data sync, please configure your Firebase credentials in the app configuration file.
          </Text>
        </View>
      </View>

      {/* Save Button */}
      <TouchableOpacity style={settingsStyles.button} onPress={handleSaveSettings}>
        <Text style={settingsStyles.buttonText}>Save Settings</Text>
      </TouchableOpacity>

      {/* App Info */}
      <View style={settingsStyles.section}>
        <View style={settingsStyles.card}>
          <View style={settingsStyles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={settingsStyles.settingLabel}>App Version</Text>
              <Text style={settingsStyles.settingValue}>1.0.0</Text>
            </View>
          </View>

          <View style={settingsStyles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={settingsStyles.settingLabel}>Build Date</Text>
              <Text style={settingsStyles.settingValue}>2024-12-08</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
