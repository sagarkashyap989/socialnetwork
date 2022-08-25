import React, {fragment} from 'react';
import Landing from "./components/layout/Landing";
import Navbar from "./components/layout/Navbar";
function App() {
  return (
    <fragment>
     <Navbar />
     <Landing />
    </fragment>
  );
}

export default App;
