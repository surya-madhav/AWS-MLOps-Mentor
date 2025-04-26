import 'server-only';

import {
  and,
  asc,
  desc,
  eq,
  gt,
  gte,
  inArray,
  lt,
  type SQL,
  isNull,
  or,
} from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import {
  user,
  chat,
  type User,
  document,
  type Suggestion,
  suggestion,
  message,
  vote,
  type DBMessage,
  type Chat,
  domains,
  topics,
  contentItems,
  userContentProgress,
  type Domain,
  type Topic,
  type ContentItem,
  type UserContentProgress,
} from './schema';
import type { ArtifactKind } from '@/components/artifact';
import { generateHashedPassword } from './utils';

// Optionally, if not using email/pass login, you can
// use the Drizzle adapter for Auth.js / NextAuth
// https://authjs.dev/reference/adapter/drizzle

// biome-ignore lint: Forbidden non-null assertion.
const client = postgres(process.env.POSTGRES_URL!);
const db = drizzle(client);

export async function getUser(email: string): Promise<Array<User>> {
  try {
    return await db.select().from(user).where(eq(user.email, email));
  } catch (error) {
    console.error('Failed to get user from database');
    throw error;
  }
}

export async function createUser(email: string, password: string) {
  const hashedPassword = generateHashedPassword(password);

  try {
    return await db.insert(user).values({ email, password: hashedPassword });
  } catch (error) {
    console.error('Failed to create user in database');
    throw error;
  }
}

export async function saveChat({
  id,
  userId,
  title,
}: {
  id: string;
  userId: string;
  title: string;
}) {
  try {
    return await db.insert(chat).values({
      id,
      createdAt: new Date(),
      userId,
      title,
    });
  } catch (error) {
    console.error('Failed to save chat in database');
    throw error;
  }
}

export async function deleteChatById({ id }: { id: string }) {
  try {
    await db.delete(vote).where(eq(vote.chatId, id));
    await db.delete(message).where(eq(message.chatId, id));

    const [chatsDeleted] = await db
      .delete(chat)
      .where(eq(chat.id, id))
      .returning();
    return chatsDeleted;
  } catch (error) {
    console.error('Failed to delete chat by id from database');
    throw error;
  }
}

export async function getChatsByUserId({
  id,
  limit,
  startingAfter,
  endingBefore,
}: {
  id: string;
  limit: number;
  startingAfter: string | null;
  endingBefore: string | null;
}) {
  try {
    const extendedLimit = limit + 1;

    const query = (whereCondition?: SQL<any>) =>
      db
        .select()
        .from(chat)
        .where(
          whereCondition
            ? and(whereCondition, eq(chat.userId, id))
            : eq(chat.userId, id),
        )
        .orderBy(desc(chat.createdAt))
        .limit(extendedLimit);

    let filteredChats: Array<Chat> = [];

    if (startingAfter) {
      const [selectedChat] = await db
        .select()
        .from(chat)
        .where(eq(chat.id, startingAfter))
        .limit(1);

      if (!selectedChat) {
        throw new Error(`Chat with id ${startingAfter} not found`);
      }

      filteredChats = await query(gt(chat.createdAt, selectedChat.createdAt));
    } else if (endingBefore) {
      const [selectedChat] = await db
        .select()
        .from(chat)
        .where(eq(chat.id, endingBefore))
        .limit(1);

      if (!selectedChat) {
        throw new Error(`Chat with id ${endingBefore} not found`);
      }

      filteredChats = await query(lt(chat.createdAt, selectedChat.createdAt));
    } else {
      filteredChats = await query();
    }

    const hasMore = filteredChats.length > limit;

    return {
      chats: hasMore ? filteredChats.slice(0, limit) : filteredChats,
      hasMore,
    };
  } catch (error) {
    console.error('Failed to get chats by user from database');
    throw error;
  }
}

export async function getChatById({ id }: { id: string }) {
  try {
    const [selectedChat] = await db.select().from(chat).where(eq(chat.id, id));
    return selectedChat;
  } catch (error) {
    console.error('Failed to get chat by id from database');
    throw error;
  }
}

export async function saveMessages({
  messages,
}: {
  messages: Array<DBMessage>;
}) {
  try {
    return await db.insert(message).values(messages);
  } catch (error) {
    console.error('Failed to save messages in database', error);
    throw error;
  }
}

export async function getMessagesByChatId({ id }: { id: string }) {
  try {
    return await db
      .select()
      .from(message)
      .where(eq(message.chatId, id))
      .orderBy(asc(message.createdAt));
  } catch (error) {
    console.error('Failed to get messages by chat id from database', error);
    throw error;
  }
}

export async function voteMessage({
  chatId,
  messageId,
  type,
}: {
  chatId: string;
  messageId: string;
  type: 'up' | 'down';
}) {
  try {
    const [existingVote] = await db
      .select()
      .from(vote)
      .where(and(eq(vote.messageId, messageId)));

    if (existingVote) {
      return await db
        .update(vote)
        .set({ isUpvoted: type === 'up' })
        .where(and(eq(vote.messageId, messageId), eq(vote.chatId, chatId)));
    }
    return await db.insert(vote).values({
      chatId,
      messageId,
      isUpvoted: type === 'up',
    });
  } catch (error) {
    console.error('Failed to upvote message in database', error);
    throw error;
  }
}

export async function getVotesByChatId({ id }: { id: string }) {
  try {
    return await db.select().from(vote).where(eq(vote.chatId, id));
  } catch (error) {
    console.error('Failed to get votes by chat id from database', error);
    throw error;
  }
}

export async function saveDocument({
  id,
  title,
  kind,
  content,
  userId,
}: {
  id: string;
  title: string;
  kind: ArtifactKind;
  content: string;
  userId: string;
}) {
  try {
    return await db
      .insert(document)
      .values({
        id,
        title,
        kind,
        content,
        userId,
        createdAt: new Date(),
      })
      .returning();
  } catch (error) {
    console.error('Failed to save document in database');
    throw error;
  }
}

export async function getDocumentsById({ id }: { id: string }) {
  try {
    const documents = await db
      .select()
      .from(document)
      .where(eq(document.id, id))
      .orderBy(asc(document.createdAt));

    return documents;
  } catch (error) {
    console.error('Failed to get document by id from database');
    throw error;
  }
}

export async function getDocumentById({ id }: { id: string }) {
  try {
    const [selectedDocument] = await db
      .select()
      .from(document)
      .where(eq(document.id, id))
      .orderBy(desc(document.createdAt));

    return selectedDocument;
  } catch (error) {
    console.error('Failed to get document by id from database');
    throw error;
  }
}

export async function deleteDocumentsByIdAfterTimestamp({
  id,
  timestamp,
}: {
  id: string;
  timestamp: Date;
}) {
  try {
    await db
      .delete(suggestion)
      .where(
        and(
          eq(suggestion.documentId, id),
          gt(suggestion.documentCreatedAt, timestamp),
        ),
      );

    return await db
      .delete(document)
      .where(and(eq(document.id, id), gt(document.createdAt, timestamp)))
      .returning();
  } catch (error) {
    console.error(
      'Failed to delete documents by id after timestamp from database',
    );
    throw error;
  }
}

export async function saveSuggestions({
  suggestions,
}: {
  suggestions: Array<Suggestion>;
}) {
  try {
    return await db.insert(suggestion).values(suggestions);
  } catch (error) {
    console.error('Failed to save suggestions in database');
    throw error;
  }
}

export async function getSuggestionsByDocumentId({
  documentId,
}: {
  documentId: string;
}) {
  try {
    return await db
      .select()
      .from(suggestion)
      .where(and(eq(suggestion.documentId, documentId)));
  } catch (error) {
    console.error(
      'Failed to get suggestions by document version from database',
    );
    throw error;
  }
}

export async function getMessageById({ id }: { id: string }) {
  try {
    return await db.select().from(message).where(eq(message.id, id));
  } catch (error) {
    console.error('Failed to get message by id from database');
    throw error;
  }
}

export async function deleteMessagesByChatIdAfterTimestamp({
  chatId,
  timestamp,
}: {
  chatId: string;
  timestamp: Date;
}) {
  try {
    const messagesToDelete = await db
      .select({ id: message.id })
      .from(message)
      .where(
        and(eq(message.chatId, chatId), gte(message.createdAt, timestamp)),
      );

    const messageIds = messagesToDelete.map((message) => message.id);

    if (messageIds.length > 0) {
      await db
        .delete(vote)
        .where(
          and(eq(vote.chatId, chatId), inArray(vote.messageId, messageIds)),
        );

      return await db
        .delete(message)
        .where(
          and(eq(message.chatId, chatId), inArray(message.id, messageIds)),
        );
    }
  } catch (error) {
    console.error(
      'Failed to delete messages by id after timestamp from database',
    );
    throw error;
  }
}

export async function updateChatVisiblityById({
  chatId,
  visibility,
}: {
  chatId: string;
  visibility: 'private' | 'public';
}) {
  try {
    return await db.update(chat).set({ visibility }).where(eq(chat.id, chatId));
  } catch (error) {
    console.error('Failed to update chat visibility in database');
    throw error;
  }
}

// Domain operations
export async function getDomains() {
  try {
    return await db.select().from(domains).orderBy(asc(domains.orderPosition));
  } catch (error) {
    console.error('Failed to get domains from database');
    throw error;
  }
}

export async function getDomainById({ id }: { id: string }) {
  try {
    const [domain] = await db.select().from(domains).where(eq(domains.id, id));
    return domain;
  } catch (error) {
    console.error('Failed to get domain by id from database');
    throw error;
  }
}

export async function createDomain({
  name,
  description,
  weight,
  orderPosition,
}: {
  name: string;
  description?: string;
  weight: number;
  orderPosition: number;
}) {
  try {
    const [domain] = await db
      .insert(domains)
      .values({
        name,
        description,
        weight,
        orderPosition,
        createdAt: new Date(),
      })
      .returning();
    return domain;
  } catch (error) {
    console.error('Failed to create domain in database');
    throw error;
  }
}

export async function updateDomain({
  id,
  name,
  description,
  weight,
  orderPosition,
}: {
  id: string;
  name?: string;
  description?: string;
  weight?: number;
  orderPosition?: number;
}) {
  try {
    const [domain] = await db
      .update(domains)
      .set({
        name,
        description,
        weight,
        orderPosition,
      })
      .where(eq(domains.id, id))
      .returning();
    return domain;
  } catch (error) {
    console.error('Failed to update domain in database');
    throw error;
  }
}

export async function deleteDomain({ id }: { id: string }) {
  try {
    return await db.delete(domains).where(eq(domains.id, id)).returning();
  } catch (error) {
    console.error('Failed to delete domain from database');
    throw error;
  }
}

// Topic operations
export async function getTopics() {
  try {
    return await db.select().from(topics).orderBy(asc(topics.orderPosition));
  } catch (error) {
    console.error('Failed to get topics from database');
    throw error;
  }
}

export async function getTopicsByDomainId({ domainId }: { domainId: string }) {
  try {
    return await db
      .select()
      .from(topics)
      .where(eq(topics.domainId, domainId))
      .orderBy(asc(topics.orderPosition));
  } catch (error) {
    console.error('Failed to get topics by domain id from database');
    throw error;
  }
}

export async function getTopicById({ id }: { id: string }) {
  try {
    const [topic] = await db.select().from(topics).where(eq(topics.id, id));
    return topic;
  } catch (error) {
    console.error('Failed to get topic by id from database');
    throw error;
  }
}

export async function createTopic({
  domainId,
  name,
  description,
  orderPosition,
}: {
  domainId: string;
  name: string;
  description?: string;
  orderPosition: number;
}) {
  try {
    const [topic] = await db
      .insert(topics)
      .values({
        domainId,
        name,
        description,
        orderPosition,
        createdAt: new Date(),
      })
      .returning();
    return topic;
  } catch (error) {
    console.error('Failed to create topic in database');
    throw error;
  }
}

export async function updateTopic({
  id,
  name,
  description,
  orderPosition,
}: {
  id: string;
  name?: string;
  description?: string;
  orderPosition?: number;
}) {
  try {
    const [topic] = await db
      .update(topics)
      .set({
        name,
        description,
        orderPosition,
      })
      .where(eq(topics.id, id))
      .returning();
    return topic;
  } catch (error) {
    console.error('Failed to update topic in database');
    throw error;
  }
}

export async function deleteTopic({ id }: { id: string }) {
  try {
    return await db.delete(topics).where(eq(topics.id, id)).returning();
  } catch (error) {
    console.error('Failed to delete topic from database');
    throw error;
  }
}

// Content Items operations
export async function getContentItems() {
  try {
    return await db.select().from(contentItems).orderBy(asc(contentItems.type), asc(contentItems.orderPosition));
  } catch (error) {
    console.error('Failed to get content items from database');
    throw error;
  }
}

export async function getContentItemsByTopicId({ topicId }: { topicId: string }) {
  try {
    return await db
      .select()
      .from(contentItems)
      .where(eq(contentItems.topicId, topicId))
      .orderBy(asc(contentItems.type), asc(contentItems.orderPosition));
  } catch (error) {
    console.error('Failed to get content items by topic id from database');
    throw error;
  }
}

export async function getContentItemsByTopicIdAndType({ 
  topicId, 
  type 
}: { 
  topicId: string;
  type: 'concept' | 'aws_service' | 'framework' | 'algorithm';
}) {
  try {
    return await db
      .select()
      .from(contentItems)
      .where(
        and(
          eq(contentItems.topicId, topicId),
          eq(contentItems.type, type)
        )
      )
      .orderBy(asc(contentItems.orderPosition));
  } catch (error) {
    console.error('Failed to get content items by topic id and type from database');
    throw error;
  }
}

export async function createContentItem({
  topicId,
  type,
  name,
  content,
  orderPosition,
}: {
  topicId: string;
  type: 'concept' | 'aws_service' | 'framework' | 'algorithm';
  name: string;
  content: string;
  orderPosition: number;
}) {
  try {
    const [contentItem] = await db
      .insert(contentItems)
      .values({
        topicId,
        type,
        name,
        content,
        orderPosition,
        createdAt: new Date(),
      })
      .returning();
    return contentItem;
  } catch (error) {
    console.error('Failed to create content item in database');
    throw error;
  }
}

export async function updateContentItem({
  id,
  name,
  content,
  orderPosition,
}: {
  id: string;
  name?: string;
  content?: string;
  orderPosition?: number;
}) {
  try {
    const [contentItem] = await db
      .update(contentItems)
      .set({
        name,
        content,
        orderPosition,
      })
      .where(eq(contentItems.id, id))
      .returning();
    return contentItem;
  } catch (error) {
    console.error('Failed to update content item in database');
    throw error;
  }
}

export async function deleteContentItem({ id }: { id: string }) {
  try {
    return await db.delete(contentItems).where(eq(contentItems.id, id)).returning();
  } catch (error) {
    console.error('Failed to delete content item from database');
    throw error;
  }
}

// User Content Progress operations
export async function getUserContentProgress({
  userId,
  contentItemId,
}: {
  userId: string;
  contentItemId: string;
}) {
  try {
    const [progress] = await db
      .select()
      .from(userContentProgress)
      .where(
        and(
          eq(userContentProgress.userId, userId),
          eq(userContentProgress.contentItemId, contentItemId)
        )
      );
    return progress;
  } catch (error) {
    console.error('Failed to get user content progress from database');
    throw error;
  }
}

export async function getUserContentProgressByTopicId({
  userId,
  topicId,
}: {
  userId: string;
  topicId: string;
}) {
  try {
    // Get all content items for this topic
    const topicContentItems = await getContentItemsByTopicId({ topicId });
    const contentItemIds = topicContentItems.map(item => item.id);

    if (contentItemIds.length === 0) return [];

    // Get progress for these content items
    return await db
      .select()
      .from(userContentProgress)
      .where(
        and(
          eq(userContentProgress.userId, userId),
          inArray(userContentProgress.contentItemId, contentItemIds)
        )
      );
  } catch (error) {
    console.error('Failed to get user content progress by topic id from database');
    throw error;
  }
}

// Optimized query to get all user learning data at once
export async function getUserLearningData({ userId }: { userId: string }) {
  try {
    // Get all domains ordered by position
    const allDomains = await getDomains();
    
    // For each domain, get topics and content items in parallel
    const domainsWithData = await Promise.all(
      allDomains.map(async (domain) => {
        const domainTopics = await getTopicsByDomainId({ domainId: domain.id });
        
        // For each topic, get content items and user progress
        const topicsWithItems = await Promise.all(
          domainTopics.map(async (topic) => {
            // Get all content items for this topic
            const topicContentItems = await getContentItemsByTopicId({ topicId: topic.id });
            
            // Get all user progress for content items in this topic
            const contentItemIds = topicContentItems.map(item => item.id);
            let progressEntries: UserContentProgress[] = [];
            
            if (contentItemIds.length > 0) {
              progressEntries = await db
                .select()
                .from(userContentProgress)
                .where(
                  and(
                    eq(userContentProgress.userId, userId),
                    inArray(userContentProgress.contentItemId, contentItemIds)
                  )
                );
            }
            
            // Attach progress to each content item
            const itemsWithProgress = topicContentItems.map(item => {
              const progress = progressEntries.find(p => p.contentItemId === item.id);
              return {
                ...item,
                progress: progress || null
              };
            });
            
            // Group content items by type
            const groupedItems = itemsWithProgress.reduce((groups, item) => {
              const type = item.type;
              if (!groups[type]) {
                groups[type] = [];
              }
              groups[type].push(item);
              return groups;
            }, {} as Record<string, any[]>);
            
            // Calculate topic progress
            const completedItems = progressEntries.filter(p => p.isCompleted).length;
            const totalItems = topicContentItems.length;
            const progressPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
            
            return {
              ...topic,
              content_items: groupedItems,
              progress: {
                completed: completedItems,
                total: totalItems,
                percentage: progressPercentage
              }
            };
          })
        );
        
        // Calculate domain progress
        const domainCompletedItems = topicsWithItems.reduce(
          (sum, topic) => sum + topic.progress.completed, 0
        );
        const domainTotalItems = topicsWithItems.reduce(
          (sum, topic) => sum + topic.progress.total, 0
        );
        const domainProgressPercentage = 
          domainTotalItems > 0 ? (domainCompletedItems / domainTotalItems) * 100 : 0;
        
        return {
          ...domain,
          topics: topicsWithItems,
          progress: {
            completed: domainCompletedItems,
            total: domainTotalItems,
            percentage: domainProgressPercentage
          }
        };
      })
    );
    
    return domainsWithData;
  } catch (error) {
    console.error('Failed to get user learning data from database');
    throw error;
  }
}

export async function updateUserContentProgress({
  userId,
  contentItemId,
  isCompleted,
  notes,
  videos,
}: {
  userId: string;
  contentItemId: string;
  isCompleted?: boolean;
  notes?: any;
  videos?: any;
}) {
  try {
    const existingProgress = await getUserContentProgress({ userId, contentItemId });
    
    if (existingProgress) {
      // Update existing progress
      const [updated] = await db
        .update(userContentProgress)
        .set({
          isCompleted: isCompleted ?? existingProgress.isCompleted,
          notes: notes !== undefined ? notes : existingProgress.notes,
          videos: videos !== undefined ? videos : existingProgress.videos,
          lastUpdated: new Date(),
        })
        .where(
          and(
            eq(userContentProgress.userId, userId),
            eq(userContentProgress.contentItemId, contentItemId)
          )
        )
        .returning();
      return updated;
    } else {
      // Create new progress entry
      const [created] = await db
        .insert(userContentProgress)
        .values({
          userId,
          contentItemId,
          isCompleted: isCompleted ?? false,
          notes,
          videos,
          lastUpdated: new Date(),
        })
        .returning();
      return created;
    }
  } catch (error) {
    console.error('Failed to update user content progress in database');
    throw error;
  }
}
