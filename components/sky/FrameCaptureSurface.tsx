import React, { useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import {
  onCaptureTrigger,
  type CaptureTriggerListener,
} from '@/services/meteor/captureEngine';
import { useMeteorCaptures } from '@/stores';
import type { FrameRef } from '@/services/meteor/captureRecord';

/**
 * Invisible CameraView that snaps a still frame whenever the capture engine
 * fires a trigger. Mount this on the Scan screen so the camera is "warm" —
 * subsequent captures take ~100ms instead of ~1.5s cold-start.
 *
 * Web platform: expo-camera supports web but most browsers require a user
 * gesture for getUserMedia, so on web we no-op and rely on metadata-only
 * captures. The patent #1 reduction-to-practice still holds — captures with
 * verified GNSS time + observer pose + bearing are themselves observations,
 * frame data is supplementary.
 */
export default function FrameCaptureSurface() {
  const [permission, requestPermission] = useCameraPermissions();
  const [active, setActive] = useState(false);
  const cameraRef = useRef<CameraView | null>(null);
  const appendFrame = useMeteorCaptures((s) => s.appendFrame);

  useEffect(() => {
    if (Platform.OS === 'web') return;
    if (!permission) return;
    if (permission.status === 'granted') {
      setActive(true);
      return;
    }
    if (permission.canAskAgain) {
      void requestPermission().then((next) => {
        if (next.status === 'granted') setActive(true);
      });
    }
  }, [permission, requestPermission]);

  useEffect(() => {
    const listener: CaptureTriggerListener = async (_mode, record) => {
      if (!record) return;
      if (!active || !cameraRef.current) return;
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          skipProcessing: true,
        });
        if (!photo) return;
        const frame: FrameRef = {
          uri: photo.uri,
          capturedAt: Date.now(),
          width: photo.width ?? 0,
          height: photo.height ?? 0,
        };
        await appendFrame(record.id, frame);
      } catch {
        // Snap failures are non-fatal — the record still has metadata.
      }
    };
    const unsubscribe = onCaptureTrigger(listener);
    return unsubscribe;
  }, [active, appendFrame]);

  if (Platform.OS === 'web') return null;
  if (!active) return null;

  return (
    <View pointerEvents="none" style={styles.hidden}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="back"
        autofocus="on"
        flash="off"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  hidden: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
    top: -2,
    left: -2,
  },
  camera: {
    flex: 1,
    width: 1,
    height: 1,
  },
});
