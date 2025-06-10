<template>
    <div class="container d-flex justify-content-center mt-5">
        <div class="col-md-10">
            <h2 class="text-center mb-4">公告</h2>

            <div v-for="(category, cIndex) in sortedNewsData" :key="category.category">
                <h4 class="mt-4 mb-2 border-bottom pb-1">{{ category.category }}</h4>

                <div class="accordion" :id="'accordion' + cIndex">
                    <div class="accordion-item" v-for="(item, index) in category.newsList" :key="item.id">
                        <h2 class="accordion-header" :id="`heading${cIndex}-${index}`">
                            <button class="accordion-button" :class="{ collapsed: activeItem !== item.id }"
                                type="button" @click="toggleItem(item.id)">
                                <span class="bold-title">
                                    {{ item.title }}
                                </span>
                            </button>
                        </h2>
                        <div class="accordion-collapse" v-show="activeItem === item.id">
                            <div class="accordion-body">
                                <router-link :to="`/newsdetail/${item.id}`" class="see-more-link no-underline">
                                    {{ item.content.slice(0, 20) }}...
                                </router-link>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'News',
    data() {
        return {
            newsData: [],
            activeItem: null,
        };
    },
    computed: {
        sortedNewsData() {
            const priority = ['寵物旅館', '寵物散步'];
            return [...this.newsData].sort((a, b) => {
                const aIndex = priority.indexOf(a.category);
                const bIndex = priority.indexOf(b.category);
                if (aIndex === -1 && bIndex === -1) return 0;
                if (aIndex === -1) return 1;
                if (bIndex === -1) return -1;
                return aIndex - bIndex;
            });
        }
    },
    mounted() {
        axios.get('https://localhost:7089/api/News/GetNewsTitle')
            .then(response => {
                this.newsData = response.data;
            })
            .catch(error => {
                console.error('載入公告資料失敗:', error);
            });
    },
    methods: {
        toggleItem(id) {
            this.activeItem = this.activeItem === id ? null : id;
        }
    }
};
</script>

<style scoped>
.see-more-link.no-underline {
    text-decoration: none !important;
}

.bold-title {
    font-weight: bold;
}

.accordion-button {
    font-weight: 600;
}
</style>
