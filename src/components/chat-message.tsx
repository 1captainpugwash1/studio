import { Bot, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string | React.ReactNode;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === 'user';
  return (
    <div className={cn("flex items-start gap-4", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <Avatar className="h-8 w-8 border">
          <AvatarFallback className="bg-primary text-primary-foreground">
            <Bot className="h-5 w-5"/>
          </AvatarFallback>
        </Avatar>
      )}
      <Card className={cn(
        "max-w-[85%] p-3 rounded-2xl",
        isUser ? "bg-primary text-primary-foreground rounded-br-none" : "bg-card rounded-bl-none"
      )}>
        {typeof content === 'string' ? (
          <p className="text-sm whitespace-pre-wrap">{content}</p>
        ) : (
          content
        )}
      </Card>
      {isUser && (
        <Avatar className="h-8 w-8 border">
          <AvatarFallback className="bg-card">
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
