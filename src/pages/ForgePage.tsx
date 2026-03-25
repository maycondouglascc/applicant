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
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'

import { getApiKey, getPersona } from '@/services/settingsService'
import { extractKeywords, rankSnippets } from '@/services/jdExtractionService'
import { getSnippets } from '@/services/snippetService'
import type { Snippet } from '@/services/snippetService'
import { createApplication } from '@/services/applicationService'
import { generateTailoredContent, type TailoredContent } from '@/services/geminiService'
import { DownloadIcon } from 'lucide-react'
import { downloadAsPdf } from '@/services/pdfExportService'

export function ForgePage() {
  const [jdText, setJdText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [keywords, setKeywords] = useState<string[]>([])
  const [rankedSnippets, setRankedSnippets] = useState<Snippet[]>([])
  const [tailored, setTailored] = useState<TailoredContent | null>(null)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [isPdfLoading, setIsPdfLoading] = useState(false)

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

  const handleGenerate = async () => {
    setIsGenerating(true)
    setErrorMsg('')
    try {
      const apiKey = getApiKey()
      if (!apiKey) throw new Error('API key not found in settings.')
      const persona = getPersona()
      const content = await generateTailoredContent(apiKey, jdText, persona, rankedSnippets)
      setTailored(content)
      setSuccessMsg('Content generated successfully.')
    } catch (err: any) {
      setErrorMsg(err.message || 'Error generating content')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSave = () => {
    try {
      createApplication({
        job_description: jdText,
        keywords,
        suggested_snippet_ids: rankedSnippets.map(s => s.id),
        tailored_cv: tailored?.cv,
        tailored_cl: tailored?.cl,
        linkedin_msg: tailored?.linkedin
      })
      setSuccessMsg('Saved Application to Backlog')
    } catch (err) {
      setErrorMsg('Error saving application')
    }
  }

  const handleDownloadPdf = async () => {
    if (!tailored?.cv) return
    setIsPdfLoading(true)
    setErrorMsg('')
    try {
      await downloadAsPdf(tailored.cv, 'ATS_Tailored_CV.pdf')
    } catch (err: any) {
      console.error(err)
      setErrorMsg('Error generating PDF: ' + (err?.message || String(err)))
    } finally {
      setIsPdfLoading(false)
    }
  }

  if (tailored) {
    return (
      <div className="container h-[calc(100vh-4rem)] mx-auto py-8 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Review & Edit</h1>
            <p className="text-muted-foreground">Compare the generated text with your source snippets.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleDownloadPdf} disabled={isPdfLoading}>
              <DownloadIcon data-icon="inline-start" />
              {isPdfLoading ? 'Generating PDF...' : 'Download ATS PDF'}
            </Button>
            <Button onClick={handleSave}>Save Application</Button>
          </div>
        </div>
        
        {successMsg && <p className="text-green-600 dark:text-green-400 text-sm font-medium">{successMsg}</p>}
        {errorMsg && <p className="text-red-500 text-sm font-medium">{errorMsg}</p>}
        
        <ResizablePanelGroup direction="horizontal" className="flex-1 rounded-lg border w-full">
          <ResizablePanel defaultSize={30} minSize={20}>
            <div className="h-full flex flex-col">
              <div className="p-4 border-b bg-muted/20 font-medium">Source Snippets</div>
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {rankedSnippets.map(snippet => (
                    <Card key={snippet.id} className="p-4 bg-muted/50 border-muted">
                      <h4 className="font-medium text-sm mb-2">{snippet.name}</h4>
                      <p className="text-sm text-foreground/80 whitespace-pre-wrap">{snippet.content}</p>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={70}>
            <Tabs defaultValue="cv" className="h-full flex flex-col">
              <div className="px-4 border-b bg-muted/20 flex items-center h-[57px]">
                <TabsList>
                  <TabsTrigger value="cv">Tailored CV</TabsTrigger>
                  <TabsTrigger value="cl">Cover Letter</TabsTrigger>
                  <TabsTrigger value="linkedin">LinkedIn Message</TabsTrigger>
                </TabsList>
              </div>
              <div className="flex-1 overflow-hidden p-4">
                <TabsContent value="cv" className="mt-0 h-full border-none data-[state=inactive]:hidden outline-none">
                  <Textarea 
                    className="h-full font-mono text-sm resize-none rounded-md" 
                    value={tailored.cv} 
                    onChange={e => setTailored({...tailored, cv: e.target.value})} 
                  />
                </TabsContent>
                <TabsContent value="cl" className="mt-0 h-full border-none data-[state=inactive]:hidden outline-none">
                  <Textarea 
                    className="h-full font-mono text-sm resize-none rounded-md" 
                    value={tailored.cl} 
                    onChange={e => setTailored({...tailored, cl: e.target.value})} 
                  />
                </TabsContent>
                <TabsContent value="linkedin" className="mt-0 h-full border-none data-[state=inactive]:hidden outline-none">
                  <Textarea 
                    className="h-full font-mono text-sm resize-none rounded-md" 
                    value={tailored.linkedin} 
                    onChange={e => setTailored({...tailored, linkedin: e.target.value})} 
                  />
                </TabsContent>
              </div>
            </Tabs>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    )
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

          {isGenerating && (
            <div className="space-y-4 mt-6">
              <Separator />
              <p className="text-sm text-muted-foreground animate-pulse">Generating tailored application with Gemini...</p>
              <Skeleton className="h-[120px] w-full" />
            </div>
          )}

          {successMsg && !isGenerating && (
            <p className="text-green-600 dark:text-green-400 text-sm font-medium mt-4">{successMsg}</p>
          )}

        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          {!keywords.length ? (
            <Button onClick={handleAnalyze} disabled={!jdText.trim() || isLoading}>
              Analyze JD
            </Button>
          ) : (
            <Button onClick={handleGenerate} disabled={isGenerating}>
              {isGenerating ? 'Generating...' : 'Generate Content'}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

