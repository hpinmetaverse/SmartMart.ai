"use client"

import type React from "react"

import { useState, useRef, DragEvent, useEffect } from "react"
import {  Image, Loader2, Send, X, ChevronDown, MessageCircle } from "lucide-react"
import { useChat } from "ai/react"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import { toast } from "sonner"
import Home from "@/app/okay/(preview)/page"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Button } from "../ui/button"
import { ScrollArea } from "../ui/scrollArea"
import { Textarea } from "../ui/textarea"
import supabaseClient from "@/lib/supabase/client"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

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
    <div className="relative h-full w-full flex flex-col">
      <div className="text-xs font-medium mb-1 truncate opacity-70">{file.name}</div>
      <div className="text-[9px] leading-snug opacity-80 font-mono">
        {content}
        {content.length >= 100 && "..."}
      </div>
    </div>
  );
}

export function AskAiButton() {
  const [open, setOpen] = useState(false)

  const [latestProducts, setLatestProducts] = useState<any[]>([]);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [imageData, setImageData] = useState([]);

  // Initialize chat with product context
  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    api: "/api/chat",
    initialMessages: [],
    onFinish: (message) => {
      // Check if we've already added the product context
      if (!productsLoaded && latestProducts.length > 0) {
        console.log("Adding product context to chat history");
        setProductsLoaded(true);
      }
    }
  })

  const [files, setFiles] = useState<FileList | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // If this is the first message and we have products, add them as context
    if (messages.length === 0 && latestProducts.length > 0 && !productsLoaded) {
      // Format products data for Gemini
      const productsContext = `Available products information:
${JSON.stringify(latestProducts, null, 2)}

Available image data information (share links where applicable):
${JSON.stringify(imageData, null, 2)}
`;

      // Add system message with product context
      setMessages([
        {
          id: "product-context",
          role: "system",
          content: productsContext
        }
      ]);

      setProductsLoaded(true);

      // Submit with both product context and user input
      const options = files ? { experimental_attachments: files } : {};
      setTimeout(() => {
        handleSubmit(e, options);
        setFiles(null);
      }, 100);
    } else {
      // Normal submission for subsequent messages
      const options = files ? { experimental_attachments: files } : {};
      handleSubmit(e, options);
      setFiles(null);
    }
  }

  useEffect(() => {
    const supabaseWorker = async () => {
      const { data, error } = await supabaseClient.from('products').select('name,description,badge,rating,tags,price,stock,totalComments').order('created_at', { ascending: false }).limit(10);
      if (error) {
        console.error(error);
      } else {
        setLatestProducts(data);
        console.log("Products loaded for AI context:", data);
      }
    }

    const intervalID = setTimeout(() => {
      if (open && !productsLoaded) {
        supabaseWorker();
      }
    }, 500);

    return () => clearInterval(intervalID);
  }, [open, productsLoaded]);

  useEffect(() => {
    const supabaseWorker = async () => {
      const { data, error } = await supabaseClient.from('image_data').select('image_path,description').order('created_at', { ascending: false }).limit(10);
      if (error) {
        console.error(error);
      } else {
        setImageData(data);
        console.log("Image data loaded for AI context:", data);
      }
    }

    const intervalID = setTimeout(() => {
      if (open && !productsLoaded) {
        supabaseWorker();
      }
    }, 500);

    return () => clearInterval(intervalID);
  }, [open, productsLoaded]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      const validFiles = Array.from(selectedFiles).filter(
        (file) =>
          file.type.startsWith("image/") || file.type.startsWith("text/")
      );

      if (validFiles.length === selectedFiles.length) {
        const dataTransfer = new DataTransfer();
        validFiles.forEach((file) => dataTransfer.items.add(file));
        setFiles(dataTransfer.files);
      } else {
        toast.error("Only image and text files are allowed");
      }
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
          (file) =>
            file.type.startsWith("image/") || file.type.startsWith("text/")
        );

        if (validFiles.length === files.length) {
          const dataTransfer = new DataTransfer();
          validFiles.forEach((file) => dataTransfer.items.add(file));
          setFiles(dataTransfer.files);
        } else {
          toast.error("Only image and text files are allowed");
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
        (file) =>
          file.type.startsWith("image/") || file.type.startsWith("text/")
      );

      if (validFiles.length === droppedFilesArray.length) {
        const dataTransfer = new DataTransfer();
        validFiles.forEach((file) => dataTransfer.items.add(file));
        setFiles(dataTransfer.files);
      } else {
        toast.error("Only image and text files are allowed!");
      }

      setFiles(droppedFiles);
    }
    setIsDragging(false);
  };

  return (
    <div className="fixed bottom-12 right-12 z-50"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <AnimatePresence>
        {isDragging && (
          <motion.div
            className="fixed pointer-events-none inset-0 z-10 justify-center items-center flex flex-col gap-2 bg-zinc-100/95 dark:bg-zinc-900/95 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-xl font-medium">Drop files here</div>
            <div className="text-sm dark:text-zinc-400 text-zinc-500 flex items-center gap-2">
              <Image className="h-4 w-4" /> Images and text files supported
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
        <Button
  size="icon"
  className="h-14 w-14 flex items-center justify-center rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-tr from-primary/90 to-primary hover:scale-105"
>
  <MessageCircle className="h-6 w-6 text-primary-foreground" />
</Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[400px] sm:w-[700px] p-0 max-h-[85vh] h-[600px] flex flex-col rounded-xl border shadow-lg"
          side="top"
          align="end"
          sideOffset={20}
        >
          <motion.div
            className="flex flex-col h-full overflow-hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="border-b p-4 flex justify-between items-center shrink-0">
              <h3 className="font-medium text-lg flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                <span>AI Assistant</span>
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="rounded-full h-8 w-8 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Products Information Accordion */}
            {latestProducts.length > 0 && (
              <Accordion type="single" collapsible className="px-4 pt-2 border-b">
                <AccordionItem value="products-info" className="border-b-0">
                  <AccordionTrigger className="py-2 text-sm font-medium hover:no-underline">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      
                      <span>Latest Products </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="text-xs max-h-40 overflow-y-auto pr-2 pb-2 space-y-2">
                      {latestProducts.map((product, index) => (
                        <div key={index} className="p-2 rounded-md bg-muted/50 border">
                          <div className="font-medium">{product.name}</div>
                          <div className="text-muted-foreground line-clamp-2">{product.description}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-[10px]">
                              ${product.price.toFixed(2)}
                            </span>
                            <span className="bg-muted-foreground/10 text-muted-foreground px-1.5 py-0.5 rounded text-[10px]">
                              Stock: {product.stock}
                            </span>
                            {product.rating && (
                              <span className="bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded text-[10px]">
                                Rating: {product.rating.toFixed(1)}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}


            {/* Image Data Information Accordion */}
            {imageData.length > 0 && (
              <Accordion type="single" collapsible className="px-4 pt-2 border-b">
              <AccordionItem value="image-data-info" className="border-b-0">
                <AccordionTrigger className="py-2 text-sm font-medium hover:no-underline">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                  <span>Available Images ({imageData.length})</span>
                </div>
                </AccordionTrigger>
                <AccordionContent>
                <div className="text-xs max-h-40 overflow-y-auto pr-2 pb-2 space-y-2">
                  {imageData.map((image, index) => (
                  <div key={index} className="p-2 rounded-md bg-muted/50 border">
                    <div className="font-medium">{image.description}</div>
                    <img src={image.image_path} alt={image.description} className="mt-2 rounded-md max-h-40" />
                  </div>
                  ))}
                </div>
                </AccordionContent>
              </AccordionItem>
              </Accordion>
            )}

            {/* Messages Area */}
            <div className="flex-1 overflow-hidden relative min-h-[300px]">
              <div className="h-full absolute inset-0 pb-2">
                <ScrollArea className="flex flex-col h-[490px] w-full rounded-md border gap-5 p-5 pb-40">
                  {messages
                    // Filter out the system message that contains product data
                    .filter(message => message.id !== "product-context")
                    .map((message) => (
                      <div
                        key={message.id}
                        className={cn("flex mt-4", {
                          "justify-end": message.role === "user",
                        })}
                      >
                        <div
                          className={cn("rounded-2xl px-4 py-3 max-w-[85%] shadow-sm", {
                            "bg-primary text-primary-foreground": message.role === "user",
                            "bg-muted/80 dark:bg-zinc-800/90": message.role === "assistant",
                          })}
                        >
                          <div className="whitespace-pre-wrap">
                            {message.content}
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {message.experimental_attachments?.map((attachment) =>
                              attachment.contentType?.startsWith("image") ? (
                                <motion.div
                                  key={attachment.name}
                                  initial={{ scale: 0.95, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  className="relative group"
                                >
                                  <img
                                    className="rounded-lg w-40 max-h-48 object-cover border shadow-sm"
                                    src={attachment.url}
                                    alt={attachment.name}
                                  />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity flex items-end p-2">
                                    <span className="text-white text-xs truncate w-full">{attachment.name}</span>
                                  </div>
                                </motion.div>
                              ) : attachment.contentType?.startsWith("text") ? (
                                <motion.div
                                  key={attachment.name}
                                  initial={{ scale: 0.95, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  className="text-xs w-40 h-24 overflow-hidden border p-3 rounded-lg bg-white/30 dark:bg-zinc-800/50 backdrop-blur-sm shadow-sm"
                                >
                                  {getTextFromDataUrl(attachment.url)}
                                </motion.div>
                              ) : null
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  {isLoading && (
                    <div className="flex">
                      <div className="bg-muted rounded-2xl px-4 py-3 shadow-sm flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        <span className="text-sm text-muted-foreground">Thinking...</span>
                      </div>
                    </div>
                  )}
                </ScrollArea>
              </div>
            </div>

            {/* Input Area */}
            <form onSubmit={handleFormSubmit} className="p-2 border-t shrink-0">
              <AnimatePresence>
                {files && files.length > 0 && (
                  <motion.div
                    className="flex flex-wrap gap-2 w-full mb-3"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {Array.from(files).map((file) =>
                      file.type.startsWith("image") ? (
                        <motion.div
                          key={file.name}
                          className="relative group"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{
                            y: -10,
                            scale: 0.8,
                            opacity: 0,
                            transition: { duration: 0.2 },
                          }}
                        >
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="rounded-lg h-16 w-16 object-cover border"
                          />
                          <button
                            type="button"
                            className="absolute -top-2 -right-2 h-5 w-5 bg-zinc-200 dark:bg-zinc-700 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => {
                              const newFiles = Array.from(files).filter(f => f !== file);
                              const dataTransfer = new DataTransfer();
                              newFiles.forEach((f) => dataTransfer.items.add(f));
                              setFiles(newFiles.length ? dataTransfer.files : null);
                            }}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </motion.div>
                      ) : file.type.startsWith("text") ? (
                        <motion.div
                          key={file.name}
                          className="relative group h-16 w-28 overflow-hidden text-zinc-500 border p-2 rounded-lg bg-white/80 dark:bg-zinc-800/80 dark:border-zinc-700 dark:text-zinc-400 backdrop-blur-sm"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{
                            y: -10,
                            scale: 0.8,
                            opacity: 0,
                            transition: { duration: 0.2 },
                          }}
                        >
                          <TextFilePreview file={file} />
                          <button
                            type="button"
                            className="absolute -top-2 -right-2 h-5 w-5 bg-zinc-200 dark:bg-zinc-700 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => {
                              const newFiles = Array.from(files).filter(f => f !== file);
                              const dataTransfer = new DataTransfer();
                              newFiles.forEach((f) => dataTransfer.items.add(f));
                              setFiles(newFiles.length ? dataTransfer.files : null);
                            }}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </motion.div>
                      ) : null
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="flex gap-2 bg-muted/50 dark:bg-zinc-800/50 backdrop-blur-sm rounded-xl p-1 border">
                <input
                  type="file"
                  multiple
                  accept="image/*,text/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                />

                <Button
                  type="button"
                  onClick={handleUploadClick}
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-lg hover:bg-background/80"
                >
                  <Image className="h-5 w-5 text-muted-foreground" />
                </Button>
                <Textarea
                  placeholder="Type your message..."
                  value={input}
                  onChange={handleInputChange}
                  onPaste={handlePaste}
                  rows={1}
                  className="min-h-[40px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/70"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={isLoading || !input.trim()}
                  className={cn(
                    "h-10 w-10 rounded-lg transition-all duration-300",
                    input.trim() ? "bg-primary text-primary-foreground" : "bg-muted-foreground/20"
                  )}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </motion.div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

