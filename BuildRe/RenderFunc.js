import createElement from 'EleFunc1.js'

// The render function

function createDom(fiber){
    // create doom nodes using the element type
    // handle type of "TEXT_ELEMENT" we created
    // if the element type is TEXT_ELEMENT we create a text node instead of a regular node.
    const dom
        = element.type === "TEXT_ELEMENT"
        ? document.createTextNode("")
        : document.createElement(fiber.type)

    // assign the element props to the node
    const isProperty = key => key !== "children"
    Object
        .keys(fiber.props)
        .filter(isProperty)
        .forEach(name => {dom[name] = fiber.props[name]})

    return dom

    // // do the same for the child
    // element.props.children.forEach(child => render(child, dom))
    //
    // // append the node to the container
    // container.appendChild(dom)
}

function render(element, container){
    // TODO set next unit of work to the root of the fiber tree
    nextUnitOfWork = {
        dom: container,
        props: {
            children: [element],
        },
    }
}
// break the work into small units,
// and after we finish each unit we’ll let the browser interrupt the rendering if there’s anything else that needs to be done.
let nextUnitOfWork = null;
// 'deadline' to check how much time we have until the browser needs to take control again.
function workLoop(deadline) {
    // when the browser is ready, it will call our workLoop and we'll start working on the root.
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
function performUnitOfWork(fiber) {
    // add dom node
    if (!fiber.dom) {
        fiber.dom = createDom(fiber)
    }

    if(fiber.parent) {
        fiber.parent.dom.appendChild(fiber.dom)
    }
    // for each child we create a new fiber
    const elements = fiber.props.children
    let index = 0
    let prevSibling = null

    while (index < elements.length) {
        const element = elements[index]

        const newFiber = {
            type: element.type,
            props: element.props,
            parents: fiber,
            dom: null,
        }

    // we add it to the fiber tree setting it either as a child or as a sibling,
    // depending on whether it's the first child or not.

        if (index === 0) {
            fiber.child = newFiber
        } else {
            prevSibling.sibling = newFiber
        }

        prevSibling = newFiber
        index++
    }

    // return next unit of work
    if (fiber.child) {
        return fiber.child
    }
    let nextFiber = fiber
    while (nextFiber) {
        if (nextFiber.sibling) {
            return nextFiber.sibling
        }
        nextFiber = nextFiber.parent
    }
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

