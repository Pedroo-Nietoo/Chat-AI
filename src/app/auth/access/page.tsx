"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Github, Loader2 } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { set, useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export default function AccessPage() {
  const [loadingRegister, setLoadingRegister] = useState(false);
  const [passwordType, setPasswordType] = useState<"password" | "text">("password");
  const { toast } = useToast();
  const router = useRouter();

  // const form = useForm<z.infer<typeof FormSchema>>({
  //   resolver: zodResolver(FormSchema),
  //   defaultValues: {
  //     firstName: "",
  //     lastName: "",
  //     email: "",
  //     password: "",
  //   },
  // });

  // async function onSubmit(data: z.infer<typeof FormSchema>) {
  //   toast({
  //     title: "Account created successfully!",
  //     description: "Redirecting to AI chat...",
  //   });

  //   setTimeout(() => {
  //     router.push("/chat");
  //   }, 2000);
  // }

  async function handleGitHubLogin() {
    setLoadingRegister(true);
    try {
      await signIn("github", { callbackUrl: "/chat" });
    } catch(error) {
      console.error(error);
    } finally {
      setLoadingRegister(false);
    }
  }

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>Create an account to access the AI</CardDescription>
      </CardHeader>

      <CardContent>
        {/* <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="johndoe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input type={passwordType} placeholder="Password" className="pr-10" {...field} />
                    </FormControl>
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => setPasswordType(passwordType === "password" ? "text" : "password")}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                    >
                      {passwordType === "password" ? <Eye className="h-5 text-gray-800"/> : <EyeOff className="h-5 text-gray-800"/>}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">Create Account</Button>

            <div className="flex items-center justify-center space-x-4 w-full">
              <Separator className="w-36" />
              <span className="text-center text-sm text-slate-600">OR</span>
              <Separator className="w-36" />
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGitHubLogin}
              disabled={loadingRegister}
            >
              {loadingRegister ? (
              <Loader2 className="animate-spin h-4 mr-2" />
              ) : (
              <Github className="h-4 mr-2" />
              )}
              {loadingRegister ? "Loading..." : "Access with GitHub"}
            </Button>
          </form>
        </Form> */}

        <span className="text-slate-500 text-[14px]">This application is for study purposes only and is Open-Source. All the code can be found on GitHub.</span>

        <Button
          type="button"
          variant="outline"
          className="w-full mt-8"
          onClick={handleGitHubLogin}
          disabled={loadingRegister}
        >
          {loadingRegister ? (
          <Loader2 className="animate-spin h-4 mr-2" />
          ) : (
          <Github className="h-4 mr-2" />
          )}
          {loadingRegister ? "Loading..." : "Access with GitHub"}
        </Button>
      </CardContent>
    </Card>
  );
}