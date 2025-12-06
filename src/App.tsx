import React, { useState, useEffect } from "react";
import Landing from "./components/screens/Landing";
import { CategorySelect } from "./components/screens/CategorySelect";
import Trends from "./components/screens/Trends";
import Templates from "./components/screens/Templates";
import Upload from "./components/screens/Upload";
import AIDraft from "./components/screens/AIDraft";
import Editor from "./components/screens/Editor";
import Export from "./components/screens/Export";
import AdminTrendUpload from "./components/screens/AdminTrendUpload";
import TrendLibrary from "./components/screens/TrendLibrary";
import { getAuthToken, getCurrentUser, clearAuth, fetchMe } from "./services/authService";
import Login from "./components/screens/Login";
import Signup from "./components/screens/Signup";

import {
  Video,
  Layers,
  Layout,
  Upload as UploadIcon,
  Sparkles,
  Edit as EditIcon,
  Download,
  TrendingUp,
} from "lucide-react";

type Screen =
  | "landing"
  | "category"
  | "templates"
  | "trends"
  | "upload"
  | "draft"
  | "editor"
  | "trend-library"
  | "admin-trends"
  | "export"
  | "login"
  | "signup";

// Minimal Trend type used to pass to Editor
type Trend = {
  id: string;
  title: string;
  description: string;
  editingTemplate: string;
  niche?: string;
  hookType?: string;
  soundType?: string;
  platform?: string;
};

type IconType = React.ComponentType<React.SVGProps<SVGSVGElement> & { className?: string }>;

const App: React.FC = () => {
  // --- Auth / global user state
  const [user, setUser] = useState<any | null>(getCurrentUser());
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setAuthLoading(false);
      return;
    }
    fetchMe(token)
      .then((u) => {
        setUser(u);
      })
      .catch((e) => {
        clearAuth();
        setUser(null);
      })
      .finally(() => setAuthLoading(false));
  }, []);

  const onSigned = (userObj: any) => {
    // Signup component already saved token/user in localStorage via saveAuth()
    setUser(userObj);
    // redirect to a friendly screen after signup
    setCurrentScreen("trend-library");
  };

  const onLogged = (userObj: any) => {
    // Login component already saved token/user in localStorage via saveAuth()
    setUser(userObj);
    setCurrentScreen("trend-library");
  };

  const logout = () => {
    clearAuth();
    setUser(null);
    setCurrentScreen("landing");
  };

  // --- App navigation & UI state
  const [currentScreen, setCurrentScreen] = useState<Screen>("landing");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Trend selection (for passing to editor)
  const [selectedTrendForEditor, setSelectedTrendForEditor] = useState<Trend | null>(null);
  const [selectedTrendForDraft, setSelectedTrendForDraft] = useState<Trend | null>(null);

  // Screens list (icons)
  const screens: { id: Screen; label: string; icon: IconType; adminOnly?: boolean }[] = [
    { id: "landing", label: "Landing", icon: Video },
    { id: "category", label: "Category", icon: Layers },
    { id: "templates", label: "Templates", icon: Layout },
    { id: "upload", label: "Upload", icon: UploadIcon },
    { id: "draft", label: "AI Draft", icon: Sparkles },
    { id: "editor", label: "Editor", icon: EditIcon },
    { id: "export", label: "Export", icon: Download },
    { id: "trends", label: "Trends AI", icon: TrendingUp },
    { id: "trend-library", label: "Trend Library", icon: Sparkles },
    { id: "admin-trends", label: "Admin Trends", icon: UploadIcon, adminOnly: true },
  ];

  // Render current screen
  const renderScreen = () => {
    switch (currentScreen) {
      case "landing":
        return <Landing />;
      case "category":
        return (
          <CategorySelect
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              setCurrentScreen("draft");
            }}
          />
        );
      case "templates":
        return <Templates />;
      case "upload":
        return <Upload />;
      case "draft":
        return <AIDraft initialCategory={selectedCategory} initialTrend={selectedTrendForDraft} />;
      case "editor":
        return <Editor initialTrend={selectedTrendForEditor} />;
      case "export":
        return <Export />;
      case "trends":
        return <Trends />;
      case "admin-trends":
        if (user?.role === "admin") return <AdminTrendUpload />;
        return (
          <div className="p-8">
            <h3 className="text-lg font-semibold">Admin</h3>
            <p className="text-sm text-gray-600">You are not authorized to view this page.</p>
          </div>
        );
      case "trend-library":
        return (
          <TrendLibrary
            onUseTemplate={(trend: Trend) => {
              setSelectedTrendForEditor(trend);
              setCurrentScreen("editor");
            }}
          />
        );
      case "login":
        return <Login onLogged={onLogged} />;
      case "signup":
        return <Signup onSigned={onSigned} />;
      default:
        return <Landing />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F8]">
      {/* Top Navigation Bar - Hidden on Editor screen */}
      {currentScreen !== "editor" && (
        <div className="bg-white/80 backdrop-blur-xl border-b border-[#E5E5E8] sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-8 py-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Video className="w-6 h-6 text-[#007AFF]" />
                <span className="text-xl font-semibold text-[#1B1B1E]">ReelForge AI</span>
              </div>

              <div className="flex items-center gap-4">
                {/* If user logged in show name + logout, otherwise show Login/Signup */}
                {!user ? (
                  <>
                    <button
                      onClick={() => setCurrentScreen("login")}
                      className="text-sm px-3 py-1 rounded-xl border border-[#E5E5E8]"
                    >
                      Sign in
                    </button>
                    <button
                      onClick={() => setCurrentScreen("signup")}
                      className="text-sm px-3 py-1 rounded-xl bg-[#007AFF] text-white"
                    >
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    <span className="text-sm text-[#63636A]">Hi, {user.name}</span>
                    <button
                      onClick={logout}
                      className="text-sm px-3 py-1 rounded-xl border border-[#E5E5E8]"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Screen Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {screens
                .filter((s) => {
                  if (s.adminOnly && user?.role !== "admin") return false;
                  return true;
                })
                .map((screen) => {
                  const Icon = screen.icon;
                  return (
                    <button
                      key={screen.id}
                      onClick={() => setCurrentScreen(screen.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
                        currentScreen === screen.id
                          ? "bg-[#007AFF] text-white shadow-md"
                          : "bg-[#F7F7F8] text-[#1B1B1E] hover:bg-[#E5E5E8]"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {screen.label}
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* Editor Screen Navigator (different position) */}
      {currentScreen === "editor" && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-white rounded-xl shadow-lg border border-[#E5E5E8] overflow-hidden">
            <div className="px-3 py-2 bg-gradient-to-r from-[#007AFF] to-[#339AFF] text-white text-xs font-semibold">
              Switch Screen
            </div>
            <select
              value={currentScreen}
              onChange={(e) => setCurrentScreen(e.target.value as Screen)}
              className="px-4 py-2.5 bg-white text-[#1B1B1E] border-0 focus:outline-none w-full"
            >
              {screens.map((screen) => (
                <option key={screen.id} value={screen.id}>
                  {screen.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Current Screen */}
      {renderScreen()}
    </div>
  );
};

export default App;
