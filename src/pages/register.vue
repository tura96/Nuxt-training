<template>
    <div>
      <h1>Register</h1>
      <form @submit.prevent="submitForm">
        <div>
          <label for="username">Username:</label>
          <input type="text" v-model="form.username" required />
        </div>
        <div>
          <label for="email">Email:</label>
          <input type="email" v-model="form.email" required />
        </div>
        <div>
          <label for="password">Password:</label>
          <input type="password" v-model="form.password" required />
        </div>
        <div>
          <label for="confirmPassword">Confirm Password:</label>
          <input type="password" v-model="form.confirmPassword" required />
        </div>
        <div>
          <label for="agreeTerms">
            <input type="checkbox" v-model="form.agreeTerms" /> I agree to the terms and conditions
          </label>
        </div>
        <button type="submit">Register</button>
      </form>
      <div v-if="error">{{ error }}</div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  interface Form {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    agreeTerms: boolean;
  }
  
  const form = ref<Form>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });
  
  const error = ref<string | null>(null);
  
  const submitForm = async () => {
    console.log('Data submitted : ' + form.value)
    try {
      error.value = null;
      const response = await $fetch('http://localhost:1873/api/register',{
        method: 'POST',
        // body: form.value,
        body: JSON.stringify(form.value), 
        headers: {
            'Content-Type': 'application/json', // Specify content type for JSON
        },
      } );
      alert(response.data.message);
      if (response.statusCode === 201) {
        console.log('Success:', response.body);
            // Clear the form
            form.value = {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            agreeTerms: false,
            };
        } else {
        console.error('Unexpected status code:', response.statusCode);
        error.value = 'Unexpected status code received.';
        }
    } catch (err) {
        if (err.response.statusCode === 500) {
            console.error('Server error:', err.response.body.message || 'Internal server error');
            error.value = err.response.body.message || 'Internal server error';
        } else {
            console.error('Error:', err.response.body.message || 'An error occurred');
            error.value = err.response.body.message || 'An error occurred';
        }
    }
  };
  </script>
  