import { Dialog } from '@radix-ui/react-dialog';
import { UserPlus } from 'lucide-react';
import { useState } from 'react';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, } from '../ui/dialog';
import type { User } from '@/types/user';
import { useFriendStore } from '@/stores/useFriendStore';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import SearchFriend from '../addFriendModal/searchFriend';
import SendFriendRequest from '../addFriendModal/sendFriendRequest';
export interface IFormValues {
    username: string;
    message?: string;
}
export default function AddFriendModal() {
    const [isFound, setIsFound] = useState<boolean | null>(null);
    const [searchUser, setSearchUser] = useState<User>();
    const [searchedUsername, setSearchedUsername] = useState('');
    const { loading, searchByUsername, addFriend } = useFriendStore();
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<IFormValues>({
        defaultValues: { username: '', message: '' },
    });
    const usernameValue = watch('username');
    const handleSearch = handleSubmit(async (data) => {
        const username = data.username.trim();
        if (!username) return;
        setIsFound(null);
        setSearchedUsername(username);
        try {
            const foundUser = await searchByUsername(username);
            if (foundUser) {
                setSearchUser(foundUser);
                setIsFound(true);
            } else {
                setIsFound(false);
            }
        } catch (err) {
            console.log('Lỗi khi tìm kiếm user: ', err);
            setIsFound(false);
        }
    });
    const handleSend = handleSubmit(async (data) => {
        if (!searchUser) return;
        try {
            const {code, message} = await addFriend(searchUser._id, data.message?.trim());
            if(code === 200){
                toast.success("Gửi yêu cầu kết bạn thành công");
            }else{
                toast.error(message);
            }
            handleCancel();
        } catch (err) {
            console.log('Lỗi khi gửi lời mời kết bạn: ', err);
            toast.error('Lỗi khi gửi lời mời kết bạn');
        }
    });
    const handleCancel = () => {
        reset();
        setIsFound(null);
        setSearchedUsername('');
    };
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className='flex items-center justify-center size-5 rounded-full hover:bg-sidebar-accent cursor-pointer z-10'>
                    <UserPlus className='size-4 ' />
                    <span className='sr-only'>Kết bạn</span>
                </div>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[425px] border-none'>
                <DialogHeader>
                    <DialogTitle>Thêm bạn</DialogTitle>
                    <DialogDescription>
                        Tìm kiếm và gửi lời mời kết bạn đến người dùng khác
                    </DialogDescription>
                </DialogHeader>
                {!isFound && (
                    <>
                        <SearchFriend
                            register={register}
                            errors={errors}
                            loading={loading}
                            usernameValue={usernameValue}
                            isFound={isFound}
                            searchedUsername={searchedUsername}
                            onSubmit={handleSearch}
                            onCance={handleCancel}
                        />
                    </>
                )}
                {isFound && (
                    <>
                        <SendFriendRequest
                            register={register}
                            loading={loading}
                            searchedUsername={searchedUsername}
                            onSubmit={handleSend}
                            onBack={handleCancel}
                        />
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
