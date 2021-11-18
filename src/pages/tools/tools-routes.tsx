import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ToolsHome from './tools-home';
import GeneBrowser from './components/gene-browser';
import EnrichmentTool from './components/enrichment-tool';
import MapMan from './components/mapman-tool';

const ToolsRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<ToolsHome />} />
      <Route path="/gene-browser" element={<GeneBrowser />} />
      <Route path="/enrichment" element={<EnrichmentTool />} />
      <Route path="/mapman" element={<MapMan />} />
    </Routes>
  );
};

export default ToolsRoutes;
