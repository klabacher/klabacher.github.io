// Nested components
import AboutMe from './SecondPage/AboutMe';
import Projects from './SecondPage/Projects';
import TechStack from './SecondPage/TechStack';

export default function SecondLayer() {
  return (
    <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-start gap-8 md:grid-cols-2 xl:grid-cols-3 xl:gap-10">
      <AboutMe />
      <TechStack />
      <Projects />
    </div>
  );
}
