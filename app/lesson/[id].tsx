// Astronomy Academy — lesson detail screen with knowledge-check quiz.
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Card, SectionLabel } from '@/components/common';
import { lessonById } from '@/data/academy';
import { useAcademy } from '@/stores/useAcademy';
import { useToast } from '@/stores/useToast';
import { colors, radii, spacing, typography } from '@/theme/tokens';

export default function LessonScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string | string[] }>();
  const rawId = params.id;
  const lessonId = Array.isArray(rawId) ? rawId[0] : rawId;
  const lesson = useMemo(() => (lessonId ? lessonById(lessonId) : undefined), [lessonId]);

  const alreadyComplete = useAcademy((s) => (lessonId ? s.isComplete(lessonId) : false));

  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState<boolean>(alreadyComplete);

  if (!lesson || !lessonId) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Lesson not found</Text>
        <Pressable onPress={() => router.back()} style={styles.backInline}>
          <Text style={styles.backText}>{'← Back'}</Text>
        </Pressable>
      </View>
    );
  }

  const correctIndex = lesson.quiz.correctIndex;
  const effectiveSelected: number | null = alreadyComplete && selected === null ? correctIndex : selected;
  const locked = checked || alreadyComplete;
  const wasCorrect = effectiveSelected === correctIndex;

  const handleCheck = (): void => {
    if (selected === null || checked) return;
    setChecked(true);
    if (selected === correctIndex && !alreadyComplete) {
      void (async () => {
        const earned = await useAcademy.getState().completeLesson(lesson.id);
        if (earned) {
          useToast.getState().show(`+${lesson.atpReward} Stardust · Lesson complete!`);
        }
      })();
    }
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Pressable
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel="Back"
        style={styles.back}
      >
        <Text style={styles.backText}>{'← Back'}</Text>
      </Pressable>

      <Text style={styles.title}>{lesson.title}</Text>

      <Card style={styles.bodyCard}>
        <Text style={styles.body}>{lesson.body}</Text>
      </Card>

      <View style={styles.quizCard}>
        <SectionLabel color={colors.accent.blue}>KNOWLEDGE CHECK</SectionLabel>
        <Text style={styles.question}>{lesson.quiz.question}</Text>

        <View style={styles.answers}>
          {lesson.quiz.answers.map((answer, i) => {
            const isCorrect = i === correctIndex;
            const isSelected = effectiveSelected === i;
            const showResult = locked;

            let bg: string = 'rgba(255,255,255,0.02)';
            let borderColor: string = 'rgba(255,255,255,0.04)';
            let textColor: string = colors.text.muted;

            if (showResult) {
              if (isCorrect) {
                bg = 'rgba(74,222,128,0.10)';
                borderColor = 'rgba(74,222,128,0.30)';
                textColor = colors.accent.green;
              } else if (isSelected) {
                bg = 'rgba(255,68,68,0.08)';
                borderColor = 'rgba(255,68,68,0.20)';
                textColor = colors.accent.red;
              } else {
                bg = 'rgba(255,255,255,0.015)';
                borderColor = 'rgba(255,255,255,0.04)';
                textColor = colors.text.dim;
              }
            } else if (isSelected) {
              bg = 'rgba(96,165,250,0.10)';
              borderColor = 'rgba(96,165,250,0.20)';
              textColor = colors.accent.blue;
            }

            return (
              <Pressable
                key={i}
                onPress={() => {
                  if (!locked) setSelected(i);
                }}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected, disabled: locked }}
                style={[
                  styles.answer,
                  { backgroundColor: bg, borderColor },
                ]}
              >
                <Text style={[styles.answerText, { color: textColor }]}>{answer}</Text>
              </Pressable>
            );
          })}
        </View>

        {selected !== null && !checked && !alreadyComplete ? (
          <Pressable
            onPress={handleCheck}
            accessibilityRole="button"
            accessibilityLabel="Check answer"
            style={({ pressed }) => [styles.checkButton, pressed ? styles.checkButtonPressed : null]}
          >
            <Text style={styles.checkButtonText}>CHECK ANSWER</Text>
          </Pressable>
        ) : null}

        {locked ? (
          <View
            style={[
              styles.result,
              {
                backgroundColor: wasCorrect ? 'rgba(74,222,128,0.06)' : 'rgba(255,68,68,0.05)',
              },
            ]}
          >
            <Text
              style={[
                styles.resultText,
                { color: wasCorrect ? colors.accent.green : colors.accent.redSoft },
              ]}
            >
              {wasCorrect
                ? `✓ Correct! +${lesson.atpReward} ATP earned`
                : `✗ The answer was: ${lesson.quiz.answers[correctIndex]}`}
            </Text>
          </View>
        ) : null}
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
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.appBg,
    gap: 12,
  },
  notFoundText: {
    fontSize: typography.size.objectName,
    color: colors.text.muted,
    fontFamily: typography.fonts.heading,
  },
  back: {
    alignSelf: 'flex-start',
    marginBottom: 12,
    paddingVertical: 4,
  },
  backInline: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  backText: {
    color: 'rgba(96,165,250,0.7)',
    fontSize: typography.size.button,
    fontFamily: typography.fonts.mono,
    letterSpacing: typography.letterSpacing.button,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text.primary,
    fontFamily: typography.fonts.heading,
    marginBottom: 14,
  },
  bodyCard: {
    padding: 18,
    marginBottom: 16,
  },
  body: {
    fontSize: typography.size.body,
    color: colors.text.muted,
    fontFamily: typography.fonts.body,
    lineHeight: typography.size.body * 1.8,
  },
  quizCard: {
    backgroundColor: 'rgba(96,165,250,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.10)',
    borderRadius: radii.card,
    padding: 18,
  },
  question: {
    fontSize: typography.size.body,
    color: colors.text.secondary,
    fontFamily: typography.fonts.mono,
    marginBottom: 12,
  },
  answers: {
    flexDirection: 'column',
    gap: 6,
  },
  answer: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: radii.button,
    borderWidth: 1,
  },
  answerText: {
    fontSize: 12,
    fontFamily: typography.fonts.mono,
    textAlign: 'left',
  },
  checkButton: {
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: radii.button,
    backgroundColor: 'rgba(96,165,250,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.20)',
    alignItems: 'center',
  },
  checkButtonPressed: {
    opacity: 0.75,
  },
  checkButtonText: {
    fontSize: typography.size.button,
    color: colors.accent.blue,
    fontFamily: typography.fonts.monoMedium,
    letterSpacing: typography.letterSpacing.button,
    fontWeight: '600',
  },
  result: {
    marginTop: 10,
    padding: 10,
    borderRadius: radii.button,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: typography.fonts.monoMedium,
  },
});
