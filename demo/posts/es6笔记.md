---
tags: [es6]
category: JavaScript
date: 2020-04-07
---

# 《ECMAScript 6 入门》笔记

> 本文主要为阮一峰[《ECMAScript 6 入门》](https://es6.ruanyifeng.com/#docs)读书笔记以及相关思考，时常更新

### let 和 const

-   区别

    |                                          | var                    | const      | let                    |
    | ---------------------------------------- | ---------------------- | ---------- | ---------------------- |
    | 作用域                                   | 函数                   | 块级       | 块级                   |
    | 变量提升                                 | √                      | -          | -                      |
    | 相同作用域内重复声明                     | 允许                   | 不允许     | 不允许                 |
    | 在全局作用域下声明时是否属于顶层对象属性 | 是                     | 否         | 否                     |
    | 初始化                                   | 默认初始化为 undefined | 必须初始化 | 默认初始化为 undefined |

-   const

    -   声明只读常量
    -   只保证指针固定，故无法维护引用值不变（若要冻结对象，使用 `Object.freeze` ）

-   块级作用域

    -   块级作用域指大括号 `{}` 所包含区域，可嵌套
    -   ES5 规定函数只能在顶层和函数作用域中声明，ES6 规定函数可以在块级作用域中声明
    -   为避免兼容问题，浏览器的 ES6 环境中，会将在块级作用域中声明的函数提升到头部，行为类似于 var（被初始化为 undefined）

-   暂时性死区

    -   在块级作用域内，变量在声明前都无法使用
    -   let 和 const 都存在暂时性死区
    -   冷知识：暂时性死区的出现导致 typeof 运算符不再 100%安全

-   关于顶层对象（全局作用域）

    -   各种环境下的顶层对象

        | 环境       | 顶层对象    |
        | ---------- | ----------- |
        | 浏览器     | window self |
        | Web Worker | self        |
        | Node       | global      |

    -   var 和 function 声明的全局变量属于顶层变量的属性

    -   ES2020 新增 globalThis 用以在不同的环境中获取顶层对象

### 解构赋值

-   左右两边“模式匹配”的情况下，左边变量会被赋予对应的值

-   解构可用于数组（具备 Iterator 接口的结构）和变量

-   只可对可遍历的结构（具备 Iterator 接口的结构，如数组、Set、Generator 函数）进行数组形式的解构赋值

-   解构不成功时，且没有默认值时会被赋值为 undefined

-   只有当某个结构位置的值全等与 undefined 时，默认值才会生效

    ```javascript
    let [x = 1] = [undefined];
    x; // 1

    let [x = 1] = [null];
    x; // null
    ```

-   默认值为表达式时会采用惰性求值的方式

-   默认值可应用已经声明的变量

    ```javascript
    let [x = 1, y = x] = []; // x=1; y=1
    let [x = 1, y = x] = [2]; // x=2; y=2
    let [x = 1, y = x] = [1, 2]; // x=1; y=2
    let [x = y, y = 1] = []; // ReferenceError: y is not defined
    ```

-   对象的解构左侧的表达分为模式和变量，解构对象时内部会先找到跟模式同名的属性，然后赋值给对应的变量
    当模式和变量名相同时可以简写
    ```javascript
    //let { foo: foo, bar: bar } = { foo: 'aaa', bar: 'bbb' };
    let { foo, bar } = { foo: 'aaa', bar: 'bbb' };
    ```
-   对象的解构赋值可取到原型对象的属性

-   解构嵌套对象时，子对象所在的父属性不存在时将会报错。若需要同时解构父属性和其子对象内的属性，需要声明不同的模式

    ```javascript
    const node = {
        loc: {
            start: {
                line: 1,
                column: 5,
            },
        },
    };

    let {
        loc,
        loc: { start },
        loc: {
            start: { line },
        },
    } = node;
    ```

-   字符串解构时会被转化为类数组对象，数值和布尔值解构时会转换为相应的包装对象

-   只有赋值语句的非模式部分，可以使用圆括号

### Proxy

-   修改某些操作默认行为（实现了对语言自身的操作，某种程度上使得 ECMAScript 具备“反射”能力，属于“元编程”范畴）
-   通过 Proxy 构造函数生成实例
    ```javascript
    const proxy = new Proxy(target, handler);
    ```
-   Proxy 的 prototype 为 `undefine` ，故不可用 `instanceof` 操作符检测类型
-   仅可对 Object 做代理，不支持基础类型

    ```javascript
    const proxy = new Proxy(0, {});
    // Uncaught TypeError: Cannot create proxy with a non-object as target or handler
    ```

    看到上述报错，首先联想到的时 vue3 的 ref 将基础类型统一包装为`{value: baseType}`对象是否与此有关（vue3 的文档中对此说明为：保持不同数据类型的行为统一）。
    查看 vue3 源码，`ref()` 最终会进入 `createReactiveObject()`，该方法仅在入参为对象的且内部`proxyMap`不存在该对象时返回该对象的 proxy 实例。
    <kbd>TODO</kbd> vue3 基础类型 ref 后续分析...

-   Proxy 实例可作为其他对象原型
-   handler 支持的拦截操作（拦截不影响目标，即通过拦截进入目标原始操作后仍受原始操作的规则限制）
    -   `get(target, propKey, receiver)`
        -   receiver 为 proxy 实例本身。
        -   将 get 转换为执行函数，并返回当前 proxy 实例，可实现链式操作
    -   `set(target, propKey, value, receiver)`
        -   严格模式下，set 代理如果没有返回 true，就会报错（准确说是返回 falsy 值时会报错）
    -   `has(target, propKey)`
    -   `deleteProperty(target, propKey)`
        -   返回 falsy 值时删除失败
    -   `ownKeys(target)`
        -   返回包含 String 或 Symbol 两种类型值的数组，否则抛错
        -   返回必须包含目标对象的不可配置属性（`configurable: flase`），否则抛错
        -   返回不可拓展目标对象的所有属性（须完全一致）
    -   `getOwnPropertyDescriptor(target, propKey)`
    -   `defineProperty(target, propKey, propDesc)`
    -   `preventExtensions(target)`
        -   只可对未阻止拓展过的目标对象进行拦截更改
    -   `getPrototypeOf(target)`
    -   `isExtensible(target)`
    -   `setPrototypeOf(target, proto)`
    -   `apply(target, object, args)`
    -   `construct(target, args)`
-   revocable 方法
    返回一个可取消的 Proxy 实例，通过调用该实例的 revoke 方法回收，回收后无法访问，适合一些受保护变量的临时访问场景
    ```javascript
    let { proxy, revoke } = Proxy.revocable(target, handler);
    proxy.foo = 123;
    proxy.foo; // 123
    revoke();
    proxy.foo; // TypeError: Revoked
    ```
-   this 指向
    -   目标对象内的 this 会指向该对象的 Proxy 代理实例
    -   handler 内部的 this 指向 handler 对象
