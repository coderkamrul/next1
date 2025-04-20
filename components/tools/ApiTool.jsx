"use client"

import { useState, useEffect } from "react"
import {
  Plus,
  RefreshCw,
  Trash,
  Bug,
  ChevronUp,
  FolderPlus,
  Folder,
  Layers,
  Play,
  Save,
  MoreVertical,
  FileText,
  FileJson,
  FileCode,
  ImageIcon,
  Braces,
  Copy,
  AlertCircle,
  ArrowRight,
  Check,
  TagIcon as Label,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function ApiTool() {
  return (
    <main className="min-h-screen bg-background">
      <PostmanLikeApiTester />
    </main>
  )
}

function PostmanLikeApiTester() {
  // Main state for the API tester
  const [state, setState] = useState({
    // Current request
    currentRequest: {
      id: "default",
      name: "New Request",
      method: "GET",
      url: "https://jsonplaceholder.typicode.com/posts/1",
      params: [],
      headers: [{ key: "Content-Type", value: "application/json", enabled: true }],
      body: {
        mode: "none", // none, raw, form-data, x-www-form-urlencoded
        raw: {
          type: "json", // json, text, xml, html
          content: "",
        },
        formData: [],
        urlencoded: [],
      },
      auth: {
        type: "none", // none, basic, bearer, oauth2
        basic: { username: "", password: "" },
        bearer: { token: "" },
        oauth2: { token: "" },
      },
    },

    // Collections and folders
    collections: [
      {
        id: "col_1",
        name: "My Collection",
        folders: [
          {
            id: "folder_1",
            name: "Authentication",
            requests: [
              {
                id: "req_1",
                name: "Login",
                method: "POST",
                url: "https://api.example.com/login",
                params: [],
                headers: [{ key: "Content-Type", value: "application/json", enabled: true }],
                body: {
                  mode: "raw",
                  raw: {
                    type: "json",
                    content: JSON.stringify({ username: "user", password: "pass" }, null, 2),
                  },
                  formData: [],
                  urlencoded: [],
                },
                auth: {
                  type: "none",
                  basic: { username: "", password: "" },
                  bearer: { token: "" },
                  oauth2: { token: "" },
                },
              },
              {
                id: "req_2",
                name: "Get User Profile",
                method: "GET",
                url: "https://api.example.com/profile",
                params: [],
                headers: [{ key: "Content-Type", value: "application/json", enabled: true }],
                body: {
                  mode: "none",
                  raw: { type: "json", content: "" },
                  formData: [],
                  urlencoded: [],
                },
                auth: {
                  type: "bearer",
                  basic: { username: "", password: "" },
                  bearer: { token: "your-token-here" },
                  oauth2: { token: "" },
                },
              },
            ],
          },
          {
            id: "folder_2",
            name: "Users",
            requests: [
              {
                id: "req_3",
                name: "Get All Users",
                method: "GET",
                url: "https://jsonplaceholder.typicode.com/users",
                params: [],
                headers: [{ key: "Content-Type", value: "application/json", enabled: true }],
                body: {
                  mode: "none",
                  raw: { type: "json", content: "" },
                  formData: [],
                  urlencoded: [],
                },
                auth: {
                  type: "none",
                  basic: { username: "", password: "" },
                  bearer: { token: "" },
                  oauth2: { token: "" },
                },
              },
              {
                id: "req_4",
                name: "Create User",
                method: "POST",
                url: "https://jsonplaceholder.typicode.com/users",
                params: [],
                headers: [{ key: "Content-Type", value: "application/json", enabled: true }],
                body: {
                  mode: "raw",
                  raw: {
                    type: "json",
                    content: JSON.stringify({ name: "John Doe", email: "john@example.com" }, null, 2),
                  },
                  formData: [],
                  urlencoded: [],
                },
                auth: {
                  type: "none",
                  basic: { username: "", password: "" },
                  bearer: { token: "" },
                  oauth2: { token: "" },
                },
              },
            ],
          },
        ],
        requests: [
          {
            id: "req_5",
            name: "Get Posts",
            method: "GET",
            url: "https://jsonplaceholder.typicode.com/posts",
            params: [],
            headers: [{ key: "Content-Type", value: "application/json", enabled: true }],
            body: {
              mode: "none",
              raw: { type: "json", content: "" },
              formData: [],
              urlencoded: [],
            },
            auth: { type: "none", basic: { username: "", password: "" }, bearer: { token: "" }, oauth2: { token: "" } },
          },
        ],
      },
    ],

    // Environment variables
    environments: [
      {
        id: "env_1",
        name: "Development",
        variables: [
          { key: "baseUrl", value: "https://dev-api.example.com", enabled: true },
          { key: "apiKey", value: "dev-api-key", enabled: true },
        ],
      },
      {
        id: "env_2",
        name: "Production",
        variables: [
          { key: "baseUrl", value: "https://api.example.com", enabled: true },
          { key: "apiKey", value: "prod-api-key", enabled: true },
        ],
      },
    ],
    activeEnvironment: "env_1",

    // Response data
    response: {
      status: null,
      statusText: "",
      time: null,
      size: null,
      headers: null,
      body: null,
      error: null,
    },

    // UI state
    ui: {
      loading: false,
      activeTab: "params", // params, headers, body, auth, tests
      showSidebar: true,
      sidebarWidth: 300,
      responseTab: "body", // body, headers, cookies, tests, logs
      bodyTab: "pretty", // pretty, raw, preview
      selectedCollection: "col_1",
      selectedRequest: null,
      showEnvironmentModal: false,
      showNewCollectionModal: false,
      showNewRequestModal: false,
      showNewFolderModal: false,
      jsonError: null,
      selectedFolder: null, // For creating requests in specific folders
      showErrorLogs: false,
      showDeleteRequestDialog: false,
      showDeleteFolderDialog: false,
      requestToDelete: null,
      folderToDelete: null,
      collectionForDelete: null,
    },

    // Request history
    history: [],

    // Error logs
    errorLogs: [],
  })

  // Add these modal components right after the PostmanLikeApiTester function declaration
  // Add after the state declaration and before the useEffect hooks

  // Modal components for collection management
  const NewCollectionModal = () => {
    const [name, setName] = useState("")

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-background rounded-lg shadow-lg w-full max-w-md p-6">
          <h3 className="text-lg font-medium mb-4">Create New Collection</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="collection-name">Collection Name</Label>
              <Input
                id="collection-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Collection"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => updateUI({ showNewCollectionModal: false })}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (name.trim()) {
                    createCollection(name)
                  }
                }}
                disabled={!name.trim()}
              >
                Create
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const NewFolderModal = () => {
    const [name, setName] = useState("")

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-background rounded-lg shadow-lg w-full max-w-md p-6">
          <h3 className="text-lg font-medium mb-4">Create New Folder</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="folder-name">Folder Name</Label>
              <Input id="folder-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="My Folder" />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => updateUI({ showNewFolderModal: false })}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (name.trim()) {
                    createFolder(state.ui.selectedCollection, name)
                  }
                }}
                disabled={!name.trim()}
              >
                Create
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const NewRequestModal = () => {
    const [name, setName] = useState("")
    const [method, setMethod] = useState("GET")
    const [url, setUrl] = useState("https://api.example.com")
    const [targetCollection, setTargetCollection] = useState(state.ui.selectedCollection || state.collections[0]?.id)
    const [targetFolder, setTargetFolder] = useState(state.ui.selectedFolder || "none")

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-background rounded-lg shadow-lg w-full max-w-md p-6">
          <h3 className="text-lg font-medium mb-4">Create New Request</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="request-name">Request Name</Label>
              <Input
                id="request-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Request"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="request-method">Method</Label>
              <Select value={method} onValueChange={setMethod}>
                <SelectTrigger id="request-method">
                  <SelectValue placeholder="Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                  <SelectItem value="PATCH">PATCH</SelectItem>
                  <SelectItem value="HEAD">HEAD</SelectItem>
                  <SelectItem value="OPTIONS">OPTIONS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="request-url">URL</Label>
              <Input
                id="request-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://api.example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="request-collection">Collection</Label>
              <Select value={targetCollection} onValueChange={setTargetCollection}>
                <SelectTrigger id="request-collection">
                  <SelectValue placeholder="Collection" />
                </SelectTrigger>
                <SelectContent>
                  {state.collections.map((collection) => (
                    <SelectItem key={collection.id} value={collection.id}>
                      {collection.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="request-folder">Folder (Optional)</Label>
              <Select value={targetFolder} onValueChange={setTargetFolder}>
                <SelectTrigger id="request-folder">
                  <SelectValue placeholder="Folder" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (Root level)</SelectItem>
                  {state.collections
                    .find((c) => c.id === targetCollection)
                    ?.folders.map((folder) => (
                      <SelectItem key={folder.id} value={folder.id}>
                        {folder.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => updateUI({ showNewRequestModal: false })}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (name.trim() && url.trim()) {
                    createRequest(name, method, url, targetCollection, targetFolder === "none" ? null : targetFolder)
                  }
                }}
                disabled={!name.trim() || !url.trim()}
              >
                Create
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const DeleteRequestDialog = () => {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-background rounded-lg shadow-lg w-full max-w-md p-6">
          <h3 className="text-lg font-medium mb-4">Delete Request</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Are you sure you want to delete this request? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => updateUI({ showDeleteRequestDialog: false, requestToDelete: null })}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                deleteRequest(state.ui.requestToDelete, state.ui.collectionForDelete, state.ui.folderToDelete || null)
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const DeleteFolderDialog = () => {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-background rounded-lg shadow-lg w-full max-w-md p-6">
          <h3 className="text-lg font-medium mb-4">Delete Folder</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Are you sure you want to delete this folder and all its requests? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => updateUI({ showDeleteFolderDialog: false, folderToDelete: null })}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                deleteFolder(state.ui.folderToDelete, state.ui.collectionForDelete)
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Add these useEffect hooks for loading and saving data to localStorage
  useEffect(() => {
    // Load collections from localStorage on initial mount
    const savedCollections = localStorage.getItem("apiTester_collections")
    if (savedCollections) {
      try {
        const parsedCollections = JSON.parse(savedCollections)
        updateState({ collections: parsedCollections })
      } catch (error) {
        console.error("Failed to parse saved collections:", error)
      }
    }

    // Set the initial URL to the requested API
    updateCurrentRequest({
      url: "https://jsonplaceholder.typicode.com/posts",
      name: "Get Post",
    })
  }, [])

  // Save collections to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("apiTester_collections", JSON.stringify(state.collections))
  }, [state.collections])

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem("apiTester_history", JSON.stringify(state.history))
  }, [state.history])

  // Load history from localStorage on initial mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("apiTester_history")
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory)
        updateState({ history: parsedHistory })
      } catch (error) {
        console.error("Failed to parse saved history:", error)
      }
    }
  }, [])

  // Initialize with the specific API URL
  useEffect(() => {
    // Set the initial URL to the requested API
    updateCurrentRequest({
      url: "https://jsonplaceholder.typicode.com/posts",
      name: "Get Post",
    })
  }, [])

  // Function to use a server-side proxy for the request
  const useServerProxy = async () => {
    updateUI({ loading: true })
    updateState({
      response: {
        status: null,
        statusText: "",
        time: null,
        size: null,
        headers: null,
        body: null,
        error: null,
      },
    })

    try {
      const startTime = performance.now()

      // Try multiple proxy services for better reliability
      // First try with cors-anywhere hosted proxy
      const proxyUrl = `https://cors-anywhere.herokuapp.com/${state.currentRequest.url}`

      // Fallback proxies if the first one fails
      const fallbackProxies = [
        `https://api.allorigins.win/get?url=${encodeURIComponent(state.currentRequest.url)}`,
        `https://corsproxy.io/?${encodeURIComponent(state.currentRequest.url)}`,
        `https://proxy.cors.sh/${state.currentRequest.url}`,
      ]

      let response
      let data
      let proxyUsed = proxyUrl
      let isJsonResponse = true

      try {
        // Try the primary proxy first
        response = await fetch(proxyUrl, {
          headers: {
            "X-Requested-With": "XMLHttpRequest", // Required by cors-anywhere
          },
        })

        // If response is not ok, throw to try fallbacks
        if (!response.ok) throw new Error("Primary proxy failed")

        // Get the response as text first
        const responseText = await response.text()

        // Try to parse as JSON
        try {
          data = JSON.parse(responseText)
        } catch (e) {
          // If not JSON, use the text directly
          data = responseText
          isJsonResponse = false
        }
      } catch (error) {
        console.log("Primary proxy failed, trying fallbacks...")

        // Try each fallback proxy
        for (let i = 0; i < fallbackProxies.length; i++) {
          try {
            const fallbackUrl = fallbackProxies[i]
            proxyUsed = fallbackUrl

            response = await fetch(fallbackUrl)

            if (!response.ok) throw new Error(`Fallback proxy ${i + 1} failed`)

            // Handle different proxy response formats
            if (fallbackUrl.includes("allorigins")) {
              const jsonResponse = await response.json()
              data = jsonResponse.contents
              try {
                data = JSON.parse(data)
              } catch (e) {
                isJsonResponse = false
              }
            } else {
              const responseText = await response.text()
              try {
                data = JSON.parse(responseText)
              } catch (e) {
                data = responseText
                isJsonResponse = false
              }
            }

            // If we got data, break the loop
            if (data) break
          } catch (e) {
            console.log(`Fallback proxy ${i + 1} failed:`, e)
            // Continue to next fallback
          }
        }

        // If all fallbacks failed, throw error
        if (!data) {
          throw new Error("All proxy attempts failed")
        }
      }

      const endTime = performance.now()

      // Update state with response
      updateState({
        response: {
          status: 200,
          statusText: "OK (via proxy)",
          time: Math.round(endTime - startTime),
          size: new Blob([typeof data === "string" ? data : JSON.stringify(data)]).size,
          headers: { "content-type": isJsonResponse ? "application/json" : "text/plain" },
          body: data,
          error: null,
        },
        history: [
          {
            id: `hist_${Date.now()}`,
            request: { ...state.currentRequest },
            response: {
              status: 200,
              statusText: "OK (via proxy)",
              time: Math.round(endTime - startTime),
              size: new Blob([typeof data === "string" ? data : JSON.stringify(data)]).size,
            },
            timestamp: new Date().toISOString(),
          },
          ...state.history.slice(0, 19),
        ],
      })

      toast({
        title: "Proxy Request Successful",
        description: `Retrieved data using proxy: ${proxyUsed.substring(0, 30)}...`,
      })
    } catch (error) {
      const errorLog = {
        id: `error_${Date.now()}`,
        timestamp: new Date().toISOString(),
        request: state.currentRequest.url,
        method: state.currentRequest.method,
        error: error.message,
        type: "Proxy Error",
      }

      updateState({
        response: {
          status: null,
          statusText: "",
          time: null,
          size: null,
          headers: null,
          body: null,
          error: `Proxy request failed: ${error.message}. Try opening the URL directly in a new tab to check if the API is accessible.`,
        },
        errorLogs: [errorLog, ...state.errorLogs],
      })

      toast({
        title: "Proxy Request Failed",
        description: "All proxy attempts failed. The API might be down or blocking proxy access.",
        variant: "destructive",
      })
    } finally {
      updateUI({ loading: false })
    }
  }

  // Update state helper function
  const updateState = (newValues) => {
    setState((prevState) => ({
      ...prevState,
      ...newValues,
    }))
  }

  // Update current request
  const updateCurrentRequest = (updates) => {
    updateState({
      currentRequest: {
        ...state.currentRequest,
        ...updates,
      },
    })
  }

  // Update UI state
  const updateUI = (updates) => {
    updateState({
      ui: {
        ...state.ui,
        ...updates,
      },
    })
  }

  // Load a request from collections
  const loadRequest = (requestId) => {
    // Find the request in collections
    let foundRequest = null

    // Search in all collections
    for (const collection of state.collections) {
      // Check requests directly in the collection
      const collectionRequest = collection.requests.find((req) => req.id === requestId)
      if (collectionRequest) {
        foundRequest = { ...collectionRequest }
        break
      }

      // Check requests in folders
      for (const folder of collection.folders) {
        const folderRequest = folder.requests.find((req) => req.id === requestId)
        if (folderRequest) {
          foundRequest = { ...folderRequest }
          break
        }
      }

      if (foundRequest) break
    }

    if (foundRequest) {
      updateState({
        currentRequest: foundRequest,
        ui: {
          ...state.ui,
          selectedRequest: requestId,
        },
      })

      toast({
        title: "Request loaded",
        description: `Loaded request: ${foundRequest.name}`,
      })
    }
  }

  // Save current request to collection
  const saveRequest = (collectionId, folderId = null) => {
    const { currentRequest } = state
    const newRequest = { ...currentRequest }

    // Generate a new ID if it's a new request
    if (newRequest.id === "default") {
      newRequest.id = `req_${Date.now()}`
    }

    // Update collections
    const updatedCollections = state.collections.map((collection) => {
      if (collection.id === collectionId) {
        if (folderId) {
          // Save to a folder
          return {
            ...collection,
            folders: collection.folders.map((folder) => {
              if (folder.id === folderId) {
                // Check if request already exists in this folder
                const existingIndex = folder.requests.findIndex((req) => req.id === newRequest.id)
                if (existingIndex >= 0) {
                  // Update existing request
                  const updatedRequests = [...folder.requests]
                  updatedRequests[existingIndex] = newRequest
                  return { ...folder, requests: updatedRequests }
                } else {
                  // Add new request
                  return { ...folder, requests: [...folder.requests, newRequest] }
                }
              }
              return folder
            }),
          }
        } else {
          // Save directly to collection
          const existingIndex = collection.requests.findIndex((req) => req.id === newRequest.id)
          if (existingIndex >= 0) {
            // Update existing request
            const updatedRequests = [...collection.requests]
            updatedRequests[existingIndex] = newRequest
            return { ...collection, requests: updatedRequests }
          } else {
            // Add new request
            return { ...collection, requests: [...collection.requests, newRequest] }
          }
        }
      }
      return collection
    })

    updateState({
      collections: updatedCollections,
      currentRequest: newRequest,
      ui: {
        ...state.ui,
        selectedRequest: newRequest.id,
      },
    })

    toast({
      title: "Request saved",
      description: `Saved to ${folderId ? "folder" : "collection"}: ${newRequest.name}`,
    })
  }

  // Create a new collection
  const createCollection = (name) => {
    const newCollection = {
      id: `col_${Date.now()}`,
      name,
      folders: [],
      requests: [],
    }

    updateState({
      collections: [...state.collections, newCollection],
      ui: {
        ...state.ui,
        selectedCollection: newCollection.id,
        showNewCollectionModal: false,
      },
    })

    toast({
      title: "Collection created",
      description: `Created collection: ${name}`,
    })
  }

  // Create a new folder in a collection
  const createFolder = (collectionId, name) => {
    const newFolder = {
      id: `folder_${Date.now()}`,
      name,
      requests: [],
    }

    const updatedCollections = state.collections.map((collection) => {
      if (collection.id === collectionId) {
        return {
          ...collection,
          folders: [...collection.folders, newFolder],
        }
      }
      return collection
    })

    updateState({
      collections: updatedCollections,
      ui: {
        ...state.ui,
        showNewFolderModal: false,
      },
    })

    toast({
      title: "Folder created",
      description: `Created folder: ${name}`,
    })
  }

  // Create a new request
  const createRequest = (name, method, url, targetCollectionId, targetFolderId = null) => {
    // Ensure we have valid values
    const validName = name || "New Request"
    const validUrl = url || "https://api.example.com"

    const newRequest = {
      id: `req_${Date.now()}`,
      name: validName,
      method,
      url: validUrl,
      params: [],
      headers: [{ key: "Content-Type", value: "application/json", enabled: true }],
      body: {
        mode: "none",
        raw: { type: "json", content: "" },
        formData: [],
        urlencoded: [],
      },
      auth: { type: "none", basic: { username: "", password: "" }, bearer: { token: "" }, oauth2: { token: "" } },
    }

    // Update collections with the new request
    const updatedCollections = state.collections.map((collection) => {
      if (collection.id === targetCollectionId) {
        if (targetFolderId && targetFolderId !== "none") {
          // Add to a specific folder
          return {
            ...collection,
            folders: collection.folders.map((folder) => {
              if (folder.id === targetFolderId) {
                return {
                  ...folder,
                  requests: [...folder.requests, newRequest],
                }
              }
              return folder
            }),
          }
        } else {
          // Add directly to collection
          return {
            ...collection,
            requests: [...collection.requests, newRequest],
          }
        }
      }
      return collection
    })

    updateState({
      collections: updatedCollections,
      currentRequest: newRequest,
      ui: {
        ...state.ui,
        selectedRequest: newRequest.id,
        showNewRequestModal: false,
      },
    })

    toast({
      title: "New request created",
      description: `Created request: ${validName}`,
    })
  }

  // Add a parameter to the current request
  const addParam = () => {
    const newParam = { key: "", value: "", enabled: true }
    updateCurrentRequest({
      params: [...state.currentRequest.params, newParam],
    })
  }

  // Update a parameter in the current request
  const updateParam = (index, field, value) => {
    const updatedParams = [...state.currentRequest.params]
    updatedParams[index] = { ...updatedParams[index], [field]: value }
    updateCurrentRequest({ params: updatedParams })
  }

  // Remove a parameter from the current request
  const removeParam = (index) => {
    const updatedParams = [...state.currentRequest.params]
    updatedParams.splice(index, 1)
    updateCurrentRequest({ params: updatedParams })
  }

  // Add a header to the current request
  const addHeader = () => {
    const newHeader = { key: "", value: "", enabled: true }
    updateCurrentRequest({
      headers: [...state.currentRequest.headers, newHeader],
    })
  }

  // Update a header in the current request
  const updateHeader = (index, field, value) => {
    const updatedHeaders = [...state.currentRequest.headers]
    updatedHeaders[index] = { ...updatedHeaders[index], [field]: value }
    updateCurrentRequest({ headers: updatedHeaders })
  }

  // Remove a header from the current request
  const removeHeader = (index) => {
    const updatedHeaders = [...state.currentRequest.headers]
    updatedHeaders.splice(index, 1)
    updateCurrentRequest({ headers: updatedHeaders })
  }

  // Add a form data field to the current request
  const addFormData = () => {
    const newFormData = { key: "", value: "", type: "text", enabled: true }
    const updatedBody = {
      ...state.currentRequest.body,
      formData: [...state.currentRequest.body.formData, newFormData],
    }
    updateCurrentRequest({ body: updatedBody })
  }

  // Update a form data field in the current request
  const updateFormData = (index, field, value) => {
    const updatedFormData = [...state.currentRequest.body.formData]
    updatedFormData[index] = { ...updatedFormData[index], [field]: value }
    const updatedBody = {
      ...state.currentRequest.body,
      formData: updatedFormData,
    }
    updateCurrentRequest({ body: updatedBody })
  }

  // Remove a form data field from the current request
  const removeFormData = (index) => {
    const updatedFormData = [...state.currentRequest.body.formData]
    updatedFormData.splice(index, 1)
    const updatedBody = {
      ...state.currentRequest.body,
      formData: updatedFormData,
    }
    updateCurrentRequest({ body: updatedBody })
  }

  // Add a URL encoded field to the current request
  const addUrlEncoded = () => {
    const newUrlEncoded = { key: "", value: "", enabled: true }
    const updatedBody = {
      ...state.currentRequest.body,
      urlencoded: [...state.currentRequest.body.urlencoded, newUrlEncoded],
    }
    updateCurrentRequest({ body: updatedBody })
  }

  // Update a URL encoded field in the current request
  const updateUrlEncoded = (index, field, value) => {
    const updatedUrlEncoded = [...state.currentRequest.body.urlencoded]
    updatedUrlEncoded[index] = { ...updatedUrlEncoded[index], [field]: value }
    const updatedBody = {
      ...state.currentRequest.body,
      urlencoded: updatedUrlEncoded,
    }
    updateCurrentRequest({ body: updatedBody })
  }

  // Remove a URL encoded field from the current request
  const removeUrlEncoded = (index) => {
    const updatedUrlEncoded = [...state.currentRequest.body.urlencoded]
    updatedUrlEncoded.splice(index, 1)
    const updatedBody = {
      ...state.currentRequest.body,
      urlencoded: updatedUrlEncoded,
    }
    updateCurrentRequest({ body: updatedBody })
  }

  // Update the raw body content
  const updateRawBody = (content) => {
    const updatedBody = {
      ...state.currentRequest.body,
      raw: {
        ...state.currentRequest.body.raw,
        content,
      },
    }
    updateCurrentRequest({ body: updatedBody })

    // Validate JSON if the body type is JSON
    if (state.currentRequest.body.raw.type === "json") {
      validateJSON(content)
    }
  }

  // Change the raw body type
  const changeRawBodyType = (type) => {
    const updatedBody = {
      ...state.currentRequest.body,
      raw: {
        ...state.currentRequest.body.raw,
        type,
      },
    }
    updateCurrentRequest({ body: updatedBody })
  }

  // Change the body mode
  const changeBodyMode = (mode) => {
    const updatedBody = {
      ...state.currentRequest.body,
      mode,
    }
    updateCurrentRequest({ body: updatedBody })
  }

  // Update authentication type
  const updateAuthType = (type) => {
    const updatedAuth = {
      ...state.currentRequest.auth,
      type,
    }
    updateCurrentRequest({ auth: updatedAuth })
  }

  // Update basic auth credentials
  const updateBasicAuth = (field, value) => {
    const updatedAuth = {
      ...state.currentRequest.auth,
      basic: {
        ...state.currentRequest.auth.basic,
        [field]: value,
      },
    }
    updateCurrentRequest({ auth: updatedAuth })
  }

  // Update bearer token
  const updateBearerToken = (token) => {
    const updatedAuth = {
      ...state.currentRequest.auth,
      bearer: {
        ...state.currentRequest.auth.bearer,
        token,
      },
    }
    updateCurrentRequest({ auth: updatedAuth })
  }

  // Update OAuth2 token
  const updateOAuth2Token = (token) => {
    const updatedAuth = {
      ...state.currentRequest.auth,
      oauth2: {
        ...state.currentRequest.auth.oauth2,
        token,
      },
    }
    updateCurrentRequest({ auth: updatedAuth })
  }

  // Validate JSON
  const validateJSON = (jsonString) => {
    let errorMessage = null
    try {
      if (!jsonString.trim()) {
        updateUI({ jsonError: null })
        return { valid: true, error: null }
      }
      JSON.parse(jsonString)
      updateUI({ jsonError: null })
      return { valid: true, error: errorMessage }
    } catch (error) {
      errorMessage = error.message
      updateUI({ jsonError: errorMessage })
      return { valid: false, error: errorMessage }
    }
  }

  // Format JSON in the editor
  const formatJSON = () => {
    const { content } = state.currentRequest.body.raw
    if (!content.trim()) return

    try {
      const parsedJSON = JSON.parse(content)
      const formattedJSON = JSON.stringify(parsedJSON, null, 2)

      const updatedBody = {
        ...state.currentRequest.body,
        raw: {
          ...state.currentRequest.body.raw,
          content: formattedJSON,
        },
      }

      updateCurrentRequest({ body: updatedBody })
      updateUI({ jsonError: null })

      toast({
        title: "JSON formatted",
        description: "Your JSON has been formatted successfully",
      })
    } catch (error) {
      updateUI({ jsonError: error.message })

      toast({
        title: "Invalid JSON",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  // Generate URL with query parameters
  const getFullUrl = () => {
    try {
      const { url, params } = state.currentRequest
      const urlObj = new URL(url)

      // Clear existing query parameters
      urlObj.search = ""

      // Add query parameters
      params.forEach((param) => {
        if (param.key && param.value && param.enabled) {
          urlObj.searchParams.append(param.key, param.value)
        }
      })

      return urlObj.toString()
    } catch (error) {
      // If URL is invalid, just return it as is
      return state.currentRequest.url
    }
  }

  // Send API request
  const sendRequest = async () => {
    const { currentRequest } = state

    // Validate JSON if body type is JSON and mode is raw
    if (
      currentRequest.body.mode === "raw" &&
      currentRequest.body.raw.type === "json" &&
      currentRequest.body.raw.content.trim()
    ) {
      const { valid, error } = validateJSON(currentRequest.body.raw.content)
      if (!valid) {
        const errorLog = {
          id: `error_${Date.now()}`,
          timestamp: new Date().toISOString(),
          request: currentRequest.url,
          method: currentRequest.method,
          error: error,
          type: "JSON Validation Error",
        }

        updateState({
          errorLogs: [errorLog, ...state.errorLogs],
        })

        toast({
          title: "Invalid JSON",
          description: error,
          variant: "destructive",
        })
        return
      }
    }

    updateUI({ loading: true })
    updateState({
      response: {
        status: null,
        statusText: "",
        time: null,
        size: null,
        headers: null,
        body: null,
        error: null,
      },
    })

    try {
      const startTime = performance.now()

      // Prepare headers
      const headerObj = {}
      currentRequest.headers.forEach((header) => {
        if (header.key && header.value && header.enabled) {
          headerObj[header.key] = header.value
        }
      })

      // Add authentication headers
      if (currentRequest.auth.type === "basic" && currentRequest.auth.basic.username) {
        const credentials = btoa(`${currentRequest.auth.basic.username}:${currentRequest.auth.basic.password}`)
        headerObj["Authorization"] = `Basic ${credentials}`
      } else if (currentRequest.auth.type === "bearer" && currentRequest.auth.bearer.token) {
        headerObj["Authorization"] = `Bearer ${currentRequest.auth.bearer.token}`
      } else if (currentRequest.auth.type === "oauth2" && currentRequest.auth.oauth2.token) {
        headerObj["Authorization"] = `Bearer ${currentRequest.auth.oauth2.token}`
      }

      // Prepare request options
      const options = {
        method: currentRequest.method,
        headers: headerObj,
        mode: "cors", // Add explicit CORS mode
        credentials: "omit", // Don't send cookies by default
      }

      // Add body for non-GET requests
      if (currentRequest.method !== "GET" && currentRequest.method !== "HEAD") {
        if (currentRequest.body.mode === "raw") {
          options.body = currentRequest.body.raw.content
        } else if (currentRequest.body.mode === "form-data") {
          const formData = new FormData()
          currentRequest.body.formData.forEach((item) => {
            if (item.key && item.enabled) {
              formData.append(item.key, item.value)
            }
          })
          options.body = formData
          // Remove content-type header to let the browser set it with boundary
          delete headerObj["Content-Type"]
        } else if (currentRequest.body.mode === "x-www-form-urlencoded") {
          const formData = new URLSearchParams()
          currentRequest.body.urlencoded.forEach((item) => {
            if (item.key && item.enabled) {
              formData.append(item.key, item.value)
            }
          })
          options.body = formData
        }
      }

      // Send request with query parameters
      const fullUrl = getFullUrl()

      // Create a controller to allow timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout
      options.signal = controller.signal

      const response = await fetch(fullUrl, options)
      clearTimeout(timeoutId)

      const endTime = performance.now()

      // Get response size and text
      const responseText = await response.text()
      const size = new Blob([responseText]).size

      // Parse response based on content type
      let responseBody
      const contentType = response.headers.get("content-type") || ""

      try {
        if (contentType.includes("application/json")) {
          responseBody = JSON.parse(responseText)
        } else if (contentType.includes("text/html")) {
          responseBody = responseText
        } else if (contentType.includes("text/xml") || contentType.includes("application/xml")) {
          responseBody = responseText
        } else {
          responseBody = responseText
        }
      } catch (error) {
        responseBody = responseText
      }

      // Convert headers to object
      const responseHeaders = {}
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value
      })

      // Update state with response
      updateState({
        response: {
          status: response.status,
          statusText: response.statusText,
          time: Math.round(endTime - startTime),
          size,
          headers: responseHeaders,
          body: responseBody,
          error: null,
        },
        history: [
          {
            id: `hist_${Date.now()}`,
            request: { ...currentRequest },
            response: {
              status: response.status,
              statusText: response.statusText,
              time: Math.round(endTime - startTime),
              size,
            },
            timestamp: new Date().toISOString(),
          },
          ...state.history.slice(0, 19), // Keep only the 20 most recent requests
        ],
      })
    } catch (error) {
      // Provide more detailed error information
      let errorMessage = error.message

      // Check for specific error types
      if (error.name === "AbortError") {
        errorMessage = "Request timed out after 30 seconds"
      } else if (error.message.includes("NetworkError") || error.message.includes("Failed to fetch")) {
        errorMessage =
          "Network error: This could be due to CORS restrictions, network connectivity issues, or the API endpoint is unavailable. Try using a CORS proxy or server-side request."
      }

      // Add to error logs
      const errorLog = {
        id: `error_${Date.now()}`,
        timestamp: new Date().toISOString(),
        request: currentRequest.url,
        method: currentRequest.method,
        error: errorMessage,
        type: "Request Error",
      }

      updateState({
        response: {
          status: null,
          statusText: "",
          time: null,
          size: null,
          headers: null,
          body: null,
          error: errorMessage,
        },
        errorLogs: [errorLog, ...state.errorLogs],
      })

      toast({
        title: "Request Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      updateUI({ loading: false })
    }
  }

  // Copy response to clipboard
  const copyResponse = () => {
    const { body } = state.response
    const textToCopy = typeof body === "object" ? JSON.stringify(body, null, 2) : body
    navigator.clipboard.writeText(textToCopy)

    toast({
      title: "Copied to clipboard",
      description: "Response has been copied to clipboard",
    })
  }

  // Copy request as cURL
  const copyAsCurl = () => {
    const { currentRequest } = state
    let curlCommand = `curl -X ${currentRequest.method} "${getFullUrl()}"`

    // Add headers
    currentRequest.headers.forEach((header) => {
      if (header.key && header.value && header.enabled) {
        curlCommand += ` -H "${header.key}: ${header.value}"`
      }
    })

    // Add auth
    if (currentRequest.auth.type === "basic" && currentRequest.auth.basic.username) {
      curlCommand += ` -u "${currentRequest.auth.basic.username}:${currentRequest.auth.basic.password}"`
    } else if (currentRequest.auth.type === "bearer" && currentRequest.auth.bearer.token) {
      curlCommand += ` -H "Authorization: Bearer ${currentRequest.auth.bearer.token}"`
    } else if (currentRequest.auth.type === "oauth2" && currentRequest.auth.oauth2.token) {
      curlCommand += ` -H "Authorization: Bearer ${currentRequest.auth.oauth2.token}"`
    }

    // Add body
    if (currentRequest.method !== "GET" && currentRequest.method !== "HEAD") {
      if (currentRequest.body.mode === "raw") {
        curlCommand += ` -d '${currentRequest.body.raw.content}'`
      } else if (currentRequest.body.mode === "form-data") {
        currentRequest.body.formData.forEach((item) => {
          if (item.key && item.enabled) {
            curlCommand += ` -F "${item.key}=${item.value}"`
          }
        })
      } else if (currentRequest.body.mode === "x-www-form-urlencoded") {
        const formData = currentRequest.body.urlencoded
          .filter((item) => item.key && item.enabled)
          .map((item) => `${item.key}=${item.value}`)
          .join("&")
        curlCommand += ` -d "${formData}"`
      }
    }

    navigator.clipboard.writeText(curlCommand)
    toast({
      title: "cURL command copied",
      description: "The cURL command has been copied to clipboard",
    })
  }

  // Clear response
  const clearResponse = () => {
    updateState({
      response: {
        status: null,
        statusText: "",
        time: null,
        size: null,
        headers: null,
        body: null,
        error: null,
      },
    })
  }

  // Clear error logs
  const clearErrorLogs = () => {
    updateState({
      errorLogs: [],
    })

    toast({
      title: "Error logs cleared",
      description: "All error logs have been cleared",
    })
  }

  // Format response for display
  const formatResponseBody = (body, contentType) => {
    if (body === null) return ""

    if (typeof body === "object") {
      return JSON.stringify(body, null, 2)
    }

    return body
  }

  // Get status color based on status code
  const getStatusColor = (status) => {
    if (!status) return "bg-gray-500"
    if (status >= 200 && status < 300) return "bg-green-500"
    if (status >= 300 && status < 400) return "bg-blue-500"
    if (status >= 400 && status < 500) return "bg-yellow-500"
    if (status >= 500) return "bg-red-500"
    return "bg-gray-500"
  }

  // Get content type icon
  const getContentTypeIcon = (contentType) => {
    if (!contentType) return <FileText className="h-4 w-4" />

    if (contentType.includes("application/json")) return <FileJson className="h-4 w-4" />
    if (contentType.includes("text/html")) return <FileCode className="h-4 w-4" />
    if (contentType.includes("image/")) return <ImageIcon className="h-4 w-4" />

    if (contentType.includes("text/xml") || contentType.includes("application/xml"))
      return <Braces className="h-4 w-4" />

    return <FileText className="h-4 w-4" />
  }

  // Delete a request
  const deleteRequest = (requestId, collectionId, folderId = null) => {
    const updatedCollections = state.collections.map((collection) => {
      if (collection.id === collectionId) {
        if (folderId) {
          // Delete from a folder
          return {
            ...collection,
            folders: collection.folders.map((folder) => {
              if (folder.id === folderId) {
                return {
                  ...folder,
                  requests: folder.requests.filter((req) => req.id !== requestId),
                }
              }
              return folder
            }),
          }
        } else {
          // Delete directly from collection
          return {
            ...collection,
            requests: collection.requests.filter((req) => req.id !== requestId),
          }
        }
      }
      return collection
    })

    updateState({
      collections: updatedCollections,
      ui: {
        ...state.ui,
        selectedRequest: null,
        showDeleteRequestDialog: false,
        requestToDelete: null,
        collectionForDelete: null,
      },
    })

    toast({
      title: "Request deleted",
      description: "Request has been deleted",
    })
  }

  // Delete a folder
  const deleteFolder = (folderId, collectionId) => {
    const updatedCollections = state.collections.map((collection) => {
      if (collection.id === collectionId) {
        return {
          ...collection,
          folders: collection.folders.filter((folder) => folder.id !== folderId),
        }
      }
      return collection
    })

    updateState({
      collections: updatedCollections,
      ui: {
        ...state.ui,
        showDeleteFolderDialog: false,
        folderToDelete: null,
        collectionForDelete: null,
      },
    })

    toast({
      title: "Folder deleted",
      description: "Folder has been deleted",
    })
  }

  // Determine if a response is HTML
  const isHtmlResponse = () => {
    const { headers, body } = state.response
    if (!headers || !body) return false

    const contentType = headers["content-type"] || ""
    return contentType.includes("text/html") || (typeof body === "string" && body.trim().startsWith("<!DOCTYPE html>"))
  }

  // Determine if a response is JSON
  const isJsonResponse = () => {
    const { headers, body } = state.response
    if (!headers) return false

    const contentType = headers["content-type"] || ""
    return contentType.includes("application/json") || typeof body === "object"
  }

  // Render the main UI
  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Sidebar */}
      {state.ui.showSidebar && (
        <div className="w-full md:w-[300px] border-r border-border bg-card p-4 flex flex-col h-full md:h-screen overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Collections</h2>
            <div className="flex gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => updateUI({ showNewCollectionModal: true })}>
                      <FolderPlus className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>New Collection</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => updateUI({ showNewRequestModal: true })}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>New Request</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <ScrollArea className="flex-1">
            <Accordion type="multiple" defaultValue={["col_1"]} className="w-full">
              {state.collections.map((collection) => (
                <AccordionItem key={collection.id} value={collection.id}>
                  <AccordionTrigger className="py-2 px-1 text-sm hover:bg-muted/50 rounded-md">
                    <div className="flex items-center">
                      <Folder className="h-4 w-4 mr-2" />
                      <span>{collection.name}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-2 space-y-1">
                      {/* Collection requests */}
                      {collection.requests.map((request) => (
                        <div
                          key={request.id}
                          className={`group flex items-center py-1 px-2 text-xs rounded-md cursor-pointer ${
                            state.ui.selectedRequest === request.id ? "bg-muted" : "hover:bg-muted/50"
                          }`}
                        >
                          <div className="flex-1 flex items-center" onClick={() => loadRequest(request.id)}>
                            <Badge variant="outline" className="mr-2 h-5 min-w-[40px] flex justify-center">
                              {request.method}
                            </Badge>
                            <span className="truncate">{request.name}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => {
                              updateUI({
                                showDeleteRequestDialog: true,
                                requestToDelete: request.id,
                                collectionForDelete: collection.id,
                              })
                            }}
                          >
                            <Trash className="h-3 w-3 text-muted-foreground" />
                          </Button>
                        </div>
                      ))}

                      {/* Collection folders */}
                      {collection.folders.map((folder) => (
                        <Accordion key={folder.id} type="multiple" className="w-full border-none">
                          <AccordionItem value={folder.id} className="border-none">
                            <AccordionTrigger className="group py-1 px-1 text-xs hover:bg-muted/50 rounded-md">
                              <div className="flex items-center flex-1">
                                <Folder className="h-3 w-3 mr-2" />
                                <span>{folder.name}</span>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity mr-6"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  updateUI({
                                    showDeleteFolderDialog: true,
                                    folderToDelete: folder.id,
                                    collectionForDelete: collection.id,
                                  })
                                }}
                              >
                                <Trash className="h-3 w-3 text-muted-foreground" />
                              </Button>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="pl-2 space-y-1">
                                {folder.requests.map((request) => (
                                  <div
                                    key={request.id}
                                    className={`group flex items-center py-1 px-2 text-xs rounded-md cursor-pointer ${
                                      state.ui.selectedRequest === request.id ? "bg-muted" : "hover:bg-muted/50"
                                    }`}
                                  >
                                    <div className="flex-1 flex items-center" onClick={() => loadRequest(request.id)}>
                                      <Badge variant="outline" className="mr-2 h-5 min-w-[40px] flex justify-center">
                                        {request.method}
                                      </Badge>
                                      <span className="truncate">{request.name}</span>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                      onClick={() => {
                                        updateUI({
                                          showDeleteRequestDialog: true,
                                          requestToDelete: request.id,
                                          collectionForDelete: collection.id,
                                          folderToDelete: folder.id,
                                        })
                                      }}
                                    >
                                      <Trash className="h-3 w-3 text-muted-foreground" />
                                    </Button>
                                  </div>
                                ))}

                                {/* Add request to folder button */}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="w-full justify-start text-xs"
                                  onClick={() => {
                                    updateUI({
                                      showNewRequestModal: true,
                                      selectedCollection: collection.id,
                                      selectedFolder: folder.id,
                                    })
                                  }}
                                >
                                  <Plus className="h-3 w-3 mr-2" />
                                  Add Request
                                </Button>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      ))}

                      {/* Add folder button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-xs"
                        onClick={() => {
                          updateUI({
                            showNewFolderModal: true,
                            selectedCollection: collection.id,
                          })
                        }}
                      >
                        <FolderPlus className="h-3 w-3 mr-2" />
                        Add Folder
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollArea>

          <Separator className="my-4" />

          {/* History section */}
          <div>
            <h3 className="text-sm font-medium mb-2">History</h3>
            <ScrollArea className="h-[200px]">
              <div className="space-y-1">
                {state.history.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center py-1 px-2 text-xs rounded-md cursor-pointer hover:bg-muted/50"
                    onClick={() => {
                      updateState({
                        currentRequest: { ...item.request },
                        ui: {
                          ...state.ui,
                          selectedRequest: null,
                        },
                      })
                    }}
                  >
                    <div className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(item.response.status)}`} />
                    <Badge variant="outline" className="mr-2 h-5 min-w-[40px] flex justify-center">
                      {item.request.method}
                    </Badge>
                    <div className="flex flex-col">
                      <span className="truncate max-w-[180px]">{item.request.name || item.request.url}</span>
                      <span className="text-muted-foreground text-[10px]">
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top bar */}
        <div className="border-b border-border p-4 bg-card">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => updateUI({ showSidebar: !state.ui.showSidebar })}
              className="mr-2"
            >
              <Layers className="h-4 w-4" />
            </Button>

            <Select
              value={state.currentRequest.method}
              onValueChange={(value) => updateCurrentRequest({ method: value })}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
                <SelectItem value="PATCH">PATCH</SelectItem>
                <SelectItem value="HEAD">HEAD</SelectItem>
                <SelectItem value="OPTIONS">OPTIONS</SelectItem>
              </SelectContent>
            </Select>

            <Input
              value={state.currentRequest.url}
              onChange={(e) => updateCurrentRequest({ url: e.target.value })}
              placeholder="Enter request URL"
              className="flex-1"
            />

            <Button onClick={sendRequest} disabled={state.ui.loading}>
              {state.ui.loading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              Send
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Save className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => saveRequest(state.ui.selectedCollection)}>
                  Save Request
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Save to Folder</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    {state.collections.map((collection) => (
                      <div key={collection.id}>
                        {collection.folders.length > 0 && (
                          <>
                            <DropdownMenuItem disabled className="font-semibold text-xs">
                              {collection.name}
                            </DropdownMenuItem>
                            {collection.folders.map((folder) => (
                              <DropdownMenuItem key={folder.id} onClick={() => saveRequest(collection.id, folder.id)}>
                                <Folder className="h-3 w-3 mr-2" />
                                {folder.name}
                              </DropdownMenuItem>
                            ))}
                            {collection !== state.collections[state.collections.length - 1] && (
                              <DropdownMenuSeparator />
                            )}
                          </>
                        )}
                      </div>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuItem onClick={() => updateUI({ showNewRequestModal: true })}>Save As...</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={copyAsCurl}>Copy as cURL</DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    // Use a CORS proxy for the current request
                    const currentUrl = state.currentRequest.url
                    if (currentUrl.startsWith("https://cors-proxy.example.com/")) {
                      // Remove the proxy if it's already there
                      updateCurrentRequest({
                        url: currentUrl.replace("https://cors-proxy.example.com/", ""),
                      })
                      toast({
                        title: "CORS Proxy Disabled",
                        description: "Removed CORS proxy from the request URL",
                      })
                    } else {
                      // Add the proxy
                      updateCurrentRequest({
                        url: `https://cors-proxy.example.com/${currentUrl}`,
                      })
                      toast({
                        title: "CORS Proxy Enabled",
                        description: "Added CORS proxy to the request URL. This may help bypass CORS restrictions.",
                      })
                    }
                  }}
                >
                  {state.currentRequest.url.startsWith("https://cors-proxy.example.com/")
                    ? "Disable CORS Proxy"
                    : "Enable CORS Proxy"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => updateUI({ showEnvironmentModal: true })}>
                  Manage Environments
                </DropdownMenuItem>
                <DropdownMenuItem onClick={useServerProxy}>Use Server Proxy</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => updateUI({ showErrorLogs: !state.ui.showErrorLogs })}>
                  {state.ui.showErrorLogs ? "Hide Error Logs" : "Show Error Logs"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex mt-2">
            <Input
              value={state.currentRequest.name}
              onChange={(e) => updateCurrentRequest({ name: e.target.value })}
              placeholder="Request name"
              className="max-w-[300px] h-8 text-sm"
            />
          </div>
        </div>

        {/* Error Logs Panel */}
        {state.ui.showErrorLogs && (
          <Collapsible className="border-b border-border">
            <div className="px-4 py-2 bg-red-50 dark:bg-red-900/20 flex justify-between items-center">
              <div className="flex items-center">
                <Bug className="h-4 w-4 mr-2 text-red-500" />
                <h3 className="text-sm font-medium">Error Logs</h3>
                <Badge variant="outline" className="ml-2">
                  {state.errorLogs.length}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={clearErrorLogs}>
                  <Trash className="h-3 w-3 mr-1" /> Clear
                </Button>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>
              </div>
            </div>
            <CollapsibleContent>
              <ScrollArea className="h-[150px]">
                <div className="p-2">
                  {state.errorLogs.length === 0 ? (
                    <div className="text-center text-sm text-muted-foreground py-4">No errors logged yet</div>
                  ) : (
                    <div className="space-y-2">
                      {state.errorLogs.map((log) => (
                        <div key={log.id} className="bg-red-100 dark:bg-red-900/30 p-3 rounded-md text-xs">
                          <div className="flex justify-between">
                            <span className="font-semibold">{log.type}</span>
                            <span className="text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</span>
                          </div>
                          <div className="mt-1">
                            <span className="text-muted-foreground">
                              {log.method} {log.request}
                            </span>
                          </div>
                          <div className="mt-2 text-red-600 dark:text-red-400">{log.error}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Request/Response area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tabs for request details */}
          <Tabs value={state.ui.activeTab} onValueChange={(value) => updateUI({ activeTab: value })}>
            <div className="border-b border-border">
              <TabsList className="mx-4">
                <TabsTrigger value="params">Params</TabsTrigger>
                <TabsTrigger value="headers">Headers</TabsTrigger>
                <TabsTrigger value="body">Body</TabsTrigger>
                <TabsTrigger value="auth">Auth</TabsTrigger>
              </TabsList>
            </div>

            <div className="p-4 h-[250px] overflow-auto">
              <TabsContent value="params" className="mt-0">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium">Query Parameters</h3>
                    <Button variant="outline" size="sm" onClick={addParam}>
                      <Plus className="h-3 w-3 mr-1" /> Add
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {state.currentRequest.params.length === 0 ? (
                      <div className="text-sm text-muted-foreground text-center py-4">No parameters added yet</div>
                    ) : (
                      state.currentRequest.params.map((param, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="flex items-center h-8 w-8">
                            <Switch
                              checked={param.enabled}
                              onCheckedChange={(checked) => updateParam(index, "enabled", checked)}
                            />
                          </div>
                          <Input
                            value={param.key}
                            onChange={(e) => updateParam(index, "key", e.target.value)}
                            placeholder="Parameter name"
                            className="flex-1"
                          />
                          <Input
                            value={param.value}
                            onChange={(e) => updateParam(index, "value", e.target.value)}
                            placeholder="Value"
                            className="flex-1"
                          />
                          <Button variant="ghost" size="icon" onClick={() => removeParam(index)}>
                            <Trash className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="headers" className="mt-0">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium">Headers</h3>
                    <Button variant="outline" size="sm" onClick={addHeader}>
                      <Plus className="h-3 w-3 mr-1" /> Add
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {state.currentRequest.headers.length === 0 ? (
                      <div className="text-sm text-muted-foreground text-center py-4">No headers added yet</div>
                    ) : (
                      state.currentRequest.headers.map((header, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="flex items-center h-8 w-8">
                            <Switch
                              checked={header.enabled}
                              onCheckedChange={(checked) => updateHeader(index, "enabled", checked)}
                            />
                          </div>
                          <Input
                            value={header.key}
                            onChange={(e) => updateHeader(index, "key", e.target.value)}
                            placeholder="Header name"
                            className="flex-1"
                          />
                          <Input
                            value={header.value}
                            onChange={(e) => updateHeader(index, "value", e.target.value)}
                            placeholder="Value"
                            className="flex-1"
                          />
                          <Button variant="ghost" size="icon" onClick={() => removeHeader(index)}>
                            <Trash className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="body" className="mt-0">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium">Request Body</h3>
                    <div className="flex items-center gap-2">
                      <Select value={state.currentRequest.body.mode} onValueChange={changeBodyMode}>
                        <SelectTrigger className="w-[150px]">
                          <SelectValue placeholder="Body type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="raw">Raw</SelectItem>
                          <SelectItem value="form-data">Form Data</SelectItem>
                          <SelectItem value="x-www-form-urlencoded">x-www-form-urlencoded</SelectItem>
                        </SelectContent>
                      </Select>

                      {state.currentRequest.body.mode === "raw" && (
                        <Select value={state.currentRequest.body.raw.type} onValueChange={changeRawBodyType}>
                          <SelectTrigger className="w-[100px]">
                            <SelectValue placeholder="Format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="json">JSON</SelectItem>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="xml">XML</SelectItem>
                            <SelectItem value="html">HTML</SelectItem>
                          </SelectContent>
                        </Select>
                      )}

                      {state.currentRequest.body.mode === "raw" && state.currentRequest.body.raw.type === "json" && (
                        <Button variant="outline" size="sm" onClick={formatJSON}>
                          Format
                        </Button>
                      )}
                    </div>
                  </div>

                  {state.currentRequest.body.mode === "none" && (
                    <div className="text-sm text-muted-foreground text-center py-4">
                      This request does not have a body
                    </div>
                  )}

                  {state.currentRequest.body.mode === "raw" && (
                    <div className="relative">
                      <Textarea
                        value={state.currentRequest.body.raw.content}
                        onChange={(e) => updateRawBody(e.target.value)}
                        placeholder={
                          state.currentRequest.body.raw.type === "json" ? "Enter JSON body" : "Enter request body"
                        }
                        className={`font-mono h-32 ${state.ui.jsonError ? "border-red-500" : ""}`}
                      />
                      {state.ui.jsonError && (
                        <div className="text-red-500 text-xs mt-1">
                          <span className="font-semibold">Error:</span> {state.ui.jsonError}
                        </div>
                      )}
                    </div>
                  )}

                  {state.currentRequest.body.mode === "form-data" && (
                    <div className="space-y-2">
                      <div className="flex justify-end">
                        <Button variant="outline" size="sm" onClick={addFormData}>
                          <Plus className="h-3 w-3 mr-1" /> Add
                        </Button>
                      </div>

                      {state.currentRequest.body.formData.length === 0 ? (
                        <div className="text-sm text-muted-foreground text-center py-4">No form data added yet</div>
                      ) : (
                        state.currentRequest.body.formData.map((item, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="flex items-center h-8 w-8">
                              <Switch
                                checked={item.enabled}
                                onCheckedChange={(checked) => updateFormData(index, "enabled", checked)}
                              />
                            </div>
                            <Input
                              value={item.key}
                              onChange={(e) => updateFormData(index, "key", e.target.value)}
                              placeholder="Key"
                              className="flex-1"
                            />
                            <Input
                              value={item.value}
                              onChange={(e) => updateFormData(index, "value", e.target.value)}
                              placeholder="Value"
                              className="flex-1"
                            />
                            <Select value={item.type} onValueChange={(value) => updateFormData(index, "type", value)}>
                              <SelectTrigger className="w-[100px]">
                                <SelectValue placeholder="Type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="text">Text</SelectItem>
                                <SelectItem value="file">File</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button variant="ghost" size="icon" onClick={() => removeFormData(index)}>
                              <Trash className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {state.currentRequest.body.mode === "x-www-form-urlencoded" && (
                    <div className="space-y-2">
                      <div className="flex justify-end">
                        <Button variant="outline" size="sm" onClick={addUrlEncoded}>
                          <Plus className="h-3 w-3 mr-1" /> Add
                        </Button>
                      </div>

                      {state.currentRequest.body.urlencoded.length === 0 ? (
                        <div className="text-sm text-muted-foreground text-center py-4">
                          No URL encoded data added yet
                        </div>
                      ) : (
                        state.currentRequest.body.urlencoded.map((item, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="flex items-center h-8 w-8">
                              <Switch
                                checked={item.enabled}
                                onCheckedChange={(checked) => updateUrlEncoded(index, "enabled", checked)}
                              />
                            </div>
                            <Input
                              value={item.key}
                              onChange={(e) => updateUrlEncoded(index, "key", e.target.value)}
                              placeholder="Key"
                              className="flex-1"
                            />
                            <Input
                              value={item.value}
                              onChange={(e) => updateUrlEncoded(index, "value", e.target.value)}
                              placeholder="Value"
                              className="flex-1"
                            />
                            <Button variant="ghost" size="icon" onClick={() => removeUrlEncoded(index)}>
                              <Trash className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="auth" className="mt-0">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium">Authentication</h3>
                    <Select value={state.currentRequest.auth.type} onValueChange={updateAuthType}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Auth type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Auth</SelectItem>
                        <SelectItem value="basic">Basic Auth</SelectItem>
                        <SelectItem value="bearer">Bearer Token</SelectItem>
                        <SelectItem value="oauth2">OAuth 2.0</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {state.currentRequest.auth.type === "none" && (
                    <div className="text-sm text-muted-foreground text-center py-4">
                      This request does not use authentication
                    </div>
                  )}

                  {state.currentRequest.auth.type === "basic" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="username">Username</Label>
                          <Input
                            id="username"
                            value={state.currentRequest.auth.basic.username}
                            onChange={(e) => updateBasicAuth("username", e.target.value)}
                            placeholder="Username"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password">Password</Label>
                          <Input
                            id="password"
                            type="password"
                            value={state.currentRequest.auth.basic.password}
                            onChange={(e) => updateBasicAuth("password", e.target.value)}
                            placeholder="Password"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {state.currentRequest.auth.type === "bearer" && (
                    <div className="space-y-2">
                      <Label htmlFor="token">Token</Label>
                      <Input
                        id="token"
                        value={state.currentRequest.auth.bearer.token}
                        onChange={(e) => updateBearerToken(e.target.value)}
                        placeholder="Bearer token"
                      />
                    </div>
                  )}

                  {state.currentRequest.auth.type === "oauth2" && (
                    <div className="space-y-2">
                      <Label htmlFor="oauth2-token">Access Token</Label>
                      <Input
                        id="oauth2-token"
                        value={state.currentRequest.auth.oauth2.token}
                        onChange={(e) => updateOAuth2Token(e.target.value)}
                        placeholder="OAuth 2.0 token"
                      />
                    </div>
                  )}
                </div>
              </TabsContent>
            </div>
          </Tabs>

          {/* Response section */}
          <div className="flex-1 border-t border-border overflow-hidden flex flex-col">
            <div className="p-4 flex justify-between items-center">
              <div className="flex items-center">
                <h3 className="text-sm font-medium">Response</h3>
                {state.response.status && (
                  <div className="flex items-center ml-4">
                    <div className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(state.response.status)}`} />
                    <span className="text-sm font-medium">
                      {state.response.status} {state.response.statusText}
                    </span>
                    {state.response.time && (
                      <span className="text-xs text-muted-foreground ml-2">{state.response.time}ms</span>
                    )}
                    {state.response.size && (
                      <span className="text-xs text-muted-foreground ml-2">
                        {state.response.size < 1024
                          ? `${state.response.size} B`
                          : `${(state.response.size / 1024).toFixed(1)} KB`}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {state.response.body && (
                  <>
                    <Button variant="ghost" size="sm" onClick={copyResponse}>
                      <Copy className="h-3 w-3 mr-1" /> Copy
                    </Button>
                    <Button variant="ghost" size="sm" onClick={clearResponse}>
                      <Trash className="h-3 w-3 mr-1" /> Clear
                    </Button>
                  </>
                )}
              </div>
            </div>

            <Tabs value={state.ui.responseTab} onValueChange={(value) => updateUI({ responseTab: value })}>
              <div className="border-b border-border">
                <TabsList className="mx-4">
                  <TabsTrigger value="body" className="text-xs">
                    Body
                  </TabsTrigger>
                  <TabsTrigger value="headers" className="text-xs">
                    Headers
                  </TabsTrigger>
                  <TabsTrigger value="logs" className="text-xs">
                    Logs
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-1 overflow-hidden">
                <TabsContent value="body" className="h-full m-0 p-0">
                  {state.ui.loading ? (
                    <div className="flex justify-center items-center h-full">
                      <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : state.response.error ? (
                    <div className="flex flex-col items-center h-full overflow-hidden">
                      <ScrollArea className="w-full max-h-[calc(100vh-550px)] p-6">
                        <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg max-w-2xl mx-auto">
                          <div className="flex items-center text-red-600 dark:text-red-400 mb-4">
                            <AlertCircle className="h-6 w-6 mr-2" />
                            <h3 className="text-lg font-semibold">Request Error</h3>
                          </div>
                          <p className="text-sm mb-4">{state.response.error}</p>

                          <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-md">
                            <h4 className="text-sm font-medium mb-2">Troubleshooting Tips:</h4>
                            <ul className="list-disc list-inside text-xs space-y-1">
                              <li>Check if the API endpoint is correct and accessible</li>
                              <li>CORS issues: Try using the "Use Proxy" button to bypass CORS restrictions</li>
                              <li>Check your network connection</li>
                              <li>Verify that the API server is running and responding</li>
                              <li>
                                Try the request in Postman desktop app or cURL to see if it works outside the browser
                              </li>
                            </ul>
                          </div>

                          <div className="mt-4">
                            <Button variant="outline" size="sm" onClick={useServerProxy} className="mr-2">
                              Try with Server Proxy
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                // Open the URL in a new tab to check if it's accessible
                                window.open(state.currentRequest.url, "_blank")
                              }}
                            >
                              Open URL in New Tab
                            </Button>
                          </div>
                        </div>
                      </ScrollArea>
                    </div>
                  ) : state.response.body ? (
                    <Tabs value={state.ui.bodyTab} onValueChange={(value) => updateUI({ bodyTab: value })}>
                      <div className="border-b border-border">
                        <TabsList className="mx-4">
                          <TabsTrigger value="pretty" className="text-xs">
                            Pretty
                          </TabsTrigger>
                          <TabsTrigger value="raw" className="text-xs">
                            Raw
                          </TabsTrigger>
                          <TabsTrigger value="preview" className="text-xs">
                            Preview
                          </TabsTrigger>
                        </TabsList>
                      </div>

                      <TabsContent value="pretty" className="h-full m-0 p-0">
                        <ScrollArea className="h-full" style={{ height: "calc(100vh - 550px)" }}>
                          <div className="p-4">
                            <pre className="text-sm font-mono whitespace-pre-wrap">
                              {formatResponseBody(state.response.body)}
                            </pre>
                          </div>
                        </ScrollArea>
                      </TabsContent>

                      <TabsContent value="raw" className="h-full m-0 p-0">
                        <ScrollArea className="h-full" style={{ height: "calc(100vh - 550px)" }}>
                          <div className="p-4">
                            <pre className="text-sm font-mono whitespace-pre-wrap">
                              {typeof state.response.body === "object"
                                ? JSON.stringify(state.response.body)
                                : state.response.body}
                            </pre>
                          </div>
                        </ScrollArea>
                      </TabsContent>

                      <TabsContent value="preview" className="h-full m-0 p-0">
                        <div className="h-full" style={{ height: "calc(100vh - 550px)" }}>
                          <div className="border-b border-border p-2 bg-muted/50 flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">
                              {isHtmlResponse()
                                ? "HTML Preview (Sandbox)"
                                : isJsonResponse()
                                  ? "JSON Preview"
                                  : "Content Preview"}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const contentType = state.response.headers?.["content-type"] || "text/plain"
                                const content =
                                  typeof state.response.body === "string"
                                    ? state.response.body
                                    : JSON.stringify(state.response.body, null, 2)

                                const blob = new Blob([content], { type: contentType })
                                const url = URL.createObjectURL(blob)
                                window.open(url, "_blank")
                              }}
                            >
                              <ExternalLink className="h-3 w-3 mr-1" /> Open in New Tab
                            </Button>
                          </div>

                          {isHtmlResponse() ? (
                            <iframe
                              srcDoc={typeof state.response.body === "string" ? state.response.body : ""}
                              sandbox="allow-same-origin"
                              className="w-full h-full border-0"
                              title="HTML Preview"
                              style={{ height: "calc(100% - 40px)" }}
                            />
                          ) : (
                            <ScrollArea className="h-full" style={{ height: "calc(100% - 40px)" }}>
                              <div className="p-4">
                                {isJsonResponse() ? (
                                  <div className="font-mono text-sm whitespace-pre-wrap">
                                    {typeof state.response.body === "object"
                                      ? JSON.stringify(state.response.body, null, 2)
                                      : state.response.body}
                                  </div>
                                ) : (
                                  <div className="font-mono text-sm whitespace-pre-wrap">{state.response.body}</div>
                                )}
                              </div>
                            </ScrollArea>
                          )}
                        </div>
                      </TabsContent>
                    </Tabs>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                      <ArrowRight className="h-8 w-8 mb-2" />
                      <p className="text-sm">Send a request to see the response</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="headers" className="h-full m-0 p-0">
                  {state.ui.loading ? (
                    <div className="flex justify-center items-center h-full">
                      <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : state.response.headers ? (
                    <ScrollArea className="h-full max-h-[calc(100vh-550px)]">
                      <div className="p-4">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2 font-medium">Name</th>
                              <th className="text-left py-2 font-medium">Value</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(state.response.headers).map(([key, value]) => (
                              <tr key={key} className="border-b border-border/50">
                                <td className="py-2 pr-4 font-medium">{key}</td>
                                <td className="py-2 break-all">{value}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                      <ArrowRight className="h-8 w-8 mb-2" />
                      <p className="text-sm">Send a request to see the response headers</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="logs" className="h-full m-0 p-0">
                  <ScrollArea className="h-full max-h-[calc(100vh-550px)]">
                    <div className="p-4">
                      {state.errorLogs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                          <Check className="h-8 w-8 mb-2" />
                          <p className="text-sm">No errors logged</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {state.errorLogs.map((log) => (
                            <div key={log.id} className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md text-sm">
                              <div className="flex justify-between">
                                <span className="font-semibold">{log.type}</span>
                                <span className="text-muted-foreground">
                                  {new Date(log.timestamp).toLocaleString()}
                                </span>
                              </div>
                              <div className="mt-1">
                                <span className="text-muted-foreground">
                                  {log.method} {log.request}
                                </span>
                              </div>
                              <div className="mt-2 text-red-600 dark:text-red-400">{log.error}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
      {/* Modals */}
      {state.ui.showNewCollectionModal && <NewCollectionModal />}
      {state.ui.showNewFolderModal && <NewFolderModal />}
      {state.ui.showNewRequestModal && <NewRequestModal />}
      {state.ui.showDeleteRequestDialog && <DeleteRequestDialog />}
      {state.ui.showDeleteFolderDialog && <DeleteFolderDialog />}
    </div>
  )
}
