'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import {
  Monitor,
  Tablet,
  Smartphone,
  Copy,
  Check,
  Save,
  ArrowLeft,
  History,
  Maximize2,
} from 'lucide-react'
import Editor from '@monaco-editor/react'
import { PreviewModal } from '@/components/preview-modal'
import { VersionHistoryModal } from '@/components/version-history-modal'
import { DynamicComponent } from '@/components/dynamic-component'
import axios from 'axios'
import React from 'react'

const previewSizes = {
  desktop: { width: '100%', height: '100%' },
  tablet: { width: '768px', height: '100%' },
  mobile: { width: '375px', height: '100%' },
}

export default function NewComponent({ params }) {
  const { id } = React.use(params)
  const router = useRouter()
  const { toast } = useToast()
  const [component, setComponent] = useState({
    name: '',
    description: '',
    category: '',
    code: '',
    versions: [],
  })
  const [key, setKey] = useState(0)
  const [previewMode, setPreviewMode] = useState('desktop')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState('editor')

  // Fetch component data
  useEffect(() => {
    const fetchComponent = async () => {
      try {
        const response = await axios.get(`/api/components/${id}`)
        setComponent(response.data.data)
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch component data',
          variant: 'destructive',
        })
      }
    }

    if (id) fetchComponent()
  }, [id, toast])

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target
    setComponent((prev) => ({
      ...prev,
      [name]: value,
    }))
  }, [])

  const handleCodeChange = useCallback((value) => {
    setComponent((prev) => ({
      ...prev,
      code: value || '',
    }))
  }, [])

  const handlePreviewUpdate = useCallback(() => {
    setKey((prevKey) => prevKey + 1)
  }, [])

  const handleSave = useCallback(async () => {
    if (!component.name.trim() || !component.category.trim()) {
      toast({
        title: 'Error',
        description: 'Name and category are required',
        variant: 'destructive',
      })
      return
    }

    const newVersion = {
      code: component.code,
    }

    const updatedComponent = {
      ...component,
      versions: [...component.versions, newVersion],
    }

    try {
      if (id) {
        await axios.put(`/api/components/${id}`, updatedComponent)
      } else {
        await axios.post('/api/components', updatedComponent)
      }

      setComponent(updatedComponent)

      toast({
        title: 'Success',
        description: 'Component saved successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save component',
        variant: 'destructive',
      })
    }
  }, [component, id, toast])

  const copyCode = useCallback(() => {
    navigator.clipboard.writeText(component.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast({
      title: 'Copied',
      description: 'Code copied to clipboard',
    })
  }, [component.code, toast])
  const handleEditorWillMount = (monaco) => {
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.Latest,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
      esModuleInterop: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      reactNamespace: 'React',
      allowJs: true,
      typeRoots: ['node_modules/@types'],
    })

    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      `
      declare module "react" {
        export = React;
      }
      
      declare namespace React {
        function useState<T>(initialState: T): [T, (newState: T) => void];
        
        interface Element {}
        interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> extends Element {}
        interface DOMAttributes<T> {
          onClick?: (event: any) => void;
        }
        interface HTMLAttributes<T> extends DOMAttributes<T> {
          className?: string;
        }
        interface DetailedHTMLProps<E extends HTMLAttributes<T>, T> {}
        type JSXElementConstructor<P> = ((props: P) => ReactElement | null);
      }
      `,
      'file:///node_modules/@types/react/index.d.ts'
    )
  }

  return (
    <div className='container mx-auto p-6'>
      <div className='flex items-center justify-between mb-6'>
        <div className='flex items-center gap-4'>
          <Button
            variant='outline'
            onClick={() => router.push('/dashboard/components')}
          >
            <ArrowLeft className='h-4 w-4 mr-2 ' />
            Back to Components
          </Button>
          <h1 className='text-3xl font-bold'>Edit Component</h1>
        </div>
        <div className='flex items-center gap-2'>
          <Button variant='outline' onClick={() => setIsHistoryOpen(true)}>
            <History className='h-4 w-4 mr-2' />
            Version History
          </Button>
          <Button onClick={handleSave}>
            <Save className='h-4 w-4 mr-2' />
            Save Component
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-1  '>
        <div className='space-y-6'>
          <Card>
            <CardContent className='p-6'>
              <div className='grid gap-4'>
                <div>
                  <Label htmlFor='name'>Component Name</Label>
                  <Input
                    id='name'
                    name='name'
                    value={component.name}
                    onChange={handleInputChange}
                    placeholder='Component Name'
                    className='mt-1.5'
                  />
                </div>
                <div>
                  <Label htmlFor='category'>Category</Label>
                  <Input
                    id='category'
                    name='category'
                    value={component.category}
                    onChange={handleInputChange}
                    placeholder='Category'
                    className='mt-1.5'
                  />
                </div>
                <div>
                  <Label htmlFor='description'>Description</Label>
                  <Textarea
                    id='description'
                    name='description'
                    value={component.description}
                    onChange={handleInputChange}
                    placeholder='Describe your component'
                    className='mt-1.5'
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value)}
          >
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='editor'>Editor</TabsTrigger>
              <TabsTrigger value='preview'>Preview</TabsTrigger>
            </TabsList>
            <TabsContent value='editor'>
              <Card className='border'>
                <CardContent className='p-0'>
                  <div className='relative'>
                    <div className='absolute right-4 top-4 z-10 flex items-center gap-2'>
                      <Button variant='ghost' size='icon' onClick={copyCode}>
                        {copied ? (
                          <Check className='h-4 w-4' />
                        ) : (
                          <Copy className='h-4 w-4' />
                        )}
                      </Button>
                    </div>

                    <Editor
                      height='600px'
                      defaultLanguage='typescript'
                      value={component.code}
                      onChange={handleCodeChange}
                      beforeMount={handleEditorWillMount}
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: 'on',
                        automaticLayout: true,
                        tabSize: 2,
                        formatOnPaste: true,
                        formatOnType: true,
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value='preview'>
              <Card>
                <CardContent className='p-4'>
                  <div className='flex items-center justify-between mb-4'>
                    <div className='flex items-center gap-2'>
                      <Button
                        variant={
                          previewMode === 'desktop' ? 'default' : 'outline'
                        }
                        size='icon'
                        onClick={() => setPreviewMode('desktop')}
                      >
                        <Monitor className='h-4 w-4' />
                      </Button>
                      <Button
                        variant={
                          previewMode === 'tablet' ? 'default' : 'outline'
                        }
                        size='icon'
                        onClick={() => setPreviewMode('tablet')}
                      >
                        <Tablet className='h-4 w-4' />
                      </Button>
                      <Button
                        variant={
                          previewMode === 'mobile' ? 'default' : 'outline'
                        }
                        size='icon'
                        onClick={() => setPreviewMode('mobile')}
                      >
                        <Smartphone className='h-4 w-4' />
                      </Button>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Button onClick={handlePreviewUpdate}>
                        Update Preview
                      </Button>
                      <Button
                        variant='outline'
                        size='icon'
                        onClick={() => setIsFullscreen(true)}
                      >
                        <Maximize2 className='h-4 w-4' />
                      </Button>
                    </div>
                  </div>
                  <div className='flex items-center justify-center min-h-[500px] border rounded-lg bg-grid-pattern'>
                    <div
                      style={{
                        width: previewSizes[previewMode].width,
                        height: previewSizes[previewMode].height,
                        transition: 'width 0.3s ease',
                      }}
                      className=' rounded-lg bg-background shadow-sm overflow-auto'
                    >
                      <div className='p-4'>
                        <DynamicComponent key={key} code={component.code} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* <div className='hidden lg:block'>
          <Card>
            <CardContent className='p-4'>
              <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center gap-2'>
                  <Button
                    variant={previewMode === 'desktop' ? 'default' : 'outline'}
                    size='icon'
                    onClick={() => setPreviewMode('desktop')}
                  >
                    <Monitor className='h-4 w-4' />
                  </Button>
                  <Button
                    variant={previewMode === 'tablet' ? 'default' : 'outline'}
                    size='icon'
                    onClick={() => setPreviewMode('tablet')}
                  >
                    <Tablet className='h-4 w-4' />
                  </Button>
                  <Button
                    variant={previewMode === 'mobile' ? 'default' : 'outline'}
                    size='icon'
                    onClick={() => setPreviewMode('mobile')}
                  >
                    <Smartphone className='h-4 w-4' />
                  </Button>
                </div>
                <div className='flex items-center gap-2'>
                  <Button onClick={handlePreviewUpdate}>Update Preview</Button>
                  <Button
                    variant='outline'
                    size='icon'
                    onClick={() => setIsFullscreen(true)}
                  >
                    <Maximize2 className='h-4 w-4' />
                  </Button>
                </div>
              </div>
              <div className='flex items-center justify-center min-h-[500px] border rounded-lg bg-grid-pattern'>
                <div
                  style={{
                    width: previewSizes[previewMode].width,
                    height: previewSizes[previewMode].height,
                    transition: 'width 0.3s ease',
                  }}
                  className=' rounded-lg bg-background shadow-sm overflow-auto'
                >
                  <div className='p-4'>
                    <DynamicComponent key={key} code={component.code} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div> */}
      </div>

      <PreviewModal
        isOpen={isFullscreen}
        onClose={() => setIsFullscreen(false)}
      >
        <DynamicComponent key={`fullscreen-${key}`} code={component.code} />
      </PreviewModal>

      <VersionHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        versions={component.versions}
        onSelectVersion={(version) => {
          setComponent((prev) => ({
            ...prev,
            code: version.code,
            updatedAt: Date.now(),
          }))
          setIsHistoryOpen(false)
          handlePreviewUpdate()
        }}
      />
    </div>
  )
}
