import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Modal } from "../ui/modal";
import {
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  Ban,
  CheckCircle,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  Filter,
  Download,
  Sparkles,
  X
} from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  plan: "Free" | "Basic" | "Pro" | "Enterprise";
  status: "active" | "inactive" | "suspended";
  joinDate: string;
  lastActive: string;
  mrr: number;
  company?: string;
}

export function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPlan, setFilterPlan] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showUserModal, setShowUserModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [changingPlanUser, setChangingPlanUser] = useState<User | null>(null);
  const [newPlan, setNewPlan] = useState<string>("");

  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    plan: "Free" as User["plan"],
    status: "active" as User["status"]
  });

  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@techcorp.com",
      phone: "+1 (555) 123-4567",
      plan: "Enterprise",
      status: "active",
      joinDate: "2024-01-15",
      lastActive: "2 hours ago",
      mrr: 299,
      company: "TechCorp Industries"
    },
    {
      id: 2,
      name: "Sarah Smith",
      email: "sarah.smith@startup.io",
      phone: "+1 (555) 234-5678",
      plan: "Pro",
      status: "active",
      joinDate: "2024-02-20",
      lastActive: "5 minutes ago",
      mrr: 99,
      company: "Startup.io"
    },
    {
      id: 3,
      name: "Mike Chen",
      email: "mike.chen@email.com",
      phone: "+1 (555) 345-6789",
      plan: "Basic",
      status: "active",
      joinDate: "2024-03-10",
      lastActive: "1 day ago",
      mrr: 29,
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily.davis@company.com",
      phone: "+1 (555) 456-7890",
      plan: "Pro",
      status: "active",
      joinDate: "2024-01-08",
      lastActive: "3 hours ago",
      mrr: 99,
      company: "Davis & Co"
    },
    {
      id: 5,
      name: "Tom Brown",
      email: "tom.brown@email.com",
      phone: "+1 (555) 567-8901",
      plan: "Free",
      status: "inactive",
      joinDate: "2024-04-15",
      lastActive: "2 weeks ago",
      mrr: 0,
    },
    {
      id: 6,
      name: "Lisa Wang",
      email: "lisa.wang@enterprise.com",
      phone: "+1 (555) 678-9012",
      plan: "Enterprise",
      status: "active",
      joinDate: "2023-12-01",
      lastActive: "30 minutes ago",
      mrr: 299,
      company: "Wang Enterprises"
    },
  ]);

  const stats = [
    { label: "Total Users", value: users.length, gradient: "from-[#422462] to-[#5A4079]" },
    { label: "Active", value: users.filter(u => u.status === "active").length, gradient: "from-[#5A4079] to-[#937CB4]" },
    { label: "Paying", value: users.filter(u => u.mrr > 0).length, gradient: "from-[#937CB4] to-[#5A4079]" },
    { label: "Total MRR", value: `$${users.reduce((sum, u) => sum + u.mrr, 0)}`, gradient: "from-[#422462] to-[#937CB4]" },
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.company?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlan = filterPlan === "all" || user.plan === filterPlan;
    const matchesStatus = filterStatus === "all" || user.status === filterStatus;
    return matchesSearch && matchesPlan && matchesStatus;
  });

  const handleAddUser = () => {
    setEditingUser(null);
    setUserForm({
      name: "",
      email: "",
      phone: "",
      company: "",
      plan: "Free",
      status: "active"
    });
    setShowUserModal(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      company: user.company || "",
      plan: user.plan,
      status: user.status
    });
    setShowUserModal(true);
  };

  const handleSaveUser = () => {
    if (!userForm.name || !userForm.email) return;

    const mrr = userForm.plan === "Free" ? 0 :
                userForm.plan === "Basic" ? 29 :
                userForm.plan === "Pro" ? 99 : 299;

    const newUser: User = {
      id: editingUser ? editingUser.id : Math.max(...users.map(u => u.id), 0) + 1,
      name: userForm.name,
      email: userForm.email,
      phone: userForm.phone,
      company: userForm.company || undefined,
      plan: userForm.plan,
      status: userForm.status,
      joinDate: editingUser ? editingUser.joinDate : new Date().toISOString().split("T")[0],
      lastActive: editingUser ? editingUser.lastActive : "Just now",
      mrr
    };

    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? newUser : u));
    } else {
      setUsers([...users, newUser]);
    }

    setShowUserModal(false);
  };

  const handleDeleteUser = (userId: number) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  const handleSuspendUser = (userId: number) => {
    setUsers(users.map(u =>
      u.id === userId ? { ...u, status: u.status === "suspended" ? "active" : "suspended" as User["status"] } : u
    ));
  };

  const handleChangePlan = (user: User) => {
    setChangingPlanUser(user);
    setNewPlan(user.plan);
    setShowPlanModal(true);
  };

  const handleSavePlanChange = () => {
    if (!changingPlanUser) return;

    const mrr = newPlan === "Free" ? 0 :
                newPlan === "Basic" ? 29 :
                newPlan === "Pro" ? 99 : 299;

    setUsers(users.map(u =>
      u.id === changingPlanUser.id ? { ...u, plan: newPlan as User["plan"], mrr } : u
    ));

    setShowPlanModal(false);
    setChangingPlanUser(null);
  };

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case "Free": return "bg-[#958CA7] text-white";
      case "Basic": return "bg-[#937CB4] text-white";
      case "Pro": return "bg-[#5A4079] text-white";
      case "Enterprise": return "bg-[#422462] text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500 text-white";
      case "inactive": return "bg-gray-500 text-white";
      case "suspended": return "bg-red-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
            <div className="relative z-10">
              <p className="text-sm text-[#5A4079] mb-1">{stat.label}</p>
              <h3 className="text-3xl font-bold text-[#200B43]">{stat.value}</h3>
            </div>
            <div className="absolute top-2 right-2">
              <Sparkles className="h-5 w-5 text-[#937CB4] opacity-40 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
      </div>

      <Card className="gradient-card border-[#937CB4]/30">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5A4079]" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#937CB4]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[#937CB4] text-[#200B43]"
                />
              </div>
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <select
                value={filterPlan}
                onChange={(e) => setFilterPlan(e.target.value)}
                className="px-4 py-2 rounded-lg border border-[#937CB4]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[#937CB4] text-[#200B43]"
              >
                <option value="all">All Plans</option>
                <option value="Free">Free</option>
                <option value="Basic">Basic</option>
                <option value="Pro">Pro</option>
                <option value="Enterprise">Enterprise</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 rounded-lg border border-[#937CB4]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[#937CB4] text-[#200B43]"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>

              <Button
                variant="outline"
                className="border-[#937CB4]/30 hover:bg-[#F0E9FF]"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>

              <Button
                className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#5A4079] hover:to-[#422462]"
                onClick={handleAddUser}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="gradient-card gradient-card-hover border-[#937CB4]/30">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#422462] to-[#5A4079] flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {user.name.split(" ").map(n => n[0]).join("")}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg text-[#200B43]">{user.name}</h3>
                      <Badge className={getPlanBadgeColor(user.plan)}>
                        {user.plan}
                      </Badge>
                      <Badge className={getStatusBadgeColor(user.status)}>
                        {user.status}
                      </Badge>
                    </div>

                    {user.company && (
                      <p className="text-sm text-[#5A4079] font-medium mb-2">{user.company}</p>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-[#5A4079]">
                        <Mail className="h-4 w-4" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#5A4079]">
                        <Phone className="h-4 w-4" />
                        <span>{user.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#5A4079]">
                        <Calendar className="h-4 w-4" />
                        <span>Joined: {user.joinDate}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#5A4079]">
                        <CreditCard className="h-4 w-4" />
                        <span>MRR: ${user.mrr}</span>
                      </div>
                    </div>

                    <div className="mt-2 text-xs text-[#958CA7]">
                      Last active: {user.lastActive}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[#937CB4]/30 hover:bg-[#F0E9FF]"
                    onClick={() => handleChangePlan(user)}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Change Plan
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[#937CB4]/30 hover:bg-[#F0E9FF]"
                    onClick={() => handleEditUser(user)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className={`border-[#937CB4]/30 ${user.status === "suspended" ? "bg-green-50 hover:bg-green-100" : "bg-yellow-50 hover:bg-yellow-100"}`}
                    onClick={() => handleSuspendUser(user.id)}
                  >
                    <Ban className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-300 hover:bg-red-50"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredUsers.length === 0 && (
          <Card className="gradient-card border-[#937CB4]/30">
            <CardContent className="py-12 text-center">
              <Users className="h-12 w-12 text-[#937CB4] mx-auto mb-4" />
              <p className="text-[#5A4079]">No users found matching your filters</p>
            </CardContent>
          </Card>
        )}
      </div>

      {showUserModal && (
        <Modal
          isOpen={showUserModal}
          onClose={() => setShowUserModal(false)}
          title={editingUser ? "Edit User" : "Add New User"}
          size="lg"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#200B43] mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={userForm.name}
                onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#200B43] mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={userForm.email}
                onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#200B43] mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={userForm.phone}
                onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#200B43] mb-2">
                Company
              </label>
              <input
                type="text"
                value={userForm.company}
                onChange={(e) => setUserForm({ ...userForm, company: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                placeholder="Company Name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#200B43] mb-2">
                  Plan
                </label>
                <select
                  value={userForm.plan}
                  onChange={(e) => setUserForm({ ...userForm, plan: e.target.value as User["plan"] })}
                  className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                >
                  <option value="Free">Free</option>
                  <option value="Basic">Basic - $29/mo</option>
                  <option value="Pro">Pro - $99/mo</option>
                  <option value="Enterprise">Enterprise - $299/mo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#200B43] mb-2">
                  Status
                </label>
                <select
                  value={userForm.status}
                  onChange={(e) => setUserForm({ ...userForm, status: e.target.value as User["status"] })}
                  className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowUserModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white"
                onClick={handleSaveUser}
                disabled={!userForm.name || !userForm.email}
              >
                {editingUser ? "Update User" : "Create User"}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {showPlanModal && changingPlanUser && (
        <Modal
          isOpen={showPlanModal}
          onClose={() => setShowPlanModal(false)}
          title="Change Subscription Plan"
          size="md"
        >
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-[#F0E9FF] border border-[#937CB4]/30">
              <p className="text-sm text-[#5A4079]">Changing plan for:</p>
              <p className="font-semibold text-[#200B43]">{changingPlanUser.name}</p>
              <p className="text-sm text-[#5A4079]">{changingPlanUser.email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#200B43] mb-2">
                New Plan
              </label>
              <select
                value={newPlan}
                onChange={(e) => setNewPlan(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
              >
                <option value="Free">Free - $0/mo</option>
                <option value="Basic">Basic - $29/mo</option>
                <option value="Pro">Pro - $99/mo</option>
                <option value="Enterprise">Enterprise - $299/mo</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowPlanModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white"
                onClick={handleSavePlanChange}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Change Plan
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
