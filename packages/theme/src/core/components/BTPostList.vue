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

const cardRefs = ref<Ref<ComponentPublicInstance>[]>([]);
const cardVisibleRefs = ref<Ref<boolean>[]>([]);
const textRefs = ref<Ref<ComponentPublicInstance>[]>([]);
const textVisibleRefs = ref<Ref<boolean>[]>([]);

onMounted(() => {
    cardVisibleRefs.value = cardRefs.value.map((r) => useElementVisibility(r));
    textVisibleRefs.value = textRefs.value.map((r) => useElementVisibility(r));
});

const { frontmatter } = useData();
const hasGap = computed(() => {
    return !!(frontmatter as any)?.value?.features?.length;
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
            <div class="card-container">
                <BTPostCard
                    v-for="(post, idx) in list"
                    v-bind="post"
                    :key="post.url"
                    ref="cardRefs"
                    class="fade-in-item"
                    :class="{
                        'fade-in': cardVisibleRefs[idx]?.value,
                    }"
                />
            </div>
            <div class="extra-container">
                <p
                    v-for="(text, idx) in frontmatter.scrollWelcomeText"
                    ref="textRefs"
                    :key="idx"
                    :style="{
                        top: `${3 + idx * 1.2}em`,
                        opacity: textVisibleRefs[idx]?.value ? 1 : 0,
                    }"
                >
                    {{ text }}
                </p>
            </div>
        </div>
    </div>
</template>
