import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { AppLayout } from './components/layout/AppLayout';

// Physio pages
import { Overview } from './pages/physio/Overview';
import { Patients } from './pages/physio/Patients';
import { AddPatient } from './pages/physio/AddPatient';
import { PatientProfile } from './pages/physio/PatientProfile';
import { Protocols } from './pages/physio/Protocols';
import { Sessions } from './pages/physio/Sessions';
import { SessionDetail } from './pages/physio/SessionDetail';
import { ProgressReports } from './pages/physio/ProgressReports';
import { PhysioSettings } from './pages/physio/Settings';

// Patient pages
import { Exercises } from './pages/patient/Exercises';
import { PatientSessions } from './pages/patient/PatientSessions';
import { PatientProgress } from './pages/patient/PatientProgress';
import { PatientProfilePage } from './pages/patient/PatientProfile';
import { LiveSession } from './pages/patient/LiveSession';
import { SessionSummary } from './pages/patient/SessionSummary';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing */}
        <Route path="/" element={<Home />} />

        {/* Physiotherapist routes */}
        <Route path="/physio" element={<AppLayout role="physio" userName="Dr. Sarah Chen" />}>
          <Route index element={<Navigate to="/physio/overview" replace />} />
          <Route path="overview" element={<Overview />} />
          <Route path="patients" element={<Patients />} />
          <Route path="patients/add" element={<AddPatient />} />
          <Route path="patients/:id" element={<PatientProfile />} />
          <Route path="protocols" element={<Protocols />} />
          <Route path="sessions" element={<Sessions />} />
          <Route path="sessions/:id" element={<SessionDetail />} />
          <Route path="progress" element={<ProgressReports />} />
          <Route path="settings" element={<PhysioSettings />} />
        </Route>

        {/* Patient routes */}
        <Route path="/patient" element={<AppLayout role="patient" userName="Alex Morgan" />}>
          <Route index element={<Navigate to="/patient/exercises" replace />} />
          <Route path="exercises" element={<Exercises />} />
          <Route path="sessions" element={<PatientSessions />} />
          <Route path="progress" element={<PatientProgress />} />
          <Route path="profile" element={<PatientProfilePage />} />
        </Route>

        {/* Live session (full-screen, no sidebar) */}
        <Route path="/patient/live-session" element={<LiveSession />} />
        <Route path="/patient/session-summary" element={<SessionSummary />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
