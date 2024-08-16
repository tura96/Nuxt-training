<template>
    <table class="min-w-full bg-white">
        <thead>
            <tr>
                <th class="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">ID</th>
                <th class="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">Username</th>
                <th class="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">Email</th>
                <th class="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">Role</th>
                <th class="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">Create_At</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(item, index) in data" :key="item.ID" class="hover:bg-gray-100">
                <td class="px-6 py-4 border-b border-gray-300 text-sm leading-5 text-gray-700">{{ item.ID }}</td>
                <td class="px-6 py-4 border-b border-gray-300 text-sm leading-5 text-gray-700">{{ item.Username }}</td>
                <td class="px-6 py-4 border-b border-gray-300 text-sm leading-5 text-gray-700">{{ item.Email }}</td>
                <td class="px-6 py-4 border-b border-gray-300 text-sm leading-5 text-gray-700">{{ item.Role }}</td>
                <td class="px-6 py-4 border-b border-gray-300 text-sm leading-5 text-gray-700">{{ item.Create_at }}</td>
            </tr>
        </tbody>
    </table>
</template>

<script setup lang="ts">
    const props = defineProps(["data"]);
    const data = props.data;
</script>

<style scoped>
.detail_user {
    display: flex;
    gap: 15px;
}
</style>