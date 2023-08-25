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

const activeTags = ref(new Set());
const { tag: queryTag } = useUrlSearchParams('history');
if (queryTag) {
    const _tags = (Array.isArray(queryTag) ? queryTag[0] : queryTag).split(',');
    _tags.forEach((t) => activeTags.value.add(t));
}
const onTagClick = (tag: string) => {
    if (activeTags.value.has(tag)) {
        activeTags.value.delete(tag);
    } else {
        activeTags.value.add(tag);
    }
    const tags = Array.from(activeTags.value);
    if (tags.length) {
        history.replaceState(null, '', `/tags.html?tag=${tags.join(',')}`);
    } else {
        history.replaceState(null, '', '/tags.html');
    }
};
const filteredPosts = computed(() => {
    if (!activeTags.value.size) {
        return posts;
    }
    // 所有标签都要匹配
    return posts.filter((p) => {
        return Array.from(activeTags.value).every((t) => p.frontmatter.tags.includes(t));
    });
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
                    #啥也没有~
                </span>
                <a
                    v-for="tag in searchedTags"
                    :key="tag"
                    class="bt-tags-item"
                    :class="{
                        active: activeTags.has(tag),
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
