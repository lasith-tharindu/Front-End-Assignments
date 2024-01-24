import { Fragment } from "react";
import "./App.css";
import SideBars from "../components/Sidebar/index";
import Routers from "./Routes/index";
function App() {
  return (
    <Fragment>
      <div className="row d-flex me-0">
        <div
          className="col-md-2 p-0"
          style={{ display: "flex", height: "100vh" }}
        >
          <SideBars />
        </div>
        <div className="col-md-10 p-0">
          <div className="main-container mx-0">
            <main>
              <Routers />
            </main>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default App;
