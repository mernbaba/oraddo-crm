import { useState } from "react";
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
  Sparkles
} from "lucide-react";

interface Plan {
  id: number;
  name: string;
  price: number;
  billingPeriod: "monthly" | "yearly";
  features: string[];
  subscribers: number;
  active: boolean;
  mrr: number;
}

export function AdminPlans() {
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [planForm, setPlanForm] = useState({
    name: "",
    price: "",
    billingPeriod: "monthly" as "monthly" | "yearly",
    features: "",
    active: true
  });

  const [plans, setPlans] = useState<Plan[]>([
    {
      id: 1,
      name: "Free",
      price: 0,
      billingPeriod: "monthly",
      features: ["1 User", "Basic Features", "5 Projects", "Email Support"],
      subscribers: 850,
      active: true,
      mrr: 0
    },
    {
      id: 2,
      name: "Basic",
      price: 29,
      billingPeriod: "monthly",
      features: ["5 Users", "All Basic Features", "Unlimited Projects", "Priority Support", "Analytics"],
      subscribers: 680,
      active: true,
      mrr: 19720
    },
    {
      id: 3,
      name: "Pro",
      price: 99,
      billingPeriod: "monthly",
      features: ["Unlimited Users", "All Pro Features", "Advanced Analytics", "24/7 Support", "API Access", "Custom Integrations"],
      subscribers: 420,
      active: true,
      mrr: 41580
    },
    {
      id: 4,
      name: "Enterprise",
      price: 299,
      billingPeriod: "monthly",
      features: ["Unlimited Everything", "Dedicated Account Manager", "Custom Development", "SLA", "On-premise Deployment", "Training & Onboarding"],
      subscribers: 150,
      active: true,
      mrr: 44850
    },
  ]);

  const stats = [
    { label: "Total Plans", value: plans.length, gradient: "from-[#422462] to-[#5A4079]" },
    { label: "Total Subscribers", value: plans.reduce((sum, p) => sum + p.subscribers, 0), gradient: "from-[#5A4079] to-[#937CB4]" },
    { label: "Total MRR", value: `$${plans.reduce((sum, p) => sum + p.mrr, 0).toLocaleString()}`, gradient: "from-[#937CB4] to-[#5A4079]" },
    { label: "Avg Revenue Per User", value: "$50.6", gradient: "from-[#422462] to-[#937CB4]" },
  ];

  const handleAddPlan = () => {
    setEditingPlan(null);
    setPlanForm({
      name: "",
      price: "",
      billingPeriod: "monthly",
      features: "",
      active: true
    });
    setShowPlanModal(true);
  };

  const handleEditPlan = (plan: Plan) => {
    setEditingPlan(plan);
    setPlanForm({
      name: plan.name,
      price: plan.price.toString(),
      billingPeriod: plan.billingPeriod,
      features: plan.features.join("\n"),
      active: plan.active
    });
    setShowPlanModal(true);
  };

  const handleSavePlan = () => {
    if (!planForm.name || !planForm.price) return;

    const price = parseFloat(planForm.price);
    const newPlan: Plan = {
      id: editingPlan ? editingPlan.id : Math.max(...plans.map(p => p.id), 0) + 1,
      name: planForm.name,
      price,
      billingPeriod: planForm.billingPeriod,
      features: planForm.features.split("\n").filter(f => f.trim()),
      subscribers: editingPlan ? editingPlan.subscribers : 0,
      active: planForm.active,
      mrr: editingPlan ? editingPlan.mrr : 0
    };

    if (editingPlan) {
      setPlans(plans.map(p => p.id === editingPlan.id ? newPlan : p));
    } else {
      setPlans([...plans, newPlan]);
    }

    setShowPlanModal(false);
  };

  const handleDeletePlan = (planId: number) => {
    if (confirm("Are you sure you want to delete this plan?")) {
      setPlans(plans.filter(p => p.id !== planId));
    }
  };

  const handleToggleActive = (planId: number) => {
    setPlans(plans.map(p =>
      p.id === planId ? { ...p, active: !p.active } : p
    ));
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
              <h3 className="text-3xl font-bold text-[#200B43]">{stat.value}</h3>
            </div>
            <div className="absolute top-2 right-2">
              <Sparkles className="h-5 w-5 text-[#937CB4] opacity-40 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
      </div>

      {/* Add Plan Button */}
      <div className="flex justify-end">
        <Button
          className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#5A4079] hover:to-[#422462]"
          onClick={handleAddPlan}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Plan
        </Button>
      </div>

      {/* Plans Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`gradient-card gradient-card-hover border-[#937CB4]/30 ${!plan.active && "opacity-60"}`}
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
                <Badge className={plan.active ? "bg-green-500 text-white" : "bg-gray-500 text-white"}>
                  {plan.active ? "Active" : "Inactive"}
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
                    Subscribers
                  </span>
                  <span className="font-semibold text-[#200B43]">{plan.subscribers}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#5A4079] flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    MRR
                  </span>
                  <span className="font-semibold text-[#200B43]">${plan.mrr.toLocaleString()}</span>
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
                  className={`border-[#937CB4]/30 ${plan.active ? "hover:bg-yellow-50" : "hover:bg-green-50"}`}
                  onClick={() => handleToggleActive(plan.id)}
                >
                  {plan.active ? "Disable" : "Enable"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-300 hover:bg-red-50"
                  onClick={() => handleDeletePlan(plan.id)}
                >
                  <Trash2 className="h-3 w-3 text-red-600" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Plan Modal */}
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
                placeholder="Unlimited Users&#10;Advanced Analytics&#10;24/7 Support&#10;API Access"
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
              <Button
                variant="outline"
                onClick={() => setShowPlanModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white"
                onClick={handleSavePlan}
                disabled={!planForm.name || !planForm.price}
              >
                {editingPlan ? "Update Plan" : "Create Plan"}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
