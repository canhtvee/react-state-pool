import React from 'react';
import {initStatePool} from 'react-state-pool';

const initialData = {count: undefined};
const pool = initStatePool(initialData);

export function Playground() {
  const [count, setCount] = usePoolState({
    pool,
    fieldName: 'count',
   });

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(prv => prv + 1)}>Increase Count</button>
    </div>
  );
}

export async function getData() {
  const res = await fetch('url');
  res?.data && pool.setValue('count', res.data.count);
}
