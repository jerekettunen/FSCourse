import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import Todo from './Todo';

describe('Todo Component', () => {
  const mockTodo = {
    text: 'Test Todo',
    done: false,
  };

  const mockOnClickDelete = vi.fn();
  const mockOnClickToggle = vi.fn();

  beforeEach(() => {
    // Render the Todo component before each test
    render(
      <Todo
        todo={mockTodo}
        onClickDelete={mockOnClickDelete}
        onClickToggle={mockOnClickToggle}
      />
    );
  });

  it('renders the todo text', () => {
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
  });

  it('renders the "not done" state correctly', () => {
    expect(screen.getByText('This todo is not done')).toBeInTheDocument();
    expect(screen.getByText('Set as done')).toBeInTheDocument();
  });

  it('calls onClickDelete when the delete button is clicked', () => {
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    expect(mockOnClickDelete).toHaveBeenCalledWith(mockTodo);
  });

  it('calls onClickToggle when the toggle button is clicked', () => {
    const toggleButton = screen.getByText('Set as done');
    fireEvent.click(toggleButton);

    expect(mockOnClickToggle).toHaveBeenCalledWith(mockTodo);
  });

  it('renders the "done" state correctly', () => {
    // Render the component with a "done" todo
    cleanup();
    const doneTodo = { ...mockTodo, done: true };
    render(
      <Todo
        todo={doneTodo}
        onClickDelete={mockOnClickDelete}
        onClickToggle={mockOnClickToggle}
      />
    );

    expect(screen.getByText('This todo is done')).toBeInTheDocument();
    expect(screen.queryByText('Set as done')).not.toBeInTheDocument();
  });
});