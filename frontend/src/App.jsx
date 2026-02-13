import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './layout/Layout';
import HomePage from './pages/HomePage';
import TimelinePage from './pages/TimelinePage';
import ArchivePage from './pages/ArchivePage';
import GalleryPage from './pages/GalleryPage';
import PersonsPage from './pages/PersonsPage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="timeline" element={<TimelinePage />} />
        <Route path="archive" element={<ArchivePage />} />
        <Route path="gallery" element={<GalleryPage />} />
        <Route path="persons" element={<PersonsPage />} />
        <Route path="admin" element={<AdminPage />} />
      </Route>
    </Routes>
  );
}

export default App;
