/**
 * @jest-environment jsdom
 */

import { ButtonConfiguration } from '@libs/domain';
import '@testing-library/jest-dom';
import { act } from 'react';
import ReactDOMClient from 'react-dom/client';
import { LibButton } from './button';

describe('Button', () => {
  async function getButton(config: ButtonConfiguration) {
    const container = document.createElement('div');
    document.body.appendChild(container);

    await act(async () =>
      ReactDOMClient.createRoot(container).render(
        <LibButton
          id={config.id}
          isDisabled={config.isDisabled}
          isLoading={config.isLoading}
          label={config.label}
          icon={config.icon}
          type={config.type}
        />
      )
    );

    return container.querySelector('#test-button');
  }
  function expectToMatchSnapshot(button: Element | null) {
    expect(button).toBeTruthy();
    expect(button).toMatchSnapshot();
  }

  describe('primary button', () => {
    it('can render primary button with only label', async () => {
      const button = await getButton({ type: 'primary', id: 'test', label: 'test' });
      expectToMatchSnapshot(button);
    });
    it('can render primary button with only icon', async () => {
      const button = await getButton({
        type: 'primary',
        id: 'test',
        icon: 'fa-solid fa-floppy-disk',
      });
      expectToMatchSnapshot(button);
    });
    it('can render primary button with label and icon', async () => {
      const button = await getButton({
        type: 'primary',
        id: 'test',
        icon: 'fa-solid fa-floppy-disk',
        label: 'test',
      });
      expectToMatchSnapshot(button);
    });
  });

  describe('secondary button', () => {
    it('can render secondary button with only label', async () => {
      const button = await getButton({ type: 'secondary', id: 'test', label: 'test' });
      expectToMatchSnapshot(button);
    });
    it('can render secondary button with only icon', async () => {
      const button = await getButton({
        type: 'secondary',
        id: 'test',
        icon: 'fa-solid fa-floppy-disk',
      });
      expectToMatchSnapshot(button);
    });
    it('can render secondary button with label and icon', async () => {
      const button = await getButton({
        type: 'secondary',
        id: 'test',
        icon: 'fa-solid fa-floppy-disk',
        label: 'test',
      });
      expectToMatchSnapshot(button);
    });
  });

  describe('tertiary button', () => {
    it('can render tertiary button with only label', async () => {
      const button = await getButton({ type: 'tertiary', id: 'test', label: 'test' });
      expectToMatchSnapshot(button);
    });
    it('can render tertiary button with only icon', async () => {
      const button = await getButton({
        type: 'tertiary',
        id: 'test',
        icon: 'fa-solid fa-floppy-disk',
      });
      expectToMatchSnapshot(button);
    });
    it('can render tertiary button with label and icon', async () => {
      const button = await getButton({
        type: 'tertiary',
        id: 'test',
        icon: 'fa-solid fa-floppy-disk',
        label: 'test',
      });
      expectToMatchSnapshot(button);
    });
  });

  describe('loading icon', () => {
    it('show the loading icon instead of the icon', async() => {
      const button = await getButton({
        type: 'primary',
        id: 'test',
        isLoading: true,
        icon: 'fa-solid fa-floppy-disk',
        label: 'test',
      });
      const loadingIcon = button?.querySelector('[data-testid="test-button-loading-icon"]');
      const icon = button?.querySelector('[data-testid="test-button-icon"]');

      expect(loadingIcon).toBeTruthy();
      expect(icon).toBeFalsy();
    });
  });

  describe('is disabled', () => {
    it('be disabled when set', async() => {
      const button = await getButton({
        type: 'primary',
        id: 'test',
        isDisabled: true,
        icon: 'fa-solid fa-floppy-disk',
        label: 'test',
      });
      
      expect(button).toBeDisabled();
    });
    it('be enabled when set', async() => {
      const button = await getButton({
        type: 'primary',
        id: 'test',
        isDisabled: false,
        icon: 'fa-solid fa-floppy-disk',
        label: 'test',
      });
      
      expect(button).toBeEnabled();
    });
  });
});
