"use client";

import { Loader2, Trash2 } from "lucide-react";
import { useCallback, useState } from "react";
import { type FileRejection, useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

export function ResumeUploader({
  onUploadComplete,
  onRemove,
}: {
  onUploadComplete: (key: string, file: File) => void;
  onRemove: (key: string) => void;
}) {
  const [file, setFile] = useState<
    Array<{
      id: string;
      file: File;
      uploading: boolean;
      progress: number;
      key?: string;
      isDeleting: boolean;
      error: boolean;
      objectUrl?: string;
    }>
  >([]);

  const removeFile = async (fileId: string) => {
    try {
      const fileToRemove = file.find((f) => f.id === fileId);

      if (fileToRemove) {
        if (fileToRemove.objectUrl) {
          URL.revokeObjectURL(fileToRemove.objectUrl);
        }
        if (fileToRemove.key) {
          onRemove(fileToRemove.key);
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

  const uploadFile = async (fileToUpload: File) => {
    const fileId = uuidv4();
    const newFileState = {
      id: fileId,
      file: fileToUpload,
      uploading: true,
      progress: 0,
      isDeleting: false,
      error: false,
      objectUrl: URL.createObjectURL(fileToUpload),
    };

    setFile([newFileState]); // Replace existing file

    try {
      const preSignedUrlResponse = await fetch("/api/s3/upload", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          fileName: fileToUpload.name,
          contentType: fileToUpload.type,
          size: fileToUpload.size,
        }),
      });

      if (!preSignedUrlResponse.ok) {
        toast.error("Failed to get presigned Url");

        setFile((prevFile) =>
          prevFile.map((f) =>
            f.id === fileId
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
                f.id === fileId
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
                f.id === fileId
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
            onUploadComplete(key, fileToUpload);
            resolve();
          } else {
            reject(new Error("Failed to upload file"));
          }
        };

        xhr.onerror = () => {
          reject(new Error("Failed to upload file"));
        };

        xhr.open("PUT", preSignedUrl);
        xhr.setRequestHeader("Content-Type", fileToUpload.type);
        xhr.send(fileToUpload);
      });
    } catch (error) {
      toast.error("Failed to upload file");

      setFile((prevFile) =>
        prevFile.map((f) =>
          f.id === fileId
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
      uploadFile(acceptedFiles[0]);
    }
  }, []);

  const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
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
      {file.length === 0 ? (
        <Card
          className={cn(
            "relative border-2 border-dashed transition-colors duration-200 ease-in-out w-full h-48",
            isDragActive
              ? "border-primary bg-primary/10 border-solid"
              : "border-border hover:border-primary",
          )}
          {...getRootProps()}
        >
          <CardContent className="flex flex-col items-center justify-center h-full w-full">
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the file here ...</p>
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-full gap-y-3">
                <p>Drag 'n' drop a file here, or click to select</p>
                <Button type="button">Select File</Button>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {file.map((fileItem) => (
            <div key={fileItem.id} className="flex flex-col gap-1">
              <div className="relative aspect-video rounded-lg overflow-hidden border group">
                {fileItem.file.type.includes("image") ? (
                  <img
                    src={fileItem.objectUrl}
                    alt={fileItem.file.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 p-4">
                    <p className="text-sm font-medium text-center text-muted-foreground break-all">
                      {fileItem.file.name}
                    </p>
                  </div>
                )}

                <Button
                  variant={"destructive"}
                  size={"icon"}
                  onClick={() => removeFile(fileItem.id)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  disabled={fileItem.uploading || fileItem.isDeleting}
                >
                  {fileItem.isDeleting ? (
                    <Loader2 className="animate-spin size-4" />
                  ) : (
                    <Trash2 className="size-4" />
                  )}
                </Button>
                {fileItem.uploading && !fileItem.isDeleting && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
                    <p className="text-white font-medium text-lg">
                      {fileItem.progress}%
                    </p>
                  </div>
                )}

                {fileItem.error && (
                  <div className="absolute inset-0 bg-red-500/50 flex items-center justify-center z-20">
                    <p className="text-white font-medium text-lg">
                      Failed to upload
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
