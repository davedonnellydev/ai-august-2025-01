import { Goal, TaskListResponse } from '@/app/lib/api/types';
import { render, screen, userEvent } from '@/test-utils';
import { GoalEditor } from './GoalEditor';

// Mock the ClientRateLimiter
jest.mock('../../app/lib/utils/api-helpers', () => ({
  ClientRateLimiter: {
    getRemainingRequests: jest.fn(() => 10),
    checkLimit: jest.fn(() => true),
  },
}));

// Mock fetch
global.fetch = jest.fn();

const mockGoal: Goal = {
  tasks: [],
  current_goal_prompt: 'Test goal prompt',
  current_goal_name: 'Test Goal',
  current_goal_prompt_id: 'test-id',
  current_goal_prompt_created_datetime: '2024-01-01T00:00:00.000Z',
  previous_goal_prompts: [],
  order: 1,
  created_datetime: '2024-01-01T00:00:00.000Z',
};

const mockTaskListResponse: TaskListResponse = {
  response: {
    goal: 'Test goal',
    goal_name: 'Test Goal',
    tasks: [
      { order: 1, task: 'Task 1' },
      { order: 2, task: 'Task 2' },
    ],
  },
  originalInput: 'Test input',
  response_id: 'response-123',
  remainingRequests: 9,
};

describe('GoalEditor component', () => {
  const mockOnGoalUpdate = jest.fn();
  const mockOnTaskListResponse = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockTaskListResponse,
    });
  });

  it('renders goal name input field', () => {
    render(
      <GoalEditor
        selectedGoal={mockGoal}
        onGoalUpdate={mockOnGoalUpdate}
        onTaskListResponse={mockOnTaskListResponse}
      />
    );
    expect(screen.getByDisplayValue('Test Goal')).toBeInTheDocument();
  });

  it('renders goal prompt textarea', () => {
    render(
      <GoalEditor
        selectedGoal={mockGoal}
        onGoalUpdate={mockOnGoalUpdate}
        onTaskListResponse={mockOnTaskListResponse}
      />
    );
    expect(screen.getByDisplayValue('Test goal prompt')).toBeInTheDocument();
  });

  it('renders "Generate New Tasks" button', () => {
    render(
      <GoalEditor
        selectedGoal={mockGoal}
        onGoalUpdate={mockOnGoalUpdate}
        onTaskListResponse={mockOnTaskListResponse}
      />
    );
    expect(screen.getByRole('button', { name: 'Generate New Tasks' })).toBeInTheDocument();
  });

  it('renders "Add to Current Tasks" button', () => {
    render(
      <GoalEditor
        selectedGoal={mockGoal}
        onGoalUpdate={mockOnGoalUpdate}
        onTaskListResponse={mockOnTaskListResponse}
      />
    );
    expect(screen.getByRole('button', { name: 'Add to Current Tasks' })).toBeInTheDocument();
  });

  it('displays remaining requests count', () => {
    render(
      <GoalEditor
        selectedGoal={mockGoal}
        onGoalUpdate={mockOnGoalUpdate}
        onTaskListResponse={mockOnTaskListResponse}
      />
    );
    expect(screen.getByText(/You have \d+ task generation attempts remaining/)).toBeInTheDocument();
  });

  it('allows editing goal name', async () => {
    const user = userEvent.setup();
    render(
      <GoalEditor
        selectedGoal={mockGoal}
        onGoalUpdate={mockOnGoalUpdate}
        onTaskListResponse={mockOnTaskListResponse}
      />
    );

    const nameInput = screen.getByDisplayValue('Test Goal');
    await user.clear(nameInput);
    await user.type(nameInput, 'Updated Goal');

    expect(mockOnGoalUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        current_goal_name: 'Updated Goal',
      })
    );
  });

  it('allows editing goal prompt', async () => {
    const user = userEvent.setup();
    render(
      <GoalEditor
        selectedGoal={mockGoal}
        onGoalUpdate={mockOnGoalUpdate}
        onTaskListResponse={mockOnTaskListResponse}
      />
    );

    const promptTextarea = screen.getByDisplayValue('Test goal prompt');
    await user.clear(promptTextarea);
    await user.type(promptTextarea, 'Updated prompt');

    expect(mockOnGoalUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        current_goal_prompt: 'Updated prompt',
      })
    );
  });

  it('shows message when no goal is selected', () => {
    render(
      <GoalEditor
        selectedGoal={null}
        onGoalUpdate={mockOnGoalUpdate}
        onTaskListResponse={mockOnTaskListResponse}
      />
    );

    expect(screen.getByText('Add a new goal or select one from the side to begin!')).toBeInTheDocument();
  });

  it('calls API when "Generate New Tasks" is clicked', async () => {
    const user = userEvent.setup();
    render(
      <GoalEditor
        selectedGoal={mockGoal}
        onGoalUpdate={mockOnGoalUpdate}
        onTaskListResponse={mockOnTaskListResponse}
      />
    );

    const generateButton = screen.getByRole('button', { name: 'Generate New Tasks' });
    await user.click(generateButton);

    expect(global.fetch).toHaveBeenCalledWith('/api/openai/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: 'Test goal prompt',
      }),
    });
  });

  it('calls API when "Add to Current Tasks" is clicked', async () => {
    const user = userEvent.setup();
    render(
      <GoalEditor
        selectedGoal={mockGoal}
        onGoalUpdate={mockOnGoalUpdate}
        onTaskListResponse={mockOnTaskListResponse}
      />
    );

    const addButton = screen.getByRole('button', { name: 'Add to Current Tasks' });
    await user.click(addButton);

    expect(global.fetch).toHaveBeenCalledWith('/api/openai/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: 'Test goal prompt',
      }),
    });
  });
});
