<template>
    <table class="min-w-full bg-white">
        <thead>
            <tr>
                <th class="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">ID</th>
                <th class="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">Username</th>
                <th class="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">Email</th>
                <th class="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">Create_At</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="person in people" :key="person.ID" class="hover:bg-gray-100">
                <td class="px-6 py-4 border-b border-gray-300 text-sm leading-5 text-gray-700">{{ person.ID }}</td>
                <td class="px-6 py-4 border-b border-gray-300 text-sm leading-5 text-gray-700">{{ person.Username }}</td>
                <td class="px-6 py-4 border-b border-gray-300 text-sm leading-5 text-gray-700">{{ person.Email }}</td>
                <td class="px-6 py-4 border-b border-gray-300 text-sm leading-5 text-gray-700">{{ person.Create_at }}</td>
            </tr>
        </tbody>
    </table>
</template>
  
<script setup lang="ts">
    import { ref } from 'vue';

    interface Idatauser {
        ID: number;
        Email: string;
        Username: string;
        Create_at: string;
    }

    const people = ref<Idatauser[]>([]);
    
    try {
        const { data, error } = await useFetch('/api/listuser');
        console.log('data', data.value);
        if (error.value) {
            console.error('Error fetching user list:', error.value);
        } else {
            if (data.value && data.value.data) {
                people.value = data.value.data;
            }else{
                console.error('Information Not Found');
            }
        }
    } catch (error) {
        console.error('Error: ' + error)
    }
    
</script>
  
<style scoped>
.detail_user {
    display: flex;
    gap: 15px;
}
</style>
