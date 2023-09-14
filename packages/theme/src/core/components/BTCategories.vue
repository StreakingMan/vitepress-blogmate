<script setup lang="ts">
import { usePosts } from '../composables/usePosts';
import { onMounted, ref } from 'vue';
import { Engine, World, Bodies, Body } from 'matter-js';

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

// categoryMap重新映射分布到1～4之间
const max = Math.max(...Array.from(categoryMap.values()));
categoryMap.forEach((v, k) => {
    categoryMap.set(k, Math.ceil((v / max) * 3) + 1);
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
}
const engine = Engine.create({
    gravity: {
        x: 0,
        y: 0,
    },
});
onMounted(() => {
    const itemRects: Rect[] = [];

    itemRefs.value.forEach((item) => {
        const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = item.firstChild as HTMLElement;
        itemRects.push({
            x: offsetLeft + offsetWidth / 2,
            y: offsetTop + offsetHeight / 2,
            width: offsetWidth,
            height: offsetHeight,
        });
    });

    const world = engine.world;
    for (const rect of itemRects) {
        const body = Bodies.rectangle(rect.x, rect.y, rect.width, rect.height, {
            restitution: 0.6,
            friction: 0.5,
        });
        World.add(world, body);
    }

    for (const body of world.bodies) {
        const category = itemRefs.value[world.bodies.indexOf(body)].firstChild!.textContent!;
        const scale = categoryMap.get(category)!;
        body.mass = scale;
        setTimeout(() => {
            expand(body, scale);
        }, 1000 * Math.random());
    }

    // 边框
    const ground = Bodies.rectangle(
        window.innerWidth / 2,
        window.innerHeight * 0.75,
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

    // 膨胀动画
    // 缓存宽度值，matter没法直接获取旋转后的宽度
    const widthCache = new Map<Body, number>();
    function expand(body: Body, scale: number) {
        // 动画持续的时间（以帧为单位）
        const animationFrames = 60;
        // 计算每帧应该缩放的增量 既 n 次方根
        const scaleIncrement = Math.pow(scale, 1 / animationFrames);
        // 初始宽度
        const initialWidth = body.bounds.max.x - body.bounds.min.x;

        // 逐帧缩放
        const _update = () => {
            const lastWidth = widthCache.get(body) || body.bounds.max.x - body.bounds.min.x;
            if (lastWidth < initialWidth * scale) {
                Body.scale(body, scaleIncrement, scaleIncrement);
                widthCache.set(body, lastWidth * scaleIncrement);
                requestAnimationFrame(_update);
            }
        };
        _update();
    }

    function update() {
        Engine.update(engine);
        for (let i = 0; i < itemRects.length; i++) {
            const body = world.bodies[i];
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
