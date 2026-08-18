// Astronomy Academy — path index screen.
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ProgressBar, SectionLabel } from '@/components/common';
import { ACADEMY, type AcademyPath } from '@/data/academy';
import { useAcademy } from '@/stores/useAcademy';
import { colors, radii, spacing, typography } from '@/theme/tokens';

export default function LearnScreen() {
  const router = useRouter();
  const pathProgress = useAcademy((s) => s.pathProgress);
  const isComplete = useAcademy((s) => s.isComplete);

  const handlePathPress = (path: AcademyPath): void => {
    const firstUncompleted = path.lessons.find((l) => !isComplete(l.id));
    const target = firstUncompleted ?? path.lessons[0];
    if (!target) return;
    router.push(`/lesson/${target.id}`);
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <SectionLabel>ASTRONOMY ACADEMY</SectionLabel>
      <Text style={styles.intro}>
        Master the night sky. Each lesson teaches real astronomy and rewards you with Stardust
        for demonstrating knowledge.
      </Text>

      <View style={styles.list}>
        {ACADEMY.map((path) => {
          const { done, total } = pathProgress(path.id);
          const pct = total > 0 ? done / total : 0;
          return (
            <Pressable
              key={path.id}
              onPress={() => handlePathPress(path)}
              accessibilityRole="button"
              accessibilityLabel={`${path.title}, ${done} of ${total} lessons complete`}
              style={({ pressed }) => [
                styles.card,
                { borderColor: path.color + '22' },
                pressed ? styles.cardPressed : null,
              ]}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.icon}>{path.icon}</Text>
                <View style={styles.cardHeaderText}>
                  <Text style={styles.title}>{path.title}</Text>
                  <Text style={[styles.subtitle, { color: path.color }]}>
                    {done}/{total} lessons · {total * 15} ✦
                  </Text>
                </View>
              </View>
              <ProgressBar value={pct} height={3} color={path.color} />
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.appBg,
  },
  content: {
    paddingHorizontal: spacing.pageX,
    paddingVertical: spacing.pageY,
  },
  intro: {
    fontSize: typography.size.lore,
    color: colors.text.ghost,
    fontFamily: typography.fonts.body,
    lineHeight: typography.size.lore * 1.6,
    marginBottom: 16,
  },
  list: {
    flexDirection: 'column',
    gap: 10,
  },
  card: {
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderRadius: radii.card,
    padding: spacing.cardPadding,
  },
  cardPressed: {
    opacity: 0.7,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  cardHeaderText: {
    flex: 1,
  },
  icon: {
    fontSize: 28,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text.secondary,
    fontFamily: typography.fonts.heading,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: typography.size.label,
    fontFamily: typography.fonts.mono,
    letterSpacing: typography.letterSpacing.label,
  },
});
