import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useDevGate } from '@/stores';
import { colors, radii, typography } from '@/theme/tokens';

function GateScreen() {
  const tryUnlock = useDevGate((s) => s.tryUnlock);
  const [phrase, setPhrase] = useState('');
  const [missed, setMissed] = useState(false);

  const submit = () => {
    if (!tryUnlock(phrase)) {
      setMissed(true);
      setPhrase('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>✦</Text>
      <Text style={styles.title}>ASTRA VAULT</Text>
      <Text style={styles.sub}>star atlas and collection · in development</Text>

      <TextInput
        value={phrase}
        onChangeText={(t) => {
          setPhrase(t);
          setMissed(false);
        }}
        onSubmitEditing={submit}
        placeholder="Passphrase"
        placeholderTextColor={colors.text.ghost}
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.input}
        accessibilityLabel="Beta passphrase"
      />
      {missed ? <Text style={styles.missed}>Not it. Ask Stephen for the passphrase.</Text> : null}

      <Pressable
        onPress={submit}
        accessibilityRole="button"
        style={({ pressed }) => [styles.button, pressed ? styles.pressed : null]}
      >
        <Text style={styles.buttonText}>ENTER</Text>
      </Pressable>

      <Text style={styles.smallPrint}>
        This is a curtain, not a lock. The app behind it is not finished,
        and the sky itself is free either way.
      </Text>
      <Text style={styles.studio}>Sky Wolf Studios</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logo: { fontSize: 40, color: colors.text.primary, marginBottom: 10 },
  title: {
    fontSize: 22,
    color: colors.text.primary,
    fontFamily: typography.fonts.monoMedium,
    letterSpacing: 4,
    fontWeight: '700',
    marginBottom: 6,
  },
  sub: {
    fontSize: 11,
    color: colors.text.dim,
    fontFamily: typography.fonts.mono,
    letterSpacing: 1,
    marginBottom: 28,
  },
  input: {
    width: 240,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radii.button,
    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.3)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    color: colors.text.primary,
    fontFamily: typography.fonts.mono,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  missed: {
    fontSize: 11,
    color: '#FF6B6B',
    fontFamily: typography.fonts.mono,
    marginBottom: 6,
  },
  button: {
    paddingHorizontal: 34,
    paddingVertical: 11,
    borderRadius: radii.button,
    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.3)',
    backgroundColor: 'rgba(96,165,250,0.08)',
    marginTop: 8,
  },
  pressed: { opacity: 0.7 },
  buttonText: {
    fontSize: 12,
    color: colors.text.primary,
    fontFamily: typography.fonts.monoMedium,
    fontWeight: '700',
    letterSpacing: 3,
  },
  smallPrint: {
    fontSize: 12,
    color: colors.text.ghost,
    fontFamily: typography.fonts.mono,
    textAlign: 'center',
    maxWidth: 300,
    lineHeight: 16,
    marginTop: 34,
  },
  studio: {
    fontSize: 12,
    color: colors.text.dim,
    fontFamily: typography.fonts.mono,
    marginTop: 10,
  },
});

export default GateScreen;
