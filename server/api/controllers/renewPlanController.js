const RenewPlanServices = require("../services/planRenew");

const planRenewel = async (req, res) => {
  const { id } = req.params;
  const { planId } = req.body;
console.log(id,planId,'hhhhhhhh');

  try {
    const response = await RenewPlanServices.renewPlan(id,planId);
    res.status(201).json({message:response})
  } catch (error) {
    console.log(error);
  }

};
module.exports={planRenewel};