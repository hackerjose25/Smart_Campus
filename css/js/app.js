function login(){

let email = document.getElementById("email").value
let password = document.getElementById("password").value

if(email === "admin@campus.com" && password === "1234"){
    
    alert("Admin Login Successful")
    window.location.href = "admin-dashboard.html"

}

else if(email === "student@campus.com" && password === "1234"){

    alert("Student Login Successful")
    window.location.href = "student-dashboard.html"

}

else{

    alert("Invalid Login")

}

}

function register(){

let name = document.getElementById("name").value
let email = document.getElementById("email").value
let password = document.getElementById("password").value
let department = document.getElementById("department").value

if(name && email && password && department){

alert("Registration Successful!")

window.location.href = "login.html"

}
else{

alert("Please fill all fields")

}

}

function logout(){

alert("Logged Out Successfully")

window.location.href = "login.html"

}

function submitComplaint(){

alert("Complaint Submitted Successfully")

window.location.href = "student-dashboard.html"

}

function bookLab(){

alert("Lab Booked Successfully")

window.location.href = "student-dashboard.html"

}

function applyLeave(){

alert("Leave Request Submitted")

window.location.href = "student-dashboard.html"

}