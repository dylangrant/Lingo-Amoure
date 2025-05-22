import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { QUIZ_QUESTIONS, LOVE_LANGUAGES } from '@/constants/loveLanguages';
import { useToast } from '@/hooks/use-toast';
import { useAppState } from '@/context/AppStateContext';

export default function LoveLanguageQuiz() {
  const { toast } = useToast();
  const { dispatch } = useAppState();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const question = QUIZ_QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100;
  
  // Submit quiz results
  const submitQuizMutation = useMutation({
    mutationFn: async (quizData) => {
      return apiRequest('POST', '/api/quiz', quizData);
    },
    onSuccess: (data) => {
      toast({
        title: "Quiz completed",
        description: `Your partner's primary love language is ${data.json.result.primary}`,
      });
      
      // Update app state with the new primary love language
      dispatch({ 
        type: 'SET_PARTNER_LOVE_LANGUAGE', 
        payload: data.json.result.primary 
      });
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      queryClient.invalidateQueries({ queryKey: ['/api/recommendations'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save quiz results",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });
  
  const handleSelect = (value) => {
    setSelectedAnswer(value);
  };
  
  const handleNext = () => {
    if (selectedAnswer === null) return;
    
    // Save answer
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = {
      questionId: question.id,
      answer: question.answers[selectedAnswer].text,
      loveLanguage: question.answers[selectedAnswer].loveLanguage
    };
    setAnswers(newAnswers);
    
    // Move to next question or submit
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      // Calculate results
      submitQuiz(newAnswers);
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(null);
    }
  };
  
  const submitQuiz = (responses) => {
    setIsSubmitting(true);
    
    // Calculate scores for each love language
    const scores = {
      [LOVE_LANGUAGES.WORDS_OF_AFFIRMATION]: 0,
      [LOVE_LANGUAGES.ACTS_OF_SERVICE]: 0,
      [LOVE_LANGUAGES.RECEIVING_GIFTS]: 0,
      [LOVE_LANGUAGES.QUALITY_TIME]: 0,
      [LOVE_LANGUAGES.PHYSICAL_TOUCH]: 0
    };
    
    responses.forEach(response => {
      scores[response.loveLanguage]++;
    });
    
    // Find the primary love language
    let primaryLanguage = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
    
    // Prepare the result
    const result = {
      primary: primaryLanguage,
      scores: scores
    };
    
    // Submit to API
    submitQuizMutation.mutate({
      responses,
      result
    });
  };
  
  return (
    <Card className="rounded-xl shadow-lg max-w-2xl mx-auto">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold font-poppins text-neutral-dark">Love Language Quiz</h2>
          <p className="text-neutral-medium mt-1">Discover your partner's primary love language</p>
        </div>
        
        {/* Progress Bar */}
        <Progress value={progress} className="h-2.5 mb-6" />
        
        {/* Question */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Question {question.id} of {QUIZ_QUESTIONS.length}</h3>
          <p className="text-neutral-dark font-medium mb-4">{question.question}</p>
          
          <RadioGroup className="space-y-3" value={selectedAnswer} onValueChange={handleSelect}>
            {question.answers.map((answer, index) => (
              <Label
                key={index}
                className="block p-4 border border-gray-200 rounded-lg hover:border-primary cursor-pointer transition"
                htmlFor={`question-${question.id}-answer-${index}`}
              >
                <div className="flex items-start">
                  <RadioGroupItem 
                    value={index.toString()} 
                    id={`question-${question.id}-answer-${index}`}
                    className="mt-1 mr-3" 
                  />
                  <div>
                    <p>{answer.text}</p>
                    <span className="text-xs text-neutral-medium">({answer.loveLanguage})</span>
                  </div>
                </div>
              </Label>
            ))}
          </RadioGroup>
        </div>
        
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentQuestion === 0 || isSubmitting}
          >
            Previous
          </Button>
          <Button 
            onClick={handleNext}
            disabled={selectedAnswer === null || isSubmitting}
            className="bg-primary hover:bg-primary-dark"
          >
            {currentQuestion < QUIZ_QUESTIONS.length - 1 ? 'Next' : 'Submit'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
