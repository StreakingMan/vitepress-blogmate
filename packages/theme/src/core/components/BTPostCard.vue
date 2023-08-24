<script setup lang="ts">
import type { ContentDataExtra } from '../composables/posts.data';
import { computed, onMounted, ref, watchEffect } from 'vue';

const props = defineProps<ContentDataExtra>();

const date = computed(() => {
    return new Date(props.lastUpdated);
});
const isoDatetime = computed(() => {
    return date.value.toISOString();
});
const datetime = ref('');

onMounted(() => {
    watchEffect(() => {
        datetime.value = new Intl.DateTimeFormat(undefined, {
            dateStyle: 'short',
            timeStyle: 'short',
        }).format(date.value);
    });
});
</script>

<template>
    <div class="bt-post-card">
        <div class="bt-post-card-title">
            {{ title }}
        </div>
        <div class="bt-post-card-meta">
            <time :datetime="isoDatetime">✏️ {{ lastUpdated === 0 ? '尚未提交' : datetime }}</time>
            <span>⏰ About {{ readingTime }} min </span>
            <span>🏷️ {{ frontmatter.tags.join(' ') }}</span>
        </div>
        <div class="bt-post-card-excerpt" v-html="excerpt"></div>
    </div>
</template>
