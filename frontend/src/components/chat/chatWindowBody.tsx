import { useChatStore } from '@/stores/useChatStore';
import ChatWelcomeScreen from './chatWelcomeScreen';
import MessageItem from './messageItem';
import { useLayoutEffect, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
export default function ChatWindowBody() {
    const { activeConversationId, conversations, messages: allMessages, fetchMessages, } = useChatStore();
    const messages = allMessages[activeConversationId!].items ?? [];
    const key = `chat-scroll-${activeConversationId}`;
    const reverseMessages = [...messages].reverse();
    const selectedConvo = conversations.filter( (c) => c._id === activeConversationId );
    const seenBy = selectedConvo?.[0]?.seenBy ?? [];
    const lastMessageStatus = seenBy.length > 0 ? 'seen' : 'delivered';
    const hasMore = allMessages[activeConversationId!]?.hasMore ?? false;
    //tạo thẻ div để cuộn xuống cuối trang
    const messagesEndRef = useRef<HTMLDivElement>(null);
    useLayoutEffect(() => {
        if (!messagesEndRef.current) return;
        messagesEndRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
        });
    }, [activeConversationId, messages.length]);
    //tại save conversationId vào local storage
    const containerRef = useRef<HTMLDivElement>(null);
    const handleScrollSave = ()=>{
      const container = containerRef.current;
      if(!activeConversationId || !container) return;

      sessionStorage.setItem(key, JSON.stringify({scrollTop: container.scrollTop, scrollHeight: container.scrollHeight, clientHeight: container.clientHeight}))
    }
    const handleLoadMore = () => {
        if (!activeConversationId) return;
        try{
          fetchMessages(activeConversationId);
        }
        catch(err){
          console.log("Lỗi khi fetch thêm tin nhắn: ", err);
        }
    };
    useLayoutEffect(()=>{
      const container = containerRef.current;
      if(!activeConversationId || !container) return;
      const saved = sessionStorage.getItem(key);
      if(saved){
        const {scrollTop} = JSON.parse(saved);
        requestAnimationFrame(()=>{
          container.scrollTop = scrollTop;
          sessionStorage.removeItem(key);
        })
      }
    }, [handleLoadMore])
    if (!selectedConvo) {
        return <ChatWelcomeScreen />;
    }
    if (!messages.length) {
        return (
            <div className='flex h-full items-center justify-center'>
                Chưa có tin nhắn trong cuộc trò chuyện này
            </div>
        );
    }
    
    return (
        <div className='flex flex-col bg-primary-foreground h-full overflow-hidden'>
            <div id='scrollableDiv' onScroll={handleScrollSave} ref={containerRef} className='overflow-y-auto overflow-x-hidden beautiful-scrollbar flex flex-col-reverse'>
              <InfiniteScroll
                dataLength={messages.length}
                next={handleLoadMore}
                hasMore={hasMore}
                loader={<p>Đang tải...</p>}
                scrollableTarget='scrollableDiv'
                inverse = {true}
                style = {{display: "flex", flexDirection: "column-reverse", overflow: "visible"}}
            >
              {reverseMessages.map((m, i) => (
                    <MessageItem
                        key={m._id || i}
                        message={m}
                        index={i}
                        messages={reverseMessages}
                        selectedConvo={selectedConvo[0]}
                        lastMessageStatus={lastMessageStatus}
                    />
                ))}
            </InfiniteScroll>
            </div>
            <div ref={messagesEndRef} />

        </div>
    );
}
