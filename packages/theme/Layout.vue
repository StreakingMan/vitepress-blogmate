<script setup>
import { useData } from 'vitepress';
import NotFound from './NotFound.vue';
import Home from './Home.vue';
import DefaultTheme from 'vitepress/theme';

const { Layout } = DefaultTheme;
const { page, frontmatter } = useData();
</script>

<template>
    <h1>Custom Layout!</h1>

    <NotFound v-if="page.isNotFound" />
    <Home v-if="frontmatter.layout === 'home'" />
    <Layout v-else />
    <!-- <Page /> renders <Content /> -->
</template>
