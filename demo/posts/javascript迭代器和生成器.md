---
tags: [iterator, generator]
category: JavaScript
date: 2022-03-31
---

# JavaScript 迭代器和生成器

`async await`的原理是什么？第一次听到这个问题是有点懵逼，这还有原理吗？但得知`async await`
其实是生成器的语法糖时，才发现自己平时对生成器几乎没有关注，还是得好好学习一番。

## 迭代器，Iterator

很多资料迭代器和生成器都是放在一起讲的，两个都是 ES6 推出的高级特性，规范将任何实现了`Iterable`
接口的对象都称之为可迭代对象，可以通过迭代器`Iterator`进行消费。

一些内置的类型，如`String`，`Array`，` Map`，`Set`，`arguments`对象，`NodeList`都
实现了`Iterable`接口，他们的`Symbol.iterator`属性都实现了迭代器工厂函数：

```javascript
const arr = [1, 2, 3];
console.log(arr[Symbol.iterator]); // f values() {[native code]}
```

以上这些都称为可迭代对象，以下这些行为能消费可迭代对象

-   `for-of`
-   `[...arr]` `const [a,b,c] = arr`
-   `Array.from`
-   `new Map(array)`，`new Set(array)`
-   `Promise.all()`，`Promise.race()`
-   `yield*`

迭代器需要返回一个`next()`方法，调用该方法返回`{done:Boolean,value:any}`，基于此便可自定义迭代器：

```javascript
class PetsHome {
    constructor(pets) {
        this.pets = [...pets];
    }
    [Symbol.iterator]() {
        let idx = -1;
        let pets = this.pets.slice();
        return {
            next() {
                idx++;
                return {
                    done: idx + 1 > pets.length,
                    value: pets[idx],
                };
            },
            return() {
                console.log(`迭代器终止`);
                // done为true表示关闭迭代器，不关的化下次从中断点继续
                return { dont: true };
            },
        };
    }
}

const petsHome = new PetsHome(['dog', 'cat', 'fish', 'bird']);
for (let pet of petsHome) {
    console.log(pet);
}
// dog
// cat
// fish
// bird
let i = 0;
for (let pet of petsHome) {
    if (i > 2) break;
    console.log(pet);
    i++;
}
// dog
// cat
// fish
// 迭代器终止
```

## 生成器，Generator

生成器本质是一个函数，除了箭头函数外，其他任何方式定义的函数，在函数名称前加一个`*`号，
都能将变成一个生成器。调用生成器函数会产生一个`生成器对象`，并且这个对象实现了`Iterator`接口，
具有`next()`方法（它返回对象的`value`就是生成器函数的返回值），生成器对象有状态的概念（类似 Promise），
初始状态为`suspend`，通过`yield`关键字可以让生成器停止执行，调用`next()`回复恢复执行

```javascript
function* spellHello() {
    yield 'h';
    yield 'e';
    yield 'l';
    yield 'l';
    yield 'o';
}
for (let s of spellHello()) {
    console.log(s);
}
```

`yield`关键字是生成器的精髓所在，它只能在生成器的内部使用，它的返回值作为每次调用`next()`的`value`，
同时还可以`yield*`操作可迭代对象，增强生成器行为

```javascript
function* genFn() {
    yield* [1, 2, 3];
    yield* [4, 5, 6];
}
for (let num of genFn()) {
    console.log(num);
}
// 1
// 2
// 3
// 4
// 5
// 6
```

生成器对象还有`return()`和`throw()`方法，用以提前终止迭代器

## async/await

阮一峰老师的《ES6 标准入门》提到，`async`函数其实就是`Generator`的语法糖，
将`*`换成了`async`，将`yield`换成了`await`，更加的语义化了

```javascript
function* gen() {
    yield something;
    return;
}
// 类似于
async function f() {
    await something;
    return;
}
```

但`async`相较于生成器而言有一些改进：

1. `async`函数不需要执行器，行为与普通函数一致
2. 返回值是`Promise`

## 最后

迭代器和生成器都是比较高级的特性，在普通的业务开发中几乎不会用到，对他们的理解还有待加深，
也要进一步去探索它们的使用场景
