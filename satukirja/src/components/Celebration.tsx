/**
 * Celebration: juhlistus, kun satu on luettu loppuun.
 *
 * Näyttää ansaitun tarran pienellä "pomppu"-animaatiolla ja tarjoaa kaksi selkeää
 * jatkoa: seuraava satu tai lopetus (illalla "Hyvää yötä"). Lopetus on yhtä näkyvä
 * kuin jatkaminen, jotta lasta ei houkutella loputtomaan katseluun.
 */
import React, { useEffect, useRef } from 'react';
import { Animated, Modal, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { Story } from '@/types/story';
import { storyColor } from '@/data/storyRepository';
import { levelFor } from '@/data/levels';
import { useAppData } from '@/storage/AppDataContext';
import { radius, shade, spacing } from '@/theme/theme';
import { AppText } from './AppText';
import { PrimaryButton, SecondaryButton } from './Buttons';

interface Props {
  visible: boolean;
  story: Story;
  isNewSticker: boolean;
  stickerCount: number;
  totalStories: number;
  nextStory?: Story;
  onNext: () => void;
  onClose: () => void;
}

const CONFETTI = ['✨', '⭐', '🎉', '💫', '✨', '⭐'];

export function Celebration({ visible, story, isNewSticker, stickerCount, totalStories, nextStory, onNext, onClose }: Props) {
  const { colors, profile } = useAppData();
  const pop = useRef(new Animated.Value(0)).current;
  const evening = new Date().getHours() >= 18 || new Date().getHours() < 5;
  const level = levelFor(stickerCount);
  const leveledUp = isNewSticker && level.current.min === stickerCount && stickerCount > 0;

  useEffect(() => {
    if (visible) {
      pop.setValue(0);
      Animated.spring(pop, { toValue: 1, useNativeDriver: true, friction: 5, tension: 80 }).start();
    }
  }, [visible, pop]);

  const base = storyColor(story);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={[styles.sheet, { backgroundColor: colors.surface }]}>
          {CONFETTI.map((c, i) => (
            <AppText key={i} style={[styles.confetti, { left: `${8 + i * 15}%`, top: i % 2 ? 14 : 36 }]}>
              {c}
            </AppText>
          ))}
          <Animated.View
            style={[
              styles.sticker,
              { transform: [{ scale: pop }, { rotate: pop.interpolate({ inputRange: [0, 1], outputRange: ['-25deg', '-6deg'] }) }] },
            ]}
          >
            <LinearGradient colors={[shade(base, 0.35), base]} style={[StyleSheet.absoluteFill, { borderRadius: 999 }]} />
            <AppText style={styles.stickerEmoji}>{story.emoji ?? '📖'}</AppText>
          </Animated.View>

          <AppText variant="display" style={styles.center}>
            {profile.name ? `Hienoa, ${profile.name}!` : 'Hienoa!'}
          </AppText>
          <AppText style={[styles.center, { fontSize: 18 }]} muted>
            {isNewSticker
              ? `Sait uuden tarran: ${story.title}`
              : `Luit sadun ${story.title} taas loppuun.`}
          </AppText>

          {leveledUp ? (
            <View style={[styles.level, { backgroundColor: colors.primarySoft }]}>
              <AppText variant="subtitle" color={colors.primary}>
                {level.current.emoji} Uusi taso: {level.current.title}!
              </AppText>
            </View>
          ) : (
            <AppText variant="caption" muted style={styles.center}>
              🏅 {stickerCount} / {totalStories} tarraa kerätty
            </AppText>
          )}

          <View style={styles.actions}>
            {evening ? (
              <>
                <PrimaryButton label="Hyvää yötä 🌙" onPress={onClose} />
                {nextStory ? <SecondaryButton label={`Vielä yksi: ${nextStory.title}`} onPress={onNext} /> : null}
              </>
            ) : (
              <>
                {nextStory ? <PrimaryButton label={`Seuraava: ${nextStory.title}`} onPress={onNext} /> : null}
                <SecondaryButton label="Valmis" onPress={onClose} />
              </>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(20,16,40,0.55)', justifyContent: 'flex-end' },
  sheet: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
    alignItems: 'stretch',
    maxWidth: 640,
    width: '100%',
    alignSelf: 'center',
  },
  confetti: { position: 'absolute', fontSize: 22, lineHeight: 28 },
  sticker: {
    width: 128,
    height: 128,
    borderRadius: 64,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 6,
    borderColor: '#FFFFFF',
    marginTop: -spacing.xxl - 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  stickerEmoji: { fontSize: 64, lineHeight: 76 },
  center: { textAlign: 'center' },
  level: { borderRadius: radius.pill, paddingVertical: spacing.sm, paddingHorizontal: spacing.md, alignSelf: 'center' },
  actions: { gap: spacing.sm, marginTop: spacing.sm },
});
