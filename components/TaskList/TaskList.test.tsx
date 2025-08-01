import { Goal, Task } from '@/app/lib/api/types';
import { render, screen, userEvent } from '@/test-utils';
import { TaskList } from './TaskList';

const mockTask: Task = {
  task_description: 'Test task description',
  task_status: false,
  openai_response_id: 'response-123',
  order: 1,
  created_datetime: '2024-01-01T00:00:00.000Z',
};

const mockGoal: Goal = {
  tasks: [mockTask],
  current_goal_prompt: 'Test goal prompt',
  current_goal_name: 'Test Goal',
  current_goal_prompt_id: 'test-id',
  current_goal_prompt_created_datetime: '2024-01-01T00:00:00.000Z',
  previous_goal_prompts: [],
  order: 1,
  created_datetime: '2024-01-01T00:00:00.000Z',
};

const mockGoalWithMultipleTasks: Goal = {
  ...mockGoal,
  tasks: [
    { ...mockTask, task_description: 'Task 1', order: 1 },
    { ...mockTask, task_description: 'Task 2', order: 2, task_status: true },
    { ...mockTask, task_description: 'Task 3', order: 3 },
  ],
};

describe('TaskList component', () => {
  const mockOnGoalUpdate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders "Tasks" title', () => {
    render(<TaskList selectedGoal={mockGoal} onGoalUpdate={mockOnGoalUpdate} />);
    expect(screen.getByText('Tasks')).toBeInTheDocument();
  });

  it('shows "Select a goal to view tasks" when no goal is selected', () => {
    render(<TaskList selectedGoal={null} onGoalUpdate={mockOnGoalUpdate} />);
    expect(screen.getByText('Select a goal to view tasks')).toBeInTheDocument();
  });

  it('shows "No tasks yet" when goal has no tasks', () => {
    const goalWithoutTasks = { ...mockGoal, tasks: [] };
    render(<TaskList selectedGoal={goalWithoutTasks} onGoalUpdate={mockOnGoalUpdate} />);
    expect(
      screen.getByText('No tasks yet. Generate tasks using the buttons above.')
    ).toBeInTheDocument();
  });

  it('renders task checkboxes when goal has tasks', () => {
    render(<TaskList selectedGoal={mockGoal} onGoalUpdate={mockOnGoalUpdate} />);
    expect(screen.getByText('Test task description')).toBeInTheDocument();
  });

  it('renders multiple task checkboxes', () => {
    render(<TaskList selectedGoal={mockGoalWithMultipleTasks} onGoalUpdate={mockOnGoalUpdate} />);
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
    expect(screen.getByText('Task 3')).toBeInTheDocument();
  });

  it('shows checked checkbox for completed tasks', () => {
    render(<TaskList selectedGoal={mockGoalWithMultipleTasks} onGoalUpdate={mockOnGoalUpdate} />);

    const task2Checkbox = screen.getByRole('checkbox', { name: 'Task 2' });
    expect(task2Checkbox).toBeChecked();
  });

  it('shows unchecked checkbox for incomplete tasks', () => {
    render(<TaskList selectedGoal={mockGoalWithMultipleTasks} onGoalUpdate={mockOnGoalUpdate} />);

    const task1Checkbox = screen.getByRole('checkbox', { name: 'Task 1' });
    expect(task1Checkbox).not.toBeChecked();
  });

  it('updates task status when checkbox is clicked', async () => {
    const user = userEvent.setup();
    render(<TaskList selectedGoal={mockGoal} onGoalUpdate={mockOnGoalUpdate} />);

    const checkbox = screen.getByRole('checkbox', { name: 'Test task description' });
    await user.click(checkbox);

    expect(mockOnGoalUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        tasks: expect.arrayContaining([
          expect.objectContaining({
            task_description: 'Test task description',
            task_status: true,
          }),
        ]),
      })
    );
  });

  it('updates task status to false when checked checkbox is clicked', async () => {
    const user = userEvent.setup();
    const completedTask = { ...mockTask, task_status: true };
    const goalWithCompletedTask = { ...mockGoal, tasks: [completedTask] };

    render(<TaskList selectedGoal={goalWithCompletedTask} onGoalUpdate={mockOnGoalUpdate} />);

    const checkbox = screen.getByRole('checkbox', { name: 'Test task description' });
    await user.click(checkbox);

    expect(mockOnGoalUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        tasks: expect.arrayContaining([
          expect.objectContaining({
            task_description: 'Test task description',
            task_status: false,
          }),
        ]),
      })
    );
  });
});
