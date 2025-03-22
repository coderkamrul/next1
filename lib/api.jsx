// API service to interact with the backend

// Projects API
export async function getProjects() {
  const response = await fetch("/api/project")
  if (!response.ok) {
    throw new Error("Failed to fetch projects")
  }
  return response.json()
}

export async function getProject(id) {
  const controller = new AbortController()
  const signal = controller.signal

  const timeout = setTimeout(() => {
    controller.abort()
  }, 10000)

  try {
    const response = await fetch(`/api/project/${id}`, { signal })
    clearTimeout(timeout)
    if (!response.ok) {
      throw new Error("Failed to fetch project")
    }
    return response.json()
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Timed out while fetching project")
    }
    throw error
  }
}

export async function createProject(project) {
  const response = await fetch("/api/project", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(project),
  })
  if (!response.ok) {
    throw new Error("Failed to create project")
  }
  return response.json()
}

export async function updateProject(id, updates) {
  const response = await fetch(`/api/project/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  })
  if (!response.ok) {
    throw new Error("Failed to update project")
  }
  return response.json()
}

export async function deleteProject(id) {
  const response = await fetch(`/api/project/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) {
    throw new Error("Failed to delete project")
  }
  return response.json()
}

// Clients API
export async function getClients() {
  const response = await fetch("/api/clients")
  if (!response.ok) {
    throw new Error("Failed to fetch clients")
  }
  return response.json()
}

export async function createClient(client) {
  const response = await fetch("/api/clients", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(client),
  })
  if (!response.ok) {
    throw new Error("Failed to create client")
  }
  return response.json()
}

export async function deleteClient(id) {
  const response = await fetch(`/api/clients/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) {
    throw new Error("Failed to delete client")
  }
  return response.json()
}

export async function updateClient(clientId, updates) {
  const response = await fetch(`/api/clients/${clientId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  })
  if (!response.ok) {
    throw new Error("Failed to update client")
  }
  return response.json()
}

// Kanban API
export async function getKanbanBoard(projectId) {
  const response = await fetch(`/api/project/${projectId}/kanban`)
  if (!response.ok) {
    throw new Error("Failed to fetch kanban board")
  }
  return response.json()
}

export async function updateKanbanBoard(projectId, board) {
  const response = await fetch(`/api/project/${projectId}/kanban`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(board),
  })
  if (!response.ok) {
    throw new Error("Failed to update kanban board")
  }
  return response.json()
}

export async function createTask(projectId, column, task) {
  const response = await fetch(`/api/project/${projectId}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...task,
      status: column,
    }),
  })
  if (!response.ok) {
    throw new Error("Failed to create task")
  }
  return response.json()
}

export async function updateTask(projectId, taskId, updates) {
  const response = await fetch(`/api/project/${projectId}/tasks/${taskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  })
  if (!response.ok) {
    throw new Error("Failed to update task")
  }
  return response.json()
}

export async function deleteTask(projectId, taskId) {
  const response = await fetch(`/api/project/${projectId}/tasks/${taskId}`, {
    method: "DELETE",
  })
  if (!response.ok) {
    throw new Error("Failed to delete task")
  }
  return response.json()
}

// Dashboard stats
export async function getDashboardStats() {
  const response = await fetch("/api/stats")
  if (!response.ok) {
    throw new Error("Failed to fetch dashboard stats")
  }
  return response.json()
}


