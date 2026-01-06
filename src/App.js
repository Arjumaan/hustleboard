import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import GlobalSearch from './components/GlobalSearch';
import Dashboard from './components/Dashboard';
import MyTasks from './pages/MyTasks';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Projects from './pages/Projects';
import Docs from './pages/Docs';
import Team from './pages/Team';
import LoginPage from './pages/LoginPage';
import { TaskProvider } from './context/TaskContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DocsProvider } from './context/DocsContext';
import { WorkspaceProvider } from './context/WorkspaceContext';
import { WikiProvider } from './context/WikiContext';
import { ActivityProvider } from './context/ActivityContext';
import { AutomationProvider } from './context/AutomationContext';
import { FormProvider } from './context/FormContext';
import { TeamProvider } from './context/TeamContext';
import { FocusProvider } from './context/FocusContext';
import Wiki from './pages/Wiki';
import SignupPage from './pages/SignupPage';
import TimelineView from './pages/TimelineView';
import Activity from './pages/Activity';
import Automation from './pages/Automation';
import Forms from './pages/Forms';
import PublicForm from './pages/PublicForm';
import PublicWiki from './pages/PublicWiki';

const ProtectedLayout = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="flex bg-hustle-dark min-h-screen text-slate-300 font-sans selection:bg-hustle-accent selection:text-hustle-dark">
      <Sidebar />
      <GlobalSearch />
      {children}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <WorkspaceProvider>
        <ActivityProvider>
          <AutomationProvider>
            <FormProvider>
              <TeamProvider>
                <FocusProvider>
                  <TaskProvider>
                    <DocsProvider>
                      <WikiProvider>
                        <Router>
                          <Routes>
                            <Route path="/f/:publicId" element={<PublicForm />} />
                            <Route path="/kb/:publicId" element={<PublicWiki />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/signup" element={<SignupPage />} />

                            <Route path="/" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
                            <Route path="/projects" element={<ProtectedLayout><Projects /></ProtectedLayout>} />
                            <Route path="/my-tasks" element={<ProtectedLayout><MyTasks /></ProtectedLayout>} />
                            <Route path="/docs" element={<ProtectedLayout><Docs /></ProtectedLayout>} />
                            <Route path="/wiki" element={<ProtectedLayout><Wiki /></ProtectedLayout>} />
                            <Route path="/team" element={<ProtectedLayout><Team /></ProtectedLayout>} />
                            <Route path="/analytics" element={<ProtectedLayout><Analytics /></ProtectedLayout>} />
                            <Route path="/activity" element={<ProtectedLayout><Activity /></ProtectedLayout>} />
                            <Route path="/automation" element={<ProtectedLayout><Automation /></ProtectedLayout>} />
                            <Route path="/forms" element={<ProtectedLayout><Forms /></ProtectedLayout>} />
                            <Route path="/timeline" element={<ProtectedLayout><TimelineView /></ProtectedLayout>} />
                            <Route path="/settings" element={<ProtectedLayout><Settings /></ProtectedLayout>} />
                          </Routes>
                        </Router>
                      </WikiProvider>
                    </DocsProvider>
                  </TaskProvider>
                </FocusProvider>
              </TeamProvider>
            </FormProvider>
          </AutomationProvider>
        </ActivityProvider>
      </WorkspaceProvider>
    </AuthProvider>
  );
}

export default App;
