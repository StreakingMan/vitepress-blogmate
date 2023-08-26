<script setup lang="ts">
import type { ContentDataExtra } from '../composables/posts.data';
import { computed, onMounted, ref, watchEffect } from 'vue';
import BTTag from './BTTag.vue';

const props = defineProps<ContentDataExtra>();

const date = computed(() => {
    return new Date(props.frontmatter?.date || props.lastUpdated);
});
const isoDatetime = computed(() => {
    return date.value.toISOString();
});
const datetime = ref('');

onMounted(() => {
    watchEffect(() => {
        datetime.value = new Intl.DateTimeFormat(undefined, {
            dateStyle: 'short',
        }).format(date.value);
    });
});
</script>

<template>
    <a :href="url" class="bt-post-card">
        <article class="bt-post-card-box">
            <div class="bt-post-card-title">
                {{ title }}
            </div>
            <div class="bt-post-card-meta">
                <time :datetime="isoDatetime">
                    更新时间: {{ lastUpdated === 0 ? '尚未提交' : datetime }}
                </time>
                <span>阅读约 {{ readingTime }} 分钟 </span>

                <BTTag v-for="tag in frontmatter.tags || []" :key="tag" :name="tag" />
            </div>
            <div class="bt-post-card-excerpt" v-html="excerpt"></div>
        </article>
    </a>
</template>
