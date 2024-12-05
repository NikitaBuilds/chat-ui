import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

export default function ChatMessages({ messages }) {
  const onDrop = useCallback((acceptedFiles) => {
    // Handle the dropped files
    const images = acceptedFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
    }));
    setAttachedImages((prev) => [...prev, ...images]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`flex-1 overflow-y-auto p-4 ${
        isDragActive ? "bg-primary/10" : ""
      }`}
    >
      <input {...getInputProps()} />
      {/* Existing messages rendering code */}
      {messages.map((message) => (
        <div key={message.id}>
          {message.content}
          {message.images &&
            message.images.map((image) => (
              <img
                key={image.id}
                src={image.url}
                alt="Attached"
                className="max-w-xs rounded-lg my-2"
              />
            ))}
        </div>
      ))}
    </div>
  );
}
