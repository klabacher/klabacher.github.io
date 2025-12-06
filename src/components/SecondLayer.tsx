// Nested components
import AboutMe from './SecondPage/AboutMe';
import Projects from './SecondPage/Projects';
import TechStack from './SecondPage/TechStack';

export default function SecondLayer() {
  return (
    <div className="flex flex-row gap-10">
      <AboutMe />
      <TechStack />
      <Projects />
    </div>
  );
}
