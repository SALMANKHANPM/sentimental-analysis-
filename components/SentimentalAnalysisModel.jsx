'use client';
import { useState } from 'react'
import { Button } from "../components/ui/button"
import { Textarea } from "../components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Progress } from "../components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog"
import { ScrollArea } from "../components/ui/scroll-area"
import { Loader, ThumbsDown, ThumbsUp, AlertCircle, ChartLine, PenTool, History, RefreshCcw, Meh, Heart, Frown, Smile } from "lucide-react"

export function EnhancedSentimentAnalysisModalComponent() {
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [analysisHistory, setAnalysisHistory] = useState([])
  const [activeTab, setActiveTab] = useState('input')

  const analyzeSentiment = async () => {
    setLoading(true)
    setError(null)
    try {
      // This is a mock API call. Replace with your actual sentiment analysis API
      const response = await fetch('/api/analyze-sentiment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })
      if (!response.ok) throw new Error('Failed to analyze sentiment')
      const data = await response.json()
      setResult(data)
      setAnalysisHistory(
        prev => [...prev, { text, result: data, timestamp: new Date().toLocaleString() }]
      )
      setActiveTab('results')
    } catch (err) {
      setError('An error occurred while analyzing the sentiment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const startNewAnalysis = () => {
    setText('')
    setResult(null)
    setError(null)
    setActiveTab('input')
  }

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'very positive':
        return <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-pink-500" />;
      case 'positive':
        return <ThumbsUp className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />;
      case 'neutral':
        return <Meh className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500" />;
      case 'negative':
        return <ThumbsDown className="h-5 w-5 sm:h-6 sm:w-6 text-red-500" />;
      case 'very negative':
        return <Frown className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500" />;
      default:
        return <Smile className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />;
    }
  }

  return (
    (<div className="min-h-screen bg-dot-pattern bg-gray-100 p-4 sm:p-8">
      <div className="container mx-auto max-w-lg">
        <h1 className="mb-6 text-2xl sm:text-4xl font-bold text-center text-gray-800">Sentiment Analysis Tool</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger
              value="input"
              className="flex flex-col items-center py-2 px-1 sm:flex-row sm:py-2 sm:px-4">
              <PenTool className="h-4 w-4 mb-1 sm:mr-2 sm:mb-0" />
              <span className="text-xs sm:text-sm">Input</span>
            </TabsTrigger>
            <TabsTrigger
              value="results"
              className="flex flex-col items-center py-2 px-1 sm:flex-row sm:py-2 sm:px-4">
              <ChartLine className="h-4 w-4 mb-1 sm:mr-2 sm:mb-0" />
              <span className="text-xs sm:text-sm">Results</span>
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="flex flex-col items-center py-2 px-1 sm:flex-row sm:py-2 sm:px-4">
              <History className="h-4 w-4 mb-1 sm:mr-2 sm:mb-0" />
              <span className="text-xs sm:text-sm">History</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="input">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Enter Your Text</CardTitle>
                <CardDescription className="text-sm">Provide the text you want to analyze for sentiment.</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Type your text here..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[120px] sm:min-h-[150px] text-sm sm:text-base" />
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  onClick={analyzeSentiment}
                  disabled={loading || text.trim().length === 0}
                  className="w-full sm:w-auto">
                  {loading ? <><Loader className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</> : 'Analyze Sentiment'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="results">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Analysis Result</CardTitle>
                <CardDescription className="text-sm">View the sentiment analysis of your text.</CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle className="text-sm font-medium">Error</AlertTitle>
                    <AlertDescription className="text-xs">{error}</AlertDescription>
                  </Alert>
                )}
                
                {result && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      {getSentimentIcon(result.sentiment)}
                      <span className="text-base sm:text-lg font-semibold capitalize">{result.sentiment}</span>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1 text-sm">
                        <span>Sentiment Score</span>
                        <span>{result.score.toFixed(2)}</span>
                      </div>
                      <Progress value={result.score * 100} className="w-full" />
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <h3 className="text-sm font-medium mb-2">Analyzed Text:</h3>
                      <p className="text-sm text-gray-600">{text}</p>
                    </div>
                  </div>
                )}
                
                {!result && !error && (
                  <div className="text-center text-gray-500 text-sm">
                    No analysis results yet. Start by entering text in the Input tab.
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={startNewAnalysis} className="w-full sm:w-auto">
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  New Analysis
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Analysis History</CardTitle>
                <CardDescription className="text-sm">View your past sentiment analysis results.</CardDescription>
              </CardHeader>
              <CardContent>
                <Alert className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Disclaimer</AlertTitle>
                  <AlertDescription>
                    This history is stored temporarily and will be lost if you refresh the page.
                  </AlertDescription>
                </Alert>
                {analysisHistory.length > 0 ? (
                  <ul className="space-y-4">
                    {analysisHistory.map((item, index) => (
                      <li key={index} className="border-b pb-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="link" className="p-0 h-auto">
                              <div className="text-left">
                                <p className="font-medium text-sm">{item.text.substring(0, 50)}...</p>
                                <div className="flex items-center mt-1">
                                  {getSentimentIcon(item.result.sentiment)}
                                  <span className="text-xs sm:text-sm capitalize ml-1">
                                    {item.result.sentiment} ({item.result.score.toFixed(2)})
                                  </span>
                                </div>
                              </div>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Detailed Analysis</DialogTitle>
                              <DialogDescription>
                                Analysis performed on {item.timestamp}
                              </DialogDescription>
                            </DialogHeader>
                            <ScrollArea className="mt-4 h-[200px] rounded-md border p-4">
                              <p className="text-sm">{item.text}</p>
                            </ScrollArea>
                            <div className="flex items-center space-x-2 mt-4">
                              {getSentimentIcon(item.result.sentiment)}
                              <span className="text-base font-semibold capitalize">{item.result.sentiment}</span>
                            </div>
                            <div className="mt-2">
                              <div className="flex justify-between mb-1 text-sm">
                                <span>Sentiment Score</span>
                                <span>{item.result.score.toFixed(2)}</span>
                              </div>
                              <Progress value={item.result.score * 100} className="w-full" />
                            </div>
                          </DialogContent>
                        </Dialog>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center text-gray-500 text-sm">
                    No analysis history yet. Start by analyzing some text.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>)
  );
}