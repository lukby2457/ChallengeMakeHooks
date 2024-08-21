import MyReact, { useState, useEffect } from "./React.mjs";

const useText = () => { // custom hook에서도 조건부 렌더링은 상관없고, 컴포넌트 안에서 hook을 최상단에 유지
  const [text, setText] = useState("foo");
  useEffect(() => {
    console.log("effect", text);
    return () => {
      console.log("cleanup", text);
    };
  }, [text]);

  return [text, setText];
};

function ExampleComponent() {
  const [count, setCount] = useState(0);
  const [text, setText] = useText();

  useEffect(() => {
    console.log("effect", count);
    return () => {
      console.log("cleanup", count);
    };
  }, [count]);

  return {
    click: () => setCount(count + 1),
    type: (text) => setText(text),
    render: () => console.log("render", { count, text }),
  };
}

let App = MyReact.render(ExampleComponent); // 초기 렌더링

App.click();
App = MyReact.render(ExampleComponent);

App.type("bar");
App = MyReact.render(ExampleComponent);

App.click();
App = MyReact.render(ExampleComponent);