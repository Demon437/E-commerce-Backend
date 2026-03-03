const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        console.log('\n📝 REGISTER REQUEST RECEIVED');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('👤 Name:', name);
        console.log('📧 Email:', email);
        console.log('🔑 Password: ***');

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "User exists" });

        const hashed = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashed
        });

        console.log('✅ User registered successfully');
        console.log('   User ID:', user._id);
        console.log('   User Role:', user.role);

        res.json({
            token: generateToken(user),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('❌ Registration error:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log('\n🔐 LOGIN REQUEST RECEIVED');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📧 Email from request:', email);
        console.log('🔑 Password from request:', password ? '***' : 'MISSING');
        console.log('Request body:', JSON.stringify(req.body, null, 2));

        if (!email || !password) {
            console.log('❌ Missing email or password');
            return res.status(400).json({ message: "Email and password required" });
        }

        const user = await User.findOne({ email });
        console.log('🔍 User lookup result:', user ? 'FOUND' : 'NOT FOUND');
        if (user) {
            console.log('   User ID:', user._id);
            console.log('   User Email:', user.email);
            console.log('   User Role:', user.role);
            console.log('   Password Hash Length:', user.password?.length);
        }

        if (!user) {
            console.log('❌ User not found - returning error');
            return res.status(400).json({ message: "Invalid credentials" });
        }

        console.log('🔐 Comparing passwords...');
        const match = await bcrypt.compare(password, user.password);
        console.log('Password match result:', match);

        if (!match) {
            console.log('❌ Password does not match');
            return res.status(400).json({ message: "Invalid credentials" });
        }

        console.log('✅ Login successful!');
        res.json({
            token: generateToken(user),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({ message: error.message });
    }
};