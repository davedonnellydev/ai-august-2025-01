'use client';

import { useEffect, useState } from 'react';
import { Text, Button, Stack, Title } from '@mantine/core';
import { Goal } from '@/app/lib/api/types';

interface GoalListProps {
  onGoalSelect: (goal: Goal) => void;
  onGoalsUpdate: (goals: Goal[]) => void;
}

export function GoalList({ onGoalSelect, onGoalsUpdate }: GoalListProps) {
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    // Check localStorage for stored goals on component mount
    const storedGoals = localStorage.getItem('goals');
    if (storedGoals) {
      try {
        const parsedGoals = JSON.parse(storedGoals) as Goal[];
        setGoals(parsedGoals);
        onGoalsUpdate(parsedGoals);
      } catch (error) {
        console.error('Error parsing stored goals:', error);
      }
    }
  }, []); // Only run on mount

  const handleNewGoal = () => {
    const now = new Date().toISOString();

    // Find the highest Untitled number
    const untitledGoals = goals.filter(goal =>
      goal.current_goal_name?.startsWith('Untitled_')
    );

    let nextNumber = 1;
    if (untitledGoals.length > 0) {
      const numbers = untitledGoals.map(goal => {
        const match = goal.current_goal_name?.match(/Untitled_(\d+)/);
        return match ? parseInt(match[1]) : 0;
      });
      nextNumber = Math.max(...numbers) + 1;
    }

    const newGoal: Goal = {
      tasks: [],
      current_goal_prompt: '',
      current_goal_name: `Untitled_${nextNumber.toString().padStart(2, '0')}`,
      current_goal_prompt_id: '',
      current_goal_prompt_created_datetime: now,
      previous_goal_prompts: [],
      order: goals.length + 1,
      created_datetime: now
    };

    console.log('Creating new goal:', newGoal);

    const updatedGoals = [...goals, newGoal];
    setGoals(updatedGoals);
    onGoalsUpdate(updatedGoals);

    // Select the new goal
    onGoalSelect(newGoal);
  };

  const handleGoalClick = (goal: Goal) => {
    onGoalSelect(goal);
  };

  const handleResetAllGoals = () => {
    // Clear goals from localStorage
    localStorage.removeItem('goals');

    // Update local state
    setGoals([]);

    // Update parent state
    onGoalsUpdate([]);

    // Clear selected goal
    onGoalSelect(null as any);

    console.log('All goals cleared from localStorage');
  };

  return (
    <div style={{ padding: '20px' }}>
      <Title order={3} mb="md">Goals</Title>

      <Stack gap="sm">
        {goals.length > 0 ? (
          goals.map((goal, index) => (
            <Text
              key={index}
              size="sm"
              style={{ cursor: 'pointer' }}
              onClick={() => handleGoalClick(goal)}
            >
              {goal.current_goal_name}
            </Text>
          ))
        ) : (
          <Text size="sm" c="dimmed">No goals yet</Text>
        )}

        <Button
          variant="filled"
          color="blue"
          size="sm"
          onClick={handleNewGoal}
          style={{ marginTop: '10px' }}
        >
          New Goal
        </Button>

        <Button
          variant="filled"
          color="red"
          size="sm"
          onClick={handleResetAllGoals}
          style={{ marginTop: '10px' }}
        >
          Reset All Goals
        </Button>
      </Stack>
    </div>
  );
}