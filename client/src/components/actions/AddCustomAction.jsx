import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel,
  FormMessage 
} from '@/components/ui/form';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { LOVE_LANGUAGE_OPTIONS, ACTION_TIER_OPTIONS } from '@/constants/loveLanguages';
import { useToast } from '@/hooks/use-toast';

// Form validation schema
const actionSchema = z.object({
  description: z.string().min(3, 'Description must be at least 3 characters'),
  loveLanguage: z.string().min(1, 'Please select a love language'),
  tier: z.string().min(1, 'Please select an effort level'),
  productLink: z.string().url('Please enter a valid URL').or(z.string().length(0)).optional(),
});

export default function AddCustomAction() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form
  const form = useForm({
    resolver: zodResolver(actionSchema),
    defaultValues: {
      description: '',
      loveLanguage: '',
      tier: '',
      productLink: '',
    },
  });
  
  // Create action mutation
  const createMutation = useMutation({
    mutationFn: async (data) => {
      return apiRequest('POST', '/api/actions', data);
    },
    onSuccess: () => {
      toast({
        title: "Action created",
        description: "Your custom action has been added",
      });
      form.reset();
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/actions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/recommendations'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create action",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });
  
  const onSubmit = (data) => {
    setIsSubmitting(true);
    // Handle empty product link
    if (!data.productLink) {
      data.productLink = null;
    }
    createMutation.mutate(data);
  };
  
  return (
    <div className="mb-8">
      <Card className="rounded-xl shadow-sm">
        <CardContent className="p-4">
          <h2 className="text-lg font-medium mb-4 font-poppins">Add Custom Action</h2>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Action Description</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="What would you like to do?" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="loveLanguage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Love Language</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select love language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {LOVE_LANGUAGE_OPTIONS.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="tier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Effort Level</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select effort level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ACTION_TIER_OPTIONS.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="productLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Link (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://example.com/product" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary-dark"
                disabled={isSubmitting}
              >
                Add Action
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
