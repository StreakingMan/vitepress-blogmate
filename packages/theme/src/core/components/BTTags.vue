<script setup lang="ts">
import { usePosts } from '../composables/usePosts';
import { computed, ref } from 'vue';

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
</script>

<template>
    <div class="bt-tags-container">
        <input v-model="search" placeholder="搜索标签" class="bt-tags-input" />
        <div class="bt-tags-box-wrapper">
            <div class="bt-tags-box">
                <span v-if="searchedTags.length === 0" class="bt-tags-item">啥也没有</span>
                <a
                    v-for="tag in searchedTags"
                    :key="tag"
                    class="bt-tags-item"
                    :style="{
                        fontSize: `${1.2 + (tagsMap.get(tag) || 0) * 0.6}em`,
                        animationDelay: `${Math.random() * 0.5}s`,
                    }"
                >
                    #{{ tag }}
                </a>
            </div>
        </div>
    </div>
</template>
