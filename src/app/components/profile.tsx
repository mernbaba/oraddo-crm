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

export function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
 
    name: "Haritha Sree",
    initials: "HS",
    employeeId: "EMP-2024-001",
    
 
    phone: "+91 98765 43210",
    alternatePhone: "+91 87654 32109",
    dateOfBirth: "1995-05-15",
    gender: "Female",
    religion: "Hindu",
    educationQualification: "B.Tech in Computer Science",
    
 
    fatherHusbandName: "Rajesh Kumar",
    fatherHusbandNumber: "+91 98765 11111",
    motherWifeName: "Lakshmi Devi",
    motherWifeNumber: "+91 98765 22222",
    
 
    currentAddress: "Flat 204, Green Valley Apartments, Bandra West",
    permanentAddress: "Plot 45, MG Road, Secunderabad",
    city: "Mumbai",
 
    panNumber: "ABCDE1234F",
    aadharNumber: "1234 5678 9012",
 
    position: "System Administrator",
    department: "IT & Operations",
    joiningDate: "2023-01-15",
    empType: "Full-Time",
    workFromHome: "Yes",
    leaveBalance: "18",
    salary: "₹95,000",
    reportingTo: "CEO",
    workHours: "09:00 AM - 06:00 PM",
 
    email: "haritha.sree@tridizi.com",
    businessEmail: "haritha.sree@company.com",
    personalEmail: "haritha95@gmail.com",
    
 
    bankAccountNumber: "1234567890123456",
    bankName: "HDFC Bank",
    ifscCode: "HDFC0001234",
    pfUanNumber: "101234567890",
  });

  const [editData, setEditData] = useState(profileData);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("userData");
    const storedType = sessionStorage.getItem("userType");

    if (!storedUser) return;

    try {
      const parsed = JSON.parse(storedUser);
      const displayName = parsed?.fullName || parsed?.emp_name || "Employee";
      const displayInitials = displayName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part: string) => part[0]?.toUpperCase())
        .join("") || "E";

      const displayPosition =
        storedType === "admin" ? "Super Administrator" : storedType === "employee" ? "Employee" : "User";

      setProfileData((prev) => ({
        ...prev,
        name: displayName,
        initials: displayInitials,
        position: displayPosition,
        email: parsed?.email || prev.email,
        businessEmail: parsed?.email || prev.businessEmail,
        personalEmail: parsed?.email || prev.personalEmail,
      }));

      setEditData((prev) => ({
        ...prev,
        name: displayName,
        initials: displayInitials,
        position: displayPosition,
        email: parsed?.email || prev.email,
        businessEmail: parsed?.email || prev.businessEmail,
        personalEmail: parsed?.email || prev.personalEmail,
      }));
    } catch (error) {
      console.error("Failed to parse userData from sessionStorage", error);
    }
  }, []);

  const handleSave = () => {
    setProfileData(editData);
    setIsEditing(false);
    alert("Profile updated successfully! ✅");
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
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
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
                      {new Date(profileData.joiningDate).toLocaleDateString('en-IN', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
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
                    value={editData.dateOfBirth}
                    onChange={(e) => setEditData({...editData, dateOfBirth: e.target.value})}
                    className="border-[#937CB4]/30 text-sm"
                  />
                ) : (
                  <p className="font-semibold text-[#200B43]">
                    {new Date(profileData.dateOfBirth).toLocaleDateString('en-IN', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
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
                      <SelectItem value="Other">Other</SelectItem>
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
                    value={editData.joiningDate}
                    onChange={(e) => setEditData({...editData, joiningDate: e.target.value})}
                    className="border-[#937CB4]/30 text-sm"
                  />
                ) : (
                  <p className="font-semibold text-[#200B43]">
                    {new Date(profileData.joiningDate).toLocaleDateString('en-IN', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
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
                      <SelectItem value="Full-Time">Full-Time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Part-Time">Part-Time</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="font-semibold text-[#200B43]">{profileData.empType}</p>
                )}
              </div>

              <div className="p-3 rounded-lg bg-[#F0E9FF]/30">
                <p className="text-xs text-[#5A4079] mb-1">Work From Home</p>
                {isEditing ? (
                  <Select
                    value={editData.workFromHome}
                    onValueChange={(value) => setEditData({...editData, workFromHome: value})}
                  >
                    <SelectTrigger className="border-[#937CB4]/30 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
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
                {isEditing ? (
                  <Input 
                    value={editData.reportingTo}
                    onChange={(e) => setEditData({...editData, reportingTo: e.target.value})}
                    className="border-[#937CB4]/30 text-sm"
                  />
                ) : (
                  <p className="font-semibold text-[#200B43]">{profileData.reportingTo}</p>
                )}
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
                {isEditing ? (
                  <Input 
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData({...editData, email: e.target.value})}
                    className="border-[#937CB4]/30 text-sm"
                  />
                ) : (
                  <p className="font-semibold text-[#200B43]">{profileData.email}</p>
                )}
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