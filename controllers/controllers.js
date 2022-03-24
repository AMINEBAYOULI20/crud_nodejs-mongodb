
var bcrypt = require('bcryptjs');

const jwt = require("jsonwebtoken");
const user = require("../models/user");

exports.inscrit_user = async (req, res) => {
  const { cin,
    FirstName,
    LastName,
    Phone,
    Gender,
    mail,
    password,
    governorate,
    psw,
    DateOfBirth,
  } = req.body
  try {
    const new_user = new user({
      cin,
      FirstName,
      LastName,
      Phone,
      Gender,
      mail,
      password,
      governorate,
      DateOfBirth,
      role: "client",

    })
    const searchUser = await user.findOne({
      mail
    });
    if (searchUser) {
      return res.status(500).send({
        msg: "compte déja existe"
      });
    }


    const salt = 10;
    const gensalt = await bcrypt.genSalt(salt);
    const hashedPassword = await bcrypt.hash(password, gensalt);
    new_user.password = hashedPassword;


    let result = await new_user.save();

    res.status(200).send({
      user: result,
      msg: "enregistrer avec succes"
    });



  } catch (error) {
    console.log(error);
    res.status(400).send("vous pouvez pas enregistrer utilisteur");
  }
}

exports.login = async (req, res) => {
  let exist = await user.findOne({
    mail: req.body.mail
  })
  console.log("aaaaa", req.body.mail);
  console.log(exist);
  try {
    if (!exist) {
      return res.status(400).json({
        message: {
          error: "Email  is incorrect",
        },
      });
    }
    console.log(req.body.mail);
    console.log(req.body.password);
    console.log(exist.password)
    const validPass = await bcrypt.compare(req.body.password, exist.password);
    console.log(validPass);
    if (!validPass) {
      return res.status(400).json({
        message: {
          error: " Password is incorrect",
        },
      });
    }
    const payload = {
      _id: exist._id,
      type: exist.role
    };

    const token = jwt.sign(payload, process.env.secretOrkey);

    delete exist.password;
    exist.token = token;
    res.status(200).json({
      user: exist,
      token: token,
    })
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      status: false,
      error
    })
  }
}
//ajouter financier


exports.affiche_toususers = async (req, res) => {
  let users = await user.find({
    role: "client"
  });
  try {

    return res.status(200).send(users)

  } catch (error) {
    console.log(error)
    res.status(400).send("error");
  }


}

exports.afficher_user = async (req, res) => {
  let id = req.params.id;
  try {


    let User = await user.findById(id)



    res.status(200).send(User);

  } catch (error) {
    console.log(error)
    res.status(400).send("erreur de trouver user");

  }
};


exports.modifier_user = async (req, res) => {

  const {
    id
  } = req.params;

  const users = {
    cin: req.body.cin,
    FirstName: req.body.FirstName,
    LastName: req.body.LastName,
    Phone: req.body.Phone,
    Gender: req.body.Gender,
    mail: req.body.mail,
    password: req.body.password,
    governorate: req.body.governorate,

    DateOfBirth: req.body.DateOfBirth,

    role: req.body.role,

  };


  try {

    const userupdate = await user.findByIdAndUpdate({
      _id: id
    }, {
      ...users
    }, {
      new: true
    });
    return res.status(200).json({
      status: true,
      data: userupdate,
      msg: 'success modification  user '
    });
  } catch (error) {
    return res.status(400).json({
      status: false,
      error: "errror de modifier  user"
    });
  }

}

exports.deletuser = async (req, res) => {
  try {
    let id = req.params.id
    if (!id) {
      res.status(401).send("user not found")
    }
    await user.findByIdAndDelete({
      _id: id
    })
    res.status(200).send("user succes delete")
  } catch (error) {
    console.log(error)
    res.status(400).send("user de delete")
  }
}






