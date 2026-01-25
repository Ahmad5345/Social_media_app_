import { createStackNavigator } from '@react-navigation/stack';
import MakeMyProfile from '../components/myProfile.js';

const Stack = createStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={MakeMyProfile}
      />
    </Stack.Navigator>
  );
}
