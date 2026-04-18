"use client"

import type React from "react"

import { useState, useRef, DragEvent, useEffect } from "react"
import { Bot, Image, Loader2, Send, X } from "lucide-react"
import { useChat } from "ai/react"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import { toast } from "sonner"
import Home from "@/app/okay/(preview)/page"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Button } from "../ui/button"
import { ScrollArea } from "../ui/scrollArea"
import { Textarea } from "../ui/textarea"

const getTextFromDataUrl = (dataUrl: string) => {
  const base64 = dataUrl.split(",")[1];
  return window.atob(base64);
};

function TextFilePreview({ file }: { file: File }) {
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      setContent(typeof text === "string" ? text.slice(0, 100) : "");
    };
    reader.readAsText(file);
  }, [file]);

  return (
    <div>
      {content}
      {content.length >= 100 && "..."}
    </div>
  );
}

export function AIImageTagging() {
  const [open, setOpen] = useState(false)
  const [uploadCount, setUploadCount] = useState(0); // Track number of uploads for debugging
  
  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput } = useChat({
    api: "/api/chat",
    initialInput: "Describe this image in detail",
    onResponse: (response) => {
      if (response.status === 200) {
        setFiles(null);
      }
    },
    onError: (error) => {
      toast.error("Error: " + (error.message || "Failed to analyze image"));
      setFiles(null); // Reset files on error too
    }
  })

  const [files, setFiles] = useState<FileList | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Reset form after each submission
  useEffect(() => {
    if (!isLoading && !files) {
      // Make sure input is reset to default prompt
      setInput("Describe this image in detail");
    }
  }, [isLoading, files, setInput]);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!files || files.length === 0) {
      toast.error("Please upload an image");
      return;
    }
    
    try {
      // Ensure input has the default prompt
      setInput("Describe this image in detail");
      
      // Create a new FormData object to avoid any state issues
      const options = { experimental_attachments: files };
      
      // Use a small timeout to ensure state is updated
      setTimeout(() => {
        handleSubmit(e, options);
        console.log("Form submitted with files:", files);
        setUploadCount(prev => prev + 1);
      }, 10);
    } catch (error) {
      console.error("Error submitting image:", error);
      toast.error("Failed to submit image for analysis");
      setFiles(null);
    }
  }

  const handleUploadClick = () => {
    try {
      // Reset the file input before opening dialog
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      fileInputRef.current?.click();
    } catch (error) {
      console.error("Error opening file dialog:", error);
      toast.error("Failed to open file upload dialog");
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const selectedFiles = event.target.files;
      if (selectedFiles && selectedFiles.length > 0) {
        const validFiles = Array.from(selectedFiles).filter(
          (file) => file.type.startsWith("image/")
        );

        if (validFiles.length === selectedFiles.length) {
          const dataTransfer = new DataTransfer();
          validFiles.forEach((file) => dataTransfer.items.add(file));
          setFiles(dataTransfer.files);
          console.log("New files set:", dataTransfer.files);
          toast.success("Image uploaded successfully");
        } else {
          toast.error("Only image files are allowed");
        }
      }
    } catch (error) {
      console.error("Error handling file change:", error);
      toast.error("Failed to process selected files");
    }
  };

  const handlePaste = (event: React.ClipboardEvent) => {
    const items = event.clipboardData?.items;

    if (items) {
      const files = Array.from(items)
        .map((item) => item.getAsFile())
        .filter((file): file is File => file !== null);

      if (files.length > 0) {
        const validFiles = files.filter(
          (file) => file.type.startsWith("image/")
        );

        if (validFiles.length === files.length) {
          const dataTransfer = new DataTransfer();
          validFiles.forEach((file) => dataTransfer.items.add(file));
          setFiles(dataTransfer.files);
        } else {
          toast.error("Only image files are allowed");
        }
      }
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
    const droppedFilesArray = Array.from(droppedFiles);
    if (droppedFilesArray.length > 0) {
      const validFiles = droppedFilesArray.filter(
        (file) => file.type.startsWith("image/")
      );

      if (validFiles.length === droppedFilesArray.length) {
        const dataTransfer = new DataTransfer();
        validFiles.forEach((file) => dataTransfer.items.add(file));
        setFiles(dataTransfer.files);
      } else {
        toast.error("Only image files are allowed!");
      }

      setFiles(droppedFiles);
    }
    setIsDragging(false);
  };

  return (
    <div className=""
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <AnimatePresence>
        {isDragging && (
          <motion.div
            className="fixed pointer-events-none  h-dvh w-dvw z-10 justify-center items-center flex flex-col gap-1 bg-zinc-100/90 dark:bg-zinc-900/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div>Drag and drop files here</div>
            <div className="text-sm dark:text-zinc-400 text-zinc-500">
              {"(images only)"}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="flex flex-col h-full"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.2 }}
      >
        {/* Header */}
        <div className="border-b p-3 flex justify-between items-center">
          <h3 className="font-semibold">AI Image Analysis</h3>
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          <div className="flex flex-col gap-4">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                Upload an image to get started
              </div>
            )}
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn("flex", {
                  "justify-end": message.role === "user",
                })}
              >
                <div
                  className={cn("rounded-lg px-3 py-2 max-w-[80%]", {
                    "bg-primary text-primary-foreground": message.role === "user",
                    "bg-muted": message.role === "assistant",
                  })}
                >
                  {message.role === "user" && message.experimental_attachments?.length ? null : message.content}
                  <div className="flex flex-row gap-2">
                    {message.experimental_attachments?.map((attachment) =>
                      attachment.contentType?.startsWith("image") ? (
                        <img
                          className="rounded-md w-40 mb-3"
                          key={attachment.name}
                          src={attachment.url}
                          alt={attachment.name}
                        />
                      ) : null
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex">
                <div className="bg-muted rounded-lg px-3 py-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <form ref={formRef} onSubmit={handleFormSubmit} className="p-4 border-t">
          <AnimatePresence>
            {files && files.length > 0 && (
              <div className="flex flex-row gap-2 w-full mb-2">
                {Array.from(files).map((file) => (
                  <div key={`${file.name}-${file.lastModified}`}>
                    <motion.img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="rounded-md w-16"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{
                        y: -10,
                        scale: 1.1,
                        opacity: 0,
                        transition: { duration: 0.2 },
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </AnimatePresence>
          <div className="flex gap-2 justify-between">
            <input
              type="file"
              multiple
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />

            <Button
              type="button"
              onClick={handleUploadClick}
              variant={"outline"}
              className="flex-1"
            >
              <Image className="h-4 w-4 mr-2" />
              Upload Image
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !files || files.length === 0}
              className="bg-primary hover:bg-primary/90" // Ensure proper styling
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Analyze
            </Button>
          </div>
        </form>
      </motion.div>

    </div>
  )
}

