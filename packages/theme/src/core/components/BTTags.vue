<script setup lang="ts">
import { usePosts } from '../composables/usePosts';

const posts = usePosts();
</script>

<template>
    <div>{{ posts.map((p) => p.frontmatter.tag) }}</div>
</template>

<style scoped></style>
