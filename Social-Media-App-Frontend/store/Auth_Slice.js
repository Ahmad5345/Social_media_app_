import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:9090/api/auth';

export default function createAuthSlice(set) {
  return {
    authenticated: false,
    user: null,
    justSignedUp: false,

    loadUser: async () => {
      const token = await AsyncStorage.getItem('token');
      const user = await AsyncStorage.getItem('user');
      if (token && user) {
        set((userState) => {
          // eslint-disable-next-line no-param-reassign
          userState.authSlice.authenticated = true;
          userState.authSlice.user = user ? JSON.parse(user) : null;
          userstate.authSlice.justSignedUp = false;
        });
      }
    },

    signinUser: async (fields, navigation) => {
      try {
        const response = await axios.post(`${API_URL}/signin`, fields);
        const { token, user } = response.data;
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));

        set((userState) => {
          // eslint-disable-next-line no-param-reassign
          userState.authSlice.authenticated = true;
          userState.authSlice.user = user;
          userState.authSlice.justSignedUp = false;
        });
      } catch (error) {
        console.log(`Error frontend signinUser: ${error}`);
      }
    },

    signupUser: async (fields) => {
      try {
        const response = await axios.post(`${API_URL}/signup`, fields);
        const { token, user } = response.data;
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));

        set((userState) => {
          // eslint-disable-next-line no-param-reassign
          userState.authSlice.authenticated = true;
          userState.authSlice.user = user;
          userState.authSlice.justSignedUp = true;
        });
      } catch (error) {
        console.log(`Error frontend signupUser: ${error}`);
      }
    },
    logout: async () => {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      set((userState) => {
        // eslint-disable-next-line no-param-reassign
        userState.authSlice.authenticated = false;
        userState.authSlice.user = null;
      });
    },
    clearJustSignedUp: () =>
      set((state) => {
        state.authSlice.justSignedUp = false;
      }),
  };
}
