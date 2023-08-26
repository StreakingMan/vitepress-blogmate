<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    name: string;
}>();

// 根据标签名称生成颜色，名称相同的标签颜色相同
// 生成颜色控制在中性，兼容亮色和暗色主题
const color = computed(() => {
    const hash = props.name.split('').reduce((acc, cur) => {
        return acc + cur.charCodeAt(0);
    }, 0);
    const hue = hash % 360;
    return `hsl(${hue}, 50%, 50%)`;
});
</script>

<template>
    <a
        class="bt-tag-link"
        :href="`/tags.html?tag=${name}`"
        :style="{
            color,
        }"
    >
        #{{ name }}
    </a>
</template>
