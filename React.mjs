const MyReact = {
  render(Component) {
    const Comp = Component(); // 컴포넌트를 실행하여 이펙트들을 처리
    Comp.render();  // 컴포넌트의 렌더링 함수 실행
    currentHook = 0; // 다시 렌더링 시 처음부터 시작할 수 있게 초기화
    return Comp;  // 컴포넌트 반환
  },
};

// let _val; // 단일 value를 보고 있기 때문에 값이 같이 변한다
// const useState = (initialValue) => {
//   if (!_val) {
//     _val = initialValue;
//   }

//   function setState(newVal) {
//     _val = newVal;
//   }
//   return [_val, setState];
// };

// const MyReact = {
//   render(Component) {
//     const Comp = Component();
//     Comp.render();
//     return Comp;
//   },
// };

let hooks = []; // 동일 hook이 같은 값을 보지 않기 위해 배열로 변경
let currentHook = 0;  // index 시작은 0부터

// 호출 순서에 의존 (호출할 때 순서가 변경된다. => count가 늘어난다 => 다음 호출에 영향을 미친다(단순하게 index만 사용하고 있기 때문이다))
// state를 최상단에서 사용해야 하는 이유
export const useState = (initialValue) => {
  // 값이 초기화 되지 않았다면 초기값을 할당
  hooks[currentHook] = hooks[currentHook] || initialValue;
  const hookIndex = currentHook;  // 현재 hooks의 index 위치를 불러온다

  const setState = (newState) => {
    if(typeof newState === "function") {  // setState에 함수형 업데이트가 들어오면 조건 분기
      hooks[hookIndex] = newState(hooks[hookIndex]);
      console.log('hooks =>', hooks);
    } else {
      hooks[hookIndex] = newState;  // hooks index 위치에 setState로 변경된 값 저장
      console.log('hooks =>', hooks);
    }
  };

  // currentHook++로 return 후 index를 1증가 하여 다음 state가 들어갈 수 있게 만든다
  return [hooks[currentHook++], setState];  // useState가 호출되었을 때 return 하는 값
};

// let _deps = [];

// 의존성 배열에 객체가 들어오면 객체 안의 값이 변경되어도 동작 안 할수 있다
// 그래서 React는 불변성을 잘 유지해야 한다
export const useEffect = (callback, depArray) => {  
  const hasNoDeps = !depArray;  // 의존성 배열이 존재하지 않는다
  const prevDeps = hooks[currentHook] ? hooks[currentHook].deps : undefined;  // effect가 실행 되기 전이면 undefined, effect가 실행 후 재호출되었으면 이전의 의존성 배열을 불러온다

  const prevCleanup = hooks[currentHook] ? hooks[currentHook].cleanup : undefined;  // effect가 실행 되기 전이면 undefined, effect가 실행 후 재호출되었으면 이전에 저장된 클린업 함수를 불러온다

  const hasChangedDeps = prevDeps
    ? !depArray.every((el, i) => el === prevDeps[i]) // 모든 값이 의존성 배열의 모든 값과 같은가 확인
    : true; 
  
  if (hasNoDeps || hasChangedDeps) {
    if(prevCleanup) prevCleanup();  // 실행할 클린업 함수가 있으면 클린업 함수 실행
    const cleanup = callback(); // callback 안에 들어있는 클린업 함수를 저장
    hooks[currentHook] = { deps: depArray, cleanup }; // hooks 배열에 변경된 deps랑 클린업 함수 저장 
    console.log('hooks =>', hooks);
  }
  currentHook++;  // 다음번 hook으로 넘어가주세요
};

export default MyReact;