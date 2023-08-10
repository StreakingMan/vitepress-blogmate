<script setup>
import { useData } from 'vitepress';
import NotFound from './NotFound.vue';
import DefaultTheme from 'vitepress/theme';

const { Layout } = DefaultTheme;
const { page, frontmatter } = useData();
console.log(page, frontmatter);
</script>

<template>
    <Layout>
        <template #not-found>
            <NotFound />
        </template>
    </Layout>
</template>
