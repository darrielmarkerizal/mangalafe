import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Upload,
  X,
  AlertCircle,
  Check,
  Image as ImageIcon,
} from "lucide-react";

export default function TeamMemberDialog({
  isOpen,
  onOpenChange,
  member,
  onSave,
  isSaving,
  onUploadError,
}) {
  const [memberData, setMemberData] = useState({
    name: "",
    position: "",
    image: "",
    isActive: true,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);

  // Load member data when dialog opens
  useEffect(() => {
    if (isOpen) {
      if (member) {
        setMemberData({
          name: member.name,
          position: member.position,
          image: member.image || "",
          isActive: member.isActive,
        });
        setImagePreview(member.image || null);
      } else {
        setMemberData({
          name: "",
          position: "",
          image: "",
          isActive: true,
        });
        setImagePreview(null);
      }
      setUploadError(null);
    }
  }, [isOpen, member]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMemberData({ ...memberData, [name]: value });
  };

  const handleCheckboxChange = (checked) => {
    setMemberData({ ...memberData, isActive: checked });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    if (!memberData.name.trim()) {
      toast.error("Nama anggota tim wajib diisi");
      return;
    }

    if (!memberData.position.trim()) {
      toast.error("Jabatan anggota tim wajib diisi");
      return;
    }

    onSave(memberData);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      setUploadError("Hanya file JPG, JPEG, PNG, dan GIF yang diizinkan.");
      return;
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Ukuran file maksimal 5MB.");
      return;
    }

    setUploadingImage(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append("fileToUpload", file);

    try {
      // Use a timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 seconds timeout

      // Use environment variable instead of hardcoded URL
      const uploadUrl = process.env.NEXT_PUBLIC_UPLOAD_API_URL;

      if (!uploadUrl) {
        throw new Error(
          "Upload URL not configured. Please set NEXT_PUBLIC_UPLOAD_API_URL in your environment variables."
        );
      }

      const response = await axios.post(uploadUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        signal: controller.signal,
        withCredentials: false,
      });

      clearTimeout(timeoutId);

      if (response.data.success) {
        setMemberData({ ...memberData, image: response.data.url });
        setImagePreview(response.data.url);
        toast.success("Foto berhasil diunggah");
      } else {
        setUploadError(response.data.message || "Gagal mengunggah foto");
        toast.error("Gagal mengunggah foto", {
          description: response.data.message,
        });
      }
    } catch (error) {
      console.error("Error uploading image:", error);

      // Collect error information for debugging
      const errorInfo = {
        message: error.message || "Unknown error",
        code: error.code || "",
        stack: error.stack || "",
        details: error.response?.data || {},
      };

      // Set a user-friendly error
      setUploadError("Terjadi masalah jaringan saat mengunggah foto");
      toast.error("Gagal menghubungi server unggah", {
        description:
          "Silakan periksa koneksi internet Anda atau coba lagi nanti",
      });

      // Notify parent component
      if (onUploadError) {
        onUploadError(errorInfo, file);
      }
    } finally {
      setUploadingImage(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setMemberData({ ...memberData, image: "" });
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const isValidImage = (url) => {
    if (!url) return false;
    if (url.startsWith("data:image/")) return true;

    try {
      if (url.startsWith("http://") || url.startsWith("https://")) {
        new URL(url);
        return true;
      }
      if (url.startsWith("/")) return true;
      return false;
    } catch (e) {
      return false;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {member ? "Edit Anggota Tim" : "Tambah Anggota Tim"}
            </DialogTitle>
            <DialogDescription>
              {member
                ? "Perbarui informasi anggota tim yang sudah ada"
                : "Tambahkan anggota tim baru ke website"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nama
              </Label>
              <Input
                id="name"
                name="name"
                value={memberData.name}
                onChange={handleChange}
                className="col-span-3"
                placeholder="Nama lengkap"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="position" className="text-right">
                Jabatan
              </Label>
              <Input
                id="position"
                name="position"
                value={memberData.position}
                onChange={handleChange}
                className="col-span-3"
                placeholder="Posisi/jabatan"
                required
              />
            </div>

            {/* Image Upload Section */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Foto</Label>
              <div className="col-span-3 space-y-3">
                <div
                  className={`border-2 border-dashed rounded-lg p-4 ${
                    uploadError
                      ? "border-red-300 bg-red-50"
                      : imagePreview && isValidImage(imagePreview)
                        ? "border-green-300 bg-green-50"
                        : "border-muted-foreground/25 hover:border-primary/40 bg-muted/10"
                  } transition-colors`}
                >
                  {imagePreview ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        {isValidImage(imagePreview) ? (
                          <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-600" />
                            <p className="text-xs font-medium text-green-600">
                              Foto berhasil diunggah
                            </p>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-amber-600" />
                            <p className="text-xs font-medium text-amber-600">
                              Format URL foto tidak valid
                            </p>
                          </div>
                        )}

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={removeImage}
                          className="h-6 w-6 rounded-full text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="relative aspect-square w-full max-w-[150px] mx-auto overflow-hidden rounded-md border">
                        {isValidImage(imagePreview) ? (
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/placeholder-person.png";
                            }}
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full w-full bg-muted/20">
                            <p className="text-muted-foreground text-center text-xs">
                              Foto tidak valid
                            </p>
                          </div>
                        )}
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={triggerFileInput}
                        disabled={uploadingImage || isSaving}
                        className="w-full"
                      >
                        <Upload className="mr-2 h-3.5 w-3.5" />
                        {isValidImage(imagePreview)
                          ? "Ganti Foto"
                          : "Unggah Foto"}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <ImageIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-medium">Unggah Foto</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          JPG, PNG atau GIF (max. 5MB)
                        </p>
                      </div>

                      {uploadError && (
                        <div className="text-destructive text-xs flex items-center gap-1 mt-1">
                          <AlertCircle className="h-3.5 w-3.5" />
                          <span>{uploadError}</span>
                        </div>
                      )}

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={triggerFileInput}
                        disabled={uploadingImage || isSaving}
                        className="w-full"
                      >
                        {uploadingImage ? (
                          <>
                            <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                            Mengunggah...
                          </>
                        ) : (
                          <>
                            <Upload className="mr-2 h-3.5 w-3.5" />
                            Pilih Foto
                          </>
                        )}
                      </Button>
                    </div>
                  )}

                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/gif"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploadingImage || isSaving}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Status</Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Checkbox
                  id="isActive"
                  checked={memberData.isActive}
                  onCheckedChange={handleCheckboxChange}
                  className="data-[state=checked]:bg-primary"
                />
                <label htmlFor="isActive" className="text-sm leading-none">
                  Tampilkan di website
                </label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSaving || uploadingImage}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isSaving || uploadingImage}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {member ? "Menyimpan..." : "Menambahkan..."}
                </>
              ) : (
                <>{member ? "Simpan Perubahan" : "Tambah Anggota"}</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
