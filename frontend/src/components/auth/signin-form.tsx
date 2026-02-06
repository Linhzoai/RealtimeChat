import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/stores/useAuthStore';
import { useNavigate } from 'react-router';
const signInSchema = z.object({
    username: z.string().min(1,'username không đươc để trống'),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

type FormSignIn = z.infer<typeof signInSchema>;

export function SignInForm({
    className,
    ...props
}: React.ComponentProps<'div'>) {
    // React Hook phải được gọi BÊN TRONG component
    const navigate = useNavigate();
    const { signIn } = useAuthStore();
    
    const onSubmit = async (data: FormSignIn) => {
        await signIn(data.username, data.password).then(() => navigate('/'));
    };
    const { register, handleSubmit, formState: { errors, isSubmitting }, } = useForm<FormSignIn>({ resolver: zodResolver(signInSchema), });
    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card className='overflow-hidden p-0 shadow-xl'>
                <CardContent className='grid p-0 md:grid-cols-2'>
                    {/* Left Column - Form */}
                    <form
                        className='p-8 md:p-12 flex flex-col justify-center bg-white'
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <FieldGroup className=''>
                            {/* Logo and Header */}
                            <div className='flex flex-col items-center gap-3 text-center mb-2'>
                                <img
                                    src='/logo.svg'
                                    alt='Moji Logo'
                                    className='h-16 w-16'
                                />
                                <div>
                                    <h1 className='text-2xl font-bold text-gray-900'>
                                        Chào mừng quay lại Moji
                                    </h1>
                                    <p className='text-sm text-gray-500 mt-1'>
                                        Hãy đăng nhập để bắt đầu!
                                    </p>
                                </div>
                            </div>

                            {/* username */}
                            <Field>
                                <FieldLabel htmlFor='username'>Username</FieldLabel>
                                <Input
                                    id='username'
                                    type='text'
                                    placeholder='username'
                                    className='bg-gray-50'
                                    autoComplete='username'
                                    {...register('username')}
                                />
                                <p className='text-red-500 text-xs mt-1'>
                                    {errors.username?.message}
                                </p>
                            </Field>

                            {/* Password */}
                            <Field>
                                <FieldLabel htmlFor='password'>
                                    Mật khẩu
                                </FieldLabel>
                                <Input
                                    id='password'
                                    type='password'
                                    placeholder=''
                                    className='bg-gray-50'
                                    autoComplete="current-password"
                                    {...register('password')}
                                />
                                <p className='text-red-500 text-xs mt-1'>
                                    {errors.password?.message}
                                </p>
                            </Field>

                            {/* Submit Button */}
                            <Button
                                type='submit'
                                className='w-full bg-linear-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl'
                                disabled={isSubmitting}
                            >
                                Đăng nhập
                            </Button>

                            {/* Sign In Link */}
                            <p className='text-center text-sm text-gray-600'>
                                Đã có tài khoản?{' '}
                                <Link
                                    to='/sign-up'
                                    className='text-purple-600 hover:text-purple-700 font-medium hover:underline'
                                >
                                    Đăng ký
                                </Link>
                            </p>
                        </FieldGroup>
                    </form>

                    {/* Right Column - Illustration */}
                    <div className='bg-linear-to-br from-purple-50 via-pink-50 to-purple-100 relative hidden md:flex items-center justify-center p-12'>
                        <img
                            src='/placeholder.png'
                            alt='Sign Up Illustration'
                            className='w-full h-full object-contain max-w-md'
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
