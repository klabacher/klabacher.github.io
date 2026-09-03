import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderApp } from '../../test/test-utils';
import Projects from './Projects';

describe('Projects', () => {
  it('opens project details from a keyboard-accessible button', () => {
    renderApp(<Projects />);

    const projectButton = screen.getByRole('button', { name: /CountSparks/i });
    fireEvent.click(projectButton);

    expect(screen.getByRole('dialog', { name: /CountSparks/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Fechar detalhes do projeto' })).toBeInTheDocument();
  });
});
