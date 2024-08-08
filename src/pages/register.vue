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
      <div v-if="error" class="error-message">{{ error }}</div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  const runtimeConfig = useRuntimeConfig();
  
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
      const response = await $fetch('/api/register',{
        method: 'POST',
        // body: form.value,
        body: JSON.stringify(form.value), 
        headers: {
            'Content-Type': 'application/json', // Specify content type for JSON
        },
      } );
      // alert(response.data.message);
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
            error.value = 'User registered successfully.';
        } 
        // else {
        // console.error('Unexpected status code:', response.statusCode);
        // error.value = 'Unexpected status code received.';
        // }
    } catch (err) {
      if (err.response.status === 400) {

        console.error('Server error:', err.response.data.message || 'Internal server error');
        error.value = err.response.data.message || 'Internal server error';

      } else if (err.response.status === 401) {

        console.error('Server error:', err.response.data.message || 'Internal server error');
        error.value = err.response.data.message || 'Internal server error';
      }
      else {
        console.error('Error:', err.response.data.message || 'An error occurred');
        error.value = err.response.data.message || 'An error occurred';
      }
    } finally {
      
    }
  };
  </script>
  
<style scoped>
.register-container {
  max-width: 400px;
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
form{
  max-width: 80%;
  margin: auto;
}
.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input[type="text"],
input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
}

input[type="checkbox"] {
  margin-right: 10px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.error-message {
  color: red;
  margin-top: 10px;
  text-align: center;
}
</style>