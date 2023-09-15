<script setup lang="ts">
import { usePosts } from '../composables/usePosts';
import { onMounted, ref, watch } from 'vue';
import { Engine, World, Bodies, Body } from 'matter-js';
import { matterExpand, matterShrink, matterThrowUp } from '../utils/matter';

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

// categoryMap重新映射分布到1～3之间
const max = Math.max(...Array.from(categoryMap.values()));
categoryMap.forEach((v, k) => {
    categoryMap.set(k, Math.ceil((v / max) * 3));
});

const categories = Array.from(categoryMap.entries())
    .map((t) => t[0])
    .filter((t) => t != undefined);

const itemRefs = ref<HTMLElement[]>([]);
interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
    text: string;
}
const engine = Engine.create({
    gravity: {
        x: 0,
        y: 0,
    },
});
const world = engine.world;
const categoryBodies: Body[] = [];
const itemRects: Rect[] = [];
onMounted(() => {
    itemRefs.value.forEach((item) => {
        const { offsetLeft, offsetTop, offsetWidth, offsetHeight, innerText } =
            item.firstChild as HTMLElement;
        itemRects.push({
            x: offsetLeft + offsetWidth / 2,
            y: offsetTop + offsetHeight / 2,
            width: offsetWidth,
            height: offsetHeight,
            text: innerText,
        });
    });

    // 缓存宽度值，matter没法直接获取旋转后的宽度
    const widthCache = new Map<Body, number>();
    for (const rect of itemRects) {
        const body = Bodies.rectangle(rect.x, rect.y, rect.width, rect.height, {
            restitution: 0.6,
            friction: 1,
        });
        categoryBodies.push(body);
        World.add(world, body);
        const category = rect.text;
        const scale = categoryMap.get(category)!;
        body.mass = scale;
        matterExpand(body, scale, widthCache);
    }

    // 输入框
    const input = inputRef.value!;
    const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = input;
    const inputBody = Bodies.rectangle(
        offsetLeft + offsetWidth / 2,
        offsetTop + offsetHeight / 2,
        offsetWidth,
        offsetHeight,
        {
            isStatic: true,
        }
    );
    World.add(world, inputBody);

    // 边框
    const ground = Bodies.rectangle(
        window.innerWidth / 2,
        window.innerHeight * 0.85,
        window.innerWidth,
        100,
        {
            isStatic: true,
        }
    );
    const leftWall = Bodies.rectangle(0, window.innerHeight / 2, 100, window.innerHeight, {
        isStatic: true,
    });
    const rightWall = Bodies.rectangle(
        window.innerWidth,
        window.innerHeight / 2,
        100,
        window.innerHeight,
        {
            isStatic: true,
        }
    );
    const topWall = Bodies.rectangle(window.innerWidth / 2, 0, window.innerWidth, 100, {
        isStatic: true,
    });

    World.add(world, [ground, leftWall, rightWall, topWall]);

    function update() {
        Engine.update(engine);
        for (let i = 0; i < itemRects.length; i++) {
            const body = categoryBodies[i];
            const item = itemRefs.value[i];
            const { x: matterX, y: matterY } = body.position;
            const angle = body.angle;
            const matterWidth = widthCache.get(body) || body.bounds.max.x - body.bounds.min.x;
            const { x: initX, y: initY, width: initWidth } = itemRects[i];
            // @ts-ignore
            item.firstChild.style.transform = `translate(${matterX - initX}px, ${
                matterY - initY
            }px) scale(${matterWidth / initWidth}) rotate(${angle}rad)`;
        }
        requestAnimationFrame(update);
    }

    update();
});

const inputRef = ref<HTMLInputElement>();
const searchValue = ref('');
const throwUpCancels: (() => void)[] = [];
const shrinkCancels: (() => void)[] = [];
watch(searchValue, (v) => {
    engine.gravity.y = 1;
    for (const fn of [...throwUpCancels, ...shrinkCancels]) {
        fn();
    }
    for (let i = 0; i < itemRects.length; i++) {
        const category = itemRects[i].text;
        const body = categoryBodies[i];
        const isSearch = category.toLowerCase().includes(v.toLowerCase());
        if (!v || !isSearch) {
            body.timeScale = 1;
        } else if (isSearch) {
            throwUpCancels.push(matterThrowUp(body, engine));
            throwUpCancels.push(matterShrink(body, engine));
            body.timeScale = 0.5;
        }
    }
});

const gravityUp = ref(true);
const toggleGravity = () => {
    if (gravityUp.value) {
        gravityUp.value = false;
        engine.gravity.y = 1;
    } else {
        gravityUp.value = true;
        engine.gravity.y = -0.1;
    }
};

// 时间减速
const timeScale = ref(1);
const toggleTimeScale = () => {
    if (timeScale.value == 1) {
        timeScale.value = 0.1;
    } else {
        timeScale.value = 1;
    }
    engine.timing.timeScale = timeScale.value;
};
</script>

<template>
    <div class="bt-categories-container" @click="toggleGravity" @dblclick="toggleTimeScale">
        <input ref="inputRef" v-model="searchValue" class="bt-categories-input" @click.stop />
        <div class="bt-categories-gird">
            <div
                v-for="category in categories"
                :key="category"
                ref="itemRefs"
                class="bt-categories-item"
            >
                <a :href="`/categories/${category}.html`" @click.stop>
                    {{ category }}
                </a>
            </div>
        </div>
    </div>
</template>
