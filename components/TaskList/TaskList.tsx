'use client';

import { useEffect, useState } from 'react';
import { Checkbox, Stack, Text, Title } from '@mantine/core';
import { Goal, Task } from '@/app/lib/api/types';

interface TaskListProps {
  selectedGoal: Goal | null;
  onGoalUpdate: (updatedGoal: Goal) => void;
}

export function TaskList({ selectedGoal, onGoalUpdate }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (selectedGoal && selectedGoal.tasks) {
      setTasks(selectedGoal.tasks);
    } else {
      setTasks([]);
    }
  }, [selectedGoal]);

  const handleTaskStatusChange = (taskIndex: number, checked: boolean) => {
    if (!selectedGoal) {
      return;
    }

    const updatedTasks = tasks.map((task, index) =>
      index === taskIndex ? { ...task, task_status: checked } : task
    );

    setTasks(updatedTasks);

    const updatedGoal = {
      ...selectedGoal,
      tasks: updatedTasks,
    };

    onGoalUpdate(updatedGoal);
  };

  if (!selectedGoal) {
    return;
  }

  return (
    <div style={{ padding: '20px' }}>
      <Title order={4} mb="md">
        Tasks
      </Title>

      {tasks.length > 0 ? (
        <Stack gap="sm">
          {tasks.map((task, index) => (
            <Checkbox
              key={`${task.openai_response_id}-${task.order}`}
              checked={task.task_status}
              onChange={(event) => handleTaskStatusChange(index, event.currentTarget.checked)}
              label={task.task_description}
              size="md"
            />
          ))}
        </Stack>
      ) : (
        <Text c="dimmed">No tasks yet. Generate tasks using the buttons above.</Text>
      )}
    </div>
  );
}
