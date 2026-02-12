import { Routes, Route } from 'react-router-dom';
import { Nav } from './components/Nav';
import { Landing } from './pages/Landing';
import { Upload } from './pages/Upload';
import { Analysis } from './pages/Analysis';
import { Preview } from './pages/Preview';
import { Guide } from './pages/Guide';

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
      </Routes>
    </>
  );
}
