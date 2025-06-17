'use client';

import { boolean, z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Schema } from './schema/registration';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { toast } from 'sonner';
import axios, { AxiosError } from 'axios';
import bcrypt from 'bcryptjs';

export default function Registration() {
  const defaultValues = {
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const form = useForm<z.infer<typeof Schema>>({
    resolver: zodResolver(Schema),
    defaultValues: defaultValues,
  });

  const passwordHash = async (passwordText: string) => {
    const saltRounds = 12;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(passwordText, salt);
    return hash;
  };

  const getUserData = async () => {
    const userData = {
      firstName: form.getValues().firstname,
      lastName: form.getValues().lastname,
      userName: form.getValues().username,
      email: form.getValues().email,
      passwordHash: await passwordHash(form.getValues().password),
    };
    return userData;
  };

  const validatePassword = (password: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$/;
    return regex.test(password);
  };

  const confirmPassword = (password: string, confirmPassword: string) => {
    if (password === confirmPassword) return true;

    return false;
  };

  const apiHandler = async () => {
    try {
      const userData = await getUserData();
      console.log('user data: ', userData);

      const res = await axios.post(
        'http://localhost:5000/user/signup',
        userData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      console.log(res);
      return res;
    } catch (err: any) {
      if (err.response.data.message === 11000) {
        toast.error('Username already exists');
      }
      // console.log('err: ', err);
    }
  };

  const submitHandler = async (values: z.infer<typeof Schema>) => {
    try {
      const password = form.getValues().password;
      const confirmedPassword = form.getValues().confirmPassword;
      if (!confirmPassword(password, confirmedPassword)) {
        toast.error('Passwords do not match');
        return;
      }

      if (!validatePassword(password)) {
        toast.error('Password is not strong');
        return;
      }
      const response = await apiHandler();
      if (response?.data.status === 'success'.toLowerCase()) {
        toast.success('Your account has been succesfully created');
      }

      // console.log('res: ', response);
    } catch (err) {
      // console.log(err);
      toast.error('An error has occured on the server');
    }
  };

  const handleSignInClick = () => {
    redirect('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex rounded-2xl overflow-hidden shadow-xl">
        {/* Left side - Image */}
        <div className="hidden md:block relative w-1/2 bg-gradient-to-br from-blue-500 to-indigo-700">
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center p-8">
            <div className="text-white text-center">
              <h2 className="text-4xl font-bold mb-4">Join Our Community</h2>
              <p className="text-lg opacity-90">
                Create your account to Start Messaging
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="w-full md:w-1/2 bg-white p-8 md:p-12 flex flex-col justify-center">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Create Account
            </h1>
            <p className="text-gray-600">Fill in your details to get started</p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(submitHandler)}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Firstname */}
                <FormField
                  control={form.control}
                  name="firstname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">
                        First Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="John"
                          className="focus-visible:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Lastname */}
                <FormField
                  control={form.control}
                  name="lastname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Last Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="Doe"
                          className="focus-visible:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Username */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Username</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="johndoe123"
                        className="focus-visible:ring-blue-500"
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-gray-500">
                      Must be 4-20 characters, letters and numbers only
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="john@example.com"
                        className="focus-visible:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="••••••••"
                        className="focus-visible:ring-blue-500"
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-gray-500">
                      At least 8 characters with 1 number and 1 special
                      character
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm Password */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="••••••••"
                        className="focus-visible:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-6 text-lg font-medium transition-all duration-300"
                >
                  Create Account
                </Button>
              </div>
            </form>
          </Form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>
              Already have an account?
              <Button
                variant="link"
                className="text-blue-600 hover:text-blue-800 p-0 h-auto"
                onClick={handleSignInClick}
              >
                Sign In
              </Button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
