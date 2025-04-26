"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

interface ConceptCardProps {
  concept: any
  userId: string
  onUpdateProgress: (contentItemId: string, isCompleted: boolean, notes?: any, videos?: any) => void
  onClick: () => void
}

export default function ConceptCard({ concept, userId, onUpdateProgress, onClick }: ConceptCardProps) {
  const isCompleted = concept.progress?.isCompleted || false

  const contentTypeMap: Record<string, string> = {
    concept: "Concept",
    aws_service: "AWS Service",
    framework: "Framework",
    algorithm: "Algorithm",
  }

  const displayType = contentTypeMap[concept.type] || concept.type

  return (
    <Card
      className={cn(
        "h-full transition-all hover:shadow-md cursor-pointer",
        isCompleted && "border-green-200 dark:border-green-900",
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="outline" className="mb-2">
            {displayType}
          </Badge>
          {isCompleted ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <Circle className="h-5 w-5 text-gray-300" />
          )}
        </div>
        <h3 className="font-medium line-clamp-2">{concept.name}</h3>
        <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
          {concept.content?.substring(0, 100).replace(/[#*_~`]/g, "") || "No content available"}...
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <div className="text-xs text-muted-foreground">
          {concept.progress?.lastUpdated
            ? `Updated ${new Date(concept.progress.lastUpdated).toLocaleDateString()}`
            : "Not started"}
        </div>
      </CardFooter>
    </Card>
  )
}
