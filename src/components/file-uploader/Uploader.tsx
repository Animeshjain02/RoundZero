"use client";

import { useCallback, useState } from "react";
import { type FileRejection, useDropzone } from "react-dropzone";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { Loader2, Trash2 } from "lucide-react";

export function ResumeUploader() {
  const [file, setFile] = useState(
    Array<{
      id: string;
      file: File;
      uploading: boolean;
      progress: number;
      key?: string;
      isDeleting: boolean;
      error: boolean;
      objectUrl?: string;
    }>,
  );

  const removeFile = async (fileId: string) => {
    try {
      const fileToRemove = file.find((f) => f.id === fileId);

      if (fileToRemove) {
        if (fileToRemove.objectUrl) {
          URL.revokeObjectURL(fileToRemove.objectUrl);
        }
      }

      setFile((prevFile) =>
        prevFile.map((f) => (f.id === fileId ? { ...f, isDeleting: true } : f)),
      );

      const deleteFileResponse = await fetch("/api/s3/delete", {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          key: fileToRemove?.key,
        }),
      });

      if (!deleteFileResponse.ok) {
        toast.error("Failed to delete file");
        setFile((prevFile) =>
          prevFile.map((f) =>
            f.id === fileId ? { ...f, isDeleting: false, error: true } : f,
          ),
        );

        return;
      }

      toast.success("File deleted successfully");

      setFile((prevFile) => prevFile.filter((f) => f.id !== fileId));
    } catch (error) {
      console.log(error);

      setFile((prevFile) =>
        prevFile.map((f) =>
          f.id === fileId ? { ...f, isDeleting: false, error: true } : f,
        ),
      );
    }
  };

  const uploadFile = async (file: File) => {
    console.log(file);
    setFile((prevFile) =>
      prevFile.map((f) => (f.file === file ? { ...f, uploading: true } : f)),
    );

    try {
      const preSignedUrlResponse = await fetch("/api/s3/upload", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          size: file.size,
        }),
      });

      if (!preSignedUrlResponse.ok) {
        toast.error("Failed to get presigned Url");

        setFile((prevFile) =>
          prevFile.map((f) =>
            f.file === file
              ? { ...f, uploading: false, progress: 0, error: true }
              : f,
          ),
        );

        return;
      }

      const { preSignedUrl, key } = await preSignedUrlResponse.json();

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentageCompleted = (event.loaded / event.total) * 100;
            setFile((prevFile) =>
              prevFile.map((f) =>
                f.file === file
                  ? {
                      ...f,
                      progress: Math.round(percentageCompleted),
                      key: key,
                    }
                  : f,
              ),
            );
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200 || xhr.status === 204) {
            setFile((prevFile) =>
              prevFile.map((f) =>
                f.file === file
                  ? {
                      ...f,
                      progress: 100,
                      uploading: false,
                      error: false,
                    }
                  : f,
              ),
            );

            toast.success("File uploaded successfully");

            resolve();
          } else {
            reject(new Error("Failed to upload file"));
          }
        };

        xhr.onerror = () => {
          reject(new Error("Failed to upload file"));
        };

        xhr.open("PUT", preSignedUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
      });
    } catch (error) {
      toast.error("Failed to upload file");

      setFile((prevFile) =>
        prevFile.map((f) =>
          f.file === file
            ? {
                ...f,
                progress: 0,
                uploading: false,
                error: true,
              }
            : f,
        ),
      );
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile((prevFiles) => [
        ...prevFiles,
        ...acceptedFiles.map((file) => ({
          id: uuidv4(),
          file: file,
          uploading: false,
          progress: 0,
          isDeleting: false,
          error: false,
          objectUrl: URL.createObjectURL(file),
        })),
      ]);
    }

    uploadFile(acceptedFiles[0]);
  }, []);

  const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
    // console.log(fileRejections);
    if (fileRejections.length > 0) {
      const tooManyFiles = fileRejections.find(
        (fileRejection) => fileRejection.errors[0].code === "too-many-files",
      );

      const fileTooLarge = fileRejections.find(
        (fileRejection) => fileRejection.errors[0].code === "file-too-large",
      );

      if (tooManyFiles) {
        toast.error("You can upload only one file");
      }

      if (fileTooLarge) {
        toast.error("File size must be less than 5MB");
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc", ".docx"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
  });

  return (
    <>
      <Card
        className={cn(
          "relative border-2 border-dashed transition-colors duration-200 ease-in-out w-full h-64",
          isDragActive
            ? "border-primary bg-primary/10 border-solid"
            : "border-border hover:border-primary",
        )}
        {...getRootProps()}
      >
        <CardContent className="flex flex-col items-center justify-center h-full w-full">
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full gay-y-3">
              <p>Drag 'n' drop some files here, or click to select files</p>
              <Button>Select Files</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {file.map((file) => (
          <div key={file.id} className="flex flex-col gap-1">
            <div className="relative aspect-square rounded-lg overflow-hidden">
              <img
                src={file.objectUrl}
                alt={file.file.name}
                className="w-full h-full object-cover"
              />

              <Button
                variant={"destructive"}
                size={"icon"}
                onClick={() => removeFile(file.id)}
                className="absolute top-2 right-2"
                disabled={file.uploading || file.isDeleting}
              >
                {file.isDeleting ? (
                  <Loader2 className="animate-spin size-4" />
                ) : (
                  <Trash2 className="size-4" />
                )}
              </Button>
              {file.uploading && !file.isDeleting && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <p className="text-white font-medium text-lg">
                    {file.progress}%
                  </p>
                </div>
              )}

              {file.error && (
                <div className="absolute inset-0 bg-red-500/50 flex items-center justify-center">
                  <p className="text-white font-medium text-lg">
                    Failed to upload
                  </p>
                </div>
              )}
            </div>

            <p className="text-sm text-muted-foreground truncate">
              {file.file.name}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
