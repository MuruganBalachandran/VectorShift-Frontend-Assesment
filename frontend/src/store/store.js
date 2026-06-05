// store.js

import { create } from "zustand";
import {
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
    MarkerType,
  } from 'reactflow';

export const useStore = create((set, get) => ({
    nodes: [],
    edges: [],
    history: [{ nodes: [], edges: [] }], // Initialize with empty state
    historyStep: 0, // Start at position 0
    nodeIDs: {},
    
    getNodeID: (type) => {
        const newIDs = {...get().nodeIDs};
        if (newIDs[type] === undefined) {
            newIDs[type] = 0;
        }
        newIDs[type] += 1;
        set({nodeIDs: newIDs});
        return `${type}-${newIDs[type]}`;
    },
    
    addNode: (node) => {
        const newNodes = [...get().nodes, node];
        const newHistory = get().history.slice(0, get().historyStep + 1);
        newHistory.push({ nodes: newNodes, edges: get().edges });
        set({
            nodes: newNodes,
            history: newHistory,
            historyStep: newHistory.length - 1,
        });
    },
    
    onNodesChange: (changes) => {
      // Filter out changes that shouldn't create history entries
      const shouldCreateHistory = changes.some(change => 
        change.type === 'remove' || 
        change.type === 'add' ||
        change.type === 'reset'
      );
      
      const newNodes = applyNodeChanges(changes, get().nodes);
      
      // Only create history for meaningful changes, not position/select/dimensions
      if (shouldCreateHistory) {
        const newHistory = get().history.slice(0, get().historyStep + 1);
        newHistory.push({ nodes: newNodes, edges: get().edges });
        set({
          nodes: newNodes,
          history: newHistory,
          historyStep: newHistory.length - 1,
        });
      } else {
        // Just update nodes without creating history
        set({ nodes: newNodes });
      }
    },
    
    // Called when node drag ends - creates history entry for position change
    onNodeDragStop: () => {
      const newHistory = get().history.slice(0, get().historyStep + 1);
      newHistory.push({ nodes: get().nodes, edges: get().edges });
      set({
        history: newHistory,
        historyStep: newHistory.length - 1,
      });
    },
    
    onEdgesChange: (changes) => {
      // Filter out changes that shouldn't create history entries
      const shouldCreateHistory = changes.some(change => 
        change.type === 'remove' || 
        change.type === 'add' ||
        change.type === 'reset'
      );
      
      const newEdges = applyEdgeChanges(changes, get().edges);
      
      // Only create history for meaningful changes, not select changes
      if (shouldCreateHistory) {
        const newHistory = get().history.slice(0, get().historyStep + 1);
        newHistory.push({ nodes: get().nodes, edges: newEdges });
        set({
          edges: newEdges,
          history: newHistory,
          historyStep: newHistory.length - 1,
        });
      } else {
        // Just update edges without creating history
        set({ edges: newEdges });
      }
    },
    
    onConnect: (connection) => {
      const newEdges = addEdge({
        ...connection, 
        type: 'smoothstep', 
        animated: true, 
        markerEnd: {type: MarkerType.Arrow, height: '20px', width: '20px'},
        style: { stroke: '#000', strokeWidth: 2 }
      }, get().edges);
      const newHistory = get().history.slice(0, get().historyStep + 1);
      newHistory.push({ nodes: get().nodes, edges: newEdges });
      set({
        edges: newEdges,
        history: newHistory,
        historyStep: newHistory.length - 1,
      });
    },
    
    updateNodeField: (nodeId, fieldName, fieldValue) => {
      const newNodes = get().nodes.map((node) => {
        if (node.id === nodeId) {
          node.data = { ...node.data, [fieldName]: fieldValue };
        }
        return node;
      });
      const newHistory = get().history.slice(0, get().historyStep + 1);
      newHistory.push({ nodes: newNodes, edges: get().edges });
      set({
        nodes: newNodes,
        history: newHistory,
        historyStep: newHistory.length - 1,
      });
    },
    
    deleteNode: (nodeId) => {
      const newNodes = get().nodes.filter((node) => node.id !== nodeId);
      const newEdges = get().edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId);
      const newHistory = get().history.slice(0, get().historyStep + 1);
      newHistory.push({ nodes: newNodes, edges: newEdges });
      set({
        nodes: newNodes,
        edges: newEdges,
        history: newHistory,
        historyStep: newHistory.length - 1,
      });
    },
    
    deleteEdge: (edgeId) => {
      const newEdges = get().edges.filter((edge) => edge.id !== edgeId);
      const newHistory = get().history.slice(0, get().historyStep + 1);
      newHistory.push({ nodes: get().nodes, edges: newEdges });
      set({
        edges: newEdges,
        history: newHistory,
        historyStep: newHistory.length - 1,
      });
    },
    
    clearAll: () => {
      const newHistory = get().history.slice(0, get().historyStep + 1);
      newHistory.push({ nodes: [], edges: [] });
      set({
        nodes: [],
        edges: [],
        history: newHistory,
        historyStep: newHistory.length - 1,
      });
    },
    
    undo: () => {
      if (get().historyStep > 0) {
        const prevStep = get().historyStep - 1;
        const state = get().history[prevStep];
        set({
          nodes: state.nodes,
          edges: state.edges,
          historyStep: prevStep,
        });
      }
    },
    
    redo: () => {
      if (get().historyStep < get().history.length - 1) {
        const nextStep = get().historyStep + 1;
        const state = get().history[nextStep];
        set({
          nodes: state.nodes,
          edges: state.edges,
          historyStep: nextStep,
        });
      }
    },
  }));
