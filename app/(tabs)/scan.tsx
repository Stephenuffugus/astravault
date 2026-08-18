import React, { useCallback, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import CelestialCanvas from '@/components/sky/CelestialCanvas';
import FrameCaptureSurface from '@/components/sky/FrameCaptureSurface';
import {
  atpFor,
  CATEGORY_ICONS,
  RARITY_META,
  type CelestialObject,
} from '@/data/catalog';
import { useCollection, useMeteorCaptures, useToast } from '@/stores';
import { triggerCapture } from '@/services/meteor/captureEngine';
import { colors, radii, spacing, typography } from '@/theme/tokens';
import { formatDec, formatRA } from '@/services/astro';

export default function ScanScreen() {
  const collected = useCollection((s) => s.collected);
  const collect = useCollection((s) => s.collect);
  const isCollected = useCollection((s) => s.isCollected);
  const showToast = useToast((s) => s.show);
  const captureCount = useMeteorCaptures((s) => s.captures.length);
  const router = useRouter();

  const [selected, setSelected] = useState<CelestialObject | null>(null);
  const [capturing, setCapturing] = useState(false);

  const handleCapture = useCallback(async () => {
    if (capturing) return;
    setCapturing(true);
    const record = await triggerCapture('manual_tap');
    setCapturing(false);
    if (record) {
      showToast('+10 Stardust · Moment saved to your Hub', 'atp');
    } else {
      showToast('Location needed for capture. Grant permission and try again.', 'error');
    }
  }, [capturing, showToast]);

  const handleSelect = useCallback((object: CelestialObject) => {
    setSelected(object);
  }, []);

  const handleCollect = useCallback(async () => {
    if (!selected) return;
    const added = await collect(selected);
    if (added) {
      showToast(`+${atpFor(selected.rarity)} Stardust · ${selected.name}`);
    }
    setSelected({ ...selected });
  }, [collect, selected, showToast]);

  const close = useCallback(() => setSelected(null), []);

  return (
    <View style={styles.container}>
      <CelestialCanvas
        onSelect={handleSelect}
        isCollected={isCollected}
        key={Object.keys(collected).length}
      />

      <FrameCaptureSurface />

      {captureCount === 0 ? (
        <View style={styles.captureHint} pointerEvents="none">
          <Text style={styles.captureHintText}>
            See a meteor? Capture the moment. It saves your time, place and sky,
            then checks meteor networks for a match. Captures live on your Hub.
          </Text>
        </View>
      ) : null}
      <View style={styles.captureBar} pointerEvents="box-none">
        <Pressable
          onPress={handleCapture}
          disabled={capturing}
          accessibilityRole="button"
          accessibilityLabel="Capture moment"
          style={({ pressed }) => [
            styles.captureButton,
            capturing ? styles.captureButtonBusy : null,
            pressed ? styles.captureButtonPressed : null,
          ]}
        >
          <Text style={styles.captureGlyph}>📸</Text>
          <Text style={styles.captureText}>
            {capturing ? 'CAPTURING…' : 'CAPTURE MOMENT'}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => router.push('/captures')}
          accessibilityRole="button"
          accessibilityLabel="View captures"
          style={({ pressed }) => [
            styles.capturesLink,
            pressed ? styles.captureButtonPressed : null,
          ]}
        >
          <Text style={styles.capturesLinkText}>{captureCount} ▸</Text>
        </Pressable>
      </View>

      <Modal
        visible={selected !== null}
        transparent
        animationType="fade"
        onRequestClose={close}
      >
        <Pressable style={styles.backdrop} onPress={close}>
          <Pressable onPress={(e) => e.stopPropagation()} style={({ pressed }) => [pressed ? null : null]}>
            {selected ? (
              <ObjectDetail
                object={selected}
                isCollected={isCollected(selected.id)}
                onCollect={handleCollect}
                onClose={close}
              />
            ) : null}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

interface ObjectDetailProps {
  object: CelestialObject;
  isCollected: boolean;
  onCollect: () => void;
  onClose: () => void;
}

const ObjectDetail: React.FC<ObjectDetailProps> = ({
  object,
  isCollected,
  onCollect,
  onClose,
}) => {
  const rarity = RARITY_META[object.rarity];
  return (
    <View
      style={[
        styles.modalCard,
        { borderColor: rarity.color + '24' },
      ]}
    >
      <Text style={[styles.rarityLabel, { color: rarity.color }]}>
        {CATEGORY_ICONS[object.category]}  {rarity.label}
      </Text>
      <Text style={styles.objectName}>{object.name}</Text>
      <Text style={styles.constellation}>
        {object.constellation === '—' ? 'Solar System' : object.constellation}
      </Text>
      <Text style={styles.description}>{object.description}</Text>

      <View style={styles.dataGrid}>
        <DataCell label="MAG" value={object.magnitude.toFixed(2)} />
        <DataCell
          label="DIST"
          value={
            object.category === 'planet'
              ? `${object.distance.toExponential(1)} AU`
              : object.distance > 1000
                ? `${(object.distance / 1000).toFixed(1)} kly`
                : `${object.distance} ly`
          }
        />
        <DataCell label="RA" value={formatRA(object.ra)} />
        <DataCell label="DEC" value={formatDec(object.dec)} />
      </View>

      <View style={styles.actionRow}>
        {!isCollected ? (
          <Pressable
            onPress={onCollect}
            style={[
              styles.collectButton,
              {
                backgroundColor: rarity.color + '1F',
                borderColor: rarity.color + '55',
              },
            ]}
          >
            <Text style={[styles.collectText, { color: rarity.color }]}>
              + COLLECT · {atpFor(object.rarity)} ✦
            </Text>
          </Pressable>
        ) : (
          <View
            style={[
              styles.collectButton,
              {
                backgroundColor: 'rgba(74,222,128,0.06)',
                borderColor: 'rgba(74,222,128,0.18)',
              },
            ]}
          >
            <Text style={[styles.collectText, { color: colors.accent.green }]}>
              ✓ IN VAULT
            </Text>
          </View>
        )}
        <Pressable style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>✕</Text>
        </Pressable>
      </View>
    </View>
  );
};

interface DataCellProps {
  label: string;
  value: string;
}

const DataCell: React.FC<DataCellProps> = ({ label, value }) => (
  <View style={styles.dataCell}>
    <Text style={styles.dataLabel}>{label}</Text>
    <Text style={styles.dataValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.scannerClear,
  },
  captureHint: {
    position: 'absolute',
    bottom: 78,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  captureHintText: {
    fontSize: 13,
    lineHeight: 19,
    color: 'rgba(200,215,240,0.75)',
    fontFamily: typography.webFallback.body,
    textAlign: 'center',
    backgroundColor: 'rgba(8,12,25,0.85)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    maxWidth: 380,
  },
  captureBar: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: spacing.pageX,
  },
  captureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: radii.pillLarge,
    borderWidth: 1,
    borderColor: 'rgba(251,191,36,0.45)',
    backgroundColor: 'rgba(8,12,25,0.92)',
  },
  captureButtonBusy: {
    opacity: 0.6,
    borderColor: 'rgba(96,165,250,0.45)',
  },
  captureButtonPressed: {
    opacity: 0.7,
  },
  captureGlyph: {
    fontSize: 16,
  },
  captureText: {
    fontSize: 13,
    color: colors.accent.gold,
    fontFamily: typography.fonts.monoMedium,
    fontWeight: '700',
    letterSpacing: 2,
  },
  capturesLink: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: 'rgba(8,12,25,0.85)',
  },
  capturesLinkText: {
    fontSize: 12,
    color: colors.text.muted,
    fontFamily: typography.fonts.monoMedium,
    letterSpacing: 1,
  },
  backdrop: {
    flex: 1,
    backgroundColor: colors.modalOverlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: 'rgba(8,12,25,0.98)',
    borderRadius: radii.cardLarge,
    borderWidth: 1,
    padding: 22,
    width: '92%',
    maxWidth: 420,
  },
  rarityLabel: {
    fontSize: 12,
    letterSpacing: 3,
    fontFamily: typography.webFallback.mono,
    fontWeight: '600',
  },
  objectName: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text.primary,
    fontFamily: typography.webFallback.heading,
    marginTop: 4,
    marginBottom: 4,
  },
  constellation: {
    fontSize: 12,
    color: colors.text.muted,
    fontFamily: typography.webFallback.mono,
    letterSpacing: 1,
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    color: colors.text.muted,
    fontFamily: typography.webFallback.body,
    lineHeight: 22,
    marginBottom: 14,
  },
  dataGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 10,
  },
  dataCell: {
    flexBasis: '47%',
    flexGrow: 1,
  },
  dataLabel: {
    fontSize: 12,
    color: colors.text.ghost,
    fontFamily: typography.webFallback.mono,
    letterSpacing: 2,
    marginBottom: 2,
  },
  dataValue: {
    fontSize: 15,
    color: colors.text.secondary,
    fontFamily: typography.webFallback.mono,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  collectButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderRadius: radii.button,
    alignItems: 'center',
  },
  collectText: {
    fontSize: 12,
    fontFamily: typography.webFallback.mono,
    fontWeight: '700',
    letterSpacing: 1,
  },
  closeButton: {
    paddingVertical: 12,
    paddingHorizontal: spacing.buttonX,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radii.button,
    backgroundColor: colors.cardBg,
  },
  closeText: {
    color: colors.text.dim,
    fontSize: 14,
  },
});
