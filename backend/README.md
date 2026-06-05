# VectorShift Pipeline API - Backend

A FastAPI-based REST API for parsing and validating pipeline graphs, including Directed Acyclic Graph (DAG) detection using topological sorting.

## Description

The VectorShift Pipeline API provides endpoints for analyzing pipeline structures created in the frontend. The primary functionality is to validate whether a given pipeline forms a valid Directed Acyclic Graph (DAG) - a critical requirement for data processing pipelines to ensure they can be executed in a deterministic order without circular dependencies.

## Features

- **Pipeline Parsing**: Analyze pipeline structure (nodes and edges)
- **DAG Detection**: Verify if the pipeline contains cycles using Kahn's algorithm
- **Statistics**: Count nodes and edges in the pipeline
- **CORS Support**: Full cross-origin resource sharing configuration
- **Type Safety**: Complete type hints for better code quality
- **Error Handling**: Comprehensive error responses

## Technology Stack

### FastAPI Framework

**FastAPI** is a modern, high-performance web framework for building APIs with Python 3.7+. We chose FastAPI for:

1. **Performance**: Built on Starlette and Pydantic, it's one of the fastest Python frameworks available
2. **Type Hints**: Native support for Python type hints with automatic validation
3. **Auto Documentation**: Automatically generates interactive API documentation (Swagger UI at `/docs`)
4. **Async Support**: Built-in async/await support for better concurrency
5. **Modern Standards**: Based on OpenAPI and JSON Schema standards

**Key FastAPI Features Used:**
```python
app = FastAPI(
    title="VectorShift Pipeline API",
    description="API for parsing and validating pipeline graphs",
    version="1.0.0"
)
```

This configuration provides:
- Automatic API documentation
- Version tracking
- Clear API metadata for consumers

## CORS (Cross-Origin Resource Sharing)

### What is CORS?

CORS is a security mechanism implemented by web browsers to control how resources on one domain can be accessed by scripts running on another domain. Without CORS configuration, the frontend (running on `http://localhost:3000`) would be blocked from making requests to the backend (running on `http://localhost:8000`).

### Our CORS Implementation

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Configuration Breakdown:**

- **`allow_origins=["*"]`**: Allows requests from any origin
  - ✅ Good for development
  - ⚠️ In production, should be: `["http://localhost:3000", "https://yourdomain.com"]`

- **`allow_credentials=True`**: Allows cookies and authentication headers
  - Required if using sessions or authentication tokens

- **`allow_methods=["*"]`**: Allows all HTTP methods (GET, POST, PUT, DELETE, etc.)
  - Alternatively, specify only needed methods: `["GET", "POST"]`

- **`allow_headers=["*"]`**: Allows all headers in requests
  - Can be restricted to specific headers like `["Content-Type", "Authorization"]`

**Why CORS Middleware Must Come Before Routes:**
The middleware intercepts requests before they reach route handlers, adding appropriate CORS headers to responses. If added after routes, the browser would reject the response before the middleware can add the headers.

## DAG Detection Algorithm

### What is a DAG?

A **Directed Acyclic Graph (DAG)** is a graph with:
1. **Directed edges**: Connections have a specific direction (from source to target)
2. **No cycles**: You cannot follow edges and return to a starting node

**Why DAG Matters for Pipelines:**
- Ensures execution can proceed in a deterministic order
- Prevents infinite loops in data processing
- Allows parallel execution of independent branches
- Required for dependency resolution

### Kahn's Algorithm Implementation

We use **Kahn's Algorithm** for topological sorting to detect cycles. This algorithm is efficient (O(V + E) time complexity) and intuitive.

#### Algorithm Steps:

```python
def is_dag(nodes: List[Dict[str, Any]], edges: List[Dict[str, Any]]) -> bool:
```

**Step 1: Build Graph Structure**
```python
graph = defaultdict(list)  # adjacency list: node -> [neighbors]
in_degree = defaultdict(int)  # node -> count of incoming edges
all_node_ids = {node['id'] for node in nodes}
```

- **Adjacency List**: Maps each node to its outgoing neighbors
- **In-Degree**: Counts incoming edges for each node
- Used to track dependencies

**Step 2: Populate Graph from Edges**
```python
for edge in edges:
    source = edge.get('source')
    target = edge.get('target')
    if source and target:
        graph[source].append(target)
        in_degree[target] += 1
```

- Each edge creates a dependency: `source → target`
- Increment target's in-degree (it has one more incoming edge)

**Step 3: Initialize In-Degree for All Nodes**
```python
for node_id in all_node_ids:
    if node_id not in in_degree:
        in_degree[node_id] = 0
```

- Nodes with no incoming edges get in-degree of 0
- These are potential starting points

**Step 4: Start with Zero In-Degree Nodes**
```python
queue = deque([node_id for node_id in all_node_ids if in_degree[node_id] == 0])
sorted_nodes = []
```

- Queue holds nodes ready to process (no dependencies left)
- `sorted_nodes` will contain topologically sorted nodes

**Step 5: Process Nodes in Topological Order**
```python
while queue:
    current_node = queue.popleft()
    sorted_nodes.append(current_node)
    
    for neighbor in graph[current_node]:
        in_degree[neighbor] -= 1
        if in_degree[neighbor] == 0:
            queue.append(neighbor)
```

Process:
1. Take a node with no dependencies (in-degree = 0)
2. Add it to sorted list (it can be executed)
3. "Remove" this node by decreasing in-degree of all neighbors
4. If any neighbor now has in-degree 0, it's ready to process

**Step 6: Detect Cycles**
```python
return len(sorted_nodes) == len(all_node_ids)
```

- If all nodes were processed: **No cycles** → Valid DAG ✓
- If some nodes remain: **Cycle exists** → Invalid DAG ✗

### Example Scenarios

#### Valid DAG:
```
A → B → C
↓       ↓
D   →   E
```
Process order: A → D → B → C → E (no cycles)

#### Invalid (Contains Cycle):
```
A → B → C
↑       ↓
←   D   ←
```
Cycle detected: A → B → C → D → A

#### Isolated Nodes:
```
A → B    C    D → E
```
Still valid: All nodes can be processed, even if disconnected

## API Endpoints

### Health Check

```http
GET /
```

**Response:**
```json
{
  "Ping": "Pong"
}
```

Simple endpoint to verify the API is running.

---

### Parse Pipeline

```http
POST /pipelines/parse
```

Analyzes a pipeline graph and returns statistics and validation results.

**Request Body:**
```json
{
  "nodes": [
    { "id": "node1", "type": "input", "data": {} },
    { "id": "node2", "type": "llm", "data": {} },
    { "id": "node3", "type": "output", "data": {} }
  ],
  "edges": [
    { "source": "node1", "target": "node2" },
    { "source": "node2", "target": "node3" }
  ]
}
```

**Success Response:**
```json
{
  "num_nodes": 3,
  "num_edges": 2,
  "is_dag": true,
  "status": "success"
}
```

**Error Response:**
```json
{
  "num_nodes": 0,
  "num_edges": 0,
  "is_dag": false,
  "status": "error",
  "message": "Validation error: nodes and edges must be lists"
}
```

**Response Fields:**
- `num_nodes` (int): Total number of nodes in the pipeline
- `num_edges` (int): Total number of edges (connections)
- `is_dag` (bool): True if the graph is a valid DAG (no cycles)
- `status` (string): "success" or "error"
- `message` (string): Error description (only present if status is "error")

## Code Structure

```
backend/
├── main.py              # Main FastAPI application
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

### Code Organization (main.py)

The code is organized with region markers for easy navigation:

1. **imports**: All dependencies and type hints
2. **app initialization**: FastAPI app setup with metadata
3. **CORS configuration**: Cross-origin resource sharing setup
4. **health check endpoint**: Simple ping endpoint
5. **helper functions**: DAG detection algorithm
6. **pipeline endpoints**: Main API endpoints

## Installation & Setup

### Prerequisites
- Python 3.7+
- pip

### Install Dependencies

**Option 1: Using requirements.txt (Recommended)**
```bash
pip install -r requirements.txt
```

**Option 2: Manual installation**
```bash
pip install fastapi uvicorn
```

**Dependencies:**
- `fastapi`: Web framework
- `uvicorn`: ASGI server for running FastAPI

### Run the Server

```bash
uvicorn main:app --reload
```

**Options:**
- `--reload`: Auto-restart on code changes (development only)
- `--host 0.0.0.0`: Listen on all network interfaces
- `--port 8000`: Specify port (default: 8000)

### Access API Documentation

Once running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

These interactive documentation pages are automatically generated by FastAPI.

## Type Hints

The codebase uses Python type hints for better code quality:

```python
def is_dag(nodes: List[Dict[str, Any]], edges: List[Dict[str, Any]]) -> bool:
```

**Benefits:**
- Better IDE autocomplete and suggestions
- Catch type errors before runtime
- Self-documenting code
- Enables static type checking with tools like mypy

## Error Handling

The API implements comprehensive error handling:

1. **Validation Errors**: Catch invalid input types
2. **Value Errors**: Handle specific business logic errors
3. **General Exceptions**: Catch unexpected errors

All errors return a consistent response format with descriptive messages.

## Performance

- **Time Complexity**: O(V + E) where V = nodes, E = edges
- **Space Complexity**: O(V + E) for storing graph structure
- **Efficient**: Handles large pipelines (thousands of nodes) quickly

## Testing

You can test the API using:

1. **Interactive Docs**: http://localhost:8000/docs
2. **curl**:
```bash
curl -X POST http://localhost:8000/pipelines/parse \
  -H "Content-Type: application/json" \
  -d '{"nodes": [{"id": "1"}, {"id": "2"}], "edges": [{"source": "1", "target": "2"}]}'
```
3. **Frontend**: Use the VectorShift Pipeline Builder UI

## Production Considerations

For production deployment:

1. **CORS**: Restrict `allow_origins` to specific domains
2. **Security**: Add authentication and rate limiting
3. **Logging**: Implement structured logging
4. **Monitoring**: Add health checks and metrics
5. **Database**: Persist pipeline data if needed
6. **Validation**: Add Pydantic models for request/response validation
7. **Server**: Use production ASGI server (Gunicorn with Uvicorn workers)

## Troubleshooting

**Issue**: CORS errors in browser console
- **Solution**: Ensure backend is running before frontend
- **Check**: Verify CORS middleware is configured

**Issue**: Connection refused
- **Solution**: Verify backend is running on port 8000
- **Check**: `http://localhost:8000/` should return Ping/Pong

**Issue**: DAG detection incorrect
- **Solution**: Verify edges have correct `source` and `target` fields
- **Check**: Node IDs must match between nodes array and edge references
