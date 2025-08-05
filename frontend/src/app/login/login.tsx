'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import TwitterSvg from './svgs/twitter';
import GithubSvg from './svgs/git';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Schema } from './schema/login';
import { zodResolver } from '@hookform/resolvers/zod';
import FormComponent from './components/formComponent';
import { Label } from '@/components/ui/label';
import axios from 'axios';
import { toast } from 'sonner';
import { useAuth } from '../../utils/Auth';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const defaultValues = {
    email: '',
    password: '',
  };

  const form = useForm<z.infer<typeof Schema>>({
    resolver: zodResolver(Schema),
    defaultValues: defaultValues,
  });

  const handleCreateAccountClick = () => {
    router.push('/registration');
  };

  const handleLogin = async (values: z.infer<typeof Schema>) => {
    try {
      const res = await login(values);

      console.log(res);

      if (res.status === 401) {
        toast.error('Incorrect Email or Password');
        return;
      }

      if (res.status === 200) {
        toast.success(`logged in as ${res.data.data.user.userName}`);
        router.push('/dashboard');
      }
    } catch (err) {
      console.log(err);
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex rounded-2xl overflow-hidden shadow-xl">
        {/* Left side - Image */}
        <div className="hidden md:block relative w-1/2 bg-gradient-to-br from-blue-500 to-indigo-700">
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center p-8">
            <div className="text-white text-center">
              <h2 className="text-4xl font-bold mb-4">Welcome Back</h2>
              <p className="text-lg opacity-90">
                Sign in to continue Messaging
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="w-full md:w-1/2 bg-white p-8 md:p-12 flex flex-col justify-center">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Sign In</h1>
            <p className="text-gray-600">
              Enter your credentials to access your account
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleLogin)}
              className="space-y-4"
            >
              {/* Email */}
              <FormComponent
                form={form}
                Label="Email"
                type="email"
                placeholder="example@email.com"
                name="email"
              />

              {/* Password */}
              <FormComponent
                form={form}
                Label="password"
                type="password"
                placeholder="*********"
                Desc="Enter Password"
                name="password"
              />

              {/* Remember me & Forgot password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Input
                    type="checkbox"
                    id="rememberme"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label
                    htmlFor="rememberme"
                    className="text-sm font-medium text-gray-700 hover:cursor-pointer"
                  >
                    Remember me
                  </Label>
                </div>
                <Button
                  variant="link"
                  className="text-blue-600 hover:text-blue-800 text-sm p-0 h-auto"
                  type="button"
                >
                  Forgot password?
                </Button>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-6 text-lg font-medium transition-all duration-300"
                >
                  Sign In
                </Button>
              </div>
            </form>
          </Form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>
              Don't have an account?{' '}
              <Button
                variant="link"
                onClick={handleCreateAccountClick}
                className="text-blue-600 hover:text-blue-800 p-0 h-auto"
              >
                Create Account
              </Button>
            </p>
          </div>

          {/* Social Login */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="flex items-center justify-center gap-2"
              >
                <GithubSvg />
                GitHub
              </Button>
              <Button
                variant="outline"
                className="flex items-center justify-center gap-2"
              >
                <TwitterSvg />
                Twitter
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
