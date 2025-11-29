"use client"

import { useState } from "react"
import { format } from "date-fns"
import {
  MessageSquare,
  Search,
  Star,
  MessageCircle,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RespondFeedbackDialog } from "@/components/feedbacks/respond-feedback-dialog"
import { useFeedbacks } from "@/hooks/use-feedbacks"
import type { CustomerFeedback, FeedbackStatus } from "@/lib/types/feedback"

export default function FeedbacksPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [ratingFilter, setRatingFilter] = useState<string>("all")
  const [respondDialogOpen, setRespondDialogOpen] = useState(false)
  const [selectedFeedback, setSelectedFeedback] = useState<CustomerFeedback | null>(null)

  const { data: feedbacks, isLoading } = useFeedbacks(
    statusFilter !== "all" ? { status: statusFilter as FeedbackStatus } : undefined
  )

  const handleRespond = (feedback: CustomerFeedback) => {
    setSelectedFeedback(feedback)
    setRespondDialogOpen(true)
  }

  const getStatusColor = (status: FeedbackStatus) => {
    switch (status) {
      case "Open":
        return "bg-blue-500 hover:bg-blue-600 text-white"
      case "InProgress":
        return "bg-yellow-500 hover:bg-yellow-600 text-white"
      case "Resolved":
        return "bg-green-500 hover:bg-green-600 text-white"
      case "Closed":
        return "bg-gray-500 hover:bg-gray-600 text-white"
      default:
        return "bg-gray-500 hover:bg-gray-600 text-white"
    }
  }

  const getStatusIcon = (status: FeedbackStatus) => {
    switch (status) {
      case "Open":
        return <AlertCircle className="h-3 w-3" />
      case "InProgress":
        return <Clock className="h-3 w-3" />
      case "Resolved":
        return <CheckCircle className="h-3 w-3" />
      case "Closed":
        return <XCircle className="h-3 w-3" />
      default:
        return <AlertCircle className="h-3 w-3" />
    }
  }

  const filteredFeedbacks = feedbacks?.filter((feedback) => {
    const matchesSearch =
      feedback.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.dealerName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRating =
      ratingFilter === "all" || feedback.rating === parseInt(ratingFilter)

    return matchesSearch && matchesRating
  }) || []

  // Calculate stats
  const totalFeedbacks = feedbacks?.length || 0
  const openFeedbacks = feedbacks?.filter((f) => f.feedbackStatus === "Open").length || 0
  const avgRating = feedbacks?.length
    ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
    : "0"
  const respondedCount = feedbacks?.filter((f) => f.response).length || 0

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Customer Feedbacks</h2>
          <p className="text-muted-foreground">Manage customer feedback and complaints</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Feedbacks</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFeedbacks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Feedbacks</CardTitle>
            <AlertCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{openFeedbacks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{avgRating}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Responded</CardTitle>
            <MessageCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{respondedCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search feedbacks..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Open">Open</SelectItem>
            <SelectItem value="InProgress">In Progress</SelectItem>
            <SelectItem value="Resolved">Resolved</SelectItem>
            <SelectItem value="Closed">Closed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={ratingFilter} onValueChange={setRatingFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ratings</SelectItem>
            <SelectItem value="5">5 Stars</SelectItem>
            <SelectItem value="4">4 Stars</SelectItem>
            <SelectItem value="3">3 Stars</SelectItem>
            <SelectItem value="2">2 Stars</SelectItem>
            <SelectItem value="1">1 Star</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Feedbacks Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredFeedbacks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No feedbacks found</p>
              <p className="text-sm text-muted-foreground">
                {searchTerm || statusFilter !== "all" || ratingFilter !== "all"
                  ? "Try adjusting your filters"
                  : "No customer feedbacks available"}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Dealer</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Response</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFeedbacks.map((feedback) => (
                  <TableRow key={feedback.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{feedback.customerName}</p>
                        {feedback.orderNumber && (
                          <p className="text-xs text-muted-foreground">
                            Order: {feedback.orderNumber}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="font-medium truncate">{feedback.subject}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {feedback.content}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{feedback.dealerName}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        <span className="font-medium">{feedback.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`flex items-center gap-1 w-fit ${getStatusColor(feedback.feedbackStatus)}`}>
                        {getStatusIcon(feedback.feedbackStatus)}
                        {feedback.feedbackStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(feedback.createdAt), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>
                      {feedback.response ? (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm">Responded</span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">No response</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {!feedback.response && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRespond(feedback)}
                        >
                          <MessageCircle className="mr-2 h-4 w-4" />
                          Respond
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <RespondFeedbackDialog
        feedback={selectedFeedback}
        open={respondDialogOpen}
        onOpenChange={setRespondDialogOpen}
      />
    </div>
  )
}
