import { Upload, Plus, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";

interface HROnboardingFormProps {
  formData: any;
  setFormData: (data: any) => void;
  onSubmit: () => void;
  onCancel: () => void;
  submitting?: boolean;
  // "create" requires login credentials; "edit" hides the password field
  // (password changes go through the employee's own profile flow).
  mode?: "create" | "edit";
}

export function HROnboardingForm({ formData, setFormData, onSubmit, onCancel, submitting, mode = "create" }: HROnboardingFormProps) {
  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
 
      <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/30 bg-gradient-to-br from-[#F0E9FF]/30 to-white p-4">
        <h3 className="font-bold text-[#200B43] mb-4 flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-[#937CB4] to-[#422462] flex items-center justify-center text-white text-xs font-bold">
            1
          </div>
          Personal Information
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#200B43]">Full Name *</label>
            <Input
              placeholder="Enter full name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="border-[#937CB4]/30 focus:border-[#422462] h-9 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#200B43]">Contact Number *</label>
            <Input
              placeholder="Enter contact number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="border-[#937CB4]/30 focus:border-[#422462] h-9 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#200B43]">Alternate Number</label>
            <Input
              placeholder="Enter alternate number"
              value={formData.alternatePhone}
              onChange={(e) => setFormData({ ...formData, alternatePhone: e.target.value })}
              className="border-[#937CB4]/30 focus:border-[#422462] h-9 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#200B43]">Date of Birth *</label>
            <Input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              className="border-[#937CB4]/30 focus:border-[#422462] h-9 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#200B43]">Gender *</label>
            <Select
              value={formData.gender}
              onValueChange={(value) => setFormData({ ...formData, gender: value })}
            >
              <SelectTrigger className="border-[#937CB4]/30 focus:border-[#422462] h-9 text-sm">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Others">Others</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#200B43]">Religion</label>
            <Input
              placeholder="Enter religion"
              value={formData.religion}
              onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
              className="border-[#937CB4]/30 focus:border-[#422462] h-9 text-sm"
            />
          </div>
          <div className="space-y-1 col-span-3">
            <label className="text-xs font-semibold text-[#200B43]">Education Qualification *</label>
            <Input
              placeholder="Enter education qualification"
              value={formData.educationQualification}
              onChange={(e) => setFormData({ ...formData, educationQualification: e.target.value })}
              className="border-[#937CB4]/30 focus:border-[#422462] h-9 text-sm"
            />
          </div>
        </div>
      </div>
 
      <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/30 bg-gradient-to-br from-[#F0E9FF]/30 to-white p-4">
        <h3 className="font-bold text-[#200B43] mb-4 flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-[#937CB4] to-[#422462] flex items-center justify-center text-white text-xs font-bold">
            2
          </div>
          Family Information
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#200B43]">Father/Husband Name</label>
            <Input
              placeholder="Enter father/husband name"
              value={formData.fatherHusbandName}
              onChange={(e) => setFormData({ ...formData, fatherHusbandName: e.target.value })}
              className="border-[#937CB4]/30 focus:border-[#422462] h-9 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#200B43]">Father/Husband Number</label>
            <Input
              placeholder="Enter father/husband number"
              value={formData.fatherHusbandNumber}
              onChange={(e) => setFormData({ ...formData, fatherHusbandNumber: e.target.value })}
              className="border-[#937CB4]/30 focus:border-[#422462] h-9 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#200B43]">Mother/Wife Name</label>
            <Input
              placeholder="Enter mother/wife name"
              value={formData.motherWifeName}
              onChange={(e) => setFormData({ ...formData, motherWifeName: e.target.value })}
              className="border-[#937CB4]/30 focus:border-[#422462] h-9 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#200B43]">Mother/Wife Number</label>
            <Input
              placeholder="Enter mother/wife number"
              value={formData.motherWifeNumber}
              onChange={(e) => setFormData({ ...formData, motherWifeNumber: e.target.value })}
              className="border-[#937CB4]/30 focus:border-[#422462] h-9 text-sm"
            />
          </div>
        </div>
      </div>
 
      <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/30 bg-gradient-to-br from-[#F0E9FF]/30 to-white p-4">
        <h3 className="font-bold text-[#200B43] mb-4 flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-[#937CB4] to-[#422462] flex items-center justify-center text-white text-xs font-bold">
            3
          </div>
          Address Information
        </h3>
        <div className="grid grid-cols-1 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#200B43]">Current Address *</label>
            <Input
              placeholder="Enter current address"
              value={formData.currentAddress}
              onChange={(e) => setFormData({ ...formData, currentAddress: e.target.value })}
              className="border-[#937CB4]/30 focus:border-[#422462] h-9 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#200B43]">Permanent Address *</label>
            <Input
              placeholder="Enter permanent address"
              value={formData.permanentAddress}
              onChange={(e) => setFormData({ ...formData, permanentAddress: e.target.value })}
              className="border-[#937CB4]/30 focus:border-[#422462] h-9 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#200B43]">City *</label>
            <Input
              placeholder="Enter city"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="border-[#937CB4]/30 focus:border-[#422462] h-9 text-sm"
            />
          </div>
        </div>
      </div>
 
      <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/30 bg-gradient-to-br from-[#F0E9FF]/30 to-white p-4">
        <h3 className="font-bold text-[#200B43] mb-4 flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-[#937CB4] to-[#422462] flex items-center justify-center text-white text-xs font-bold">
            4
          </div>
          ID Proofs
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#200B43]">PAN Number *</label>
            <Input
              placeholder="Enter PAN number"
              value={formData.panNumber}
              onChange={(e) => setFormData({ ...formData, panNumber: e.target.value })}
              className="border-[#937CB4]/30 focus:border-[#422462] h-9 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#200B43]">Aadhar Number *</label>
            <Input
              placeholder="Enter Aadhar number"
              value={formData.aadharNumber}
              onChange={(e) => setFormData({ ...formData, aadharNumber: e.target.value })}
              className="border-[#937CB4]/30 focus:border-[#422462] h-9 text-sm"
            />
          </div>
        </div>
      </div>
 
      <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/30 bg-gradient-to-br from-[#F0E9FF]/30 to-white p-4">
        <h3 className="font-bold text-[#200B43] mb-4 flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-[#937CB4] to-[#422462] flex items-center justify-center text-white text-xs font-bold">
            5
          </div>
          Employment Information
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#200B43]">Position *</label>
            <Input
              placeholder="Enter position"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              className="border-[#937CB4]/30 focus:border-[#422462] h-9 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#200B43]">Date of Joining *</label>
            <Input
              type="date"
              value={formData.joiningDate}
              onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
              className="border-[#937CB4]/30 focus:border-[#422462] h-9 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#200B43]">Employee Type *</label>
            <Select
              value={formData.empType}
              onValueChange={(value) => setFormData({ ...formData, empType: value })}
            >
              <SelectTrigger className="border-[#937CB4]/30 focus:border-[#422462] h-9 text-sm">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Permanent">Permanent</SelectItem>
                <SelectItem value="Internship">Internship</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#200B43]">WFH Bucket (Days)</label>
            <Input
              type="number"
              placeholder="Enter WFH days"
              value={formData.wfhDays}
              onChange={(e) => setFormData({ ...formData, wfhDays: e.target.value })}
              className="border-[#937CB4]/30 focus:border-[#422462] h-9 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#200B43]">Leave Bucket (Days) *</label>
            <Input
              type="number"
              placeholder="Enter leave days"
              value={formData.leaveBalance}
              onChange={(e) => setFormData({ ...formData, leaveBalance: e.target.value })}
              className="border-[#937CB4]/30 focus:border-[#422462] h-9 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#200B43]">Salary *</label>
            <Input
              placeholder="Enter salary"
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              className="border-[#937CB4]/30 focus:border-[#422462] h-9 text-sm"
            />
          </div>
        </div>
      </div>
 
      <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/30 bg-gradient-to-br from-[#F0E9FF]/30 to-white p-4">
        <h3 className="font-bold text-[#200B43] mb-4 flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-[#937CB4] to-[#422462] flex items-center justify-center text-white text-xs font-bold">
            6
          </div>
          Account Information
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#200B43]">User Name/Email *</label>
            <Input
              type="email"
              placeholder="Enter username/email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="border-[#937CB4]/30 focus:border-[#422462] h-9 text-sm"
            />
          </div>
          {mode === "create" && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#200B43]">Password *</label>
              <Input
                type="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="border-[#937CB4]/30 focus:border-[#422462] h-9 text-sm"
              />
            </div>
          )}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#200B43]">Business Email *</label>
            <Input
              type="email"
              placeholder="Enter business email"
              value={formData.businessEmail}
              onChange={(e) => setFormData({ ...formData, businessEmail: e.target.value })}
              className="border-[#937CB4]/30 focus:border-[#422462] h-9 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#200B43]">Personal Email</label>
            <Input
              type="email"
              placeholder="Enter personal email"
              value={formData.personalEmail}
              onChange={(e) => setFormData({ ...formData, personalEmail: e.target.value })}
              className="border-[#937CB4]/30 focus:border-[#422462] h-9 text-sm"
            />
          </div>
        </div>
      </div>
 
      <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/30 bg-gradient-to-br from-[#F0E9FF]/30 to-white p-4">
        <h3 className="font-bold text-[#200B43] mb-4 flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-[#937CB4] to-[#422462] flex items-center justify-center text-white text-xs font-bold">
            7
          </div>
          Banking Information
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#200B43]">Bank Account Number *</label>
            <Input
              placeholder="Enter account number"
              value={formData.bankAccountNumber}
              onChange={(e) => setFormData({ ...formData, bankAccountNumber: e.target.value })}
              className="border-[#937CB4]/30 focus:border-[#422462] h-9 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#200B43]">Bank Name *</label>
            <Input
              placeholder="Enter bank name"
              value={formData.bankName}
              onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
              className="border-[#937CB4]/30 focus:border-[#422462] h-9 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#200B43]">IFSC Code *</label>
            <Input
              placeholder="Enter IFSC code"
              value={formData.ifscCode}
              onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })}
              className="border-[#937CB4]/30 focus:border-[#422462] h-9 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#200B43]">PF UAN Number</label>
            <Input
              placeholder="Enter PF UAN number"
              value={formData.pfUanNumber}
              onChange={(e) => setFormData({ ...formData, pfUanNumber: e.target.value })}
              className="border-[#937CB4]/30 focus:border-[#422462] h-9 text-sm"
            />
          </div>
        </div>
      </div>
 
      <div className="relative overflow-hidden rounded-xl border border-[#937CB4]/30 bg-gradient-to-br from-[#F0E9FF]/30 to-white p-4">
        <h3 className="font-bold text-[#200B43] mb-4 flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-[#937CB4] to-[#422462] flex items-center justify-center text-white text-xs font-bold">
            8
          </div>
          Profile Photo
        </h3>
        <div className="relative overflow-hidden rounded-lg border-2 border-dashed border-[#937CB4]/40 bg-gradient-to-br from-white to-[#F0E9FF]/20 p-6">
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#937CB4] to-[#422462] flex items-center justify-center shadow-lg">
                <Upload className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#200B43]">Upload Profile Photo (optional)</p>
              <p className="text-xs text-[#5A4079] mt-1">
                {formData.profileImage ? formData.profileImage.name : "Supported formats: JPG, PNG (Max 5MB)"}
              </p>
            </div>
            <label className="inline-flex items-center justify-center gap-2 cursor-pointer rounded-md border border-[#937CB4]/30 text-[#422462] hover:bg-[#F0E9FF] hover:text-[#422462] text-xs h-8 px-3 font-medium transition-all">
              <Upload className="h-3 w-3" />
              Choose File
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  setFormData({ ...formData, profileImage: e.target.files?.[0] ?? null })
                }
              />
            </label>
          </div>
        </div>
      </div>
 
      <div className="flex justify-end gap-3 pt-4 sticky bottom-0 bg-white/95 backdrop-blur-sm pb-2">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={submitting}
          className="border-[#937CB4]/30 text-[#422462] hover:bg-[#F0E9FF] hover:text-[#422462]"
        >
          Cancel
        </Button>
        <Button
          onClick={onSubmit}
          disabled={submitting}
          className="bg-gradient-to-r from-[#422462] to-[#937CB4] text-white hover:from-[#200B43] hover:to-[#422462]"
        >
          {submitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Plus className="mr-2 h-4 w-4" />
          )}
          {mode === "edit" ? "Save Changes" : "Create Employee"}
        </Button>
      </div>
    </div>
  );
}
