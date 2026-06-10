import { useEffect, useRef, useState } from "react";
import { Building2, Upload, Loader2, ImageIcon, Save, X } from "lucide-react";
import { Button } from "./ui/button";
import { companyService, ApiCompany } from "../services/companyService";

/**
 * Organization branding settings. Lets an organization upload / update the
 * company logo that is rendered on the invoice and proposal documents/PDFs.
 * The logo is stored on the Organization record (companyLogo) via the existing
 * multipart PUT /api/companies/:id endpoint.
 */
export function OrganizationSettings() {
  const [orgId, setOrgId] = useState<number | null>(null);
  const [company, setCompany] = useState<ApiCompany | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const data = sessionStorage.getItem("userData");
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (parsed.organizationId !== undefined && parsed.organizationId !== null) {
          setOrgId(Number(parsed.organizationId));
        }
      } catch (e) {
        console.error("Failed to parse userData", e);
      }
    }
  }, []);

  useEffect(() => {
    if (orgId !== null) fetchCompany();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId]);

  // Revoke the object URL when it changes / on unmount to avoid leaks.
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const fetchCompany = async () => {
    if (orgId === null) return;
    setLoading(true);
    setError(null);
    try {
      const res = await companyService.getById(orgId);
      setCompany(res.data);
    } catch (e: any) {
      setError(e?.response?.data?.error || e?.message || "Could not load organization details.");
    } finally {
      setLoading(false);
    }
  };

  const clearSelection = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setFile(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setSuccess(null);
    // On a rejected pick, drop any prior selection so the error never coexists
    // with a stale valid preview / enabled Save button.
    if (!f.type.startsWith("image/")) {
      clearSelection();
      setError("Please choose an image file (PNG, JPG, SVG or WebP).");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      clearSelection();
      setError("Image is too large. Please use a file under 5 MB.");
      return;
    }
    setError(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  };

  const onSave = async () => {
    if (orgId === null || !file) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const form = new FormData();
      form.append("companyLogo", file);
      const res = await companyService.update(orgId, form);
      clearSelection();
      // Prefer the record returned by the PUT — refetching hits the
      // employee-joined getCompanyById, which can 404 for an org with no active
      // employees and would wrongly show an error after a successful save.
      if (res?.data?.companyLogo) {
        setCompany((prev) => ({ ...(prev || ({} as ApiCompany)), ...res.data }));
      } else {
        await fetchCompany();
      }
      setSuccess("Company logo updated. It will now appear on new invoice and proposal PDFs.");
    } catch (e: any) {
      setError(e?.response?.data?.error || e?.message || "Failed to update the logo. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const currentLogo = previewUrl || company?.companyLogo || null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="absolute inset-0 bg-[#937CB4] blur-xl opacity-40 animate-pulse"></div>
          <Building2 className="h-8 w-8 text-[#422462] relative z-10" />
        </div>
        <div>
          <h2 className="text-3xl font-bold gradient-text">Organization Settings</h2>
          <p className="text-[#5A4079]">Manage your company branding</p>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl shadow-lg p-6 max-w-3xl">
        <h3 className="text-lg font-semibold text-[#200B43] mb-1">Company Logo</h3>
        <p className="text-sm text-[#5A4079] mb-6">
          Used on your billing invoices and proposal quotations. PNG, JPG, SVG or WebP, up to 5 MB.
        </p>

        {loading ? (
          <div className="flex items-center gap-2 py-10 text-[#5A4079]">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading organization…
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Logo preview */}
            <div className="flex h-32 w-44 shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-[#937CB4]/40 bg-[#F0E9FF]/30 overflow-hidden">
              {currentLogo ? (
                <img src={currentLogo} alt="Company logo" className="max-h-28 max-w-40 object-contain" />
              ) : (
                <div className="flex flex-col items-center gap-1 text-[#937CB4]">
                  <ImageIcon className="h-8 w-8" />
                  <span className="text-xs">No logo yet</span>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex-1 space-y-3">
              {company?.companyName && (
                <p className="text-sm text-[#200B43]">
                  <span className="text-[#5A4079]">Organization:</span>{" "}
                  <span className="font-semibold">{company.companyName}</span>
                </p>
              )}

              <input
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                onChange={onPick}
                className="hidden"
              />

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileRef.current?.click()}
                  className="border-[#937CB4]/30 text-[#422462] hover:bg-[#F0E9FF]/50"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {company?.companyLogo ? "Choose New Logo" : "Choose Logo"}
                </Button>

                {file && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={clearSelection}
                    className="text-[#5A4079] hover:bg-[#F0E9FF]/50"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                )}

                <Button
                  type="button"
                  onClick={onSave}
                  disabled={!file || saving}
                  className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#5A4079] hover:to-[#422462] disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving…
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Logo
                    </>
                  )}
                </Button>
              </div>

              {file && (
                <p className="text-xs text-[#5A4079] truncate">
                  Selected: {file.name}
                </p>
              )}

              {error && <p className="text-sm text-red-600">{error}</p>}
              {success && <p className="text-sm text-green-600">{success}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
