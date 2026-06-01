const orgSignServices = require('../services/orgSignUpServices');


const signUpController = async(req,res)=>{
    const data = req.body;
    try {
        const signupRes = await orgSignServices.creatieSignUp(data);
        return res.status(201).json(signupRes);
    } catch (error) {
        console.log(error,'error in controller');
        res.status(500).json({ error: error.message });
    }
};

const signupdataGetbyId=async(req,res)=>{
    const id = req.params.id;
    try{
        const signupRes = await orgSignServices.getSignUpDataById(id);
        return res.status(201).json(signupRes);
    }catch(error){
        console.log(error,'error in controller');
        res.status(500).json({ error: error.message });
    }
}

const updateOrgData = async(req,res)=>{
    const id = req.params.id;
    const data = req.body;
    try{
        const signupRes = await orgSignServices.updateOrgData(id,data);
        return res.status(200).json(signupRes);
    }
    catch(error){
        console.log(error,'error in controller');
        res.status(500).json({ error: error.message });
    }
}

const signInController = async(req,res)=>{
    const data = req.body;
    try {
        const signInRes = await orgSignServices.orgSignIn(data);
        return res.status(200).json({
            status: true,
            message: "Login successfully",
            data: signInRes
        });
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: error.message || "Login failed"
        });
    }
}

const getregisterData = async(req,res)=>{
    console.log(req,"kjjkjb");
    
  try {
    const Clients = await orgSignServices.getSignUpData();
    res.status(200).json({ Clients });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }

}


module.exports= {
    signUpController,
    signInController,
    signupdataGetbyId,
    updateOrgData,
    getregisterData
}

