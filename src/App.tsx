import { useState } from 'react';

function TodoList() {
  // 初始化一个任务列表状态
  const [todos, setTodos] = useState(['学习 React', '掌握 Hooks']);

  const addTodo = () => {
    // 错误做法：直接修改原状态数组
    todos.push('新的任务'); // 直接使用 push 修改原数组
    // 虽然调用了 setTodosState，但传递的是同一个数组引用
    setTodos(todos);
  };

  return (
    <div>
      <button onClick={addTodo}>添加任务</button>
      <ul>
        {todos.map((todo, index) => (
          <li key={index}>{todo}</li>
        ))}
      </ul>
    </div>
  );
}
export default TodoList;