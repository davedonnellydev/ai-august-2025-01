import { Goal } from '@/app/lib/api/types';
import { render, screen, userEvent } from '@/test-utils';
import { GoalList } from './GoalList';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

const mockGoal: Goal = {
  tasks: [],
  current_goal_prompt: 'Test goal',
  current_goal_name: 'Test Goal',
  current_goal_prompt_id: 'test-id',
  current_goal_prompt_created_datetime: '2024-01-01T00:00:00.000Z',
  previous_goal_prompts: [],
  order: 1,
  created_datetime: '2024-01-01T00:00:00.000Z',
};

describe('GoalList component', () => {
  const mockOnGoalSelect = jest.fn();
  const mockOnGoalsUpdate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('renders the goals title', () => {
    render(
      <GoalList goals={[]} onGoalSelect={mockOnGoalSelect} onGoalsUpdate={mockOnGoalsUpdate} />
    );
    expect(screen.getByText('Goals')).toBeInTheDocument();
  });

  it('renders "New Goal" button', () => {
    render(
      <GoalList goals={[]} onGoalSelect={mockOnGoalSelect} onGoalsUpdate={mockOnGoalsUpdate} />
    );
    expect(screen.getByText('New Goal')).toBeInTheDocument();
  });

  it('renders "Reset All Goals" button', () => {
    render(
      <GoalList goals={[]} onGoalSelect={mockOnGoalSelect} onGoalsUpdate={mockOnGoalsUpdate} />
    );
    expect(screen.getByText('Reset All Goals')).toBeInTheDocument();
  });

  it('shows "No goals yet" when no goals exist', () => {
    render(
      <GoalList goals={[]} onGoalSelect={mockOnGoalSelect} onGoalsUpdate={mockOnGoalsUpdate} />
    );
    expect(screen.getByText('No goals yet')).toBeInTheDocument();
  });

  it('creates a new goal when "New Goal" button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <GoalList goals={[]} onGoalSelect={mockOnGoalSelect} onGoalsUpdate={mockOnGoalsUpdate} />
    );

    const newGoalButton = screen.getByText('New Goal');
    await user.click(newGoalButton);

    expect(mockOnGoalsUpdate).toHaveBeenCalledWith([
      expect.objectContaining({
        current_goal_name: 'Untitled_01',
      }),
    ]);
    expect(mockOnGoalSelect).toHaveBeenCalled();
  });

  it('resets all goals when "Reset All Goals" button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <GoalList goals={[]} onGoalSelect={mockOnGoalSelect} onGoalsUpdate={mockOnGoalsUpdate} />
    );

    const resetButton = screen.getByText('Reset All Goals');
    await user.click(resetButton);

    expect(localStorageMock.removeItem).toHaveBeenCalledWith('goals');
    expect(mockOnGoalsUpdate).toHaveBeenCalledWith([]);
  });

  it('displays goals passed from parent', () => {
    render(
      <GoalList
        goals={[mockGoal]}
        onGoalSelect={mockOnGoalSelect}
        onGoalsUpdate={mockOnGoalsUpdate}
      />
    );

    expect(screen.getByText('Test Goal')).toBeInTheDocument();
  });
});
