import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import MonsterLibrary from './pages/MonsterLibrary';
import MonsterDetail from './pages/MonsterDetail';
import MonsterCreate from './pages/MonsterCreate';
import EncounterList from './pages/EncounterList';
import EncounterBuilder from './pages/EncounterBuilder';
import CombatActive from './pages/CombatActive';
import CombatTracker from './pages/CombatTracker';
import EncounterHistory from './pages/EncounterHistory';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MonsterLibrary />} />
          <Route path="monsters/new" element={<MonsterCreate />} />
          <Route path="monsters/:id" element={<MonsterDetail />} />
          <Route path="monsters/:id/edit" element={<MonsterCreate />} />
          <Route path="encounters" element={<EncounterList />} />
          <Route path="encounters/new" element={<EncounterBuilder />} />
          <Route path="encounters/:id" element={<EncounterBuilder />} />
          <Route path="combat" element={<CombatActive />} />
          <Route path="combat/:sessionId" element={<CombatTracker />} />
          <Route path="history" element={<EncounterHistory />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
