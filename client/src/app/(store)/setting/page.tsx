"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import supabaseClient from "@/lib/supabase/client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, CheckCircle2, User } from "lucide-react"

// Form schema with validation
const profileFormSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  age: z.number().nullable().optional(),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]).optional(),
  is_admin: z.boolean(),
  created_at: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export default function ProfilePage() {
  const { toast } = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Initialize form with default values
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      id: "",
      name: "",
      email: "",
      age: null,
      gender: undefined,
      is_admin: false,
      created_at: "",
    },
  })

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      try {
        const { data: authData, error: authError } = await supabaseClient.auth.getSession()

        if (authError) {
          throw authError
        }

        const userId = authData?.session?.user?.id

        if (!userId) {
          setError("User not logged in or user ID not found.")
          setLoading(false)
          return
        }

        const { data, error: profileError } = await supabaseClient
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .maybeSingle()

        if (profileError) {
          throw profileError
        }

        if (data) {
          // Transform gender boolean to enum value for the form
          const genderValue = data.gender === null ? undefined : data.gender === true ? "male" : "female"

          form.reset({
            id: data.id,
            name: data.name || "",
            email: data.email || "",
            age: data.age,
            gender: genderValue,
            is_admin: data.is_admin || false,
            created_at: data.created_at || "",
          })
        } else {
          form.reset({
            id: userId,
            name: "",
            email: authData?.session?.user?.email || "",
            age: null,
            gender: undefined,
            is_admin: false,
          })
        }
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [form])

  async function onSubmit(values: ProfileFormValues) {
    try {
      setLoading(true)

      // Transform gender enum back to boolean for database
      let genderValue = null
      if (values.gender === "male") genderValue = true
      if (values.gender === "female") genderValue = false

      const profileData = {
        id: values.id,
        name: values.name,
        email: values.email,
        age: values.age,
        gender: genderValue,
        is_admin: values.is_admin,
      }

      let result
      if (values.created_at) {
        // Update existing profile
        result = await supabaseClient
          .from("profiles")
          .update({
            name: profileData.name,
            email: profileData.email,
            age: profileData.age,
            gender: profileData.gender,
          })
          .eq("id", profileData.id)
      } else {
        // Create new profile
        result = await supabaseClient.from("profiles").insert([profileData])
      }

      if (result.error) {
        throw result.error
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
        icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
      })

      router.refresh()
    } catch (err: any) {
      toast({
        title: "Error updating profile",
        description: err.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (error) {
    return (
      <Card className="max-w-2xl mx-auto my-8">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Error</CardTitle>
          <CardDescription>There was a problem loading your profile.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-destructive/10 text-destructive p-4 rounded-md">{error}</div>
          <Button className="mt-4" onClick={() => router.push("/")}>
            Return to Home
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="container max-w-4xl py-10">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-primary/10 p-3 rounded-full">
          <User className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">Manage your personal information and preferences</p>
        </div>
      </div>

      {loading ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3 mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-32" />
          </CardFooter>
        </Card>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Your email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Your age"
                            {...field}
                            value={field.value === null ? "" : field.value}
                            onChange={(e) => {
                              const value = e.target.value === "" ? null : Number.parseInt(e.target.value, 10)
                              field.onChange(value)
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                            <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Account Information</h3>
                      <p className="text-sm text-muted-foreground">These details are managed by the system</p>
                    </div>
                    {form.getValues("is_admin") && (
                      <Badge variant="outline" className="bg-primary/10 text-primary">
                        Admin
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">User ID</label>
                      <Input value={form.getValues("id")} disabled />
                    </div>

                    {form.getValues("created_at") && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Account Created</label>
                        <div className="flex items-center gap-2 h-10 px-3 rounded-md border bg-muted/50">
                          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {new Date(form.getValues("created_at") || "").toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" onClick={() => router.push("/")}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {form.getValues("created_at") ? "Update Profile" : "Create Profile"}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      )}
    </div>
  )
}

