Reactive State:

Supports:

- Input binding
- Click binding
- Text interpolation
- Attribute binding
- Template Expressions
- Reactive state

---

PROS:

- Allows you to perform actions on state change
- Creates a 'flow', or 'stream' of data
- Gives reactive functionality without the need for a full framework
- Can bind to input elements to take in changing values with input binding
- Can bind to elements to perform actions with click binding
- Can be inserted into content to display changing values with text interpolation
- Can use attribute binding to change the attribute values of elements
- Can use expressions for more complex functionality in attribute binding
- Under 600 lines of code

---

CONS:

- Lacking the advanced functionality that full blown frameworks have, like:
  - Template rendering updates (think v-for or v-if)
  - Component functionality
  - Router functionality
- Not as optimized
- Lacking the ability to bind multiple reactives to an elements single attribute or text interpolation:
  - Lacking multi-binding to a single attribute ([ attribute ]="bindingString1 bindingString2")
  - Lacking multi-binding to text interpolation ( {{ bindingString1 bindingString2 }} )
  - Note: you can still attach multiple bindings to a single element, but the bindings must be different types (input, click, text interpolation, attribute)
