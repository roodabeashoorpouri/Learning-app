import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const INK = '#0f2744';
const TRACK = 'rgba(15,39,68,0.12)';

type Props = {
  /** Progress fraction 0–1 */
  progress: number;
};

export function ProgressBar({ progress }: Props) {
  const width = useSharedValue(progress);

  useEffect(() => {
    width.value = withTiming(progress, { duration: 300 });
  }, [progress, width]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${Math.min(width.value * 100, 100)}%`,
  }));

  return (
    <View style={styles.track}>
      <Animated.View style={[styles.fill, fillStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 10,
    borderRadius: 5,
    backgroundColor: TRACK,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 5,
    backgroundColor: INK,
  },
});
