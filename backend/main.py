# region imports
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from collections import defaultdict, deque
from typing import List, Dict, Any
# endregion

# region app initialization
app = FastAPI(
    title="VectorShift Pipeline API",
    description="API for parsing and validating pipeline graphs",
    version="1.0.0"
)
# endregion

# region CORS configuration
# Enable CORS for frontend communication - MUST be added before routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# endregion

# region health check endpoint
@app.get('/')
def read_root() -> Dict[str, str]:
    """
    Health check endpoint to verify the API is running.
    
    Returns:
        dict: Simple ping-pong response
    """
    return {'Ping': 'Pong'}
# endregion

# region helper functions
def is_dag(nodes: List[Dict[str, Any]], edges: List[Dict[str, Any]]) -> bool:
    """
    Check if the graph formed by nodes and edges is a Directed Acyclic Graph (DAG).
    Uses Kahn's algorithm (topological sort) to detect cycles.
    
    Args:
        nodes: List of node dictionaries with 'id' field
        edges: List of edge dictionaries with 'source' and 'target' fields
    
    Returns:
        bool: True if the graph is a DAG (no cycles), False otherwise
    
    Algorithm:
        1. Build adjacency list and calculate in-degrees for all nodes
        2. Start with nodes having in-degree 0 (no incoming edges)
        3. Process nodes in topological order, reducing in-degrees
        4. If all nodes are processed, it's a DAG; otherwise, there's a cycle
    """
    # Empty graph or graph with no edges is always a DAG
    if not nodes:
        return True
    
    if not edges:
        return True
    
    # Build adjacency list and in-degree map
    graph = defaultdict(list)
    in_degree = defaultdict(int)
    all_node_ids = {node['id'] for node in nodes}
    
    # Populate graph structure from edges
    for edge in edges:
        source = edge.get('source')
        target = edge.get('target')
        
        # Only add valid edges (both source and target exist)
        if source and target:
            graph[source].append(target)
            in_degree[target] += 1
    
    # Initialize in_degree for all nodes (including isolated nodes)
    for node_id in all_node_ids:
        if node_id not in in_degree:
            in_degree[node_id] = 0
    
    # Kahn's algorithm: Start with nodes that have no incoming edges
    queue = deque([node_id for node_id in all_node_ids if in_degree[node_id] == 0])
    sorted_nodes = []
    
    # Process nodes in topological order
    while queue:
        # Remove a node with no incoming edges
        current_node = queue.popleft()
        sorted_nodes.append(current_node)
        
        # Reduce in-degree for all neighbors
        for neighbor in graph[current_node]:
            in_degree[neighbor] -= 1
            # If neighbor now has no incoming edges, add to queue
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    
    # If we processed all nodes, there are no cycles (it's a DAG)
    # If some nodes remain unprocessed, there must be a cycle
    return len(sorted_nodes) == len(all_node_ids)
# endregion

# region pipeline endpoints
@app.post('/pipelines/parse')
async def parse_pipeline(payload: Dict[str, Any]) -> Dict[str, Any]:
    """
    Parse a pipeline graph and return analysis results.
    
    This endpoint analyzes a pipeline to determine:
    - Number of nodes in the graph
    - Number of edges (connections) in the graph  
    - Whether the graph forms a Directed Acyclic Graph (DAG)
    
    Args:
        payload: Dictionary containing:
            - nodes: List of node objects with 'id' field
            - edges: List of edge objects with 'source' and 'target' fields
    
    Returns:
        dict: Analysis results containing:
            - num_nodes: Count of nodes in the pipeline
            - num_edges: Count of edges in the pipeline
            - is_dag: Boolean indicating if the graph is a DAG (no cycles)
            - status: 'success' or 'error'
            - message: Error message (only present if status is 'error')
    
    Example Request:
        {
            "nodes": [{"id": "node1"}, {"id": "node2"}],
            "edges": [{"source": "node1", "target": "node2"}]
        }
    
    Example Response:
        {
            "num_nodes": 2,
            "num_edges": 1,
            "is_dag": true,
            "status": "success"
        }
    """
    try:
        # Extract nodes and edges from payload
        nodes = payload.get('nodes', [])
        edges = payload.get('edges', [])
        
        # Validate input
        if not isinstance(nodes, list) or not isinstance(edges, list):
            raise ValueError("nodes and edges must be lists")
        
        # Calculate pipeline statistics
        num_nodes = len(nodes)
        num_edges = len(edges)
        
        # Check if the graph is a DAG (no cycles)
        dag = is_dag(nodes, edges)
        
        # Return analysis results
        return {
            'num_nodes': num_nodes,
            'num_edges': num_edges,
            'is_dag': dag,
            'status': 'success'
        }
        
    except ValueError as ve:
        # Handle validation errors
        return {
            'num_nodes': 0,
            'num_edges': 0,
            'is_dag': False,
            'status': 'error',
            'message': f'Validation error: {str(ve)}'
        }
        
    except Exception as e:
        # Handle unexpected errors
        return {
            'num_nodes': 0,
            'num_edges': 0,
            'is_dag': False,
            'status': 'error',
            'message': f'Unexpected error: {str(e)}'
        }
# endregion
