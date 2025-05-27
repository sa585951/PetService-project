<template>
<div class="d-flex">
    <div class="review-block" v-for="review in ReviewLines" :key="review.id">
        <div class="row">
            <div class="col-4">
                <h6 class="member">{{ maskName(review.memberName) }} 說:</h6>
            </div>
            <div class="col-8">
                 <div class="review-time">
                    <span v-if="review.updatedAt">更新於</span>
                    {{ (review.updatedAt || review.createdAt).replace('T', ' ') }}
                    
                </div>
            </div>
            <div class="star-box">
                {{ review.roomtype }}
                <img v-for="i in Math.min(review.rating || 0, 5)" :key="'light_' + i" class="star" src="/Hotel/star_light.png"/>
                <img v-for="i in 5 - Math.min(review.rating || 0, 5)" :key="'gray_' + i" class="star" src="/Hotel/star_gray.png"/>
            </div>
        </div>
        <!-- 多行內容顯示 -->
    <div v-for="(line, j) in review.lines" :key="j">
      {{ line }}
    </div>
    </div>
</div>
</template>

<script setup>
    import ReviewEditForm from './HotelReviewEditForm.vue';
    import { ref,defineProps, computed } from 'vue';

    const props = defineProps({
        review: Object, // 單筆評論
    });
console.log("子元件",props.review);

console.log(props.review[0].content);
console.log(props.review[0].memberName);
console.log(props.review[0].createdAt);
console.log(props.review[0].updatedAt);

// 將每筆評論加上分行後的 content（lines）
    const ReviewLines = computed(() => {
        return props.review.map(r => ({
            ...r, //保留全部欄位資料
            lines: r.content?.split(/\n|\\n/) || []
        }));
    });

//隱藏名字
    function maskName(name) {
        if (!name || typeof name !== 'string') return '';

        const len = name.length;

        if (len <= 1) return name;
        if (len === 2) return name[0] + '*';

        return name[0] + '*'.repeat(len - 2) + name[len - 1];
    }
</script>

<style scoped>
.review-block {
  margin-right: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: #f5f5f5;
  border-radius: 8px;
  width: 31.5%;
}

.review-time{
    text-align: right;
    color: rgb(175, 118, 44);
}
.member {
    font-weight: bold;
}
.star {
        width: 20px;
        height: 20px;
    }
.star-box {
    margin-bottom: 5px;
}
</style>
