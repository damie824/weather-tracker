import { ThemeProvider } from "./components/theme-provider";
import { ModeToggle } from "./components/ui/mode-toggler";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainPage from "./pages/main";
import TrackerPage from "./pages/tracker";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="atmosphere-tracker-theme">
      <div className="absolute right-10 top-10 flex justify-end gap-5 items-center z-50">
        <a className="opacity-65" href="/">
          홈
        </a>
        <a className="opacity-65" href="/tracker">
          날씨 트래커
        </a>
        <ModeToggle />
      </div>
      <BrowserRouter>
        <Routes>
          <Route path="/" Component={MainPage} />
          <Route path="/tracker" Component={TrackerPage} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
