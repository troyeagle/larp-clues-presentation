import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import { getTasks } from './utils/storage';
import { fetchBuiltInClues } from './utils/clueService';

jest.mock('./utils/storage', () => ({
  getTasks: jest.fn(),
}));

jest.mock('./utils/clueService', () => ({
  fetchBuiltInClues: jest.fn(),
}));

beforeEach(() => {
  getTasks.mockResolvedValue([]);
  fetchBuiltInClues.mockResolvedValue([{
    id: 'builtin_a1', name: '线索板 A1', source: 'builtin',
    aboveImage: '/clue/clues/a1/a1u.png',
    belowImage: '/clue/clues/a1/a1d.png', row: 3, column: 6,
  }]);
});

test('loads a built-in clue board and opens its presentation', async () => {
  render(<App />);
  expect(await screen.findByRole('heading', { name: '线索板 A1' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: '展示' }));
  expect(await screen.findByRole('button', { name: /返回列表/ })).toBeInTheDocument();
  expect(screen.getByAltText('above')).toHaveAttribute('src', '/clue/clues/a1/a1u.png');
});

test('opens the custom clue board form from the list', async () => {
  render(<App />);
  await screen.findByRole('heading', { name: '线索板 A1' });
  fireEvent.click(screen.getByRole('button', { name: /新建线索板/ }));
  expect(screen.getByRole('heading', { name: '新建线索板' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '保存并进入展示' })).toBeDisabled();
});
