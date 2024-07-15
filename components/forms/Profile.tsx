"use client";

import { z } from "zod";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import { ProfileSchema } from "@/lib/validation";
import { usePathname, useRouter } from "next/navigation";
import { updateUser } from "@/lib/actions/user.action";

interface Props {
  clerkId: string;
  user: string;
}

const Profile = ({ clerkId, user }: Props) => {
  const pathname = usePathname();
  const [isSubmitting, setisSubmitting] = useState(false);
  const parsedUser = JSON.parse(user);
  const router = useRouter();
  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: parsedUser.name || "",
      username: parsedUser.username || "",
      portfolioWebsite: parsedUser.portfolioWebsite || "",
      location: parsedUser.location || "",
      bio: parsedUser.bio || "",
    },
  });

  async function onSubmit(values: z.infer<typeof ProfileSchema>) {
    console.log(values);
    setisSubmitting(true);
    try {
      // update user
      await updateUser({
        clerkId,
        updateData: {
          name: values.name,
          username: values.username,
          portfolioWebsite: values.portfolioWebsite,
          location: values.location,
          bio: values.bio,
        },
        path: pathname,
      });

      router.back();
    } catch (error) {
    } finally {
      setisSubmitting(false);
    }
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-9 flex w-full flex-col gap-9"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="text-dark300_light700 space-y-3.5">
                <FormLabel>
                  Name <span className="text-primary-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your name"
                    {...field}
                    className=" paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border"
                  />
                </FormControl>

                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="text-dark300_light700 space-y-3.5">
                <FormLabel>
                  Username <span className="text-primary-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your Username"
                    {...field}
                    className=" paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border"
                  />
                </FormControl>

                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="portfolioWebsite"
            render={({ field }) => (
              <FormItem className="text-dark300_light700 space-y-3.5">
                <FormLabel>Portfolio Link</FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="Your Portfolio Link"
                    {...field}
                    className=" paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border"
                  />
                </FormControl>

                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="text-dark300_light700 space-y-3.5">
                <FormLabel>location</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Where are you from?"
                    {...field}
                    className=" paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border"
                  />
                </FormControl>

                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem className="text-dark300_light700 space-y-3.5">
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Your Portfolio Link"
                    {...field}
                    className=" paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border"
                  />
                </FormControl>

                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <div className=" mt-7 flex justify-end">
            <Button
              disabled={isSubmitting}
              className="w-fit bg-primary-500 "
              type="submit"
            >
              {isSubmitting ? "Saving" : "Save"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Profile;
