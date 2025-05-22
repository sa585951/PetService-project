<template>
    <div class="container d-flex justify-content-center mt-5">
        <div class="col-md-10">
            <h2 class="text-center mb-4">公告</h2>

            <div v-for="(category, cIndex) in newsData" :key="category.category">
                <h4 class="mt-4 mb-2 border-bottom pb-1">{{ category.emoji }} {{ category.category }}</h4>

                <div class="accordion" :id="'accordion' + cIndex">
                    <div class="accordion-item" v-for="(item, index) in category.items" :key="item.id">
                        <h2 class="accordion-header" :id="`heading${cIndex}-${index}`">
                            <button class="accordion-button" :class="{ collapsed: activeItem !== item.id }"
                                type="button" @click="toggleItem(item.id)">
                                <span class="text-dark">
                                    {{ item.title }}
                                </span>
                            </button>
                        </h2>
                        <div class="accordion-collapse" v-show="activeItem === item.id">
                            <div class="accordion-body">
                                <router-link :to="`/newsdetail/${item.id}`" class="see-more-link">
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
import { newsData } from '@/data/newsData';

export default {
    name: 'NewsView',
    data() {
        return {
            newsData,
            activeItem: null, // 控制目前展開的 ID
        };
    },
    methods: {
        toggleItem(id) {
            // 如果點到目前展開的，就收起；否則展開新項目
            this.activeItem = this.activeItem === id ? null : id;
        },
    },
};
</script>
<style scoped>
.see-more-link {
    color: #4169e1;
    /* Bootstrap 主藍 */
    font-weight: 600;
    text-decoration: none;
    border-radius: 4px;
    transition: all 0.3s ease;
    font-size: 1rem;
}

.see-more-link:hover {
    text-decoration: underline;
    /* 加底線 */
}
</style>
