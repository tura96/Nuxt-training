import axios from "axios";

///wp-json/jwt-auth/v1/token
export default defineNuxtPlugin(nuxtApp => {
  const runtimeConfig = useRuntimeConfig();
  const axiosInstance = axios.create({
      baseURL: runtimeConfig.public.apiBase + 'wp-json/',
      headers: {
          Accept: 'application/json',
          // Content-Type: 'application/json'
      },
      paramsSerializer: {
        indexes: null,
      },
  });

  axiosInstance.interceptors.request.use(function (config) {
    //config.headers['Content-Type'] = `Bearer 1`;
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

  axiosInstance.interceptors.response.use(function (response) {
    if( response.status == 200 ) {
      var evt = new Event("alt_load", {"bubbles": true, "cancelable": false});
      document.dispatchEvent(evt);
    }
    
    return response.data;
  }, function (error) {
    if( typeof error.response.data != 'undefined' ) {
      //alert(error.response.data.message);
    }
    
    return Promise.reject(error.response.data);
  });

  return {
    provide: {
      apiGuest: axiosInstance
    }
  }
})