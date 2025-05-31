<template>
  <div class="container d-flex justify-content-center mt-5">
    <div class="col-md-10">
      <h2 class="text-center mb-4">常見問題</h2>

      <div v-if="loading" class="text-center">
        載入中...
      </div>

      <div v-if="error" class="alert alert-danger">
        載入失敗：{{ error }}
      </div>

      <div v-for="(category, cIndex) in qaData" :key="category.category" class="mb-4">
        <h4 class="mb-3">{{ category.category }}</h4>

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

      <div v-if="!loading && qaData.length === 0" class="text-center text-muted">
        尚無常見問題資料
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'QA',
  data() {
    return {
      qaData: [],
      loading: false,
      error: null,
    };
  },
  mounted() {
    axios.get('https://localhost:7089/api/Qa/GetAllQa')
      .then(response => {
        this.qaData = this.sortCategories(response.data);
      })
      .catch(error => {
        console.error('載入失敗:', error);
      });
  },
  methods: {
    sortCategories(data) {
      const priority = ['寵物旅館', '寵物散步'];
      return data.sort((a, b) => {
        const aIndex = priority.indexOf(a.category);
        const bIndex = priority.indexOf(b.category);
        if (aIndex === -1 && bIndex === -1) return 0;
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        return aIndex - bIndex;
      });
    }
  },
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
