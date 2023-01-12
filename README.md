# react-state-pool

A simple library to for state management in react applications.
This library is kept as simple as possile. It aimes to tackle only one issue is to make global data become global state.
It is built on top of react hook, all best practices of using react hook should be applied
<br/>

## Installation

```sh
yarn add react-state-pool
```

Or

```sh
npm install react-state-pool
```

<br/>

## How to use

It requires two step to use this library

1. Initialize a state pool where sharing data is stored by `initStatePool`
2. Use `usePoolState` hook to use data stored in state pool as global state inside component

See below example to know how to use this library

```jsx
import {initStatePool} from 'react-state-pool';

const inititalData = {count: undefined};
const myPool = initStatePool(initialdata);

// Use disabled argument to dynamically subcribe and unsubcribe state update
function Playground(props) {
  const [count, setCount] = usePoolState({
    pool,
    fieldName: 'count',
    disabled: props?.notWatch,
  });

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(prv => prv + 1)}>Increase Count</button>
    </div>
  );
}

// Use setValue method to update state outside component
export async function getData() {
  const res = await fetch('url');
  res?.data?.count && pool.setValue('count', res.data.count);
}
```

<br/>

## Best practices

1. This library is fully type supported, you should defined type or initial data to make type recommendation works
2. Defining initial data is recommended to improve code's readability
