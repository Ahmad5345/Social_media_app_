import { createStackNavigator } from '@react-navigation/stack';
import CompleteProfile from '../components/CompleteProfile.js';

const Stack = createStackNavigator();

export default function OnboardingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CompleteProfile" component={CompleteProfile} />
    </Stack.Navigator>
  );
}
