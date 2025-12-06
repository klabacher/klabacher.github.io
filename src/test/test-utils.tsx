import { ReactElement, ReactNode } from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Create a test i18n instance with mock translations
const testI18n = i18n.createInstance();
testI18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  ns: ['translation'],
  defaultNS: 'translation',
  resources: {
    en: {
      translation: {
        welcome: 'Welcome',
        description: 'A modern React application',
        language: 'Language',
        counter: 'Counter',
        increment: 'Increment',
        decrement: 'Decrement',
        reset: 'Reset',
        features: 'Features',
        'features.redux': 'Redux Toolkit',
        'features.router': 'React Router',
        'features.tailwind': 'Tailwind CSS',
        'features.i18n': 'Internationalization',
      },
    },
  },
  interpolation: {
    escapeValue: false,
  },
});

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  route?: string;
  locale?: string;
}

interface WrapperProps {
  children: ReactNode;
  route?: string;
  locale?: string;
}

interface CustomRenderResult extends Omit<RenderResult, 'rerender'> {
  route: string;
  locale: string;
  rerender: (newUi: ReactElement) => void;
}

function AllProviders({ children, route = '/', locale = 'en' }: WrapperProps) {
  // Update locale if provided
  if (testI18n.language !== locale) {
    testI18n.changeLanguage(locale);
  }

  return (
    <I18nextProvider i18n={testI18n}>
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
      </Provider>
    </I18nextProvider>
  );
}

export function renderApp(ui: ReactElement, options: CustomRenderOptions = {}): CustomRenderResult {
  const { route = '/', locale = 'en', ...renderOptions } = options;

  const result = render(ui, {
    wrapper: ({ children }) => (
      <AllProviders route={route} locale={locale}>
        {children}
      </AllProviders>
    ),
    ...renderOptions,
  });

  return {
    ...result,
    route,
    locale,
    rerender: (newUi: ReactElement) =>
      result.rerender(
        <AllProviders route={route} locale={locale}>
          {newUi}
        </AllProviders>
      ),
  };
}

// Helper to change language during tests
export async function changeTestLanguage(lang: string): Promise<void> {
  await testI18n.changeLanguage(lang);
}

// Export test i18n instance for advanced usage
export { testI18n };
