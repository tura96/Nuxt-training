<template>
  <div class="users-container">
    <h1>Registered Users 2</h1>
    <ul class="users-list">
      <li v-for="user in users" :key="user.email" class="user-item">{{ user.username }} - {{ user.email }}</li>
    </ul>
    <div v-if="error" class="error-message">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRuntimeConfig } from '#app';
import { nextTick } from 'vue';

const users = ref([]);
const error = ref<string | null>(null);
const runtimeConfig = useRuntimeConfig();

const fetchUsers = async () => {
  error.value=''
  try {
    const { data, error: fetchError } = await useFetch('/api/users');
    
    // console.log('Data:', data.value);
    if (data && data.value) {
      console.log('Success:', data.value.body);
      users.value = data.value.body;
    } else {
      if (fetchError) {
        throw fetchError;
      }
      console.error('Unexpected response structure');
      error.value = 'Unexpected response structure.';
    }
  } catch (err) {
    // Handle errors during fetch
    if (err.response) {
      if (err.response.status === 500) {
        console.error('Server error:', err.response.data.message || 'Internal server error');
        error.value = err.response.data.message || 'Internal server error';
      } else {
        console.error('Error:', err.response.data.message || 'An error occurred');
        error.value = err.response.data.message || 'An error occurred';
      }
    } else {
      // Handle errors that are not HTTP errors
      console.error('Error:', err.message || 'An unexpected error occurred');
      error.value = err.message || 'An unexpected error occurred';
    }
  } finally {
      
  }
};

// onMounted(fetchUsers);
onMounted(async () => {
await nextTick();
await fetchUsers();
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
