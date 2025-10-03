import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="space-y-6">
      <Alert variant="destructive" className="text-center py-8">
        <AlertTitle>Note Not Found</AlertTitle>
        <AlertDescription className="mt-2">
          The note you're looking for doesn't exist or you don't have permission to view it.
        </AlertDescription>
        <Link href="/notes">
          <Button className="mt-4" variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Notes
          </Button>
        </Link>
      </Alert>
    </div>
  )
}
