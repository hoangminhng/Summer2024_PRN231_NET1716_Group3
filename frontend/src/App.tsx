import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import MemberLayout from "./Page/Member";
import Home from "./Page/Home";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<MemberLayout />}>
            <Route index element={<Home />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
