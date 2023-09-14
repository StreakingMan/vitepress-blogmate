<script setup lang="ts">
import { usePosts } from '../composables/usePosts';
import { onMounted, ref } from 'vue';

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

// categoryMap重新映射分布到1～3
const max = Math.max(...Array.from(categoryMap.values()));
categoryMap.forEach((v, k) => {
    categoryMap.set(k, (v / max) * 2 + 1);
});

const categories = Array.from(categoryMap.entries())
    .map((t) => t[0])
    .filter((t) => t != undefined);

const itemRefs = ref<HTMLElement[]>([]);
onMounted(() => {
    itemRefs.value.forEach((item) => {
        const a = item.firstChild as HTMLElement;
        console.log(a.offsetTop, a.offsetLeft, a.offsetWidth, a.offsetHeight);
    });
});
</script>

<template>
    <div class="bt-categories-container">
        <div class="bt-categories-gird">
            <div
                v-for="category in categories"
                :key="category"
                ref="itemRefs"
                class="bt-categories-item"
            >
                <a :href="`/categories/${category}.html`">
                    {{ category }}
                </a>
            </div>
        </div>
    </div>
</template>
