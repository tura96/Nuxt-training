import { defineStore } from 'pinia'
import Cookies from 'js-cookie'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    username: '',
    isLoggedIn: false,
  }),
  actions: {
    setUser(username: string) {
      this.username = username;
      this.isLoggedIn = true;
      this.saveToCookie();
    },
    logout() {
      this.username = '';
      this.isLoggedIn = false;
      this.saveToCookie();
    },
    saveToCookie() {
      if (process.client) {
        const authData = {
          username: this.username,
          isLoggedIn: this.isLoggedIn,
        };
        Cookies.set('auth', JSON.stringify(authData), { expires: 1 });
      }
    },
    loadFromCookie() {
      if (process.client) {
        const authData = Cookies.get('auth');
        if (authData) {
          const parsedAuthData = JSON.parse(authData);
          this.username = parsedAuthData.username;
          this.isLoggedIn = parsedAuthData.isLoggedIn;
        }else{
          this.username = '';
          this.isLoggedIn = false;
        }
      }
    }
  },
})
