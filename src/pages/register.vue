<template>
  <Header></Header>
  <div class="max-w-md mx-auto custom_form">
    <h2 class="text-center mb-6 font-bold">{{ isLogin ? 'Add User' : 'Register User'}}</h2>
    <p class="error_register text-red-500 text-center">{{ errorMess }}</p>
    <p class="success_register text-center">{{ successMess }}</p>
    <form novalidate v-if="register_submit" @submit.prevent="handleSubmit" class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" >
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
          Username *
        </label>
        <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" v-model="state.username" id="username" type="text" placeholder="Username">
        <p v-if="errorUsername" class="text-red-500 text-xs">{{ errorUsername }}</p>
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
          Email *
        </label>
        <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" v-model="state.email" id="email" type="email" placeholder="Email">
        <p v-if="errorEmail" class="text-red-500 text-xs">{{ errorEmail }}</p>
      </div>
      <div class="mb-6">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
          Password
        </label>
        <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" v-model="state.password" id="password" type="password" placeholder="**********">
        <p v-if="errorPass" class="text-red-500 text-xs">{{ errorPass }}</p>
      </div>
      <div class="mb-6">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="confirmpassword">
          Confirm Password
        </label>
        <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" v-model="state.confirmpassword" id="confirmpassword" type="password" placeholder="**********">
        <p v-if="errorCfPass" class="text-red-500 text-xs">{{ errorCfPass }}</p>
      </div>
      <div v-if="isLogin" class="mb-6">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="role">
          Role
        </label>
        <div class="relative mb-3">
          <select class="mb-0 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" v-model="state.role" id="role">
            <option value="" disabled>Select a role</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M7 10l5 5 5-5H7z"/></svg>
          </div>
        </div>
        <p v-if="errorRole" class="text-red-500 text-xs">{{ errorRole }}</p>
      </div>
      <div class="mb-4" v-if="!isLogin">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="remember">
          <input class="mr-2 leading-tight" id="remember" type="checkbox" v-model="state.remember">
          Agree term
        </label>
        <p v-if="errorAgree" class="text-red-500 text-xs">{{ errorAgree }}</p>
      </div>
      <div class="flex items-center justify-center">
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
          {{ isLogin ? 'Add' : 'Register'}} 
        </button>
      </div>
    </form>
    <div  v-if="check_submit" class="overlay" >
      <img src="../assets/images/loading.gif" alt="" class="m-auto">
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
await authStore.loadFromCookie()
// const isLogin = computed(() => authStore.isLoggedIn)
const isLogin = authStore.isLoggedIn;


const state = reactive({
  username: '',
  email: '',
  password: '',
  confirmpassword: '',
  role: isLogin ? '' : 'user',
  remember: isLogin ? true : false,
});
const check_submit = ref(false);
const register_submit = ref(true);
const errorUsername = ref('');
const errorEmail = ref('');
const errorRole = ref('');
const errorPass = ref('');
const errorCfPass = ref('');
const errorAgree = ref('');
const errorMess = ref('');
const successMess = ref('');

const validateForm = () => {
  let isValid = true;
  errorUsername.value = '';
  errorEmail.value = '';
  errorPass.value = '';
  errorCfPass.value = '';
  errorAgree.value = '';
  errorRole.value = '';

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;
  const validLocalPartRegex = /^[a-zA-Z0-9._%+-]+$/;
  const validDomainPartRegex = /^[a-zA-Z0-9.-]+$/;
  const localPart = state.email.split('@')[0];
  const domainPart = state.email.split('@')[1];
  
  const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>[\]\/\\~`';\-_=+])[A-Za-z\d!@#$%^&*(),.?":{}|<>[\]\/\\~`';\-_=+]{8,}$/;

  if (!state.username.trim()) {
    errorUsername.value = 'Username is required.';
    isValid = false;
  }
  if (!state.email.trim()) {
    errorEmail.value = 'Email is required.';
    isValid = false;
  } else if (!emailRegex.test(state.email) || !validLocalPartRegex.test(localPart) || !validDomainPartRegex.test(domainPart)) {
    errorEmail.value = 'Email is invalid.';
    isValid = false;
  }
  if (!state.password) {
    errorPass.value = 'Password is required.';
    isValid = false;
  } else if (!passRegex.test(state.password)) {
    errorPass.value = 'Password must contain capital letters, numbers, special characters and be at least 8 characters long';
    isValid = false;
  }
  if (!state.confirmpassword) {
    errorCfPass.value = 'Confirm Password is required.';
    isValid = false;
  }
  if (state.password !== state.confirmpassword) {
    errorCfPass.value = 'Passwords do not match.';
    isValid = false;
  }
  if (!state.remember && !isLogin) {
    errorAgree.value = 'You must agree to the terms.';
    isValid = false;
  }
  if (!state.role) {
    errorRole.value = 'Role is required.';
    isValid = false;
  }

  return isValid;
};


const handleSubmit = async () => {
  console.log('isLogin: ' + isLogin);
  
  if (validateForm()) {
    try {
      check_submit.value = true;
      console.log('role',state.role);
      // console.log('state.remember',state.remember);
      const apiUrl = isLogin ? '/api/adduser' : '/api/register';
      const { data, error } = await useFetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: state.username,
          email: state.email,
          password: state.password,
          confirmpassword: state.confirmpassword,
          role: state.role,
          remember: state.remember,
        }),
      });

      
      check_submit.value = false;
      if (error.value) {
        console.error('Error:', error.value);
      } else {
        if(data.value.status === 200){
          successMess.value = data.value.message;
          register_submit.value = false;
          errorMess.value = '';
        } else if (data.value.status === 403){
          errorMess.value = data.value.message;
        } else {
          console.log('error request');
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  }
};
</script>
<style scoped>
  .custom_form {
    h2 {
      color: green;
      font-size: 30px;
    }
  }
  .overlay {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, 0);
  }
  .success_register {
    color: green;
  }
  .error_register {
    color: red;
  }
</style>
