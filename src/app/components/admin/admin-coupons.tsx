import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Modal } from "../ui/modal";
import {
  Tag,
  Plus,
  Edit,
  Trash2,
  Copy,
  Calendar,
  Percent,
  DollarSign,
  Users,
  Sparkles
} from "lucide-react";

interface Coupon {
  id: number;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minPurchase?: number;
  maxDiscount?: number;
  usageLimit: number;
  usageCount: number;
  validFrom: string;
  validUntil: string;
  active: boolean;
  applicablePlans: string[];
}

export function AdminCoupons() {
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [couponForm, setCouponForm] = useState({
    code: "",
    type: "percentage" as "percentage" | "fixed",
    value: "",
    minPurchase: "",
    maxDiscount: "",
    usageLimit: "",
    validFrom: "",
    validUntil: "",
    active: true,
    applicablePlans: [] as string[]
  });

  const [coupons, setCoupons] = useState<Coupon[]>([
    {
      id: 1,
      code: "WELCOME20",
      type: "percentage",
      value: 20,
      minPurchase: 0,
      usageLimit: 1000,
      usageCount: 245,
      validFrom: "2026-01-01",
      validUntil: "2026-12-31",
      active: true,
      applicablePlans: ["Basic", "Pro", "Enterprise"]
    },
    {
      id: 2,
      code: "SUMMER50",
      type: "fixed",
      value: 50,
      minPurchase: 100,
      maxDiscount: 50,
      usageLimit: 500,
      usageCount: 128,
      validFrom: "2026-06-01",
      validUntil: "2026-08-31",
      active: true,
      applicablePlans: ["Pro", "Enterprise"]
    },
    {
      id: 3,
      code: "ENTERPRISE10",
      type: "percentage",
      value: 10,
      minPurchase: 299,
      usageLimit: 100,
      usageCount: 42,
      validFrom: "2026-01-01",
      validUntil: "2026-12-31",
      active: true,
      applicablePlans: ["Enterprise"]
    },
    {
      id: 4,
      code: "FLASH30",
      type: "percentage",
      value: 30,
      minPurchase: 0,
      usageLimit: 200,
      usageCount: 200,
      validFrom: "2026-02-01",
      validUntil: "2026-02-15",
      active: false,
      applicablePlans: ["Basic", "Pro"]
    },
  ]);

  const stats = [
    { label: "Total Coupons", value: coupons.length, gradient: "from-[#422462] to-[#5A4079]" },
    { label: "Active Coupons", value: coupons.filter(c => c.active).length, gradient: "from-[#5A4079] to-[#937CB4]" },
    { label: "Total Redemptions", value: coupons.reduce((sum, c) => sum + c.usageCount, 0), gradient: "from-[#937CB4] to-[#5A4079]" },
    { label: "Avg Redemption Rate", value: "62%", gradient: "from-[#422462] to-[#937CB4]" },
  ];

  const plans = ["Basic", "Pro", "Enterprise"];

  const handleAddCoupon = () => {
    setEditingCoupon(null);
    setCouponForm({
      code: "",
      type: "percentage",
      value: "",
      minPurchase: "",
      maxDiscount: "",
      usageLimit: "",
      validFrom: "",
      validUntil: "",
      active: true,
      applicablePlans: []
    });
    setShowCouponModal(true);
  };

  const handleEditCoupon = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setCouponForm({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value.toString(),
      minPurchase: coupon.minPurchase?.toString() || "",
      maxDiscount: coupon.maxDiscount?.toString() || "",
      usageLimit: coupon.usageLimit.toString(),
      validFrom: coupon.validFrom,
      validUntil: coupon.validUntil,
      active: coupon.active,
      applicablePlans: coupon.applicablePlans
    });
    setShowCouponModal(true);
  };

  const handleSaveCoupon = () => {
    if (!couponForm.code || !couponForm.value || !couponForm.validFrom || !couponForm.validUntil) return;

    const newCoupon: Coupon = {
      id: editingCoupon ? editingCoupon.id : Math.max(...coupons.map(c => c.id), 0) + 1,
      code: couponForm.code.toUpperCase(),
      type: couponForm.type,
      value: parseFloat(couponForm.value),
      minPurchase: couponForm.minPurchase ? parseFloat(couponForm.minPurchase) : undefined,
      maxDiscount: couponForm.maxDiscount ? parseFloat(couponForm.maxDiscount) : undefined,
      usageLimit: parseInt(couponForm.usageLimit) || 0,
      usageCount: editingCoupon ? editingCoupon.usageCount : 0,
      validFrom: couponForm.validFrom,
      validUntil: couponForm.validUntil,
      active: couponForm.active,
      applicablePlans: couponForm.applicablePlans
    };

    if (editingCoupon) {
      setCoupons(coupons.map(c => c.id === editingCoupon.id ? newCoupon : c));
    } else {
      setCoupons([...coupons, newCoupon]);
    }

    setShowCouponModal(false);
  };

  const handleDeleteCoupon = (couponId: number) => {
    if (confirm("Are you sure you want to delete this coupon?")) {
      setCoupons(coupons.filter(c => c.id !== couponId));
    }
  };

  const handleToggleActive = (couponId: number) => {
    setCoupons(coupons.map(c =>
      c.id === couponId ? { ...c, active: !c.active } : c
    ));
  };

  const handleCopyCouponCode = (code: string) => {
    navigator.clipboard.writeText(code);
    alert(`Coupon code "${code}" copied to clipboard!`);
  };

  const togglePlan = (plan: string) => {
    if (couponForm.applicablePlans.includes(plan)) {
      setCouponForm({
        ...couponForm,
        applicablePlans: couponForm.applicablePlans.filter(p => p !== plan)
      });
    } else {
      setCouponForm({
        ...couponForm,
        applicablePlans: [...couponForm.applicablePlans, plan]
      });
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

      <div className="flex justify-end">
        <Button
          className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#5A4079] hover:to-[#422462]"
          onClick={handleAddCoupon}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Coupon
        </Button>
      </div>

      <div className="grid gap-4">
        {coupons.map((coupon) => (
          <Card key={coupon.id} className={`gradient-card gradient-card-hover border-[#937CB4]/30 ${!coupon.active && "opacity-60"}`}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#422462] to-[#5A4079] text-white font-mono font-bold text-lg tracking-wider shadow-lg">
                      {coupon.code}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-[#937CB4]/30 hover:bg-[#F0E9FF]"
                      onClick={() => handleCopyCouponCode(coupon.code)}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                    <Badge className={coupon.active ? "bg-green-500 text-white" : "bg-gray-500 text-white"}>
                      {coupon.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-[#5A4079]">
                      {coupon.type === "percentage" ? <Percent className="h-4 w-4" /> : <DollarSign className="h-4 w-4" />}
                      <span className="font-semibold">{coupon.value}{coupon.type === "percentage" ? "%" : "$"} OFF</span>
                    </div>
                    {coupon.minPurchase && (
                      <div className="text-[#5A4079]">
                        Min Purchase: <span className="font-semibold">${coupon.minPurchase}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-[#5A4079]">
                      <Users className="h-4 w-4" />
                      <span>{coupon.usageCount} / {coupon.usageLimit} used</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#5A4079]">
                      <Calendar className="h-4 w-4" />
                      <span>{coupon.validFrom} to {coupon.validUntil}</span>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="text-xs text-[#5A4079]">Applicable to:</span>
                    {coupon.applicablePlans.map((plan) => (
                      <Badge key={plan} variant="outline" className="border-[#937CB4]/30 text-[#422462]">
                        {plan}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[#937CB4]/30 hover:bg-[#F0E9FF]"
                    onClick={() => handleEditCoupon(coupon)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className={`border-[#937CB4]/30 ${coupon.active ? "hover:bg-yellow-50" : "hover:bg-green-50"}`}
                    onClick={() => handleToggleActive(coupon.id)}
                  >
                    {coupon.active ? "Disable" : "Enable"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-300 hover:bg-red-50"
                    onClick={() => handleDeleteCoupon(coupon.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showCouponModal && (
        <Modal
          isOpen={showCouponModal}
          onClose={() => setShowCouponModal(false)}
          title={editingCoupon ? "Edit Coupon" : "Create New Coupon"}
          size="lg"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#200B43] mb-2">
                Coupon Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={couponForm.code}
                onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:outline-none focus:ring-2 focus:ring-[#937CB4] font-mono"
                placeholder="SUMMER20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#200B43] mb-2">
                  Discount Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={couponForm.type}
                  onChange={(e) => setCouponForm({ ...couponForm, type: e.target.value as "percentage" | "fixed" })}
                  className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#200B43] mb-2">
                  Value <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={couponForm.value}
                  onChange={(e) => setCouponForm({ ...couponForm, value: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                  placeholder={couponForm.type === "percentage" ? "20" : "50"}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#200B43] mb-2">
                  Min Purchase Amount
                </label>
                <input
                  type="number"
                  value={couponForm.minPurchase}
                  onChange={(e) => setCouponForm({ ...couponForm, minPurchase: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#200B43] mb-2">
                  Max Discount
                </label>
                <input
                  type="number"
                  value={couponForm.maxDiscount}
                  onChange={(e) => setCouponForm({ ...couponForm, maxDiscount: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                  placeholder="Unlimited"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#200B43] mb-2">
                Usage Limit
              </label>
              <input
                type="number"
                value={couponForm.usageLimit}
                onChange={(e) => setCouponForm({ ...couponForm, usageLimit: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                placeholder="1000"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#200B43] mb-2">
                  Valid From <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={couponForm.validFrom}
                  onChange={(e) => setCouponForm({ ...couponForm, validFrom: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#200B43] mb-2">
                  Valid Until <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={couponForm.validUntil}
                  onChange={(e) => setCouponForm({ ...couponForm, validUntil: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-[#937CB4]/30 focus:outline-none focus:ring-2 focus:ring-[#937CB4]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#200B43] mb-2">
                Applicable Plans
              </label>
              <div className="flex gap-2">
                {plans.map((plan) => (
                  <button
                    key={plan}
                    onClick={() => togglePlan(plan)}
                    className={`px-4 py-2 rounded-lg border transition-all ${
                      couponForm.applicablePlans.includes(plan)
                        ? "border-[#422462] bg-gradient-to-r from-[#422462] to-[#5A4079] text-white"
                        : "border-[#937CB4]/30 text-[#5A4079] hover:bg-[#F0E9FF]"
                    }`}
                  >
                    {plan}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="couponActive"
                checked={couponForm.active}
                onChange={(e) => setCouponForm({ ...couponForm, active: e.target.checked })}
                className="w-4 h-4 rounded border-[#937CB4]/30 text-[#422462] focus:ring-[#937CB4]"
              />
              <label htmlFor="couponActive" className="text-sm text-[#200B43]">
                Active (available for use)
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowCouponModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white"
                onClick={handleSaveCoupon}
                disabled={!couponForm.code || !couponForm.value || !couponForm.validFrom || !couponForm.validUntil}
              >
                {editingCoupon ? "Update Coupon" : "Create Coupon"}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
