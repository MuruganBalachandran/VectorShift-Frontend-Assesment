// region imports
// styles
import './styles/App.css';
// components
import { PipelineToolbar } from './components/Toolbar';
import { PipelineUI } from './components/PipelineUI';
// endregion

function App() {
  // region UI
  return (
    <div className="app-container">
      <PipelineToolbar />
      <PipelineUI />
    </div>
  );
  // endregion
}

// region exports
export default App;
// endregion
