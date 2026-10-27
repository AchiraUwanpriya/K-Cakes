import { steps, time } from "framer-motion";

export const USER_GUIDE = {
    student:{
        title: "Student guide",
        video: "/videos/student-guide.mp4",
        sections: [
            {
                title: "Dashboard",
                time: 0 ,
                steps: [
                    "After you log in you land on your Dashboard.",
                    "The cards at the top show your enrolled courses, scheduled classes, recent materials and attendance.",
                    "Class Announcement shows the latest updates from you teachers.",
                    "Scroll down for Recent materials, Upcoming Classes, Recent Attendance and My Courses. Click View All to open the full page.",
                ],
            },
            {
                title: "Courses",
                time: 10,
                steps: [
                    "Click Courses in the left menu.",
                    "Click a course to open its details: total students, active and inctive students, classes, academic year and the assigned teacher.",
                    "Use the back arrow to return to your courses.",
                ],
            },
            {
                title:"Attendance",
                time: 20,
                steps:[
                    "Click Attendance. Your personal QR code is shown at the top.",
                    "Show this code to your teacher's scanner to mark your attendance. Click Download QR Code to save it.",
                    "Under Your Attendance Records, choose a class schedule from the list to see your attendance for that class.",
                ],
            },
            {
                title: "Materials",
                time: 31,
                steps:[
                    "Click Materials to see your study materials, grouped by course.",
                    "Click a course to expand it and see its materials, with the date each was added.",
                    "Click the download icon next to a material to save the file.",
                ],
            },
            {
                title: "Class Schedule",
                time: 43,
                steps: [
                    "Click Class Schedule to see your weekly timetable. Scroll sideways to see the whole week.",
                    "Your classes appear in their time slots, showing the course, class and start time.",
                    "Use the Course, Class and Class Date boxes at the top to filter the schedule.",
                    "Use the List View button at the top right to switch the layout.",
                ],
            },
            {
                title: "Payment View",
                time: 57,
                steps:[
                    "Click Payments view to open your Payment Dashboard.",
                    "The cards show your total courses, total amount, total paid and total balance.",
                    "Use the search box or the All, Paid, Partial and Unpaid buttons to find a course.",
                    "Each course shows its total, paid amount, balance due, payment progress and status.",
                    "Click View Payment History to see each payment with its date, method and reference number. Click Hide Payment History to close it.",
                ],
            },
            {
                title: "Reports",
                time: 70,
                steps: [
                    "Click Reports to open your Student Report.",
                    "The top of the report shows your name, ID, email, total courses, total paid and total balance.",
                    "Each course lists its payment history. A course with no payments shows No payment record.",
                    "Click Export as PDF to download the report, or Refresh to reload it.",
                ],
            },
        ],
    },
    teacher:{
        title: "Teacher guide",
        video: "/videos/teacher-guide.mp4",
        sections:[
            {
                title:"Dashbaord",
                time: 0,
                steps:[
                    "After you log in you land on your Dashboard.",
                    "The cards at the top show your total students, total courses, announcements and scheduled classes.",
                    "My Announcements shows your latest notices. Click Create Announcement or New to post one.",
                    "Scroll down for Recent Courses, Recent Students and Recent Materials. Click View All to open the full page, or Download to save a material.",
                ],
            },
            {
                title: "Courses",
                time: 11,
                steps:[
                     "Click Courses to see your course portfolio. Each card shows the course name, code and academic year.",
                    "Use Sort by to change the order, and click View course to open a course.",
                    "A course shows its total, active and inactive students, classes, description, academic year and assigned teacher.",
                    "Search the students by name, email or roll number, and switch between Active and Inactive students.",
                    "Use the back arrow to return to your courses.",
                ],
            },
            {
                title: "Requesting a new course",
                time:29,
                steps:[
                    "On the Courses page, click Add Course.",
                    "Enter the course code, course name, academic year and description.",
                    "Under Classes, choose an existing class, or click + New to add one with its class code, class name, description, subject fee, duration (months) and monthly fee.",
                    "Click Save Course.",
                ],
            },
            {
                title:"Class Schedule",
                time: 37,
                steps: [
                    "Click Class Schedule to see your weekly timetable from Monday to Sunday.",
                    "Hover over a class for a quick summary, or click it to open Schedule Details: course, class, day, date, start and end time, and whether it repeats.",
                    "Use the Course, Class and Class Date boxes at the top to filter the schedule.",
                    "Click List View to see the classes as a list, and Week View to go back.",
                    "Schedules can only be added by the admin.",
                ],
            },
            {
                title: "Attendance",
                time:69,
                steps:[
                    "Click Attendance to open Scan QR Code for Attendance.",
                    "Choose a schedule from the list. It only shows today's schedules.",
                    "Click Start Scanning, then scan each student's QR code.",
                    "Under Attendance Records, choose any schedule to see the total present and each student's name, email, status and time.",
                ],
            },
            {
                title: "Materials",
                time:91,
                steps:[
                    "Click Materials to see your courses and the materials in each one.",
                    "Click Upload for this course, then enter a title and description, choose the class and the file, and click Upload Material.",
                    "Click the download icon next to a material to save it.",
                    "Click Remove to move a material to the Inactive tab, and Restore to bring it back.",
                ],
            },
            {
                title:"Students",
                time: 118,
                steps:[
                    "Click Students to see your students. Search by name, email or ID, and switch between Active and Inactive.",
                    "Click a student's name to open Student Details: personal information, student ID, enrollment date, classes, parent details and enrolled courses.",
                    "Click + to add enrolled courses: click Manage Enrolled Courses, tick the courses, click Proceed, then Save & Continue to Payment.",
                    "Click the pencil icon to edit a student's photo, name, username, email and phone number.",
                ],
            },
            {
                title: "Notices",
                time: 151,
                steps:[
                    "Click Notices to see the announcements you have posted.",
                    "Click New Notice, choose the course, and enter a title and content.",
                    "Set the post date and time. Add an expiry date and time if you want, and tick Mark as important if needed.",
                    "Click Save Announcement. The notice appears in your list, where you can click Edit to change it.",
                ],
            },
            {
                title:"Payments",
                time:178,
                steps:[
                    "Click Payments to see total students, total received, pending balance and completion rate.",
                    "Switch between Active Students and Inactive Students, or search by student, course or subject.",
                    "Each course payment shows its status (Paid or Partial), total, paid amount and balance. Click Details to see the payment history, and Hide to close it.",
                    "Click Add to record an installment: enter the amount paid, choose the payment method, check the reference number, add remarks if needed, and click Add Installment.",
                ],
            },
        ],
    },
    admin: {
        title: "Admin guide",
        video: "/videos/admin-guide.mp4",
        sections: [
            {
                title: "Logging in",
                time: 0,
                steps: [
                    "Open the login page and enter your username and password. Click the eye icon if you want to check what you typed.",
                    "Click Sign In to open the admin side.",
                ],
            },
            {
                title: "Dashabord",
                time: 8,
                steps:[
                    "After you log in you land on the Dashboard Overview.",
                    "The cards show total students, courses, teachers and users.",
                    "Below them you will find Announcements, Recent Users and Recent Courses. Click View All to open the full page.",
                    "Use the menu on the left to move between Users, Courses, Class, Class Schedule, Payments, Reports and Settings.",
                ],
            },
            {
                title: "Users",
                time: 20,
                steps:[
                    "Click Users to open User Management.",
                    "The cards show all users, admins, teachers and students. Click a card to see only that role.",
                    "Search by name, email or ID, and use Sort by to change the order.",
                    "Use the Active and Inactive tabs to switch between current and removed users.",
                    "Click a user's name to open their details. Use the Back button to return to the list.",
                ],
            },
            {
                title: "Adding an Admin",
                time: 40,
                steps:[
                    "Click the Admins card, then click + Add Admin.",
                    "Enter the first name, last name, username, email, phone number and password. You can also upload a photo.",
                    "Click Save. The new admin appears in the list.",
                ],
            },
            {
                title: "Editing an Admin",
                time: 76,
                steps:[
                    "Click the pencil icon on the user's row to open Edit User.",
                    "Change the details you need, such as the name, username, email or phone number.",
                    "Click Update.",
                ],
            },
            {
                title: "Removing an Admin",
                time: 92,
                steps:[
                    "Click the red X on the user's row.",
                    "Confirm when asked whether to move the user to inactive. The message \"User moved to inactive\" appears.",
                    "To bring a user back, open the Inactive tab and click the green Active label next to them. The message \"User activated\" appears.",
                ],
            },
            {
                title: "Adding a Teacher",
                time: 108,
                steps:[
                    "Click the Teachers card, then click + Add Teacher.",
                    "Enter the basic details (first name, last name, username, email, phone number and password), then click Next.",
                    "Enter the teacher information: employee ID, joining date, department, qualification and a short bio.",
                    "Click Create.",
                ],
            },
            {
                title: "Assigning a course to the new tacher",
                time: 140,
                steps:[
                    "After the teacher is created, the Assign Courses to New Teacher window opens.",
                    "Enter the course code, course name, academic year and description.",
                    "Under Classes, choose an existing class, or click + New to add one: class code, class name, description, subject fee, duration (months) and monthly fee. Click Save.",
                    "Click Save Course. The teacher's details page now lists the course under Assigned Courses.",
                    "You can click Assign Course later to add more, or View to open a course.",
                ],
            },
            {
                title: "Adding a student",
                time:180,
                steps:[
                    "Click the Students card, then click + Add Student.",
                    "Enter the basic details, then click Next.",
                    "Enter the student details: enrollment date, guardian's name and guardian's phone number.",
                    "Click Create. Click the student's name to see their details, classes and enrolled courses.",
                ],
            },
            {
                title: "Enrolling a student in a course",
                time: 224,
                steps:[
                    "On the student's page, click Manage Enrolled Courses.",
                    "Search for the courses and tick the ones the student is joining, then click Proceed.",
                    "Click Save & Continue to Payment.",
                    "On the New Payment page, check the enrollment ID, student and payment method, and enter the total amount and first payment. The remaining balance is worked out for you.",
                    "Add a reference number and remarks if needed, then save the payment.",
                ],
            },
            {
                title: "Courses",
                time: 252,
                steps: [
                    "Click Courses to open Course Management.",
                    "The cards at the top show total, active and inactive courses, and courses with subjects.",
                    "Switch between Active and Inactive courses, change Sort by, and click View course to open one.",
                ],
            },
            {
                title: "Adding a course",
                time:256,
                steps:[
                    "Click + Add New Course.",
                    "In Assign Teacher to Course, choose a teacher from the list. Click + New to create a new teacher or Refresh to reload the list, then click Continue.",
                    "Enter the course code, course name, academic year and description.",
                    "Choose a class, or click + New to add a class, then click Save Course.",
                ],
            },
            {
                title: "Checking attendance for class",
                time:300,
                steps:[
                    "Open a course and click one of its classes.",
                    "In Class Overview, pick a date.",
                    "You will see the total, present and absent counts for that day, or a message if no attendance has been recorded.",
                ],
            },
            {
                title: "Editing a course",
                time: 312,
                steps:[
                    "On the course page, click Edit Course.",
                    "Change the name, assigned teacher, academic year, description or classes, then click Save Course.",
                    "Click Inactivate if the course should no longer be active.",
                ],
            },
            {
                title: "Class",
                time: 320,
                steps:[
                    "Click Class to open Class Management. It shows total, active and inactive classes, with the fees and linked course on each card.",
                    "Click + Add New Class and enter the class code, class name and description.",
                    "Choose the course, or click + to add a new course. Enter the subject fee, duration (months) and monthly fee, then click Save.",
                ],
            },
            {
                title: "Class schedule",
                time: 344,
                steps:[
                    "Click Class Schedule to see the weekly timetable.",
                    "Click Add Schedule, choose the course, class, day of the week and class date, and set the start and end time.",
                    "Tick Recurring weekly if the class repeats every week, then click Save.",
                    "Click a class on the timetable to see its Schedule Details.",
                    "Click List View to see all classes as a list with Edit and Delete buttons, and Week View to go back.",
                ],
            },
            {
                title:"Payments",
                time:376,
                steps:[
                    "Click Payments to see every payment record, with the Active Students and Inactive Students tabs.",
                    "Each row shows the enrollment ID, course, class, student, status, total, paid amount and balance. The totals at the bottom show the balance, amount paid and overall total.",
                    "Click Show History to see each payment with its date, method, reference and remarks.",
                ],
            },
            {
                title: "Adding an installment",
                time: 388,
                steps:[
                    "On the payment row, click Add.",
                    "Enter the amount paid and choose the payment method. The payment ID and remaining balance are already filled in.",
                    "Check the reference number, add remarks if needed, and click Add Installment.",
                    "The balance updates, and the status changes to Paid when nothing is left to pay.",
                ],
            },
            {
                title: "Reprots",
                time:406,
                steps: [
                    "Click Reports to open the Students Reports Dashboard.",
                    "Choose All Reports, Daily Report or Monthly Report, and filter by payment date.",
                    "The cards show total students, total courses, total revenue and the outstanding amount.",
                    "Click Expand on a student to see their courses and payment history.",
                    "Click Export PDF and choose All Reports, Daily Report or Monthly Report to download the file.",
                ],
            },
        ],
    },
};