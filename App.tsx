
import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';

// Pages
const Home = lazy(() => import('./pages/Home'));
const NewsList = lazy(() => import('./pages/NewsList'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const AdminNews = lazy(() => import('./pages/AdminNews'));
const NewsDetail = lazy(() => import('./pages/NewsDetail'));
const NotFound = lazy(() => import('./pages/NotFound'));

const LoadingFallback = () => (
  <div className="h-screen w-full flex items-center justify-center bg-slate-50">
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 border-4 border-[#004a99] border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-slate-500 font-medium">Carregando SãoLeo em Números...</p>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/noticias" element={<Layout><NewsList /></Layout>} />
          <Route path="/noticias/:newsId" element={<Layout><NewsDetail /></Layout>} />
          <Route path="/sobre" element={<Layout><About /></Layout>} />
          <Route path="/contato" element={<Layout><Contact /></Layout>} />
          <Route path="/admin" element={<AdminNews />} />
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
