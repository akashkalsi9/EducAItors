/**
 * Mock data for the student dashboard — academic overview, grades, activity feed.
 */

export const mockStudent = {
  name: 'Riya Sharma',
  firstName: 'Riya',
  studentId: '2024MBA089',
  email: 'riya.sharma@university.edu',
  program: 'MBA Strategic Management',
  avatarInitials: 'RS',
}

export const mockCourse = {
  name: 'MBA Strategic Management',
  code: 'MBA-SM-301',
  semester: 'Spring 2026',
  currentModule: 'Module 3 — Strategic Analysis',
  credits: 15,
  instructor: 'Dr. Prasad Sharma',
}

export const mockGrades = [
  { module: 'Module 1', title: 'Industry Analysis', score: 78, band: 'Meets expectations', status: 'graded' },
  { module: 'Module 2', title: 'Competitive Strategy', score: 82, band: 'Exceeds expectations', status: 'graded' },
  { module: 'Module 3', title: 'Strategic Analysis', score: null, band: null, status: 'pending' },
]

export const mockActivity = [
  { id: 'act1', text: 'Dr. Sharma posted the assignment brief', time: '2 days ago', type: 'announcement' },
  { id: 'act2', text: 'Module 3 materials now available', time: '5 days ago', type: 'content' },
  { id: 'act3', text: 'Module 2 grade released — 82%', time: '1 week ago', type: 'grade' },
  { id: 'act4', text: 'Submission deadline set for Apr 4', time: '2 weeks ago', type: 'deadline' },
]

export const mockNotifications = [
  // Deadlines
  { id: 'n1', category: 'deadlines', text: 'Business Case Analysis due in 8 hours', time: 'Just now', read: false },
  { id: 'n2', category: 'deadlines', text: 'Module 3 submission deadline Apr 4', time: '2 days ago', read: true },
  // Submissions
  { id: 'n3', category: 'submissions', text: 'Submission received for Module 2', time: '1 week ago', read: true },
  { id: 'n4', category: 'submissions', text: 'Module 2 evaluation complete', time: '5 days ago', read: true },
  // Announcements
  { id: 'n5', category: 'announcements', text: 'Dr. Sharma: Assignment brief updated', time: '3 days ago', read: false },
  { id: 'n6', category: 'announcements', text: 'Office hours changed to Tue 2-4pm', time: '1 week ago', read: true },
]

export const mockQuickLinks = [
  { label: 'Course materials', href: '#' },
  { label: 'Discussion forum', href: '#' },
  { label: 'Office hours', href: '#' },
]
