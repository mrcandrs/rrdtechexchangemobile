import React, { createContext, useContext, useMemo, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme';

type FeedbackType = 'success' | 'error' | 'info';

type FeedbackContextValue = {
  showMessage: (message: string, type?: FeedbackType) => void;
};

const FeedbackContext = createContext<FeedbackContextValue | null>(null);

export function FeedbackProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<{ text: string; type: FeedbackType } | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const insets = useSafeAreaInsets();

  const value = useMemo<FeedbackContextValue>(() => {
    return {
      showMessage: (text, type = 'info') => {
        setMessage({ text, type });
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          setMessage(null);
        }, 2800);
      },
    };
  }, []);

  const bg =
    message?.type === 'success'
      ? 'rgba(56,214,123,0.92)'
      : message?.type === 'error'
        ? 'rgba(255,77,77,0.92)'
        : 'rgba(18,214,230,0.9)';

  return (
    <FeedbackContext.Provider value={value}>
      {children}
      {message ? (
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: 16,
            right: 16,
            bottom: Math.max(26, insets.bottom + 88),
            borderRadius: 12,
            paddingHorizontal: 14,
            paddingVertical: 12,
            backgroundColor: bg,
            borderWidth: 1,
            borderColor: colors.border2,
          }}
        >
          <Text style={{ color: '#051014', fontWeight: '900' }}>{message.text}</Text>
        </View>
      ) : null}
    </FeedbackContext.Provider>
  );
}

export function useFeedback() {
  const ctx = useContext(FeedbackContext);
  if (!ctx) throw new Error('useFeedback must be used within FeedbackProvider');
  return ctx;
}
