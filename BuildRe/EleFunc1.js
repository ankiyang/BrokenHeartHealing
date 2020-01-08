// transform JSX to JS
// create an element object with 'type' and 'props'.
// 'children' property will always be an array.

function createElement1(type, props, ...children) {
    return {
        type,
        props: {
            ...props,
            children,
        },
    }
}

function createElement(type, props, ...children){
    return {
        type,
        props: {
            ...props,
            // if the element inside isn't object, we create a type for it.
            children: children.map(child => typeof child === "object" ? child : createTextElement(child)),
        },
    }
}

function createTextElement(text) {
    return {
        type: "TEXT_ELEMENT",
        props: {
            nodeValue: text,
            children: [],
        },
    }
}

// name our own
const Keact = {
    createElement,
}

const element = Keact.createElement(
    "div",
    {id:"f"},
    Keact.createElement("a", null, "bar"),
    Keact.createElement("b"),
)

// transpile the JSX to use the function we use.
/** @jsx Keact.createElement */
const element = (
    <div id="f">
        <a>bar</a>
        <b />
    </div>
)