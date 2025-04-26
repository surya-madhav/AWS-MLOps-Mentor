"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import ConceptCard from "./concept-card"
import ConceptDialog from "./concept-dialog" // Changed to use dialog instead of inline detail
// import { updateUserContentProgress } from "@/lib/db/queries"

interface ConceptsGridProps {
  topic: any
  userId: string
}

export default function ConceptsGrid({ topic, userId }: ConceptsGridProps) {
  const [selectedConceptId, setSelectedConceptId] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Memoize allContentItems to prevent recalculation on every render
  const allContentItems = useMemo(() => {
    if (!topic || !topic.content_items) return []

    return Object.entries(topic.content_items).flatMap(([type, items]: [string, any[]]) =>
      items.map((item) => ({ ...item, type })),
    )
  }, [topic])

  // Memoize filtered concepts to prevent unnecessary recalculations
  const filteredConcepts = useMemo(() => {
    if (searchQuery.trim() === "") {
      return allContentItems
    }

    const query = searchQuery.toLowerCase()
    return allContentItems.filter(
      (concept) =>
        concept.name.toLowerCase().includes(query) ||
        (concept.content && concept.content.toLowerCase().includes(query)),
    )
  }, [searchQuery, allContentItems])

  // Find the selected concept based on ID
  const selectedConcept = useMemo(() => {
    return allContentItems.find((concept) => concept.id === selectedConceptId) || null
  }, [selectedConceptId, allContentItems])

  const handleConceptClick = (conceptId: string) => {
    setSelectedConceptId(conceptId)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
  }

  const handleUpdateProgress = async (contentItemId: string, isCompleted: boolean, notes?: any, videos?: any) => {
    try {
      await updateUserContentProgress({
        userId,
        contentItemId,
        isCompleted,
        notes,
        videos,
      })

      // No need to update local state here as we'll close the dialog
      // and the parent component should handle refetching if needed
    } catch (error) {
      console.error("Failed to update progress:", error)
    }
  }

  // Handle navigation between concepts in the dialog
  const handleNavigate = (direction: "prev" | "next") => {
    if (!selectedConceptId || filteredConcepts.length <= 1) return

    const currentIndex = filteredConcepts.findIndex((c) => c.id === selectedConceptId)
    if (currentIndex === -1) return

    let newIndex
    if (direction === "next" && currentIndex < filteredConcepts.length - 1) {
      newIndex = currentIndex + 1
    } else if (direction === "prev" && currentIndex > 0) {
      newIndex = currentIndex - 1
    } else {
      return
    }

    setSelectedConceptId(filteredConcepts[newIndex].id)
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search concepts..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredConcepts.length > 0 ? (
          filteredConcepts.map((item) => (
            <ConceptCard
              key={item.id}
              concept={item}
              onUpdateProgress={handleUpdateProgress}
              userId={userId}
              onClick={() => handleConceptClick(item.id)}
            />
          ))
        ) : (
          <p className="text-muted-foreground col-span-full">
            {searchQuery ? "No content items match your search." : "No content items available for this topic."}
          </p>
        )}
      </div>

      {/* Concept Dialog */}
      {selectedConcept && (
        <ConceptDialog
          concept={selectedConcept}
          isOpen={isDialogOpen}
          onClose={handleCloseDialog}
          onUpdateProgress={handleUpdateProgress}
          userId={userId}
          onNavigate={handleNavigate}
          hasNext={filteredConcepts.indexOf(selectedConcept) < filteredConcepts.length - 1}
          hasPrev={filteredConcepts.indexOf(selectedConcept) > 0}
        />
      )}
    </div>
  )
}
