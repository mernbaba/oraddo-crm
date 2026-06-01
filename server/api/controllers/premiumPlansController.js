const premiumPlanService = require('../services/PlansServices');


exports.getAllPremiums = async (req, res) => {
    try {
        const plans = await premiumPlanService.getAllPlans();
        res.status(200).json(plans);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPlanByIdPremium = async (req, res) => {
    try {
        const plan = await premiumPlanService.getPlanById(req.params.id);
        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }
        res.status(200).json(plan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createPremiumPlan = async (req, res) => {
    try {
        const savedPlan = await premiumPlanService.createPlan(req.body);
        res.status(201).json(savedPlan);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updatePremiumModule = async (req, res) => {
  console.log(req.body, 'Entire request body');
  
  try {
    const data = req.body.departmentData;
    console.log(data, 'Data in controller');
    
    const updatePlans = await premiumPlanService.updatePlanModule(data);
    res.status(201).json(updatePlans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePremiumPlan = async (req, res) => {
    try {
        const updatedPlan = await premiumPlanService.updatePlan(req.params.id, req.body);
        if (!updatedPlan) {
            return res.status(404).json({ message: 'Plan not found' });
        }
        res.status(200).json(updatedPlan);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deletePremiumPlan = async (req, res) => {
    try {
        const deletedPlan = await premiumPlanService.deletePlan(req.params.id);
        if (!deletedPlan) {
            return res.status(404).json({ message: 'Plan not found' });
        }
        res.status(200).json({ message: 'Plan deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
