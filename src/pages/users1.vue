<template>
    <div class="users-container">
      <h1>Registered Users 1</h1>
      <ul class="users-list">
        <li v-for="user in users.body" :key="user.email" class="user-item" >{{ user.username }} - {{ user.email }}</li>
      </ul>
      <div v-if="error" class="error-message">{{ error }}</div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useAsyncData } from '#app';
  const runtimeConfig = useRuntimeConfig();
  const { data: users, error: fetchError } = useAsyncData('users', () => $fetch('/api/users'));
  
  // Use refs to handle potential null values or reactivity issues
  const error = ref<string | null>(null);
  
  onMounted(() => {
    console.log(users.value)
    if (fetchError.value) {
      error.value = fetchError.value.message || 'An error occurred while fetching users.';
    }
  });
  </script>

  <style scoped>
  .users-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #f9f9f9;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  h1 {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .users-list {
    list-style-type: none;
    padding: 0;
  }
  
  .user-item {
    padding: 10px;
    border-bottom: 1px solid #ddd;
  }
  
  .user-item:last-child {
    border-bottom: none;
  }
  
  .no-users-message,
  .error-message {
    color: red;
    margin-top: 10px;
    text-align: center;
  }
  </style>
  