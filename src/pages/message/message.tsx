import PageLayout from "@/components/layout/PageLayout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type {
  ChatMessage,
  Conversation,
  ConversationSearchResult,
} from "@/types/domain/message";
import { ArrowUp, ChevronLeft, ChevronRight, Ellipsis, FileText, Heart, Image, Pin, PinOff, Reply, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import MessageDeleteDialog from "./MessageDeleteDialog";

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const MAX_IMAGE_ATTACHMENTS = 10;

const getMessageImageUrls = (message: ChatMessage): string[] => {
  if (message.imageUrls && message.imageUrls.length > 0) {
    return message.imageUrls;
  }

  if (message.imageUrl) {
    return [message.imageUrl];
  }

  return [];
};

const getDiscordTileClasses = (total: number, index: number): string => {
  if (total === 1) {
    return "col-span-6 row-span-6 aspect-[4/3]";
  }

  if (total === 2) {
    return "col-span-3 row-span-3 aspect-square";
  }

  if (total === 3) {
    return index === 0 ? "col-span-4 row-span-6 aspect-[4/5]" : "col-span-2 row-span-3 aspect-square";
  }

  if (total === 4) {
    return "col-span-3 row-span-3 aspect-square";
  }

  if (total === 5) {
    return index < 2 ? "col-span-3 row-span-3 aspect-square" : "col-span-2 row-span-3 aspect-square";
  }

  return "col-span-2 row-span-2 aspect-square";
};

const MessageImageGrid = ({
  imageUrls,
  onImageClick,
}: {
  imageUrls: string[];
  onImageClick?: (clickedIndex: number) => void;
}) => {
  const total = imageUrls.length;

  if (total === 0) {
    return null;
  }

  return (
    <div className="mb-2 grid max-w-xl grid-cols-6 gap-1 overflow-hidden rounded-xl border border-border bg-muted/20 p-1">
      {imageUrls.map((imageUrl, index) => (
        <button
          key={`${imageUrl}-${index}`}
          type="button"
          onClick={() => onImageClick?.(index)}
          className={`${getDiscordTileClasses(total, index)} overflow-hidden rounded-md`}
        >
          <img
            src={imageUrl}
            alt={`Attachment ${index + 1}`}
            className="h-full w-full object-cover transition-transform duration-200 hover:scale-[1.02]"
          />
        </button>
      ))}
    </div>
  );
};

const PendingImagePreviewGrid = ({
  imageUrls,
  onRemove,
}: {
  imageUrls: string[];
  onRemove: (index: number) => void;
}) => {
  if (imageUrls.length === 0) {
    return null;
  }

  return (
    <div className="mb-3 rounded-xl bg-muted/40 p-2">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {imageUrls.length}/{MAX_IMAGE_ATTACHMENTS} photos selected
        </p>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {imageUrls.map((imageUrl, index) => (
          <div key={`${imageUrl}-${index}`} className="relative">
            <img
              src={imageUrl}
              alt={`Pending upload ${index + 1}`}
              className="h-20 w-full rounded-lg border border-border object-cover"
            />
            <button
              type="button"
              aria-label={`Remove selected image ${index + 1}`}
              onClick={() => onRemove(index)}
              className="absolute -right-2 -top-2 rounded-full border border-border bg-background p-1 text-foreground"
            >
              <X className="size-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const getRelativeTime = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
};

const renderHighlightedText = (text: string, query: string) => {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return text;
  }

  const parts = text.split(new RegExp(`(${escapeRegExp(normalizedQuery)})`, "gi"));

  return parts.map((part, index) => {
    const isMatch = part.toLowerCase() === normalizedQuery.toLowerCase();

    if (!isMatch) {
      return <span key={`${part}-${index}`}>{part}</span>;
    }

    return (
      <mark
        key={`${part}-${index}`}
        className="rounded-sm bg-yellow-200/80 px-0.5 text-foreground"
      >
        {part}
      </mark>
    );
  });
};

const initialConversations: Conversation[] = [
  { id: 1, name: "Username", preview: "Lorem ipsum, conse...", timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000 },
  { id: 2, name: "Username", preview: "Lorem ipsum, conse...", timestamp: Date.now() - 8 * 24 * 60 * 60 * 1000 },
];

const initialConversationMessages: Record<number, ChatMessage[]> = {
  1: [
    {
      id: 1,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam neque nunc, vestibulum rutrum ornare vitae, sollicitudin non lacus. Donec eget ultrices ante.",
      date: "16 Mar 2025 21:35",
      createdAt: "16 Mar 2025",
    },
    {
      id: 2,
      text: "Aenean in sem nulla. Proin sit amet libero sit amet libero hendrerit ornare. Suspendisse sed eros at justo bibendum euismod sit amet nec tellus.",
      date: "16 Mar 2025 21:35",
      createdAt: "16 Mar 2025",
    },
    {
      id: 3,
      text: "Maecenas tincidunt nisi pharetra eros semper finibus. Aliquam mattis ipsum sem, elementum venenatis leo faucibus a.",
      date: "16 Mar 2025 21:35",
      createdAt: "17 Mar 2025",
    },
  ],
  2: [
    {
      id: 4,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eget ultrices ante. Aenean in sem nulla.",
      date: "12 Mar 2025 09:15",
      createdAt: "12 Mar 2025",
    },
  ],
};

export default function MessagePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConversationId, setSelectedConversationId] = useState(1);
  const [conversationList, setConversationList] = useState(initialConversations);
  const [composerText, setComposerText] = useState("");
  const [conversationMessages, setConversationMessages] = useState(initialConversationMessages);
  const [pendingImageUrls, setPendingImageUrls] = useState<string[]>([]);
  const [likedMessageIds, setLikedMessageIds] = useState<number[]>([]);
  const [pinnedConversationIds, setPinnedConversationIds] = useState<number[]>([]);
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMessageIdForDelete, setSelectedMessageIdForDelete] = useState<number | null>(null);
  const [lightboxState, setLightboxState] = useState<{ imageUrls: string[]; currentIndex: number } | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const composerTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const createdObjectUrlsRef = useRef<string[]>([]);

  const adjustComposerHeight = () => {
    const textarea = composerTextareaRef.current;

    if (!textarea) {
      return;
    }

    const maxHeight = 180;

    textarea.style.height = "0px";
    const nextHeight = Math.min(textarea.scrollHeight, maxHeight);
    textarea.style.height = `${nextHeight}px`;
    textarea.style.overflowY = textarea.scrollHeight > maxHeight ? "auto" : "hidden";
  };

  useEffect(() => {
    return () => {
      createdObjectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  useEffect(() => {
    adjustComposerHeight();
  }, [composerText]);

  const filteredConversations = useMemo<ConversationSearchResult[]>(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const mapped: ConversationSearchResult[] = !normalizedQuery
      ? conversationList.map((conversation) => ({
          ...conversation,
          matchedPreview: conversation.preview,
        }))
      : conversationList
          .map((conversation) => {
            const conversationChatMessages = conversationMessages[conversation.id] || [];
            const matchedMessage = [...conversationChatMessages]
              .reverse()
              .find((message) => message.text.toLowerCase().includes(normalizedQuery));

            const isNameMatched = conversation.name.toLowerCase().includes(normalizedQuery);

            if (!isNameMatched && !matchedMessage) {
              return null;
            }

            return {
              ...conversation,
              matchedPreview: matchedMessage?.text || conversation.preview,
            };
          })
          .filter((conversation): conversation is ConversationSearchResult => Boolean(conversation));

    return [...mapped].sort((a, b) => {
      const aIsPinned = pinnedConversationIds.includes(a.id);
      const bIsPinned = pinnedConversationIds.includes(b.id);
      if (aIsPinned && !bIsPinned) return -1;
      if (!aIsPinned && bIsPinned) return 1;
      return 0;
    });
  }, [conversationList, conversationMessages, searchQuery, pinnedConversationIds]);

  const selectedConversation =
    filteredConversations.find((conversation) => conversation.id === selectedConversationId) ||
    filteredConversations[0] ||
    conversationList[0] ||
    initialConversations[0];

  const messages = conversationMessages[selectedConversation.id] || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

  useEffect(() => {
    if (!lightboxState) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLightboxState(null);
        return;
      }

      if (event.key === "ArrowRight") {
        setLightboxState((previous) => {
          if (!previous) {
            return previous;
          }

          return {
            ...previous,
            currentIndex: (previous.currentIndex + 1) % previous.imageUrls.length,
          };
        });
        return;
      }

      if (event.key === "ArrowLeft") {
        setLightboxState((previous) => {
          if (!previous) {
            return previous;
          }

          return {
            ...previous,
            currentIndex:
              (previous.currentIndex - 1 + previous.imageUrls.length) % previous.imageUrls.length,
          };
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxState]);

  const handleOpenImagePicker = () => {
    imageInputRef.current?.click();
  };

  const handleImageSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);

    if (selectedFiles.length === 0) {
      return;
    }

    const validImageFiles = selectedFiles.filter((file) => file.type.startsWith("image/"));
    const availableSlots = Math.max(0, MAX_IMAGE_ATTACHMENTS - pendingImageUrls.length);

    if (availableSlots === 0 || validImageFiles.length === 0) {
      event.target.value = "";
      return;
    }

    const filesToAppend = validImageFiles.slice(0, availableSlots);
    const nextImageUrls = filesToAppend.map((file) => {
      const objectUrl = URL.createObjectURL(file);
      createdObjectUrlsRef.current.push(objectUrl);
      return objectUrl;
    });

    setPendingImageUrls((previousImageUrls) => [...previousImageUrls, ...nextImageUrls]);

    event.target.value = "";
  };

  const releaseObjectUrl = (targetUrl: string) => {
    URL.revokeObjectURL(targetUrl);
    createdObjectUrlsRef.current = createdObjectUrlsRef.current.filter((url) => url !== targetUrl);
  };

  const handleRemovePendingImage = (index: number) => {
    setPendingImageUrls((previousImageUrls) => {
      const targetUrl = previousImageUrls[index];

      if (targetUrl) {
        releaseObjectUrl(targetUrl);
      }

      return previousImageUrls.filter((_, previousIndex) => previousIndex !== index);
    });
  };

  const handleSendMessage = () => {
    const normalizedText = composerText.replace(/\r\n/g, "\n");
    const hasTypedText = normalizedText.trim().length > 0;
    const hasPendingImages = pendingImageUrls.length > 0;

    if (!hasTypedText && !hasPendingImages) {
      return;
    }

    const now = new Date();
    const createdAt = now.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const date = `${createdAt} ${now.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })}`;

    setConversationMessages((previousMessages) => {
      const currentMessages = previousMessages[selectedConversation.id] || [];

      return {
        ...previousMessages,
        [selectedConversation.id]: [
          ...currentMessages,
          {
            id: Date.now(),
            text: normalizedText,
            date,
            createdAt,
            imageUrl: pendingImageUrls[0],
            imageUrls: hasPendingImages ? pendingImageUrls : undefined,
            replyTo: replyingTo
              ? {
                  id: replyingTo.id,
                  senderName: selectedConversation.name,
                  text: replyingTo.text,
                  imageUrl: replyingTo.imageUrl,
                  imageUrls: replyingTo.imageUrls,
                }
              : undefined,
          },
        ],
      };
    });

    const recentPreview = hasTypedText
      ? normalizedText.replace(/\s+/g, " ").trim()
      : hasPendingImages
        ? pendingImageUrls.length > 1
          ? `Sent ${pendingImageUrls.length} photos`
          : "Sent a photo"
        : "";

    setConversationList((previousConversations) => {
      const selectedIndex = previousConversations.findIndex(
        (conversation) => conversation.id === selectedConversation.id,
      );

      if (selectedIndex < 0) {
        return previousConversations;
      }

      const updatedConversation = {
        ...previousConversations[selectedIndex],
        preview: recentPreview,
        timestamp: now.getTime(),
      };

      return [
        updatedConversation,
        ...previousConversations.filter((conversation) => conversation.id !== selectedConversation.id),
      ];
    });

    setComposerText("");
    setPendingImageUrls([]);
    setReplyingTo(null);

    if (composerTextareaRef.current) {
      composerTextareaRef.current.style.height = "auto";
      composerTextareaRef.current.style.overflowY = "hidden";
    }
  };

  const handleToggleMessageLike = (messageId: number) => {
    setLikedMessageIds((previousLikedMessageIds) =>
      previousLikedMessageIds.includes(messageId)
        ? previousLikedMessageIds.filter((id) => id !== messageId)
        : [...previousLikedMessageIds, messageId],
    );
  };

  const handleOpenDeleteDialog = (messageId: number) => {
    setSelectedMessageIdForDelete(messageId);
    setIsDeleteDialogOpen(true);
  };

  const handleReplyToMessage = (message: ChatMessage) => {
    setReplyingTo(message);
    composerTextareaRef.current?.focus();
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  const handleTogglePin = (conversationId: number) => {
    setPinnedConversationIds((previous) =>
      previous.includes(conversationId)
        ? previous.filter((id) => id !== conversationId)
        : [...previous, conversationId],
    );
  };

  const handleConfirmDeleteMessage = () => {
    if (selectedMessageIdForDelete === null) {
      return;
    }

    const deletedMessageId = selectedMessageIdForDelete;

    setConversationMessages((previousMessages) => {
      const currentMessages = previousMessages[selectedConversation.id] || [];

      return {
        ...previousMessages,
        [selectedConversation.id]: currentMessages.filter(
          (message) => message.id !== selectedMessageIdForDelete,
        ),
      };
    });

    setReplyingTo((previousReplyingTo) =>
      previousReplyingTo?.id === deletedMessageId ? null : previousReplyingTo,
    );

    setLikedMessageIds((previousLikedMessageIds) =>
      previousLikedMessageIds.filter((id) => id !== selectedMessageIdForDelete),
    );
    setSelectedMessageIdForDelete(null);
    setIsDeleteDialogOpen(false);
  };

  const handleOpenLightbox = (imageUrls: string[], clickedIndex: number) => {
    if (imageUrls.length === 0) {
      return;
    }

    setLightboxState({ imageUrls, currentIndex: clickedIndex });
  };

  const handleCloseLightbox = () => {
    setLightboxState(null);
  };

  const handleLightboxNext = () => {
    setLightboxState((previous) => {
      if (!previous) {
        return previous;
      }

      return {
        ...previous,
        currentIndex: (previous.currentIndex + 1) % previous.imageUrls.length,
      };
    });
  };

  const handleLightboxPrevious = () => {
    setLightboxState((previous) => {
      if (!previous) {
        return previous;
      }

      return {
        ...previous,
        currentIndex: (previous.currentIndex - 1 + previous.imageUrls.length) % previous.imageUrls.length,
      };
    });
  };

  return (
    <PageLayout>
      <div className="w-full bg-background px-6 py-6 overflow-y-auto">
        <div className="mx-auto max-w-6xl ml-4">
          <div className="mb-3 mx-[1%]">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/applymonitor">Apply</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Message</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center mt-10">
            <h1 className="text-2xl font-medium">Message</h1>
            <div className="w-full sm:max-w-72">
              <Input
                placeholder="Search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </div>
          </div>

          <section className="h-[calc(100vh-190px)] min-h-140 rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex h-full min-h-0">
              <aside className="w-[35%] min-w-75 border-r border-border">
                <div className="h-full overflow-y-auto">
                  {filteredConversations.length === 0 && (
                    <div className="px-4 py-6 text-sm text-muted-foreground">
                      No matching chats or messages.
                    </div>
                  )}
                  {filteredConversations.map((conversation) => {
                    const isSelected = conversation.id === selectedConversation.id;
                    const isPinned = pinnedConversationIds.includes(conversation.id);

                    return (
                      <div
                        key={conversation.id}
                        className={`group/conv relative border-b border-border transition-colors ${
                          isSelected
                            ? "border-l-2 border-l-primary bg-muted/40"
                            : "hover:bg-muted/20"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => setSelectedConversationId(conversation.id)}
                          className="w-full px-4 py-3 pr-10 text-left"
                        >
                          <div className="flex items-start gap-3">
                            <div className="relative shrink-0">
                              <div className="size-14 rounded-full bg-muted" />
                              {isPinned && (
                                <Pin className="absolute -right-1 -top-1 size-3.5 fill-primary text-primary" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-xl font-medium">
                                  {renderHighlightedText(conversation.name, searchQuery)}
                                </p>
                                <span className="shrink-0 text-sm text-muted-foreground">
                                  {getRelativeTime(conversation.timestamp)}
                                </span>
                              </div>
                              <p className="truncate text-base text-muted-foreground">
                                {renderHighlightedText(conversation.matchedPreview, searchQuery)}
                              </p>
                            </div>
                          </div>
                        </button>
                        <button
                          type="button"
                          aria-label={isPinned ? "Unpin conversation" : "Pin conversation"}
                          onClick={() => handleTogglePin(conversation.id)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground opacity-0 transition-opacity hover:bg-muted group-hover/conv:opacity-100"
                        >
                          {isPinned ? <PinOff className="size-4" /> : <Pin className="size-4" />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </aside>

              <div className="flex min-h-0 flex-1 flex-col">
                <div className="border-b border-border px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="size-12 rounded-full bg-muted" />
                      <h2 className="text-2xl font-medium">{selectedConversation.name}</h2>
                    </div>
                    <Button variant="ghost" size="icon" className="text-muted-foreground">
                      <Ellipsis className="size-5" />
                    </Button>
                  </div>
                </div>

                <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-4 py-4">
                  {messages.map((message, index) => {
                    const previous = messages[index - 1];
                    const showDateSeparator = !previous || previous.createdAt !== message.createdAt;
                    const isMessageLiked = likedMessageIds.includes(message.id);
                    const isQuotedMessageDeleted =
                      !!message.replyTo && !messages.some((currentMessage) => currentMessage.id === message.replyTo?.id);
                    const messageImageUrls = getMessageImageUrls(message);
                    const quotedImageCount = message.replyTo?.imageUrls?.length || (message.replyTo?.imageUrl ? 1 : 0);

                    return (
                      <div key={message.id} className="mb-5">
                        {showDateSeparator && (
                          <div className="mb-3 flex items-center gap-3 text-xs text-muted-foreground">
                            <div className="h-px flex-1 bg-border" />
                            <span>{message.createdAt}</span>
                            <div className="h-px flex-1 bg-border" />
                          </div>
                        )}

                        <div className="group/message relative flex items-start gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-muted/60">
                          {isMessageLiked && (
                            <button
                              type="button"
                              aria-label="Unlike message"
                              onClick={() => handleToggleMessageLike(message.id)}
                              className="absolute right-3 top-2 z-10 rounded-md p-1 text-red-500 transition-opacity hover:bg-muted/80 group-hover/message:opacity-0"
                            >
                              <Heart className="size-4 fill-red-500 text-red-500" />
                            </button>
                          )}
                          <div className="absolute right-2 top-0 z-10 flex -translate-y-1/2 items-center gap-1 rounded-xl border border-border bg-background p-1 opacity-0 shadow-sm transition-opacity duration-150 group-hover/message:opacity-100">
                            <button
                              type="button"
                              aria-label="Reply to message"
                              onClick={() => handleReplyToMessage(message)}
                              className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            >
                              <Reply className="size-4" />
                            </button>
                            <button
                              type="button"
                              aria-label={isMessageLiked ? "Unlike message" : "Like message"}
                              onClick={() => handleToggleMessageLike(message.id)}
                              className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            >
                              <Heart
                                className={`size-4 ${
                                  isMessageLiked
                                    ? "fill-red-500 text-red-500"
                                    : "text-muted-foreground"
                                }`}
                              />
                            </button>
                            <button
                              type="button"
                              aria-label="Delete message"
                              onClick={() => handleOpenDeleteDialog(message.id)}
                              className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            >
                              <Trash2 className="size-4" />
                            </button>
                            <button
                              type="button"
                              aria-label="More message actions"
                              disabled
                              className="cursor-not-allowed rounded-md p-1 text-muted-foreground/50"
                            >
                              <Ellipsis className="size-4" />
                            </button>
                          </div>
                          <div className="mt-1 size-10 shrink-0 rounded-full bg-muted" />
                          <div className="min-w-0 flex-1">
                            <div className="mb-1 flex items-center gap-2">
                              <p className="text-xl font-medium">{selectedConversation.name}</p>
                              <span className="text-xs text-muted-foreground">{message.date}</span>
                            </div>
                            {message.replyTo && (
                              <div className="mb-2 max-w-xl rounded-lg border-l-2 border-primary bg-muted/40 px-3 py-2">
                                <p className="mb-0.5 text-xs font-medium text-primary">
                                  {message.replyTo.senderName}
                                </p>
                                {isQuotedMessageDeleted && (
                                  <p className="text-xs text-muted-foreground italic">Message deleted</p>
                                )}
                                {!isQuotedMessageDeleted && quotedImageCount > 0 && !message.replyTo.text && (
                                  <p className="text-xs text-muted-foreground">
                                    {quotedImageCount > 1 ? `📷 ${quotedImageCount} Photos` : "📷 Photo"}
                                  </p>
                                )}
                                {!isQuotedMessageDeleted && message.replyTo.text && (
                                  <p className="line-clamp-2 text-sm text-muted-foreground">
                                    {message.replyTo.text}
                                  </p>
                                )}
                              </div>
                            )}
                            <MessageImageGrid
                              imageUrls={messageImageUrls}
                              onImageClick={(clickedIndex) => handleOpenLightbox(messageImageUrls, clickedIndex)}
                            />
                            {message.text && (
                              <p className="max-w-full whitespace-pre-wrap wrap-anywhere text-lg leading-7 text-foreground">
                                {renderHighlightedText(message.text, searchQuery)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                <div className="border-t border-border px-4 py-3">
                  <input
                    ref={imageInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageSelected}
                  />
                  <PendingImagePreviewGrid
                    imageUrls={pendingImageUrls}
                    onRemove={handleRemovePendingImage}
                  />
                  {replyingTo && (
                    <div className="mb-2 flex items-start gap-2 rounded-xl border border-primary/30 bg-primary/5 px-3 py-2">
                      <div className="min-w-0 flex-1">
                        <p className="mb-0.5 text-xs font-medium text-primary">
                          Replying to {selectedConversation.name}
                        </p>
                        {(replyingTo.imageUrls?.length || replyingTo.imageUrl) && !replyingTo.text && (
                          <p className="truncate text-xs text-muted-foreground">
                            {(replyingTo.imageUrls?.length || (replyingTo.imageUrl ? 1 : 0)) > 1
                              ? `📷 ${replyingTo.imageUrls?.length || 1} Photos`
                              : "📷 Photo"}
                          </p>
                        )}
                        {replyingTo.text && (
                          <p className="truncate text-sm text-muted-foreground">{replyingTo.text}</p>
                        )}
                      </div>
                      <button
                        type="button"
                        aria-label="Cancel reply"
                        onClick={handleCancelReply}
                        className="shrink-0 rounded-md p-1 text-muted-foreground hover:bg-muted"
                      >
                        <X className="size-3.5" />
                      </button>
                    </div>
                  )}
                  <div className="flex items-end gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground"
                      onClick={handleOpenImagePicker}
                    >
                      <Image className="size-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-muted-foreground">
                      <FileText className="size-5" />
                    </Button>
                    <div className="flex-1">
                      <textarea
                        ref={composerTextareaRef}
                        rows={1}
                        placeholder="Aa"
                        value={composerText}
                        onChange={(event) => setComposerText(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key !== "Enter" || event.shiftKey || event.nativeEvent.isComposing) {
                            return;
                          }

                          event.preventDefault();
                          handleSendMessage();
                        }}
                        className="border-input focus-visible:border-ring focus-visible:ring-ring/50 rounded-3xl border bg-transparent px-4 py-2 mb-[-1.5%] leading-6 outline-none transition-[color,box-shadow] focus-visible:ring-[3px] min-h-10 max-h-44 w-full resize-none"
                      />
                    </div>
                    <Button
                      type="button"
                      variant={composerText.trim() || pendingImageUrls.length ? "default" : "ghost"}
                      className={composerText.trim() || pendingImageUrls.length ? "gap-1 px-4" : "gap-1 text-muted-foreground"}
                      onClick={handleSendMessage}
                    >
                      <ArrowUp className="size-4" />
                      send
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      <MessageDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={(isOpen) => {
          setIsDeleteDialogOpen(isOpen);

          if (!isOpen) {
            setSelectedMessageIdForDelete(null);
          }
        }}
        onConfirmDelete={handleConfirmDeleteMessage}
      />
      {lightboxState && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/85 px-4 pb-4 pt-10"
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          onClick={handleCloseLightbox}
        >
          <button
            type="button"
            aria-label="Close image viewer"
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            onClick={handleCloseLightbox}
          >
            <X className="size-5" />
          </button>
          {lightboxState.imageUrls.length > 1 && (
            <button
              type="button"
              aria-label="Previous image"
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
              onClick={(event) => {
                event.stopPropagation();
                handleLightboxPrevious();
              }}
            >
              <ChevronLeft className="size-6" />
            </button>
          )}
          <div
            className="mt-3 flex h-[calc(100vh-7rem)] w-full max-w-6xl flex-col items-center"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative flex h-full w-full flex-col items-center">
              <div className="flex h-[76vh] w-full items-center justify-center overflow-x-auto overflow-y-hidden">
                <img
                  src={lightboxState.imageUrls[lightboxState.currentIndex]}
                  alt={`Expanded attachment ${lightboxState.currentIndex + 1}`}
                  className="h-full w-auto max-w-none rounded-lg object-contain"
                />
              </div>
              <div className="absolute bottom-20 rounded-full bg-black/45 px-3 py-1 text-sm text-white">
                {lightboxState.currentIndex + 1} / {lightboxState.imageUrls.length}
              </div>
            </div>
            {lightboxState.imageUrls.length > 1 && (
              <div className="mt-3 flex max-w-full gap-2 overflow-x-auto px-2 pb-2">
                {lightboxState.imageUrls.map((thumbnailUrl, index) => {
                  const isActive = index === lightboxState.currentIndex;

                  return (
                    <button
                      key={`${thumbnailUrl}-${index}`}
                      type="button"
                      onClick={() =>
                        setLightboxState((previous) =>
                          previous
                            ? {
                                ...previous,
                                currentIndex: index,
                              }
                            : previous,
                        )
                      }
                      className={`shrink-0 overflow-hidden rounded-md border ${
                        isActive ? "border-white" : "border-white/30"
                      }`}
                    >
                      <img
                        src={thumbnailUrl}
                        alt={`Thumbnail ${index + 1}`}
                        className="h-14 w-14 object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          {lightboxState.imageUrls.length > 1 && (
            <button
              type="button"
              aria-label="Next image"
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
              onClick={(event) => {
                event.stopPropagation();
                handleLightboxNext();
              }}
            >
              <ChevronRight className="size-6" />
            </button>
          )}
        </div>
      )}
    </PageLayout>
  );
}
