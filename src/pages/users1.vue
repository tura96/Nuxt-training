<template>
    <div>
      <h1>Registered Users</h1>
      <ul>
        <li v-for="user in users.body" :key="user.email">{{ user.username }} - {{ user.email }}</li>
      </ul>
      <div v-if="error">{{ error }}</div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useAsyncData } from '#app';
  
  const { data: users, error: fetchError } = useAsyncData('users', () => $fetch('http://localhost:1873/api/users'));
  
  // Use refs to handle potential null values or reactivity issues
  const error = ref<string | null>(null);
  
  onMounted(() => {
    console.log(users.value)
    if (fetchError.value) {
      error.value = fetchError.value.message || 'An error occurred while fetching users.';
    }
  });
  </script>
  