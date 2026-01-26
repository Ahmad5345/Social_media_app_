import { createStackNavigator } from '@react-navigation/stack';
import Feed from '../components/Feed.js';
import Profile from '../components/Profile.js';
import CreatePost from '../components/CreatePost.js';
import ProfileDirectory from '../components/ProfileDirectory.js';
import ProfileEdit from '../components/ProfileEdit.js';
import ProfileHeader from '../components/ProfileHeader.js';

const Stack = createStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator initialRouteName="Feed">
      <Stack.Screen
        name="Feed"
        component={Feed}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreatePost"
        component={CreatePost}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProfileEdit"
        component={ProfileEdit}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProfileDirectory"
        component={ProfileDirectory}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
