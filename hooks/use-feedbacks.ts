import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { feedbacksApi } from "@/lib/api/feedbacks"
import type { FeedbackFilters, RespondToFeedbackRequest } from "@/lib/types/feedback"
import { useToast } from "./use-toast"

const FEEDBACKS_QUERY_KEY = "feedbacks"

/**
 * Hook to fetch all feedbacks with optional filters
 */
export function useFeedbacks(filters?: FeedbackFilters) {
  return useQuery({
    queryKey: [FEEDBACKS_QUERY_KEY, filters],
    queryFn: () => feedbacksApi.getFeedbacks(filters),
  })
}

/**
 * Hook to fetch a single feedback by ID
 */
export function useFeedback(id: string) {
  return useQuery({
    queryKey: [FEEDBACKS_QUERY_KEY, id],
    queryFn: () => feedbacksApi.getFeedbackById(id),
    enabled: !!id,
  })
}

/**
 * Hook to respond to a feedback
 */
export function useRespondToFeedback() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RespondToFeedbackRequest }) =>
      feedbacksApi.respondToFeedback(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FEEDBACKS_QUERY_KEY] })
      toast({
        title: "Success",
        description: "Response submitted successfully",
      })
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to submit response",
      })
    },
  })
}
