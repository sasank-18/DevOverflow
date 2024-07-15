"use client";
import React, { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { QuestionSchema } from "../../lib/validation";
import { Badge } from "../ui/badge";
import Image from "next/image";
import { createQuestion, editQuestion } from "@/lib/actions/question.action";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "@/context/ThemeProvider";

interface Props{
  type ?: string,
  questionDetail? : string | undefined,
  mongoUserId : string

}


const Questions = ({type, questionDetail, mongoUserId} : Props) => {
  const question = type && JSON.parse(questionDetail || '' ) 

  const tagArray = question?.tags?.map((tag : any)=>tag.name)

  const {mode} = useTheme();
  const editorRef = useRef(null);
  const router = useRouter()
  const pathname= usePathname();
  
  const [isSubmitting,setIsSubmitting] = useState<boolean>(false);
  const form = useForm<z.infer<typeof QuestionSchema>>({
    resolver: zodResolver(QuestionSchema),
    defaultValues: {
      title: question?.title || "",
      explanation: (question?.content) || "",
      tags: tagArray || [],
    },
  });

  // 2. Define a submit handler.
 async function onSubmit(values: z.infer<typeof QuestionSchema>) {
    setIsSubmitting(true);
 
    try{

      if(type ==="Edit"){
        await editQuestion({
          questionId : question._id,
          title : values.title,
          content : values.explanation,
          path :  pathname
        })
       router.push(`/question/${question._id}`)
      }else{
        // make an async call to your api -> createa question
        // contain all form data 
            await createQuestion({
              title:values.title,
              content: values.explanation,
              tags: values.tags,
              author: JSON.parse(mongoUserId),
              path: pathname,
              });
  
        // navigate to home page
           router.push('/');
      }
     
    }catch(error){
       console.log("error",error)       
    } finally{
      setIsSubmitting(false)
    }
  }

  const handleInputKeyDown=(e: React.KeyboardEvent<HTMLInputElement>, field:any)=>{
    if(e.key === 'Enter'&& field.name==='tags'){
      e.preventDefault();
      const tagInput = e.target as HTMLInputElement;
      const tagValue = tagInput.value.trim();
      if(tagValue!== '') { 
        if(tagValue.length > 15){
          return form.setError('tags', {
            type: 'required',
            message: 'Tag must be less than 15 characters.'
          })
        }
        if(field.value.length > 2 ){
          return form.setError('tags', {
            type: 'required',
            message: 'Only Three tags are allowed'
          })
        }
      if(field.value.length < 3 && !field.value.includes(tagValue)){
         form.setValue('tags', [...field.value, tagValue])
         tagInput.value = ''
         form.clearErrors('tags')
      }
      else{
       form.trigger('tags');
      }
      
      }
    }
  }

  const handleTagRemove =(tag:string, field:any) =>{
    if(type === "Edit" ) return ;
  const newTags= field.value.filter((t:string)=>t!==tag)
  form.setValue('tags',newTags)
  }


  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-10"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => {
           return <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Question Title <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Input
                  className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                  {...field} 
                  autoFocus
                />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Be specific and imagine you&apos;re asking a question to another
                person.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          }}
        />

        <FormField
          control={form.control}
          name="explanation"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Detailed explanation of your problems{" "}
                <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Editor
            
                  apiKey={process.env.NEXT_PUBLIC_TINY_API_KEY}
                  onInit={(_evt, editor) => {
                    // @ts-ignore
                    editorRef.current = editor;
                  }}
                onBlur = {field.onBlur}   
                onEditorChange={(content)=> field.onChange(content)}                                                             
                  initialValue={(question?.content)}
                  init={{
                    height: 350,
                    menubar: false,
                    plugins: [
                      "advlist",
                      "autolink",
                      "lists",
                      "link",
                      "image",
                      "charmap",
                      "preview",
                      "anchor",
                      "searchreplace",
                      "visualblocks",
                      "codesample",
                      "fullscreen",
                      "insertdatetime",
                      "media",
                      "table",
                    ],
                    toolbar:
                      "undo redo | " +
                      "codesample | bold italic forecolor | alignleft aligncenter " +
                      "alignright alignjustify | bullist numlist",
                    content_style: "body { font-family:inter; font-size:16px }",
                    skin : mode ==='dark' ? "oxide-dark" : 'oxide',
                    content_css : mode === 'dark' ? 'dark' : 'writer',
                    theme: 'silver'
                  }}
                />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Introduce the problem and expand on what you put in the title.
                Minimun 20 characters.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />


        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Tags<span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <>
                 <Input
                disabled = {type === "Edit"}
                  className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                  placeholder="Add tags"
                  onKeyDown={(e)=> handleInputKeyDown(e,field)}
                />
              
                {field.value.length > 0 &&
                <div className="flex-start mt-2.5 gap-2.5">
                {field.value.map((tag)=>(
                  <Badge 
                  onClick={()=>{
                    handleTagRemove(tag, field)
                  }
                  }
                  className="subtle-medium background-light800_dark300 text-light400_light500 flex items-center justify-center gap-2 rounded-md border-none px-4 py-2 capitalize" key={tag}>
                   
                  {tag}
                   {type === "" && <Image
                    src= "/assets/icons/close.svg"
                    alt= " close icons"
                    width = {12}
                    height= {12}    
                    className= "cursor-pointer object-contain invert-0 dark:invert"                                      
                    />}
                    </Badge>
                ))}
                </div>
                }
                </>
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Add up to 3 tags to describe what your question is about. You
                need to press enter to add tag.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <Button className="bg-primary-500 w-fit text-light-900" disabled= {isSubmitting} type="submit">
          {isSubmitting ? (
            <>
            {type ==='Edit' ? "Editing..." : "Posting..." }
            </>
          ): (
            <>
            {type ==='Edit' ? "Edit Question" : "Post Question"}
            </>
          )}

        </Button>
      </form>
    </Form>
  );
};

export default Questions;
