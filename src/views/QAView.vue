<template>
    <div class="container d-flex justify-content-center mt-5">
        <div class="col-md-10">
            <h2 class="text-center mb-4">常見問題</h2>

            <div v-for="(category, cIndex) in qaData" :key="category.category" class="mb-4">
                <h4 class="mb-3">{{ category.emoji }}{{ category.category }}</h4>

                <div class="accordion" :id="'qaAccordion' + cIndex">
                    <div class="accordion-item" v-for="(item, index) in category.qaList" :key="index">
                        <h2 class="accordion-header" :id="`heading${cIndex}-${index}`">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                :data-bs-target="`#collapse${cIndex}-${index}`" aria-expanded="false"
                                :aria-controls="`collapse${cIndex}-${index}`">
                                {{ item.question }}
                            </button>
                        </h2>
                        <div :id="`collapse${cIndex}-${index}`" class="accordion-collapse collapse"
                            :aria-labelledby="`heading${cIndex}-${index}`" :data-bs-parent="`#qaAccordion${cIndex}`">
                            <div class="accordion-body">
                                {{ item.answer }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import { qaData } from '@/data/qaData';

export default {
    name: 'QAView',
    data() {
        return {
            qaData
        };
    }
};
</script>

<style scoped>
h4 {
    color: #495057;
}

.accordion-button {
    font-weight: 600;
}

.accordion-button:not(.collapsed) {
    background-color: #e7f1ff;
    color: #0d6efd;
}
</style>
