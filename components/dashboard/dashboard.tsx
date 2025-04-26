"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import DomainAccordion from "./domain-accordion"

// Define interfaces for our data structure
interface ContentItem {
  id: string
  name: string
  content: string
  type: string
  // Other properties
}

interface Topic {
  id: string
  name: string
  content_items: Record<string, ContentItem[]>
  // Other properties
}

interface Domain {
  id: string
  name: string
  topics: Topic[]
  // Other properties
}

interface DashboardProps {
  learningData: Domain[]
  userId: string
}

export default function Dashboard({ learningData, userId }: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter domains and their content based on search query
  const filteredData = searchQuery
    ? learningData
        .map((domain) => {
          // Filter topics that match the search query
          const filteredTopics = domain.topics.filter(
            (topic: Topic) =>
              topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              // Check if any content items match
              Object.values(topic.content_items || {})
                .flat()
                .some((item: ContentItem) => item.name.toLowerCase().includes(searchQuery.toLowerCase())),
          )

          // Return domain with filtered topics
          return {
            ...domain,
            topics: filteredTopics,
            // Only include domain if it has matching topics
            _matches: filteredTopics.length > 0,
          }
        })
        .filter((domain) => domain._matches)
    : learningData

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search domains, topics, or concepts..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Domains List */}
      <div className="space-y-4">
        {filteredData.map((domain) => (
          <DomainAccordion key={domain.id} domain={domain} userId={userId} />
        ))}
      </div>
    </div>
  )
}
