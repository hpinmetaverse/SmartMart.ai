"use client";
import { Icons } from "@/components/layouts/icons";
import { Button } from "@/components/ui/button";
import { gql } from "@/gql";
import { FileWithPreview } from "@/types";
import { useQuery } from "@urql/next";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import ImagesGrid from "./ImageGrid";
import ImageGridSkeleton from "./ImageGridSkeleton";
import { useChat } from "ai/react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import supabaseClient from "@/lib/supabase/client";

interface UploadMediaContainerProps {
  onClickItemsHandler: (mediaId: string) => void;
  defaultImageId?: string;
}
function UploadMediaContainer({
  onClickItemsHandler,
  defaultImageId,
}: UploadMediaContainerProps) {
  const router = useRouter();
  const [uploadingImages, setUploadingImages] = useState<FileWithPreview[]>([]);
  const [lastCursor, setLastCursor] = React.useState<string | undefined>(
    undefined,
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Add state for custom loaded images from Supabase
  const [customImages, setCustomImages] = useState<any[]>([]);
  const [isLoadingCustomImages, setIsLoadingCustomImages] = useState(false);
  
  // Create a ref to store file data that persists across state updates
  const fileToUploadRef = useRef<File | null>(null);

  // Set up the AI chat for image analysis
  const { messages, setInput, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    initialInput: "Describe this image in detail",
    onFinish: (message) => {
      // When AI finishes generating a description, store it
      const description = message.content;
      console.log("Visual description generated:", description);

      // Access the file from our ref instead of state
      const fileToUpload = fileToUploadRef.current;
      if (fileToUpload) {
        console.log("File ready for upload from ref:", fileToUpload);
        // Save the image with its description to the database
        saveImageWithDescription(fileToUpload, description);
      } else {
        console.error("File ref is null in onFinish");
        toast.error("Error: Could not find file to upload");
        setIsAnalyzing(false);
      }
    }
  });

  const [{ data, fetching, error }, refetch] = useQuery({
    query: MediasPageContentQuery,
    variables: {
      first: 16,
      after: lastCursor,
    },
  });

  const medias = data?.mediasCollection;
  
  // Fetch custom images from Supabase
  const fetchCustomImages = async () => {
    setIsLoadingCustomImages(true);
    try {
      // Fetch data from the image_data table
      const { data, error } = await supabaseClient
        .from('image_data')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error("Error fetching custom images:", error);
        throw error;
      }
      
      console.log("Fetched custom images:", data);
      setCustomImages(data || []);
    } catch (error) {
      console.error("Failed to fetch custom images:", error);
      toast.error("Failed to load images from database");
    } finally {
      setIsLoadingCustomImages(false);
    }
  };
  
  // Fetch data on component mount and after uploads
  useEffect(() => {
    fetchCustomImages();
  }, []);
 
  // Function to save image with its AI-generated description
  const saveImageWithDescription = async (file: File, description: string) => {
    console.log("Starting upload process with file:", file);
    
    try {
      // Generate a unique filename
      const uniqueFilename = `public/${Date.now()}_${Math.random().toString(36).substring(2, 15)}.png`;
      
      console.log("Attempting to upload file:", uniqueFilename);
      
      // Try uploading the file
      const { data: uploadData, error: uploadError } = await supabaseClient.storage
        .from("media")
        .upload(uniqueFilename, file, {
          cacheControl: "3600",
          upsert: true
        });
      
      if (uploadError) {
        console.error("Storage upload error details:", uploadError);
        throw new Error(`Storage upload failed: ${uploadError.message}`);
      }
      
      // Get the path of the uploaded file
      const imagePath = uploadData?.path;
      console.log("Image uploaded to storage:", imagePath);
      
      // Get the public URL for the uploaded file
      const publicURL = supabaseClient.storage
        .from("media")
        .getPublicUrl(imagePath).data.publicUrl;
        
      console.log("Public URL:", publicURL);
      
      // Insert record with file path and description to database
      const { data: insertData, error: insertError } = await supabaseClient
        .from("image_data")
        .insert([
          { 
            image_path: publicURL,
            description: description,
          }
        ])
        .select();
      
      if (insertError) {
        console.error("Database insert error details:", insertError);
        throw new Error(`Database insert failed: ${insertError.message}`);
      }
      
      console.log("Visual description saved to database:", description);
      console.log("Database record:", insertData);
      
      // Clear the uploading images
      setUploadingImages([]);
      
      // Refresh both data sources
      refetch({ requestPolicy: "network-only" });
      fetchCustomImages(); // Fetch the updated custom images
      
      toast.success(`Image uploaded with AI description`);
      
      // Clear the file reference
      fileToUploadRef.current = null;
    } catch (error) {
      console.error("Error uploading file with description:", error);
      
      // More user-friendly error message
      let errorMessage = "Failed to save image with description";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      // Ensure analyzing state is always reset
      setIsAnalyzing(false);
    }
  };

  // Process a single file with AI analysis
  const processFileWithAI = async (file: File) => {
    try {
      console.log("Original file to process:", file);
      setIsAnalyzing(true);
      
      // Create a buffer to make a true copy of the file
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      // Create a new file from the buffer
      const newFile = new File([buffer], file.name, { type: file.type });
      
      console.log("Created file copy:", newFile);
      
      // Store the file in the ref for later use
      fileToUploadRef.current = newFile;
      
      // Set up the input for AI
      setInput("Describe this image in detail");

      // Also convert to FileList for the AI API
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(newFile);
      const fileList = dataTransfer.files;
      
      console.log("FileList created with file:", fileList[0]);

      // Send to AI for analysis
      const options = { experimental_attachments: fileList };
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent<HTMLFormElement>;
      
      console.log("Submitting to AI API...");
      handleSubmit(fakeEvent, options);

    } catch (error) {
      console.error("Error analyzing image:", error);
      toast.error("Failed to analyze image");
      setIsAnalyzing(false);
      fileToUploadRef.current = null;
    }
  };

  const onDrop = async (acceptedFiles: FileWithPath[]) => {
    if (acceptedFiles.length === 0) {
      toast.error("No valid files were dropped");
      return;
    }
    
    console.log("Files dropped:", acceptedFiles);
    
    const uploadFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      }),
    );

    setUploadingImages([...uploadingImages, ...uploadFiles]);

    // Process only one file at a time to avoid confusion
    const file = uploadFiles[0];
    await processFileWithAI(file);
  };

  useEffect(() => {
    return () =>
      uploadingImages.forEach((file) => URL.revokeObjectURL(file.preview));
  }, []);

  const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    noClick: true,
    noKeyboard: true,
    accept: {
      'image/*': []
    }
  });

  return (
    <div>
      {error && <p>Oh no... {error.message}</p>}

      {(fetching || isLoadingCustomImages) && <ImageGridSkeleton />}

      {/* Display both standard media and custom images */}
      {!fetching && !isLoadingCustomImages && (
        <>
          <div className="border border-dot border-zinc-300 p-5">
            <div {...getRootProps()} className="dropzone-container">
              {/* Show custom images if available */}
              {customImages.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-medium mb-2">AI Analyzed Images</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {customImages.map((img) => (
                      <div 
                        key={img.id} 
                        className="relative group cursor-pointer"
                        onClick={() => onClickItemsHandler(img.id)}
                      >
                        <img 
                          src={img.image_path} 
                          alt={img.description?.substring(0, 30) || "Image"} 
                          className="w-full h-[120px] object-cover rounded-md"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center p-2">
                          <p className="text-white text-xs line-clamp-3 text-center">
                            {img.description?.substring(0, 60)}...
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Original image grid */}
              {medias && medias.edges.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Media Library</h3>
                  <ImagesGrid
                    medias={medias.edges}
                    AddMediaButtonComponent={
                      <AddMediaButtonComponent open={open} isAnalyzing={isAnalyzing} />
                    }
                    uploadingFiles={uploadingImages}
                    onClickHandler={onClickItemsHandler}
                    defaultImageId={defaultImageId}
                  />
                </div>
              )}

              {/* If no images yet, just show the upload button */}
              {(!medias || medias.edges.length === 0) && customImages.length === 0 && (
                <div className="flex justify-center">
                  <AddMediaButtonComponent open={open} isAnalyzing={isAnalyzing} />
                </div>
              )}

              {medias && medias.pageInfo.hasNextPage ? (
                <div className="flex justify-center content-center mt-4">
                  <Button
                    onClick={() => {
                      setLastCursor(medias.pageInfo.endCursor ?? undefined);
                    }}
                  >
                    Load more
                  </Button>
                </div>
              ) : null}

              <input {...getInputProps()} />
              {isDragActive ? (
                <div className="w-full h-full min-h-[320px] flex items-center justify-center z-50">
                  Drop the Image here to upload the image.
                </div>
              ) : null}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const AddMediaButtonComponent = ({ open, isAnalyzing }: { open: () => void, isAnalyzing?: boolean }) => {
  return (
    <button
      onClick={open}
      disabled={isAnalyzing}
      className=" h-[120px] w-[120px] border-2 border-dashed border-blue-400 text-zinc-400 flex flex-col justify-center items-center relative"
    >
      {isAnalyzing ? (
        <>
          <Loader2 className="h-7 w-7 animate-spin" />
          <span className="text-xs mt-2">Analyzing...</span>
        </>
      ) : (
        <>
          <Icons.add size={32} />
          <span className="text-xs mt-2">Upload & Analyze</span>
        </>
      )}
    </button>
  );
};

export default UploadMediaContainer;

export const MediasPageContentQuery = gql(/* GraphQL */ `
  query MediasPageContentQuery($first: Int, $after: Cursor) {
    mediasCollection(
      first: $first
      after: $after
      orderBy: [{ created_at: DescNullsLast }]
    ) {
      __typename
      edges {
        node {
          id
          key
          alt
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        endCursor
      }
    }
  }
`);
