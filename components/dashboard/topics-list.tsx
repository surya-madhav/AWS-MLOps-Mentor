"use client"

export default function TopicsList({
  topics,
  selectedTopicId,
  onSelectTopic,
}: {
  topics: any[]
  selectedTopicId: string | null
  onSelectTopic: (id: string) => void
}) {
  return (
    <div className="space-y-1">
      <h4 className="font-medium mb-2">Topics</h4>
      <ul className="space-y-1">
        {topics.map((topic) => (
          <li key={topic.id}>
            <button
              onClick={() => onSelectTopic(topic.id)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                selectedTopicId === topic.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="truncate">{topic.name}</span>
                <span className="text-xs">
                  {topic.progress.completed}/{topic.progress.total}
                </span>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
