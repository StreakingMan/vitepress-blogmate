<script setup lang="ts">
import { usePosts } from '../composables/usePosts';
import { computed, ref } from 'vue';
import { useElementSize, useUrlSearchParams } from '@vueuse/core';
import BTPostCard from './BTPostCard.vue';

const posts = usePosts();

const tagsMap = new Map<string, number>();
posts.forEach((p) => {
    p.frontmatter.tags.forEach((t: string) => {
        if (tagsMap.has(t)) {
            tagsMap.set(t, tagsMap.get(t)! + 1);
        } else {
            tagsMap.set(t, 1);
        }
    });
});
const tags = Array.from(tagsMap.entries()).map((t) => t[0]);

const search = ref('');
const searchedTags = computed(() => {
    return tags.filter((t) => t.includes(search.value));
});

const boxEl = ref(null);
const { height } = useElementSize(boxEl);

const activeTag = ref('');
const { tag: queryTag } = useUrlSearchParams('history');
if (queryTag) {
    const _tag = Array.isArray(queryTag) ? queryTag[0] : queryTag;
    if (tags.includes(_tag)) {
        activeTag.value = _tag;
    }
}
const onTagClick = (tag: string) => {
    if (activeTag.value === tag) {
        activeTag.value = '';
    } else {
        activeTag.value = tag;
    }
};
const filteredPosts = computed(() => {
    if (!activeTag.value) {
        return posts;
    }
    return posts.filter((p) => p.frontmatter.tags.includes(activeTag.value));
});
</script>

<template>
    <div class="bt-tags-container">
        <input v-model="search" placeholder="搜索标签" class="bt-tags-input" />
        <div
            class="bt-tags-box-wrapper"
            :style="{
                height: `${height}px`,
            }"
        >
            <div ref="boxEl" class="bt-tags-box">
                <span
                    v-if="searchedTags.length === 0"
                    class="bt-tags-item"
                    style="font-size: 1.2em"
                >
                    啥也没有~
                </span>
                <a
                    v-for="tag in searchedTags"
                    :key="tag"
                    class="bt-tags-item"
                    :class="{
                        active: activeTag === tag,
                    }"
                    :style="{
                        fontSize: `${1.2 + (tagsMap.get(tag) || 0) * 0.6}em`,
                        animationDelay: `${Math.random() * 0.5}s`,
                    }"
                    @click="onTagClick(tag)"
                >
                    #{{ tag }}
                </a>
            </div>
        </div>

        <BTPostCard v-for="post in filteredPosts" v-bind="post" :key="post.url" />
    </div>
</template>
