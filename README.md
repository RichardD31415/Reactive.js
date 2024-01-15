# Reactive.js

Reactive.js is a simple reactive state management library that allows you to create reactive objects called Reactives that can be used to track and update state. It was designed to be used directly in smaller projects that need to monitor complex state pipelines but don't need the overhead of an extensive library like Vue, React, or Angular.

## Table of Contents

- [Details](#details)
- [Purpose](#purpose)
- [How It Works](#how-it-works)
- [Definitions](#definitions)
- [Reactive](#reactive)
- [Derived](#derived)
- [Effect](#effect)
- [Bindings](#bindings)
  - [Input Binding](#input-binding)
  - [Click Binding](#click-binding)
  - [Text Interpolation Binding](#text-interpolation-binding)
  - [Attribute Binding](#attribute-binding)
- [Expressions](#expressions)
- [Examples](#examples)
  - [Basic Reactive](#basic-reactive)
  - [Basic Derived](#basic-derived)
  - [Basic Effect](#basic-effect)
  - [Basic Input Binding](#basic-input-binding)
  - [Basic Click Binding](#basic-click-binding)
  - [Basic Text Interpolation Binding](#basic-text-interpolation-binding)
  - [Basic Attribute Binding](#basic-attribute-binding)
  - [Additional Exmples](#additional-examples)
- [Limitations](#limitations)

## Details:

- Author(s): Richard J Decker
- Version: 1.0.0 (11 Jan 2024)
- License: MIT
- GitHub: https://github.com/RichardD31415/Reactive.js

## Purpose:

I wanted a simple reactive state management library to use in my projects without installing an extensive library like Vue or React.
This script is a simple implementation of the reactive state management pattern I have used in past projects.
The significant advantage of this library is that it is small, simple, and easy to understand without having to learn a larger library.

## How It Works:

The Reactive function creates a Reactive object that allows tracking and updating of state using the get, set, watch, unwatch, and forget methods.

The Derived function creates a Derived state that depends on an array of Reactives and a Derivation function.

The Effect function creates an Effect that watches a list of Reactives and invokes a callback function when any of the watched Reactives change.

All Reactive types (Reactive, Derived) support input binding, click binding, text interpolation, and attribute binding.

## Definitions:

- Reactive: A Reactive object that allows tracking and updating of state.
- Watcher: A function that is called when the state of a Reactive object changes.
- Derived: A function that computes a Derived state from an array of Reactives. A Derived IS a type of Reactive.
- Effect: A function that watches a list of Reactives and invokes a callback function when any of the watched Reactives change. Think of it as a watcher for multiple Reactives. An Effect IS NOT a type of Reactive.

## Reactive:

To create a Reactive object, call the Reactive function with an initial value:

```
const reactive = Reactive("initial state");
```

To get the current state at any time, call the get method:

```
reactive.get();
```

To set the state, call the set method with the new state value:

```
reactive.set("new state");
```

It is a common mistake to set the state using the reactive object directly:

```
reactive = "new state"; //breaks
```

This will not work, and this is why using const is recommended.

To watch for changes to the state, call the watch method with a watcher function:

```
reactive.watch((state) => { console.log(state); });
```

The watcher function will be called with the current state being passed to the function whenever the state changes.

To stop watching for changes to the state, call the unwatch method with the named watcher function you want to remove:

```
reactive.unwatch(watcher);
```

To stop watching for changes to the state altogether, call the forget method:

```
reactive.forget();
```

This will remove all watchers from the Reactive. This is highly inadvisable because Reactives rely on watchers to handle the built-in binding functionality.

## Derived:

To create a Derived object, call the Derived function with an array of Reactives as the dependencies and a Derivation function:

```
const derived = Derived([reactive1, reactive2], () => { return reactive1.get() + reactive2.get(); });
```

To get the current Derived state at any time, call the get method:

```
derived.get();
```

A Derived IS a type of Reactive, so all Reactive methods are available to the Derived object.
This means you can use the get, set, watch, unwatch, and forget methods on the Derived object.

Setting the state of a Derived object explicitly with `derived.set("new state")` will work, but it is not recommended as this bypasses the point of a Derived being a computed state. This is also why using const is recommended.

## Effect:

To create an Effect, call the Effect function with an array of Reactives and a watcher function:

```
Effect([reactive1, reactive2], () => { console.log("reactive1 or reactive2 changed"); });
```

An Effect IS NOT a type of Reactive, so it does not support the set, watch, unwatch, and forget methods.
The Effect Function is just a helper function that allows you to watch multiple Reactives with a single watcher function.

## Bindings:

Bindings are a way to automatically bind inputs, click events, text interpolations, and attributes to a Reactive.
Bindings work with any Reactive, so they work with both Reactive and Derived objects.
By binding to a Reactive, the state of the Reactive will become the source of truth for the desired binding, updating values automatically.
To bind to a Reactive, pass a bindingString as the last argument to the Reactive or Derived function:

```
Reactive("initial state", "bindingString");
Derived([reactive1, reactive2], () => { return reactive1.get() + reactive2.get(); }, "bindingString");
```

The bindingString can be any string, but using a descriptive string that describes the binding is recommended.
Once the bindingString is set, the Reactive or Derived object will automatically bind to any inputs, click events, text interpolations, and attributes with the bindingString.

## Input Binding:

To bind an input to a Reactive, add the bindingString as a [ input ] attribute to an input element:

```
<input [input]="bindingString" />.
```

The input will now automatically update the Reactive state when the input value changes, and the input value will automatically update when the Reactive state changes.

## Click Binding:

To bind an element to a Reactive, add the bindingString as a [ click ] attribute to the element:

```
<button [click]="bindingString">Text</button>.
```

The element will now automatically invert the Reactive boolean state when the element is clicked.

**Note**: The Reactive state Must be a boolean for the click binding to work.
You can attach the click binding to any element, but using a button or other natively clickable elements is highly recommended.

## Text Interpolation Binding:

To bind a text interpolation to a Reactive, add the bindingString to the text interpolation brackets inside any element as content:

```
<p>{{ bindingString }}</p>.
```

The Reactive will now automatically update the text interpolation content when the Reactive state changes.
This strategy also works if there is content before and after the bindingString:

```
<p>Before {{ bindingString }} After</p>.
```

The content before and after the bindingString will remain unchanged.

## Attribute Binding:

To bind an attribute to a Reactive, add the bindingString value to any attribute surrounded by brackets to any element.
Example:

```
<p [class]="bindingString">Text</p>.
```

The Reactive will now automatically update the class attribute when the Reactive state changes.
This works for any attribute, including custom attributes:

```
<p [custom-attribute]="bindingString">Text</p>.
```

This strategy also works if the element already has the targeted attribute:

```
<p class="existing-class" [class]="bindingString">Text</p>.
```

The existing class will remain unchanged, but the value of the Reactive will be added to the element's class list.

## Expressions:

Text interpolations and attribute bindings support basic expressions.
Expressions are any valid JavaScript expression that returns a value.
Example:

```
<p>{{ 'bindingString' + " text" }}</p> or
<p [class]="'bindingString' == 'class' ? 'foo' : 'bar'">Text</p>.
```

Expressions can also be used to access properties of the Reactive state:

```
<p>{{ bindingstring.property }}</p> or
<p [class]="bindingstring.property">Text</p>.
```

Expressions can also be used to access properties of the Reactive state using bracket notation:

```
<p>{{ bindingString['property'] }}</p> or
<p [class]="bindingString['property']">Text</p>.
```

Expressions can also be used to access properties of the Reactive state using a function:

```
<p>{{ bindingString.property() }}</p> or
<p [class]="bindingString.property()">Text</p>.
```

## Examples:

### Basic Reactive:

```
const reactive = Reactive("initial state");
reactive.watch((state) => { console.log(state); });
reactive.set("new state"); // console.log("new state");
```

### Basic Derived:

```
const reactive1 = Reactive("initial state 1");
const reactive2 = Reactive("initial state 2");
const derived = Derived([reactive1, reactive2], () => { return reactive1.get() + reactive2.get(); });
derived.watch((state) => { console.log(state); });
reactive1.set("new state 1"); // console.log("new state 1new state 2");
```

#### Basic Effect:

```
const reactive1 = Reactive("initial state 1");
const reactive2 = Reactive("initial state 2");
Effect([reactive1, reactive2], () => { console.log("reactive1 or reactive2 changed"); });
reactive1.set("new state 1"); // console.log("reactive1 or reactive2 changed");
```

### Basic Input Binding:

```
const reactive = Reactive("initial state", "bindingString");
<input [input]="bindingString" /> // The input value will now automatically update the Reactive state when the input value changes, and the input value automatically updates when the Reactive state changes.
```

### Basic Click Binding:

```
const reactive = Reactive(false, "bindingString");
<button [click]="bindingString">Click Me</button> // The click event value will now automatically invert the Reactive boolean state when the button is clicked.
```

### Basic Text Interpolation Binding:

```
const reactive = Reactive("initial state", "bindingString");
<p>{{ bindingString }}</p> // The Reactive will now automatically update the text interpolation content when the Reactive state changes.
```

### Basic Attribute Binding:

```
const reactive = Reactive("initial state", "bindingString");
<p [class]="bindingString">Text</p> // The Reactive will now automatically update the class attribute when the Reactive state changes.
```

### Additional Exmples:

Check out the examples.html file for some more detailed examples and walkthroughs of how the Reactive, Derived, and Effect functions work.

## Limitations:

Some of the limitations of this library are:

- Lacking the advanced functionality that full blown frameworks have, like:
  - Template rendering updates (think v-for or v-if)
  - Component functionality
  - Router functionality
- Not as optimized
- Lacking the ability to bind multiple reactives to an elements single attribute or text interpolation:
  - Lacking multi-binding to a single attribute ([ attribute ]="bindingString1 bindingString2")
  - Lacking multi-binding to text interpolation ( {{ bindingString1 bindingString2 }} )
  - Note: you can still attach multiple bindings to a single element, but the bindings must be different types (input, click, text interpolation, attribute)
