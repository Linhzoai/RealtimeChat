import { useFriendStore } from '@/stores/useFriendStore';
import { Card } from '../ui/card';
import { MessageCircle } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, } from '../ui/dialog';
import FriendListModal from '../creareNewChat/FriendListModal';
import { useState } from 'react';

export default function CreateNewChat() {
    const { getFriendList } = useFriendStore();
    const [open, setOpen] = useState(false);
    const handleGetfriend = async () => {
        await getFriendList();
    };
    return (
        <div className='flex gap-2'>
            <Card
                className='flex-1 p-3 glass hover:shadow-soft transition-smooth cursor-pointer group/card'
                onClick={handleGetfriend}
            >
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <div className='flex items-center gap-4'>
                            <div className='size-4 bg-gradient-chat rounded-full flex items-center justify-center group-hover/card:scale-120 transition-bounce'>
                                <MessageCircle className='size-4' />
                            </div>
                            <span className='text-sm font-medium capitalize'>
                                Gửi tin nhắn mới
                            </span>
                        </div>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className='flex items-center gap-2 text-xl capitalize'>
                                <MessageCircle className='size-5' />
                                Gửi tin nhắn mới
                            </DialogTitle>
                        </DialogHeader>
                        <DialogDescription>
                            Chọn người bạn để gửi tin nhắn
                        </DialogDescription>
                        <FriendListModal setOpen={setOpen}/>
                    </DialogContent>
                </Dialog>
            </Card>
        </div>
    );
}
