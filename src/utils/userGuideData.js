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
                title: "Getting started",
                steps: [
                    "Log in with your admin username and password.",
                    "Use the menu on the left to move between pages.",
                    "Your Dashboard shows an overview of the academy.",
                ],
            },
            {
                title: "Users and courses",
                steps: [
                    "Open Users to add and manage students and teachers.",
                    "Open Courses to create and manage courses.",
                    "Open Class and Class Schedule to plan and manage classes.",
                ],
            },
            {
                title: "Payments and reports",
                steps: [
                    "Open Payements to record payments and see the payment history.",
                    "Open Reports to view reports.",
                    "Open Settings to manage your account and system settings.",
                ],
            },
        ],
    },
};