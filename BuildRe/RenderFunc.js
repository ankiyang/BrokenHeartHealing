import createElement from 'EleFunc1.js'

// The render function

function render(element, container){
    // create doom nodes using the element type
    // handle type of "TEXT_ELEMENT" we created
    // if the element type is TEXT_ELEMENT we create a text node instead of a regular node.
    const dom
        = element.type === "TEXT_ELEMENT"
        ? document.createTextNode("")
        : document.createElement(element.type)

    // assign the element props to the node
    const isProperty = key => key !== "children"
    Object
        .keys(element.props)
        .filter(isProperty)
        .forEach(name => {dom[name] = element.props[name]})


    // do the same for the child
    element.props.children.forEach(child => render(child, dom))

    // append the node to the container
    container.appendChild(dom)
}

// break the work into small units,
// and after we finish each unit we’ll let the browser interrupt the rendering if there’s anything else that needs to be done.
let nextUnitOfWork = null;
// 'deadline' to check how much time we have until the browser needs to take control again.
function workLoop(deadline) {
    let shouldYield = false
    while (nextUnitOfWork && !shouldYield){
        nextUnitOfWork = performUnitOfWork(
            nextUnitOfWork
        )
        shouldYield = deadline.timeRemaining() < 1
    }
    requestIdleCallback(workLoop)
}
// the browser will run the callback when the main thread is idle.
requestIdleCallback(workLoop)

// to start using the loop we'll need to set the first unit of work
// then write 'performUnitOfWork' that not only performs the work but also returns the next unit of work
function performUnitOfWork(nextUnitOfWork) {
    // TODO
}


const Keact = {
    createElement,
    render,
};

/** @jsx Keact.creatElement */
const element = (
    <div>
        <h1>Hello World</h1>
    </div>
);

const container = document.getElementById("root");
Keact.render(element, container);

