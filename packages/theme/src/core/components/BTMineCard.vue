<script setup lang="ts">
import { useData } from 'vitepress';
import VPNavBarSocialLinks from 'vitepress/dist/client/theme-default/components/VPNavBarSocialLinks.vue';
import type { Config } from '../../vitepress';
import { computed } from 'vue';

const { theme, frontmatter } = useData<Config>();
const mineInfo = computed<Config['mineInfo']>(() => theme.value.mineInfo);
</script>

<template>
    <div v-if="theme.mineInfo && frontmatter.layout !== 'home'" class="bt-mine-card">
        <div class="bt-mine-card-header">
            <img class="bt-mine-card-avatar" :src="mineInfo?.avatar" alt="avatar" />
            <div class="bt-mine-card-title">
                {{ mineInfo?.title }}
            </div>
        </div>
        <div class="bt-mine-card-description">{{ mineInfo?.description }}</div>
        <div class="flex-1">
            <div class="bt-mine-card-skills">
                <div
                    v-for="(skill, idx) in mineInfo?.skills || []"
                    :key="skill"
                    class="bt-mine-card-skill"
                    :style="{
                        transitionDelay: `${idx * 0.1}s`,
                    }"
                >
                    {{ skill }}
                </div>
            </div>
        </div>
        <VPNavBarSocialLinks v-if="mineInfo?.showSocialLinks" class="social-links" />
    </div>
</template>

<style lang="scss">
.bt-mine-card {
    --card-normal-size: 64px;
    --card-hover-size: 240px;
    --avatar-normal-size: 54px;
    --avatar-hover-size: 72px;

    @apply fixed flex flex-col gap-[8px] p-[4px]
        right-[-1px] top-[var(--vp-nav-height)] w-[var(--card-normal-size)] h-[var(--card-normal-size)]
        rounded-l-[50%] border border-[var(--vp-c-divider)]
        transition-all will-change-[width,height,border-radius,padding]
        overflow-hidden z-[20]
        backdrop-blur-[2px];

    &-avatar {
        @apply w-[var(--avatar-normal-size)] h-[var(--avatar-normal-size)]
            self-start object-cover rounded-[50%] blur-[2px]
            transition-all will-change-[width,height,border-radius,filter];
    }

    &-header {
        @apply flex gap-[8px] items-end;
    }

    &-title {
        @apply font-bold opacity-0 transition-opacity;
    }

    &-description {
        @apply w-[calc(var(--card-hover-size)_-_16px)]
            transition-opacity duration-[0.4s] opacity-0 text-[14px];
    }

    &-skills {
        @apply flex flex-wrap gap-[4px];
    }

    &-skill {
        @apply bg-[var(--vp-c-bg-alt)]
            px-[4px] py-[2px]
            rounded-[4px] opacity-0 scale-[0.3]
            leading-[16px] text-[12px]
            transition-all will-change-[transform,opacity];
    }

    .social-links {
        @apply justify-start
            bg-[var(--vp-c-bg-alt)] rounded-[8px]
            translate-y-[200%] transition-transform duration-500 will-change-transform;
    }

    &:hover {
        @apply rounded-l-[8px] p-[8px]
            w-[var(--card-hover-size)] h-[var(--card-hover-size)];

        .bt-mine-card-avatar {
            @apply w-[var(--avatar-hover-size)] h-[var(--avatar-hover-size)]
                blur-none rounded-[4px];
        }

        .bt-mine-card-title,
        .bt-mine-card-description {
            @apply opacity-100;
        }

        .social-links {
            @apply translate-y-0;
        }

        .bt-mine-card-skill {
            @apply opacity-100 scale-100;
        }
    }
}
</style>
