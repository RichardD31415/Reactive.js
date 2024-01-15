"use strict";

//-------------------- How It Works --------------------//
/*
 * Reactive.js is a simple reactive state management library that allows you to create reactive objects called Reactives that can be used to track and update state.
 * It was designed to be used directly in smaller projects that need to monitor complex state pipelines, but don't need the overhead of a large library like Vue, React, or Angular.
 *
 * Details:
 * Author(s): Richard J Decker
 * Version: 1.0.0 (08 Jan 2024)
 * License: MIT
 * GitHub: https://github.com/RichardD31415/Reactive.js
 *
 * Purpose: I wanted a simple reactive state management library that I could use in my projects without having to install a large library like Vue or React.
 * This script is a simple implementation of the reactive state management pattern that I have used in projects.
 * The big advantage of this library is that it is small, simple, and easy to understand without having to learn a large library.
 *
 * How It Works: The Reactive function creates a reactive object that allows tracking and updating of state using the get, set, watch, unwatch, and forget methods.
 * The Derived function creates a derived state that depends on an array of reactives and a derivation function.
 * The Effect function creates an effect that watches a list of reactives and invokes a callback function when any of the reactives change.
 *
 * Definitions:
 * Reactive: A Reactive object that allows tracking and updating of state.
 * Watcher: A function that is called when the state of a reactive object changes.
 * Derived: A Reactive that is computed from an array of reactives using a derivation function.
 * Effect: A function that watches a list of reactives and invokes a callback function when any of the reactives change. Think of it as a watcher for multiple reactives. An Effect IS NOT a type of Reactive.
 *
 * Reactive:
 * To create a Reactive object, call the Reactive function with an initial state value: const reactive = Reactive("initial state");
 * To get the current state at any time, call the get method: reactive.get();
 * To set the state, call the set method with the new state value: reactive.set("new state");
 * It is a common mistake to directly set the state using the reactive object: reactive = "new state"; This will not work, and is why using const is recommended.
 * To watch for changes to the state, call the watch method with a watcher function: reactive.watch((state) => { console.log(state); });
 * The watcher function will be called with the current state being passed to the function whenever the state changes.
 * To stop watching for changes to the state, call the unwatch method with the named watcher function you want to remove: reactive.unwatch(watcher);
 * To stop watching for changes to the state all together, call the forget method: reactive.forget(); This will remove all watchers from the Reactive.
 * All Reactive types (Reactive, Derived) support input binding, click binding, text interpolation, and attribute binding.
 *
 * Derived:
 * To create a Derived object, call the Derived function with an array of reactives and a derivation function:
 *    const derived = Derived([reactive1, reactive2], () => { return reactive1.get() + reactive2.get(); });
 * To get the current Derived state at any time, call the get method: derived.get();
 * A Derivation IS a type of Reactive, so all Reactive methods are available to the Derived object.
 * This menas that you can use the get, set, watch, unwatch, and forget methods on the Derived object.
 * Setting the state of a Derived object explicitly with derived.set("new state") will work, but it is not recommended as this bypasses the point of a Derived being a computed state.
 *
 * Effect:
 * To create an Effect, call the Effect function with an array of reactives and a watcher function:
 *    Effect([reactive1, reactive2], () => { console.log("reactive1 or reactive2 changed"); });
 * An Effect IS NOT a type of Reactive, so it does not support the get, set, watch, unwatch, and forget methods.
 * The Effect Function is just a helper function that allows you to watch multiple reactives with a single watcher function.
 *
 * Bindings:
 * Bindings are a way to automatically bind inputs, click events, text interpolations, and attributes to a reactive.
 * Bindings work with any Reactive, so they work with both Reactive and Derived objects.
 * By binding to a Reactive, the state of the Reactive will become the source of truth for the desired binding, updating values automatically.
 * To bind to a Reactive, pass a bindingString as the last argument to the Reactive or Derived function:
 *    Reactive("initial state", "bindingString");, Derived([reactive1, reactive2], () => { return reactive1.get() + reactive2.get(); }, "bindingString");
 * The bindingString can be any string, but it is recommended to use a descriptive string that describes the binding.
 * Once the bindingString is set, the Reactive or Derived object will automatically bind to any inputs, clicks, text interpolations, and attributes that have the bindingString as an attribute.
 *
 * Input Binding:
 * To bind an input to a Reactive, add the bindingString as a [input] attribute to the input: <input [input]="bindingString" />.
 * The input will now automatically update the Reactive state when the input value changes, and the input value will automatically update when the Reactive state changes.
 *
 * Click Binding:
 * To bind an element to a Reactive, add the bindingString as a [click] attribute to the element: <button [click]="bindingString">Text</button>.
 * The element will now automatically invert the boolean Reactive state when the element is clicked.
 * Note: The Reactive state Must be a boolean for the click binding to work.
 * You can attach the click binding to any element, but it is recommended to use a button or other natively clickable elements.
 *
 * Text Interpolation Binding:
 * To bind a text interpolation to a Reactive, add the bindingString to the text interpolation brackets inside any element as content: <p>{{ bindingString }}</p>.
 * The Reactive will now automatically update the text interpolation content when the Reactive state changes.
 * This strategy also works if there is content before or after the bindingString: <p>Before {{ bindingString }} After</p>. The content before and after the bindingString will remain unchanged.
 *
 * Attribute Binding:
 * To bind an attribute to a Reactive, add the bindingString value to any attribute surrounded by brackets to any element.
 * Example: <p [class]="bindingString">Text</p>. The Reactive will now automatically update the class attribute when the Reactive state changes.
 * This works for any attribute, including custom attributes: <p [custom-attribute]="bindingString">Text</p>.
 * This strategy also works if the element already has the targeted attribute: <p class="existing-class" [class]="bindingString">Text</p>.
 * The existing class will remain unchanged, but the value of the Reactive will be added to the classlist.
 *
 * Expressions:
 * Text interpolations and attribute bindings support basic expressions.
 * Expressions are any valid JavaScript expression that returns a value.
 * Example: <p>{{ 'bindingString' + " text" }}</p> or <p [class]="'bindingString' == 'class' ? 'foo' : 'bar'">Text</p>.
 * Expressions can also be used to access properties of the Reactive state: <p>{{ bindingString.property }}</p> or <p [class]="bindingString.property">Text</p>.
 * Expressions can also be used to access properties of the Reactive state using bracket notation: <p>{{ bindingString['property'] }}</p> or <p [class]="bindingString['property']">Text</p>.
 * Expressions can also be used to access properties of the Reactive state using a function: <p>{{ bindingString.property() }}</p> or <p [class]="bindingString.property()">Text</p>.
 *
 * Examples:
 *
 * Basic Reactive:
 * const reactive = Reactive("initial state");
 * reactive.watch((state) => { console.log(state); });
 * reactive.set("new state"); // console.log("new state");
 *
 * Basic Derived:
 * const reactive1 = Reactive("initial state 1");
 * const reactive2 = Reactive("initial state 2");
 * const derived = Derived([reactive1, reactive2], () => { return reactive1.get() + reactive2.get(); });
 * derived.watch((state) => { console.log(state); });
 * reactive1.set("new state 1"); // console.log("new state 1new state 2");
 *
 * Basic Effect:
 * const reactive1 = Reactive("initial state 1");
 * const reactive2 = Reactive("initial state 2");
 * Effect([reactive1, reactive2], () => { console.log("reactive1 or reactive2 changed"); });
 * reactive1.set("new state 1"); // console.log("reactive1 or reactive2 changed");
 *
 * Basic Input Binding:
 * const reactive = Reactive("initial state", "bindingString");
 * <input [input]="bindingString" /> // The input value will now automatically update the Reactive state when the input value changes, and the input value will automatically update when the Reactive state changes.
 *
 * Basic Click Binding:
 * const reactive = Reactive(false, "bindingString");
 * <input [click]="bindingString" /> // The click event will now automatically invert the Reactive state.
 *
 * Basic Text Interpolation Binding:
 * const reactive = Reactive("initial state", "bindingString");
 * <p>{{ bindingString }}</p> // The Reactive will now automatically update the text interpolation content when the Reactive state changes.
 *
 * Basic Attribute Binding:
 * const reactive = Reactive("initial state", "bindingString");
 * <p [class]="bindingString">Text</p> // The Reactive will now automatically update the class attribute when the Reactive state changes.
 *
 * Check out the examples.html file for some real worls use case examples.
 *
 */

//-------------------- Helper Functions --------------------//

const getInputsFromBinding = (binding) => {
  // Get and return all inputs with the binding attribute
  return [...document.querySelectorAll("input")].filter((input) => {
    return input.attributes["[input]"]?.value === binding;
  });
};

const bindInuptsToReactive = (inputs, reactive) => {
  // Bind all inputs with the binding attribute to the reactive
  inputs.forEach((input) => {
    input.value = reactive.get();
    input.addEventListener("input", (event) => {
      reactive.set(event.target.value);
    });
    reactive.watch((state) => {
      input.value = state;
    });
  });
};

const getClicksFromBinding = (binding) => {
  // Get and return all elements with the click binding attribute
  return [...document.querySelectorAll("*")].filter((element) => {
    return element.attributes["[click]"]?.value === binding;
  });
};

const bindClicksToReactive = (clicks, reactive) => {
  // Bind all elements with the click binding attribute to the reactive
  clicks.forEach((element) => {
    if (typeof reactive.get() !== "boolean") {
      console.error(
        `Click binding requires a boolean Reactive state. Received: ${typeof reactive.get()}.`
      );
      return;
    }
    element.addEventListener("click", () => {
      reactive.set(!reactive.get());
    });
  });
};

const getInterpolationsFromBinding = (binding) => {
  // Get and return all text interpolations with the binding attribute
  return [...document.body.querySelectorAll("*")].filter((element) => {
    const regex = new RegExp(`{{\\s*${binding}\\s*.*}}`, "gm");
    return regex.test(element.innerHTML);
  });
};

const bindInterpolationsToReactive = (
  // Bind all text interpolations with the binding attribute to the reactive
  interpolations,
  reactive,
  originalValuesMap,
  binding
) => {
  reactive.watch((state) => {
    interpolations.forEach((element) => {
      const regex = new RegExp(`{{\\s*${binding}\\s*}}`, "gm");
      if (regex.test(originalValuesMap[element])) {
        element.innerHTML = originalValuesMap[element].replace(
          regex,
          state.toString()
        );
      } else if (originalValuesMap[element].includes(binding)) {
        const captureRegex = new RegExp(`{{\\s*(.*?)\\s*}}`, "gm");
        const match = captureRegex.exec(
          originalValuesMap[element].replace(binding, JSON.stringify(state))
        )[1];
        element.innerHTML = originalValuesMap[element].replace(
          captureRegex,
          new Function("return " + match)()
        );
      }
    });
  });
};

const getElementsWithAttribute = (binding) => {
  // Get and return all elements with an attribute that includes the binding attribute
  return [...document.body.querySelectorAll("*")]
    .filter((element) => {
      let hasAttribute = false;
      return [...element.attributes].some((attribute) => {
        if (
          attribute.value.includes(binding) &&
          attribute.name !== "[input]" &&
          attribute.name !== "[click]"
        ) {
          hasAttribute = true;
        }
        return hasAttribute;
      });
    })
    .map((element) => {
      const elementData = {
        element: element,
        originalAttributes: {},
      };
      [...element.attributes].forEach((attribute) => {
        if (attribute.value.includes(binding)) {
          let extractedAttribute = attribute.name
            .replace("[", "")
            .replace("]", "");
          elementData.originalAttributes[extractedAttribute] = element
            .attributes[extractedAttribute]
            ? element.attributes[extractedAttribute].value
            : "";
        }
      });
      return elementData;
    });
};

const bindAttributesToReactive = (elementAttributeData, reactive, binding) => {
  // Bind all attributes with the binding attribute to the reactive
  reactive.watch((state) => {
    elementAttributeData.forEach((elementData) => {
      Object.keys(elementData.originalAttributes).forEach((attribute) => {
        if (
          elementData.element.attributes[`[${attribute}]`].value === binding
        ) {
          const newValue =
            elementData.originalAttributes[attribute] + ` ${state}`;
          elementData.element.setAttribute(attribute, newValue);
        } else {
          const evaluation = elementData.element.attributes[
            `[${attribute}]`
          ].value.replace(binding, JSON.stringify(state));
          const newValue =
            elementData.originalAttributes[attribute] +
            ` ${new Function("return " + evaluation)()}`;
          elementData.element.setAttribute(attribute, newValue);
        }
      });
    });
  });
};

const addDerivationWatcherToReactives = (
  // Add the derivation watcher calculation function to each reactive in the reactives array
  reactives,
  derivedState,
  derivation,
  watchers
) => {
  reactives.forEach((reactive) => {
    if (typeof reactive !== "object") {
      console.error(
        `Derived reactives must created from an array of reactives. Received: ${
          (typeof reactive, reactive)
        }.`
      );
      return;
    }
    reactive.watch((state) => {
      derivedState = derivation();
      watchers.forEach(function (watcher) {
        return watcher(derivedState);
      });
    });
  });
};

//-------------------- Main Reactive Functions --------------------//

/**
 * Creates a reactive object that allows tracking and updating of state.
 * @param {*} state - The initial state value.
 * @param {string} [binding=null] - Optional bindingString for automatic binding of inputs, text interpolations, and attributes.
 * @returns {Object} - The reactive object with get, set, watch, unwatch, and forget methods.
 */
function Reactive(state, binding = null) {
  if (typeof state == "undefined" || typeof state == "null") {
    // Check for undefined or null initial state
    console.error(
      `Reactive state must not be undefined or null.\nReceived: ${typeof state}.`
    );
    return;
  }

  const watchers = []; // Array of watcher functions

  const reactive = {
    get: function () {
      // Get and return the current state
      return state;
    },

    set: function (newState) {
      // Set the new state and run all watchers
      state = newState;
      watchers.forEach(function (watcher) {
        return watcher(state);
      });
      return state;
    },

    watch: function (watcher, runImmediately = true) {
      // Add a watcher function to the watchers array
      if (typeof watcher !== "function") {
        // Check for valid watcher function
        console.error(
          `Watcher must be a function. Received ${typeof watcher}.`
        );
        return;
      }
      if (watchers.includes(watcher)) {
        // Check for duplicate watcher
        console.error(`Watcher already exists.\n`, watcher);
        return;
      }
      watchers.push(watcher);
      if (runImmediately) {
        // Run the watcher immediately if runImmediately is true
        watchers.forEach(function (watcher) {
          return watcher(state);
        });
      }
      return watchers;
    },

    unwatch: function (watcher) {
      // Remove a watcher function from the watchers array
      watchers = watchers.filter(function (w) {
        return w !== watcher;
      });
      return watchers;
    },

    forget: function () {
      // Remove all watcher functions from the watchers array
      watchers = [];
      return watchers;
    },
  };

  if (binding) {
    if (typeof binding !== "string") {
      // Check for valid bindingString
      console.error(
        `Binding must be a string. Received: ${typeof binding}.`,
        binding
      );
      return;
    }

    //parse and bind input binding
    bindInuptsToReactive(getInputsFromBinding(binding), reactive);

    //parse and bind click binding
    bindClicksToReactive(getClicksFromBinding(binding), reactive);

    //parse and bind text interpolations
    const originalValuesMap = {};
    const interpolations = getInterpolationsFromBinding(binding);

    interpolations.forEach((element) => {
      originalValuesMap[element] = element.innerHTML;
    });

    bindInterpolationsToReactive(
      interpolations,
      reactive,
      originalValuesMap,
      binding
    );

    //parse and bind attribute bindings
    const elementsWithAttribute = getElementsWithAttribute(binding);

    bindAttributesToReactive(elementsWithAttribute, reactive, binding);
  }

  return reactive;
}

/**
 * Represents a derived state that depends on an array of reactives and a derivation function.
 * @param {Array} reactives - An array of reactives.
 * @param {Function} derivation - The derivation function that computes the derived state.
 * @param {string} [binding=null] - Optional bindingString for additional functionality.
 * @returns {Object} - The derived object with getter, setter, watcher, unwatcher, and forget methods.
 */
function Derived(reactives, derivation, binding = null) {
  const watchers = [];

  if (!Array.isArray(reactives)) {
    // Check for valid array of reactives
    console.error(
      `Derived reactives must be created from an array of reactives. Received: ${
        (typeof reactives, reactives)
      }.`
    );
    return;
  }

  if (typeof derivation !== "function") {
    // Check for valid derivation function
    console.error(
      `Derived derivations must be a function. Received: ${
        (typeof derivation, derivation)
      }.`
    );
    return;
  }

  let derivedState = derivation(); // Compute the initial derived state

  if (typeof derivedState == "undefined" || typeof derivedState == "null") {
    // Check for undefined or null initial state
    console.error(
      `Derived state must not be undefined or null. The derivation function must return a value. \nReceived: ${typeof derivedState}.`,
      `Derivation function: ${derivation}`
    );
    return;
  }

  addDerivationWatcherToReactives(
    // Add the derivation watcher calculation function to each reactive in the reactives array
    reactives,
    derivedState,
    derivation,
    watchers
  );

  const derived = {
    get: function () {
      // Get and return the current derived state
      return derivedState;
    },

    set: function (newState) {
      // Set the new derived state and run all watchers
      console.warn(
        "Setting the state of a derived object directly is not recommended."
      );
      derivedState = newState;
      watchers.forEach(function (watcher) {
        return watcher(derivedState);
      });
      return derivedState;
    },

    watch: function (watcher, runImmediately = true) {
      // Add a watcher function to the watchers array
      if (typeof watcher !== "function") {
        // Check for valid watcher function
        console.error(
          `Watcher must be a function. Received ${typeof watcher}.`
        );
        return;
      }
      if (watchers.includes(watcher)) {
        // Check for duplicate watcher
        console.error(`Watcher already exists.\n`, watcher);
        return;
      }
      watchers.push(watcher);
      if (runImmediately) {
        // Run the watcher immediately if runImmediately is true
        watchers.forEach(function (watcher) {
          return watcher(derivedState);
        });
      }
      return watchers;
    },

    unwatch: function (watcher) {
      // Remove a watcher function from the watchers array
      watchers = watchers.filter(function (w) {
        return w !== watcher;
      });
      return watchers;
    },

    forget: function () {
      // Remove all watcher functions from the watchers array
      watchers = [];
      return watchers;
    },
  };

  if (binding) {
    if (typeof binding !== "string") {
      // Check for valid bindingString
      console.error(
        `Binding must be a string. Received: ${typeof binding}.`,
        binding
      );
      return;
    }

    //parse and bind input bindings
    bindInuptsToReactive(getInputsFromBinding(binding), derived);

    //parse and bind click binding
    bindClicksToReactive(getClicksFromBinding(binding), derived);

    //parse and bind text interpolations
    const originalValuesMap = {};
    const interpolations = getInterpolationsFromBinding(binding);

    interpolations.forEach((element) => {
      originalValuesMap[element] = element.innerHTML;
    });

    bindInterpolationsToReactive(
      interpolations,
      derived,
      originalValuesMap,
      binding
    );

    //parse and bind attribute bindings
    const elementsWithAttribute = getElementsWithAttribute(binding);

    bindAttributesToReactive(elementsWithAttribute, derived, binding);
  }

  return derived;
}

/**
 * Creates an effect that watches a list of reactives and invokes a callback function when any of the reactives change.
 * @param {Array} reactives - An array of reactives to watch.
 * @param {Function} watcher - The callback function to invoke when any of the reactives change.
 */
function Effect(reactives, watcher) {
  if (!Array.isArray(reactives)) {
    // Check for valid array of reactives
    console.error(
      `Effects must be created using an array of reactives. Received: ${
        (typeof reactives, reactives)
      }.`
    );
    return;
  }

  if (typeof watcher !== "function") {
    // Check for valid watcher function
    console.error(
      `Effect callbacks must be a function. Received: ${
        (typeof watcher, watcher)
      }.`
    );
    return;
  }

  reactives.forEach((reactive) => {
    // Add the watcher function to each reactive in the reactives array
    if (typeof reactive !== "object") {
      // Check for valid reactive
      console.error(
        `Effects must be created using an array of reactives. Received: ${
          (typeof reactive, reactive)
        }.`
      );
      return;
    }
    reactive.watch((state) => {
      watcher();
    });
  });
}

export { Reactive, Derived, Effect };
export default Reactive;
