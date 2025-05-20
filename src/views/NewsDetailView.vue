<template>
    <div class="container mt-5">
        <div v-if="newsItem">
            <h2>{{ newsItem.title }}</h2>
            <p class="mt-3">{{ newsItem.content }}</p>
        </div>
        <div v-else>
            <p>⚠️ 無法找到該公告。</p>
        </div>
        <router-link to="/news" class="btn btn-outline-primary mt-4">返回公告列表</router-link>
    </div>
</template>

<script>
import { newsData } from '@/data/newsData';

export default {
    data() {
        return {
            newsItem: null
        };
    },
    created() {
        const id = Number(this.$route.params.id);
        for (const category of newsData) {
            const found = category.items.find(item => item.id === id);
            if (found) {
                this.newsItem = found;
                break;
            }
        }
    }
};
</script>
<style scoped></style>