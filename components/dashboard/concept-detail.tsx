"use client"

import { useState, useEffect } from "react"
import { X, Save, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ConceptDetailProps {
  concept: any
  onClose: () => void
  onUpdateProgress: (contentItemId: string, isCompleted: boolean, notes?: any, videos?: any) => void
  userId: string
}

export default function ConceptDetail({ concept, onClose, onUpdateProgress, userId }: ConceptDetailProps) {
  // Initialize state with concept data
  const [isCompleted, setIsCompleted] = useState(concept.progress?.isCompleted || false)
  const [notes, setNotes] = useState(concept.progress?.notes || "")
  const [videos, setVideos] = useState<{ url: string; title: string }[]>(concept.progress?.videos || [])
  const [newVideoUrl, setNewVideoUrl] = useState("")
  const [newVideoTitle, setNewVideoTitle] = useState("")
  const [hasChanges, setHasChanges] = useState(false)

  // Track changes
  useEffect(() => {
    const originalIsCompleted = concept.progress?.isCompleted || false
    const originalNotes = concept.progress?.notes || ""
    const originalVideos = concept.progress?.videos || []

    const notesChanged = notes !== originalNotes
    const videosChanged = JSON.stringify(videos) !== JSON.stringify(originalVideos)
    const completionChanged = isCompleted !== originalIsCompleted

    setHasChanges(notesChanged || videosChanged || completionChanged)
  }, [isCompleted, notes, videos, concept.progress])

  const handleSave = () => {
    onUpdateProgress(concept.id, isCompleted, notes || null, videos.length > 0 ? videos : null)
    setHasChanges(false)
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

  const displayType = contentTypeMap[concept.type] || concept.type

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div>
          <CardTitle>{concept.name}</CardTitle>
          <Badge variant="outline" className="mt-1">
            {displayType}
          </Badge>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>

      <Tabs defaultValue="content">
        <TabsList className="mx-6">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="px-6">
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: concept.content }} />
          </div>
        </TabsContent>

        <TabsContent value="notes" className="px-6">
          <Textarea
            placeholder="Add your notes here..."
            className="min-h-[200px]"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </TabsContent>

        <TabsContent value="videos" className="px-6">
          <div className="space-y-4">
            {videos.length > 0 ? (
              <div className="space-y-2">
                {videos.map((video, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                    <div className="flex items-center gap-2">
                      <Youtube className="h-4 w-4 text-red-500" />
                      <a href={video.url} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline">
                        {video.title}
                      </a>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveVideo(index)}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No videos added yet.</p>
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

      <CardFooter className="flex justify-between pt-6">
        <div className="flex items-center space-x-2">
          <Switch id="completed" checked={isCompleted} onCheckedChange={setIsCompleted} />
          <Label htmlFor="completed">Mark as completed</Label>
        </div>

        <Button onClick={handleSave} disabled={!hasChanges}>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  )
}
