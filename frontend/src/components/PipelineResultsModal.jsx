// region imports
import React from 'react';
// styles
import '../styles/PipelineResultsModal.css';
// enderegion

// region result modal
export const PipelineResultsModal = ({ isOpen, data, onClose, error }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">Pipeline Validation Results</h2>
          <button onClick={onClose} className="modal-close-button">
            ✕
          </button>
        </div>

        {error ? (
          // Error State
          <div className="modal-error">
            <div className="modal-error-title">⚠️ Error</div>
            <div className="modal-error-message">{error}</div>
          </div>
        ) : (
          <>
            {/* Stats Section */}
            <div className="modal-stats-grid">
              {/* Nodes Card */}
              <div className="modal-stat-card">
                <div className="modal-stat-label">
                  <span>👁️</span>
                  <span>Nodes</span>
                </div>
                <div className="modal-stat-value">{data.num_nodes}</div>
              </div>

              {/* Edges Card */}
              <div className="modal-stat-card">
                <div className="modal-stat-label">
                  <span>🔗</span>
                  <span>Edges</span>
                </div>
                <div className="modal-stat-value">{data.num_edges}</div>
              </div>
            </div>

            {/* Validation Cards */}
            <div className="modal-validation-grid">
              {/* DAG Structure */}
              <div className={`modal-validation-card ${data.is_dag ? 'valid' : 'invalid'}`}>
                <div className="modal-validation-header">
                  <span className="modal-validation-icon">
                    {data.is_dag ? '✓' : '✕'}
                  </span>
                  <span className={`modal-validation-title ${data.is_dag ? 'valid' : 'invalid'}`}>
                    DAG Structure
                  </span>
                </div>
                <div className={`modal-validation-status ${data.is_dag ? 'valid' : 'invalid'}`}>
                  {data.is_dag ? 'Valid' : 'Invalid'}
                </div>
              </div>
            </div>

            {/* Message Section */}
            <div className={`modal-message ${data.is_dag ? 'success' : 'warning'}`}>
              <div className={`modal-message-content ${data.is_dag ? 'success' : 'warning'}`}>
                <span className="modal-message-icon">
                  {data.is_dag ? 'ℹ️' : '⚠️'}
                </span>
                <div>
                  {data.is_dag ? (
                    <div>
                      <div className="modal-message-text-title">Pipeline is valid!</div>
                      <div className="modal-message-text-description">
                        Your pipeline forms a Directed Acyclic Graph (DAG) with no cycles.
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="modal-message-text-title">Pipeline is invalid!</div>
                      <div className="modal-message-text-description">
                        Your pipeline contains cycles or disconnected components.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Close Button */}
            <button onClick={onClose} className="modal-button-close">
              Close
            </button>
          </>
        )}
      </div>
    </div>
  );
};
// endregion