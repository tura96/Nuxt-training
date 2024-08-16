<template>
    <div class="max-w-md mx-auto mt-10"  >
      <h2 class="text-center mb-6 font-bold" >Login</h2>
      <p class="error_register text-red-500 text-center">{{ errorMess }}</p>
      <p class="success_register text-center">{{ successMess }}</p>
      <form novalidate @submit.prevent="submitForm" class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" >
        <div class="mb-4" :style="{ display: isVerifyCode ? 'none' : 'block' }">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
            Email *
          </label>
          <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" v-model="state.email" id="email" type="email" placeholder="Email">
          <p v-if="errorEmail" class="text-red-500 text-xs">{{ errorEmail }}</p>
        </div>
        <div class="mb-6" :style="{ display: isVerifyCode ? 'none' : 'block' }">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
            Password
          </label>
          <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" v-model="state.password" id="password" type="password" placeholder="**********">
          <p v-if="errorPass" class="text-red-500 text-xs">{{ errorPass }}</p>
        </div>
        
        <div class="mb-4" :style="{ display: isVerifyCode ? 'none' : 'block' }">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="remember">
            <input class="mr-2 leading-tight" id="remember" type="checkbox" v-model="state.remember">
            Remember me
          </label>
          <p v-if="errorAgree" class="text-red-500 text-xs">{{ errorAgree }}</p>
        </div>
        <div class="mb-6" v-if="isVerifyCode">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="code">
                2FA Code *
            </label>
            <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" v-model="state.code" id="code" type="text" placeholder="">
            <p v-if="errorCode" class="text-red-500 text-xs">{{ errorCode }}</p>
        </div>
        <div class="flex items-center justify-center">
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
            Submit 
          </button>
        </div>
      </form>
      <div v-if="check_submit" class="overlay" >
        <img src="../assets/images/loading.gif" alt="" class="m-auto">
      </div>
      <!-- <div   class="overlay custom_pt" >
        <img src="../assets/images/loading.gif" alt="" class="m-auto">
      </div> -->
      <Loading v-if="check_reload"></Loading>
    </div>
  </template>
  
<script setup>
import { ref, reactive, computed  } from 'vue';
import axios, { AxiosError }  from "axios";
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth'
const router = useRouter();
const authStore = useAuthStore()
await authStore.loadFromCookie()
// console.log('authStore.isLoggedIn',authStore.isLoggedIn);
const checkLogin = ref(true);

//  if (authStore.isLoggedIn) {
//    checkLogin.value = false;
//    router.push({ path: '/dashboard', replace: true });
//  }

const isVerifyCode = ref(false);
const state = reactive({
  email: '',
  password: '',
  code: '',
  remember: false,
});

const check_submit = ref(false);
const check_reload = ref(true);

const errorEmail = ref('');
const errorPass = ref('');
const errorCode = ref('');
const errorAgree = ref('');
const errorMess = ref('');
const successMess = ref('');
const clientIp = ref('');

  
const validateForm = () => {
let isValid = true;
errorEmail.value = '';
errorPass.value = '';
errorCode.value = '';

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;
const validLocalPartRegex = /^[a-zA-Z0-9._%+-]+$/;
const validDomainPartRegex = /^[a-zA-Z0-9.-]+$/;
const localPart = state.email.split('@')[0];
const domainPart = state.email.split('@')[1];
const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>[\]\/\\~`';\-_=+])[A-Za-z\d!@#$%^&*(),.?":{}|<>[\]\/\\~`';\-_=+]{8,}$/;

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
    errorMess.value = 'Account or password is incorrect!';
    isValid = false;
}
return isValid;
};
  
const submitForm = async () => {
    const userAgent = navigator.userAgent;
    const verifyCode = state.code;
    
    const requestLogin = async () => {
        if (validateForm()) {
            errorMess.value = '';
            successMess.value = '';
            check_submit.value = true;
            const res = await useFetch('/api/login',{
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: state.email,
                    password: state.password,
                    clientIp: clientIp.value,
                    userAgent: userAgent
                }),
            });
            console.log('resul1111t', res.data.value);
            
            if( typeof res.data != 'undefined' ) {
                const response = res.data.value;
                check_submit.value = false;
                if (response.status == true) {
                    isVerifyCode.value = true;
                    successMess.value = response.message;
                    if (state.remember) {
                        localStorage.setItem('savedEmail', state.email);
                        localStorage.setItem('savedPassword', state.password);
                    } else {
                        localStorage.removeItem('savedEmail');
                        localStorage.removeItem('savedPassword');
                    }
                } else {
                    errorMess.value = response.message;
                }
            }
        }
    }

    const verifyLogin = async () => {
        if( isVerifyCode.value ) {
            check_submit.value = true;
            const res = await useFetch('/api/sentcode',{
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: state.email,
                    password: state.password,
                    clientIp: clientIp.value,
                    userAgent: userAgent,
                    code: verifyCode
                }),
            });
            check_submit.value = false;
            const response = res.data.value;
            
            if (response.status == true) {
                console.log(response.body);
                const setUserName = response.body.userName;
                authStore.setUser(setUserName);

                // console.log('usernameTest',authStore.username);
                // console.log('isLoggedIn',authStore.isLoggedIn);
                
                router.push({ path: '/dashboard', replace: true });
            } else {
                errorMess.value = response.message;
            }
        }
    }

    try {
        if( isVerifyCode.value ) {
            await verifyLogin();
        }else{
            await requestLogin();
        }
    } catch (error) {
    console.error(error);
    }
};

  const getIpAddress = async () => {
      try {
          const response = await axios.get("https://api.ipify.org/?format=json");
          if(response.data){
              const { ip } = response.data;
              clientIp.value = ip;
              return ip;
          }
      } catch (error) {
          console.error('Error getting client IP:', error);
          throw error; // Re-throw the error to handle it outside the function if needed
      }
  };

  onMounted(async () => {
    check_reload.value = false;
    await getIpAddress();
    
    const savedEmail = localStorage.getItem('savedEmail');
    const savedPassword = localStorage.getItem('savedPassword');
    if (savedEmail && savedPassword) {
        state.email = savedEmail;
        state.password = savedPassword;
        state.remember = true;
    }
  });
</script>
  <style scoped>
    .overlay {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, 0);
      &.custom_pt {
        top: 0;
        background: #ffffff;
        img {
          position: relative;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
    .success_register {
      color: green;
    }
    .error_register {
      color: red;
    }
  </style>
  