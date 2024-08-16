<template>
    <Header></Header>
    <div v-if="isLogin" class="container mx-auto p-4 list_user">
        <h3 class="text-2xl font-bold mb-4 text-center text-green-500">List User</h3>
        <div class="overflow-x-auto">
            <ItemUser v-if="userData.length" :data="userData"></ItemUser>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue';
import ItemUser from "../components/User/ItemUser.vue";
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
authStore.loadFromCookie()

const isLogin = computed(() => authStore.isLoggedIn)


const router = useRouter();
const route = useRoute();

interface Idatauser {
    ID: number;
    Email: string;
    Username: string;
    Create_at: string;
}

const userData = ref<Idatauser[]>([]);

const fetchData = async () => {
    try {
        const { data, error } = await useFetch('/api/listuser');
        if (error.value) {
            router.push('/login');
        } else {
            if (data.value && data.value.data) {
                userData.value = data.value.data;
            } else {
                console.error('Information Not Found');
            }
        }
    } catch (error) {
        console.error('Error: ' + error)
        router.push('/login');
    }
}

// Sử dụng watchEffect để gọi lại hàm fetchData khi route thay đổi
watchEffect(() => {
    if (isLogin.value) {
        fetchData();
    }
});
</script>
