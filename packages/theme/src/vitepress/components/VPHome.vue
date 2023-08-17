<script setup lang="ts">
import { BTMineCard } from '../../core';
import { useData } from 'vitepress';
import type { Config } from '../config';

const { theme } = useData<Config>();
</script>

<template>
    <div>This is Home 2</div>
    <BTMineCard v-if="theme.mineInfo" />
</template>

<style scoped></style>
