
"use client";

import { useState, useRef, useEffect, type FormEvent, use } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { answerBcaQuery } from "@/ai/flows/answer-bca-query";
import { suggestRelevantClauses } from "@/ai/flows/suggest-relevant-clauses";
import { explainCodeClause } from "@/ai/flows/explain-code-clause";

import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { ChatMessage, type ChatMessageProps } from "@/components/chat-message";
import { ThemeToggle } from "@/components/theme-toggle";
import { Loader2, Sparkles, Send, Info, FileText } from "lucide-react";
import { Logo } from "@/components/logo";

const chatFormSchema = z.object({
  query: z.string().min(1, "Message cannot be empty."),
});

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessageProps[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [suggestedClauses, setSuggestedClauses] = useState<string[]>([]);
  const [isClausesLoading, setIsClausesLoading] = useState(false);
  
  const [explanation, setExplanation] = useState<{title: string, content: string} | null>(null);
  const [isExplanationLoading, setIsExplanationLoading] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof chatFormSchema>>({
    resolver: zodResolver(chatFormSchema),
    defaultValues: { query: "" },
  });

  const { isSubmitting } = form.formState;

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleClauseClick = async (clause: string) => {
    setIsExplanationLoading(clause);
    setIsSheetOpen(false); // Close sheet on mobile
    try {
      const result = await explainCodeClause({ codeClause: clause });
      setExplanation({ title: clause, content: result.explanation });
    } catch (error) {
      console.error("Error explaining clause:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get an explanation for the clause.",
      });
    } finally {
      setIsExplanationLoading(null);
    }
  };

  const onSubmit = async (values: z.infer<typeof chatFormSchema>) => {
    const userMessage: ChatMessageProps = { role: "user", content: values.query };
    setMessages((prev) => [...prev, userMessage]);
    setIsAiLoading(true);
    setIsClausesLoading(true);
    setSuggestedClauses([]);
    form.reset();

    try {
      // Forking calls to AI
      const bcaQueryPromise = answerBcaQuery({ query: values.query });
      const clausesPromise = suggestRelevantClauses({ query: values.query });

      const [bcaQueryResult, clausesResult] = await Promise.allSettled([bcaQueryPromise, clausesPromise]);

      if (bcaQueryResult.status === 'fulfilled') {
        const aiMessage: ChatMessageProps = { role: "assistant", content: bcaQueryResult.value.answer };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        throw bcaQueryResult.reason;
      }
      
      if (clausesResult.status === 'fulfilled') {
        setSuggestedClauses(clausesResult.value.clauses);
      } else {
        console.error("Could not fetch suggested clauses", clausesResult.reason)
        // Non-critical, so we don't throw an error to the user
      }

    } catch (error) {
      console.error("Error processing query:", error);
      const errorMessage: ChatMessageProps = { role: "assistant", content: "Sorry, I encountered an error. Please try again." };
      setMessages((prev) => [...prev, errorMessage]);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Failed to get a response from the AI. Please check your connection and try again.",
      });
    } finally {
      setIsAiLoading(false);
      setIsClausesLoading(false);
    }
  };
  
  const ClausesContent = () => (
    <ScrollArea className="h-[calc(100vh-16rem)] md:h-[calc(100vh-16rem)]">
      {isClausesLoading ? (
        Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2 p-2 rounded-md animate-pulse">
            <div className="h-4 w-4 bg-muted rounded-full"/>
            <div className="h-4 w-3/4 bg-muted rounded-md"/>
          </div>
        ))
      ) : suggestedClauses.length > 0 ? (
        <ul className="space-y-1">
          {suggestedClauses.map((clause) => (
            <li key={clause}>
              <Button
                variant="ghost"
                className="w-full justify-start text-left h-auto"
                onClick={() => handleClauseClick(clause)}
                disabled={!!isExplanationLoading}
              >
                {isExplanationLoading === clause ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Info className="mr-2 h-4 w-4" />
                )}
                <span className="flex-1">{clause}</span>
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground p-2">Relevant clauses will appear here after you ask a question.</p>
      )}
    </ScrollArea>
  );

  return (
    <div className="flex h-screen w-full flex-col bg-muted/30">
      <header className="flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Logo className="h-8 w-8" />
          <h1 className="text-lg font-semibold">BCA Code Assist AI</h1>
        </div>
        <div className="flex items-center gap-2">
           <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <FileText className="h-5 w-5" />
                <span className="sr-only">Relevant Clauses</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader className="mb-4">
                <SheetTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5" />
                  Relevant Clauses
                </SheetTitle>
              </SheetHeader>
              <ClausesContent />
            </SheetContent>
          </Sheet>
          <ThemeToggle />
        </div>
      </header>
      <main className="flex flex-1 gap-4 p-4 md:gap-8 md:p-6 overflow-hidden">
        <div className="w-[300px] flex-col gap-4 hidden md:flex">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5" />
                Relevant Clauses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ClausesContent />
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-1 flex-col">
          <Card className="flex-1 flex flex-col overflow-hidden">
            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-[calc(100vh-14rem)]" ref={scrollAreaRef}>
                <div className="p-6 space-y-6">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                      <Sparkles className="h-12 w-12 mb-4" />
                      <h2 className="text-2xl font-semibold mb-2 text-foreground">Welcome!</h2>
                      <p className="max-w-md">
                        Ask me anything about the Building Code of Australia 2022. For example: "What are the fire safety requirements for high-rise buildings?"
                      </p>
                    </div>
                  ) : (
                    messages.map((msg, index) => (
                      <ChatMessage key={index} role={msg.role} content={msg.content} />
                    ))
                  )}
                  {isAiLoading && (
                    <ChatMessage role="assistant" content={<Loader2 className="h-5 w-5 animate-spin" />} />
                  )}
                </div>
              </ScrollArea>
            </CardContent>
            <div className="border-t p-4 bg-background">
              <Form {...form}>
                <form
                  onSubmit={(evt) => {
                    evt.preventDefault();
                    form.handleSubmit(async (data) => use(onSubmit(data)))();
                  }}
                  className="relative flex items-center gap-2"
                >
                  <FormField
                    control={form.control}
                    name="query"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Textarea
                            placeholder="Ask about the BCA 2022..."
                            className="pr-16 resize-none"
                            rows={1}
                            {...field}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey && !isSubmitting) {
                                e.preventDefault();
                                form.handleSubmit(async (data) => use(onSubmit(data)))();
                              }
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button type="submit" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2" disabled={isSubmitting}>
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Send</span>
                  </Button>
                </form>
              </Form>
            </div>
          </Card>
        </div>
      </main>

      <AlertDialog open={!!explanation} onOpenChange={(open) => !open && setExplanation(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{explanation?.title}</AlertDialogTitle>
            <AlertDialogDescription className="max-h-[60vh] overflow-y-auto py-4">
              {explanation?.content}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setExplanation(null)}>Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
    
