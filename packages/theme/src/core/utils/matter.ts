import { Body, Engine, Events } from 'matter-js';

// 膨胀动画
export const matterExpand = (body: Body, scale: number, widthCache: Map<Body, number>) => {
    // 初始宽度
    const initialWidth = body.bounds.max.x - body.bounds.min.x;
    if (scale === 1) {
        widthCache.set(body, initialWidth);
        return;
    }
    // 动画持续的时间（以帧为单位）
    const animationFrames = 60;
    // 计算每帧应该缩放的增量 既 n 次方根
    const scaleIncrement = Math.pow(scale, 1 / animationFrames);

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
};

// 回正动画
export const matterShrink = (body: Body, engine: Engine): (() => void) => {
    const targetAngle = 0;
    const listener = () => {
        const currentAngle = body.angle; // 当前角度
        let rotationSpeed = 0.2; // 旋转速度

        // 计算角度差
        const angleDifference = targetAngle - currentAngle;

        // 如果角度差大于旋转速度，继续旋转
        if (Math.abs(angleDifference) > rotationSpeed) {
            const rotationDirection = angleDifference > 0 ? 1 : -1;
            Body.setAngle(body, currentAngle + rotationDirection * rotationSpeed);
            if (rotationSpeed > 0.02) rotationSpeed -= 0.002;
        }
    };

    Events.on(engine, 'beforeUpdate', listener);
    return () => {
        Events.off(engine, 'beforeUpdate', listener);
    };
};

// 向上抛
export const matterThrowUp = (body: Body, engine: Engine): (() => void) => {
    let force = 0.01;
    const listener = () => {
        Body.applyForce(body, body.position, {
            x: 0,
            y: -force * body.mass,
        });
        force += 0.0001;
    };
    Events.on(engine, 'beforeUpdate', listener);
    return () => {
        Events.off(engine, 'beforeUpdate', listener);
    };
};
