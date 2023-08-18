<script setup lang="ts">
import { onMounted } from 'vue';
import {
    Body,
    Bodies,
    Common,
    Composite,
    Engine,
    Mouse,
    MouseConstraint,
    Render,
    Runner,
    Vertices,
} from 'matter-js';
import * as PolyDecomp from 'poly-decomp-es';

Common.setDecomp(PolyDecomp);

// matter-js的random方法是伪随机，这里重写一个
const random = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
};

onMounted(() => {
    const WIDTH = window.innerWidth;
    const HEIGHT = window.innerHeight / 2;

    // create engine
    const engine = Engine.create({
        positionIterations: 10,
        velocityIterations: 10,
    });

    const world = engine.world;

    // create renderer
    const render = Render.create({
        element: document.getElementById('box') || undefined,
        engine: engine,
        options: {
            width: WIDTH,
            height: HEIGHT,
            wireframes: false,
            background: 'transparent',
        },
    });

    Render.run(render);

    // create runner
    const runner = Runner.create({
        isFixed: true,
    });
    Runner.run(runner, engine);

    const colors = ['#f19648', '#f5d259', '#f55a3c', '#063e7b', '#ececd1'];
    const fourPath =
        '0,0 10,0 10,30 30,30 30,0 40,0 40,60 30,60 30,40 0,40 0,0';
    const zeroPath =
        '0,0 40,0 40,60 0,60 0,1 10,11 10,50 30,50 30,10 10,10 0,0';
    const genPathBody = (x: number, y: number, path: string): Body => {
        return Bodies.fromVertices(
            x,
            y,
            // @ts-ignore
            Vertices.fromPath(path),
            {
                render: {
                    fillStyle: Common.choose(colors),
                    strokeStyle: Common.choose(colors),
                    lineWidth: 1,
                },
                restitution: Common.random(0.5, 1),
            },
            true
        );
    };

    const four1 = genPathBody(WIDTH / 2 - 240, 100, fourPath);
    Body.scale(four1, 2, 2);
    Body.rotate(four1, random(-20, 20));
    const zero = genPathBody(WIDTH / 2 - 40, 100, zeroPath);
    Body.scale(zero, 2, 2);
    Body.rotate(zero, random(-20, 20));
    const four2 = genPathBody(WIDTH / 2 + 160, 100, fourPath);
    Body.scale(four2, 2, 2);
    Body.rotate(four2, random(-20, 20));

    Composite.add(world, four1);
    Composite.add(world, zero);
    Composite.add(world, four2);

    Composite.add(world, [
        // walls
        Bodies.rectangle(WIDTH / 2, HEIGHT, WIDTH, 20, {
            isStatic: true,
            restitution: 1,
            render: {
                fillStyle: 'transparent',
            },
        }),
    ]);

    // add mouse control
    const mouse = Mouse.create(render.canvas),
        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false,
                },
            },
        });

    Composite.add(world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;

    // fit the render viewport to the scene
    Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: WIDTH, y: HEIGHT },
    });
});
</script>

<template>
    <div class="VPNotFound">
        <div id="box"></div>
        <button>back home</button>
    </div>
</template>

<style scoped>
.VPNotFound {
    position: absolute;
    inset: var(--vp-nav-height) 0 0;
    flex-direction: column;
    display: flex;
    align-items: center;
}
</style>
