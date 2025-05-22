import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { QUIZ_QUESTIONS, LOVE_LANGUAGES } from "@/constants/loveLanguages";

const LoveLanguageQuiz = ({ onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [results, setResults] = useState(null);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [progress, setProgress] = useState(0);
  
  // Calculate progress
  useEffect(() => {
    setProgress((currentQuestionIndex / QUIZ_QUESTIONS.length) * 100);
  }, [currentQuestionIndex]);
  
  const handleNextQuestion = () => {
    if (!currentAnswer) return;
    
    // Save the answer
    const newAnswers = [...answers, currentAnswer];
    setAnswers(newAnswers);
    setCurrentAnswer("");
    
    // Move to next question or calculate results
    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateResults(newAnswers);
    }
  };
  
  const calculateResults = (completedAnswers) => {
    // Initialize score object for each love language
    const scores = {};
    Object.keys(LOVE_LANGUAGES).forEach(key => {
      scores[key] = 0;
    });
    
    // Calculate scores based on answers
    completedAnswers.forEach(loveLanguage => {
      if (loveLanguage in scores) {
        scores[loveLanguage]++;
      }
    });
    
    // Sort love languages by score (highest first)
    const sortedScores = Object.entries(scores)
      .sort((a, b) => b[1] - a[1])
      .map(([language, score]) => ({
        language,
        score,
        percentage: Math.round((score / completedAnswers.length) * 100)
      }));
    
    const quizResults = {
      primary: sortedScores[0].language,
      secondary: sortedScores[1].language,
      allResults: sortedScores
    };
    
    setResults(quizResults);
    if (onComplete) {
      onComplete(quizResults);
    }
  };
  
  // If we have results, display them
  if (results) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Quiz Results</CardTitle>
          <CardDescription>Your partner's love languages, based on your answers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Primary Love Language:</h3>
            <div className="bg-primary/10 p-3 rounded-lg">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium">{LOVE_LANGUAGES[results.primary]}</span>
                <span className="text-sm">{results.allResults.find(r => r.language === results.primary).percentage}%</span>
              </div>
              <Progress value={results.allResults.find(r => r.language === results.primary).percentage} />
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Secondary Love Language:</h3>
            <div className="bg-muted p-3 rounded-lg">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium">{LOVE_LANGUAGES[results.secondary]}</span>
                <span className="text-sm">{results.allResults.find(r => r.language === results.secondary).percentage}%</span>
              </div>
              <Progress value={results.allResults.find(r => r.language === results.secondary).percentage} />
            </div>
          </div>
          
          <div className="space-y-2 mt-4">
            <h3 className="font-semibold">All Results:</h3>
            {results.allResults.map(result => (
              <div key={result.language} className="flex justify-between text-sm">
                <span>{LOVE_LANGUAGES[result.language]}</span>
                <span>{result.percentage}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Display the current question
  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex];
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Love Language Quiz</CardTitle>
        <CardDescription>
          Answer these questions to determine your partner's love languages
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Question {currentQuestionIndex + 1} of {QUIZ_QUESTIONS.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} />
        </div>
        
        <div className="py-2">
          <h3 className="text-lg font-medium mb-4">{currentQuestion.question}</h3>
          
          <RadioGroup
            value={currentAnswer}
            onValueChange={setCurrentAnswer}
            className="space-y-3"
          >
            {currentQuestion.answers.map((answer, index) => (
              <div key={index} className="flex items-start space-x-2 border p-3 rounded-md">
                <RadioGroupItem 
                  value={answer.loveLanguage} 
                  id={`option-${index}`} 
                  className="mt-1" 
                />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {answer.text}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleNextQuestion} 
          disabled={!currentAnswer}
          className="w-full"
        >
          {currentQuestionIndex < QUIZ_QUESTIONS.length - 1 ? "Next Question" : "Finish Quiz"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LoveLanguageQuiz;