"use client"

import { useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Progress } from "@/components/ui/progress"
import TopicsList from "./topics-list"
import ConceptsGrid from "./concepts-grid"

interface DomainAccordionProps {
  domain: any
  userId: string
}

export default function DomainAccordion({ domain, userId }: DomainAccordionProps) {
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(
    domain.topics.length > 0 ? domain.topics[0].id : null,
  )

  // Find the selected topic
  const selectedTopic = domain.topics.find((topic: any) => topic.id === selectedTopicId)

  return (
    <Accordion type="single" collapsible className="border rounded-lg">
      <AccordionItem value={domain.id} className="border-none">
        <AccordionTrigger className="px-4 py-3 hover:no-underline">
          <div className="flex flex-col items-start w-full">
            <div className="flex justify-between w-full">
              <h3 className="text-lg font-semibold">{domain.name}</h3>
              <span className="text-sm text-muted-foreground">
                {domain.progress.completed}/{domain.progress.total} completed
              </span>
            </div>
            <Progress value={domain.progress.percentage} className="h-2 w-full mt-2" />
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4">
          {domain.topics.length > 0 ? (
            <div className="grid grid-cols-5 gap-6">
              {/* Topics List (1/5 width) */}
              <div className="col-span-1">
                <TopicsList
                  topics={domain.topics}
                  selectedTopicId={selectedTopicId}
                  onSelectTopic={setSelectedTopicId}
                />
              </div>

              {/* Concepts Grid (4/5 width) */}
              <div className="col-span-4">
                {selectedTopic && <ConceptsGrid topic={selectedTopic} userId={userId} />}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">No topics available for this domain.</p>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
