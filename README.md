# react-state-pool

This is a simple library to manage state in react applications.
To avoid messing up state management, it aims to tackle only one issue is making global data become global state with a minimum number of APIs. All APIs are very easy to start with.
<br/>

<div align="center">
  <p>
    <a href="https://www.npmjs.com/package/react-state-pool">
      <img src="https://img.shields.io/npm/v/react-state-pool.svg?style=for-the-badge" alt=""/>
    </a>
    <a href="https://www.npmjs.com/package/react-state-pool">
      <img src="https://img.shields.io/npm/dm/react-state-pool?style=for-the-badge" alt=""/>
    </a>
    <a href="https://www.npmjs.com/package/react-state-pool">
      <img src="https://img.shields.io/npm/dt/react-state-pool?style=for-the-badge" alt=""/>
      </a>
  </p>
</div>

## Installation

```sh
yarn add react-state-pool
```

Or

```sh
npm install react-state-pool
```

## Features

- Small size and simple APIs
- Fully type supported
- Subscribe and unsubscribe to state update dynamicaly

## Quickstart

It requires two steps to use this library

1. Initialize a state pool where global data is stored by using `initStatePool`
2. Use `usePoolState` hook to use data stored in state pool as global state inside component

```jsx
import {initStatePool} from 'react-state-pool';

const inititalData = {count: null};
const myPool = initStatePool(initialdata);

// Use disabled argument to subcribe and unsubcribe to state update dynamically
function Playground(props) {
  const [count, setCount] = usePoolState({
    pool,
    fieldName: 'count',
    disabled: props?.disabled,
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

## [Documentation](https://github.com/canhtvee/react-state-pool/tree/master/docs)
