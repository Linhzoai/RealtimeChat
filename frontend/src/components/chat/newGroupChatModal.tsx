import { useFriendStore } from '@/stores/useFriendStore';
import { Dialog, DialogTrigger } from '@radix-ui/react-dialog';
import { Loader2, Users, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { DialogContent, DialogFooter, DialogHeader, DialogTitle, } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import type { Friend } from '@/types/user';
import SearchSuggestionList from '../newGroupChat/searchSuggestionList';
import SelectedUserList from '../newGroupChat/selectedUserList';
import { toast } from 'sonner';
import { useChatStore } from '@/stores/useChatStore';

export default function NewGroupChatModal() {
    const [groupName, setGroupName] = useState<string>('');
    const [search, setSearch] = useState<string>('');
    const [selectedUsers, setSelectedUsers] = useState<Array<Friend>>([]);
    const { friendList, getFriendList } = useFriendStore();
    const { loading, createConversation } = useChatStore();
    const [open, setOpen] = useState(false);
    const handleGetFriend = async () => {
        await getFriendList();
    };
    const handleSubmit = async (e: React.FormEvent) => {
        try {
            e.preventDefault();
            if (selectedUsers.length < 2) {
                return toast.error(
                    'Để tạo nhóm chat cần mời tối thiểu 2 thành viên'
                );
            }
            if (groupName.trim() === '') {
                return toast.error('Tên nhóm không được để trống');
            }
            await createConversation(
                'group',
                groupName,
                selectedUsers.map((f) => f._id.toString())
            );
            toast.success('Tạo nhóm chat thành công');
            setGroupName('');
            setSelectedUsers([]);
            setSearch('');
            setOpen(false);
        } catch (err) {
            console.log('Lỗi khi tạo nhóm chat', err);
        }
    };
    const filteredFriends = friendList.filter(
        (f) =>
            f.displayName.toLowerCase().includes(search.toLowerCase()) &&
            !selectedUsers.some((u) => u._id === f._id)
    );
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant='ghost'
                    onClick={handleGetFriend}
                    className='flex z-10 justify-center items-center size-5 rounded-full  hover:bg-sidebar-accent transition cursor-pointer'
                >
                    <Users className='size-4' />
                    <span className='sr-only'>Tạo nhóm chat</span>
                </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[425px] border-none' aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle className='capitalize '>
                        Tạo nhóm chát mới
                    </DialogTitle>
                </DialogHeader>

                {/* Nhập tên nhóm */}
                <form className='space-y-4 ' onSubmit={handleSubmit}>
                    <div className='space-y-2'>
                        <Label
                            htmlFor='groupName'
                            className='text-sm font-semibold'
                        >
                            Tên nhóm
                        </Label>
                        <Input
                            required
                            id='groupName'
                            placeholder='Nhập tên nhóm'
                            className='glass border-border/50 focus:border-primary/50 transition-smooth'
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                        />
                    </div>
                

                {/* Tìm kiếm bạn bè */}
                <div className='space-y-2 '>
                    <Label htmlFor='search' className='text-sm font-semibold'>
                        Mời thành viên
                    </Label>
                    <Input
                        id='search'
                        placeholder='Tìm theo tên hiển thị'
                        className='glass border-border/50 focus:border-primary/50 transition-smooth'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* Danh sách gọi ý tìm kiếm theo từ khóa */}
                {search !== '' && filteredFriends.length > 0 && (
                    <SearchSuggestionList
                        filteredFriends={filteredFriends}
                        onSelect={(friend) => {
                            setSelectedUsers((prev) => [...prev, friend]);
                            setSearch('');
                        }}
                    />
                )}

                {/* Danh sách user người dùng đã chọn để thêm vào nhóm */}
                <SelectedUserList
                    selectedUsers={selectedUsers}
                    onRemove={(friend) => {
                        setSelectedUsers((prev) =>
                            prev.filter((f) => f._id !== friend._id)
                        );
                    }}
                />

                <DialogFooter>
                    <Button
                        type='submit'
                        disabled={loading}
                        className='flex-1 bg-gradient-chat text-white hover:opacity-90 transition-smooth'
                    >
                        {loading ? (
                            <>
                                Đang tạo nhóm ...{' '}
                                <Loader2 className='size-4 animate-spin' />
                            </>
                        ) : (
                            <>
                                <UserPlus className='size-4' />
                                Tạo nhóm
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </form>
            </DialogContent>
        </Dialog>
    );
}
