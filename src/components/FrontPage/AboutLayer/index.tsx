// Nested components
import AboutMe from './AboutMe';
import Projects from './Projects';
import TechStack from './TechStack';

export default function SecondLayer() {
  return (
    <div className="flex flex-row gap-10">
      <AboutMe />
      <TechStack />
      <Projects />
    </div>
  );
}
