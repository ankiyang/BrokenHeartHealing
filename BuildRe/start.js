// create a node, then assign all the element 'props' to that node
// node = DOM element

const element = {
    type: "h1",
    props: {
        title: "Anki",
        children: "Hello",
    },
}

// create the nodes for the 'children'
// only have a string so create a text node

const text = document.createTextNode("")
text["nodeValue"] = element.props.children

const node = document.createElement(element.type)
node["title"] = element.props.title


const container = document.getElementById("root")

// append text node ---> 'h1' and then
// append 'h1' ---> 'container'
node.appendChild(text)
container.appendChild(node)


// same as 'original.js'