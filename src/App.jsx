import { Routes, Route } from 'react-router-dom';
import Navbarcompont from "./components/ui/Navbar.compont.jsx";
import FooterCompont from "./components/ui/Footer.compont.jsx";

import Homepage from "./Pages/Home.page.jsx";
import Information from "./Pages/Information.jsx";
import Beforpage from "./Pages/Befor.page.jsx";
import Durringpage from "./Pages/Durring.page.jsx";
import Casepage from "./Pages/Case.page.jsx";
import Afterpage from "./Pages/After.page.jsx";
import Billpage from "./Pages/Bill.page.jsx";
import Calculatepage from "./Pages/Calculate.page.jsx";
import Sitepage from "./Pages/Site.page.jsx";
import Supportpage from "./Pages/Support.page.jsx";
import Invoicepage from "./Pages/Invoice.page.jsx";

import './index.css';
import './App.css';


function App() {
  return (
    <div >
      {/*navbar*/}
      <Navbarcompont />
      {/*wrapper*/}
      <div className="wrapper">
        <Routes>

          <Route path="/" element={<Homepage />} />
          <Route path="/Information" element={<Information />} />
          <Route path="/Durringpage" element={<Durringpage />} />
          <Route path="/Beforpage" element={<Beforpage />} />
          <Route path="/Casepage" element={<Casepage />} />
          <Route path="/Afterpage" element={<Afterpage />} />
          <Route path="/Sitepage" element={<Sitepage />} />
          <Route path="/Billpage" element={<Billpage />} />
          <Route path="/Calculatepage" element={<Calculatepage />} />
          <Route path="/Supportpage" element={<Supportpage />} />
          <Route path="/Invoicepage" element={<Invoicepage />} />


        </Routes>
      </div>
      {/*footer*/}
      <FooterCompont />
    </div>
  );
}

export default App;