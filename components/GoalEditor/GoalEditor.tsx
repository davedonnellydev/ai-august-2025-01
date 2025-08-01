'use client';

import { useEffect, useState } from 'react';
import { Button, Stack, Text, Textarea, TextInput } from '@mantine/core';
import { Goal, TaskListResponse } from '@/app/lib/api/types';
import { ClientRateLimiter } from '@/app/lib/utils/api-helpers';

interface GoalEditorProps {
  selectedGoal: Goal | null;
  onGoalUpdate: (updatedGoal: Goal) => void;
  onTaskListResponse: (response: TaskListResponse, updateType: 'new' | 'additional') => void;
}

export function GoalEditor({ selectedGoal, onGoalUpdate, onTaskListResponse }: GoalEditorProps) {
  const [goalName, setGoalName] = useState('Untitled_01');
  const [goalPrompt, setGoalPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [remainingRequests, setRemainingRequests] = useState(0);

  // Update remaining requests on component mount and after translations
  useEffect(() => {
    setRemainingRequests(ClientRateLimiter.getRemainingRequests());
  }, []);

  useEffect(() => {
    if (selectedGoal) {
      setGoalName(selectedGoal.current_goal_name || 'Untitled_01');
      setGoalPrompt(selectedGoal.current_goal_prompt || '');
    } else {
      setGoalName('Untitled_01');
      setGoalPrompt('');
    }
  }, [selectedGoal]);

  const handleGoalNameChange = (value: string) => {
    setGoalName(value);
    if (selectedGoal) {
      const updatedGoal = {
        ...selectedGoal,
        current_goal_name: value,
      };
      console.log('Updating goal name:', updatedGoal);
      onGoalUpdate(updatedGoal);
    }
  };

  const handleGoalPromptChange = (value: string) => {
    setGoalPrompt(value);
    if (selectedGoal) {
      const updatedGoal = {
        ...selectedGoal,
        current_goal_prompt: value,
      };
      console.log('Updating goal prompt:', updatedGoal);
      onGoalUpdate(updatedGoal);
    }
  };

  const handleGenerateNewTasks = async () => {
    if (!selectedGoal || !goalPrompt.trim()) {
      console.log('No goal selected or no prompt entered');
      return;
    }

    // Check rate limit before proceeding
    if (!ClientRateLimiter.checkLimit()) {
      setError('Rate limit exceeded. Please try again later.');
      setRemainingRequests(ClientRateLimiter.getRemainingRequests());
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/openai/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: goalPrompt,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'API call failed');
      }

      const result: TaskListResponse = await response.json();
      onTaskListResponse(result, 'new');

      // Update remaining requests after successful translation
      setRemainingRequests(ClientRateLimiter.getRemainingRequests());
    } catch (err) {
      console.error('API error:', err);
      setError(err instanceof Error ? err.message : 'API failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCurrentTasks = async () => {
    if (!selectedGoal || !goalPrompt.trim()) {
      console.log('No goal selected or no prompt entered');
      return;
    }

    // Check rate limit before proceeding
    if (!ClientRateLimiter.checkLimit()) {
      setError('Rate limit exceeded. Please try again later.');
      setRemainingRequests(ClientRateLimiter.getRemainingRequests());
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/openai/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: goalPrompt,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'API call failed');
      }

      const result: TaskListResponse = await response.json();
      onTaskListResponse(result, 'additional');

      // Update remaining requests after successful translation
      setRemainingRequests(ClientRateLimiter.getRemainingRequests());
    } catch (err) {
      console.error('API error:', err);
      setError(err instanceof Error ? err.message : 'API failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Stack gap="md">
        <TextInput
          value={goalName}
          onChange={(event) => handleGoalNameChange(event.currentTarget.value)}
          size="xl"
          styles={{
            input: {
              fontSize: '2rem',
              fontWeight: 'bold',
              border: 'none',
              backgroundColor: 'transparent',
              padding: '0',
            },
          }}
          placeholder="Untitled_01"
        />

        <Textarea
          value={goalPrompt}
          onChange={(event) => handleGoalPromptChange(event.currentTarget.value)}
          placeholder="Enter your goal description here..."
          minRows={4}
          maxRows={8}
          size="md"
        />

        <Stack gap="sm" style={{ flexDirection: 'row' }}>
          <Button
            variant="filled"
            color="blue"
            onClick={handleGenerateNewTasks}
            disabled={!selectedGoal}
            loading={isLoading}
          >
            Generate New Tasks
          </Button>

          <Button
            variant="outline"
            color="blue"
            onClick={handleAddToCurrentTasks}
            disabled={!selectedGoal}
            loading={isLoading}
          >
            Add to Current Tasks
          </Button>
        </Stack>
        {error && (
          <Text c="red" ta="center" size="lg" maw={580} mx="auto" mt="xl">
            Error: {error}
          </Text>
        )}
        <Text c="dimmed" ta="center" size="sm" maw={580} mx="auto" mt="xl">
          You have {remainingRequests} task generation attempts remaining.
        </Text>
      </Stack>
    </div>
  );
}
