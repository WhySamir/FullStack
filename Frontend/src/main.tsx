import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { store } from "./Redux/store.ts";
import { Provider } from "react-redux";

import "./index.css";
import App from "./App.tsx";
import Stdio from "./Stdio.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/stdio/*" element={<Stdio />} />
        <Route path="/*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </Provider>
);
