<template>
    <div class="container mt-5">
        <div v-if="loading" class="text-center">
            <p>載入中...</p>
        </div>
        <div v-else-if="error" class="text-danger text-center">
            <p>發生錯誤：{{ error }}</p>
        </div>
        <div v-else>
            <h2 class="mb-3">{{ news.title }}</h2>
            <p>{{ news.content }}</p>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'NewsDetail',
    data() {
        return {
            news: {},
            loading: true,
            error: null,
        };
    },
    mounted() {
        const id = this.$route.params.id;
        axios.get(`https://localhost:7089/api/News/GetById/${id}`)
            .then(response => {
                this.news = response.data;
                this.loading = false;
            })
            .catch(error => {
                console.error('載入詳細資料失敗:', error);
                this.error = '找不到該公告或伺服器錯誤';
                this.loading = false;
            });
    },
};
</script>
<style scoped></style>