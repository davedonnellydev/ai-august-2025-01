'use client';

import { useState } from 'react';
import { AppShell, Burger, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Goal, TaskListResponse } from '@/app/lib/api/types';
import classes from '@/components/Header/Headser.module.css';
import { GoalEditor } from '../components/GoalEditor/GoalEditor';
import { GoalList } from '../components/GoalList/GoalList';
import { TaskList } from '../components/TaskList/TaskList';

export default function HomePage() {
  const [opened, { toggle }] = useDisclosure();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  const handleGoalSelect = (goal: Goal) => {
    setSelectedGoal(goal);
  };

  const handleGoalsUpdate = (updatedGoals: Goal[]) => {
    console.log('Updating goals in parent:', updatedGoals);
    setGoals(updatedGoals);
    localStorage.setItem('goals', JSON.stringify(updatedGoals));
  };

  const handleGoalUpdate = (updatedGoal: Goal) => {
    const updatedGoals = goals.map((goal) =>
      goal.created_datetime === updatedGoal.created_datetime ? updatedGoal : goal
    );
    setGoals(updatedGoals);
    setSelectedGoal(updatedGoal);
    localStorage.setItem('goals', JSON.stringify(updatedGoals));
  };

  const handleTaskListResponse = (
    response: TaskListResponse,
    updateType: 'new' | 'additional' = 'additional'
  ) => {
    if (selectedGoal) {
      const updatedGoal = { ...selectedGoal };
      const responseData = response.response;

      if (typeof responseData !== 'string' && responseData.tasks) {
        const newTasks = responseData.tasks.map((goalTask, index) => ({
          task_description: goalTask.task,
          task_status: false,
          openai_response_id: response.response_id,
          order: goalTask.order,
          created_datetime: new Date().toISOString(),
        }));

        if (updateType === 'new') {
          // Replace existing tasks with new ones
          updatedGoal.tasks = [...newTasks];
        } else if (updateType === 'additional') {
          // Add new tasks to existing ones
          updatedGoal.tasks = [...(updatedGoal.tasks || []), ...newTasks];
        }

        handleGoalUpdate(updatedGoal);
      }
    }
  };

  return (
    <AppShell
      padding="md"
      header={{ height: 150 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
    >
      <AppShell.Header>
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        <Title className={classes.title} ta="center" mt={10}>
          To{' '}
          <Text
            inherit
            variant="gradient"
            component="span"
            gradient={{ from: 'pink', to: 'yellow' }}
          >
            Do
          </Text>
        </Title>
      </AppShell.Header>

      <AppShell.Navbar>
        <GoalList onGoalSelect={handleGoalSelect} onGoalsUpdate={handleGoalsUpdate} />
      </AppShell.Navbar>

      <AppShell.Main>
        <GoalEditor
          selectedGoal={selectedGoal}
          onGoalUpdate={handleGoalUpdate}
          onTaskListResponse={handleTaskListResponse}
        />
        <TaskList selectedGoal={selectedGoal} onGoalUpdate={handleGoalUpdate} />
      </AppShell.Main>
    </AppShell>
  );
}
