import React, { useCallback, useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Badge, Card, SectionLabel } from '@/components/common';
import { useScopes, useToast } from '@/stores';
import {
  getAdapter,
  type MountStatus,
  type ScopeConfig,
  type ScopeVendor,
  VENDORS,
} from '@/services/scopes';
import { formatDec, formatRA } from '@/services/astro';
import { colors, radii, spacing, typography } from '@/theme/tokens';

const VENDOR_LABELS: Record<ScopeVendor, string> = {
  seestar: 'ZWO Seestar (S30 / S50 / S55)',
  dwarf: 'Dwarf Lab (Dwarf 2 / 3 / Mini)',
  vespera: 'Vaonis Vespera',
  unistellar: 'Unistellar eVscope',
  generic_alpaca: 'Generic Alpaca',
};

export default function ScopesScreen() {
  const router = useRouter();
  const scopes = useScopes((s) => s.scopes);
  const addScope = useScopes((s) => s.add);
  const removeScope = useScopes((s) => s.remove);
  const showToast = useToast((s) => s.show);

  const [label, setLabel] = useState('');
  const [vendor, setVendor] = useState<ScopeVendor>('seestar');
  const [host, setHost] = useState('');
  const [port, setPort] = useState('11111');
  const [testing, setTesting] = useState(false);

  const submitNew = useCallback(async () => {
    if (!host.trim()) {
      showToast('Enter the scope IP or hostname', 'error');
      return;
    }
    setTesting(true);
    const config: ScopeConfig = {
      id: `scope_${Date.now().toString(36)}`,
      label: label.trim() || VENDOR_LABELS[vendor],
      vendor,
      host: host.trim(),
      port: Number(port) || 11111,
      deviceNumber: 0,
      addedAt: Date.now(),
    };
    const adapter = getAdapter(vendor);
    try {
      const ok = await adapter.testConnection(config);
      if (!ok) {
        showToast(`Could not reach ${config.label} at ${config.host}:${config.port}`, 'error');
        setTesting(false);
        return;
      }
      await addScope(config);
      showToast(`Connected to ${config.label}`, 'atp');
      setLabel('');
      setHost('');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Connection failed';
      showToast(msg, 'error');
    } finally {
      setTesting(false);
    }
  }, [addScope, host, label, port, showToast, vendor]);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Pressable onPress={() => router.back()} style={styles.backLink}>
        <Text style={styles.backLinkText}>← Back</Text>
      </Pressable>

      <Text style={styles.title}>Connected Telescopes</Text>
      <Text style={styles.tagline}>
        Astra Vault speaks ASCOM Alpaca natively. Connect your Seestar (any S-series) directly
        over your LAN. Astra Vault will read its current target, drive slews, and log every
        observation to your Vault.
      </Text>

      {scopes.length === 0 ? (
        <Card>
          <Text style={styles.emptyText}>No scopes connected yet.</Text>
        </Card>
      ) : (
        <View style={styles.list}>
          {scopes.map((s) => (
            <ScopeRow key={s.id} scope={s} onRemove={() => removeScope(s.id)} />
          ))}
        </View>
      )}

      <Card>
        <SectionLabel>Add a Telescope</SectionLabel>

        <Text style={styles.fieldLabel}>Vendor</Text>
        <View style={styles.vendorRow}>
          {VENDORS.map((v) => (
            <Pressable
              key={v}
              onPress={() => setVendor(v)}
              style={({ pressed }) => [
                styles.vendorChip,
                v === vendor ? styles.vendorChipActive : null,
                pressed ? styles.pressed : null,
              ]}
            >
              <Text
                style={[
                  styles.vendorChipText,
                  v === vendor ? styles.vendorChipTextActive : null,
                ]}
              >
                {VENDOR_LABELS[v]}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.fieldLabel}>Label (optional)</Text>
        <TextInput
          value={label}
          onChangeText={setLabel}
          placeholder={VENDOR_LABELS[vendor]}
          placeholderTextColor={colors.text.ghost}
          style={styles.input}
        />

        <Text style={styles.fieldLabel}>Host / IP</Text>
        <TextInput
          value={host}
          onChangeText={setHost}
          placeholder="192.168.1.45 or seestar.local"
          placeholderTextColor={colors.text.ghost}
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Text style={styles.fieldLabel}>Port</Text>
        <TextInput
          value={port}
          onChangeText={setPort}
          placeholder="11111"
          placeholderTextColor={colors.text.ghost}
          style={styles.input}
          keyboardType="number-pad"
        />

        <Pressable
          onPress={submitNew}
          disabled={testing}
          style={({ pressed }) => [
            styles.submit,
            testing ? styles.submitDisabled : null,
            pressed ? styles.pressed : null,
          ]}
        >
          <Text style={styles.submitText}>
            {testing ? 'CONNECTING…' : 'TEST + CONNECT'}
          </Text>
        </Pressable>

        {vendor === 'vespera' || vendor === 'unistellar' ? (
          <Text style={styles.partnerNote}>
            {vendor === 'vespera' ? 'Vaonis Vespera' : 'Unistellar eVscope'} support is on
            the way. Seestar works today.
          </Text>
        ) : null}
      </Card>
    </ScrollView>
  );
}

interface ScopeRowProps {
  scope: ScopeConfig;
  onRemove: () => void;
}

const ScopeRow: React.FC<ScopeRowProps> = ({ scope, onRemove }) => {
  const adapter = getAdapter(scope.vendor);
  const [status, setStatus] = useState<MountStatus | null>(null);
  const [polling, setPolling] = useState(false);

  const refresh = useCallback(async () => {
    setPolling(true);
    try {
      const s = await adapter.getStatus(scope);
      setStatus(s);
    } catch {
      setStatus(null);
    } finally {
      setPolling(false);
    }
  }, [adapter, scope]);

  useEffect(() => {
    void refresh();
    const id = setInterval(() => void refresh(), 15_000);
    return () => clearInterval(id);
  }, [refresh]);

  return (
    <Card>
      <View style={styles.rowHead}>
        <View style={styles.flex1}>
          <Text style={styles.scopeLabel}>{scope.label}</Text>
          <Text style={styles.scopeMeta}>
            {adapter.displayName} · {scope.host}:{scope.port}
          </Text>
        </View>
        {status?.connected ? (
          <Badge variant="green">ONLINE</Badge>
        ) : polling ? (
          <Badge variant="blue">…</Badge>
        ) : (
          <Badge variant="red">OFFLINE</Badge>
        )}
      </View>

      {status?.connected ? (
        <View style={styles.statusPanel}>
          {status.rightAscensionDeg != null && status.declinationDeg != null ? (
            <Text style={styles.statusCoord}>
              {formatRA(status.rightAscensionDeg)}  {formatDec(status.declinationDeg)}
            </Text>
          ) : null}
          <View style={styles.chipRow}>
            <Badge variant={status.slewing ? 'gold' : 'neutral'}>
              {status.slewing ? 'SLEWING' : 'IDLE'}
            </Badge>
            <Badge variant={status.tracking ? 'green' : 'neutral'}>
              {status.tracking ? 'TRACKING' : 'STILL'}
            </Badge>
            <Badge variant={status.parked ? 'purple' : 'neutral'}>
              {status.parked ? 'PARKED' : 'UNPARKED'}
            </Badge>
          </View>
        </View>
      ) : null}

      <Pressable onPress={onRemove} style={({ pressed }) => [styles.removeButton, pressed ? styles.pressed : null]}>
        <Text style={styles.removeText}>REMOVE</Text>
      </Pressable>
    </Card>
  );
};

const t = typography;
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.appBg },
  content: { padding: spacing.pageX, paddingTop: 50, paddingBottom: 60, gap: 14 },
  backLink: { marginBottom: 4 },
  backLinkText: { color: 'rgba(96,165,250,0.7)', fontFamily: t.fonts.mono, fontSize: 12 },
  title: {
    fontSize: 26,
    color: colors.text.primary,
    fontFamily: t.fonts.heading,
    fontWeight: '700',
  },
  tagline: {
    fontSize: t.size.body,
    color: colors.text.muted,
    fontFamily: t.fonts.body,
    lineHeight: 20,
  },
  list: { gap: 10 },
  emptyText: {
    color: colors.text.muted,
    fontFamily: t.fonts.mono,
    fontSize: t.size.body,
    textAlign: 'center',
    paddingVertical: 14,
  },
  rowHead: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 },
  flex1: { flex: 1 },
  scopeLabel: {
    fontSize: t.size.objectName,
    color: colors.text.primary,
    fontFamily: t.fonts.heading,
    fontWeight: '600',
  },
  scopeMeta: {
    fontSize: t.size.label,
    color: colors.text.muted,
    fontFamily: t.fonts.mono,
    marginTop: 2,
  },
  statusPanel: {
    marginTop: 6,
    padding: 10,
    borderRadius: radii.button,
    backgroundColor: 'rgba(96,165,250,0.05)',
  },
  statusCoord: {
    fontSize: t.size.body,
    color: colors.accent.blue,
    fontFamily: t.fonts.monoMedium,
    marginBottom: 6,
  },
  chipRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  removeButton: {
    alignSelf: 'flex-start',
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.button,
    borderWidth: 1,
    borderColor: 'rgba(255,68,68,0.20)',
    backgroundColor: 'rgba(255,68,68,0.06)',
  },
  removeText: {
    color: colors.accent.red,
    fontFamily: t.fonts.mono,
    fontSize: 10,
    letterSpacing: 1.5,
  },
  fieldLabel: {
    fontSize: t.size.tiny,
    color: colors.text.label,
    fontFamily: t.fonts.mono,
    letterSpacing: 2,
    marginTop: 12,
    marginBottom: 4,
  },
  vendorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  vendorChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  vendorChipActive: {
    backgroundColor: 'rgba(96,165,250,0.1)',
    borderColor: 'rgba(96,165,250,0.3)',
  },
  vendorChipText: {
    fontSize: 11,
    color: colors.text.muted,
    fontFamily: t.fonts.mono,
  },
  vendorChipTextActive: { color: colors.accent.blue },
  input: {
    borderRadius: radii.button,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.text.primary,
    fontFamily: t.fonts.mono,
    fontSize: 13,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  submit: {
    marginTop: 14,
    paddingVertical: 12,
    borderRadius: radii.button,
    borderWidth: 1,
    borderColor: 'rgba(74,222,128,0.30)',
    backgroundColor: 'rgba(74,222,128,0.10)',
    alignItems: 'center',
  },
  submitDisabled: {
    borderColor: 'rgba(255,255,255,0.05)',
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  submitText: {
    color: colors.accent.green,
    fontFamily: t.fonts.monoMedium,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
  },
  partnerNote: {
    marginTop: 10,
    fontSize: t.size.label,
    color: colors.text.ghost,
    fontFamily: t.fonts.bodyItalic,
    fontStyle: 'italic',
  },
  pressed: { opacity: 0.85 },
});
