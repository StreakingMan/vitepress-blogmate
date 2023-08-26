---
tags: [类, 继承]
category: JavaScript
date: 2022-04-02
---

# JavaScript 中的继承

继承一直是面向对象编程讨论得最多得东西，而 JavaScript 由于其本身的特点，继承更是别具一格，
今天还是跟着红宝书的脚步深入了解 JavaScript 中的继承。

传统的面向对象语言支持两种继承： 接口继承和实现继承。由于在 ES 规范中就没有函数签名一说，所以接口继承在 js 中是不可能的，
实现继承是唯一支持的继承方式。

> 函数签名定义了函数的输入与输出

## 原型链继承

首先回顾以下原型链的定义：每一个构造函数都有一个原型对象，原型有一个属性`[[constructor]]`指回构造函数，用`new`操作符调用
构造函数产生的实例有一个内部指针`__proto__`指向原型对象。 当原型是另一个类型的实例的时候，意味着该原型本身有一个内部指针指向
另一个原型， 这样就在实例和原型之间构成了一条原型链。

```javascript
function SuperType() {
    this.name = 'super';
}
SuperType.prototype.sayName = function () {
    console.log(this.name);
};
function SubType() {
    this.name = 'sub';
}
SubType.prototype = new SuperType();
const instance = new SubType();
instance.sayName(); // sub
```

以上示例通过原型链实现了最基本的继承，子类继承了父类的`sayName`方法，但如果光使用原型链继承，问题也很明显，
那就是原型上的引用值会在所有实例间共享，造成一些意料之外的效果：

```javascript
function SuperType() {
    this.colors = ['red'];
}
function SubType() {}
SubType.prototype = new SuperType();
const instance1 = new SubType();
instance1.colors.push('green');
console.log(instance1.colors); // ['red','green']
const instance2 = new SubType();
console.log(instance2.colors); // ['red','green']
```

很明显这是不符合期望的，同时如果父类的构造函数是接受参数的，在上述子类的实例化过程中是没有办法传递参数的，
故原型链继承通常不会单独使用。

## 经典继承——盗用构造函数

一个稀奇古怪的名字，也有别的叫法：对象伪装、经典继承。其实他就是在子类的构造函数中调用了父类构造函数，
用来解决原型上引用值共享的问题：

```javascript
function SuperType() {
    this.colors = ['red'];
}
function SubType() {
    SuperType.call(this);
}
const instance1 = new SubType();
instance1.colors.push('green');
console.log(instance1.colors); // ['red','green']
const instance2 = new SubType();
console.log(instance2.colors); // ['red']
```

原理很简单，使用`call`或者`apply`将子类构造函数作为父类构造函数的执行执行上下文（可以理解为父类在每个子类中都有一份拷贝），
同时也能解决父类构造函数传参问题：

```javascript
function SuperType(colors = []) {
    this.colors = [...colors];
}
function SubType() {
    SuperType.call(this, ['yellow']);
}
const instance1 = new SubType();
instance1.colors.push('green');
console.log(instance1.colors); // ['yellow','green']
const instance2 = new SubType();
console.log(instance2.colors); // ['yellow']
```

但这种方法的弊端也很明显，子类无法访问父类的原型，并且要定义子类方法也得在构造函数中，方法无法复用
（指每个子类实例都会重复创建相同的方法），所以通常这种继承方法也不会单独使用。

## 组合继承

这个的名字正常点了（也叫伪经典继承），顾名思义是组合了上两种继承方式的一种继承模式，集合了原型链继承和盗用构造函数继承的优点。
盗用函数继承能够解决引用值的问题，那就用它来继承属性，原型链有着天然的方法复用优势，那就用它来继承方法：

```javascript
// 父类
function SuperType(name) {
    this.name = name;
    this.colors = ['green'];
}
// 父类的方法
SuperType.prototype.sayName = function () {
    console.log(this.name);
};
// 子类
function SubType(name, age) {
    // 盗用构造函数继承属性
    SuperType.call(this, name);
    // 子类的拓展属性
    this.age = age;
}
// 原型链继承父类的方法
const superInstance = new SuperType();
SubType.prototype = superInstance;
// 子类方法拓展
SubType.prototype.sayAge = function () {
    console.log(this.age);
};
// 实例化子类
const instance1 = new SubType('Jerry', 5);
const instance2 = new SubType('Tom', 8);

// 虽然子类原型superInstance上有一个值为空的name属性，但因为子类实例上有name属性，故访问不到原型上的
console.log(instance1.name); // Jerry

// 得益于借用构造函数继承，实例有各自的colors数组，同样访问不到原型上的
console.log(instance1.colors); // ["green"]
instance1.colors.push('red');
console.log(instance1.colors); // ["green","red"]
console.log(instance2.colors); // ["green"]

// 得益于原型链继承，子类和父类的方法都能按预期工作
instance1.sayName(); // "Jerry"
instance2.sayName(); // "Tom"
instance1.sayAge(); // 5
instance2.sayAge(); // 8

// 同时，这种继承方式保留了 instanceof 和 isPrototypeOf 的能力
console.log(instance1 instanceof SubType); // ture
console.log(instance2 instanceof SubType); // ture
console.log(instance1 instanceof SuperType); // ture
console.log(superInstance.isPrototypeOf(instance1)); // ture
```

## 原型式继承

这是由 Douglas Crockford 提出的，同时这位大佬也是 JSON 的创始人，他的出发点是即使不自定义类型也可以通过原型实现对象之间的信息共享，
用代码说就是：

```javascript
function object(o) {
    function F() {}
    F.prototype = o;
    return new F();
}
```

这种方式适用于在某个对象的基础上创建另一个对象的场景，且中间省去了定义另一个对象的构造函数的过程（或者说我们不需要这个过程），
因为使用的是原型继承，派生出的新对象与原始对象共享引用值。实际上，ES5 将这种概念规范化了，就是我们熟知的`Object.create()`

## 寄生式继承

同样也是 Douglas 提出的，简单说就是：创建一个实现继承的函数->某种方式增强原始对象->返回增强的对象：

```javascript
function createAnother(orginal) {
    let clone = Object.create(orginal);
    clone.sayHi = () => console.log('hi');
    return clone;
}
```

就一很简单的理念，适用于一些不需要关注构造函数的场景，但它同样存在方法无法复用问题，返回的对象都创建了相同的`sayHi`方法

## 寄生式组合继承

好家伙名字又开始奇怪起来了。这个模式是为了解决组合继承存在的效率问题————父类构造函数被执行了两次：

```javascript
function SuperType() {
    //...
}
function SubType() {
    SuperType.call(this, name); // 这里一次
    //...
}
SubType.prototype = new SuperType(); // 这里一次
```

正是为了解决这个问题，我们结合上面提到的寄生式继承：

```javascript
function SuperType(name) {
    this.name = name;
    this.colors = ['red'];
}
SuperType.prototype.sayName = function () {
    console.log(this.name);
};
function SubType(name, age) {
    SuperType.call(this, name);
    this.age = age;
}
// 寄生式继承的方式来继承父类原型
function inheritPrototype(subType, superType) {
    let prototype = Object.create(superType.prototype); // 根据父类原型创建一个原型对象
    prototype.constructor = subType; // 构造函数指向子类
    subType.prototype = prototype; // 更新子类的原型
}
inheritPrototype(SubType, SuperType);
SubType.prototype.sayAge = function () {
    console.log(this.age);
};

// 接下来都是与组合继承一样的效果
```

可以看到，每当实例化子类的时候，父类的构造函数指挥执行一次，优化了性能，提升效率，
红宝书也直接宣布“这可以算是引用类型继承的最佳模式”。

## ES6 类

不得不说，在一切没有规范之前，业界的前辈们用了很多奇妙的方式来达成目的。ES6 的大更新其中便有`class`关键字，
至此 javascript 真正具备了定义类的能力，虽然它很大程度上是基于既有原型机制的语法糖。
关于类的具体用法这里不继续展开，这里只看跟继承有关的部分。

### super 关键字

ES6 的类只支持单继承，使用`extends`关键字就可以继承任何拥有`[[construct]]`和`prototype`属性的对象，包括构造函数，甚至内置类型，
派生类的方法可以通过`super`关键字引用他们的原型，在类构造函数中使用则可以调用父类构造函数：

```javascript
class Vehicle {
    constructor() {
        this.hasEngine = true;
    }
    static bibibi() {
        console.log('bibibi');
    }
}
class Bus extends Vehicle {
    // 没有定义子类构造函数时会模式调用super()
    constructor() {
        // super只能在子类构造函数和静态方法中使用
        // 不要在调用super()前访问this，会抛异常
        // 貌似子类不调用super()也会抛错
        super(); // 相当于 super.constructor()
        console.log(this.hasEngine); // true
        this.bibibi();
    }
    static bibibi() {
        super.bibibi();
    }
}
```

### 模拟抽象类

有时候可能需要一种供其他类继承单本身不会被实例化的类，虽然 ES 本身没有提供这种语法，但可以通过`new.target`来模拟：

```javascript
class Vehical {
    constructor() {
        if (new.target === Vehical) {
            throw new Error('大咩');
        }
    }
}
class Bus extends Vehical {}
new Bus(); // 正常
new Vehical(); // Error: 大咩
```

通过在抽象类构造函数中进行检查，要求子类必须定义否个方法:

```javascript
class Vehical {
    constructor() {
        if (new.target === Vehical) {
            throw new Error('大咩');
        }
        if (!this.wheel) {
            throw new Error('没装方向盘');
        }
    }
}
class Bus extends Vehical {
    constructor() {
        //在调用父类构造函数前，wheel已经存在，所以可以在父类中拖过this来检测wheel
        super();
    }
    wheel() {}
}
class Bike extends Vehical {}
new Bus(); // 正常
new Bike(); // Error: 没装方向盘
```

### 类混入

同样的，ES6 并没有原生支持多类继承，但可以模拟这种行为：

```javascript
class Vehicle {}
function mixinClass(classList) {
    // 一些类混合的逻辑
    // 返回一个类
    class Mixed {
        //..
    }
    return Mixed;
}
class Bike {}
class Car {}
class SuperBus extends mixinClass([Bike, Car]) {}
```

混合的逻辑实际上是跟类相关的，可以通过一些辅助方法类维护混合逻辑。`extends`后面的表达式会在类定义时被求值。
这里需要区分下类行为混合和对象混合，仅仅是对象属性的混合，使用`Object.assign()`就可以了

> 许多 JS 框架（如 React)已经抛弃混入模式，转向了复合模式，把方法提取到独立的类和辅助对象中，然后再组合起来，而不是继承。
> 这不得不提到那个著名的设计原则————复合胜过继承

## 总结

-   **_原型式继承_**是利用了原型链的特点，但不同实例会共享原型上的引用值
-   **_经典继承——盗用构造函数_**通过在子类构造函数中调用父类构造函数，解决了原型引用值的问题，但同样的，若父类原型上有个方法，
    每个子类实例上都会创建一个相同的方法，十分低效，且无法向父类构造函数传递参数
-   **_组合继承_**则是集合了上两者的优点，通过原型链来继承父类的方法，通过盗用构造函数类继承属性
-   **_原型式继承_**和**_寄生式继承_**，都是针对一些不依赖构造函数的场景（或者说只关注对象的场景），前者顺着原型链创建一个新对象，
    后者这是通过一个方法接受对象，以某种方式增强对象后返回
-   **_寄生式组合继承_**则是为了解决组合继承中父类构造函数被调用两次的问题，子类原型通过寄生式继承获得父类原型的能力，避免了父类的实例化，
    减少父类构造函数调用次数。被认为是实现基于类型继承的最有效方式
-   **_ES6 类_**很大程度上是基于既有原型机制的语法糖。通过`extends`关键字继承，在子类的构造函数和静态方法中通过`super`访问父类，
    同时我们可以模拟出抽象基类和类混入的效果
