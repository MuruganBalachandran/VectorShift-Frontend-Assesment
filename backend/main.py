from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
import json
from collections import defaultdict, deque

app = FastAPI()

# Enable CORS for frontend communication - MUST be added before routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/')
def read_root():
    return {'Ping': 'Pong'}

def is_dag(nodes, edges):
    """
    Check if the graph formed by nodes and edges is a Directed Acyclic Graph (DAG).
    Uses topological sort with Kahn's algorithm to detect cycles.
    """
    if not edges:
        return True
    
    # Build adjacency list
    graph = defaultdict(list)
    in_degree = defaultdict(int)
    all_node_ids = set(node['id'] for node in nodes)
    
    for edge in edges:
        source = edge.get('source')
        target = edge.get('target')
        if source and target:
            graph[source].append(target)
            in_degree[target] += 1
    
    # Initialize in_degree for all nodes
    for node_id in all_node_ids:
        if node_id not in in_degree:
            in_degree[node_id] = 0
    
    # Kahn's algorithm for topological sort
    queue = deque([node_id for node_id in all_node_ids if in_degree[node_id] == 0])
    sorted_nodes = []
    
    while queue:
        node = queue.popleft()
        sorted_nodes.append(node)
        
        for neighbor in graph[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    
    # If we sorted all nodes, it's a DAG. Otherwise, there's a cycle.
    return len(sorted_nodes) == len(all_node_ids)

@app.post('/pipelines/parse')
async def parse_pipeline(payload: dict):
    """
    Parse a pipeline and return:
    - num_nodes: Number of nodes in the pipeline
    - num_edges: Number of edges (connections) in the pipeline
    - is_dag: Whether the pipeline forms a Directed Acyclic Graph
    """
    try:
        # Extract nodes and edges from payload
        nodes = payload.get('nodes', [])
        edges = payload.get('edges', [])
        
        # Count nodes and edges
        num_nodes = len(nodes)
        num_edges = len(edges)
        
        # Check if the graph is a DAG
        dag = is_dag(nodes, edges)
        
        return {
            'num_nodes': num_nodes,
            'num_edges': num_edges,
            'is_dag': dag,
            'status': 'success'
        }
    except Exception as e:
        return {
            'num_nodes': 0,
            'num_edges': 0,
            'is_dag': False,
            'status': 'error',
            'message': str(e)
        }


