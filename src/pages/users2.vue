<template>
    <div>
      <h1>Registered Users</h1>
      <ul>
        <li v-for="user in users" :key="user.email">{{ user.username }} - {{ user.email }}</li>
      </ul>
      <div v-if="error">{{ error }}</div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useNuxtApp } from '#app';
  
  const users = ref([]);
  const error = ref<string | null>(null);
  
  const fetchUsers = async () => {
    try {
    //   const { data } = await $fetch(runtimeConfig.public.apiBase + '/users');
    const data = await $fetch('http://localhost:1873/api/users');  
    // users.value = data.body;
    if (data.statusCode === 200) {
      console.log('Success:', data.body);
      users.value = data.body; 
    } else {
      console.error('Unexpected status code:', data.statusCode);
      error.value = 'Unexpected status code received.';
    }
    } catch (err) {
        // Handle errors during fetch
        if (err.response) {
        if (err.response.statusCode === 500) {
            console.error('Server error:', err.response.body.message || 'Internal server error');
            error.value = err.response.body.message || 'Internal server error';
        } else {
            console.error('Error:', err.response.body.message || 'An error occurred');
            error.value = err.response.body.message || 'An error occurred';
        }
        } else {
        // Handle errors that are not HTTP errors
        console.error('Error:', err.message || 'An unexpected error occurred');
        error.value = err.message || 'An unexpected error occurred';
        }
    }
  };
  
  onMounted(fetchUsers);
  </script>
  