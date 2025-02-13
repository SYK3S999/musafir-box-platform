import { Star } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ReviewCardProps {
  author: string
  rating: number
  comment: string
  date: string
}

export function ReviewCard({ author, rating, comment, date }: ReviewCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar>
          <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${author}`} alt={author} />
          <AvatarFallback>{author.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold">{author}</h3>
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
            ))}
          </div>
        </div>
        <span className="ml-auto text-sm text-muted-foreground">{date}</span>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{comment}</p>
      </CardContent>
    </Card>
  )
}

