/**
 * PressableScale: painettava alue, joka "joustaa" hieman painettaessa.
 * Pieni animaatio saa sovelluksen tuntumaan elävältä ja laadukkaalta.
 */
import React, { useRef } from 'react';
import { Animated, Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import { tapFeedback } from '@/utils/haptics';

interface Props extends Omit<PressableProps, 'style'> {
  style?: StyleProp<ViewStyle>;
  /** Tyyli uloimmalle kosketusalueelle (esim. flex: 1 ruudukossa). */
  outerStyle?: StyleProp<ViewStyle>;
  /** Kuinka paljon kutistuu painettaessa (0.96 = 4 %). */
  scaleTo?: number;
  haptic?: boolean;
  children: React.ReactNode;
}

export function PressableScale({ style, outerStyle, scaleTo = 0.96, haptic = true, onPress, children, ...rest }: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const to = (v: number) =>
    Animated.spring(scale, { toValue: v, useNativeDriver: true, speed: 40, bounciness: 6 }).start();

  return (
    <Pressable
      {...rest}
      style={outerStyle}
      onPressIn={() => to(scaleTo)}
      onPressOut={() => to(1)}
      onPress={(e) => {
        if (haptic) tapFeedback();
        onPress?.(e);
      }}
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>{children}</Animated.View>
    </Pressable>
  );
}
