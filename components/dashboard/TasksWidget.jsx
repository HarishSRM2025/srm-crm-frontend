"use client";

import { useState } from "react";
import { LuCheck as Check, LuCircle as Circle } from "react-icons/lu";
import { tasks as initialTasks } from "@/lib/data";

const priorityStyles = {
  high: "bg-primary-50 text-primary-700",
  medium: "bg-secondary-50 text-secondary-700",
  low: "bg-primary-50/60 text-primary-400",
};

export default function TasksWidget() {
  const [tasks, setTasks] = useState(initialTasks);

  const toggleTask = (title) => {
    setTasks((prev) =>
      prev.map((t) => (t.title === title ? { ...t, done: !t.done } : t))
    );
  };

  const remaining = tasks.filter((t) => !t.done).length;

  return (
    <section
      aria-label="Tasks"
      className="rounded-xl border border-primary-100 bg-white p-5"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-primary-950">My tasks</h2>
        <span className="rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-600">
          {remaining} open
        </span>
      </div>

      <ul className="mt-3 divide-y divide-primary-50">
        {tasks.map((task) => (
          <li key={task.title} className="flex items-start gap-3 py-2.5">
            <button
              onClick={() => toggleTask(task.title)}
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                task.done
                  ? "border-secondary-600 bg-secondary-600 text-white"
                  : "border-primary-200 text-transparent hover:border-primary-400"
              }`}
              aria-label={task.done ? "Mark as not done" : "Mark as done"}
            >
              <Check size={12} strokeWidth={3} />
            </button>

            <div className="min-w-0 flex-1">
              <p
                className={`text-sm font-medium ${
                  task.done ? "text-primary-300 line-through" : "text-primary-900"
                }`}
              >
                {task.title}
              </p>
              <p className="text-xs text-primary-400">{task.due}</p>
            </div>

            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${priorityStyles[task.priority]}`}
            >
              {task.priority}
            </span>
          </li>
        ))}
      </ul>

      <button className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-primary-200 py-2 text-xs font-medium text-primary-500 hover:border-primary-300 hover:text-primary-700">
        <Circle size={12} />
        Add task
      </button>
    </section>
  );
}
