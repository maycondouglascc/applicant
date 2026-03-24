import { useState } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'

import { getApiKey } from '@/services/settingsService'
import { extractKeywords, rankSnippets } from '@/services/jdExtractionService'
import { getSnippets } from '@/services/snippetService'
import type { Snippet } from '@/services/snippetService'
import { createApplication } from '@/services/applicationService'

export function ForgePage() {
  const [jdText, setJdText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [keywords, setKeywords] = useState<string[]>([])
  const [rankedSnippets, setRankedSnippets] = useState<Snippet[]>([])
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const handleAnalyze = async () => {
    setIsLoading(true)
    setErrorMsg('')
    setSuccessMsg('')
    try {
      const apiKey = getApiKey()
      const extracted = await extractKeywords(apiKey || 'fake-api-key', jdText)
      setKeywords(extracted)
      
      const allSnippets = getSnippets()
      const ranked = rankSnippets(extracted, allSnippets)
      setRankedSnippets(ranked)
    } catch (err: any) {
      setErrorMsg(err.message || 'Error extracting skills')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = () => {
    try {
      createApplication({
        job_description: jdText,
        keywords,
        suggested_snippet_ids: rankedSnippets.map(s => s.id)
      })
      setSuccessMsg('Saved to Backlog')
    } catch (err) {
      setErrorMsg('Error saving application')
    }
  }

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>New Application</CardTitle>
          <CardDescription>
            Paste the Job Description below to extract skills and find your best resume snippets.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Textarea
            placeholder="Paste the Job Description here..."
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            className="min-h-[200px]"
          />

          {errorMsg && (
            <p className="text-red-500 text-sm font-medium">{errorMsg}</p>
          )}

          {isLoading && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground animate-pulse">Extracting skills...</p>
              <Skeleton className="h-6 w-full max-w-[250px]" />
              <Skeleton className="h-6 w-full max-w-[200px]" />
            </div>
          )}

          {!isLoading && keywords.length > 0 && (
            <div className="space-y-6">
              <Separator />
              <div>
                <h3 className="font-semibold text-sm mb-3">Key Skills:</h3>
                <div className="flex flex-wrap gap-2">
                  {keywords.map(kw => (
                    <Badge key={kw} variant="secondary">{kw}</Badge>
                  ))}
                </div>
              </div>
              
              {rankedSnippets.length > 0 && (
                <div>
                  <h3 className="font-semibold text-sm mb-3">Suggested Snippets:</h3>
                  <div className="space-y-3">
                    {rankedSnippets.map(snippet => (
                      <Card key={snippet.id} className="p-4 bg-muted/50 border-muted">
                        <h4 className="font-medium text-sm">{snippet.name}</h4>
                        <p className="text-sm text-foreground/80 mt-1 line-clamp-3">{snippet.content}</p>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {successMsg && (
            <p className="text-green-600 dark:text-green-400 text-sm font-medium">{successMsg}</p>
          )}

        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          {!keywords.length ? (
            <Button onClick={handleAnalyze} disabled={!jdText.trim() || isLoading}>
              Analyze JD
            </Button>
          ) : (
            <Button onClick={handleSave}>
              Save to Backlog
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
