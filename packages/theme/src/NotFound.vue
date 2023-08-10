<script setup lang="ts">
import Matter from 'matter-js';
import { onMounted } from 'vue';

onMounted(() => {
    var Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Composites = Matter.Composites,
        Common = Matter.Common,
        MouseConstraint = Matter.MouseConstraint,
        Mouse = Matter.Mouse,
        Composite = Matter.Composite,
        Bodies = Matter.Bodies;

    // create engine
    var engine = Engine.create({
        positionIterations: 10,
        velocityIterations: 10,
    });

    var world = engine.world;

    // create renderer
    var render = Render.create({
        element: document.getElementById('box') || undefined,
        engine: engine,
        options: {
            width: 800,
            height: 600,
        },
    });

    Render.run(render);

    // create runner
    var runner = Runner.create({
        isFixed: true,
    });
    Runner.run(runner, engine);

    // add bodies
    var scale = 0.3;

    var stack = Composites.stack(40, 40, 38, 18, 0, 0, function (x, y) {
        var sides = Math.round(Common.random(1, 8));

        switch (Math.round(Common.random(0, 1))) {
            case 0:
                if (Common.random() < 0.8) {
                    return Bodies.rectangle(
                        x,
                        y,
                        Common.random(25, 50) * scale,
                        Common.random(25, 50) * scale
                    );
                } else {
                    return Bodies.rectangle(
                        x,
                        y,
                        Common.random(80, 120) * scale,
                        Common.random(25, 30) * scale
                    );
                }
            case 1:
                return Bodies.polygon(
                    x,
                    y,
                    sides,
                    Common.random(25, 50) * scale
                );
        }
    });

    Composite.add(world, stack);

    Composite.add(world, [
        // walls
        Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
        Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
        Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
        Bodies.rectangle(0, 300, 50, 600, { isStatic: true }),
    ]);

    // add mouse control
    var mouse = Mouse.create(render.canvas),
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
        max: { x: 800, y: 600 },
    });
});
</script>

<template>
    <div class="bm-not-found">
        <div id="box"></div>
        <div>this is not found</div>
    </div>
</template>
