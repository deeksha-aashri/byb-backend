module.exports = {
  
 
  //custom form validator
  formValidate: function (key, res) {
   
    return res.status(400).json({
      status: "error",
      result: key + " required",
    });
 
  },

  
};