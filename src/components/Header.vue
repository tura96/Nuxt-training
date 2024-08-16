<template>
    <div v-if="isLogin" class="header">
        <div class="main_header">
            <div class="action_header">
                <div class="left_header">
                    <NuxtLink to="/register" class="custom_logo"><h2>Add User</h2></NuxtLink>
                    <NuxtLink to="/dashboard"><h2 class="home">Dashboard</h2></NuxtLink>
                </div>
                <div class="right_header">
                    <h3>Hi, <span>{{ userName }}</span></h3>
                    <p>|</p>
                    <h4 class="ac_logout " @click="logout">Log Out</h4>
                </div>
                
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router';
const router = useRouter();
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
await authStore.loadFromCookie()

const userName = computed(() => authStore.username)
const isLogin = computed(() => authStore.isLoggedIn)
// console.log('isLogin', isLogin.value);



const logout = async () => {
    try {
        const { data, error } = await useFetch('/api/logout', {
            method: 'GET',
            headers: {
                Accept: "*/*",
            },
        });

        if (error.value) {
            console.error('Error:', error.value);
        } else if (data.value?.status) {
            authStore.logout();
            router.push('/login');
        } else {
            console.log('Error logging out');
        }
    } catch (err) {
        console.error('Unexpected Error:', err);
    }
};

</script>
<style scoped>
.main_header {
    display: block;
    width: 100%;
    padding: 20px 60px;
    .action_header {
        display: flex;
        justify-content: space-between;
        .right_header {
            display: flex;
            gap: 10px;
            .ac_logout {
                cursor: pointer;
            }
            h3 {
                span {
                    color: green;
                }
            }
        }
        .left_header {
            display: flex;
            gap: 20px;
            h2 {
                padding: 5px 10px;
                background: green;
                color: #ffffff;
                border-radius: 7px;
                &.home {
                    background: #5b5b5b;
                }
            }
        }
    }
}

</style>