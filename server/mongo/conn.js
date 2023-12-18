const mongoose = require("mongoose");
const { compare, hash } = require("bcryptjs");

mongoose.connect(process.env.URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
  job: String,
  birthDate: String,
  phoneNumber: String,
  position: String,
  hireDate: String,
  admin: Boolean,
});

const UserModel = mongoose.model("User", userSchema);
const RegisterModel = mongoose.model("Register", userSchema);

async function AddRegister(user) {
  try {
    const existingUser = await RegisterModel.findOne({ email: user.email });

    if (existingUser) {
      console.log(
        `User with email ${user.email} already exists in the register collection.`
      );
      return 409; // Conflict status code
    }

    user.admin = false;
    user.password = await hash(user.password, 10);

    await RegisterModel.create(user);
    console.log(`${user.name} inserted successfully.\n`);
    return 201; // Successfully inserted status code
  } catch (err) {
    console.error(
      `Something went wrong trying to insert the new documents: ${err}\n`
    );
    return 500; // Internal Server Error status code
  }
}

async function Login(email, password) {
  try {
    let user = await UserModel.findOne({ email });

    if (user) {
      const passwordMatch = await compare(password, user.password);

      if (passwordMatch) {
        return { user, msg: "Connected successfully" };
      } else {
        return { msg: "Email or password are incorrect" };
      }
    }

    // No user found in the first collection, checking the second collection
    user = await RegisterModel.findOne({ email });

    if (user) {
      const passwordMatch = await compare(password, user.password);

      if (passwordMatch) {
        return {
          msg: "Your user is not approved. Please contact your supervisor",
        };
      }
    }

    // No user found in the second collection either
    return { msg: "Email or password are incorrect" };
  } catch (err) {
    console.error("Error during login:", err);
    return { msg: "An error occurred during login" };
  }
}

async function List() {
  try {
    const data = await UserModel.find();
    return data;
  } catch (err) {
    console.error(`Error finding users: ${err}`);
    throw err;
  }
}

async function ListReg() {
  try {
    const data = await RegisterModel.find();
    if (!data) {
      return {};
    }
    return data;
  } catch (err) {
    console.error(`Error finding users: ${err}`);
    throw err;
  }
}

// ... (previous code)

async function DeleteReg(id) {
  try {
    const result = await RegisterModel.deleteOne({ _id: id });

    if (result.deletedCount === 1) {
      console.log(
        `User with id ${id} deleted successfully from the register collection.`
      );
      return { status: 200 }; // Success status code
    } else {
      return { status: 404 }; // Not Found status code
    }
  } catch (err) {
    console.error(`Error deleting user from register collection: ${err}`);
    return { status: 500 };
  }
}

async function ApproveReg(id) {
  try {
    const userToApprove = await RegisterModel.findOne({ _id: id });

    if (userToApprove) {
      await UserModel.create(userToApprove);
      await RegisterModel.deleteOne({ _id: id });

      console.log(
        `User with id ${id} approved and moved to the users collection.`
      );
      return { status: 200 }; // Success status code
    } else {
      console.log(`User with id ${id} not found in the register collection.`);
      return { status: 404 }; // Not Found status code
    }
  } catch (err) {
    console.error(`Error approving user in register collection: ${err}`);
    return { status: 500 }; // Internal Server Error status code
  }
}

async function DeleteUser(id) {
  try {
    const result = await UserModel.deleteOne({ _id: id });

    if (result.deletedCount === 1) {
      console.log(
        `User with id ${id} deleted successfully from the user collection.`
      );
      return { status: 200 };
    } else {
      console.log(`User with id ${id} not found in the user collection.`);
      return { status: 404 };
    }
  } catch (err) {
    console.error(`Error deleting user from user collection: ${err}`);
    return { status: 500 };
  }
}

async function GetUserById(userId) {
  try {
    const user = await UserModel.findOne({ _id: userId });

    if (user) {
      const keysToKeep = [
        "email",
        "name",
        "job",
        "birthDate",
        "phoneNumber",
        "position",
        "hireDate",
        "admin",
      ];
      const ans = Object.fromEntries(
        Object.entries(user).filter(([key]) => keysToKeep.includes(key))
      );
      console.log("Found user:", ans);
      return ans;
    } else {
      console.log("User not found");
      return {};
    }
  } catch (err) {
    console.error(`Error finding user by ID: ${err}`);
  }
}

async function UpdateUser(userId, userData) {
  try {
    const result = await UserModel.updateOne(
      { _id: userId },
      { $set: userData }
    );

    if (result.modifiedCount === 1) {
      console.log(`User with ID ${userId} updated successfully.`);
      return { code: 200, msg: "User updated successfully" };
    } else {
      console.log(`User with ID ${userId} not found.`);
      return { code: 404, msg: "User not found" };
    }
  } catch (error) {
    console.error(`Error updating user: ${error}`);
    return { code: 500, msg: "Error" };
  }
}

module.exports = {
  AddRegister,
  Login,
  List,
  ListReg,
  DeleteReg,
  ApproveReg,
  DeleteUser,
  GetUserById,
  UpdateUser,
};
