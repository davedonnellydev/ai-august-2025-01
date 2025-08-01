// Common API response types
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  status: number;
}

// Error types
export interface ApiError {
  message: string;
  code?: string;
  status: number;
  details?: any;
}

// Request configuration
export interface RequestConfig {
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
  cache?: boolean;
}

// Proxy configuration
export interface ProxyConfig {
  target: string;
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
  cache?: boolean;
}

export interface GoalTasks {
  order: number;
  task: string;
}
export interface TaskList {
  goal: string;
  goal_name: string;
  tasks: GoalTasks[];
}

export interface TaskListResponse {
  response: TaskList | string;
  originalInput: string;
  response_id: string;
  remainingRequests: number;
}

export interface Task {
  task_description: string;
  task_status: boolean;
  openai_response_id: string;
  order: number;
  created_datetime: string;
}

export interface GoalPrompt {
  goal_prompt: string;
  goal_name: string;
  openai_response_id: string;
  created_datetime: string;
}

export interface Goal {
  tasks?: Task[];
  current_goal_prompt?: string;
  current_goal_name?: string;
  current_goal_prompt_id?: string;
  current_goal_prompt_created_datetime?: string;
  previous_goal_prompts?: GoalPrompt[];
  order?: number;
  created_datetime: string;
}
