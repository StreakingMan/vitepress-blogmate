<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { Ref, ComponentPublicInstance } from 'vue';
import type { ContentDataExtra } from '../composables/posts.data';
import BTPostCard from './BTPostCard.vue';
import { useElementVisibility } from '@vueuse/core';
import { useData } from 'vitepress';

defineProps<{
    list: ContentDataExtra[];
}>();

const itemRefs = ref<Ref<ComponentPublicInstance>[]>([]);
const visibleRefs = ref<Ref<boolean>[]>([]);

onMounted(() => {
    visibleRefs.value = itemRefs.value.map((r) => useElementVisibility(r));
});

const { frontmatter } = useData();
const hasGap = computed(() => {
    return !!(frontmatter as any)?.features?.length;
});
</script>

<template>
    <div class="bt-post-list">
        <div
            class="container"
            :style="{
                marginTop: hasGap ? '48px' : '0',
            }"
        >
            <BTPostCard
                v-for="(post, idx) in list"
                v-bind="post"
                :key="post.url"
                ref="itemRefs"
                class="fade-in-item"
                :class="{
                    'fade-in': visibleRefs[idx]?.value,
                }"
            />
        </div>
    </div>
</template>
