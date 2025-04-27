"use client"

import { useState, useEffect } from "react"
import { X, Save, Youtube, Maximize, Minimize, ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { Markdown } from '@/components/ui/markdown';

interface ConceptDialogProps {
  concept: any
  isOpen: boolean
  onClose: () => void
  onUpdateProgress: (contentItemId: string, isCompleted: boolean, notes?: any, videos?: any) => void
  userId: string
  onNavigate?: (direction: "prev" | "next") => void
  hasNext?: boolean
  hasPrev?: boolean
}

export default function ConceptDialog({
  concept,
  isOpen,
  onClose,
  onUpdateProgress,
  userId,
  onNavigate,
  hasNext = false,
  hasPrev = false,
}: ConceptDialogProps) {
  // Initialize state with concept data
  const [isCompleted, setIsCompleted] = useState(concept?.progress?.isCompleted || false)
  const [notes, setNotes] = useState(concept?.progress?.notes || "")
  const [videos, setVideos] = useState<{ url: string; title: string }[]>(concept?.progress?.videos || [])
  const [newVideoUrl, setNewVideoUrl] = useState("")
  const [newVideoTitle, setNewVideoTitle] = useState("")
  const [hasChanges, setHasChanges] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Track changes
  useEffect(() => {
    if (!concept) return

    const originalIsCompleted = concept.progress?.isCompleted || false
    const originalNotes = concept.progress?.notes || ""
    const originalVideos = concept.progress?.videos || []

    const notesChanged = notes !== originalNotes
    const videosChanged = JSON.stringify(videos) !== JSON.stringify(originalVideos)
    const completionChanged = isCompleted !== originalIsCompleted

    setHasChanges(notesChanged || videosChanged || completionChanged)
  }, [isCompleted, notes, videos, concept])

  // Reset state when concept changes
  useEffect(() => {
    if (concept) {
      setIsCompleted(concept.progress?.isCompleted || false)
      setNotes(concept.progress?.notes || "")
      setVideos(concept.progress?.videos || [])
      setHasChanges(false)
    }
  }, [concept])

  const handleSave = () => {
    onUpdateProgress(concept.id, isCompleted, notes || null, videos.length > 0 ? videos : null)
    setHasChanges(false)
    
    // No need to add toast here as it's already handled in the parent component's onUpdateProgress
  }

  const handleAddVideo = () => {
    if (newVideoUrl.trim()) {
      const newVideo = {
        url: newVideoUrl,
        title: newVideoTitle.trim() || newVideoUrl,
      }
      setVideos([...videos, newVideo])
      setNewVideoUrl("")
      setNewVideoTitle("")
    }
  }

  const handleRemoveVideo = (index: number) => {
    const updatedVideos = [...videos]
    updatedVideos.splice(index, 1)
    setVideos(updatedVideos)
  }

  // Map content type to a more readable format
  const contentTypeMap: Record<string, string> = {
    concept: "Concept",
    aws_service: "AWS Service",
    framework: "Framework",
    algorithm: "Algorithm",
  }

  if (!concept) return null

  const displayType = contentTypeMap[concept.type] || concept.type

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogOverlay className={cn(isFullscreen && 'bg-background')} />
      <DialogContent
        className={cn(
          'p-0 max-w-4xl',
          isFullscreen &&
            'w-screen h-screen max-w-none max-h-none rounded-none',
        )}
      >
        <div className="flex flex-col h-full max-h-[90vh]">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onNavigate?.('prev')}
                disabled={!hasPrev}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div>
                <h2 className="text-xl font-semibold">{concept.name}</h2>
                <Badge variant="outline" className="mt-1">
                  {displayType}
                </Badge>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => onNavigate?.('next')}
                disabled={!hasNext}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                {isFullscreen ? (
                  <Minimize className="h-4 w-4" />
                ) : (
                  <Maximize className="h-4 w-4" />
                )}
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="mx-6 mt-4">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="videos">Videos</TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="px-6 py-4">
                <div className="prose max-w-none dark:prose-invert">
                  {/* Pass the concept name to the Markdown component */}
                  <Markdown conceptName={concept.name}>{concept.content}</Markdown>
                </div>
              </TabsContent>

              <TabsContent value="notes" className="px-6 py-4">
                <Textarea
                  placeholder="Add your notes here..."
                  className="min-h-[200px]"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </TabsContent>

              <TabsContent value="videos" className="px-6 py-4">
                <div className="space-y-4">
                  {videos.length > 0 ? (
                    <div className="space-y-2">
                      {videos.map((video, index) => (
                        <div
                          key={video.url}
                          className="flex items-center justify-between p-2 border rounded-md"
                        >
                          <div className="flex items-center gap-2">
                            <Youtube className="h-4 w-4 text-red-500" />
                            <a
                              href={video.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm hover:underline"
                            >
                              {video.title}
                            </a>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveVideo(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No videos added yet.
                    </p>
                  )}

                  <div className="space-y-2">
                    <div className="grid grid-cols-4 gap-2">
                      <Input
                        placeholder="Video URL"
                        value={newVideoUrl}
                        onChange={(e) => setNewVideoUrl(e.target.value)}
                        className="col-span-3"
                      />
                      <Button onClick={handleAddVideo}>Add</Button>
                    </div>
                    <Input
                      placeholder="Video Title (optional)"
                      value={newVideoTitle}
                      onChange={(e) => setNewVideoTitle(e.target.value)}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="flex justify-between items-center p-4 border-t">
            <div className="flex items-center space-x-2">
              <Switch
                id="completed"
                checked={isCompleted}
                onCheckedChange={setIsCompleted}
              />
              <Label htmlFor="completed">Mark as completed</Label>
            </div>

            <Button onClick={handleSave} disabled={!hasChanges}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
