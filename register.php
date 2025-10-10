<?php
include("header.html");
?>
<head>
    <style>
        body {
            font-family: 'Segoe UI', sans-serif;
            background: #e6e6e6;
            display: block;
            justify-content: center;
            align-items: center;
            height: 600px;
            width: 100%;
        }
        
        h2 {
            color: #0934b7;
        }
        
        .register-container {
            background-color: #ffffff;
            align-items: center;
            padding: 30px 40px;
            border-radius: 12px;
            width: 50%;
            height: 600px;
            margin-left: auto;
            margin-right: auto;
        }
        
        .register-container h2 {
            text-align: center;
            margin-bottom: 25px;
            color: rgb(9, 52, 183);
        }
        
        .form-group {
            width: 100%;
            margin-bottom: 15px;
        }
        
        .form-group label {
            display: block;
            font-weight: 600;
            margin-bottom: 5px;
        }
        
        .form-group input,
        .form-group select,
        .form-group textarea {
            width: 100%;
            padding: 10px;
            font-size: 14px;
            border: 1px solid #ccc;
            border-radius: 6px;
        }
        
        .register-btn {
            width: 100%;
            padding: 12px;
            background-color: rgb(9, 52, 183);
            color: white;
            font-size: 16px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            margin-top: 10px;
        }
        
        .register-btn:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>

    <div class="register-container">
        <h2>Register</h2>
        <form action="connect.php" method="post">
            <div class="form-group">
                <label for="fullname">Full Name</label>
                <input type="text" id="fullname" name="n" placeholder="Enter Your Name" required>
            </div>
            <div class="form-group">
                <label for="phone">Phone Number</label>
                <input type="number" id="phone" name="p" required pattern="[0-9]{10}" placeholder="10 digit number">
            </div>
            <div class="form-group">
                <label for="email">Email Address</label>
                <input type="email" id="email" name="e" placeholder="eg.naruto123@mail.com">
            </div>
            <div class="form-group">
                <label for="location">Site Location</label>
                <input type="text" id="location" name="l" placeholder='"Near Thanjavur"' required>
            </div>
            <div class="form-group">
                <label for="project">Type of Project</label>
                <select id="project" name="proj" required>
                <option value="">-- Select --</option>
                <option value="home">Residential Building</option>
                <option value="commercial">Commercial Building</option>
                <option value="renovation">Renovation</option>
                <option value="other">Other</option>
            </select>
            </div>
            <div class="form-group">
                <label for="details">Additional Details</label>
                <textarea id="details" name="deta" rows="4" placeholder="Any specific requirements..."></textarea>
            </div>
            <button type="submit" class="register-btn">Submit</button>
        </form>
    </div>

</body>
<?php
include("footer.html");
?>