import React from 'react';
import { render, screen } from '@testing-library/react';
import Auth from './Auth';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

// Пример базового теста для формы авторизации

describe('Auth', () => {
  it('рендерит форму входа', () => {
    render(
      <MemoryRouter>
        <Auth onLogin={() => {}} />
      </MemoryRouter>
    );
    expect(screen.getByText('Вход')).toBeInTheDocument();
    expect(screen.getByLabelText('Почта:')).toBeInTheDocument();
    expect(screen.getByLabelText('Пароль:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /войти/i })).toBeInTheDocument();
  });
}); 