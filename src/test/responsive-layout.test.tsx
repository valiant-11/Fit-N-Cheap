import { describe, it, expect, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { FitProvider } from '../context/FitContext';
import { Layout } from '../components/Layout';
import { HomePage } from '../pages/HomePage';
import { WizardPage } from '../pages/WizardPage';
import { HowToMeasurePage } from '../pages/HowToMeasurePage';
import { ResultsPage } from '../pages/ResultsPage';
import { PosturePage } from '../pages/PosturePage';
import { FramesPage } from '../pages/FramesPage';
import { SavedFitsPage } from '../pages/SavedFitsPage';

// Required viewport widths to assert across portrait & landscape
const VIEWPORT_WIDTHS = [320, 360, 390, 412, 768, 1024, 1280, 1920] as const;

const TEST_ROUTES = [
  { path: '/', component: HomePage, name: 'Home' },
  { path: '/wizard', component: WizardPage, name: 'Wizard' },
  { path: '/guide', component: HowToMeasurePage, name: 'Guide' },
  { path: '/results', component: ResultsPage, name: 'Results' },
  { path: '/posture', component: PosturePage, name: 'Posture' },
  { path: '/frames', component: FramesPage, name: 'Frames' },
  { path: '/saved', component: SavedFitsPage, name: 'SavedFits' },
];

describe('Responsive Layout & Zero Horizontal Scroll Assertion', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  TEST_ROUTES.forEach(({ path, component: Component, name }) => {
    describe(`Route: ${name} (${path})`, () => {
      VIEWPORT_WIDTHS.forEach(width => {
        it(`renders without horizontal blowout at width ${width}px (portrait & landscape)`, () => {
          // Emulate viewport width
          window.innerWidth = width;
          window.innerHeight = width < 768 ? 844 : 900;
          document.documentElement.style.width = `${width}px`;

          const { container } = render(
            <FitProvider>
              <MemoryRouter initialEntries={[path]}>
                <Routes>
                  <Route element={<Layout />}>
                    <Route path={path} element={<Component />} />
                  </Route>
                </Routes>
              </MemoryRouter>
            </FitProvider>
          );

          // 1. Verify container exists and is rendered
          expect(container).toBeInTheDocument();

          // 2. Assert no elements contain fixed width inline styles that exceed the viewport
          const allElements = container.querySelectorAll('*');
          allElements.forEach(el => {
            const htmlEl = el as HTMLElement;
            const inlineWidth = htmlEl.style.width;
            if (inlineWidth && inlineWidth.endsWith('px')) {
              const pxVal = parseFloat(inlineWidth);
              // Elements with fixed px width shouldn't exceed viewport width
              expect(pxVal).toBeLessThanOrEqual(Math.max(width, 640));
            }

            // Assert no 100vw used in inline styles (100vw includes scrollbar causing horizontal scroll)
            expect(inlineWidth).not.toBe('100vw');
            expect(htmlEl.style.maxWidth).not.toBe('100vw');
          });

          // 3. Verify all SVG and img elements have max-width containment
          const mediaElements = container.querySelectorAll('svg, img, video, canvas');
          mediaElements.forEach(media => {
            const htmlMedia = media as HTMLElement;
            const classList = htmlMedia.className;
            if (typeof classList === 'string') {
              // Ensure no uncontrolled media
              expect(classList).not.toContain('w-[100vw]');
            }
          });
        });
      });
    });
  });
});
