import "./styles.css";
import AutoComplete from "./AutoComplete";

export default function App() {
  return (
    <div className="App p-2">
      <h2></h2>
      <div className="container mt-3">
        <div className="card">
          <div className="card-header">AutoComplete</div>
          <div className="card-body"><AutoComplete /></div> 
          <br/><br/><br/>
          <div className="card-footer">SATI Company</div>
        </div>
      </div>

      
    </div>
  );
}
