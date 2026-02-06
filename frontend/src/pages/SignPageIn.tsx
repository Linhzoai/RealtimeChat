import {SignInForm} from '../components/auth/signin-form';

export default function SignPageIn() {
    return (
        <div className='bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10 absolute inset-0 z-0 bg-gradient-to-br from-purple-50 to-gray-100'>
            <div className='w-full max-w-sm md:max-w-4xl'>
                <SignInForm />
            </div>  
        </div>
    );
}
