'use client'

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Skeleton } from "../../components/ui/skeleton";
import { ChartArea, Info } from "lucide-react";

export default function ChatPage() {
  const { data: session, status } = useSession();
  const [messages, setMessages] = useState<{ id: string; role: string; content: string }[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null); // Estado para armazenar a mensagem de erro

  const scrollAreaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const scrollToBottom = () => {
      if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
          viewport.scrollTo({ top: viewport.scrollHeight, behavior: "smooth" });
        }
      }
    };
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: crypto.randomUUID(), role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setError(null); // Limpa o erro antes de enviar a nova mensagem

    try {
      const response = await fetch('/api/chat', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) {
        console.error("Erro na resposta do servidor:", response.statusText);
        setError("Algo deu errado ao processar sua mensagem. Tente novamente."); // Define a mensagem de erro
        return;
      }

      const data = await response.json();
      if (data?.content) {
        const assistantMessage = { id: crypto.randomUUID(), role: "assistant", content: data.content };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        console.error("Resposta inesperada do servidor:", data);
        setError("Resposta inesperada do servidor. Tente novamente."); // Define a mensagem de erro
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      setError("Erro ao enviar mensagem. Verifique sua conexão e tente novamente."); // Define a mensagem de erro
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return <Skeleton className="h-4 w-[300px]" />;
  }

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <CardTitle>Chat AI</CardTitle>
        {session?.user ? (
          <CardDescription>Welcome, {session.user.name || 'Guest'}! Ask me anything!</CardDescription>
        ) : (
          <CardDescription>Welcome, Guest! Please log in to start chatting.</CardDescription>
        )}
      </CardHeader>

      <CardContent>
        <ScrollArea ref={scrollAreaRef} className="h-[600px] w-full space-y-8 pr-4 pb-12">
          <div className="flex flex-col space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 text-slate-600 text-sm mb-4 ${message.role === "user" ? "justify-end items-center" : ""
                  }`}
              >
                {message.role === "assistant" && (
                  <Avatar>
                    <AvatarFallback>AI</AvatarFallback>
                    <AvatarImage src="https://github.com/TryForefront.png" />
                  </Avatar>
                )}
                <div className={`leading-relaxed flex flex-col ${message.role === "user" ? "text-right justify-end items-end" : ""}`}>
                  <span className="block font-bold text-slate-800">
                    {message.role === "user" ? (session?.user.name || 'Guest') : "Nietu AI"}
                  </span>
                  {message.role === "assistant" ? (
                    <p className="pb-6">{message.content}</p>
                  ) : (
                    <p className="rounded-sm bg-[#F1F5F9] w-fit text-left p-2">{message.content}</p>
                  )}
                </div>
                {message.role === "user" && (
                  <Avatar>
                    {session?.user?.image ? (
                      <AvatarImage src={session.user.image} />
                    ) : (
                      <AvatarFallback>
                        {session?.user?.name === "Guest" || !session?.user?.name
                          ? "GS"
                          : session?.user?.name.charAt(0)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            )}
          </div>
          {error &&
            <div className="text-red-500 bg-red-300 rounded p-4 w-[400px] text-sm mt-4 flex items-center gap-3">
              <Info className="text-red-500" />
              <p className="">{error}</p>
            </div>
          }
        </ScrollArea>
      </CardContent>

      <CardFooter>
        <form className="w-full flex gap-2" onSubmit={handleSubmit}>
          <Input
            placeholder="How can I help you?"
            value={input}
            onChange={handleInputChange}
            disabled={loading}
          />
          <Button type="submit" disabled={loading || !input.trim()}>
            {loading ? "Processing..." : "Send"}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}