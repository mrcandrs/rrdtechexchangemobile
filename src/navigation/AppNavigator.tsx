import React, { useMemo, useState } from 'react';
import { Modal, Pressable, Text } from 'react-native';
import { NavigationContainer, DarkTheme, type Theme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme';
import { Screen } from '../components/Screen';
import { FloatingActionButton } from '../components/FAB';
import { GlassCard } from '../components/Glass';
import { DashboardScreen } from '../screens/DashboardScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { BudgetScreen } from '../screens/BudgetScreen';
import { ChallengesScreen } from '../screens/ChallengesScreen';
import { AddExpenseModal } from '../modals/AddExpenseModal';
import { NewBudgetModal } from '../modals/NewBudgetModal';
import { NewChallengeModal } from '../modals/NewChallengeModal';
import { useAuth } from '../auth/AuthContext';
import { useFeedback } from '../feedback/FeedbackContext';

export type RootTabParamList = {
  Dashboard: undefined;
  History: undefined;
  Budget: undefined;
  Challenges: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const navTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.bg0,
    card: 'rgba(15,20,25,0.92)',
    border: 'rgba(255,255,255,0.08)',
    text: colors.text,
    primary: colors.cyan2,
  },
};

export function AppNavigator() {
  const insets = useSafeAreaInsets();
  const { canModifyAll } = useAuth();
  const { showMessage } = useFeedback();
  const [fabOpen, setFabOpen] = useState(false);
  const [expenseOpen, setExpenseOpen] = useState(false);
  const [budgetOpen, setBudgetOpen] = useState(false);
  const [challengeOpen, setChallengeOpen] = useState(false);

  const tabBarStyle = useMemo(
    () => ({
      height: 70 + insets.bottom,
      paddingBottom: Math.max(insets.bottom, 10),
      paddingTop: 10,
      backgroundColor: 'rgba(12,16,20,0.92)',
      borderTopColor: 'rgba(255,255,255,0.08)',
    }),
    [insets.bottom],
  );

  return (
    <NavigationContainer theme={navTheme}>
      <Screen>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarShowLabel: true,
            tabBarLabelStyle: { fontSize: 10, fontWeight: '800' },
            tabBarActiveTintColor: colors.cyan2,
            tabBarInactiveTintColor: 'rgba(233,238,243,0.45)',
            tabBarStyle,
            tabBarIcon: ({ color, size, focused }) => {
              const s = size ?? 18;
              const name: keyof typeof MaterialCommunityIcons.glyphMap =
                route.name === 'Dashboard'
                  ? 'view-dashboard-outline'
                  : route.name === 'History'
                    ? 'clock-outline'
                    : route.name === 'Budget'
                      ? 'wallet-outline'
                      : 'trophy-outline';
              return <MaterialCommunityIcons name={name} size={focused ? s + 1 : s} color={color} />;
            },
          })}
        >
          <Tab.Screen
            name="Dashboard"
            children={({ navigation }) => <DashboardScreen onSeeAll={() => navigation.navigate('History')} />}
          />
          <Tab.Screen name="History" component={HistoryScreen} />
          <Tab.Screen name="Budget" component={BudgetScreen} />
          <Tab.Screen name="Challenges" component={ChallengesScreen} />
        </Tab.Navigator>

        <FloatingActionButton onPress={() => setFabOpen(true)} bottomInset={insets.bottom} />

        <Modal visible={fabOpen} transparent animationType="fade" onRequestClose={() => setFabOpen(false)}>
          <Pressable
            onPress={() => setFabOpen(false)}
            style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', padding: 18, justifyContent: 'flex-end' }}
          >
            <Pressable onPress={() => {}} style={{ alignSelf: 'flex-end', width: 260 }}>
              <GlassCard padding={12}>
                <Text style={{ color: colors.text, fontWeight: '900', marginBottom: 10 }}>Quick actions</Text>
                <ActionRow
                  icon="plus-circle-outline"
                  title="Add Expense"
                  onPress={() => {
                    setFabOpen(false);
                    setExpenseOpen(true);
                  }}
                />
                <ActionRow
                  icon="wallet-plus-outline"
                  title="Create Budget"
                  onPress={() => {
                    if (!canModifyAll) {
                      showMessage('Only the main admin can manage budgets.', 'error');
                      return;
                    }
                    setFabOpen(false);
                    setBudgetOpen(true);
                  }}
                />
                <ActionRow
                  icon="target-variant"
                  title="Start Challenge"
                  onPress={() => {
                    if (!canModifyAll) {
                      showMessage('Only the main admin can manage challenges.', 'error');
                      return;
                    }
                    setFabOpen(false);
                    setChallengeOpen(true);
                  }}
                />
              </GlassCard>
            </Pressable>
          </Pressable>
        </Modal>

        <AddExpenseModal visible={expenseOpen} onClose={() => setExpenseOpen(false)} />
        <NewBudgetModal visible={budgetOpen} onClose={() => setBudgetOpen(false)} />
        <NewChallengeModal visible={challengeOpen} onClose={() => setChallengeOpen(false)} />
      </Screen>
    </NavigationContainer>
  );
}

function ActionRow({
  icon,
  title,
  onPress,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 10,
        backgroundColor: pressed ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
        borderWidth: 1,
        borderColor: colors.border,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginTop: 8,
      })}
    >
      <MaterialCommunityIcons name={icon} size={18} color={colors.cyan2} />
      <Text style={{ color: colors.text, fontWeight: '800' }}>{title}</Text>
    </Pressable>
  );
}

