import { saveBeforExecutionTable } from "../Pages/Befor.page";
import { saveDurringExecutionTable } from "../Pages/Durring.page";
import { saveCaseExecutionTable } from "../Pages/Case.page";
import { saveSiteExecutionTable } from "../Pages/Site.page";
import { saveAfterExecutionTable } from "../Pages/After.page";
import { saveCalculatExecutionTable } from "../Pages/Calculate.page";
import {saveSupportExecutionTable } from "../Pages/Support.page";

function Runnerimportstorage() {

  const runf = () => {
    
    saveBeforExecutionTable();
saveDurringExecutionTable ();
 saveCaseExecutionTable ();
saveSiteExecutionTable ();
saveAfterExecutionTable ();
 saveCalculatExecutionTable ();
saveSupportExecutionTable ();
  };
 return (
    <button onClick={runf}>
      اجرای همه
    </button>
  );
}

export default Runnerimportstorage();