"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { MessageSquare, Send } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useRespondToFeedback } from "@/hooks/use-feedbacks"
import type { CustomerFeedback } from "@/lib/types/feedback"

const respondSchema = z.object({
  response: z.string().min(10, "Response must be at least 10 characters"),
})

type RespondFormData = z.infer<typeof respondSchema>

interface RespondFeedbackDialogProps {
  feedback: CustomerFeedback | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RespondFeedbackDialog({
  feedback,
  open,
  onOpenChange,
}: RespondFeedbackDialogProps) {
  const respondMutation = useRespondToFeedback()

  const form = useForm<RespondFormData>({
    resolver: zodResolver(respondSchema),
    defaultValues: {
      response: "",
    },
  })

  const onSubmit = async (data: RespondFormData) => {
    if (!feedback) return

    await respondMutation.mutateAsync({
      id: feedback.id,
      data: { response: data.response },
    })

    form.reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Respond to Feedback
          </DialogTitle>
          <DialogDescription>
            Provide a response to the customer&apos;s feedback
          </DialogDescription>
        </DialogHeader>

        {feedback && (
          <div className="space-y-4">
            {/* Feedback Details */}
            <div className="rounded-lg border p-4 bg-muted/50">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{feedback.customerName}</p>
                    <p className="text-sm text-muted-foreground">{feedback.dealerName}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${
                          i < feedback.rating ? "text-yellow-500" : "text-gray-300"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-sm font-medium">{feedback.subject}</p>
                  <p className="text-sm text-muted-foreground mt-1">{feedback.content}</p>
                </div>
              </div>
            </div>

            {/* Response Form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="response"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Response</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Type your response here..."
                          rows={6}
                          className="resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={respondMutation.isPending}>
                    <Send className="mr-2 h-4 w-4" />
                    {respondMutation.isPending ? "Sending..." : "Send Response"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
