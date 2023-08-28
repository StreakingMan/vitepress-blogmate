<script setup lang="ts">
import { usePosts } from '../composables/usePosts';

const posts = usePosts();
const categoryMap = new Map<string, number>();
posts.forEach((p) => {
    const category = p.frontmatter.category;
    if (categoryMap.has(category)) {
        categoryMap.set(category, categoryMap.get(category)! + 1);
    } else {
        categoryMap.set(category, 1);
    }
});

const categories = Array.from(categoryMap.entries())
    .map((t) => t[0])
    .filter((t) => t != undefined);

// 根据文章数量，动态生成面积
</script>

<template>
    <div class="bt-categories-container">
        <div class="bt-categories-gird">
            <div
                v-for="category in categories"
                :key="category"
                class="bt-categories-item"
                :style="{
                    gridColumnStart: `span ${categoryMap.get(category)}`,
                    gridRowStart: `span ${categoryMap.get(category)}`,
                }"
            >
                <a :href="`/categories/${category}.html`">
                    {{ category }}
                </a>
            </div>
        </div>
    </div>
</template>
