import './styles/App.css';
import { PipelineToolbar } from './components/Toolbar';
import { PipelineUI } from './components/PipelineUI';

function App() {
  return (
    <div className="app-container">
      <PipelineToolbar />
      <PipelineUI />
    </div>
  );
}

export default App;
