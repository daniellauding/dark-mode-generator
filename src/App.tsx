import { Routes, Route } from 'react-router-dom';
import { Nav } from './components/Nav';
import { Landing } from './pages/Landing';
import { Upload } from './pages/Upload';
import { Analysis } from './pages/Analysis';
import { Preview } from './pages/Preview';
import { Guide } from './pages/Guide';
import { Library } from './pages/Library';
import { Projects } from './pages/Projects';
import { ProjectDetail } from './pages/ProjectDetail';
import { PublicPalette } from './pages/PublicPalette';
import Settings from './pages/Settings';

export default function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/preview" element={<Preview />} />
        <Route path="/guide" element={<Guide />} />
        <Route path="/library" element={<Library />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:projectId" element={<ProjectDetail />} />
        <Route path="/palette/:shareId" element={<PublicPalette />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </>
  );
}
