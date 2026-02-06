import { useAuthStore } from '@/stores/useAuthStore';
import type { Conversation } from '@/types/chat';
import { ImagePlus, Send } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import EmojiPicker from './emojiPicker';
import { useChatStore } from '@/stores/useChatStore';
import { toast } from 'sonner';

export default function ChatWindowFooter({
    selectedConvo,
}: {
    selectedConvo: Conversation;
}) {
    const { user } = useAuthStore();
    const { sendDirectMessage, sendGroupMessage } = useChatStore();
    const [value, setValue] = useState('');
    const fileRef = useRef<HTMLInputElement | null>(null);
    if (!user) return;
    const handleSendMessage = async () => {
        if (!value.trim()) return;
        try {
            if (selectedConvo.type === 'direct') {
                const paticipants = selectedConvo.participants;
                const otherUser = paticipants.filter((p) => p._id !== user._id);
                await sendDirectMessage(otherUser[0]._id, value);
            } else {
                await sendGroupMessage(selectedConvo._id, value);
            }
        } catch (err) {
            console.error('Lỗi handleSendMessage', err);
            toast.error('Lỗi xảy ra khi gửi tin nhắn');
        } finally {
            setValue('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSendMessage();
        }
    };
    const handleSelectImage =async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (selectedConvo.type === 'direct') {
            const paticipants = selectedConvo.participants;
            const otherUser = paticipants.filter((p) => p._id !== user._id);
            await sendDirectMessage(otherUser[0]._id, value,file);
        } else {
            await sendGroupMessage(selectedConvo._id, value,file);
        }
    };
    return (
        <div className='flex gap-2 items-center p-3 min-h-14 bg-background'>
            <input
                type='file'
                accept='image/*'
                hidden
                ref={fileRef}
                onChange={handleSelectImage}
            />
            <Button
                variant='ghost'
                size='icon'
                className='hover:bg-primary/10 transition-smooth'
                onClick={() => fileRef?.current?.click()}
            >
                <ImagePlus className='size-5' />
            </Button>
            <div className='flex-1 relative'>
                <Input
                    onKeyDown={handleKeyDown}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder='Soạn tin nhắn ...'
                    className='pr-20 h-9 border-border/50 focus:border-primary/50 transition-smooth resize-none'
                />
                <div className='absolute right-2 top-1/2 -translate-y-1/2 transform flex items-center gap-1'>
                    <Button
                        asChild
                        variant='ghost'
                        size='icon'
                        className='size-8 hover:primary10 transition-smooth'
                    >
                        <div>
                            <EmojiPicker
                                onChange={(emoji: string) =>
                                    setValue(`${value}${emoji}`)
                                }
                            />
                        </div>
                    </Button>
                </div>
            </div>
            <Button
                className='bg-gradient-chat hover:shadow-glow transition-smooth hover:scale-105'
                disabled={!value.trim()}
                onClick={handleSendMessage}
            >
                <Send className='size-4 text-white' />
            </Button>
        </div>
    );
}
