import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAcademy, useAtp, useNightVision } from '@/stores';
import { totalLessons } from '@/data/academy';
import { colors, spacing, typography } from '@/theme/tokens';

type TabIconName = React.ComponentProps<typeof Ionicons>['name'];

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const balance = useAtp((s) => s.balance);
  const completedCount = useAcademy((s) => Object.keys(s.completedLessonIds).length);
  const nightVision = useNightVision((s) => s.enabled);
  const toggleNightVision = useNightVision((s) => s.toggle);

  return (
    <View style={styles.frame}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.headerLeft}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoGlyph}>✦</Text>
          </View>
          <View>
            <Text style={styles.title}>ASTRA VAULT</Text>
            <Text style={styles.subtitle}>a sky wolf studios app</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          {Platform.OS === 'web' ? (
            <Pressable
              onPress={toggleNightVision}
              accessibilityRole="button"
              accessibilityLabel={
                nightVision ? 'Turn off night vision mode' : 'Turn on night vision mode'
              }
              style={({ pressed }) => [
                styles.nightButton,
                nightVision ? styles.nightButtonOn : null,
                pressed ? { opacity: 0.7 } : null,
              ]}
            >
              <Ionicons
                name={nightVision ? 'moon' : 'moon-outline'}
                size={13}
                color={nightVision ? '#FF6B6B' : 'rgba(160,180,210,0.5)'}
              />
            </Pressable>
          ) : null}
          <View style={[styles.pill, styles.pillGold]}>
            <Text style={styles.pillTextGold}>✦ {balance.toLocaleString()}</Text>
          </View>
          <View style={[styles.pill, styles.pillPurple]}>
            <Text style={styles.pillTextPurple}>
              {completedCount}/{totalLessons}
            </Text>
          </View>
        </View>
      </View>

      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: true,
          tabBarStyle: [
            styles.tabBar,
            { paddingBottom: Math.max(insets.bottom, 6) },
          ],
          tabBarActiveTintColor: colors.accent.blue,
          tabBarInactiveTintColor: 'rgba(160,180,210,0.35)',
          tabBarLabelStyle: styles.tabLabel,
          sceneStyle: { backgroundColor: 'transparent' },
        }}
      >
        <Tabs.Screen
          name="hub"
          options={{
            title: 'Hub',
            tabBarLabel: 'HUB',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name={('compass-outline' satisfies TabIconName)} color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="scan"
          options={{
            title: 'Scan',
            tabBarLabel: 'SCAN',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name={('scan-circle-outline' satisfies TabIconName)} color={color} size={size + 2} />
            ),
          }}
        />
        <Tabs.Screen
          name="vault"
          options={{
            title: 'Vault',
            tabBarLabel: 'VAULT',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name={('diamond-outline' satisfies TabIconName)} color={color} size={size} />
            ),
          }}
        />
        {/* Shared Sky stays hidden until it runs on real community data, not the mock feed. */}
        <Tabs.Screen name="shared-sky" options={{ href: null }} />
        <Tabs.Screen
          name="learn"
          options={{
            title: 'Learn',
            tabBarLabel: 'LEARN',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name={('school-outline' satisfies TabIconName)} color={color} size={size} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    paddingHorizontal: spacing.pageX,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.headerBg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.03)',
    ...(Platform.OS === 'web'
      ? ({ backdropFilter: 'blur(14px)' } as object)
      : null),
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoBadge: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: 'rgba(96,165,250,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(192,132,252,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoGlyph: {
    color: colors.text.primary,
    fontSize: 14,
  },
  title: {
    fontSize: typography.size.appTitle,
    letterSpacing: typography.letterSpacing.title,
    fontFamily: typography.fonts.monoMedium,
    color: colors.text.primary,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 7,
    letterSpacing: 1.5,
    color: 'rgba(160,180,210,0.3)',
    fontFamily: typography.fonts.mono,
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  pill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
  },
  pillGold: {
    backgroundColor: 'rgba(251,191,36,0.06)',
    borderColor: 'rgba(251,191,36,0.12)',
  },
  nightButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  nightButtonOn: {
    borderColor: 'rgba(255,107,107,0.4)',
    backgroundColor: 'rgba(255,107,107,0.08)',
  },
  pillPurple: {
    backgroundColor: 'rgba(192,132,252,0.06)',
    borderColor: 'rgba(192,132,252,0.12)',
  },
  pillTextGold: {
    fontSize: 10,
    color: colors.accent.gold,
    fontFamily: typography.fonts.monoMedium,
    fontWeight: '600',
  },
  pillTextPurple: {
    fontSize: 10,
    color: colors.accent.purple,
    fontFamily: typography.fonts.monoMedium,
    fontWeight: '600',
  },
  tabBar: {
    backgroundColor: colors.navBg,
    borderTopColor: 'rgba(255,255,255,0.03)',
    borderTopWidth: 1,
    height: 64,
  },
  tabLabel: {
    fontSize: 8,
    letterSpacing: 1.5,
    fontFamily: typography.fonts.mono,
    marginBottom: 2,
  },
});
