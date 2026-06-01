import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Modal } from "../ui/modal";
import {
  CreditCard,
  Plus,
  Edit,
  Trash2,
  Users,
  DollarSign,
  Check,
  Sparkles,
  Loader2,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { plansService, ApiPlan } from "../../services/plansService";


interface Plan {
  id: number;
  name: string;
  price: number;
  billingPeriod: string;       // maps from model "duration" field
  features: string[];           // not in model — shown as employeeLimit info
  employeeLimit: number;
  subscription?: string;
  total?: number;
}

function mapApiPlanToLocal(p: ApiPlan): Plan {
  const parsedPrice = parseFloat(p.price as any);
  return {
    id: p.id,
    name: p.planName || "Unnamed Plan",
    price: isNaN(parsedPrice) ? 0 : parsedPrice,
    billingPeriod: p.duration ?? "monthly",
    features: typeof p.subscription === "string" ? p.subscription.split("\n").filter(f => f.trim()) : [],
    employeeLimit: p.employeeLimit ?? 0,
    subscription: p.subscription,
    total: p.total,
  };
}

export function AdminPlans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [planForm, setPlanForm] = useState({
    name: "",
    price: "",
    billingPeriod: "monthly",
    employeeLimit: "",
    features: "",
    active: true
  });


  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await plansService.getAll();
      const data = Array.isArray(res.data) ? res.data : [];
      setPlans(data.map(mapApiPlanToLocal));
    } catch (err: any) {
      console.error("Failed to fetch plans:", err);
      setError(err?.response?.data?.message ?? "Failed to load plans from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const stats = [
    { label: "Total Plans", value: plans.length, gradient: "from-[#422462] to-[#5A4079]" },
    { label: "Max Employees", value: plans.reduce((sum, p) => sum + p.employeeLimit, 0), gradient: "from-[#5A4079] to-[#937CB4]" },
    { label: "Total Value", value: `$${plans.reduce((sum, p) => sum + (p.total ?? 0), 0).toLocaleString()}`, gradient: "from-[#937CB4] to-[#5A4079]" },
    { label: "Plan Types", value: new Set(plans.map(p => p.billingPeriod)).size, gradient: "from-[#422462] to-[#937CB4]" },
  ];

  const handleAddPlan = () => {
    setEditingPlan(null);
    setPlanForm({ name: "", price: "", billingPeriod: "monthly", employeeLimit: "", features: "", active: true });
    setShowPlanModal(true);
  };

  const handleEditPlan = (plan: Plan) => {
    setEditingPlan(plan);
    setPlanForm({
      name: plan.name,
      price: plan.price.toString(),
      billingPeriod: plan.billingPeriod,
      employeeLimit: plan.employeeLimit.toString(),
      features: plan.features.join("\n"),
      active: true
    });
    setShowPlanModal(true);
  };


  const handleSavePlan = async () => {
    if (!planForm.name || !planForm.price) return;
    setSaving(true);
    const payload: Partial<ApiPlan> = {
      planName: planForm.name,
      price: planForm.price,
      duration: planForm.billingPeriod,
      subscription: planForm.features,
      employeeLimit: parseInt(planForm.employeeLimit) || 0,
    };
    try {
      if (editingPlan) {
        await plansService.update(editingPlan.id, payload);
        const updatedLocal: Plan = {
          ...editingPlan,
          name: planForm.name,
          price: parseFloat(planForm.price) || 0,
          billingPeriod: planForm.billingPeriod,
          employeeLimit: parseInt(planForm.employeeLimit) || 0,
          features: planForm.features.split("\n").filter(f => f.trim())
        };
        setPlans(prev => prev.map(p => p.id === editingPlan.id ? updatedLocal : p));
      } else {
        const res = await plansService.create(payload);
        const newPlanFull = res.data?.id ? mapApiPlanToLocal(res.data) : {
           ...mapApiPlanToLocal({ ...payload, id: Date.now() } as ApiPlan),
        };
        setPlans(prev => [...prev, newPlanFull]);
      }
      setShowPlanModal(false);
    } catch (err: any) {
      alert(err?.response?.data?.message ?? "Failed to save plan. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePlan = async (plan: Plan) => {
    if (!confirm(`Are you sure you want to delete the "${plan.name}" plan?`)) return;
    try {
      await plansService.delete(plan.id);
      setPlans(prev => prev.filter(p => p.id !== plan.id));
    } catch (err: any) {
      alert(err?.response?.data?.message ?? "Failed to delete plan.");
    }
  };

  const handleToggleActive = async (plan: Plan) => {
    const newStatus = plan.subscription === "active" ? "inactive" : "active";
    try {
      await plansService.update(plan.id, { subscription: newStatus });
      setPlans(prev => prev.map(p => p.id === plan.id ? { ...p, subscription: newStatus } : p));
    } catch (err: any) {
      alert(err?.response?.data?.message ?? "Failed to update plan status.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
            <div className="relative z-10">
              <p className="text-sm text-[#5A4079] mb-1">{stat.label}</p>
              <h3 className="text-3xl font-bold text-[#200B43]">
                {loading ? <Loader2 className="h-6 w-6 animate-spin text-[#937CB4]" /> : stat.value}
              </h3>
            </div>
            <div className="absolute top-2 right-2">
              <Sparkles className="h-5 w-5 text-[#937CB4] opacity-40 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm flex-1">{error}</p>
          <Button size="sm" variant="outline" className="border-red-300 hover:bg-red-100 text-red-700" onClick={fetchPlans}>
            <RefreshCw className="h-3 w-3 mr-1" /> Retry
          </Button>
        </div>
      )}

      <div className="flex justify-end">
        <Button
          className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#5A4079] hover:to-[#422462]"
          onClick={handleAddPlan}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Plan
        </Button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin text-[#937CB4] mx-auto mb-3" />
            <p className="text-[#5A4079] text-sm">Loading plans from server...</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {plans.length === 0 && !error ? (
            <div className="col-span-4 text-center py-16 text-[#5A4079]">
              <CreditCard className="h-12 w-12 mx-auto mb-3 text-[#937CB4]" />
              <p>No plans found. Create your first plan.</p>
            </div>
          ) : (
            plans.map((plan) => (
              <Card
                key={plan.id}
                className="gradient-card gradient-card-hover border-[#937CB4]/30"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-[#200B43] mb-2">{plan.name}</CardTitle>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-[#422462]">${plan.price}</span>
                        <span className="text-sm text-[#5A4079]">/{plan.billingPeriod === "monthly" ? "mo" : "yr"}</span>
                      </div>
                    </div>
                    <Badge className={plan.subscription === "active" ? "bg-green-500 text-white" : "bg-gray-500 text-white"}>
                      {plan.subscription === "active" ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-[#422462] mt-0.5 flex-shrink-0" />
                        <span className="text-[#5A4079]">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-[#937CB4]/20 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#5A4079] flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        Employee Limit
                      </span>
                      <span className="font-semibold text-[#200B43]">{plan.employeeLimit}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#5A4079] flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        Total
                      </span>
                      <span className="font-semibold text-[#200B43]">${plan.total?.toLocaleString() ?? "—"}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-[#937CB4]/30 hover:bg-[#F0E9FF]"
                      onClick={() => handleEditPlan(plan)}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-[#937CB4]/30 hover:bg-yellow-50"
                      onClick={() => handleToggleActive(plan)}
                    >
                      Update
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-300 hover:bg-red-50"
                      onClick={() => handleDeletePlan(plan)}
                    >
                      <Trash2 className="h-3 w-3 text-red-600" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {showPlanModal && (
        <Modal
          isOpen={showPlanModal}
          onClose={() => setShowPlanModal(false)}
          title={editingPlan ? "Edit Plan" : "Add New Plan"}
          size="lg"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#200B43] mb-2">
                Plan Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={planForm.name}
                onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                placeholder="e.g., Pro Plan"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#200B43] mb-2">
                  Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={planForm.price}
                  onChange={(e) => setPlanForm({ ...planForm, price: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                  placeholder="99"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#200B43] mb-2">
                  Billing Period
                </label>
                <select
                  value={planForm.billingPeriod}
                  onChange={(e) => setPlanForm({ ...planForm, billingPeriod: e.target.value as "monthly" | "yearly" })}
                  className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#200B43] mb-2">
                Features (one per line) <span className="text-red-500">*</span>
              </label>
              <textarea
                value={planForm.features}
                onChange={(e) => setPlanForm({ ...planForm, features: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                rows={6}
                placeholder={"Unlimited Users\nAdvanced Analytics\n24/7 Support\nAPI Access"}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="active"
                checked={planForm.active}
                onChange={(e) => setPlanForm({ ...planForm, active: e.target.checked })}
                className="w-4 h-4 rounded border-[#937CB4]/30 text-[#422462] focus:ring-[#937CB4]"
              />
              <label htmlFor="active" className="text-sm text-[#200B43]">
                Active (available for subscription)
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowPlanModal(false)}>
                Cancel
              </Button>
              <Button
                className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white"
                onClick={handleSavePlan}
                disabled={!planForm.name || !planForm.price || saving}
              >
                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                {editingPlan ? "Update Plan" : "Create Plan"}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
