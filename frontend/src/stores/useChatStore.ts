import { chatService } from "@/services/chatService";
import type { ChatState } from "@/types/store";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "./useAuthStore";
import type { Conversation } from "@/types/chat";
import { useSocketStore } from "./useSocketStore";

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      messages: {},
      convoLoading: false,
      messageLoading: false,
      activeConversationId: null,
      loading: false,
      setActiveConversation: (id) => set({ activeConversationId: id }),
      reset: () =>
        set({
          conversations: [],
          messages: {},
          convoLoading: false,
          activeConversationId: null,
          messageLoading: false,
        }),
      fetchConversation: async () => {
        try {
          set({ convoLoading: true });
          const { conversations } = await chatService.fetchConversation();
          set({ conversations, convoLoading: false });
        } catch (err) {
          console.log("Lỗi khi gọi fetchConversation: ", err);
          set({ convoLoading: false });
        }
      },
      fetchMessages: async (conversationId) => {
        const { activeConversationId, messages } = get();
        const { user } = useAuthStore.getState();
        const convoId = conversationId ?? activeConversationId;
        if (!convoId) return;
        const current = messages?.[convoId];
        const nextCursor =
          current?.nextCursor === undefined ? "" : current?.nextCursor;
        if (nextCursor === null) return;
        set({ messageLoading: true });
        try {
          const { messages: fetched, cursor } = await chatService.fetchMessages(
            convoId,
            nextCursor,
          );
          const processed = fetched.map((m) => ({
            ...m,
            isOwn: m.senderId === user?._id,
          }));
          set((state) => {
            const pre = state.messages[convoId]?.items ?? [];
            const merged = pre.length > 0 ? [...processed, ...pre] : processed;
            return {
              messages: {
                ...state.messages,
                [convoId]: {
                  items: merged,
                  hasMore: !!cursor,
                  nextCursor: cursor ?? undefined,
                },
              },
            };
          });
        } catch (err) {
          console.error("Lôi xảy ra khi fetchMessages", err);
        } finally {
          set({ messageLoading: false });
        }
      },
      sendDirectMessage: async (recipientId, content,file, imgUrl) => {
        try {
          const { activeConversationId } = get();
          await chatService.sendDirectMessage(
            recipientId,
            content,
            file,
            activeConversationId || undefined,
            imgUrl,
          );
          set((state) => ({
            conversations: state.conversations.map((c) =>
              c._id === activeConversationId ? { ...c, seenBy: [] } : c,
            ),
          }));
        } catch (err) {
          console.error("Lỗi khi gửi tin nhắn direct: ", err);
        }
      },
      sendGroupMessage: async (conversationId, content,file,imgUrl) => {
        try {
          const { activeConversationId } = get();
          if (!conversationId || !content) {
            console.log("Thiếu thông tin trước khi gửi dữ liệu");
            return;
          }
          await chatService.sendGroupMessage(conversationId, content, file,imgUrl);
          set((state) => ({
            conversations: state.conversations.map((c) =>
              c._id === activeConversationId ? { ...c, seenBy: [] } : c,
            ),
          }));
        } catch (err) {
          console.error("Lỗi khi gửi tin nhắn group: ", err);
        }
      },
      addMessage: async (message) => {
        try {
          const { user } = useAuthStore.getState();
          const { fetchMessages } = get();
          message.isOwn = message.senderId === user?._id;
          const convoId = message.conversationId;
          let preItems = get().messages[convoId]?.items || [];
          if (preItems.length === 0) {
            await fetchMessages(message.conversationId);
            preItems = get().messages[convoId]?.items || [];
          }
          set((state) => {
            if (preItems.some((m) => m._id === message._id)) return state;
            return {
              messages: {
                ...state.messages,
                [convoId]: {
                  items: [...preItems, message],
                  hasMore: state.messages[convoId].hasMore,
                  nextCursor: state.messages[convoId].nextCursor ?? undefined,
                },
              },
            };
          });
        } catch (err) {
          console.log("Lỗi khi add messages", err);
        }
      },
      updateConversation: (conversation) => {
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c._id === conversation._id ? { ...c, ...conversation } : c,
          ),
        }));
      },
      markAsSeen: async () => {
        try {
          const { user } = useAuthStore.getState();
          const { activeConversationId, conversations } = get();
          if (!user || !activeConversationId) return;
          const convo = conversations.find(
            (c) => c._id === activeConversationId,
          );
          if (!convo) return;
          if ((convo.unreadCount[user._id] ?? 0) === 0) return;
          await chatService.markAsSeen(activeConversationId);
          set((state) => ({
            conversations: state.conversations.map((c) =>
              c._id === activeConversationId
                ? {
                    ...c,
                    unreadCount: {
                      ...(c.unreadCount || {}),
                      [user._id]: 0,
                    },
                  }
                : c,
            ),
          }));
        } catch (err) {
          console.log("Lỗi xảy ra khi gọi mark as seen trong store: ", err);
        }
      },
      addConvo: (convo: Conversation)=>{
        set((state)=>{
          const exist = state.conversations.some((c)=> c._id.toString()===convo._id.toString());
          return{
            conversations: exist ? state.conversations : [convo, ...state.conversations],
          } 
        })
        
      },
      createConversation: async(type, name, memberIds)=>{
        try{
          set({loading: true});
          const conversation = await chatService.createConversation(type, name, memberIds);
          get().addConvo(conversation);
          set({activeConversationId: conversation._id});
          get().fetchMessages(conversation._id.toString());
          useSocketStore.getState().socket?.emit("join-conversation", conversation._id);
        }
        catch(err){
          console.log("Lỗi xảy ra khi tạo cuộc trò chuyện: ", err);
        }
        finally{
          set({loading: false});
        }
      },
    }),
    {
      name: "chat-storage",
      partialize: (state) => ({ conversations: state.conversations }),
    },
  ),
);
