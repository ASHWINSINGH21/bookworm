import mongoose from "mongoose"
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    profileImage: {
        type: String,
        default: "https://api.dicebear.com/9.x/avataaars/svg?seed=johndoe"
    }
}, { timestamps: true }
);

//hash the password before saving in the database
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
    next();
})

userSchema.methods.comparePassword = async function (userPassword) {
  console.log("🧪 Comparing:", userPassword, "WITH", this.password);
  const result = await bcrypt.compare(userPassword, this.password);
  console.log("🧪 Comparison result:", result);
  return result; 
};

const User = mongoose.model("User", userSchema);

export default User; 