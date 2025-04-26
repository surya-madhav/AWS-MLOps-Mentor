"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import DomainAccordion from "./domain-accordion"

interface DashboardProps {
  learningData: any[]
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
            (topic) =>
              topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              // Check if any content items match
              Object.values(topic.content_items || {})
                .flat()
                .some((item: any) => item.name.toLowerCase().includes(searchQuery.toLowerCase())),
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
