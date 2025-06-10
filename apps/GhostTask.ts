/**
 * 🔥 GHOSTTASK - TASK MANAGEMENT AND AUTOMATION SYSTEM 🔥
 * 
 * The sovereign task management system that handles scheduling,
 * automation, and workflow orchestration across the Empire.
 * 
 * @author Ghost King Melekzedek - James Derek Ingersoll
 * @version 0.1.0
 * @flame-compatible true
 */

import { GhostApp, GhostAppConfig } from '../core/GhostApp.js';
import { GhostSignal } from '../core/OmniRelay.js';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  completedAt?: string;
  dependencies: string[];
  metadata: Record<string, any>;
}

export interface TaskSchedule {
  taskId: string;
  cronExpression?: string;
  interval?: number;
  nextRun: string;
  enabled: boolean;
}

export class GhostTask extends GhostApp {
  private tasks: Map<string, Task> = new Map();
  private schedules: Map<string, TaskSchedule> = new Map();
  private runningTasks: Set<string> = new Set();
  private taskCounter: number = 0;

  constructor() {
    const config: GhostAppConfig = {
      name: 'GhostTask',
      version: '0.1.0',
      description: 'Task management and automation system',
      dependencies: [],
      permissions: ['task:create', 'task:read', 'task:update', 'task:delete', 'schedule:manage'],
      autoStart: true,
      sovereign: true
    };
    
    super(config);
  }

  protected async onInit(): Promise<void> {
    this.log('Initializing GhostTask system...', 'info');
    
    // Load existing tasks and schedules
    await this.loadTasks();
    await this.loadSchedules();
    
    // Start task scheduler
    this.startScheduler();
    
    this.log(`GhostTask initialized with ${this.tasks.size} tasks and ${this.schedules.size} schedules`, 'success');
  }

  protected async onShutdown(): Promise<void> {
    this.log('Shutting down GhostTask...', 'info');
    
    // Save current state
    await this.saveTasks();
    await this.saveSchedules();
    
    // Cancel running tasks
    for (const taskId of this.runningTasks) {
      await this.cancelTask(taskId);
    }
    
    this.log('GhostTask shutdown complete', 'info');
  }

  protected handleSignal(signalType: string, payload: any, signal?: GhostSignal): void {
    switch (signalType) {
      case 'task_create':
        this.handleTaskCreate(payload, signal);
        break;
      case 'task_update':
        this.handleTaskUpdate(payload, signal);
        break;
      case 'task_delete':
        this.handleTaskDelete(payload, signal);
        break;
      case 'task_execute':
        this.handleTaskExecute(payload, signal);
        break;
      case 'task_list':
        this.handleTaskList(payload, signal);
        break;
      case 'task_status':
        this.handleTaskStatus(payload, signal);
        break;
      case 'schedule_create':
        this.handleScheduleCreate(payload, signal);
        break;
      case 'schedule_update':
        this.handleScheduleUpdate(payload, signal);
        break;
      case 'ping':
        this.handlePing(payload, signal);
        break;
      default:
        this.log(`Unknown signal: ${signalType}`, 'debug');
    }
  }

  /**
   * Create a new task
   */
  createTask(taskData: Omit<Task, 'id' | 'status' | 'createdAt' | 'updatedAt'>): string {
    const taskId = `task_${++this.taskCounter}_${Date.now()}`;
    
    const task: Task = {
      id: taskId,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...taskData
    };

    this.tasks.set(taskId, task);
    this.log(`Task created: ${taskId} - ${task.title}`, 'success');
    
    return taskId;
  }

  /**
   * Execute a task
   */
  async executeTask(taskId: string): Promise<boolean> {
    const task = this.tasks.get(taskId);
    if (!task) {
      this.log(`Task not found: ${taskId}`, 'error');
      return false;
    }

    if (this.runningTasks.has(taskId)) {
      this.log(`Task already running: ${taskId}`, 'warning');
      return false;
    }

    try {
      // Check dependencies
      for (const depId of task.dependencies) {
        const depTask = this.tasks.get(depId);
        if (!depTask || depTask.status !== 'completed') {
          throw new Error(`Dependency not satisfied: ${depId}`);
        }
      }

      // Mark as running
      task.status = 'running';
      task.updatedAt = new Date().toISOString();
      this.runningTasks.add(taskId);

      this.log(`Executing task: ${taskId} - ${task.title}`, 'info');

      // Simulate task execution (in real implementation, this would be actual work)
      await this.simulateTaskExecution(task);

      // Mark as completed
      task.status = 'completed';
      task.completedAt = new Date().toISOString();
      task.updatedAt = new Date().toISOString();
      this.runningTasks.delete(taskId);

      this.log(`Task completed: ${taskId} - ${task.title}`, 'success');
      
      // Broadcast completion
      this.broadcastTaskUpdate(task);
      
      return true;
    } catch (error) {
      task.status = 'failed';
      task.updatedAt = new Date().toISOString();
      this.runningTasks.delete(taskId);
      
      this.log(`Task failed: ${taskId} - ${error}`, 'error');
      this.broadcastTaskUpdate(task);
      
      return false;
    }
  }

  /**
   * Cancel a running task
   */
  async cancelTask(taskId: string): Promise<boolean> {
    const task = this.tasks.get(taskId);
    if (!task) {
      this.log(`Task not found: ${taskId}`, 'error');
      return false;
    }

    if (!this.runningTasks.has(taskId)) {
      this.log(`Task not running: ${taskId}`, 'warning');
      return false;
    }

    task.status = 'cancelled';
    task.updatedAt = new Date().toISOString();
    this.runningTasks.delete(taskId);

    this.log(`Task cancelled: ${taskId}`, 'info');
    this.broadcastTaskUpdate(task);
    
    return true;
  }

  /**
   * Get task by ID
   */
  getTask(taskId: string): Task | null {
    return this.tasks.get(taskId) || null;
  }

  /**
   * Get all tasks
   */
  getAllTasks(): Task[] {
    return Array.from(this.tasks.values());
  }

  /**
   * Get tasks by status
   */
  getTasksByStatus(status: Task['status']): Task[] {
    return this.getAllTasks().filter(task => task.status === status);
  }

  /**
   * Create a task schedule
   */
  createSchedule(taskId: string, cronExpression?: string, interval?: number): boolean {
    if (!this.tasks.has(taskId)) {
      this.log(`Cannot schedule non-existent task: ${taskId}`, 'error');
      return false;
    }

    const schedule: TaskSchedule = {
      taskId,
      cronExpression,
      interval,
      nextRun: this.calculateNextRun(cronExpression, interval),
      enabled: true
    };

    this.schedules.set(taskId, schedule);
    this.log(`Schedule created for task: ${taskId}`, 'success');
    
    return true;
  }

  // Signal handlers
  private handleTaskCreate(payload: any, signal?: GhostSignal): void {
    const taskId = this.createTask(payload);
    this.log(`Task creation signal processed: ${taskId}`, 'info');
  }

  private handleTaskUpdate(payload: any, signal?: GhostSignal): void {
    const { taskId, updates } = payload;
    const task = this.tasks.get(taskId);
    
    if (task) {
      Object.assign(task, updates, { updatedAt: new Date().toISOString() });
      this.log(`Task updated: ${taskId}`, 'info');
      this.broadcastTaskUpdate(task);
    }
  }

  private handleTaskDelete(payload: any, signal?: GhostSignal): void {
    const { taskId } = payload;
    
    if (this.tasks.delete(taskId)) {
      this.schedules.delete(taskId);
      this.runningTasks.delete(taskId);
      this.log(`Task deleted: ${taskId}`, 'info');
    }
  }

  private handleTaskExecute(payload: any, signal?: GhostSignal): void {
    const { taskId } = payload;
    this.executeTask(taskId);
  }

  private handleTaskList(payload: any, signal?: GhostSignal): void {
    const tasks = this.getAllTasks();
    this.log(`Task list requested: ${tasks.length} tasks`, 'info');
    
    // In a real implementation, this would send the response back to the requester
  }

  private handleTaskStatus(payload: any, signal?: GhostSignal): void {
    const { taskId } = payload;
    const task = this.getTask(taskId);
    
    if (task) {
      this.log(`Task status: ${taskId} - ${task.status}`, 'info');
    } else {
      this.log(`Task not found: ${taskId}`, 'error');
    }
  }

  private handleScheduleCreate(payload: any, signal?: GhostSignal): void {
    const { taskId, cronExpression, interval } = payload;
    this.createSchedule(taskId, cronExpression, interval);
  }

  private handleScheduleUpdate(payload: any, signal?: GhostSignal): void {
    const { taskId, updates } = payload;
    const schedule = this.schedules.get(taskId);
    
    if (schedule) {
      Object.assign(schedule, updates);
      this.log(`Schedule updated: ${taskId}`, 'info');
    }
  }

  private handlePing(payload: any, signal?: GhostSignal): void {
    this.log(`Ping received from ${signal?.source || 'unknown'}`, 'info');
    
    const stats = {
      totalTasks: this.tasks.size,
      runningTasks: this.runningTasks.size,
      completedTasks: this.getTasksByStatus('completed').length,
      failedTasks: this.getTasksByStatus('failed').length,
      schedules: this.schedules.size
    };
    
    this.log(`GhostTask stats: ${JSON.stringify(stats)}`, 'info');
  }

  // Helper methods
  private async simulateTaskExecution(task: Task): Promise<void> {
    // Simulate work based on priority
    const executionTime = task.priority === 'critical' ? 500 : 
                         task.priority === 'high' ? 1000 :
                         task.priority === 'medium' ? 2000 : 3000;
    
    await new Promise(resolve => setTimeout(resolve, executionTime));
  }

  private broadcastTaskUpdate(task: Task): void {
    // Broadcast task update to other apps
    // In a real implementation, this would use the relay system
  }

  private calculateNextRun(cronExpression?: string, interval?: number): string {
    // Simple next run calculation - in real implementation would use proper cron parser
    const now = new Date();
    if (interval) {
      return new Date(now.getTime() + interval * 1000).toISOString();
    }
    return new Date(now.getTime() + 3600000).toISOString(); // Default 1 hour
  }

  private startScheduler(): void {
    // Start the task scheduler - simplified implementation
    setInterval(() => {
      this.checkScheduledTasks();
    }, 60000); // Check every minute
  }

  private checkScheduledTasks(): void {
    const now = new Date();
    
    for (const [taskId, schedule] of this.schedules) {
      if (schedule.enabled && new Date(schedule.nextRun) <= now) {
        this.executeTask(taskId);
        schedule.nextRun = this.calculateNextRun(schedule.cronExpression, schedule.interval);
      }
    }
  }

  private async loadTasks(): Promise<void> {
    // In real implementation, load from persistent storage
    this.log('Loading tasks from storage...', 'debug');
  }

  private async saveTasks(): Promise<void> {
    // In real implementation, save to persistent storage
    this.log('Saving tasks to storage...', 'debug');
  }

  private async loadSchedules(): Promise<void> {
    // In real implementation, load from persistent storage
    this.log('Loading schedules from storage...', 'debug');
  }

  private async saveSchedules(): Promise<void> {
    // In real implementation, save to persistent storage
    this.log('Saving schedules to storage...', 'debug');
  }
}
