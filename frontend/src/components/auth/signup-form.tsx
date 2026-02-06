import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/stores/useAuthStore";

const signUpSchema = z.object({
  firstName: z.string().min(1, "Họ không được để trống"),
  lastName: z.string().min(1, "Tên không được để trống"),
  username: z.string().min(3, "user name phải có ít nhất 3 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  phoneNumber: z.string().min(10, "Số điện thoại phải có ít nhất 10 ký tự"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

type FormSignUp = z.infer<typeof signUpSchema>;

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  // React Hook phải được gọi BÊN TRONG component
  const { signUp } = useAuthStore();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormSignUp>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: FormSignUp) => {
    const { username, password, email, firstName, lastName, phoneNumber } =
      data;
    try {
      await signUp(username, password, email, firstName, lastName, phoneNumber);
      navigate("/sign-in");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 shadow-xl">
        <CardContent className="grid p-0 md:grid-cols-2">
          {/* Left Column - Form */}
          <form
            className="p-8 md:p-12 flex flex-col justify-center bg-white"
            onSubmit={handleSubmit(onSubmit)}
          >
            <FieldGroup className="">
              {/* Logo and Header */}
              <div className="flex flex-col items-center gap-3 text-center mb-2">
                <img src="/logo.svg" alt="Moji Logo" className="h-16 w-16" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Tạo tài khoản Moji
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Chào mừng bạn! Hãy đăng ký để bắt đầu!
                  </p>
                </div>
              </div>

              {/* First Name and Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="firstName">Họ</FieldLabel>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder=""
                    className="bg-gray-50"
                    {...register("firstName")}
                  />
                  <p className="text-red-500 text-xs mt-1">
                    {errors.firstName?.message}
                  </p>
                </Field>
                <Field>
                  <FieldLabel htmlFor="lastName">Tên</FieldLabel>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder=""
                    className="bg-gray-50"
                    {...register("lastName")}
                  />
                  <p className="text-red-500 text-xs mt-1">
                    {errors.lastName?.message}
                  </p>
                </Field>
              </div>

              {/* Username */}
              <Field>
                <FieldLabel htmlFor="username">Tên đăng nhập</FieldLabel>
                <Input
                  id="username"
                  type="text"
                  placeholder="moji"
                  className="bg-gray-50"
                  {...register("username")}
                />
                <p className="text-red-500 text-xs mt-1">
                  {errors.username?.message}
                </p>
              </Field>

              {/* Email và phoneNumber*/}
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    autoComplete="email"
                    type="email"
                    placeholder="mj@example.com"
                    className="bg-gray-50"
                    {...register("email")}
                  />
                  <p className="text-red-500 text-xs mt-1">
                    {" "}
                    {errors.email?.message}{" "}
                  </p>
                </Field>
                <Field>
                  <FieldLabel htmlFor="phoneNumber">Số điện thoại</FieldLabel>
                  <Input
                    id="phoneNumber"
                    type="text"
                    placeholder="0123456789"
                    className="bg-gray-50"
                    {...register("phoneNumber")}
                  />
                  <p className="text-red-500 text-xs mt-1">
                    {" "}
                    {errors.phoneNumber?.message}{" "}
                  </p>
                </Field>
              </div>

              {/* Password */}
              <Field>
                <FieldLabel htmlFor="password">Mật khẩu</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder=""
                  className="bg-gray-50"
                  autoComplete="new-password"
                  {...register("password")}
                />
                <p className="text-red-500 text-xs mt-1">
                  {errors.password?.message}
                </p>
              </Field>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-linear-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
                disabled={isSubmitting}
              >
                Tạo tài khoản
              </Button>

              {/* Sign In Link */}
              <p className="text-center text-sm text-gray-600">
                Đã có tài khoản?{" "}
                <Link
                  to="/sign-in"
                  className="text-purple-600 hover:text-purple-700 font-medium hover:underline"
                >
                  Đăng nhập
                </Link>
              </p>
            </FieldGroup>
          </form>

          {/* Right Column - Illustration */}
          <div className="bg-linear-to-br from-purple-50 via-pink-50 to-purple-100 relative hidden md:flex items-center justify-center p-12">
            <img
              src="/placeholderSignUp.png"
              alt="Sign Up Illustration"
              className="w-full h-full object-contain max-w-md"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
