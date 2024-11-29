
import React from 'react';

/* 
  # Understanding props.children in React

  The `props.children` is a special prop in React that allows components to render the content between the opening and closing tags when they are used. 
  Basically the nested jsx syntax
  This enables components to wrap other components or JSX elements and render them dynamically inside the parent component.
*/
/*
Two Ways to Call Components:
1. Self-Closing Tag: When the component does not have any children (i.e., nothing is passed between the opening and closing tags), you can use a self-closing tag.
EX: <Component />

2. Opening and Closing Tag: When the component does have children (content between the tags), you need to use both an opening tag and a closing tag
EX: <Component>Children Content</Component>
 */

/* 
  ## Example 1: Basic usage of props.children
  This component, `Container`, will render any content that is placed between its opening and closing tags using `props.children`.
*/
function Container(props) {
  return <div className="container">{props.children}</div>;  // Rendering children content
}

function App() {
  return (
    <div>
      {/* Passing JSX content as children */}
      <Container>
        <h1>This is a title inside the container!</h1>
        <p>This paragraph is also passed as children.</p>
      </Container>

      {/* Passing other components as children */}
      <Container>
        <AnotherComponent />
      </Container>
    </div>
  );
}

/* 
  ## Example 2: Nesting children inside components
  You can pass nested content, including other components, as children, making `props.children` a flexible way to structure UIs.
*/
function AnotherComponent() {
  return (
    <div>
      <h2>I am a nested component!</h2>
      <p>I'm being passed as children to the `Container` component.</p>
    </div>
  );
}

/* 
  ## Example 3: Conditionally rendering props.children
  You can also conditionally render the `props.children` based on logic in your component. This allows you to dynamically decide whether to display the children or not.
*/
function ConditionalContainer(props) {
  const { isVisible } = props; // Destructure the isVisible prop

  return (
    <div className="conditional-container">
      {isVisible ? props.children : <p>Children are hidden!</p>}  {/* Conditionally rendering children */}
    </div>
  );
}

function ConditionalApp() {
  return (
    <div>
      <ConditionalContainer isVisible={true}>
        <p>This content is visible because isVisible is true.</p>
      </ConditionalContainer>
      <ConditionalContainer isVisible={false}>
        <p>This content will not be shown.</p>
      </ConditionalContainer>
    </div>
  );
}

export { App, ConditionalApp };

/*
To access and manipulate individual child elements or their properties, you can use the React Children utility methods like React.Children.map or React.Children.forEach
If you want to access a specific type of child element or apply logic to certain elements, you can check the type property of each child.
Example: Accessing Specific Child Properties
*/
import React from 'react';

function ParentComponent(props) {
  React.Children.map(props.children, (child) => {
    if (child.type === 'h1') {
      console.log('This is an h1 element:', child.props.title);
    }
  });

  return <div>{props.children}</div>;
}

function App() {
  return (
    <ParentComponent>
      <h1 title="Title 1">This is a title</h1>
      <p>This is a paragraph</p>
    </ParentComponent>
  );
}

export default App;
