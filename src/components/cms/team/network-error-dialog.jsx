import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

export default function NetworkErrorDialog({
  isOpen,
  onOpenChange,
  errorDetails,
  retryFile,
}) {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetryUpload = async () => {
    if (!retryFile) return;

    setIsRetrying(true);

    // Create a new FormData object with the same file
    const formData = new FormData();
    formData.append("fileToUpload", retryFile);

    try {
      const uploadUrl = process.env.NEXT_PUBLIC_UPLOAD_API_URL;

      if (!uploadUrl) {
        throw new Error("Upload URL not configured");
      }

      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Foto berhasil diunggah");
        onOpenChange(false);
        // You might want to pass the URL back to the parent component here
      } else {
        toast.error("Gagal mengunggah foto", {
          description: data.message,
        });
      }
    } catch (error) {
      console.error("Error retrying upload:", error);
      toast.error("Masih gagal mengunggah foto");
    } finally {
      setIsRetrying(false);
    }
  };

  const handleUseLocalImage = () => {
    if (!retryFile) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Image = e.target.result;

      toast.success("Foto digunakan sebagai alternatif", {
        description: "Foto akan disimpan sebagai data URL",
      });

      // You might want to pass the URL back to the parent component here
      onOpenChange(false);
    };

    reader.onerror = () => {
      toast.error("Gagal membaca file gambar secara lokal");
    };

    reader.readAsDataURL(retryFile);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Gagal Mengunggah Foto
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <p>
              Terjadi masalah saat menghubungi server unggah gambar. Ini mungkin
              karena:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Koneksi internet terputus</li>
              <li>Server unggah sedang tidak tersedia</li>
              <li>Masalah dengan kebijakan keamanan browser (CORS)</li>
            </ul>

            {errorDetails && (
              <div className="bg-muted/20 p-3 rounded-md text-xs font-mono overflow-x-auto mt-4">
                <p className="font-semibold">Detail Error:</p>
                <p>{errorDetails.message || "Unknown error"}</p>
                <p>{errorDetails.code || ""}</p>
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="sm:flex-1"
          >
            Tutup
          </Button>
          <Button
            type="button"
            variant="default"
            onClick={handleRetryUpload}
            disabled={isRetrying}
            className="sm:flex-1"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isRetrying ? "animate-spin" : ""}`}
            />
            {isRetrying ? "Mencoba..." : "Coba Lagi"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleUseLocalImage}
            className="sm:flex-1"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Gunakan Secara Lokal
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
