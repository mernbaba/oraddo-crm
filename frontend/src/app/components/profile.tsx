import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  Building2,
  Shield,
  Clock,
  Edit,
  Save,
  X,
  Camera,
  Award,
  TrendingUp,
  CheckCircle2,
  Target,
  Users,
  CreditCard,
  FileText,
  Home,
  Landmark
} from "lucide-react";
import { useEffect, useState } from "react";
import { employeeService } from "../services/employeeService";

// Default shape used while the API is loading or if the user record is missing fields.
// All values are blank/empty so that the UI never displays fake "Haritha Sree" data.
const EMPTY_PROFILE = {
  name: "",
  initials: "",
  employeeId: "",
  phone: "",
  alternatePhone: "",
  dateOfBirth: "",
  gender: "",
  religion: "",
  educationQualification: "",
  fatherHusbandName: "",
  fatherHusbandNumber: "",
  motherWifeName: "",
  motherWifeNumber: "",
  currentAddress: "",
  permanentAddress: "",
  city: "",
  panNumber: "",
  aadharNumber: "",
  position: "",
  department: "",
  joiningDate: "",
  empType: "",
  workFromHome: "",
  leaveBalance: "",
  salary: "",
  reportingTo: "",
  workHours: "",
  email: "",
  businessEmail: "",
  personalEmail: "",
  bankAccountNumber: "",
  bankName: "",
  ifscCode: "",
  pfUanNumber: "",
};

export function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState(EMPTY_PROFILE);

  const [editData, setEditData] = useState(EMPTY_PROFILE);

  // Helper: safely format a value or return "" for null/undefined
  const safe = (v: any): string => {
    if (v === null || v === undefined) return "";
    return String(v);
  };

  // Normalize any date value (ISO timestamp or "yyyy-MM-dd") into the
  // "yyyy-MM-dd" string an <input type="date"> expects. "" if blank/invalid.
  const toDateInput = (v: string): string => {
    if (!v) return "";
    const m = /^\d{4}-\d{2}-\d{2}/.exec(v);
    if (m) return m[0];
    const d = new Date(v);
    if (isNaN(d.getTime())) return "";
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  // Human-readable date for display; shows an em dash when missing/invalid
  // (prevents the "Invalid Date" text that new Date("") produces).
  const formatDate = (v: string): string => {
    const iso = toDateInput(v);
    if (!iso) return "—";
    const [y, mo, da] = iso.split("-").map(Number);
    return new Date(y, mo - 1, da).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Map an Employee API row into the local profile shape
  const mapEmployeeToProfile = (emp: any, fallbackName: string, fallbackInitials: string, fallbackPosition: string) => {
    const name = emp.emp_name || fallbackName;
    const initials =
      name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((p: string) => p[0]?.toUpperCase())
        .join("") || fallbackInitials;
    return {
      name,
      initials,
      employeeId: safe(emp.id ? `EMP-${emp.id}` : ""),
      phone: safe(emp.contact_number),
      alternatePhone: safe(emp.alternative_number),
      dateOfBirth: safe(emp.date_of_birth),
      gender: safe(emp.gender),
      religion: safe(emp.Religion),
      educationQualification: safe(emp.education_qualification),
      fatherHusbandName: safe(emp.father_or_husband_name),
      fatherHusbandNumber: safe(emp.father_or_husband_number),
      motherWifeName: safe(emp.mother_name),
      motherWifeNumber: safe(emp.mother_number),
      currentAddress: safe(emp.current_address),
      permanentAddress: safe(emp.permanent_address),
      city: safe(emp.city),
      panNumber: safe(emp.pancard),
      aadharNumber: safe(emp.adharnumber),
      position: safe(emp.position) || fallbackPosition,
      department: safe(emp.department),
      joiningDate: safe(emp.date_of_joining),
      empType: safe(emp.employee_type),
      workFromHome: emp.wfh_no_ofdays != null ? String(emp.wfh_no_ofdays) : "",
      leaveBalance: safe(emp.leave_balance),
      salary: emp.salary != null ? `₹${emp.salary}` : "",
      reportingTo: safe(emp.teamLeadId),
      workHours: "",
      email: safe(emp.personal_email),
      businessEmail: safe(emp.bussiness_email),
      personalEmail: safe(emp.personal_email),
      bankAccountNumber: safe(emp.bank_account),
      bankName: safe(emp.bank_name),
      ifscCode: safe(emp.IFSC_code),
      pfUanNumber: safe(emp.UAN_Number),
    };
  };

  useEffect(() => {
    const storedUser = sessionStorage.getItem("userData");
    const storedType = sessionStorage.getItem("userType");

    if (!storedUser) {
      setIsLoading(false);
      return;
    }

    let parsed: any = null;
    try {
      parsed = JSON.parse(storedUser);
    } catch (error) {
      console.error("Failed to parse userData from sessionStorage", error);
      setIsLoading(false);
      return;
    }

    const displayName = parsed?.fullName || parsed?.emp_name || "Employee";
    const displayInitials = displayName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part: string) => part[0]?.toUpperCase())
      .join("") || "E";

    const displayPosition =
      storedType === "admin"
        ? "Super Administrator"
        : storedType === "employee"
        ? "Employee"
        : "User";

    // Seed from sessionStorage so the UI is never blank
    const seed = {
      ...EMPTY_PROFILE,
      name: displayName,
      initials: displayInitials,
      position: displayPosition,
      email: parsed?.email || "",
      businessEmail: parsed?.email || "",
      personalEmail: parsed?.email || "",
    };
    setProfileData(seed);
    setEditData(seed);

    // Fetch full profile from API
    const employeeId = parsed?.id;
    if (employeeId) {
      employeeService
        .getEmployeeById(employeeId)
        .then((res) => {
          // GET /api/employees/:id responds with { employee, totalCounts, leaveCreation },
          // so the actual record lives under res.data.employee. Fall back to res.data
          // in case the endpoint is ever changed to return the row directly.
          const emp = res?.data?.employee ?? res?.data;
          if (emp) {
            const mapped = mapEmployeeToProfile(emp, displayName, displayInitials, displayPosition);
            setProfileData(mapped);
            setEditData(mapped);
          }
        })
        .catch((err) => {
          console.warn("Could not load employee profile from API; using session data.", err);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const raw = sessionStorage.getItem("userData");
      const parsed = raw ? JSON.parse(raw) : null;
      const employeeId = parsed?.id;
      if (employeeId) {
        // Map the form fields back to the API's snake_case model.
        // Only fields the backend's updateEmployeeProfile accepts are sent.
        const payload = {
          emp_name: editData.name,
          contact_number: editData.phone,
          alternative_number: editData.alternatePhone,
          date_of_birth: editData.dateOfBirth,
          gender: editData.gender,
          Religion: editData.religion,
          education_qualification: editData.educationQualification,
          father_or_husband_name: editData.fatherHusbandName,
          father_or_husband_number: editData.fatherHusbandNumber,
          mother_name: editData.motherWifeName,
          mother_number: editData.motherWifeNumber,
          current_address: editData.currentAddress,
          permanent_address: editData.permanentAddress,
          city: editData.city,
          pancard: editData.panNumber,
          adharnumber: editData.aadharNumber,
          position: editData.position,
          department: editData.department,
          date_of_joining: editData.joiningDate,
          employee_type: editData.empType,
          wfh_no_ofdays: editData.workFromHome,
          leave_balance: editData.leaveBalance,
          bank_account: editData.bankAccountNumber,
          bank_name: editData.bankName,
          IFSC_code: editData.ifscCode,
          UAN_Number: editData.pfUanNumber,
          personal_email: editData.personalEmail,
          bussiness_email: editData.businessEmail,
        };
        await employeeService.updateProfile(employeeId, payload);
      }
      setProfileData(editData);
      setIsEditing(false);
      alert("Profile updated successfully! ✅");
    } catch (err: any) {
      console.error("Profile save failed", err);
      alert(
        err?.response?.data?.message ||
          "Could not save profile. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  const stats = [
    { label: "Projects Completed", value: "24", icon: CheckCircle2, color: "text-green-600", bgColor: "bg-green-50" },
    { label: "Active Tasks", value: "12", icon: Target, color: "text-blue-600", bgColor: "bg-blue-50" },
    { label: "Team Members", value: "8", icon: User, color: "text-purple-600", bgColor: "bg-purple-50" },
    { label: "Performance", value: "94%", icon: TrendingUp, color: "text-orange-600", bgColor: "bg-orange-50" },
  ];

  const recentActivities = [
    { action: "Updated Dashboard Settings", time: "2 hours ago", type: "settings" },
    { action: "Completed Project Review", time: "5 hours ago", type: "project" },
    { action: "Approved Leave Request", time: "1 day ago", type: "approval" },
    { action: "Added New Team Member", time: "2 days ago", type: "team" },
  ];

  return (
    <div className="space-y-6 pb-8">

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#200B43] via-[#422462] to-[#937CB4] bg-clip-text text-transparent">
            My Profile
          </h1>
          <p className="text-[#5A4079] mt-1">Manage your personal information and preferences</p>
          {isLoading && (
            <p className="text-xs text-[#937CB4] mt-1">Loading profile…</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <Button 
              className="bg-gradient-to-r from-[#422462] to-[#937CB4] text-white"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <>
              <Button 
                variant="outline"
                className="border-[#937CB4] text-[#422462]"
                onClick={handleCancel}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                className="bg-gradient-to-r from-green-600 to-green-500 text-white"
                onClick={handleSave}
                disabled={isSaving}
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </>
          )}
        </div>
      </div>
 
      <Card className="gradient-card border-[#937CB4]/30">
        <CardContent className="pt-6">
          <div className="flex items-start gap-6 flex-wrap">
 
            <div className="relative">
              <div className="h-32 w-32 rounded-full bg-gradient-to-br from-[#937CB4] to-[#422462] flex items-center justify-center text-white text-4xl font-bold shadow-xl ring-4 ring-[#F0E9FF]">
                {profileData.initials}
              </div>
              {isEditing && (
                <Button 
                  size="sm" 
                  className="absolute bottom-0 right-0 h-10 w-10 rounded-full bg-[#422462] text-white p-0 shadow-lg"
                >
                  <Camera className="h-5 w-5" />
                </Button>
              )}
            </div>
 
            <div className="flex-1 space-y-4">
              <div>
                {isEditing ? (
                  <Input 
                    value={editData.name}
                    onChange={(e) => setEditData({...editData, name: e.target.value})}
                    className="text-2xl font-bold text-[#200B43] border-[#937CB4] mb-2"
                  />
                ) : (
                  <h2 className="text-2xl font-bold text-[#200B43]">{profileData.name}</h2>
                )}
                <p className="text-[#5A4079] flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  <span>{profileData.position}</span>
                </p>
              </div>
 
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-[#F0E9FF]/30">
                  <Shield className="h-5 w-5 text-[#422462]" />
                  <div className="flex-1">
                    <p className="text-xs text-[#5A4079]">Employee ID</p>
                    <p className="font-semibold text-[#200B43]">{profileData.employeeId}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-[#F0E9FF]/30">
                  <Building2 className="h-5 w-5 text-[#422462]" />
                  <div className="flex-1">
                    <p className="text-xs text-[#5A4079]">Department</p>
                    <p className="font-semibold text-[#200B43]">{profileData.department}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-[#F0E9FF]/30">
                  <Calendar className="h-5 w-5 text-[#422462]" />
                  <div className="flex-1">
                    <p className="text-xs text-[#5A4079]">Join Date</p>
                    <p className="font-semibold text-[#200B43]">
                      {formatDate(profileData.joiningDate)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
 
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="gradient-card border-[#937CB4]/30">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className={`h-14 w-14 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`h-7 w-7 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#200B43]">{stat.value}</p>
                  <p className="text-xs text-[#5A4079]">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
 
      <div className="grid gap-6 lg:grid-cols-2">
 
        <Card className="gradient-card border-[#937CB4]/30">
          <CardHeader>
            <CardTitle className="text-lg text-[#200B43] flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#937CB4] to-[#422462] flex items-center justify-center text-white text-sm font-bold">
                1
              </div>
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-[#F0E9FF]/30">
                <p className="text-xs text-[#5A4079] mb-1">Contact Number</p>
                {isEditing ? (
                  <Input 
                    value={editData.phone}
                    onChange={(e) => setEditData({...editData, phone: e.target.value})}
                    className="border-[#937CB4]/30 text-sm"
                  />
                ) : (
                  <p className="font-semibold text-[#200B43]">{profileData.phone}</p>
                )}
              </div>

              <div className="p-3 rounded-lg bg-[#F0E9FF]/30">
                <p className="text-xs text-[#5A4079] mb-1">Alternate Number</p>
                {isEditing ? (
                  <Input 
                    value={editData.alternatePhone}
                    onChange={(e) => setEditData({...editData, alternatePhone: e.target.value})}
                    className="border-[#937CB4]/30 text-sm"
                  />
                ) : (
                  <p className="font-semibold text-[#200B43]">{profileData.alternatePhone}</p>
                )}
              </div>

              <div className="p-3 rounded-lg bg-[#F0E9FF]/30">
                <p className="text-xs text-[#5A4079] mb-1">Date of Birth</p>
                {isEditing ? (
                  <Input 
                    type="date"
                    value={toDateInput(editData.dateOfBirth)}
                    onChange={(e) => setEditData({...editData, dateOfBirth: e.target.value})}
                    className="border-[#937CB4]/30 text-sm"
                  />
                ) : (
                  <p className="font-semibold text-[#200B43]">
                    {formatDate(profileData.dateOfBirth)}
                  </p>
                )}
              </div>

              <div className="p-3 rounded-lg bg-[#F0E9FF]/30">
                <p className="text-xs text-[#5A4079] mb-1">Gender</p>
                {isEditing ? (
                  <Select
                    value={editData.gender}
                    onValueChange={(value) => setEditData({...editData, gender: value})}
                  >
                    <SelectTrigger className="border-[#937CB4]/30 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Others">Other</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="font-semibold text-[#200B43]">{profileData.gender}</p>
                )}
              </div>

              <div className="p-3 rounded-lg bg-[#F0E9FF]/30">
                <p className="text-xs text-[#5A4079] mb-1">Religion</p>
                {isEditing ? (
                  <Input 
                    value={editData.religion}
                    onChange={(e) => setEditData({...editData, religion: e.target.value})}
                    className="border-[#937CB4]/30 text-sm"
                  />
                ) : (
                  <p className="font-semibold text-[#200B43]">{profileData.religion}</p>
                )}
              </div>

              <div className="p-3 rounded-lg bg-[#F0E9FF]/30">
                <p className="text-xs text-[#5A4079] mb-1">Education Qualification</p>
                {isEditing ? (
                  <Input 
                    value={editData.educationQualification}
                    onChange={(e) => setEditData({...editData, educationQualification: e.target.value})}
                    className="border-[#937CB4]/30 text-sm"
                  />
                ) : (
                  <p className="font-semibold text-[#200B43]">{profileData.educationQualification}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
 
        <Card className="gradient-card border-[#937CB4]/30">
          <CardHeader>
            <CardTitle className="text-lg text-[#200B43] flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#937CB4] to-[#422462] flex items-center justify-center text-white text-sm font-bold">
                2
              </div>
              Family Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-[#F0E9FF]/30">
                <p className="text-xs text-[#5A4079] mb-1">Father/Husband Name</p>
                {isEditing ? (
                  <Input 
                    value={editData.fatherHusbandName}
                    onChange={(e) => setEditData({...editData, fatherHusbandName: e.target.value})}
                    className="border-[#937CB4]/30 text-sm"
                  />
                ) : (
                  <p className="font-semibold text-[#200B43]">{profileData.fatherHusbandName}</p>
                )}
              </div>

              <div className="p-3 rounded-lg bg-[#F0E9FF]/30">
                <p className="text-xs text-[#5A4079] mb-1">Father/Husband Number</p>
                {isEditing ? (
                  <Input 
                    value={editData.fatherHusbandNumber}
                    onChange={(e) => setEditData({...editData, fatherHusbandNumber: e.target.value})}
                    className="border-[#937CB4]/30 text-sm"
                  />
                ) : (
                  <p className="font-semibold text-[#200B43]">{profileData.fatherHusbandNumber}</p>
                )}
              </div>

              <div className="p-3 rounded-lg bg-[#F0E9FF]/30">
                <p className="text-xs text-[#5A4079] mb-1">Mother/Wife Name</p>
                {isEditing ? (
                  <Input 
                    value={editData.motherWifeName}
                    onChange={(e) => setEditData({...editData, motherWifeName: e.target.value})}
                    className="border-[#937CB4]/30 text-sm"
                  />
                ) : (
                  <p className="font-semibold text-[#200B43]">{profileData.motherWifeName}</p>
                )}
              </div>

              <div className="p-3 rounded-lg bg-[#F0E9FF]/30">
                <p className="text-xs text-[#5A4079] mb-1">Mother/Wife Number</p>
                {isEditing ? (
                  <Input 
                    value={editData.motherWifeNumber}
                    onChange={(e) => setEditData({...editData, motherWifeNumber: e.target.value})}
                    className="border-[#937CB4]/30 text-sm"
                  />
                ) : (
                  <p className="font-semibold text-[#200B43]">{profileData.motherWifeNumber}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
 
        <Card className="gradient-card border-[#937CB4]/30">
          <CardHeader>
            <CardTitle className="text-lg text-[#200B43] flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#937CB4] to-[#422462] flex items-center justify-center text-white text-sm font-bold">
                3
              </div>
              Address Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-[#F0E9FF]/30">
                <p className="text-xs text-[#5A4079] mb-1">Current Address</p>
                {isEditing ? (
                  <Input 
                    value={editData.currentAddress}
                    onChange={(e) => setEditData({...editData, currentAddress: e.target.value})}
                    className="border-[#937CB4]/30 text-sm"
                  />
                ) : (
                  <p className="font-semibold text-[#200B43]">{profileData.currentAddress}</p>
                )}
              </div>

              <div className="p-3 rounded-lg bg-[#F0E9FF]/30">
                <p className="text-xs text-[#5A4079] mb-1">Permanent Address</p>
                {isEditing ? (
                  <Input 
                    value={editData.permanentAddress}
                    onChange={(e) => setEditData({...editData, permanentAddress: e.target.value})}
                    className="border-[#937CB4]/30 text-sm"
                  />
                ) : (
                  <p className="font-semibold text-[#200B43]">{profileData.permanentAddress}</p>
                )}
              </div>

              <div className="p-3 rounded-lg bg-[#F0E9FF]/30">
                <p className="text-xs text-[#5A4079] mb-1">City</p>
                {isEditing ? (
                  <Input 
                    value={editData.city}
                    onChange={(e) => setEditData({...editData, city: e.target.value})}
                    className="border-[#937CB4]/30 text-sm"
                  />
                ) : (
                  <p className="font-semibold text-[#200B43]">{profileData.city}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
 
        <Card className="gradient-card border-[#937CB4]/30">
          <CardHeader>
            <CardTitle className="text-lg text-[#200B43] flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#937CB4] to-[#422462] flex items-center justify-center text-white text-sm font-bold">
                4
              </div>
              ID Proofs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-[#F0E9FF]/30">
                <p className="text-xs text-[#5A4079] mb-1">PAN Number</p>
                {isEditing ? (
                  <Input 
                    value={editData.panNumber}
                    onChange={(e) => setEditData({...editData, panNumber: e.target.value})}
                    className="border-[#937CB4]/30 text-sm"
                  />
                ) : (
                  <p className="font-semibold text-[#200B43]">{profileData.panNumber}</p>
                )}
              </div>

              <div className="p-3 rounded-lg bg-[#F0E9FF]/30">
                <p className="text-xs text-[#5A4079] mb-1">Aadhar Number</p>
                {isEditing ? (
                  <Input 
                    value={editData.aadharNumber}
                    onChange={(e) => setEditData({...editData, aadharNumber: e.target.value})}
                    className="border-[#937CB4]/30 text-sm"
                  />
                ) : (
                  <p className="font-semibold text-[#200B43]">{profileData.aadharNumber}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
 
        <Card className="gradient-card border-[#937CB4]/30">
          <CardHeader>
            <CardTitle className="text-lg text-[#200B43] flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#937CB4] to-[#422462] flex items-center justify-center text-white text-sm font-bold">
                5
              </div>
              Employment Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-[#F0E9FF]/30">
                <p className="text-xs text-[#5A4079] mb-1">Position</p>
                {isEditing ? (
                  <Input 
                    value={editData.position}
                    onChange={(e) => setEditData({...editData, position: e.target.value})}
                    className="border-[#937CB4]/30 text-sm"
                  />
                ) : (
                  <p className="font-semibold text-[#200B43]">{profileData.position}</p>
                )}
              </div>

              <div className="p-3 rounded-lg bg-[#F0E9FF]/30">
                <p className="text-xs text-[#5A4079] mb-1">Date of Joining</p>
                {isEditing ? (
                  <Input 
                    type="date"
                    value={toDateInput(editData.joiningDate)}
                    onChange={(e) => setEditData({...editData, joiningDate: e.target.value})}
                    className="border-[#937CB4]/30 text-sm"
                  />
                ) : (
                  <p className="font-semibold text-[#200B43]">
                    {formatDate(profileData.joiningDate)}
                  </p>
                )}
              </div>

              <div className="p-3 rounded-lg bg-[#F0E9FF]/30">
                <p className="text-xs text-[#5A4079] mb-1">Employee Type</p>
                {isEditing ? (
                  <Select
                    value={editData.empType}
                    onValueChange={(value) => setEditData({...editData, empType: value})}
                  >
                    <SelectTrigger className="border-[#937CB4]/30 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Internship">Internship</SelectItem>
                      <SelectItem value="Permanent">Permanent</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="font-semibold text-[#200B43]">{profileData.empType}</p>
                )}
              </div>

              <div className="p-3 rounded-lg bg-[#F0E9FF]/30">
                <p className="text-xs text-[#5A4079] mb-1">Work From Home (Days/Week)</p>
                {isEditing ? (
                  <Input
                    type="number"
                    value={editData.workFromHome}
                    onChange={(e) => setEditData({...editData, workFromHome: e.target.value})}
                    className="border-[#937CB4]/30 text-sm"
                  />
                ) : (
                  <p className="font-semibold text-[#200B43]">{profileData.workFromHome}</p>
                )}
              </div>

              <div className="p-3 rounded-lg bg-[#F0E9FF]/30">
                <p className="text-xs text-[#5A4079] mb-1">Leave Balance (Days)</p>
                {isEditing ? (
                  <Input 
                    type="number"
                    value={editData.leaveBalance}
                    onChange={(e) => setEditData({...editData, leaveBalance: e.target.value})}
                    className="border-[#937CB4]/30 text-sm"
                  />
                ) : (
                  <p className="font-semibold text-[#200B43]">{profileData.leaveBalance} Days</p>
                )}
              </div>

              <div className="p-3 rounded-lg bg-[#F0E9FF]/30">
                <p className="text-xs text-[#5A4079] mb-1">Salary</p>
                <p className="font-semibold text-[#200B43]">{profileData.salary}</p>
              </div>

              <div className="p-3 rounded-lg bg-[#F0E9FF]/30">
                <p className="text-xs text-[#5A4079] mb-1">Reporting To</p>
                <p className="font-semibold text-[#200B43]">{profileData.reportingTo}</p>
              </div>

              <div className="p-3 rounded-lg bg-[#F0E9FF]/30">
                <p className="text-xs text-[#5A4079] mb-1">Work Hours</p>
                <p className="font-semibold text-[#200B43]">{profileData.workHours}</p>
              </div>
            </div>
          </CardContent>
        </Card>
 
        <Card className="gradient-card border-[#937CB4]/30">
          <CardHeader>
            <CardTitle className="text-lg text-[#200B43] flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#937CB4] to-[#422462] flex items-center justify-center text-white text-sm font-bold">
                6
              </div>
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-[#F0E9FF]/30">
                <p className="text-xs text-[#5A4079] mb-1">User Email</p>
                <p className="font-semibold text-[#200B43]">{profileData.email}</p>
              </div>

              <div className="p-3 rounded-lg bg-[#F0E9FF]/30">
                <p className="text-xs text-[#5A4079] mb-1">Business Email</p>
                {isEditing ? (
                  <Input 
                    type="email"
                    value={editData.businessEmail}
                    onChange={(e) => setEditData({...editData, businessEmail: e.target.value})}
                    className="border-[#937CB4]/30 text-sm"
                  />
                ) : (
                  <p className="font-semibold text-[#200B43]">{profileData.businessEmail}</p>
                )}
              </div>

              <div className="p-3 rounded-lg bg-[#F0E9FF]/30">
                <p className="text-xs text-[#5A4079] mb-1">Personal Email</p>
                {isEditing ? (
                  <Input 
                    type="email"
                    value={editData.personalEmail}
                    onChange={(e) => setEditData({...editData, personalEmail: e.target.value})}
                    className="border-[#937CB4]/30 text-sm"
                  />
                ) : (
                  <p className="font-semibold text-[#200B43]">{profileData.personalEmail}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
 
        <Card className="gradient-card border-[#937CB4]/30">
          <CardHeader>
            <CardTitle className="text-lg text-[#200B43] flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#937CB4] to-[#422462] flex items-center justify-center text-white text-sm font-bold">
                7
              </div>
              Banking Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-[#F0E9FF]/30">
                <p className="text-xs text-[#5A4079] mb-1">Bank Account Number</p>
                {isEditing ? (
                  <Input 
                    value={editData.bankAccountNumber}
                    onChange={(e) => setEditData({...editData, bankAccountNumber: e.target.value})}
                    className="border-[#937CB4]/30 text-sm"
                  />
                ) : (
                  <p className="font-semibold text-[#200B43]">{profileData.bankAccountNumber}</p>
                )}
              </div>

              <div className="p-3 rounded-lg bg-[#F0E9FF]/30">
                <p className="text-xs text-[#5A4079] mb-1">Bank Name</p>
                {isEditing ? (
                  <Input 
                    value={editData.bankName}
                    onChange={(e) => setEditData({...editData, bankName: e.target.value})}
                    className="border-[#937CB4]/30 text-sm"
                  />
                ) : (
                  <p className="font-semibold text-[#200B43]">{profileData.bankName}</p>
                )}
              </div>

              <div className="p-3 rounded-lg bg-[#F0E9FF]/30">
                <p className="text-xs text-[#5A4079] mb-1">IFSC Code</p>
                {isEditing ? (
                  <Input 
                    value={editData.ifscCode}
                    onChange={(e) => setEditData({...editData, ifscCode: e.target.value})}
                    className="border-[#937CB4]/30 text-sm"
                  />
                ) : (
                  <p className="font-semibold text-[#200B43]">{profileData.ifscCode}</p>
                )}
              </div>

              <div className="p-3 rounded-lg bg-[#F0E9FF]/30">
                <p className="text-xs text-[#5A4079] mb-1">PF UAN Number</p>
                {isEditing ? (
                  <Input 
                    value={editData.pfUanNumber}
                    onChange={(e) => setEditData({...editData, pfUanNumber: e.target.value})}
                    className="border-[#937CB4]/30 text-sm"
                  />
                ) : (
                  <p className="font-semibold text-[#200B43]">{profileData.pfUanNumber}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
 
      <div className="grid gap-6 lg:grid-cols-2">
 
        <Card className="gradient-card border-[#937CB4]/30">
          <CardHeader>
            <CardTitle className="text-lg text-[#200B43] flex items-center gap-2">
              <Clock className="h-5 w-5 text-[#422462]" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-[#F0E9FF]/50 to-transparent border border-[#937CB4]/20"
                >
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#422462] to-[#937CB4] flex items-center justify-center text-white">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-[#200B43] text-sm">{activity.action}</p>
                    <p className="text-xs text-[#5A4079]">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
 
        <Card className="gradient-card border-[#937CB4]/30">
          <CardHeader>
            <CardTitle className="text-lg text-[#200B43] flex items-center gap-2">
              <Award className="h-5 w-5 text-[#422462]" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-lg bg-gradient-to-br from-yellow-50 to-transparent text-center border border-yellow-200">
                <Award className="h-10 w-10 mx-auto mb-2 text-yellow-600" />
                <p className="text-xs font-semibold text-[#200B43]">Top Performer</p>
                <p className="text-xs text-[#5A4079]">Q3 2024</p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-transparent text-center border border-blue-200">
                <Award className="h-10 w-10 mx-auto mb-2 text-blue-600" />
                <p className="text-xs font-semibold text-[#200B43]">Team Player</p>
                <p className="text-xs text-[#5A4079]">2024</p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-transparent text-center border border-green-200">
                <Award className="h-10 w-10 mx-auto mb-2 text-green-600" />
                <p className="text-xs font-semibold text-[#200B43]">100% Attendance</p>
                <p className="text-xs text-[#5A4079]">6 Months</p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-transparent text-center border border-purple-200">
                <Award className="h-10 w-10 mx-auto mb-2 text-purple-600" />
                <p className="text-xs font-semibold text-[#200B43]">Innovation Award</p>
                <p className="text-xs text-[#5A4079]">2024</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}