// define a react element
// JSX
const element = <h1 title="foo">Hello</h1>

// const element = React.createElement(
//     "h1", {title:"foo"}, "Hello"
// )


// gets a node from the DOM
const container = document.getElementById("root")

//render the React element into the container
// render is where React changes the DOM
ReactDOM.render(element, container)